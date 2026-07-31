import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Calendar,
  ShoppingBag,
  Banknote,
  Clock,
  ChevronRight,
  TrendingUp,
  Box,
  CheckCircle2,
  Settings,
} from 'lucide-react'
import { prisma } from '@/lib/prisma'
export const dynamic = 'force-dynamic'
import { format } from 'date-fns'
import { de } from 'date-fns/locale'
import { notFound } from 'next/navigation'

async function getCustomer(id: string) {
  const customer = await prisma.user.findUnique({
    where: { id },
    include: {
      orders: {
        orderBy: { createdAt: 'desc' },
        include: { items: true },
      },
      addresses: true,
      _count: {
        select: { orders: true, reviews: true, wishlist: true },
      },
    },
  })
  return customer
}

export default async function CustomerDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const customer = await getCustomer(id)

  if (!customer) notFound()

  const totalSpent = customer.orders.reduce((sum, order) => sum + Number(order.total), 0)
  const averageOrderValue = customer._count.orders > 0 ? totalSpent / customer._count.orders : 0

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/customers"
            className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-900"
          >
            <ArrowLeft size={20} />
          </Link>
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-white bg-slate-100 font-bold text-slate-600 shadow-sm ring-1 ring-slate-200">
              {customer.image ? (
                <Image
                  src={customer.image}
                  alt={customer.name || ''}
                  width={56}
                  height={56}
                  className="h-full w-full rounded-full object-cover"
                />
              ) : (
                (customer.name?.charAt(0) || customer.email.charAt(0)).toUpperCase()
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold text-slate-900">{customer.name || 'Benutzer'}</h1>
                {customer.role === 'ADMIN' ? (
                  <span className="rounded-full border border-purple-200 bg-purple-100 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest text-purple-700">
                    Admin
                  </span>
                ) : (
                  <span className="rounded-full border border-blue-200 bg-blue-100 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest text-blue-700">
                    Kunde
                  </span>
                )}
              </div>
              <p className="mt-1 flex items-center gap-1 text-sm font-medium text-slate-500">
                Mitglied seit dem{' '}
                {format(new Date(customer.createdAt), 'dd. MMMM yyyy', { locale: de })}
              </p>
            </div>
          </div>
        </div>
        <div className="flex gap-3">
          <a
            href={`mailto:${customer.email}`}
            className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition-colors hover:bg-slate-50"
          >
            <Mail size={18} />
            Kontaktieren
          </a>
          <Link
            href={`/admin/customers`}
            className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-primary/90"
          >
            <Settings size={18} />
            Kundenverwaltung
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
        <StatItem
          label="Gesamtumsatz"
          value={`${totalSpent.toFixed(2)} €`}
          icon={<Banknote className="text-emerald-600" size={20} />}
          color="bg-emerald-50 border-emerald-100"
        />
        <StatItem
          label="Bestellungen"
          value={customer._count.orders.toString()}
          icon={<ShoppingBag className="text-blue-600" size={20} />}
          color="bg-blue-50 border-blue-100"
        />
        <StatItem
          label="Ø Bestellwert"
          value={`${averageOrderValue.toFixed(2)} €`}
          icon={<TrendingUp className="text-orange-600" size={20} />}
          color="bg-orange-50 border-orange-100"
        />
        <StatItem
          label="Bewertungen"
          value={customer._count.reviews.toString()}
          icon={<CheckCircle2 className="text-purple-600" size={20} />}
          color="bg-purple-50 border-purple-100"
        />
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Main Column - Order History */}
        <div className="space-y-6 lg:col-span-2">
          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/50 p-6">
              <h2 className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-slate-900">
                <Clock size={16} />
                Bestellhistorie
              </h2>
            </div>
            <div className="divide-y divide-slate-100">
              {customer.orders.map((order) => (
                <div key={order.id} className="group p-6 transition-colors hover:bg-slate-50/50">
                  <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <div className="flex items-center gap-4">
                      <div className="rounded-lg bg-slate-100 p-3 text-slate-500 transition-colors group-hover:bg-white group-hover:text-primary">
                        <Box size={20} />
                      </div>
                      <div>
                        <p className="font-bold text-slate-900">{order.orderNumber}</p>
                        <p className="mt-1 flex items-center gap-1.5 text-xs font-medium text-slate-500">
                          <Calendar size={12} />
                          {format(new Date(order.createdAt), 'dd. MMM yyyy', { locale: de })}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <p className="font-bold text-slate-900">
                          {Number(order.total).toFixed(2)} €
                        </p>
                        <p className="mt-1 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                          {order.items.length} Artikel
                        </p>
                      </div>
                      <span
                        className={`rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest ${
                          order.status === 'DELIVERED'
                            ? 'border-emerald-100 bg-emerald-50 text-emerald-700'
                            : 'border-blue-100 bg-blue-50 text-blue-700'
                        }`}
                      >
                        {order.status}
                      </span>
                      <Link
                        href={`/admin/orders/${order.id}`}
                        className="rounded-lg p-2 text-slate-400 transition-all hover:bg-slate-100 hover:text-primary"
                      >
                        <ChevronRight size={18} />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
              {customer.orders.length === 0 && (
                <div className="p-12 text-center italic text-slate-500">
                  Keine Bestellungen für diesen Kunden.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar - Contact & Addresses */}
        <div className="space-y-6">
          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-6 flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-slate-900">
              <Mail size={16} />
              Kontakt
            </h2>
            <div className="space-y-4">
              <div className="flex items-center gap-3 rounded-lg border border-slate-100 bg-slate-50 p-3 text-sm text-slate-600">
                <Mail size={18} className="text-slate-400" />
                <span className="truncate font-medium">{customer.email}</span>
              </div>
              <div className="flex items-center gap-3 rounded-lg border border-slate-100 bg-slate-50 p-3 text-sm text-slate-600">
                <Phone size={18} className="text-slate-400" />
                <span className="font-medium">Nicht angegeben</span>
              </div>
            </div>
          </div>

          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-6 flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-slate-900">
              <MapPin size={16} />
              Adressen ({customer.addresses.length})
            </h2>
            <div className="space-y-6">
              {customer.addresses.map((address) => (
                <div
                  key={address.id}
                  className="relative space-y-2 border-b border-slate-100 pb-4 last:border-0 last:pb-0"
                >
                  {address.isDefault && (
                    <span className="absolute right-0 top-0 rounded border border-primary/20 bg-primary/10 px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-widest text-primary">
                      Standard
                    </span>
                  )}
                  <span className="mb-2 block text-[10px] font-bold uppercase tracking-widest text-slate-400">
                    {address.type}
                  </span>
                  <p className="text-sm italic leading-relaxed text-slate-600">
                    {address.firstName} {address.lastName}
                    <br />
                    {address.street}
                    <br />
                    {address.zipCode} {address.city}
                    <br />
                    {address.country}
                  </p>
                </div>
              ))}
              {customer.addresses.length === 0 && (
                <p className="py-4 text-center text-sm italic text-slate-400">
                  Keine Adressen gespeichert.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function StatItem({
  label,
  value,
  icon,
  color,
}: {
  label: string
  value: string
  icon: React.ReactNode
  color: string
}) {
  return (
    <div
      className={`rounded-xl border p-6 ${color} group shadow-sm transition-transform hover:scale-[1.02]`}
    >
      <div className="mb-4 flex items-center justify-between">
        <div className="rounded-lg bg-white p-2 shadow-sm">{icon}</div>
      </div>
      <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">{label}</p>
      <h3 className="mt-1 text-xl font-black text-slate-900">{value}</h3>
    </div>
  )
}
