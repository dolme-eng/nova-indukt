import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { rateLimit, getIP, createRateLimitKey } from "@/lib/rate-limit"

const MAX_QUERY_LENGTH = 200

export async function GET(req: NextRequest) {
  try {
    const rl = await rateLimit(createRateLimitKey(getIP(req), "search"), { windowMs: 60_000, maxRequests: 30 })
    if (!rl.success) return NextResponse.json({ error: "Zu viele Anfragen" }, { status: 429 })

    const { searchParams } = new URL(req.url)
    let query = searchParams.get("q")

    if (!query || query.length < 2) {
      return NextResponse.json([])
    }

    if (query.length > MAX_QUERY_LENGTH) {
      query = query.slice(0, MAX_QUERY_LENGTH)
    }

    const products = await prisma.product.findMany({
      where: {
        OR: [
          { nameDe: { contains: query, mode: 'insensitive' } },
          { slug: { contains: query, mode: 'insensitive' } },
          { category: { nameDe: { contains: query, mode: 'insensitive' } } }
        ],
        isActive: true
      },
      select: {
        id: true,
        nameDe: true,
        slug: true,
        price: true,
        images: {
          where: { isMain: true },
          take: 1,
          select: { url: true }
        }
      },
      take: 5
    })

    const formattedResults = products.map(p => ({
      id: p.id,
      name: { de: p.nameDe },
      slug: p.slug,
      price: Number(p.price),
      images: [p.images[0]?.url || '']
    }))

    return NextResponse.json(formattedResults)
  } catch (error) {
    console.error("[SEARCH_API_ERROR]", error)
    return new NextResponse("Internal error", { status: 500 })
  }
}
