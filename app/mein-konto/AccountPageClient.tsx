'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Package, Heart, MapPin, CreditCard, Settings, User, LogOut, 
  ChevronRight, ShoppingBag, Bell, Menu, X, Trash2, Plus,
  Home, ArrowLeft, Pencil, Loader2
} from 'lucide-react'
import { AddressForm } from '@/components/address-form'
import { useAuth } from '@/lib/store/auth'
import { useCart } from '@/lib/store/cart'
import { useWishlist, WishlistItem } from '@/lib/store/wishlist'
import { products } from '@/lib/data/products'
import { formatPriceDe } from '@/lib/utils/vat'

const TABS = [
  { id: 'overview', label: 'Übersicht', icon: Home },
  { id: 'orders', label: 'Bestellungen', icon: Package },
  { id: 'wishlist', label: 'Wunschliste', icon: Heart },
  { id: 'addresses', label: 'Adressen', icon: MapPin },
  { id: 'payment', label: 'Zahlungsmethoden', icon: CreditCard },
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

  useEffect(() => { setMounted(true) }, [])

  useEffect(() => {
    // Fetch counts for overview
    async function fetchCounts() {
      try {
        const [ordersRes, addressesRes] = await Promise.all([
          fetch('/api/orders'),
          fetch('/api/addresses')
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
        console.error('Error fetching counts:', error)
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
    // Retrieve full product data from catalog
    const fullProduct = products.find(p => p.id === item.id)
    if (fullProduct) {
      addToCart(fullProduct, 1)
    }
  }

  if (!mounted || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50">
        <nav className="bg-white border-b border-gray-200">
          <div className="container mx-auto px-4">
            <div className="flex items-center gap-2 py-3 text-sm">
              <div className="animate-pulse h-4 w-20 bg-gray-200 rounded" />
            </div>
          </div>
        </nav>
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-2 border-[#4ECCA3]/30 border-t-[#4ECCA3] rounded-full animate-spin" />
        </div>
      </div>
    )
  }

  const renderTab = () => {
    switch (activeTab) {
      case 'overview': return <OverviewTab user={user} wishlistCount={wishlistCount} ordersCount={ordersCount} addressesCount={addressesCount} setActiveTab={setActiveTab} />
      case 'orders': return <OrdersTab />
      case 'wishlist': return <WishlistTab items={wishlistItems} onRemove={removeItem} onAddToCart={handleAddToCart} />
      case 'addresses': return <AddressesTab />
      case 'payment': return <PaymentTab />
      case 'settings': return <SettingsTab user={user} />
      default: return <OverviewTab user={user} wishlistCount={wishlistCount} ordersCount={ordersCount} addressesCount={addressesCount} setActiveTab={setActiveTab} />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <nav className="hidden lg:block bg-white border-b border-gray-200">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-2 py-3 text-sm">
            <Link href="/" className="text-gray-500 hover:text-gray-900 transition-colors">Startseite</Link>
            <ChevronRight className="w-4 h-4 text-gray-400" />
            <span className="text-gray-900 font-medium">Mein Konto</span>
          </div>
        </div>
      </nav>

      <div className="lg:hidden bg-white border-b sticky top-0 z-40">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <Link href="/" className="p-2 -ml-2 hover:bg-gray-100 rounded-full transition-colors">
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </Link>
            <h1 className="text-lg font-bold text-gray-900">Mein Konto</h1>
          </div>
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 -mr-2 hover:bg-gray-100 rounded-full transition-colors">
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="border-t overflow-hidden">
              <nav className="p-4 space-y-1">
                {TABS.map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => { setActiveTab(tab.id); setMobileMenuOpen(false) }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left ${activeTab === tab.id ? 'bg-[#4ECCA3]/10 text-[#4ECCA3]' : 'text-gray-600 hover:bg-gray-50'}`}
                  >
                    <tab.icon className="w-5 h-5" />
                    <span className="font-medium">{tab.label}</span>
                    {tab.id === 'wishlist' && wishlistCount > 0 && (
                      <span className="ml-auto bg-[#4ECCA3] text-white text-xs px-2 py-0.5 rounded-full">{wishlistCount}</span>
                    )}
                  </button>
                ))}
                <div className="pt-4 mt-4 border-t">
                  <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 text-red-600 rounded-xl hover:bg-red-50">
                    <LogOut className="w-5 h-5" />
                    <span className="font-medium">Abmelden</span>
                  </button>
                </div>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="container mx-auto px-4 py-4 sm:py-6 lg:py-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-4 lg:gap-8">
            <aside className="hidden lg:block w-72 flex-shrink-0">
              <div className="bg-white rounded-2xl shadow-sm overflow-hidden sticky top-24 border border-gray-100">
                <div className="p-6 bg-gradient-to-br from-[#4ECCA3] to-[#3BA88A]">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 lg:w-14 lg:h-14 bg-white rounded-full flex items-center justify-center shadow-sm">
                      <User className="w-6 h-6 lg:w-7 lg:h-7 text-[#4ECCA3]" />
                    </div>
                    <div className="text-white min-w-0">
                      <p className="font-semibold truncate">{user?.name}</p>
                      <p className="text-xs lg:text-sm text-white/80 truncate">{user?.email}</p>
                    </div>
                  </div>
                </div>

                <nav className="p-3 lg:p-4 space-y-1">
                  {TABS.map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center gap-3 px-3 lg:px-4 py-2.5 lg:py-3 rounded-xl text-left text-sm lg:text-base transition-colors ${activeTab === tab.id ? 'bg-[#4ECCA3]/10 text-[#4ECCA3] font-medium' : 'text-gray-600 hover:bg-gray-50'}`}
                    >
                      <tab.icon className="w-4 h-4 lg:w-5 lg:h-5" />
                      <span>{tab.label}</span>
                      {tab.id === 'wishlist' && wishlistCount > 0 && (
                        <span className="ml-auto bg-[#4ECCA3] text-white text-xs px-2 py-0.5 rounded-full">{wishlistCount}</span>
                      )}
                    </button>
                  ))}
                </nav>

                <div className="p-3 lg:p-4 border-t">
                  <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 lg:px-4 py-2.5 lg:py-3 text-red-600 rounded-xl hover:bg-red-50 transition-colors text-sm lg:text-base">
                    <LogOut className="w-4 h-4 lg:w-5 lg:h-5" />
                    <span className="font-medium">Abmelden</span>
                  </button>
                </div>
              </div>
            </aside>

            <main className="flex-1 min-w-0">{renderTab()}</main>
          </div>
        </div>
      </div>
    </div>
  )
}

// Tab Components
function OverviewTab({ user, wishlistCount, setActiveTab, ordersCount = 0, addressesCount = 0 }: any) {
  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm p-4 sm:p-6 border border-gray-100">
        <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-1">Willkommen, {user?.name?.split(' ')[0]}!</h2>
        <p className="text-gray-600 text-sm sm:text-base">Hier hast Du einen Überblick über Deine Aktivitäten.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <StatCard icon={ShoppingBag} label="Bestellungen" value={ordersCount.toString()} color="bg-blue-500" onClick={() => setActiveTab('orders')} />
        <StatCard icon={Heart} label="Wunschliste" value={wishlistCount.toString()} color="bg-pink-500" onClick={() => setActiveTab('wishlist')} />
        <StatCard icon={MapPin} label="Adressen" value={addressesCount.toString()} color="bg-green-500" onClick={() => setActiveTab('addresses')} />
        <StatCard icon={Bell} label="News" value="0" color="bg-orange-500" />
      </div>

      <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm p-6 sm:p-8 text-center border border-gray-100">
        <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Package className="w-7 h-7 sm:w-8 sm:h-8 text-gray-400" />
        </div>
        <h3 className="font-semibold text-gray-900 mb-2 text-base sm:text-lg">Keine Bestellungen</h3>
        <p className="text-gray-600 mb-4 text-sm sm:text-base">Du hast bisher noch keine Bestellungen getätigt.</p>
        <Link href="/produkte" className="inline-flex items-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-[#4ECCA3] text-white font-medium rounded-xl hover:bg-[#3BA88A] transition-colors text-sm sm:text-base">
          <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5" />
          Produkte durchstöbern
        </Link>
      </div>
    </div>
  )
}

function StatCard({ icon: Icon, label, value, color, onClick }: any) {
  return (
    <button onClick={onClick} className={`bg-white rounded-xl sm:rounded-2xl shadow-sm p-3 sm:p-4 text-left transition-transform active:scale-95 border border-gray-100 ${onClick ? 'cursor-pointer' : ''}`}>
      <div className={`w-8 h-8 sm:w-10 ${color} rounded-lg sm:rounded-xl flex items-center justify-center mb-2 sm:mb-3`}>
        <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
      </div>
      <p className="text-xl sm:text-2xl font-bold text-gray-900">{value}</p>
      <p className="text-xs sm:text-sm text-gray-600">{label}</p>
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
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchOrders()
  }, [])

  if (loading) {
    return (
      <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm p-6 sm:p-8 text-center border border-gray-100">
        <div className="w-8 h-8 border-2 border-[#4ECCA3]/30 border-t-[#4ECCA3] rounded-full animate-spin mx-auto" />
        <p className="mt-4 text-gray-600">Bestellungen werden geladen...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm p-6 sm:p-8 text-center border border-gray-100">
        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <Package className="w-8 h-8 sm:w-10 sm:h-10 text-red-400" />
        </div>
        <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">Fehler</h2>
        <p className="text-gray-600 text-sm sm:text-base">{error}</p>
      </div>
    )
  }

  if (orders.length === 0) {
    return (
      <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm p-6 sm:p-8 text-center border border-gray-100">
        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Package className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400" />
        </div>
        <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">Keine Bestellungen</h2>
        <p className="text-gray-600 text-sm sm:text-base">Du hast bisher noch keine Bestellungen getätigt.</p>
      </div>
    )
  }

  return (
    <div className="space-y-3 sm:space-y-4">
      <h2 className="text-lg sm:text-xl font-bold text-gray-900">Meine Bestellungen</h2>
      
      {orders.map(order => (
        <div key={order.id} className="bg-white rounded-xl sm:rounded-2xl shadow-sm overflow-hidden border border-gray-100">
          <div className="p-4 sm:p-6 border-b border-gray-100">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4">
              <div>
                <p className="text-xs sm:text-sm text-gray-500">Bestellnummer</p>
                <p className="font-mono font-medium text-[#0C211E]">{order.orderNumber}</p>
              </div>
              <div className="flex items-center gap-3 sm:gap-6">
                <div>
                  <p className="text-xs sm:text-sm text-gray-500">Datum</p>
                  <p className="text-sm text-gray-900">
                    {new Date(order.createdAt).toLocaleDateString('de-DE')}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs sm:text-sm text-gray-500">Gesamt</p>
                  <p className="text-base sm:text-lg font-bold text-[#4ECCA3]">{formatPriceDe(order.total)}</p>
                </div>
              </div>
            </div>
            <div className="mt-3 sm:mt-4">
              <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                order.status === 'completed' ? 'bg-green-100 text-green-800' :
                order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                order.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {order.status === 'pending' ? 'Ausstehend' :
                 order.status === 'processing' ? 'In Bearbeitung' :
                 order.status === 'completed' ? 'Abgeschlossen' :
                 order.status === 'cancelled' ? 'Storniert' : order.status}
              </span>
            </div>
          </div>
          
          <div className="p-4 sm:p-6 bg-gray-50/50">
            <p className="text-xs sm:text-sm font-medium text-gray-700 mb-3">
              {order.items.length} {order.items.length === 1 ? 'Artikel' : 'Artikel'}
            </p>
            <div className="space-y-3">
              {order.items.slice(0, 3).map(item => (
                <div key={item.id} className="flex items-center gap-3 sm:gap-4">
                  <img
                    src={item.product.images[0]?.url || '/placeholder.png'}
                    alt={item.product.nameDe}
                    className="w-12 h-12 sm:w-16 sm:h-16 object-cover rounded-lg bg-white"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 text-sm truncate">{item.product.nameDe}</p>
                    <p className="text-xs text-gray-500">Menge: {item.quantity}</p>
                  </div>
                  <p className="text-sm font-medium text-gray-900">{formatPriceDe(item.price * item.quantity)}</p>
                </div>
              ))}
              {order.items.length > 3 && (
                <p className="text-sm text-gray-500 pl-14">+ {order.items.length - 3} weitere Artikel</p>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

function WishlistTab({ items, onRemove, onAddToCart }: { items: WishlistItem[], onRemove: (id: string) => Promise<void>, onAddToCart: (item: WishlistItem) => void }) {
  if (items.length === 0) {
    return (
      <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm p-6 sm:p-8 text-center border border-gray-100">
        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Heart className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400" />
        </div>
        <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">Wunschliste ist leer</h2>
        <p className="text-gray-600 mb-4 text-sm sm:text-base">Füge Produkte hinzu, die Dir gefallen, um sie später einfacher wiederzufinden.</p>
        <Link href="/produkte" className="inline-flex items-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-[#4ECCA3] text-white font-medium rounded-xl hover:bg-[#3BA88A] transition-colors text-sm sm:text-base">
          Produkte durchstöbern
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-3 sm:space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg sm:text-xl font-bold text-gray-900">Wunschliste</h2>
        <span className="text-sm text-gray-600">{items.length} {items.length === 1 ? 'Artikel' : 'Artikel'}</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        {items.map(item => (
          <div key={item.id} className="bg-white rounded-xl sm:rounded-2xl shadow-sm overflow-hidden group border border-gray-100">
            <div className="relative aspect-[4/3] bg-gray-100">
              <img src={item.image} alt={item.name.de} className="w-full h-full object-cover" />
              <button onClick={async () => await onRemove(item.id)} className="absolute top-2 right-2 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center shadow-lg opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity hover:bg-red-50">
                <Trash2 className="w-4 h-4 text-red-500" />
              </button>
            </div>
            <div className="p-3 sm:p-4">
              <h3 className="font-medium text-gray-900 line-clamp-1 mb-1 text-sm sm:text-base">{item.name.de}</h3>
              <p className="text-base sm:text-lg font-bold text-[#4ECCA3] tabular-nums whitespace-nowrap">{formatPriceDe(item.price)}</p>
              <button onClick={() => onAddToCart(item)} className="w-full mt-2 sm:mt-3 py-2 sm:py-2.5 bg-[#4ECCA3] text-white text-xs sm:text-sm font-medium rounded-lg sm:rounded-xl hover:bg-[#3BA88A] transition-colors flex items-center justify-center gap-2">
                <Plus className="w-4 h-4" />
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
  const [addresses, setAddresses] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingAddress, setEditingAddress] = useState<any>(null)
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
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (formData: any) => {
    setIsSubmitting(true)
    setError(null)
    
    try {
      const url = editingAddress 
        ? `/api/addresses?id=${editingAddress.id}` 
        : '/api/addresses'
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
    } catch (err) {
      setError('Adresse konnte nicht gelöscht werden')
    }
  }

  const handleEdit = (address: any) => {
    setEditingAddress(address)
    setShowForm(true)
  }

  const handleAdd = () => {
    setEditingAddress(null)
    setShowForm(true)
  }

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm p-6 sm:p-8 border border-gray-100">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-gray-900">Adressen</h2>
          <p className="text-sm text-gray-500">Verwalte Deine Liefer- und Rechnungsadressen</p>
        </div>
        <button 
          onClick={handleAdd}
          className="px-4 py-2 bg-[#4ECCA3] text-white text-sm font-medium rounded-lg sm:rounded-xl hover:bg-[#3BA88A] transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">Neue Adresse</span>
        </button>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">{error}</div>
      )}

      {addresses.length === 0 ? (
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm p-6 sm:p-8 text-center border border-gray-100">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <MapPin className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400" />
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">Keine Adressen</h3>
          <p className="text-gray-600 mb-4 text-sm sm:text-base">Füge Adressen hinzu, um den Bestellvorgang zu beschleunigen.</p>
          <button 
            onClick={handleAdd}
            className="inline-flex items-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-[#4ECCA3] text-white font-medium rounded-xl hover:bg-[#3BA88A] transition-colors text-sm sm:text-base"
          >
            <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
            Adresse hinzufügen
          </button>
        </div>
      ) : (
        <div className="grid gap-3 sm:gap-4">
          {addresses.map((address) => (
            <div 
              key={address.id} 
              className={`bg-white rounded-xl sm:rounded-2xl shadow-sm p-4 sm:p-6 border ${
                address.isDefaultShipping || address.isDefaultBilling 
                  ? 'border-[#4ECCA3]/30' 
                  : 'border-gray-100'
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-gray-900 truncate">{address.name}</h3>
                    {address.isDefaultShipping && (
                      <span className="shrink-0 px-2 py-0.5 bg-[#4ECCA3]/10 text-[#0C211E] text-xs font-medium rounded-full">
                        Lieferung
                      </span>
                    )}
                    {address.isDefaultBilling && (
                      <span className="shrink-0 px-2 py-0.5 bg-blue-50 text-blue-700 text-xs font-medium rounded-full">
                        Rechnung
                      </span>
                    )}
                  </div>
                  <p className="text-gray-600 text-sm">{address.street}</p>
                  {address.street2 && <p className="text-gray-600 text-sm">{address.street2}</p>}
                  <p className="text-gray-600 text-sm">{address.postalCode} {address.city}</p>
                  {address.state && <p className="text-gray-500 text-xs">{address.state}</p>}
                  {address.phone && <p className="text-gray-500 text-xs mt-1">{address.phone}</p>}
                </div>
                <div className="flex flex-col gap-2 shrink-0">
                  <button
                    onClick={() => handleEdit(address)}
                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    title="Bearbeiten"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(address.id)}
                    className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Löschen"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <AddressForm 
          address={editingAddress}
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

function PaymentTab() {
  return (
    <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm p-6 sm:p-8 text-center border border-gray-100">
      <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <CreditCard className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400" />
      </div>
      <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">Zahlungsmethoden</h2>
      <p className="text-gray-600 mb-4 text-sm sm:text-base">Hinterlege Deine bevorzugten Zahlungsmethoden.</p>
      <button className="inline-flex items-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-[#4ECCA3] text-white font-medium rounded-xl hover:bg-[#3BA88A] transition-colors text-sm sm:text-base">
        <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
        Zahlungsmethode hinzufügen
      </button>
    </div>
  )
}

function SettingsTab({ user }: { user: any }) {
  return (
    <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm p-4 sm:p-6 space-y-4 sm:space-y-6 border border-gray-100">
      <h2 className="text-lg sm:text-xl font-bold text-gray-900">Einstellungen</h2>
      
      <div className="space-y-3 sm:space-y-4">
        <div className="p-3 sm:p-4 bg-gray-50 rounded-lg sm:rounded-xl">
          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Name</label>
          <p className="text-sm sm:text-base text-gray-900">{user?.name}</p>
        </div>
        <div className="p-3 sm:p-4 bg-gray-50 rounded-lg sm:rounded-xl">
          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">E-Mail</label>
          <p className="text-sm sm:text-base text-gray-900">{user?.email}</p>
        </div>
      </div>

      <div className="pt-4 sm:pt-6 border-t">
        <h3 className="font-medium text-gray-900 mb-3 sm:mb-4 text-sm sm:text-base">Passwort</h3>
        <button className="w-full py-2.5 sm:py-3 border-2 border-gray-200 text-gray-700 font-medium rounded-lg sm:rounded-xl hover:border-[#4ECCA3] hover:text-[#4ECCA3] transition-colors text-sm sm:text-base">
          Passwort zurücksetzen
        </button>
      </div>
    </div>
  )
}
