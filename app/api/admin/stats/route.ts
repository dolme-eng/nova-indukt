import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const session = await auth()
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

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
        where: { isPublished: false }
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
    ])

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
      recentOrdersList
    })
    response.headers.set("Cache-Control", "no-store")
    return response
  } catch (error) {
    console.error('Error fetching stats:', error)
    return NextResponse.json(
      { error: 'Failed to fetch statistics' },
      { status: 500 }
    )
  }
}
