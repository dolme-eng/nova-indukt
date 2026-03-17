'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { 
  Package, Heart, MapPin, CreditCard, Settings, User, LogOut, 
  ChevronRight, ShoppingBag, Bell, Menu, X, Trash2, Plus,
  Home, Search, ArrowLeft
} from 'lucide-react'
import { useAuth } from '@/lib/store/auth'
import { useCart } from '@/lib/store/cart'

// Wishlist store with localStorage
interface WishlistItem {
  id: string
  name: { de: string; en: string; fr: string }
  price: number
  image: string
  slug: string
}

function useWishlist() {
  const [items, setItems] = useState<WishlistItem[]>([])
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const saved = localStorage.getItem('nova-wishlist')
    if (saved) setItems(JSON.parse(saved))
  }, [])

  useEffect(() => {
    if (mounted) localStorage.setItem('nova-wishlist', JSON.stringify(items))
  }, [items, mounted])

  const removeItem = (id: string) => setItems(items.filter(i => i.id !== id))
  
  return { items, removeItem, count: items.length, mounted }
}

const TABS = [
  { id: 'overview', labelKey: 'overview', icon: Home },
  { id: 'orders', labelKey: 'orders', icon: Package },
  { id: 'wishlist', labelKey: 'wishlist', icon: Heart },
  { id: 'addresses', labelKey: 'addresses', icon: MapPin },
  { id: 'payment', labelKey: 'payment', icon: CreditCard },
  { id: 'settings', labelKey: 'settings', icon: Settings },
]

export default function AccountPage() {
  const t = useTranslations('account')
  const router = useRouter()
  const { user, isAuthenticated, logout } = useAuth()
  const { items: wishlistItems, removeItem, count: wishlistCount } = useWishlist()
  const { addItem: addToCart } = useCart()
  
  const [activeTab, setActiveTab] = useState('overview')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  useEffect(() => {
    if (mounted && !isAuthenticated) router.push('/anmelden')
  }, [mounted, isAuthenticated, router])

  const handleLogout = () => {
    logout()
    router.push('/')
  }

  const handleAddToCart = (item: WishlistItem) => {
    addToCart({ 
      id: item.id, 
      name: item.name, 
      price: item.price, 
      images: [item.image], 
      slug: item.slug,
      category: 'zubehoer',
      rating: 5,
      reviewCount: 0,
      shortDescription: { de: '', en: '', fr: '' },
      description: { de: '', en: '', fr: '' },
      specs: { material: '', dimensions: '', weight: '', dishwasher: false, induction: false },
      stock: 1
    }, 1)
  }

  if (!mounted || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Breadcrumbs */}
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
      case 'overview': return <OverviewTab user={user} wishlistCount={wishlistCount} setActiveTab={setActiveTab} />
      case 'orders': return <OrdersTab />
      case 'wishlist': return <WishlistTab items={wishlistItems} onRemove={removeItem} onAddToCart={handleAddToCart} />
      case 'addresses': return <AddressesTab />
      case 'payment': return <PaymentTab />
      case 'settings': return <SettingsTab user={user} />
      default: return <OverviewTab user={user} wishlistCount={wishlistCount} setActiveTab={setActiveTab} />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Breadcrumbs - Desktop */}
      <nav className="hidden lg:block bg-white border-b border-gray-200">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-2 py-3 text-sm">
            <Link href="/" className="text-gray-500 hover:text-gray-900 transition-colors">{t('nav.home')}</Link>
            <ChevronRight className="w-4 h-4 text-gray-400" />
            <span className="text-gray-900 font-medium">{t('title')}</span>
          </div>
        </div>
      </nav>

      {/* Mobile Header */}
      <div className="lg:hidden bg-white border-b sticky top-0 z-40">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <Link href="/" className="p-2 -ml-2 hover:bg-gray-100 rounded-full transition-colors">
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </Link>
            <h1 className="text-lg font-bold text-gray-900">{t('title')}</h1>
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
                    <span className="font-medium">{t(tab.labelKey)}</span>
                    {tab.id === 'wishlist' && wishlistCount > 0 && (
                      <span className="ml-auto bg-[#4ECCA3] text-white text-xs px-2 py-0.5 rounded-full">{wishlistCount}</span>
                    )}
                  </button>
                ))}
                <div className="pt-4 mt-4 border-t">
                  <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 text-red-600 rounded-xl hover:bg-red-50">
                    <LogOut className="w-5 h-5" />
                    <span className="font-medium">{t('logout')}</span>
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
            {/* Desktop Sidebar */}
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
                      <span>{t(tab.labelKey)}</span>
                      {tab.id === 'wishlist' && wishlistCount > 0 && (
                        <span className="ml-auto bg-[#4ECCA3] text-white text-xs px-2 py-0.5 rounded-full">{wishlistCount}</span>
                      )}
                    </button>
                  ))}
                </nav>

                <div className="p-3 lg:p-4 border-t">
                  <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 lg:px-4 py-2.5 lg:py-3 text-red-600 rounded-xl hover:bg-red-50 transition-colors text-sm lg:text-base">
                    <LogOut className="w-4 h-4 lg:w-5 lg:h-5" />
                    <span className="font-medium">{t('logout')}</span>
                  </button>
                </div>
              </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 min-w-0">{renderTab()}</main>
          </div>
        </div>
      </div>
    </div>
  )
}

// Tab Components
function OverviewTab({ user, wishlistCount, setActiveTab }: any) {
  const t = useTranslations('account')
  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm p-4 sm:p-6 border border-gray-100">
        <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-1">{t('welcome')}, {user?.name?.split(' ')[0]}! 👋</h2>
        <p className="text-gray-600 text-sm sm:text-base">{t('overview')}</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <StatCard icon={ShoppingBag} label={t('orders')} value="0" color="bg-blue-500" onClick={() => setActiveTab('orders')} />
        <StatCard icon={Heart} label={t('wishlist')} value={wishlistCount.toString()} color="bg-pink-500" onClick={() => setActiveTab('wishlist')} />
        <StatCard icon={MapPin} label={t('addresses')} value="0" color="bg-green-500" onClick={() => setActiveTab('addresses')} />
        <StatCard icon={Bell} label="News" value="0" color="bg-orange-500" />
      </div>

      <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm p-6 sm:p-8 text-center border border-gray-100">
        <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Package className="w-7 h-7 sm:w-8 sm:h-8 text-gray-400" />
        </div>
        <h3 className="font-semibold text-gray-900 mb-2 text-base sm:text-lg">{t('noOrders')}</h3>
        <p className="text-gray-600 mb-4 text-sm sm:text-base">{t('overview')}</p>
        <Link href="/produkte" className="inline-flex items-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-[#4ECCA3] text-white font-medium rounded-xl hover:bg-[#3BA88A] transition-colors text-sm sm:text-base">
          <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5" />
          {t('browseProducts')}
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

function OrdersTab() {
  const t = useTranslations('account')
  return (
    <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm p-6 sm:p-8 text-center border border-gray-100">
      <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <Package className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400" />
      </div>
      <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">{t('noOrders')}</h2>
      <p className="text-gray-600 text-sm sm:text-base">{t('overview')}</p>
    </div>
  )
}

function WishlistTab({ items, onRemove, onAddToCart }: { items: WishlistItem[], onRemove: (id: string) => void, onAddToCart: (item: WishlistItem) => void }) {
  const t = useTranslations('account')
  const tw = useTranslations('wishlist')
  const tc = useTranslations('cart')
  if (items.length === 0) {
    return (
      <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm p-6 sm:p-8 text-center border border-gray-100">
        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Heart className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400" />
        </div>
        <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">{t('noWishlist')}</h2>
        <p className="text-gray-600 mb-4 text-sm sm:text-base">{t('noWishlistHint')}</p>
        <Link href="/produkte" className="inline-flex items-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-[#4ECCA3] text-white font-medium rounded-xl hover:bg-[#3BA88A] transition-colors text-sm sm:text-base">
          {t('browseProducts')}
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-3 sm:space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg sm:text-xl font-bold text-gray-900">{t('wishlist')}</h2>
        <span className="text-sm text-gray-600">{items.length} {items.length === 1 ? tw('item') : tw('items')}</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        {items.map(item => (
          <div key={item.id} className="bg-white rounded-xl sm:rounded-2xl shadow-sm overflow-hidden group border border-gray-100">
            <div className="relative aspect-[4/3] bg-gray-100">
              <Image src={item.image} alt={item.name.de} fill className="object-cover" sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw" />
              <button onClick={() => onRemove(item.id)} className="absolute top-2 right-2 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center shadow-lg opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity hover:bg-red-50">
                <Trash2 className="w-4 h-4 text-red-500" />
              </button>
            </div>
            <div className="p-3 sm:p-4">
              <h3 className="font-medium text-gray-900 line-clamp-1 mb-1 text-sm sm:text-base">{item.name.de}</h3>
              <p className="text-base sm:text-lg font-bold text-[#4ECCA3]">{item.price.toFixed(2)} €</p>
              <button onClick={() => onAddToCart(item)} className="w-full mt-2 sm:mt-3 py-2 sm:py-2.5 bg-[#4ECCA3] text-white text-xs sm:text-sm font-medium rounded-lg sm:rounded-xl hover:bg-[#3BA88A] transition-colors flex items-center justify-center gap-2">
                <Plus className="w-4 h-4" />
                {tc('addToCart')}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function AddressesTab() {
  const t = useTranslations('account')
  return (
    <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm p-6 sm:p-8 text-center border border-gray-100">
      <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <MapPin className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400" />
      </div>
      <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">{t('addresses')}</h2>
      <p className="text-gray-600 mb-4 text-sm sm:text-base">{t('noWishlistHint')}</p>
      <button className="inline-flex items-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-[#4ECCA3] text-white font-medium rounded-xl hover:bg-[#3BA88A] transition-colors text-sm sm:text-base">
        <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
        {t('addresses')}
      </button>
    </div>
  )
}

function PaymentTab() {
  const t = useTranslations('account')
  return (
    <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm p-6 sm:p-8 text-center border border-gray-100">
      <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <CreditCard className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400" />
      </div>
      <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">{t('payment')}</h2>
      <p className="text-gray-600 mb-4 text-sm sm:text-base">{t('noWishlistHint')}</p>
      <button className="inline-flex items-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-[#4ECCA3] text-white font-medium rounded-xl hover:bg-[#3BA88A] transition-colors text-sm sm:text-base">
        <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
        {t('payment')}
      </button>
    </div>
  )
}

function SettingsTab({ user }: { user: any }) {
  const t = useTranslations('account')
  return (
    <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm p-4 sm:p-6 space-y-4 sm:space-y-6 border border-gray-100">
      <h2 className="text-lg sm:text-xl font-bold text-gray-900">{t('settings')}</h2>
      
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
