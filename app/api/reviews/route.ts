import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { z } from "zod"
import { rateLimit, getIP, createRateLimitKey } from "@/lib/rate-limit"

const RATE_LIMIT_WINDOW = 60 * 60 * 1000 // 1 hour
const RATE_LIMIT_MAX = 3 // 3 reviews per hour per IP

const reviewSchema = z.object({
  productId: z.string(),
  rating: z.number().min(1).max(5),
  title: z.string().min(3).max(100),
  content: z.string().min(10).max(2000),
})

// GET - Fetch reviews for a product
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const productId = searchParams.get('productId')
    const published = searchParams.get('published') !== 'false'
    const limit = parseInt(searchParams.get('limit') || '10')
    const page = parseInt(searchParams.get('page') || '1')
    
    if (!productId) {
      return NextResponse.json(
        { error: "Product ID is required" },
        { status: 400 }
      )
    }
    
    const skip = (page - 1) * limit
    
    const [reviews, total, ratingStats] = await Promise.all([
      prisma.review.findMany({
        where: {
          productId,
          isPublished: published,
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.review.count({
        where: {
          productId,
          isPublished: published,
        },
      }),
      prisma.review.groupBy({
        by: ['rating'],
        where: {
          productId,
          isPublished: true,
        },
        _count: {
          rating: true,
        },
      }),
    ])
    
    // Calculate average rating
    const allApprovedReviews = await prisma.review.findMany({
      where: {
        productId,
        isPublished: true,
      },
      select: { rating: true },
    })
    
    const averageRating = allApprovedReviews.length > 0
      ? allApprovedReviews.reduce((sum, r) => sum + r.rating, 0) / allApprovedReviews.length
      : 0
    
    // Build rating distribution
    const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
    ratingStats.forEach(stat => {
      distribution[stat.rating as 1 | 2 | 3 | 4 | 5] = stat._count.rating
    })
    
    return NextResponse.json({
      reviews: reviews.map(r => ({
        id: r.id,
        rating: r.rating,
        title: r.title,
        content: r.content,
        verified: r.isVerified,
        status: r.isPublished ? 'approved' : 'pending',
        createdAt: r.createdAt,
        user: r.user ? {
          id: r.user.id,
          name: r.user.name,
          displayName: r.user.name ? r.user.name.charAt(0) + '****' : 'Kunde',
        } : null,
      })),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
      stats: {
        average: Math.round(averageRating * 10) / 10,
        count: allApprovedReviews.length,
        distribution,
      },
    })
  } catch (error) {
    console.error("Error fetching reviews:", error)
    return NextResponse.json(
      { error: "Failed to fetch reviews" },
      { status: 500 }
    )
  }
}

// POST - Create a new review
export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }
    
    // Rate limiting
    const ip = getIP(request)
    const key = createRateLimitKey(ip, 'reviews')
    const limitResult = rateLimit(key, {
      windowMs: RATE_LIMIT_WINDOW,
      maxRequests: RATE_LIMIT_MAX,
    })
    
    if (!limitResult.success) {
      return NextResponse.json(
        { error: "Zu viele Bewertungen. Bitte versuchen Sie es später erneut." },
        { status: 429 }
      )
    }
    
    const body = await request.json()
    const result = reviewSchema.safeParse(body)
    
    if (!result.success) {
      return NextResponse.json(
        { error: "Validation failed", details: result.error.flatten() },
        { status: 400 }
      )
    }
    
    const { productId, rating, title, content } = result.data
    
    // Check if product exists
    const product = await prisma.product.findUnique({
      where: { id: productId },
    })
    
    if (!product) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      )
    }
    
    // Check if user already reviewed this product
    const existingReview = await prisma.review.findFirst({
      where: {
        userId: session.user.id,
        productId,
      },
    })
    
    if (existingReview) {
      return NextResponse.json(
        { error: "Sie haben dieses Produkt bereits bewertet" },
        { status: 409 }
      )
    }
    
    // Check if user has purchased this product (verified purchase)
    const hasPurchased = await prisma.orderItem.findFirst({
      where: {
        productId,
        order: {
          userId: session.user.id,
          status: {
            in: ['DELIVERED', 'SHIPPED', 'PROCESSING'],
          },
        },
      },
    })
    
    // Create review (pending approval by default)
    const review = await prisma.review.create({
      data: {
        userId: session.user.id,
        productId,
        rating,
        title,
        content,
        isVerified: !!hasPurchased,
        isPublished: false,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    })
    
    // Update product rating if needed
    const approvedReviews = await prisma.review.findMany({
      where: {
        productId,
        isPublished: true,
      },
      select: { rating: true },
    })
    
    const newAverage = approvedReviews.length > 0
      ? approvedReviews.reduce((sum, r) => sum + r.rating, 0) / approvedReviews.length
      : rating
      
    await prisma.product.update({
      where: { id: productId },
      data: {
        rating: newAverage,
        reviewCount: { increment: 1 },
      },
    })
    
    return NextResponse.json(
      {
        success: true,
        message: "Vielen Dank für Ihre Bewertung! Sie wird nach Prüfung veröffentlicht.",
        review: {
          id: review.id,
          rating: review.rating,
          title: review.title,
          content: review.content,
          verified: review.isVerified,
          status: review.isPublished ? 'approved' : 'pending',
          createdAt: review.createdAt,
        },
      },
      { status: 201 }
    )
  } catch (error) {
    console.error("Error creating review:", error)
    return NextResponse.json(
      { error: "Failed to create review" },
      { status: 500 }
    )
  }
}

// PUT has been replaced with a toggle in admin route
export async function PUT(request: NextRequest) {
  return NextResponse.json({ error: "Not Implemented" }, { status: 400 })
}
