'use client'

import React, { useEffect, useState } from "react"
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
  Activity
} from "lucide-react"
import Link from "next/link"
import { formatPriceDe } from "@/lib/utils/vat"

interface Stats {
  orders: { total: number; recent: number; revenue: number }
  customers: { total: number; new: number }
  products: { active: number }
  reviews: { pending: number }
  promotions: { active: number; total: number; usage: number }
  newsletter: { subscribers: number }
  recentOrdersList: {
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
      console.error('Error fetching stats:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center space-y-4">
          <Loader2 className="w-10 h-10 animate-spin text-nova-400 mx-auto" />
          <p className="text-nova-300/60 text-sm font-black uppercase tracking-widest">Laden...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-nova-900 font-heading tracking-tight">Dashboard</h1>
          <p className="text-nova-400 mt-1 font-medium">Willkommen im NOVA INDUKT Administrationsbereich.</p>
        </div>
        <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-nova-900 rounded-2xl">
          <div className="w-2 h-2 bg-nova-400 rounded-full animate-pulse" />
          <span className="text-nova-400 text-xs font-black uppercase tracking-widest">Live</span>
        </div>
      </div>

      {/* Primary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Orders */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-nova-100 shadow-xl shadow-nova-900/5 overflow-hidden">
          <div className="p-6 border-b border-nova-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-nova-900 rounded-2xl flex items-center justify-center">
                <ShoppingCart className="text-nova-400" size={18} />
              </div>
              <h2 className="text-lg font-black text-nova-900 font-heading">Neue Bestellungen</h2>
            </div>
            <Link href="/admin/orders" className="text-xs font-black text-nova-500 hover:text-nova-600 flex items-center gap-1 uppercase tracking-widest transition-colors">
              Alle ansehen <ChevronRight size={14} />
            </Link>
          </div>
          <div className="overflow-x-auto">
            {!stats?.recentOrdersList ? (
              <div className="p-8 text-center text-nova-300 font-medium">Laden...</div>
            ) : stats.recentOrdersList.length === 0 ? (
              <div className="p-12 text-center">
                <ShoppingCart className="w-10 h-10 text-nova-200 mx-auto mb-3" />
                <p className="text-nova-300 font-medium">Keine Bestellungen vorhanden.</p>
              </div>
            ) : (
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-nova-50/50 text-nova-400 text-[10px] uppercase tracking-[0.2em] font-black">
                    <th className="px-6 py-4">Bestellung</th>
                    <th className="px-6 py-4">Kunde</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Betrag</th>
                    <th className="px-6 py-4">Datum</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-nova-50">
                  {stats.recentOrdersList.map(order => {
                    const getStatusTranslation = (status: string) => {
                      const map: Record<string, string> = {
                        PENDING: "Ausstehend", PROCESSING: "In Bearbeitung", SHIPPED: "Versendet",
                        DELIVERED: "Zugestellt", CANCELLED: "Storniert", REFUNDED: "Erstattet"
                      }
                      return map[status] || status
                    }
                    const getStatusColor = (status: string) => {
                      switch (status) {
                        case 'PENDING': return 'bg-amber-50 text-amber-700 border border-amber-100'
                        case 'PROCESSING': return 'bg-blue-50 text-blue-700 border border-blue-100'
                        case 'SHIPPED': return 'bg-indigo-50 text-indigo-700 border border-indigo-100'
                        case 'DELIVERED': return 'bg-nova-50 text-nova-700 border border-nova-100'
                        case 'CANCELLED': 
                        case 'REFUNDED': return 'bg-red-50 text-red-700 border border-red-100'
                        default: return 'bg-nova-50 text-nova-700 border border-nova-100'
                      }
                    }
                    return (
                      <OrderRow 
                        key={order.orderNumber}
                        id={order.orderNumber} 
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
        <div className="bg-white rounded-3xl border border-nova-100 shadow-xl shadow-nova-900/5 overflow-hidden">
          <div className="p-6 border-b border-nova-100 flex items-center gap-3">
            <div className="w-10 h-10 bg-nova-900 rounded-2xl flex items-center justify-center">
              <Activity className="text-nova-400" size={18} />
            </div>
            <h2 className="text-lg font-black text-nova-900 font-heading">Letzte Aktivitäten</h2>
          </div>
          <div className="p-6 space-y-4">
            {stats?.recentActivity && stats.recentActivity.length > 0 ? (
              stats.recentActivity.map(log => {
                let icon = <Clock className="text-nova-400" size={16} />
                if (log.entityType === 'ORDER') icon = <Banknote className="text-nova-400" size={16} />
                if (log.entityType === 'USER') icon = <User className="text-nova-400" size={16} />
                if (log.entityType === 'PRODUCT') icon = <Package className="text-nova-400" size={16} />

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
                <Activity className="w-8 h-8 text-nova-200 mx-auto mb-3" />
                <p className="text-nova-300 text-sm font-medium">Keine aktuellen Aktivitäten.</p>
              </div>
            )}
          </div>
          <div className="p-4 bg-nova-50/50 border-t border-nova-100 text-center">
            <button className="text-xs font-black text-nova-400 hover:text-nova-600 uppercase tracking-widest transition-colors">
              Mehr laden
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function StatCard({ title, value, change, isPositive, icon, className = '' }: { 
  title: string, 
  value: string, 
  change: string, 
  isPositive: boolean,
  icon: React.ReactNode,
  className?: string
}) {
  return (
    <div className={`bg-white p-8 rounded-3xl border border-nova-100 shadow-xl shadow-nova-900/5 hover:shadow-nova-900/10 hover:-translate-y-0.5 transition-all group relative overflow-hidden cursor-default ${className}`}>
      <div className="absolute top-0 right-0 w-32 h-32 bg-nova-50 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform duration-500" />
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-6">
          <div className="p-4 bg-nova-900 text-nova-400 rounded-2xl shadow-lg shadow-nova-900/20 group-hover:scale-110 transition-transform">
            {icon}
          </div>
          <div className={`flex items-center gap-1 text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-wider ${
            isPositive ? "bg-nova-50 text-nova-600 border border-nova-100" : "bg-red-50 text-red-600 border border-red-100"
          }`}>
            {isPositive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
            {change}
          </div>
        </div>
        <div>
          <p className="text-[10px] font-black text-nova-300 uppercase tracking-[0.2em]">{title}</p>
          <h3 className="text-3xl font-black text-nova-900 mt-2 font-heading tracking-tight">{value}</h3>
        </div>
      </div>
    </div>
  )
}

function OrderRow({ id, customer, status, statusColor, amount, date }: {
  id: string,
  customer: string,
  status: string,
  statusColor: string,
  amount: string,
  date: string
}) {
  return (
    <tr className="hover:bg-nova-50/30 transition-colors cursor-pointer group">
      <td className="px-6 py-4 font-black text-nova-900 font-mono text-xs">{id}</td>
      <td className="px-6 py-4 text-nova-600 font-medium text-sm">{customer}</td>
      <td className="px-6 py-4">
        <span className={`px-2.5 py-0.5 rounded-lg text-xs font-bold ${statusColor}`}>
          {status}
        </span>
      </td>
      <td className="px-6 py-4 font-black text-nova-900 text-sm">{amount}</td>
      <td className="px-6 py-4 text-nova-400 text-xs font-semibold">{date}</td>
    </tr>
  )
}

function ActivityItem({ icon, title, description, time }: {
  icon: React.ReactNode,
  title: string,
  description: string,
  time: string
}) {
  return (
    <div className="flex gap-3 p-3 rounded-2xl hover:bg-nova-50/50 transition-colors group">
      <div className="w-8 h-8 bg-nova-900 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold text-nova-900 truncate">{title}</p>
        <p className="text-xs text-nova-400 mt-0.5 truncate">{description}</p>
      </div>
      <div className="text-[10px] font-black text-nova-300 uppercase tracking-wider flex-shrink-0">{time}</div>
    </div>
  )
}
