import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/admin/require-admin'
import { auditLog } from '@/lib/admin/audit'
import { rateLimit, getIP, createRateLimitKey } from '@/lib/rate-limit'

export async function GET(req: NextRequest) {
  const authz = await requireAdmin()
  if (!authz.ok) return NextResponse.json({ error: 'Unauthorized' }, { status: authz.status })

  const rl = await rateLimit(createRateLimitKey(getIP(req), 'admin:stats'), { windowMs: 60_000, maxRequests: 10 })
  if (!rl.success) return NextResponse.json({ error: 'Zu viele Anfragen' }, { status: 429 })

  const now = new Date()
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)

  const [
    totalOrders,
    recentOrders,
    ordersRevenue,
    recentOrdersList,
    totalCustomers,
    newCustomers,
    totalProducts,
    pendingReviews,
    activePromotions,
    totalPromotions,
    promotionUsage,
    newsletterSubscribers,
    recentActivity,
  ] = await Promise.all([
    prisma.order.count(),
    prisma.order.count({
      where: { createdAt: { gte: thirtyDaysAgo } }
    }),
    prisma.order.aggregate({
      where: { status: { not: 'CANCELLED' } },
      _sum: { total: true }
    }),
    prisma.order.findMany({
      take: 4,
      orderBy: { createdAt: 'desc' },
      select: {
        orderNumber: true,
        customerName: true,
        status: true,
        total: true,
        createdAt: true
      }
    }),
    prisma.user.count({
      where: { role: 'USER' }
    }),
    prisma.user.count({
      where: {
        role: 'USER',
        createdAt: { gte: thirtyDaysAgo }
      }
    }),
    prisma.product.count({
      where: { isActive: true }
    }),
    prisma.review.count({
      where: {
        isPublished: false,
        createdAt: { gte: new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000) }
      }
    }),
    prisma.promotion.count({
      where: {
        isActive: true,
        startDate: { lte: now },
        endDate: { gte: now }
      }
    }),
    prisma.promotion.count(),
    prisma.promotion.aggregate({
      _sum: { usageCount: true }
    }),
    prisma.newsletterSubscriber.count({
      where: { isActive: true }
    }),
    prisma.auditLog.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        action: true,
        entityType: true,
        entityId: true,
        createdAt: true
      }
    })
  ])

  await auditLog({
    action: "READ",
    entityType: "Stats",
    entityId: "dashboard",
    userId: authz.session.user.id,
    newValues: { totalOrders, recentOrders, totalCustomers },
    ipAddress: req.headers.get("x-forwarded-for"),
    userAgent: req.headers.get("user-agent"),
  })

  const response = NextResponse.json({
    orders: {
      total: totalOrders,
      recent: recentOrders,
      revenue: ordersRevenue._sum.total || 0
    },
    customers: {
      total: totalCustomers,
      new: newCustomers
    },
    products: {
      active: totalProducts
    },
    reviews: {
      pending: pendingReviews
    },
    promotions: {
      active: activePromotions,
      total: totalPromotions,
      usage: promotionUsage._sum.usageCount || 0
    },
    newsletter: {
      subscribers: newsletterSubscribers
    },
    recentOrdersList,
    recentActivity
  })
  response.headers.set("Cache-Control", "no-store")
  return response
}
