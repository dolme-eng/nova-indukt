import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { rateLimit, getIP, createRateLimitKey } from "@/lib/rate-limit"

export async function GET(request: NextRequest) {
  try {
    const rl = await rateLimit(createRateLimitKey(getIP(request), "products"), { windowMs: 60_000, maxRequests: 30 })
    if (!rl.success) return NextResponse.json({ error: "Zu viele Anfragen" }, { status: 429 })

    const { searchParams } = new URL(request.url)
    
    const category = searchParams.get("category")
    const search = searchParams.get("search")?.trim()
    const minPrice = searchParams.get("minPrice")
    const maxPrice = searchParams.get("maxPrice")
    const sortBy = searchParams.get("sortBy") || "newest"
    const rawPage = Number.parseInt(searchParams.get("page") || "1", 10)
    const rawLimit = Number.parseInt(searchParams.get("limit") || "12", 10)
    const page = Number.isFinite(rawPage) ? Math.max(rawPage, 1) : 1
    const limit = Number.isFinite(rawLimit) ? Math.min(Math.max(rawLimit, 1), 36) : 12
    
    const where: any = { isActive: true }
    
    if (category && category !== "all") {
      where.category = {
        slug: category
      }
    }
    
    if (search && search.length >= 2) {
      where.OR = [
        { nameDe: { contains: search, mode: "insensitive" } },
        { descriptionDe: { contains: search, mode: "insensitive" } }
      ]
    }
    
    if (minPrice || maxPrice) {
      where.price = {}
      if (minPrice) where.price.gte = parseFloat(minPrice)
      if (maxPrice) where.price.lte = parseFloat(maxPrice)
    }
    
    const orderBy: any = {}
    switch (sortBy) {
      case "price-asc":
        orderBy.price = "asc"
        break
      case "price-desc":
        orderBy.price = "desc"
        break
      case "name":
        orderBy.nameDe = "asc"
        break
      default:
        orderBy.createdAt = "desc"
    }
    
    const skip = (page - 1) * limit
    
    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          category: true,
          images: true
        },
        orderBy,
        skip,
        take: limit
      }),
      prisma.product.count({ where })
    ])
    
    const response = NextResponse.json({
      products: products.map(product => ({
        ...product,
        price: Number(product.price),
        oldPrice: product.oldPrice ? Number(product.oldPrice) : null,
        costPrice: product.costPrice ? Number(product.costPrice) : null
      })),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    })

    const hasDynamicFilters = Boolean(search || minPrice || maxPrice)
    const cachePolicy = hasDynamicFilters
      ? "public, s-maxage=30, stale-while-revalidate=120"
      : "public, s-maxage=90, stale-while-revalidate=300"
    response.headers.set("Cache-Control", cachePolicy)

    return response
  } catch (error) {
    console.error("Error fetching products:", error)
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    )
  }
}
