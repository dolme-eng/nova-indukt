import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { rateLimit, getIP, createRateLimitKey } from "@/lib/rate-limit"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const rl = await rateLimit(createRateLimitKey(getIP(request), "products:slug"), { windowMs: 60_000, maxRequests: 40 })
    if (!rl.success) return NextResponse.json({ error: "Zu viele Anfragen" }, { status: 429 })

    const { slug } = await params
    
    const product = await prisma.product.findUnique({
      where: { slug },
      include: {
        category: true,
        images: true,
        reviews: {
          include: {
            user: {
              select: {
                name: true
              }
            }
          },
          orderBy: {
            createdAt: "desc"
          }
        }
      }
    })
    
    if (!product) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      )
    }
    
    const response = NextResponse.json({
      ...product,
      price: Number(product.price),
      oldPrice: product.oldPrice ? Number(product.oldPrice) : null,
      costPrice: product.costPrice ? Number(product.costPrice) : null,
      reviews: product.reviews.map(review => ({
        ...review,
        rating: Number(review.rating)
      }))
    })
    response.headers.set("Cache-Control", "public, s-maxage=120, stale-while-revalidate=600")
    return response
  } catch (error) {
    console.error("Error fetching product:", error)
    return NextResponse.json(
      { error: "Failed to fetch product" },
      { status: 500 }
    )
  }
}
