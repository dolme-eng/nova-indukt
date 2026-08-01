import { Suspense } from 'react'
import { redirect } from 'next/navigation'
import { requireAdmin } from '@/lib/admin/require-admin'
import { prisma } from '@/lib/prisma'
import { formatPriceDe } from '@/lib/utils/vat'
import { DashboardContent } from './_components/dashboard-content'

async function getStats() {
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
      where: { status: { not: 'CANCELLED' } },
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

function DashboardSkeleton() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <div className="h-9 w-48 animate-pulse rounded bg-nova-100" />
          <div className="mt-2 h-4 w-72 animate-pulse rounded bg-nova-50" />
        </div>
      </div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-40 animate-pulse rounded-3xl bg-nova-50" />
        ))}
      </div>
    </div>
  )
}

export default async function AdminDashboardPage() {
  const authz = await requireAdmin()
  if (!authz.ok) redirect('/anmelden')

  const stats = await getStats()

  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <DashboardContent stats={stats} />
    </Suspense>
  )
}
