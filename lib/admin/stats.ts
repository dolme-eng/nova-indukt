import { prisma } from '@/lib/prisma'

export async function getStats() {
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
      where: { createdAt: { gte: thirtyDaysAgo } },
    }),
    prisma.order.aggregate({
      where: {
        status: { not: 'CANCELLED' },
        createdAt: { gte: thirtyDaysAgo },
      },
      _sum: { total: true },
    }),
    prisma.order.findMany({
      take: 4,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        orderNumber: true,
        customerName: true,
        status: true,
        total: true,
        createdAt: true,
      },
    }),
    prisma.user.count({
      where: { role: 'USER' },
    }),
    prisma.user.count({
      where: {
        role: 'USER',
        createdAt: { gte: thirtyDaysAgo },
      },
    }),
    prisma.product.count({
      where: { isActive: true },
    }),
    prisma.review.count({
      where: {
        isPublished: false,
        createdAt: { gte: new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000) },
      },
    }),
    prisma.promotion.count({
      where: {
        isActive: true,
        startDate: { lte: now },
        endDate: { gte: now },
      },
    }),
    prisma.promotion.count(),
    prisma.promotion.aggregate({
      _sum: { usageCount: true },
    }),
    prisma.newsletterSubscriber.count({
      where: { isActive: true },
    }),
    prisma.auditLog.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        action: true,
        entityType: true,
        entityId: true,
        createdAt: true,
      },
    }),
  ])

  return {
    orders: {
      total: totalOrders,
      recent: recentOrders,
      revenue: Number(ordersRevenue._sum.total || 0),
    },
    customers: {
      total: totalCustomers,
      new: newCustomers,
    },
    products: {
      active: totalProducts,
    },
    reviews: {
      pending: pendingReviews,
    },
    promotions: {
      active: activePromotions,
      total: totalPromotions,
      usage: Number(promotionUsage._sum.usageCount || 0),
    },
    newsletter: {
      subscribers: newsletterSubscribers,
    },
    recentOrdersList: recentOrdersList.map((o) => ({
      ...o,
      total: Number(o.total),
      createdAt: o.createdAt.toISOString(),
    })),
    recentActivity: recentActivity.map((a) => ({
      ...a,
      createdAt: a.createdAt.toISOString(),
    })),
  }
}
