import Link from 'next/link'
import {
  ArrowLeft,
  Package,
  Truck,
  Banknote,
  User,
  MapPin,
  Mail,
  Phone,
  Printer,
  ShieldCheck,
  Plus,
} from 'lucide-react'
import { prisma } from '@/lib/prisma'
import { OrderStatus } from '@prisma/client'
export const dynamic = 'force-dynamic'
import { format } from 'date-fns'
import { de } from 'date-fns/locale'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import { ShippingActions } from './ShippingActions'
import { PaymentActions } from './PaymentActions'

async function getOrder(id: string) {
  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      items: {
        include: {
          product: {
            include: {
              images: {
                where: { isMain: true },
                take: 1,
              },
            },
          },
        },
      },
      user: true,
    },
  })
  return order
}

const statusColors: Record<string, string> = {
  PENDING: 'bg-amber-100 text-amber-700 border-amber-200',
  PROCESSING: 'bg-blue-100 text-blue-700 border-blue-200',
  SHIPPED: 'bg-purple-100 text-purple-700 border-purple-200',
  DELIVERED: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  CANCELLED: 'bg-slate-100 text-slate-700 border-slate-200',
  REFUNDED: 'bg-red-100 text-red-700 border-red-200',
}

export default async function OrderDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const order = await getOrder(id)

  if (!order) notFound()

  const shippingAddress = (order.shippingAddress as Record<string, string>) || {}
  const billingAddress = (order.billingAddress as Record<string, string>) || shippingAddress

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/orders"
            className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-900"
          >
            <ArrowLeft size={20} />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-slate-900">Bestellung {order.orderNumber}</h1>
              <span
                className={`rounded-full border px-2.5 py-0.5 text-xs font-bold ${statusColors[order.status]}`}
              >
                {order.status}
              </span>
            </div>
            <p className="mt-1 flex items-center gap-1 text-sm text-slate-500">
              Aufgegeben am{' '}
              {format(new Date(order.createdAt), "dd. MMMM yyyy 'um' HH:mm", { locale: de })}
            </p>
          </div>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => window.print()}
            className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition-colors hover:bg-slate-50 print:hidden"
          >
            <Printer size={18} />
            Rechnung drucken
          </button>
          <a
            href="#shipping-actions"
            className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-primary/90 print:hidden"
          >
            Status aktualisieren
          </a>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Main Column - Order Items */}
        <div className="space-y-6 lg:col-span-2">
          <div id="shipping-actions">
            <ShippingActions
              orderId={order.id}
              currentStatus={order.status as OrderStatus}
              trackingNumber={order.trackingNumber}
            />
          </div>

          <PaymentActions
            orderId={order.id}
            orderNumber={order.orderNumber}
            currentPaymentStatus={order.paymentStatus as 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED'}
            paymentMethod={order.paymentMethod ?? undefined}
            paidAt={order.paidAt ? order.paidAt.toISOString() : null}
          />

          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/50 p-6">
              <h2 className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-slate-900">
                <Package size={16} />
                Artikel ({order.items.length})
              </h2>
              <span className="text-xs font-medium text-slate-500">Versand aus Zentrallager</span>
            </div>
            <div className="divide-y divide-slate-100">
              {order.items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-6 p-6 transition-colors hover:bg-slate-50/50"
                >
                  <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg border border-slate-200 bg-slate-100">
                    {item.product.images[0] ? (
                      <Image
                        src={item.product.images[0].url}
                        alt={item.productName}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center">
                        <Package className="text-slate-300" size={24} />
                      </div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="cursor-pointer truncate font-bold text-slate-900 transition-colors hover:text-primary">
                          {item.productName}
                        </h3>
                      </div>
                      <p className="font-bold text-slate-900">
                        {(Number(item.unitPrice) * item.quantity).toFixed(2)} €
                      </p>
                    </div>
                    <div className="mt-3 flex items-center gap-4 text-sm">
                      <span className="flex items-center gap-1.5 rounded bg-slate-100 px-2 py-0.5 font-medium text-slate-600">
                        Menge: <span className="font-bold">{item.quantity}</span>
                      </span>
                      <span className="text-slate-400">×</span>
                      <span className="font-medium text-slate-600">
                        {Number(item.unitPrice).toFixed(2)} € / Einheit
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="border-t border-slate-100 bg-slate-50 p-6">
              <div className="ml-auto max-w-sm space-y-3">
                <div className="flex justify-between text-sm text-slate-600">
                  <span>Zwischensumme</span>
                  <span>{Number(order.subtotal).toFixed(2)} €</span>
                </div>
                <div className="flex justify-between text-sm text-slate-600">
                  <span>Versandkosten</span>
                  <span>{Number(order.shippingCost).toFixed(2)} €</span>
                </div>
                <div className="flex justify-between text-sm text-slate-600">
                  <span>MwSt. (Inklusive)</span>
                  <span>{Number(order.vatAmount).toFixed(2)} €</span>
                </div>
                <div className="flex justify-between border-t border-slate-200 pt-3 text-lg font-bold text-slate-900">
                  <span>Gesamt</span>
                  <span>{Number(order.total).toFixed(2)} €</span>
                </div>
              </div>
            </div>
          </div>

          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-6 flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-slate-900">
              <Truck size={16} />
              Versandinformationen
            </h2>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Transportdienst
                  </span>
                  <div className="h-px flex-1 bg-slate-100"></div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
                    <Truck size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">DHL Express Standard</p>
                    <p className="text-xs text-slate-500">Lieferung in 3-5 Werktagen</p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Sendungsverfolgung
                  </span>
                  <div className="h-px flex-1 bg-slate-100"></div>
                </div>
                {order.trackingNumber ? (
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                      <ShieldCheck size={20} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">{order.trackingNumber}</p>
                      <a
                        href={`https://www.dhl.de/de/privatkunden/pakete-empfangen/verfolgen.html?piececode=${encodeURIComponent(order.trackingNumber)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-bold text-primary hover:underline"
                      >
                        Auf DHL verfolgen
                      </a>
                    </div>
                  </div>
                ) : (
                  <a
                    href="#shipping-actions"
                    className="flex w-full items-center justify-center gap-2 rounded-lg border-2 border-dashed border-slate-200 py-2 text-xs font-bold uppercase tracking-widest text-slate-400 transition-all hover:border-primary hover:text-primary"
                  >
                    <Plus size={14} />
                    Sendungsnummer hinzufügen
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar - Customer & Payment Info */}
        <div className="space-y-6">
          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-6 flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-slate-900">
              <User size={16} />
              Kunde
            </h2>
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-white bg-slate-100 font-bold text-slate-600 shadow-sm ring-1 ring-slate-200">
                  {order.customerName.charAt(0)}
                </div>
                <div>
                  <p className="font-bold text-slate-900">{order.customerName}</p>
                  <Link
                    href={`/admin/customers/${order.userId}`}
                    className="text-xs font-bold uppercase tracking-tighter text-primary hover:underline"
                  >
                    Kundenprofil ansehen
                  </Link>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm text-slate-600">
                  <Mail size={16} className="text-slate-400" />
                  <span className="truncate">{order.customerEmail}</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-600">
                  <Phone size={16} className="text-slate-400" />
                  <span>{order.customerPhone || 'Nicht angegeben'}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-6 flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-slate-900">
              <MapPin size={16} />
              Adressen
            </h2>
            <div className="space-y-6">
              <div>
                <span className="mb-2 block text-[10px] font-bold uppercase tracking-widest text-slate-400">
                  Lieferadresse
                </span>
                <p className="text-sm italic leading-relaxed text-slate-600">
                  {shippingAddress.firstName} {shippingAddress.lastName}
                  <br />
                  {shippingAddress.street}
                  <br />
                  {shippingAddress.zip} {shippingAddress.city}
                  <br />
                  {shippingAddress.country}
                </p>
              </div>
              <div className="border-t border-slate-100 pt-4">
                <span className="mb-2 block text-[10px] font-bold uppercase tracking-widest text-slate-400">
                  Rechnungsadresse
                </span>
                <p className="text-sm italic leading-relaxed text-slate-600">
                  {billingAddress.firstName} {billingAddress.lastName}
                  <br />
                  {billingAddress.street}
                  <br />
                  {billingAddress.zip} {billingAddress.city}
                  <br />
                  {billingAddress.country}
                </p>
              </div>
            </div>
          </div>

          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-6 flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-slate-900">
              <Banknote size={16} />
              Zahlung
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">Methode</span>
                <span className="flex items-center gap-1.5 text-sm font-bold text-slate-900">
                  <Banknote size={14} className="text-slate-400" />
                  {order.paymentMethod}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">Status</span>
                <span
                  className={`rounded-full px-2.5 py-1 text-xs font-bold ${
                    order.paymentStatus === 'PAID'
                      ? 'bg-emerald-50 text-emerald-700'
                      : 'bg-slate-50 text-slate-600'
                  }`}
                >
                  {order.paymentStatus}
                </span>
              </div>
              {order.paymentIntentId && (
                <div className="border-t border-slate-100 pt-3">
                  <span className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-slate-400">
                    Transaktions-ID
                  </span>
                  <code className="block truncate rounded bg-slate-50 px-1.5 py-0.5 font-mono text-[10px] text-slate-500">
                    {order.paymentIntentId}
                  </code>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
