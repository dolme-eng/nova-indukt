'use client'

import { useState } from 'react'
import { Search, Package, Truck, CheckCircle, Clock, Mail } from 'lucide-react'
import { formatPriceDe } from '@/lib/utils/vat'

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
      const res = await fetch(`/api/orders/track?email=${encodeURIComponent(email)}&orderNumber=${encodeURIComponent(orderNumber)}`)
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

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-2xl">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Bestellung verfolgen</h1>
        <p className="text-gray-600 mb-8">
          Geben Sie Ihre E-Mail-Adresse und Bestellnummer ein, um den Status Ihrer Bestellung zu prüfen.
        </p>

        <form onSubmit={handleSearch} className="bg-white rounded-2xl shadow-sm p-6 mb-8">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">E-Mail-Adresse</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ihre@email.de"
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4ECCA3]/50 focus:border-[#4ECCA3]"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Bestellnummer</label>
              <div className="relative">
                <Package className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  required
                  value={orderNumber}
                  onChange={(e) => setOrderNumber(e.target.value)}
                  placeholder="NOV-..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4ECCA3]/50 focus:border-[#4ECCA3]"
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#4ECCA3] text-white font-semibold py-3 rounded-xl hover:bg-[#3db892] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <Search className="w-5 h-5" />
              {loading ? 'Suche...' : 'Bestellung suchen'}
            </button>
          </div>
        </form>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 text-sm mb-8">
            {error}
          </div>
        )}

        {order && statusInfo && (
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-bold text-gray-900">Bestellung {order.orderNumber}</h2>
                <p className="text-sm text-gray-500">
                  {new Date(order.createdAt).toLocaleDateString('de-DE', { year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
              </div>
              <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium ${statusInfo.color}`}>
                <statusInfo.icon className="w-4 h-4" />
                {statusInfo.label}
              </div>
            </div>

            <div className="border-t border-gray-100 pt-4 mb-4">
              <h3 className="font-semibold text-gray-900 mb-3">Artikel</h3>
              {order.items.map((item, i) => (
                <div key={i} className="flex justify-between text-sm py-2">
                  <span className="text-gray-700">{item.productName} × {item.quantity}</span>
                  <span className="font-medium">{formatPriceDe(item.unitPrice * item.quantity)}</span>
                </div>
              ))}
              <div className="border-t border-gray-100 mt-2 pt-2 flex justify-between font-bold">
                <span>Gesamt</span>
                <span>{formatPriceDe(order.total)}</span>
              </div>
            </div>

            {order.shippingAddress && (
              <div className="border-t border-gray-100 pt-4">
                <h3 className="font-semibold text-gray-900 mb-2">Lieferadresse</h3>
                <p className="text-sm text-gray-600">
                  {order.shippingAddress.name || `${order.shippingAddress.firstName} ${order.shippingAddress.lastName}`}
                </p>
                <p className="text-sm text-gray-600">{order.shippingAddress.street}</p>
                <p className="text-sm text-gray-600">{order.shippingAddress.postalCode} {order.shippingAddress.city}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
