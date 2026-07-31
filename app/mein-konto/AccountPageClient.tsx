'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Package,
  Heart,
  MapPin,
  Settings,
  User,
  LogOut,
  ChevronRight,
  ShoppingBag,
  Bell,
  Menu,
  X,
  Trash2,
  Plus,
  Home,
  ArrowLeft,
  Pencil,
  Loader2,
  Shield,
} from 'lucide-react'
import { AddressForm } from '@/components/address-form'
import { useAuth } from '@/lib/store/auth'
import { useCart } from '@/lib/store/cart'
import { useWishlist, WishlistItem } from '@/lib/store/wishlist'
import { formatPriceDe } from '@/lib/utils/vat'
import { Product } from '@/lib/data/products'
import { logError } from '@/lib/logger'

interface Address {
  id?: string
  firstName: string
  lastName: string
  company?: string | null
  street: string
  street2?: string | null
  zipCode: string
  city: string
  country: string
  phone?: string | null
  isDefault: boolean
  state?: string | null
}

const TABS = [
  { id: 'overview', label: 'Übersicht', icon: Home },
  { id: 'orders', label: 'Bestellungen', icon: Package },
  { id: 'wishlist', label: 'Wunschliste', icon: Heart },
  { id: 'addresses', label: 'Adressen', icon: MapPin },
  { id: 'settings', label: 'Einstellungen', icon: Settings },
]

export default function AccountPageClient() {
  const router = useRouter()
  const { user, isAuthenticated, logout } = useAuth()
  const { items: wishlistItems, removeItem, count: wishlistCount } = useWishlist()
  const { addItem: addToCart } = useCart()

  const [activeTab, setActiveTab] = useState('overview')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [ordersCount, setOrdersCount] = useState(0)
  const [addressesCount, setAddressesCount] = useState(0)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    // Fetch counts for overview
    async function fetchCounts() {
      try {
        const [ordersRes, addressesRes] = await Promise.all([
          fetch('/api/orders'),
          fetch('/api/addresses'),
        ])

        if (ordersRes.ok) {
          const orders = await ordersRes.json()
          setOrdersCount(orders.length)
        }

        if (addressesRes.ok) {
          const addresses = await addressesRes.json()
          setAddressesCount(addresses.length)
        }
      } catch (error) {
        logError('Error fetching counts:', error)
      }
    }

    if (isAuthenticated) {
      fetchCounts()
    }
  }, [isAuthenticated])

  useEffect(() => {
    if (mounted && !isAuthenticated) router.push('/anmelden')
  }, [mounted, isAuthenticated, router])

  const handleLogout = () => {
    logout()
    router.push('/')
  }

  const handleAddToCart = (item: WishlistItem) => {
    // Transform wishlist item to cart product format
    addToCart(
      {
        id: item.id,
        name: { de: item.name.de },
        price: item.price,
        images: [item.image],
        slug: item.slug || item.id,
        category: '',
      } as Product,
      1
    )
  }

  if (!mounted || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50">
        <nav className="border-b border-gray-200 bg-white">
          <div className="container mx-auto px-4">
            <div className="flex items-center gap-2 py-3 text-sm">
              <div className="h-4 w-20 animate-pulse rounded bg-gray-200" />
            </div>
          </div>
        </nav>
        <div className="flex items-center justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#4ECCA3]/30 border-t-[#4ECCA3]" />
        </div>
      </div>
    )
  }

  const renderTab = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <OverviewTab
            user={user}
            wishlistCount={wishlistCount}
            ordersCount={ordersCount}
            addressesCount={addressesCount}
            setActiveTab={setActiveTab}
          />
        )
      case 'orders':
        return <OrdersTab />
      case 'wishlist':
        return (
          <WishlistTab items={wishlistItems} onRemove={removeItem} onAddToCart={handleAddToCart} />
        )
      case 'addresses':
        return <AddressesTab />
      case 'settings':
        return <SettingsTab user={user} />
      default:
        return (
          <OverviewTab
            user={user}
            wishlistCount={wishlistCount}
            ordersCount={ordersCount}
            addressesCount={addressesCount}
            setActiveTab={setActiveTab}
          />
        )
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <nav className="hidden border-b border-gray-200 bg-white lg:block">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-2 py-3 text-sm">
            <Link href="/" className="text-gray-500 transition-colors hover:text-gray-900">
              Startseite
            </Link>
            <ChevronRight className="h-4 w-4 text-gray-400" />
            <span className="font-medium text-gray-900">Mein Konto</span>
          </div>
        </div>
      </nav>

      <div className="sticky top-0 z-40 border-b bg-white lg:hidden">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <Link href="/" className="-ml-2 rounded-full p-2 transition-colors hover:bg-gray-100">
              <ArrowLeft className="h-5 w-5 text-gray-600" />
            </Link>
            <h1 className="text-lg font-bold text-gray-900">Mein Konto</h1>
          </div>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="-mr-2 rounded-full p-2 transition-colors hover:bg-gray-100"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: 'auto' }}
              exit={{ height: 0 }}
              className="overflow-hidden border-t"
            >
              <nav className="space-y-1 p-4">
                {TABS.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id)
                      setMobileMenuOpen(false)
                    }}
                    className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left ${activeTab === tab.id ? 'bg-[#4ECCA3]/10 text-[#4ECCA3]' : 'text-gray-600 hover:bg-gray-50'}`}
                  >
                    <tab.icon className="h-5 w-5" />
                    <span className="font-medium">{tab.label}</span>
                    {tab.id === 'wishlist' && wishlistCount > 0 && (
                      <span className="ml-auto rounded-full bg-[#4ECCA3] px-2 py-0.5 text-xs text-white">
                        {wishlistCount}
                      </span>
                    )}
                  </button>
                ))}
                <div className="mt-4 border-t pt-4">
                  {user?.role === 'ADMIN' && (
                    <Link
                      href="/admin"
                      className="mb-2 flex w-full items-center gap-3 rounded-xl bg-[#0C211E] px-4 py-3 text-white hover:bg-[#17423C]"
                    >
                      <Shield className="h-5 w-5" />
                      <span className="font-bold">Admin Panel öffnen</span>
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-red-600 hover:bg-red-50"
                  >
                    <LogOut className="h-5 w-5" />
                    <span className="font-medium">Abmelden</span>
                  </button>
                </div>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="container mx-auto px-4 py-4 sm:py-6 lg:py-8">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col gap-4 lg:flex-row lg:gap-8">
            <aside className="hidden w-72 flex-shrink-0 lg:block">
              <div className="sticky top-24 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
                <div className="bg-gradient-to-br from-[#4ECCA3] to-[#3BA88A] p-6">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-sm lg:h-14 lg:w-14">
                      <User className="h-6 w-6 text-[#4ECCA3] lg:h-7 lg:w-7" />
                    </div>
                    <div className="min-w-0 text-white">
                      <p className="truncate font-semibold">{user?.name}</p>
                      <p className="truncate text-xs text-white/80 lg:text-sm">{user?.email}</p>
                    </div>
                  </div>
                </div>

                <nav className="space-y-1 p-3 lg:p-4">
                  {TABS.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition-colors lg:px-4 lg:py-3 lg:text-base ${activeTab === tab.id ? 'bg-[#4ECCA3]/10 font-medium text-[#4ECCA3]' : 'text-gray-600 hover:bg-gray-50'}`}
                    >
                      <tab.icon className="h-4 w-4 lg:h-5 lg:w-5" />
                      <span>{tab.label}</span>
                      {tab.id === 'wishlist' && wishlistCount > 0 && (
                        <span className="ml-auto rounded-full bg-[#4ECCA3] px-2 py-0.5 text-xs text-white">
                          {wishlistCount}
                        </span>
                      )}
                    </button>
                  ))}
                </nav>

                <div className="border-t p-3 lg:p-4">
                  {user?.role === 'ADMIN' && (
                    <Link
                      href="/admin"
                      className="mb-2 flex w-full items-center gap-3 rounded-xl bg-[#0C211E] px-3 py-2.5 text-sm text-white transition-colors hover:bg-[#17423C] lg:px-4 lg:py-3 lg:text-base"
                    >
                      <Shield className="h-4 w-4 lg:h-5 lg:w-5" />
                      <span className="font-bold">Admin Panel öffnen</span>
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-red-600 transition-colors hover:bg-red-50 lg:px-4 lg:py-3 lg:text-base"
                  >
                    <LogOut className="h-4 w-4 lg:h-5 lg:w-5" />
                    <span className="font-medium">Abmelden</span>
                  </button>
                </div>
              </div>
            </aside>

            <div className="min-w-0 flex-1">{renderTab()}</div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Tab Components
interface OverviewTabProps {
  user: { name?: string | null; email?: string | null; role?: string } | null
  wishlistCount: number
  ordersCount: number
  addressesCount: number
  setActiveTab: (tab: string) => void
}

function OverviewTab({
  user,
  wishlistCount,
  setActiveTab,
  ordersCount = 0,
  addressesCount = 0,
}: OverviewTabProps) {
  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm sm:rounded-2xl sm:p-6">
        <h2 className="mb-1 text-lg font-bold text-gray-900 sm:text-xl">
          Willkommen, {user?.name?.split(' ')[0]}!
        </h2>
        <p className="text-sm text-gray-600 sm:text-base">
          Hier hast Du einen Überblick über Deine Aktivitäten.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        <StatCard
          icon={ShoppingBag}
          label="Bestellungen"
          value={ordersCount.toString()}
          color="bg-blue-500"
          onClick={() => setActiveTab('orders')}
        />
        <StatCard
          icon={Heart}
          label="Wunschliste"
          value={wishlistCount.toString()}
          color="bg-pink-500"
          onClick={() => setActiveTab('wishlist')}
        />
        <StatCard
          icon={MapPin}
          label="Adressen"
          value={addressesCount.toString()}
          color="bg-green-500"
          onClick={() => setActiveTab('addresses')}
        />
        <StatCard icon={Bell} label="News" value="0" color="bg-orange-500" />
      </div>

      <div className="rounded-xl border border-gray-100 bg-white p-6 text-center shadow-sm sm:rounded-2xl sm:p-8">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 sm:h-16 sm:w-16">
          <Package className="h-7 w-7 text-gray-400 sm:h-8 sm:w-8" />
        </div>
        <h3 className="mb-2 text-base font-semibold text-gray-900 sm:text-lg">
          Keine Bestellungen
        </h3>
        <p className="mb-4 text-sm text-gray-600 sm:text-base">
          Du hast bisher noch keine Bestellungen getätigt.
        </p>
        <Link
          href="/produkte"
          className="inline-flex items-center gap-2 rounded-xl bg-[#4ECCA3] px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#3BA88A] sm:px-6 sm:py-3 sm:text-base"
        >
          <ShoppingBag className="h-4 w-4 sm:h-5 sm:w-5" />
          Produkte durchstöbern
        </Link>
      </div>
    </div>
  )
}

interface StatCardProps {
  icon: React.ComponentType<{ className?: string }>
  label: string
  value: string
  color: string
  onClick?: () => void
}

function StatCard({ icon: Icon, label, value, color, onClick }: StatCardProps) {
  return (
    <button
      onClick={onClick}
      className={`rounded-xl border border-gray-100 bg-white p-3 text-left shadow-sm transition-transform active:scale-95 sm:rounded-2xl sm:p-4 ${onClick ? 'cursor-pointer' : ''}`}
    >
      <div
        className={`h-8 w-8 sm:w-10 ${color} mb-2 flex items-center justify-center rounded-lg sm:mb-3 sm:rounded-xl`}
      >
        <Icon className="h-4 w-4 text-white sm:h-5 sm:w-5" />
      </div>
      <p className="text-xl font-bold text-gray-900 sm:text-2xl">{value}</p>
      <p className="text-xs text-gray-600 sm:text-sm">{label}</p>
    </button>
  )
}

interface Order {
  id: string
  orderNumber: string
  status: string
  total: number
  items: Array<{
    id: string
    quantity: number
    price: number
    product: {
      id: string
      nameDe: string
      images: Array<{ url: string }>
      slug: string
    }
  }>
  createdAt: string
}

function OrdersTab() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [cancellingId, setCancellingId] = useState<string | null>(null)

  useEffect(() => {
    async function fetchOrders() {
      try {
        const response = await fetch('/api/orders')
        if (!response.ok) {
          throw new Error('Failed to fetch orders')
        }
        const data = await response.json()
        setOrders(data)
      } catch (err) {
        setError('Bestellungen konnten nicht geladen werden')
        logError('Failed to fetch orders', err)
      } finally {
        setLoading(false)
      }
    }
    fetchOrders()
  }, [])

  const handleCancelOrder = async (orderId: string) => {
    if (!confirm('Sind Sie sicher, dass Sie diese Bestellung stornieren möchten?')) {
      return
    }

    setCancellingId(orderId)
    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'cancel' }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Stornierung fehlgeschlagen')
      }

      // Update the order status in the local state
      setOrders((prev) =>
        prev.map((order) => (order.id === orderId ? { ...order, status: 'CANCELLED' } : order))
      )
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Stornierung fehlgeschlagen')
    } finally {
      setCancellingId(null)
    }
  }

  if (loading) {
    return (
      <div className="rounded-xl border border-gray-100 bg-white p-6 text-center shadow-sm sm:rounded-2xl sm:p-8">
        <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-[#4ECCA3]/30 border-t-[#4ECCA3]" />
        <p className="mt-4 text-gray-600">Bestellungen werden geladen...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-xl border border-gray-100 bg-white p-6 text-center shadow-sm sm:rounded-2xl sm:p-8">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-50 sm:h-20 sm:w-20">
          <Package className="h-8 w-8 text-red-400 sm:h-10 sm:w-10" />
        </div>
        <h2 className="mb-2 text-lg font-bold text-gray-900 sm:text-xl">Fehler</h2>
        <p className="text-sm text-gray-600 sm:text-base">{error}</p>
      </div>
    )
  }

  if (orders.length === 0) {
    return (
      <div className="rounded-xl border border-gray-100 bg-white p-6 text-center shadow-sm sm:rounded-2xl sm:p-8">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 sm:h-20 sm:w-20">
          <Package className="h-8 w-8 text-gray-400 sm:h-10 sm:w-10" />
        </div>
        <h2 className="mb-2 text-lg font-bold text-gray-900 sm:text-xl">Keine Bestellungen</h2>
        <p className="mb-4 text-sm text-gray-600 sm:text-base">
          Du hast bisher noch keine Bestellungen getätigt.
        </p>
        <a
          href="/produkte"
          className="inline-flex items-center gap-2 rounded-xl bg-[#0C211E] px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-[#17423C]"
        >
          Jetzt einkaufen
        </a>
      </div>
    )
  }

  return (
    <div className="space-y-3 sm:space-y-4">
      <h2 className="text-lg font-bold text-gray-900 sm:text-xl">Meine Bestellungen</h2>

      {orders.map((order) => (
        <div
          key={order.id}
          className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm sm:rounded-2xl"
        >
          <div className="border-b border-gray-100 p-4 sm:p-6">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
              <div>
                <p className="text-xs text-gray-500 sm:text-sm">Bestellnummer</p>
                <p className="font-mono font-medium text-[#0C211E]">{order.orderNumber}</p>
              </div>
              <div className="flex items-center gap-3 sm:gap-6">
                <div>
                  <p className="text-xs text-gray-500 sm:text-sm">Datum</p>
                  <p className="text-sm text-gray-900">
                    {new Date(order.createdAt).toLocaleDateString('de-DE')}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500 sm:text-sm">Gesamt</p>
                  <p className="text-base font-bold text-[#4ECCA3] sm:text-lg">
                    {formatPriceDe(order.total)}
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-3 flex items-center gap-3 sm:mt-4">
              <span
                className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${
                  order.status === 'DELIVERED'
                    ? 'bg-green-100 text-green-800'
                    : order.status === 'PENDING'
                      ? 'bg-yellow-100 text-yellow-800'
                      : order.status === 'PROCESSING'
                        ? 'bg-blue-100 text-blue-800'
                        : order.status === 'SHIPPED'
                          ? 'bg-indigo-100 text-indigo-800'
                          : 'bg-gray-100 text-gray-800'
                }`}
              >
                {order.status === 'PENDING'
                  ? 'Ausstehend'
                  : order.status === 'PROCESSING'
                    ? 'In Bearbeitung'
                    : order.status === 'SHIPPED'
                      ? 'Versendet'
                      : order.status === 'DELIVERED'
                        ? 'Zugestellt'
                        : order.status === 'CANCELLED'
                          ? 'Storniert'
                          : order.status === 'REFUNDED'
                            ? 'Erstattet'
                            : order.status}
              </span>
              {order.status === 'PENDING' && (
                <button
                  onClick={() => handleCancelOrder(order.id)}
                  disabled={cancellingId === order.id}
                  className="text-xs font-medium text-red-600 hover:text-red-800 disabled:opacity-50"
                >
                  {cancellingId === order.id ? 'Wird storniert...' : 'Stornieren'}
                </button>
              )}
            </div>
          </div>

          <div className="bg-gray-50/50 p-4 sm:p-6">
            <p className="mb-3 text-xs font-medium text-gray-700 sm:text-sm">
              {order.items.length} {order.items.length === 1 ? 'Artikel' : 'Artikel'}
            </p>
            <div className="space-y-3">
              {order.items.slice(0, 3).map((item) => (
                <div key={item.id} className="flex items-center gap-3 sm:gap-4">
                  <div className="relative h-12 w-12 overflow-hidden rounded-lg bg-white sm:h-16 sm:w-16">
                    <Image
                      src={item.product.images[0]?.url || '/placeholder.svg'}
                      alt={item.product.nameDe}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-gray-900">
                      {item.product.nameDe}
                    </p>
                    <p className="text-xs text-gray-500">Menge: {item.quantity}</p>
                  </div>
                  <p className="text-sm font-medium text-gray-900">
                    {formatPriceDe(item.price * item.quantity)}
                  </p>
                </div>
              ))}
              {order.items.length > 3 && (
                <p className="pl-14 text-sm text-gray-500">
                  + {order.items.length - 3} weitere Artikel
                </p>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

function WishlistTab({
  items,
  onRemove,
  onAddToCart,
}: {
  items: WishlistItem[]
  onRemove: (id: string) => Promise<void>
  onAddToCart: (item: WishlistItem) => void
}) {
  if (items.length === 0) {
    return (
      <div className="rounded-xl border border-gray-100 bg-white p-6 text-center shadow-sm sm:rounded-2xl sm:p-8">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 sm:h-20 sm:w-20">
          <Heart className="h-8 w-8 text-gray-400 sm:h-10 sm:w-10" />
        </div>
        <h2 className="mb-2 text-lg font-bold text-gray-900 sm:text-xl">Wunschliste ist leer</h2>
        <p className="mb-4 text-sm text-gray-600 sm:text-base">
          Füge Produkte hinzu, die Dir gefallen, um sie später einfacher wiederzufinden.
        </p>
        <Link
          href="/produkte"
          className="inline-flex items-center gap-2 rounded-xl bg-[#4ECCA3] px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#3BA88A] sm:px-6 sm:py-3 sm:text-base"
        >
          Produkte durchstöbern
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-3 sm:space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-gray-900 sm:text-xl">Wunschliste</h2>
        <span className="text-sm text-gray-600">
          {items.length} {items.length === 1 ? 'Artikel' : 'Artikel'}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
        {items.map((item) => (
          <div
            key={item.id}
            className="group overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm sm:rounded-2xl"
          >
            <div className="relative aspect-[4/3] bg-gray-100">
              <Image src={item.image} alt={item.name.de} fill className="object-cover" />
              <button
                onClick={async () => await onRemove(item.id)}
                className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 opacity-100 shadow-lg transition-opacity hover:bg-red-50 sm:opacity-0 sm:group-hover:opacity-100"
              >
                <Trash2 className="h-4 w-4 text-red-500" />
              </button>
            </div>
            <div className="p-3 sm:p-4">
              <h3 className="mb-1 line-clamp-1 text-sm font-medium text-gray-900 sm:text-base">
                {item.name.de}
              </h3>
              <p className="whitespace-nowrap text-base font-bold tabular-nums text-[#4ECCA3] sm:text-lg">
                {formatPriceDe(item.price)}
              </p>
              <button
                onClick={() => onAddToCart(item)}
                className="mt-2 flex w-full items-center justify-center gap-2 rounded-lg bg-[#4ECCA3] py-2 text-xs font-medium text-white transition-colors hover:bg-[#3BA88A] sm:mt-3 sm:rounded-xl sm:py-2.5 sm:text-sm"
              >
                <Plus className="h-4 w-4" />
                In den Warenkorb
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function AddressesTab() {
  const [addresses, setAddresses] = useState<Address[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingAddress, setEditingAddress] = useState<Address | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchAddresses()
  }, [])

  const fetchAddresses = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/addresses')
      if (!response.ok) throw new Error('Failed to fetch addresses')
      const data = await response.json()
      setAddresses(data)
    } catch (err) {
      setError('Adressen konnten nicht geladen werden')
      logError('Failed to fetch addresses', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (formData: Address) => {
    setIsSubmitting(true)
    setError(null)

    try {
      const url = editingAddress ? `/api/addresses?id=${editingAddress.id}` : '/api/addresses'
      const method = editingAddress ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const err = await response.json()
        throw new Error(err.error || 'Failed to save address')
      }

      await fetchAddresses()
      setShowForm(false)
      setEditingAddress(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ein Fehler ist aufgetreten')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Möchten Sie diese Adresse wirklich löschen?')) return

    try {
      const response = await fetch(`/api/addresses?id=${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) throw new Error('Failed to delete address')

      await fetchAddresses()
    } catch {
      setError('Adresse konnte nicht gelöscht werden')
    }
  }

  const handleEdit = (address: Address) => {
    setEditingAddress(address)
    setShowForm(true)
  }

  const handleAdd = () => {
    setEditingAddress(null)
    setShowForm(true)
  }

  if (isLoading) {
    return (
      <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm sm:rounded-2xl sm:p-8">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-gray-900 sm:text-xl">Adressen</h2>
          <p className="text-sm text-gray-500">Verwalte Deine Liefer- und Rechnungsadressen</p>
        </div>
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 rounded-lg bg-[#4ECCA3] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#3BA88A] sm:rounded-xl"
        >
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">Neue Adresse</span>
        </button>
      </div>

      {error && <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">{error}</div>}

      {addresses.length === 0 ? (
        <div className="rounded-xl border border-gray-100 bg-white p-6 text-center shadow-sm sm:rounded-2xl sm:p-8">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 sm:h-20 sm:w-20">
            <MapPin className="h-8 w-8 text-gray-400 sm:h-10 sm:w-10" />
          </div>
          <h3 className="mb-2 text-lg font-bold text-gray-900 sm:text-xl">Keine Adressen</h3>
          <p className="mb-4 text-sm text-gray-600 sm:text-base">
            Füge Adressen hinzu, um den Bestellvorgang zu beschleunigen.
          </p>
          <button
            onClick={handleAdd}
            className="inline-flex items-center gap-2 rounded-xl bg-[#4ECCA3] px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#3BA88A] sm:px-6 sm:py-3 sm:text-base"
          >
            <Plus className="h-4 w-4 sm:h-5 sm:w-5" />
            Adresse hinzufügen
          </button>
        </div>
      ) : (
        <div className="grid gap-3 sm:gap-4">
          {addresses.map((address) => (
            <div
              key={address.id}
              className={`rounded-xl border bg-white p-4 shadow-sm sm:rounded-2xl sm:p-6 ${
                address.isDefault ? 'border-[#4ECCA3]/30' : 'border-gray-100'
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <div className="mb-1 flex items-center gap-2">
                    <h3 className="truncate font-semibold text-gray-900">
                      {address.firstName} {address.lastName}
                    </h3>
                    {address.isDefault && (
                      <span className="shrink-0 rounded-full bg-[#4ECCA3]/10 px-2 py-0.5 text-xs font-medium text-[#0C211E]">
                        Standardadresse
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600">{address.street}</p>
                  {address.street2 && <p className="text-sm text-gray-600">{address.street2}</p>}
                  <p className="text-sm text-gray-600">
                    {address.zipCode} {address.city}
                  </p>
                  {address.state && <p className="text-xs text-gray-500">{address.state}</p>}
                  {address.phone && <p className="mt-1 text-xs text-gray-500">{address.phone}</p>}
                </div>
                <div className="flex shrink-0 flex-col gap-2">
                  <button
                    onClick={() => handleEdit(address)}
                    className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
                    title="Bearbeiten"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => address.id && handleDelete(address.id)}
                    className="rounded-lg p-2 text-red-400 transition-colors hover:bg-red-50 hover:text-red-600"
                    title="Löschen"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <AddressForm
          address={editingAddress ?? undefined}
          onSubmit={handleSubmit}
          onCancel={() => {
            setShowForm(false)
            setEditingAddress(null)
            setError(null)
          }}
          isSubmitting={isSubmitting}
        />
      )}
    </div>
  )
}

function SettingsTab({
  user,
}: {
  user: { name?: string | null; email?: string | null; role?: string } | null
}) {
  return (
    <div className="space-y-4 rounded-xl border border-gray-100 bg-white p-4 shadow-sm sm:space-y-6 sm:rounded-2xl sm:p-6">
      <h2 className="text-lg font-bold text-gray-900 sm:text-xl">Einstellungen</h2>

      <div className="space-y-3 sm:space-y-4">
        <div className="rounded-lg bg-gray-50 p-3 sm:rounded-xl sm:p-4">
          <label className="mb-1 block text-xs font-medium text-gray-700 sm:text-sm">Name</label>
          <p className="text-sm text-gray-900 sm:text-base">{user?.name}</p>
        </div>
        <div className="rounded-lg bg-gray-50 p-3 sm:rounded-xl sm:p-4">
          <label className="mb-1 block text-xs font-medium text-gray-700 sm:text-sm">E-Mail</label>
          <p className="text-sm text-gray-900 sm:text-base">{user?.email}</p>
        </div>
      </div>

      <div className="border-t pt-4 sm:pt-6">
        <h3 className="mb-3 text-sm font-medium text-gray-900 sm:mb-4 sm:text-base">Passwort</h3>
        <Link
          href="/passwort-vergessen"
          className="block w-full rounded-lg border-2 border-gray-200 py-2.5 text-center text-sm font-medium text-gray-700 transition-colors hover:border-[#4ECCA3] hover:text-[#4ECCA3] sm:rounded-xl sm:py-3 sm:text-base"
        >
          Passwort zurücksetzen
        </Link>
      </div>
    </div>
  )
}
