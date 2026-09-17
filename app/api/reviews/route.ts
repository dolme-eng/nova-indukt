import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { z } from 'zod'
import { rateLimit, rateLimitResponse, getIP, createRateLimitKey } from '@/lib/rate-limit'
import { logError } from '@/lib/logger'
import { validateCsrfToken } from '@/lib/csrf'
import { verifyRecaptcha } from '@/lib/recaptcha'
import { stripHtml } from '@/lib/utils/sanitize'

const RATE_LIMIT_WINDOW = 60 * 60 * 1000 // 1 hour
const RATE_LIMIT_MAX = 3 // 3 reviews per hour per IP

const reviewSchema = z.object({
  productId: z.string().cuid('Invalid product ID'),
  rating: z.number().int().min(1).max(5),
  title: z.string().min(3).max(100),
  content: z.string().min(10).max(2000),
})

// GET - Fetch reviews for a product
export async function GET(request: NextRequest) {
  try {
    const rl = await rateLimit(createRateLimitKey(getIP(request), 'reviews:get'), { windowMs: 60_000, maxRequests: 120, allowMemoryFallback: true })
    if (!rl.success) return rateLimitResponse(rl)

    const { searchParams } = new URL(request.url)
    const productId = searchParams.get('productId')
    // Unpublished reviews are moderation queue — admin only
    const wantsUnpublished = searchParams.get('published') === 'false'
    if (wantsUnpublished) {
      const { requireAdmin } = await import('@/lib/admin/require-admin')
      const authz = await requireAdmin()
      if (!authz.ok) return NextResponse.json({ error: 'Nicht autorisiert' }, { status: authz.status })
    }
    const published = !wantsUnpublished
    const limit = Math.min(Math.max(parseInt(searchParams.get('limit') || '10', 10) || 10, 1), 50)
    const page = Math.max(parseInt(searchParams.get('page') || '1', 10) || 1, 1)

    if (!productId) {
      return NextResponse.json({ error: 'Produkt-ID erforderlich' }, { status: 400 })
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

    // Calculate average rating from the groupBy result (no extra DB query needed)
    let totalRatings = 0
    let ratingSum = 0
    ratingStats.forEach((stat) => {
      totalRatings += stat._count.rating
      ratingSum += stat.rating * stat._count.rating
    })
    const averageRating = totalRatings > 0 ? ratingSum / totalRatings : 0

    // Build rating distribution
    const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
    ratingStats.forEach((stat) => {
      distribution[stat.rating as 1 | 2 | 3 | 4 | 5] = stat._count.rating
    })

    const response = NextResponse.json({
      reviews: reviews.map((r) => ({
        id: r.id,
        rating: r.rating,
        title: r.title,
        content: r.content,
        verified: r.isVerified,
        status: r.isPublished ? 'approved' : 'pending',
        createdAt: r.createdAt,
        user: r.user
          ? {
              name: r.user.name,
              displayName: r.user.name ? r.user.name.charAt(0) + '****' : 'Kunde',
            }
          : null,
      })),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
      stats: {
        average: Math.round(averageRating * 10) / 10,
        count: totalRatings,
        distribution,
      },
    })
    response.headers.set('Cache-Control', 'private, no-store')
    return response
  } catch (error) {
    logError('Error fetching reviews:', error)
    return NextResponse.json({ error: 'Bewertungen konnten nicht geladen werden' }, { status: 500 })
  }
}

// POST - Create a new review
export async function POST(request: NextRequest) {
  try {
    const csrfError = validateCsrfToken(request)
    if (csrfError) return csrfError

    const recaptchaError = await verifyRecaptcha(request, 'review')
    if (recaptchaError) return recaptchaError

    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Rate limiting
    const ip = getIP(request)
    const key = createRateLimitKey(ip, 'reviews')
    const limitResult = await rateLimit(key, {
      windowMs: RATE_LIMIT_WINDOW,
      maxRequests: RATE_LIMIT_MAX,
    })

    if (!limitResult.success) {
      return NextResponse.json(
        { error: 'Zu viele Bewertungen. Bitte versuchen Sie es später erneut.' },
        { status: 429 }
      )
    }

    const body = await request.json()
    const result = reviewSchema.safeParse(body)

    if (!result.success) {
      return NextResponse.json(
        { error: 'Validierung fehlgeschlagen' },
        { status: 400 }
      )
    }

    const { productId, rating, title: rawTitle, content: rawContent } = result.data
    const title = stripHtml(rawTitle)
    const content = stripHtml(rawContent)

    // Check if product exists (id only)
    const product = await prisma.product.findUnique({
      where: { id: productId },
      select: { id: true },
    })

    if (!product) {
      return NextResponse.json({ error: 'Produkt nicht gefunden' }, { status: 404 })
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
        { error: 'Sie haben dieses Produkt bereits bewertet' },
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

    // Create review (pending approval by default).
    // P2002 guard: if @@unique([userId, productId]) lands, parallel
    // double-submit collapses to 409 instead of 500.
    let review
    try {
      review = await prisma.review.create({
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
    } catch (createError) {
      const { Prisma } = await import('@prisma/client')
      if (
        createError instanceof Prisma.PrismaClientKnownRequestError &&
        createError.code === 'P2002'
      ) {
        return NextResponse.json(
          { error: 'Sie haben dieses Produkt bereits bewertet' },
          { status: 409 }
        )
      }
      throw createError
    }

    // NOTE: reviewCount et rating ne sont PAS mis à jour ici.
    // Ils seront recalculés quand l'admin publie la review (isPublished → true).
    // Cela évite d'afficher un compteur gonflé avec des avis en attente.

    return NextResponse.json(
      {
        success: true,
        message: 'Vielen Dank für Ihre Bewertung! Sie wird nach Prüfung veröffentlicht.',
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
    logError('Error creating review:', error)
    return NextResponse.json({ error: 'Bewertung konnte nicht erstellt werden' }, { status: 500 })
  }
}

// PUT - Mark review as helpful (idempotent: one vote per user per review)
export async function PUT(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const rl = await rateLimit(createRateLimitKey(session.user.id, 'helpful'), {
      windowMs: 60_000,
      maxRequests: 10,
    })
    if (!rl.success) {
      return NextResponse.json(
        { error: 'Zu viele Anfragen. Bitte warten Sie einen Moment.' },
        { status: 429 }
      )
    }

    // CSRF protection
    const csrfError = validateCsrfToken(request)
    if (csrfError) return csrfError

    const { searchParams } = new URL(request.url)
    const reviewId = searchParams.get('id')
    const action = searchParams.get('action')

    if (!reviewId || action !== 'helpful') {
      return NextResponse.json(
        { error: 'Review ID and action=helpful are required' },
        { status: 400 }
      )
    }

    const review = await prisma.review.findUnique({
      where: { id: reviewId },
    })

    if (!review || !review.isPublished) {
      return NextResponse.json({ error: 'Review not found' }, { status: 404 })
    }

    // Check for existing vote — idempotent
    const existingVote = await prisma.reviewHelpfulVote.findUnique({
      where: { userId_reviewId: { userId: session.user.id, reviewId } },
    })

    if (existingVote) {
      return NextResponse.json(
        { error: 'Sie haben diese Bewertung bereits als hilfreich markiert' },
        { status: 409 }
      )
    }

    // Create vote and increment helpful count in a transaction.
    // P2002 = parallel double-vote won the race → idempotent success.
    try {
      const [, updated] = await prisma.$transaction([
        prisma.reviewHelpfulVote.create({
          data: { userId: session.user.id, reviewId },
        }),
        prisma.review.update({
          where: { id: reviewId },
          data: { helpful: { increment: 1 } },
        }),
      ])

      return NextResponse.json({
        success: true,
        helpful: updated.helpful,
      })
    } catch (txError) {
      const { Prisma } = await import('@prisma/client')
      if (
        txError instanceof Prisma.PrismaClientKnownRequestError &&
        txError.code === 'P2002'
      ) {
        const current = await prisma.review.findUnique({
          where: { id: reviewId },
          select: { helpful: true },
        })
        return NextResponse.json({
          success: true,
          helpful: current?.helpful ?? 0,
          deduped: true,
        })
      }
      throw txError
    }
  } catch (error) {
    logError('Error updating review:', error)
    return NextResponse.json({ error: 'Failed to update review' }, { status: 500 })
  }
}
