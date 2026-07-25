import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { logError } from "@/lib/logger"
import { rateLimit, getIP, createRateLimitKey } from "@/lib/rate-limit"

// GET - Fetch published testimonials (reviews with product name + user name)
export async function GET(request: NextRequest) {
  try {
    // Rate limit: 20 requests per minute per IP
    const rl = await rateLimit(createRateLimitKey(getIP(request), 'testimonials'), {
      windowMs: 60_000,
      maxRequests: 20,
    })
    if (!rl.success) {
      return NextResponse.json(
        { error: "Zu viele Anfragen. Bitte versuchen Sie es später erneut." },
        { status: 429 }
      )
    }

    const { searchParams } = new URL(request.url)
    const limit = Math.min(Math.max(parseInt(searchParams.get('limit') || '12', 10) || 12, 1), 50)
    const page = Math.max(parseInt(searchParams.get('page') || '1', 10) || 1, 1)
    const skip = (page - 1) * limit

    const [reviews, total] = await Promise.all([
      prisma.review.findMany({
        where: { isPublished: true },
        include: {
          product: { select: { nameDe: true, slug: true } },
          user: { select: { name: true } },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.review.count({ where: { isPublished: true } }),
    ])

    const testimonials = reviews.map((r) => ({
      id: r.id,
      name: r.user?.name ?? "Kunde",
      rating: r.rating,
      comment: r.content,
      productName: r.product.nameDe,
      createdAt: r.createdAt.toISOString(),
      isVerified: r.isVerified,
    }))

    return NextResponse.json({
      testimonials,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    logError("Error fetching testimonials:", error)
    return NextResponse.json(
      { error: "Failed to fetch testimonials" },
      { status: 500 }
    )
  }
}
