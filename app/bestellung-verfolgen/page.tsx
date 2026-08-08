'use client'

import { useState } from 'react'
import {
  Search,
  Package,
  Truck,
  CheckCircle,
  Clock,
  Mail,
  CreditCard,
  AlertCircle,
} from 'lucide-react'
import { formatPriceDe } from '@/lib/utils/vat'
import { getBankDetailsSync } from '@/lib/data/bank-details'

interface OrderItem {
  productName: string
  quantity: number
  unitPrice: number
}

interface Order {
  id: string
  orderNumber: string
  status: string
  paymentStatus: string
  paymentMethod?: string
  total: number
  createdAt: string
  items: OrderItem[]
  shippingAddress: {
    firstName?: string
    lastName?: string
    name?: string
    street?: string
    postalCode?: string
    city?: string
  } | null
}

const statusLabels: Record<string, { label: string; icon: typeof Clock; color: string }> = {
  PENDING: { label: 'Ausstehend', icon: Clock, color: 'text-yellow-500 bg-yellow-50' },
  PROCESSING: { label: 'In Bearbeitung', icon: Package, color: 'text-blue-500 bg-blue-50' },
  SHIPPED: { label: 'Versendet', icon: Truck, color: 'text-purple-500 bg-purple-50' },
  DELIVERED: { label: 'Zugestellt', icon: CheckCircle, color: 'text-green-500 bg-green-50' },
  CANCELLED: { label: 'Storniert', icon: Clock, color: 'text-red-500 bg-red-50' },
  REFUNDED: { label: 'Erstattet', icon: Clock, color: 'text-gray-500 bg-gray-50' },
}

const paymentStatusLabels: Record<string, { label: string; color: string }> = {
  PENDING: { label: 'Ausstehend', color: 'text-amber-600 bg-amber-50 border-amber-200' },
  PAID: { label: 'Bezahlt', color: 'text-green-600 bg-green-50 border-green-200' },
  FAILED: { label: 'Fehlgeschlagen', color: 'text-red-600 bg-red-50 border-red-200' },
  REFUNDED: { label: 'Erstattet', color: 'text-gray-600 bg-gray-50 border-gray-200' },
}

export default function OrderTrackingPage() {
  const [email, setEmail] = useState('')
  const [orderNumber, setOrderNumber] = useState('')
  const [order, setOrder] = useState<Order | null>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setOrder(null)
    setLoading(true)

    try {
      const res = await fetch(
        `/api/orders/track?email=${encodeURIComponent(email)}&orderNumber=${encodeURIComponent(orderNumber)}`
      )
      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Bestellung nicht gefunden.')
      } else {
        setOrder(data)
      }
    } catch {
      setError('Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.')
    } finally {
      setLoading(false)
    }
  }

  const statusInfo = order ? statusLabels[order.status] || statusLabels.PENDING : null
  const paymentInfo = order
    ? paymentStatusLabels[order.paymentStatus] || paymentStatusLabels.PENDING
    : null
  const bank = getBankDetailsSync()
  const showBankDetails =
    order?.paymentMethod === 'BANK_TRANSFER' && order?.paymentStatus === 'PENDING'

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto max-w-2xl px-4">
        <h1 className="mb-2 text-3xl font-bold text-gray-900">Bestellung verfolgen</h1>
        <p className="mb-8 text-gray-600">
          Geben Sie Ihre E-Mail-Adresse und Bestellnummer ein, um den Status Ihrer Bestellung zu
          prüfen.
        </p>

        <form onSubmit={handleSearch} className="mb-8 rounded-2xl bg-white p-6 shadow-sm">
          <div className="space-y-4">
            <div>
              <label htmlFor="tracking-email" className="mb-1 block text-sm font-medium text-gray-700">E-Mail-Adresse</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                <input
                  id="tracking-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ihre@email.de"
                  className="w-full rounded-xl border border-gray-200 py-3 pl-10 pr-4 focus:border-[#4ECCA3] focus:outline-none focus:ring-2 focus:ring-[#4ECCA3]/50"
                />
              </div>
            </div>
            <div>
              <label htmlFor="tracking-order" className="mb-1 block text-sm font-medium text-gray-700">Bestellnummer</label>
              <div className="relative">
                <Package className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                <input
                  id="tracking-order"
                  type="text"
                  required
                  value={orderNumber}
                  onChange={(e) => setOrderNumber(e.target.value)}
                  placeholder="NOV-..."
                  className="w-full rounded-xl border border-gray-200 py-3 pl-10 pr-4 focus:border-[#4ECCA3] focus:outline-none focus:ring-2 focus:ring-[#4ECCA3]/50"
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#4ECCA3] py-3 font-semibold text-white transition-colors hover:bg-[#3db892] disabled:opacity-50"
            >
              <Search className="h-5 w-5" />
              {loading ? 'Suche...' : 'Bestellung suchen'}
            </button>
          </div>
        </form>

        {error && (
          <div className="mb-8 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {order && statusInfo && (
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-gray-900">Bestellung {order.orderNumber}</h2>
                <p className="text-sm text-gray-500">
                  {new Date(order.createdAt).toLocaleDateString('de-DE', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>
              <div
                className={`flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-medium ${statusInfo.color}`}
              >
                <statusInfo.icon className="h-4 w-4" />
                {statusInfo.label}
              </div>
            </div>

            {/* Payment Status */}
            {paymentInfo && (
              <div
                className={`mb-4 flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium ${paymentInfo.color}`}
              >
                <CreditCard className="h-4 w-4" />
                Zahlungsstatus: {paymentInfo.label}
              </div>
            )}

            {/* Bank Transfer Details (when payment pending) */}
            {showBankDetails && (
              <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 p-4">
                <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-amber-700">
                  <AlertCircle className="h-4 w-4" />
                  Zahlung ausstehend
                </div>
                <p className="mb-3 text-sm text-amber-600">
                  Bitte überweisen Sie den Gesamtbetrag innerhalb von 14 Tagen und geben Sie Ihre
                  Bestellnummer als Verwendungszweck an.
                </p>
                <div className="space-y-1.5 rounded-lg bg-white p-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Kontoinhaber:</span>
                    <span className="font-medium text-gray-900">{bank.holder}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">IBAN:</span>
                    <span className="font-medium text-gray-900">{bank.iban}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">BIC:</span>
                    <span className="font-medium text-gray-900">{bank.bic}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Verwendungszweck:</span>
                    <span className="font-bold text-[#0C211E]">{order.orderNumber}</span>
                  </div>
                </div>
                <p className="mt-2 text-xs text-amber-500">
                  Senden Sie den Zahlungsnachweis an support@nova-indukt.de
                </p>
              </div>
            )}

            <div className="mb-4 border-t border-gray-100 pt-4">
              <h3 className="mb-3 font-semibold text-gray-900">Artikel</h3>
              {order.items.map((item, i) => (
                <div key={i} className="flex justify-between py-2 text-sm">
                  <span className="text-gray-700">
                    {item.productName} × {item.quantity}
                  </span>
                  <span className="font-medium">
                    {formatPriceDe(item.unitPrice * item.quantity)}
                  </span>
                </div>
              ))}
              <div className="mt-2 flex justify-between border-t border-gray-100 pt-2 font-bold">
                <span>Gesamt</span>
                <span>{formatPriceDe(order.total)}</span>
              </div>
            </div>

            {order.shippingAddress && (
              <div className="border-t border-gray-100 pt-4">
                <h3 className="mb-2 font-semibold text-gray-900">Lieferadresse</h3>
                <p className="text-sm text-gray-600">
                  {order.shippingAddress.name ||
                    `${order.shippingAddress.firstName} ${order.shippingAddress.lastName}`}
                </p>
                <p className="text-sm text-gray-600">{order.shippingAddress.street}</p>
                <p className="text-sm text-gray-600">
                  {order.shippingAddress.postalCode} {order.shippingAddress.city}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
