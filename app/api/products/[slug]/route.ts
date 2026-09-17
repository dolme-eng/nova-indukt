import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { rateLimit, rateLimitResponse, getIP, createRateLimitKey } from "@/lib/rate-limit"
import { logError } from "@/lib/logger"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const rl = await rateLimit(createRateLimitKey(getIP(request), "products:slug"), { windowMs: 60_000, maxRequests: 40, allowMemoryFallback: true })
    if (!rl.success) return rateLimitResponse(rl)

    const { slug } = await params
    
    const product = await prisma.product.findUnique({
      where: { slug },
      include: {
        category: true,
        images: true
      }
    })

    // Inactive/hidden products must not be enumerable via public API
    if (!product || !product.isActive) {
      return NextResponse.json(
        { error: "Produkt nicht gefunden" },
        { status: 404 }
      )
    }

    const [reviews, totalReviews] = await Promise.all([
      prisma.review.findMany({
        where: { productId: product.id, isPublished: true },
        include: { user: { select: { name: true, image: true } } },
        orderBy: { createdAt: 'desc' },
        take: 20
      }),
      prisma.review.count({
        where: { productId: product.id, isPublished: true }
      })
    ])
    
    // Strip internal fields (costPrice, supplierSku) — never expose to public
    const { costPrice, supplierSku, ...publicProduct } = product
    void costPrice
    void supplierSku
    const response = NextResponse.json({
      ...publicProduct,
      price: Number(product.price),
      oldPrice: product.oldPrice ? Number(product.oldPrice) : null,
      reviews: reviews.map(review => ({
        ...review,
        rating: Number(review.rating)
      })),
      totalReviews
    })
    response.headers.set("Cache-Control", "public, s-maxage=120, stale-while-revalidate=600")
    return response
  } catch (error) {
    logError("Error fetching product:", error)
    return NextResponse.json(
      { error: "Failed to fetch product" },
      { status: 500 }
    )
  }
}
