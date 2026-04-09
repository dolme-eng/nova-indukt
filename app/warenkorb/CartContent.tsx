'use client'

import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Trash2, Plus, Minus, ShoppingCart, ArrowRight, Truck, Shield, Package, 
  ChevronRight, ArrowLeft, Lock, Clock, CheckCircle, Info, RotateCcw
} from 'lucide-react'
import { useCart } from '@/lib/store/cart'
import { useState, useEffect } from 'react'
import { products } from '@/lib/data/products'
import { formatPriceDe } from '@/lib/utils/vat'

export function CartContent() {
  const router = useRouter()
  const { items, totalItems, totalPrice, updateQuantity, removeItem, isHydrated } = useCart()
  const [removingItem, setRemovingItem] = useState<string | null>(null)
  const [showSuccessToast, setShowSuccessToast] = useState(false)

  const subtotal = totalPrice
  const shipping = subtotal > 500 ? 0 : 9.99
  const total = subtotal + shipping
  const freeShippingRemaining = Math.max(0, 500 - subtotal)
  const isFreeShipping = shipping === 0

  // Show loading state while hydrating
  if (!isHydrated) {
    return (
      <div className="min-h-screen bg-gray-50/50">
        <div className="bg-white/80 backdrop-blur-sm border-b border-gray-100">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 bg-gray-200 rounded animate-pulse" />
              <div className="w-24 h-5 bg-gray-200 rounded animate-pulse" />
            </div>
          </div>
        </div>
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          <div className="w-48 h-10 bg-gray-200 rounded-lg animate-pulse mb-8" />
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-4 border-gray-100 border-t-[#0C211E]" />
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
      setTimeout(() => setShowSuccessToast(false), 3000)
    }, 400)
  }

  return (
    <div className="min-h-screen bg-gray-50/50 pb-32 lg:pb-16 selection:bg-[#4ECCA3]/30">
            {/* Success Toast */}
      <AnimatePresence>
        {showSuccessToast && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-24 left-1/2 -translate-x-1/2 z-50 px-6 py-3 bg-[#0C211E] text-white text-sm font-bold rounded-2xl shadow-xl flex items-center gap-3 border border-[#17423C]"
          >
            <div className="w-6 h-6 rounded-full bg-[#4ECCA3]/20 flex items-center justify-center">
              <CheckCircle className="w-4 h-4 text-[#4ECCA3]" />
            </div>
            Artikel aus dem Warenkorb entfernt
          </motion.div>
        )}
      </AnimatePresence>

      {/* Breadcrumbs */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-[72px] lg:top-[88px] z-30 shadow-[0_4px_20px_rgb(0,0,0,0.02)]">
        <div className="container mx-auto px-4 sm:px-6 max-w-7xl">
          <div className="flex items-center gap-2 py-4 text-xs sm:text-sm font-medium tracking-wide">
            <Link href="/produkte" className="flex items-center gap-1.5 text-gray-500 hover:text-gray-900 transition-colors lg:hidden bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100">
              <ArrowLeft className="w-4 h-4" />
              <span>Weiter einkaufen</span>
            </Link>
            <div className="hidden lg:flex items-center gap-2.5">
              <Link href="/" className="text-gray-400 hover:text-[#4ECCA3] transition-colors">Startseite</Link>
              <ChevronRight className="w-3.5 h-3.5 text-gray-300" />
              <Link href="/produkte" className="text-gray-400 hover:text-[#4ECCA3] transition-colors">Produkte</Link>
              <ChevronRight className="w-3.5 h-3.5 text-gray-300" />
              <span className="text-[#0C211E] font-bold">Dein Warenkorb</span>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12 max-w-7xl">
        <div className="flex items-center justify-between mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#0C211E] font-heading tracking-tight">
            {items.length > 0 ? `Dein Warenkorb (${totalItems})` : 'Dein Warenkorb'}
          </h1>
          
          {items.length > 0 && (
            <Link 
              href="/produkte" 
              className="hidden lg:flex items-center gap-2 text-gray-500 hover:text-[#0C211E] transition-colors font-bold group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              Weiter einkaufen
            </Link>
          )}
        </div>
        
        {items.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-[2.5rem] p-12 sm:p-20 text-center shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100/50"
          >
            <div className="w-24 h-24 sm:w-32 sm:h-32 bg-gray-50 rounded-[2rem] flex items-center justify-center mx-auto mb-8 transform -rotate-6">
              <ShoppingCart className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#0C211E] mb-4 font-heading">Dein Warenkorb ist leer</h2>
            <p className="text-gray-500 mb-10 text-base sm:text-lg max-w-md mx-auto font-medium">
              Entdecke unsere Premium-Produkte und füge Deine Favoriten hinzu.
            </p>
            <Link 
              href="/produkte" 
              className="inline-flex items-center gap-3 px-8 py-4 bg-[#0C211E] text-white rounded-2xl hover:bg-[#17423C] transition-all duration-300 font-bold text-lg shadow-xl shadow-[#0C211E]/20 hover:-translate-y-1"
            >
              <Package className="w-5 h-5" />
              Weiter einkaufen
            </Link>
          </motion.div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
            
            {/* Cart Items Area */}
            <div className="flex-1 space-y-4 sm:space-y-6">
              
              <div className="bg-white rounded-[2rem] shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-gray-100/50 overflow-hidden divide-y divide-gray-100">
                {items.map((item, index) => (
                  <motion.div 
                    key={item.product.id}
                    initial={{ opacity: 0 }}
                    animate={{ 
                      opacity: removingItem === item.product.id ? 0 : 1, 
                      x: removingItem === item.product.id ? -50 : 0,
                      height: removingItem === item.product.id ? 0 : 'auto',
                      marginBottom: removingItem === item.product.id ? 0 : 'auto'
                    }}
                    transition={{ duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
                    className="p-5 sm:p-8 relative bg-white group hover:bg-gray-50/50 transition-colors"
                  >
                    <div className="flex gap-4 sm:gap-6 lg:gap-8">
                      {/* Product Image */}
                      <Link 
                        href={`/produkt/${item.product.slug}`}
                        className="relative w-24 h-24 sm:w-32 sm:h-32 bg-gray-50 rounded-2xl flex-shrink-0 overflow-hidden border border-gray-100"
                      >
                        <Image 
                          src={item.product.images[0]} 
                          alt={item.product.name.de} 
                          fill 
                          className="object-contain p-2 hover:scale-110 transition-transform duration-500 mix-blend-multiply" 
                          sizes="(max-width: 640px) 96px, 128px"
                        />
                      </Link>
                      
                      {/* Product Details */}
                      <div className="flex-1 min-w-0 flex flex-col justify-between py-1">
                        
                        <div className="flex items-start justify-between gap-4">
                          <Link 
                            href={`/produkt/${item.product.slug}`}
                            className="font-bold text-[#0C211E] hover:text-[#4ECCA3] transition-colors line-clamp-2 text-base sm:text-xl leading-tight pr-6 sm:pr-0"
                          >
                            {item.product.name.de}
                          </Link>
                          
                          {/* Remove Button - Desktop */}
                          <button 
                            onClick={() => handleRemoveItem(item.product.id)}
                            className="hidden sm:flex p-2.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                            title="Entfernen"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                        
                        {/* Price Display */}
                        <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5 mt-2 sm:mt-1">
                          <span className="text-[#0C211E] font-black text-lg sm:text-xl tracking-tight tabular-nums whitespace-nowrap">
                            {formatPriceDe(item.product.price)}
                          </span>
                          {item.product.oldPrice && (
                            <span className="text-sm font-semibold text-gray-400 line-through decoration-gray-300 tabular-nums whitespace-nowrap">
                              {formatPriceDe(item.product.oldPrice)}
                            </span>
                          )}
                        </div>

                        {/* Controls & Total Row */}
                        <div className="flex items-center justify-between mt-auto pt-4 border-t sm:border-t-0 sm:pt-0 border-gray-50">
                          
                          {/* Quantity selector */}
                          <div className="flex items-center border border-gray-200 rounded-xl bg-white shadow-sm overflow-hidden h-10 sm:h-12 w-28 sm:w-32">
                            <button 
                              onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                              disabled={item.quantity <= 1}
                              className="w-10 h-full flex items-center justify-center hover:bg-gray-50 transition-colors disabled:opacity-40 disabled:hover:bg-transparent text-gray-600"
                            >
                              <Minus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                            </button>
                            <span className="flex-1 text-center font-bold text-sm sm:text-base text-[#0C211E]">{item.quantity}</span>
                            <button 
                              onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                              disabled={item.quantity >= item.product.stock}
                              className="w-10 h-full flex items-center justify-center hover:bg-gray-50 transition-colors disabled:opacity-40 disabled:hover:bg-transparent text-gray-600"
                            >
                              <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                            </button>
                          </div>
                          
                          {/* Subtotal Desktop */}
                          <div className="hidden sm:block text-right">
                            <span className="text-xs text-gray-400 font-bold uppercase tracking-wider block mb-1">Summe</span>
                            <span className="font-black text-[#0C211E] text-lg sm:text-xl tabular-nums whitespace-nowrap">
                              {formatPriceDe(item.product.price * item.quantity)}
                            </span>
                          </div>
                          
                          {/* Remove Button - Mobile */}
                          <button 
                            onClick={() => handleRemoveItem(item.product.id)}
                            className="sm:hidden p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors bg-white border border-gray-100"
                            title="Entfernen"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>

                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
              
              {/* Trust Badges under cart */}
              <div className="bg-white rounded-2xl p-6 border border-gray-100 flex flex-col sm:flex-row items-center justify-center sm:justify-between gap-4 text-sm font-bold text-gray-500 mb-8">
                <div className="flex items-center gap-2"><Lock className="w-5 h-5 text-gray-400"/> SSL - Verschlüsselt</div>
                <div className="hidden sm:block w-1.5 h-1.5 rounded-full bg-gray-200"/>
                <div className="flex items-center gap-2"><Truck className="w-5 h-5 text-gray-400"/> DHL & DPD Express</div>
                <div className="hidden sm:block w-1.5 h-1.5 rounded-full bg-gray-200"/>
                <div className="flex items-center gap-2"><RotateCcw className="w-5 h-5 text-gray-400"/> 30 Tage Rückgabe</div>
              </div>

              {/* Cross-Selling / Recommended */}
              {items.length > 0 && (
                <div className="mt-8 mb-4">
                  <h3 className="text-lg font-bold text-[#0C211E] mb-4 font-heading">Passend dazu</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {products.filter(p => !items.find(i => i.product.id === p.id)).slice(0, 2).map((item) => (
                      <Link href={`/produkt/${item.slug}`} key={item.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden flex items-center p-3 gap-3 shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-lg hover:border-[#4ECCA3]/40 transition-all group">
                        <div className="w-16 h-16 bg-gray-50 rounded-xl relative flex-shrink-0">
                          <Image src={item.images[0]} alt={item.name.de} fill className="object-contain p-2 mix-blend-multiply group-hover:scale-110 transition-transform duration-500" sizes="64px" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-[#0C211E] line-clamp-2 leading-tight group-hover:text-[#4ECCA3] transition-colors">{item.name.de}</p>
                          <p className="text-[#0C211E] font-black text-sm mt-1 tabular-nums whitespace-nowrap">{formatPriceDe(item.price)}</p>
                        </div>
                        <div className="w-8 h-8 rounded-full bg-gray-50 border border-gray-200 flex items-center justify-center text-[#0C211E] group-hover:bg-[#4ECCA3] group-hover:text-white group-hover:border-[#4ECCA3] transition-colors flex-shrink-0 mr-1">
                          <ArrowRight className="w-4 h-4" />
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

            </div>
            
            {/* Order Summary - Desktop Sidebar */}
            <div className="hidden lg:block lg:w-[420px] flex-shrink-0">
              <div className="bg-white rounded-[2.5rem] p-8 shadow-[0_8px_40px_rgb(0,0,0,0.06)] border border-gray-100 sticky top-32">
                <h2 className="font-bold text-[#0C211E] mb-6 text-2xl font-heading flex items-center gap-3">
                  Zusammenfassung
                </h2>
                
                {/* Free Shipping Progress */}
                <div className="mb-8 p-5 bg-gradient-to-br from-green-50 to-[#F0FFF9] rounded-2xl border border-green-100/50">
                  <div className="flex items-center justify-between mb-3 text-sm font-bold">
                    <span className="text-green-700 flex items-center gap-2">
                       {isFreeShipping ? <CheckCircle className="w-4 h-4"/> : <Truck className="w-4 h-4"/>}
                       {isFreeShipping ? 'Kostenloser Versand erreicht!' : `Noch ${freeShippingRemaining.toFixed(2).replace('.', ',')}€ bis zum kostenlosen Versand`}
                    </span>
                  </div>
                  <div className="w-full bg-green-200/50 rounded-full h-2.5 overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(100, (subtotal / 500) * 100)}%` }}
                      transition={{ duration: 1, ease: 'easeOut' }}
                      className={`h-full rounded-full relative ${isFreeShipping ? 'bg-green-500' : 'bg-gradient-to-r from-emerald-400 to-[#4ECCA3]'}`}
                    >
                      {!isFreeShipping && (
                        <div className="absolute inset-0 bg-white/20 w-full h-full animate-[shimmer_2s_infinite]" style={{ backgroundImage: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent)' }} />
                      )}
                    </motion.div>
                  </div>
                </div>
                
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between items-center text-[15px] font-medium">
                    <span className="text-gray-500">Zwischensumme</span>
                    <span className="text-gray-900 tabular-nums whitespace-nowrap">{formatPriceDe(subtotal)}</span>
                  </div>
                  <div className="flex justify-between items-center text-[15px] font-medium">
                    <span className="text-gray-500">Versand</span>
                    <span className={shipping === 0 ? 'text-green-600 font-bold px-2 py-0.5 bg-green-50 rounded-md' : 'text-gray-900'}>
                      {shipping === 0 ? 'Kostenlos' : formatPriceDe(shipping)}
                    </span>
                  </div>
                </div>

                <div className="border-t border-gray-100 py-6 my-2">
                  <div className="flex justify-between items-end mb-1">
                    <span className="font-bold text-[#0C211E] text-xl">Gesamtsumme</span>
                    <span className="font-black text-2xl sm:text-3xl tracking-tight text-[#0C211E] tabular-nums whitespace-nowrap">
                      {formatPriceDe(total)}
                    </span>
                  </div>
                  <p className="text-[11px] font-bold text-gray-400 flex justify-end items-center gap-1">
                    Inkl. 19% MwSt.
                  </p>
                </div>

                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => router.push('/kasse')}
                  className="w-full py-4 bg-[#0C211E] text-white font-bold rounded-2xl hover:bg-[#17423C] transition-colors flex items-center justify-center gap-3 text-lg shadow-xl shadow-[#0C211E]/20"
                >
                  <Lock className="w-4 h-4 opacity-70" /> Zur Kasse
                </motion.button>
                
                {/* Payments accepted icon placeholder */}
                <div className="mt-6 flex justify-center gap-2">
                   {/* This could be actual payment icons later */}
                   <div className="h-6 w-10 bg-gray-100 rounded border border-gray-200"></div>
                   <div className="h-6 w-10 bg-gray-100 rounded border border-gray-200"></div>
                   <div className="h-6 w-10 bg-gray-100 rounded border border-gray-200"></div>
                   <div className="h-6 w-10 bg-gray-100 rounded border border-gray-200"></div>
                </div>

              </div>
            </div>
          </div>
        )}
      </div>

      {/* Mobile Sticky Summary Bar */}
      {items.length > 0 && (
        <motion.div 
          initial={{ y: 150 }}
          animate={{ y: 0 }}
          className="fixed bottom-0 left-0 right-0 z-40 lg:hidden bg-white/95 backdrop-blur-xl border-t border-gray-100 pt-3 pb-safe shadow-[0_-10px_40px_rgba(0,0,0,0.06)]"
        >
          {/* Mobile Free shipping toast */}
          <div className="px-4 mb-2">
            <div className={`flex items-center justify-center gap-2 text-xs font-bold py-1.5 px-3 rounded-md ${isFreeShipping ? 'bg-green-50 text-green-700' : 'bg-gray-50 text-gray-600'}`}>
              {isFreeShipping ? <CheckCircle className="w-3.5 h-3.5" /> : <Truck className="w-3.5 h-3.5" />}
              <span>{isFreeShipping ? 'Kostenloser Versand erreicht!' : `Noch ${freeShippingRemaining.toFixed(2).replace('.', ',')}€`}</span>
            </div>
          </div>
          
          <div className="px-4 pb-4 flex items-center justify-between gap-4">
            <div>
              <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Gesamtsumme</p>
              <p className="text-xl sm:text-2xl font-black text-[#0C211E] tracking-tight tabular-nums whitespace-nowrap">{formatPriceDe(total)}</p>
            </div>
            <motion.button 
              whileTap={{ scale: 0.96 }}
              onClick={() => router.push('/kasse')}
              className="flex-[1.5] max-w-xs py-3.5 bg-[#0C211E] text-white font-bold rounded-xl hover:bg-[#17423C] transition-colors flex items-center justify-center gap-2 text-base shadow-xl shadow-[#0C211E]/20"
            >
              <Lock className="w-4 h-4 opacity-70" /> Zur Kasse
            </motion.button>
          </div>
        </motion.div>
      )}
    </div>
  )
}
