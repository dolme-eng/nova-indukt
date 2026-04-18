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

    // Commandes
    const totalOrders = await prisma.order.count()
    const recentOrders = await prisma.order.count({
      where: { createdAt: { gte: thirtyDaysAgo } }
    })
    const ordersRevenue = await prisma.order.aggregate({
      where: { status: { not: 'CANCELLED' } },
      _sum: { total: true }
    })

    // Clients
    const totalCustomers = await prisma.user.count({
      where: { role: 'USER' }
    })
    const newCustomers = await prisma.user.count({
      where: { 
        role: 'USER',
        createdAt: { gte: thirtyDaysAgo }
      }
    })

    // Produits
    const totalProducts = await prisma.product.count({
      where: { isActive: true }
    })

    // Avis
    const pendingReviews = await prisma.review.count({
      where: { isApproved: false }
    })

    // Promotions
    const activePromotions = await prisma.promotion.count({
      where: {
        isActive: true,
        startDate: { lte: now },
        endDate: { gte: now }
      }
    })
    const totalPromotions = await prisma.promotion.count()
    const promotionUsage = await prisma.promotion.aggregate({
      _sum: { usageCount: true }
    })

    // Newsletter
    const newsletterSubscribers = await prisma.newsletterSubscriber.count({
      where: { isActive: true }
    })

    return NextResponse.json({
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
      }
    })
  } catch (error) {
    console.error('Error fetching stats:', error)
    return NextResponse.json(
      { error: 'Failed to fetch statistics' },
      { status: 500 }
    )
  }
}
