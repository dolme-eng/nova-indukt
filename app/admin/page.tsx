'use client'

import React, { useEffect, useState } from 'react'
import {
  TrendingUp,
  Users,
  ShoppingCart,
  Package,
  ArrowUpRight,
  ArrowDownRight,
  Tag,
  Mail,
  Star,
  ChevronRight,
  Banknote,
  User,
  Loader2,
  Clock,
  Activity,
} from 'lucide-react'
import Link from 'next/link'
import { formatPriceDe } from '@/lib/utils/vat'
import { logError } from '@/lib/logger'

interface Stats {
  orders: { total: number; recent: number; revenue: number }
  customers: { total: number; new: number }
  products: { active: number }
  reviews: { pending: number }
  promotions: { active: number; total: number; usage: number }
  newsletter: { subscribers: number }
  recentOrdersList: {
    id: string
    orderNumber: string
    customerName: string
    status: string
    total: number
    createdAt: string
  }[]
  recentActivity?: {
    id: string
    action: string
    entityType: string
    entityId: string
    createdAt: string
  }[]
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)
  const [activityLimit, setActivityLimit] = useState(5)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/admin/stats')
      if (response.ok) {
        const data = await response.json()
        setStats(data)
      }
    } catch (error) {
      logError('Error fetching stats:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="space-y-4 text-center">
          <Loader2 className="mx-auto h-10 w-10 animate-spin text-nova-400" />
          <p className="text-sm font-black uppercase tracking-widest text-nova-300/60">Laden...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-3xl font-black tracking-tight text-nova-900">
            Dashboard
          </h1>
          <p className="mt-1 font-medium text-nova-400">
            Willkommen im NOVA INDUKT Administrationsbereich.
          </p>
        </div>
        <div className="hidden items-center gap-2 rounded-2xl bg-nova-900 px-4 py-2 sm:flex">
          <div className="h-2 w-2 animate-pulse rounded-full bg-nova-400" />
          <span className="text-xs font-black uppercase tracking-widest text-nova-400">Live</span>
        </div>
      </div>

      {/* Primary Stats */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Umsatz"
          value={formatPriceDe(stats?.orders.revenue || 0)}
          change={`${stats?.orders.recent || 0} diesen Monat`}
          isPositive={true}
          icon={<TrendingUp className="text-nova-400" size={24} />}
        />
        <StatCard
          title="Bestellungen"
          value={(stats?.orders.total || 0).toString()}
          change={`${stats?.orders.recent || 0} diesen Monat`}
          isPositive={true}
          icon={<ShoppingCart className="text-nova-400" size={24} />}
        />
        <StatCard
          title="Kunden"
          value={(stats?.customers.total || 0).toString()}
          change={`+${stats?.customers.new || 0} diesen Monat`}
          isPositive={true}
          icon={<Users className="text-nova-400" size={24} />}
        />
        <StatCard
          title="Aktive Produkte"
          value={(stats?.products.active || 0).toString()}
          change="online"
          isPositive={true}
          icon={<Package className="text-nova-400" size={24} />}
        />
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <Link href="/admin/promotions">
          <StatCard
            title="Aktive Aktionen"
            value={(stats?.promotions.active || 0).toString()}
            change={`${stats?.promotions.total || 0} gesamt`}
            isPositive={true}
            icon={<Tag className="text-nova-400" size={24} />}
          />
        </Link>
        <Link href="/admin/newsletter">
          <StatCard
            title="Newsletter-Abonnenten"
            value={(stats?.newsletter.subscribers || 0).toString()}
            change="aktiv"
            isPositive={true}
            icon={<Mail className="text-nova-400" size={24} />}
          />
        </Link>
        <Link href="/admin/reviews">
          <StatCard
            title="Bewertungen"
            value={(stats?.reviews.pending || 0).toString()}
            change="ausstehend"
            isPositive={stats?.reviews.pending === 0}
            icon={<Star className="text-nova-400" size={24} />}
          />
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Recent Orders */}
        <div className="overflow-hidden rounded-3xl border border-nova-100 bg-white shadow-xl shadow-nova-900/5 lg:col-span-2">
          <div className="flex items-center justify-between border-b border-nova-100 p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-nova-900">
                <ShoppingCart className="text-nova-400" size={18} />
              </div>
              <h2 className="font-heading text-lg font-black text-nova-900">Neue Bestellungen</h2>
            </div>
            <Link
              href="/admin/orders"
              className="flex items-center gap-1 text-xs font-black uppercase tracking-widest text-nova-500 transition-colors hover:text-nova-600"
            >
              Alle ansehen <ChevronRight size={14} />
            </Link>
          </div>
          <div className="overflow-x-auto">
            {!stats?.recentOrdersList ? (
              <div className="p-8 text-center font-medium text-nova-300">Laden...</div>
            ) : stats.recentOrdersList.length === 0 ? (
              <div className="p-12 text-center">
                <ShoppingCart className="mx-auto mb-3 h-10 w-10 text-nova-200" />
                <p className="font-medium text-nova-300">Keine Bestellungen vorhanden.</p>
              </div>
            ) : (
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-nova-50/50 text-[10px] font-black uppercase tracking-[0.2em] text-nova-400">
                    <th className="px-6 py-4">Bestellung</th>
                    <th className="px-6 py-4">Kunde</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Betrag</th>
                    <th className="px-6 py-4">Datum</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-nova-50">
                  {stats.recentOrdersList.map((order) => {
                    const getStatusTranslation = (status: string) => {
                      const map: Record<string, string> = {
                        PENDING: 'Ausstehend',
                        PROCESSING: 'In Bearbeitung',
                        SHIPPED: 'Versendet',
                        DELIVERED: 'Zugestellt',
                        CANCELLED: 'Storniert',
                        REFUNDED: 'Erstattet',
                      }
                      return map[status] || status
                    }
                    const getStatusColor = (status: string) => {
                      switch (status) {
                        case 'PENDING':
                          return 'bg-amber-50 text-amber-700 border border-amber-100'
                        case 'PROCESSING':
                          return 'bg-blue-50 text-blue-700 border border-blue-100'
                        case 'SHIPPED':
                          return 'bg-indigo-50 text-indigo-700 border border-indigo-100'
                        case 'DELIVERED':
                          return 'bg-nova-50 text-nova-700 border border-nova-100'
                        case 'CANCELLED':
                        case 'REFUNDED':
                          return 'bg-red-50 text-red-700 border border-red-100'
                        default:
                          return 'bg-nova-50 text-nova-700 border border-nova-100'
                      }
                    }
                    return (
                      <OrderRow
                        key={order.orderNumber}
                        orderId={order.id}
                        orderNumber={order.orderNumber}
                        customer={order.customerName}
                        status={getStatusTranslation(order.status)}
                        statusColor={getStatusColor(order.status)}
                        amount={formatPriceDe(order.total)}
                        date={new Date(order.createdAt).toLocaleDateString('de-DE')}
                      />
                    )
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Activity Feed */}
        <div className="overflow-hidden rounded-3xl border border-nova-100 bg-white shadow-xl shadow-nova-900/5">
          <div className="flex items-center gap-3 border-b border-nova-100 p-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-nova-900">
              <Activity className="text-nova-400" size={18} />
            </div>
            <h2 className="font-heading text-lg font-black text-nova-900">Letzte Aktivitäten</h2>
          </div>
          <div className="space-y-4 p-6">
            {stats?.recentActivity && stats.recentActivity.length > 0 ? (
              stats.recentActivity.slice(0, activityLimit).map((log) => {
                let icon = <Clock className="text-nova-400" size={16} />
                if (log.entityType === 'ORDER')
                  icon = <Banknote className="text-nova-400" size={16} />
                if (log.entityType === 'USER') icon = <User className="text-nova-400" size={16} />
                if (log.entityType === 'PRODUCT')
                  icon = <Package className="text-nova-400" size={16} />

                const diffMs = Date.now() - new Date(log.createdAt).getTime()
                const diffMins = Math.floor(diffMs / 60000)
                const diffHours = Math.floor(diffMins / 60)
                const diffDays = Math.floor(diffHours / 24)

                let timeStr = `${diffMins}min`
                if (diffDays > 0) timeStr = `${diffDays}d`
                else if (diffHours > 0) timeStr = `${diffHours}h`

                return (
                  <ActivityItem
                    key={log.id}
                    icon={icon}
                    title={`${log.action} ${log.entityType}`}
                    description={`ID: ${log.entityId}`}
                    time={timeStr}
                  />
                )
              })
            ) : (
              <div className="py-8 text-center">
                <Activity className="mx-auto mb-3 h-8 w-8 text-nova-200" />
                <p className="text-sm font-medium text-nova-300">Keine aktuellen Aktivitäten.</p>
              </div>
            )}
          </div>
          <div className="border-t border-nova-100 bg-nova-50/50 p-4 text-center">
            {stats?.recentActivity && activityLimit < stats.recentActivity.length ? (
              <button
                onClick={() => setActivityLimit((prev) => prev + 10)}
                className="text-xs font-black uppercase tracking-widest text-nova-400 transition-colors hover:text-nova-600"
              >
                Mehr laden
              </button>
            ) : (
              <span className="text-xs uppercase tracking-widest text-nova-300">
                Alle Aktivitäten geladen
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function StatCard({
  title,
  value,
  change,
  isPositive,
  icon,
  className = '',
}: {
  title: string
  value: string
  change: string
  isPositive: boolean
  icon: React.ReactNode
  className?: string
}) {
  return (
    <div
      className={`group relative cursor-default overflow-hidden rounded-3xl border border-nova-100 bg-white p-8 shadow-xl shadow-nova-900/5 transition-all hover:-translate-y-0.5 hover:shadow-nova-900/10 ${className}`}
    >
      <div className="absolute right-0 top-0 -mr-16 -mt-16 h-32 w-32 rounded-full bg-nova-50 transition-transform duration-500 group-hover:scale-110" />
      <div className="relative z-10">
        <div className="mb-6 flex items-center justify-between">
          <div className="rounded-2xl bg-nova-900 p-4 text-nova-400 shadow-lg shadow-nova-900/20 transition-transform group-hover:scale-110">
            {icon}
          </div>
          <div
            className={`flex items-center gap-1 rounded-full px-3 py-1.5 text-[10px] font-black uppercase tracking-wider ${
              isPositive
                ? 'border border-nova-100 bg-nova-50 text-nova-600'
                : 'border border-red-100 bg-red-50 text-red-600'
            }`}
          >
            {isPositive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
            {change}
          </div>
        </div>
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-nova-300">{title}</p>
          <h3 className="mt-2 font-heading text-3xl font-black tracking-tight text-nova-900">
            {value}
          </h3>
        </div>
      </div>
    </div>
  )
}

function OrderRow({
  orderId,
  orderNumber,
  customer,
  status,
  statusColor,
  amount,
  date,
}: {
  orderId: string
  orderNumber: string
  customer: string
  status: string
  statusColor: string
  amount: string
  date: string
}) {
  return (
    <tr className="group cursor-pointer transition-colors hover:bg-nova-50/30">
      <td className="px-6 py-4">
        <Link
          href={`/admin/orders/${orderId}`}
          className="font-mono text-xs font-black text-nova-900 transition-colors hover:text-nova-600"
        >
          {orderNumber}
        </Link>
      </td>
      <td className="px-6 py-4 text-sm font-medium text-nova-600">{customer}</td>
      <td className="px-6 py-4">
        <span className={`rounded-lg px-2.5 py-0.5 text-xs font-bold ${statusColor}`}>
          {status}
        </span>
      </td>
      <td className="px-6 py-4 text-sm font-black text-nova-900">{amount}</td>
      <td className="px-6 py-4 text-xs font-semibold text-nova-400">{date}</td>
    </tr>
  )
}

function ActivityItem({
  icon,
  title,
  description,
  time,
}: {
  icon: React.ReactNode
  title: string
  description: string
  time: string
}) {
  return (
    <div className="group flex gap-3 rounded-2xl p-3 transition-colors hover:bg-nova-50/50">
      <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl bg-nova-900 transition-transform group-hover:scale-105">
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-bold text-nova-900">{title}</p>
        <p className="mt-0.5 truncate text-xs text-nova-400">{description}</p>
      </div>
      <div className="flex-shrink-0 text-[10px] font-black uppercase tracking-wider text-nova-300">
        {time}
      </div>
    </div>
  )
}
