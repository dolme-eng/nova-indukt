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
  CreditCard,
  User,
  Loader2,
  Clock
} from "lucide-react"
import Link from "next/link"

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

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR'
    }).format(value)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-slate-500">Willkommen in Ihrem NOVA INDUKT Administrationsbereich.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Umsatz" 
          value={formatCurrency(stats?.orders.revenue || 0)} 
          change={`${stats?.orders.recent || 0} diesen Monat`} 
          isPositive={true} 
          icon={<TrendingUp className="text-emerald-600" size={24} />} 
        />
        <StatCard 
          title="Bestellungen" 
          value={(stats?.orders.total || 0).toString()} 
          change={`${stats?.orders.recent || 0} diesen Monat`} 
          isPositive={true} 
          icon={<ShoppingCart className="text-blue-600" size={24} />} 
        />
        <StatCard 
          title="Kunden" 
          value={(stats?.customers.total || 0).toString()} 
          change={`+${stats?.customers.new || 0} diesen Monat`} 
          isPositive={true} 
          icon={<Users className="text-violet-600" size={24} />} 
        />
        <StatCard 
          title="Aktive Produkte" 
          value={(stats?.products.active || 0).toString()} 
          change="online" 
          isPositive={true} 
          icon={<Package className="text-orange-600" size={24} />} 
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
            icon={<Tag className="text-pink-600" size={24} />} 
          />
        </Link>
        <Link href="/admin/newsletter">
          <StatCard 
            title="Newsletter-Abonnenten" 
            value={(stats?.newsletter.subscribers || 0).toString()} 
            change="aktiv" 
            isPositive={true} 
            icon={<Mail className="text-cyan-600" size={24} />} 
          />
        </Link>
        <Link href="/admin/reviews">
          <StatCard 
            title="Ausstehende Bewertungen" 
            value={(stats?.reviews.pending || 0).toString()} 
            change="zu moderieren" 
            isPositive={stats?.reviews.pending === 0} 
            icon={<Star className="text-yellow-600" size={24} />} 
          />
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Orders */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-200 flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900">Neue Bestellungen</h2>
            <Link href="/admin/orders" className="text-sm font-medium text-primary hover:underline flex items-center gap-1">
              Alle ansehen <ChevronRight size={14} />
            </Link>
          </div>
          <div className="overflow-x-auto">
            {!stats?.recentOrdersList ? (
                <div className="p-8 text-center text-slate-500">Laden...</div>
            ) : stats.recentOrdersList.length === 0 ? (
                <div className="p-8 text-center text-slate-500">Keine Bestellungen vorhanden.</div>
            ) : (
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider font-semibold">
                  <th className="px-6 py-4">Bestellung</th>
                  <th className="px-6 py-4">Kunde</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Betrag</th>
                  <th className="px-6 py-4">Datum</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
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
                      case 'PENDING': return 'bg-amber-100 text-amber-700'
                      case 'PROCESSING': return 'bg-blue-100 text-blue-700'
                      case 'SHIPPED': return 'bg-indigo-100 text-indigo-700'
                      case 'DELIVERED': return 'bg-emerald-100 text-emerald-700'
                      case 'CANCELLED': 
                      case 'REFUNDED': return 'bg-red-100 text-red-700'
                      default: return 'bg-slate-100 text-slate-700'
                    }
                  }
                  
                  return (
                    <OrderRow 
                      key={order.orderNumber}
                      id={order.orderNumber} 
                      customer={order.customerName} 
                      status={getStatusTranslation(order.status)} 
                      statusColor={getStatusColor(order.status)}
                      amount={formatCurrency(order.total)} 
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
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-200">
            <h2 className="text-lg font-bold text-slate-900">Letzte Aktivitäten</h2>
          </div>
          <div className="p-6 space-y-6">
            <ActivityItem 
              icon={<CreditCard className="text-emerald-500" size={18} />}
              title="Zahlung erhalten"
              description="Bestellung #NO-2024-001 bestätigt"
              time="2 min"
            />
            <ActivityItem 
              icon={<User className="text-blue-500" size={18} />}
              title="Neuer Benutzer"
              description="Jean Martin hat sich registriert"
              time="15 min"
            />
            <ActivityItem 
              icon={<Package className="text-orange-500" size={18} />}
              title="Niedriger Lagerbestand"
              description="Induct-Pro Max (SKU: IP-001)"
              time="1h"
            />
            <ActivityItem 
              icon={<Clock className="text-slate-500" size={18} />}
              title="Neue Bewertung"
              description="5 Sterne für Induct-Pro"
              time="3h"
            />
          </div>
          <div className="p-4 bg-slate-50 border-t border-slate-200 text-center">
            <button className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
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
    <div className={`bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow group ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="p-3 bg-slate-50 rounded-lg group-hover:bg-white transition-colors">
          {icon}
        </div>
        <div className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full ${
          isPositive ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"
        }`}>
          {isPositive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
          {change}
        </div>
      </div>
      <div>
        <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">{title}</p>
        <h3 className="text-2xl font-bold text-slate-900 mt-1">{value}</h3>
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
    <tr className="hover:bg-slate-50 transition-colors cursor-pointer">
      <td className="px-6 py-4 font-semibold text-slate-900">{id}</td>
      <td className="px-6 py-4 text-slate-600">{customer}</td>
      <td className="px-6 py-4">
        <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${statusColor}`}>
          {status}
        </span>
      </td>
      <td className="px-6 py-4 font-medium text-slate-900">{amount}</td>
      <td className="px-6 py-4 text-slate-500 text-sm italic">{date}</td>
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
    <div className="flex gap-4">
      <div className="mt-1">{icon}</div>
      <div className="flex-1">
        <p className="text-sm font-semibold text-slate-900">{title}</p>
        <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{description}</p>
      </div>
      <div className="text-[10px] font-bold text-slate-400 uppercase">{time}</div>
    </div>
  )
}
