'use client'

import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Link } from '@/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { 
  Trash2, Plus, Minus, ShoppingCart, ArrowRight, Truck, Shield, Package, 
  ChevronRight, ArrowLeft, Lock, Clock, CheckCircle
} from 'lucide-react'
import { useCart } from '@/lib/store/cart'
import { useState, useEffect } from 'react'

interface CartContentProps {
  locale: string
}

function CartContent({ locale }: CartContentProps) {
  const router = useRouter()
  const t = useTranslations('cart')
  const { items, totalItems, totalPrice, updateQuantity, removeItem, isHydrated } = useCart()
  const [removingItem, setRemovingItem] = useState<string | null>(null)
  const [showSuccessToast, setShowSuccessToast] = useState(false)

  const subtotal = totalPrice
  const shipping = subtotal > 500 ? 0 : 9.99
  const total = subtotal + shipping
  const freeShippingRemaining = Math.max(0, 500 - subtotal)

  // Show loading state while hydrating
  if (!isHydrated) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white border-b border-gray-200">
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <div className="w-4 h-4 bg-gray-200 rounded animate-pulse" />
              <div className="w-20 h-4 bg-gray-200 rounded animate-pulse" />
            </div>
          </div>
        </div>
        <div className="container mx-auto px-4 py-6 sm:py-8">
          <div className="w-40 h-8 bg-gray-200 rounded animate-pulse mb-6" />
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#4ECCA3]" />
          </div>
        </div>
      </div>
    )
  }

  const handleRemoveItem = (productId: string) => {
    setRemovingItem(productId)
    setTimeout(() => {
      removeItem(productId)
      setRemovingItem(null)
      setShowSuccessToast(true)
      setTimeout(() => setShowSuccessToast(false), 2000)
    }, 300)
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-32 lg:pb-8">
      {/* Success Toast */}
      <AnimatePresence>
        {showSuccessToast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 left-1/2 -translate-x-1/2 z-50 px-4 py-2 bg-gray-900 text-white text-sm rounded-full shadow-lg flex items-center gap-2"
          >
            <CheckCircle className="w-4 h-4" />
            {t('itemRemoved') || 'Item removed'}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Breadcrumbs */}
      <nav className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-2 py-3 text-sm">
            <Link href="/produkte" className="flex items-center gap-1 text-gray-500 hover:text-gray-900 transition-colors lg:hidden">
              <ArrowLeft className="w-4 h-4" />
              <span>{t('continue') || 'Continue shopping'}</span>
            </Link>
            <div className="hidden lg:flex items-center gap-2">
              <Link href="/" className="text-gray-500 hover:text-gray-900 transition-colors">{t('nav.home')}</Link>
              <ChevronRight className="w-4 h-4 text-gray-400" />
              <Link href="/produkte" className="text-gray-500 hover:text-gray-900 transition-colors">{t('products.title')}</Link>
              <ChevronRight className="w-4 h-4 text-gray-400" />
              <span className="text-gray-900 font-medium">{t('title')}</span>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-4 sm:py-6 lg:py-8">
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-4 sm:mb-6">
          {items.length > 0 ? t('titleWithCount', { count: totalItems }) : t('title')}
        </h1>
        
        {items.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl sm:rounded-2xl p-8 sm:p-12 text-center shadow-sm"
          >
            <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
              <ShoppingCart className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400" />
            </div>
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">{t('empty')}</h2>
            <p className="text-gray-600 mb-6 text-sm sm:text-base max-w-md mx-auto">
              {t('emptyDescription') || 'Discover our products and add your favorites to your cart.'}
            </p>
            <Link 
              href="/produkte" 
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#4ECCA3] text-white rounded-xl hover:bg-[#3BA88A] transition-colors font-medium text-sm sm:text-base"
            >
              <Package className="w-4 h-4 sm:w-5 sm:h-5" />
              {t('continue')}
            </Link>
          </motion.div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 lg:gap-8">
            {/* Cart Items */}
            <div className="flex-1 space-y-3 sm:space-y-4">
              {items.map((item, index) => (
                <motion.div 
                  key={item.product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ 
                    opacity: removingItem === item.product.id ? 0 : 1, 
                    y: removingItem === item.product.id ? -20 : 0,
                    height: removingItem === item.product.id ? 0 : 'auto'
                  }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white rounded-xl sm:rounded-2xl p-3 sm:p-4 shadow-sm border border-gray-100 overflow-hidden"
                >
                  <div className="flex gap-3 sm:gap-4">
                    {/* Product Image */}
                    <Link 
                      href={`/produkt/${item.product.slug}`}
                      className="relative w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28 bg-gray-100 rounded-lg flex-shrink-0 overflow-hidden"
                    >
                      <Image 
                        src={item.product.images[0]} 
                        alt={item.product.name[locale as 'de' | 'en' | 'fr']} 
                        fill 
                        className="object-cover hover:scale-105 transition-transform duration-300" 
                        sizes="(max-width: 640px) 80px, 112px"
                      />
                    </Link>
                    
                    {/* Product Info */}
                    <div className="flex-1 min-w-0 flex flex-col">
                      <div className="flex items-start justify-between gap-2">
                        <Link 
                          href={`/produkt/${item.product.slug}`}
                          className="font-medium text-gray-900 hover:text-[#4ECCA3] transition-colors line-clamp-2 text-sm sm:text-base"
                        >
                          {item.product.name[locale as 'de' | 'en' | 'fr']}
                        </Link>
                        {/* Remove Button - Desktop */}
                        <button 
                          onClick={() => handleRemoveItem(item.product.id)}
                          className="hidden sm:flex p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          title={t('remove')}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      
                      {/* Price */}
                      <div className="flex items-baseline gap-2 mt-1">
                        <span className="text-[#4ECCA3] font-bold text-base sm:text-lg">
                          {item.product.price.toFixed(2)} €
                        </span>
                        {item.product.oldPrice && (
                          <span className="text-xs sm:text-sm text-gray-400 line-through">
                            {item.product.oldPrice.toFixed(2)} €
                          </span>
                        )}
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center justify-between mt-auto pt-2">
                        <div className="flex items-center gap-1 sm:gap-2">
                          <button 
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                            className="w-8 h-8 sm:w-9 sm:h-9 bg-gray-100 rounded-lg flex items-center justify-center hover:bg-gray-200 transition-colors disabled:opacity-40 active:scale-95"
                          >
                            <Minus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                          </button>
                          <span className="w-10 sm:w-12 text-center font-semibold text-sm sm:text-base">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                            disabled={item.quantity >= item.product.stock}
                            className="w-8 h-8 sm:w-9 sm:h-9 bg-gray-100 rounded-lg flex items-center justify-center hover:bg-gray-200 transition-colors disabled:opacity-40 active:scale-95"
                          >
                            <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                          </button>
                        </div>
                        
                        {/* Line Total */}
                        <span className="font-semibold text-gray-900 text-sm sm:text-base">
                          {(item.product.price * item.quantity).toFixed(2)} €
                        </span>
                        
                        {/* Remove Button - Mobile */}
                        <button 
                          onClick={() => handleRemoveItem(item.product.id)}
                          className="sm:hidden p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          title={t('remove')}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}

              {/* Continue Shopping Link */}
              <Link 
                href="/produkte" 
                className="inline-flex items-center gap-2 text-gray-600 hover:text-[#4ECCA3] transition-colors text-sm sm:text-base py-2"
              >
                <ArrowLeft className="w-4 h-4" />
                {t('continue')}
              </Link>
            </div>
            
            {/* Summary - Desktop Sidebar */}
            <div className="hidden lg:block lg:w-96 flex-shrink-0">
              <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100 sticky top-24">
                <h2 className="font-semibold text-gray-900 mb-4 text-lg">{t('summary')}</h2>
                
                {/* Free Shipping Progress */}
                {freeShippingRemaining > 0 && (
                  <div className="mb-4 p-3 bg-blue-50 rounded-xl">
                    <p className="text-xs sm:text-sm text-blue-700 mb-2">
                      {t('freeShippingProgress', { amount: freeShippingRemaining.toFixed(2) })}
                    </p>
                    <div className="w-full bg-blue-200 rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full transition-all"
                        style={{ width: `${Math.min(100, (subtotal / 500) * 100)}%` }}
                      />
                    </div>
                  </div>
                )}
                
                <div className="space-y-3 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">{t('subtotal')}</span>
                    <span className="font-medium">{subtotal.toFixed(2)} €</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">{t('shipping')}</span>
                    <span className={shipping === 0 ? 'text-green-600 font-medium' : 'font-medium'}>
                      {shipping === 0 ? t('freeShipping') : `${shipping.toFixed(2)} €`}
                    </span>
                  </div>
                  <div className="border-t pt-3 flex justify-between font-bold text-lg">
                    <span>{t('total')}</span>
                    <span className="text-[#4ECCA3]">{total.toFixed(2)} €</span>
                  </div>
                  <p className="text-xs text-gray-500">
                    {t('vat')}
                  </p>
                </div>

                <motion.button 
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => router.push(`/${locale}/kasse`)}
                  className="w-full py-3.5 sm:py-4 bg-[#4ECCA3] text-white font-semibold rounded-xl hover:bg-[#3BA88A] transition-colors flex items-center justify-center gap-2 text-base shadow-lg shadow-[#4ECCA3]/20"
                >
                  {t('checkout')} <ArrowRight className="w-5 h-5" />
                </motion.button>

                {/* Trust Badges */}
                <div className="mt-4 pt-4 border-t space-y-2">
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Lock className="w-4 h-4 text-[#4ECCA3]" /> 
                    {t('securePayment')}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Truck className="w-4 h-4 text-[#4ECCA3]" /> 
                    {t('deliveryTime')}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Shield className="w-4 h-4 text-[#4ECCA3]" /> 
                    {t('warranty', { years: 2 })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Mobile Sticky Summary Bar */}
      {items.length > 0 && (
        <motion.div 
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          className="fixed bottom-0 left-0 right-0 z-40 lg:hidden bg-white border-t border-gray-200 px-4 py-3 shadow-lg"
        >
          <div className="flex items-center justify-between gap-4 mb-3">
            <div>
              <p className="text-xs text-gray-500">{t('total')}</p>
              <p className="text-xl font-bold text-[#4ECCA3]">{total.toFixed(2)} €</p>
            </div>
            <motion.button 
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push(`/${locale}/kasse`)}
              className="flex-1 max-w-xs py-3 bg-[#4ECCA3] text-white font-semibold rounded-xl hover:bg-[#3BA88A] transition-colors flex items-center justify-center gap-2 text-sm sm:text-base"
            >
              {t('checkout')} <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </motion.button>
          </div>
          
          {/* Free Shipping Progress - Mobile */}
          {freeShippingRemaining > 0 && (
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <Truck className="w-3.5 h-3.5" />
              <span>{t('freeShippingProgressShort', { amount: freeShippingRemaining.toFixed(2) })}</span>
            </div>
          )}
          {shipping === 0 && (
            <div className="flex items-center gap-2 text-xs text-green-600">
              <CheckCircle className="w-3.5 h-3.5" />
              <span>{t('freeShippingAchieved')}</span>
            </div>
          )}
        </motion.div>
      )}
    </div>
  )
}

export default function CartPage({ params }: { params: { locale: string } }) {
  return <CartContent locale={params.locale} />
}
