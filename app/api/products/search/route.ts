import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const query = searchParams.get("q")

    if (!query || query.length < 2) {
      return NextResponse.json([])
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
