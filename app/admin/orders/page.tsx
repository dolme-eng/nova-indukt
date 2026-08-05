import React from 'react'
import Link from 'next/link'
import {
  Eye,
  Banknote,
  Truck,
  CheckCircle2,
  Clock,
  AlertCircle,
  XCircle,
  RefreshCcw,
  Box,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import { prisma } from '@/lib/prisma'
export const dynamic = 'force-dynamic'
import { format } from 'date-fns'
import { de } from 'date-fns/locale'
import { Prisma, OrderStatus, PaymentStatus } from '@prisma/client'

import { OrdersFilter } from './_components/orders-filter'
import { CsvExportButton } from '../_components/csv-export-button'

const PAGE_SIZE = 50

async function getOrders(search?: string, status?: string, page: number = 1, dateFrom?: string, dateTo?: string) {
  const where: Prisma.OrderWhereInput = {}

  if (status) {
    where.status = status as OrderStatus
  }

  if (search) {
    where.OR = [
      { orderNumber: { contains: search, mode: 'insensitive' } },
      { customerName: { contains: search, mode: 'insensitive' } },
      { customerEmail: { contains: search, mode: 'insensitive' } },
    ]
  }

  if (dateFrom || dateTo) {
    where.createdAt = {}
    if (dateFrom) {
      where.createdAt.gte = new Date(dateFrom)
    }
    if (dateTo) {
      const toDate = new Date(dateTo)
      toDate.setHours(23, 59, 59, 999)
      where.createdAt.lte = toDate
    }
  }

  const skip = (page - 1) * PAGE_SIZE

  const [orders, totalCount] = await Promise.all([
    prisma.order.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: { items: true },
      skip,
      take: PAGE_SIZE,
    }),
    prisma.order.count({ where }),
  ])

  return { orders, totalCount, totalPages: Math.ceil(totalCount / PAGE_SIZE) }
}

const statusMap: Record<OrderStatus, { label: string; color: string; icon: React.ReactNode }> = {
  PENDING: {
    label: 'Ausstehend',
    color: 'bg-amber-100 text-amber-700 border-amber-200',
    icon: <Clock size={12} />,
  },
  PROCESSING: {
    label: 'Bearbeitung',
    color: 'bg-blue-100 text-blue-700 border-blue-200',
    icon: <RefreshCcw size={12} />,
  },
  SHIPPED: {
    label: 'Versandt',
    color: 'bg-purple-100 text-purple-700 border-purple-200',
    icon: <Truck size={12} />,
  },
  DELIVERED: {
    label: 'Zugestellt',
    color: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    icon: <CheckCircle2 size={12} />,
  },
  CANCELLED: {
    label: 'Storniert',
    color: 'bg-slate-100 text-slate-700 border-slate-200',
    icon: <XCircle size={12} />,
  },
  REFUNDED: {
    label: 'Erstattet',
    color: 'bg-red-100 text-red-700 border-red-200',
    icon: <AlertCircle size={12} />,
  },
}

const paymentMap: Record<PaymentStatus, { label: string; color: string }> = {
  PENDING: { label: 'Nicht bezahlt', color: 'bg-slate-100 text-slate-600' },
  AUTHORIZED: { label: 'Autorisiert', color: 'bg-blue-50 text-blue-600' },
  PAID: { label: 'Bezahlt', color: 'bg-emerald-50 text-emerald-600' },
  FAILED: { label: 'Fehlgeschlagen', color: 'bg-red-50 text-red-600' },
  REFUNDED: { label: 'Erstattet', color: 'bg-red-50 text-red-600' },
  PARTIALLY_REFUNDED: { label: 'Teilweise', color: 'bg-orange-50 text-orange-600' },
}

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string; page?: string; dateFrom?: string; dateTo?: string }>
}) {
  const resolvedParams = await searchParams
  const page = Math.max(1, parseInt(resolvedParams.page || '1', 10))
  const { orders, totalCount, totalPages } = await getOrders(
    resolvedParams.q,
    resolvedParams.status,
    page,
    resolvedParams.dateFrom,
    resolvedParams.dateTo
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Bestellungen</h1>
          <p className="text-sm text-slate-500">
            Verwalten und verfolgen Sie die Verkäufe ({totalCount} Bestellungen)
          </p>
        </div>
        <CsvExportButton
          data={orders}
          columns={[
            { header: 'Bestellnummer', accessor: (r) => String(r.orderNumber) },
            { header: 'Kunde', accessor: (r) => String(r.customerName || '') },
            { header: 'E-Mail', accessor: (r) => String(r.customerEmail) },
            { header: 'Datum', accessor: (r) => String(r.createdAt) },
            { header: 'Status', accessor: (r) => String(r.status) },
            { header: 'Zahlung', accessor: (r) => String(r.paymentStatus) },
            { header: 'Betrag (EUR)', accessor: (r) => Number(r.total) },
          ]}
          filename={`bestellungen-export-${new Date().toISOString().slice(0, 10)}.csv`}
        />
      </div>

      {/* Filters */}
      <OrdersFilter />

      {/* Orders Table */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-[10px] font-bold uppercase tracking-widest text-slate-500">
                <th className="px-6 py-4">Bestellung</th>
                <th className="px-6 py-4">Kunde</th>
                <th className="px-6 py-4">Datum</th>
                <th className="px-6 py-4">Zahlung</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Gesamt</th>
                <th className="px-6 py-4 text-right">Aktionen</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {orders.map((order) => (
                <tr
                  key={order.id}
                  className="group cursor-pointer transition-colors hover:bg-slate-50/50"
                >
                  <td className="px-6 py-4">
                    <Link href={`/admin/orders/${order.id}`} className="flex items-center gap-3">
                      <div className="rounded bg-slate-100 p-2 text-slate-500">
                        <Box size={16} />
                      </div>
                      <span className="font-bold text-slate-900">{order.orderNumber}</span>
                    </Link>
                  </td>
                  <td className="px-6 py-4">
                    <Link href={`/admin/orders/${order.id}`} className="flex flex-col">
                      <span className="text-sm font-semibold text-slate-900">
                        {order.customerName}
                      </span>
                      <span className="text-xs text-slate-500">{order.customerEmail}</span>
                    </Link>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">
                    <Link href={`/admin/orders/${order.id}`} className="block">
                      {format(new Date(order.createdAt), 'dd MMM yyyy, HH:mm', { locale: de })}
                    </Link>
                  </td>
                  <td className="px-6 py-4">
                    <Link href={`/admin/orders/${order.id}`} className="flex flex-col gap-1">
                      <span
                        className={`w-fit rounded-full px-2 py-0.5 text-[10px] font-bold ${paymentMap[order.paymentStatus].color}`}
                      >
                        {paymentMap[order.paymentStatus].label}
                      </span>
                      <span className="flex items-center gap-1 text-[10px] text-slate-400">
                        <Banknote size={10} />
                        {order.paymentMethod}
                      </span>
                    </Link>
                  </td>
                  <td className="px-6 py-4">
                    <Link href={`/admin/orders/${order.id}`} className="block">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-bold ${statusMap[order.status].color}`}
                      >
                        {statusMap[order.status].icon}
                        {statusMap[order.status].label}
                      </span>
                    </Link>
                  </td>
                  <td className="px-6 py-4">
                    <Link
                      href={`/admin/orders/${order.id}`}
                      className="block font-bold text-slate-900"
                    >
                      {Number(order.total).toFixed(2)} €
                    </Link>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/orders/${order.id}`}
                        className="rounded-lg p-2 text-slate-400 transition-all hover:bg-slate-100 hover:text-primary"
                        title="Details"
                      >
                        <Eye size={18} />
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
              {orders.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-slate-500">
                    <div className="flex flex-col items-center gap-2">
                      <Box size={48} className="text-slate-200" />
                      <p>Derzeit sind keine Bestellungen registriert.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-6 py-4 shadow-sm">
          <p className="text-sm text-slate-500">
            Seite {page} von {totalPages}
          </p>
          <div className="flex gap-2">
            {page > 1 && (
              <Link
                href={`/admin/orders?page=${page - 1}${resolvedParams.q ? `&q=${resolvedParams.q}` : ''}${resolvedParams.status ? `&status=${resolvedParams.status}` : ''}${resolvedParams.dateFrom ? `&dateFrom=${resolvedParams.dateFrom}` : ''}${resolvedParams.dateTo ? `&dateTo=${resolvedParams.dateTo}` : ''}`}
                className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
              >
                <ChevronLeft size={16} />
                Zurück
              </Link>
            )}
            {page < totalPages && (
              <Link
                href={`/admin/orders?page=${page + 1}${resolvedParams.q ? `&q=${resolvedParams.q}` : ''}${resolvedParams.status ? `&status=${resolvedParams.status}` : ''}${resolvedParams.dateFrom ? `&dateFrom=${resolvedParams.dateFrom}` : ''}${resolvedParams.dateTo ? `&dateTo=${resolvedParams.dateTo}` : ''}`}
                className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
              >
                Weiter
                <ChevronRight size={16} />
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
