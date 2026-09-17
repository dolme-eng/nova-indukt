import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { Prisma } from '@prisma/client'
import { rateLimit, rateLimitResponse, getIP, createRateLimitKey } from '@/lib/rate-limit'
import { logError } from '@/lib/logger'

export async function GET(request: NextRequest) {
  try {
    const rl = await rateLimit(createRateLimitKey(getIP(request), 'promotions:list'), { windowMs: 60_000, maxRequests: 30, allowMemoryFallback: true })
    if (!rl.success) return rateLimitResponse(rl)

    const { searchParams } = new URL(request.url)
    const productId = searchParams.get('productId')
    const categoryId = searchParams.get('categoryId')
    const includeExpiredRequested = searchParams.get('includeExpired') === 'true'
    let includeExpired = false
    if (includeExpiredRequested) {
      const session = await auth()
      includeExpired = Boolean(session?.user && session.user.role === 'ADMIN')
    }
    
    const now = new Date()
    
    const where: Prisma.PromotionWhereInput = {}
    
    if (!includeExpired) {
      where.isActive = true
      // Inclusive bounds everywhere: active while startDate <= now <= endDate
      where.startDate = { lte: now }
      where.endDate = { gte: now }
    }
    
    if (productId || categoryId) {
      const orConditions: Prisma.PromotionWhereInput[] = [{ isGlobal: true }]
      if (productId) orConditions.push({ productIds: { has: productId } })
      if (categoryId) orConditions.push({ categoryIds: { has: categoryId } })
      where.OR = orConditions
    }
    
    const promotions = await prisma.promotion.findMany({
      where,
      orderBy: [
        { discountValue: 'desc' },
        { endDate: 'asc' },
      ],
      select: {
        name: true,
        description: true,
        discountType: true,
        discountValue: true,
        isGlobal: true,
        startDate: true,
        endDate: true,
        minOrderAmount: true,
        maxDiscount: true,
        badge: true,
        bannerText: true,
        highlightColor: true,
      },
    })

    const response = NextResponse.json(promotions)
    response.headers.set(
      "Cache-Control",
      includeExpired ? "no-store" : "public, s-maxage=60, stale-while-revalidate=300"
    )
    return response
  } catch (error) {
    logError('Error fetching promotions:', error)
    return NextResponse.json(
      { error: 'Failed to fetch promotions' },
      { status: 500 }
    )
  }
}

// NOTE: no POST here — promotion writes live exclusively under
// /api/admin/promotions (single schema: createPromotionAdminSchema).
// A second create route with a divergent schema existed here and was removed.

