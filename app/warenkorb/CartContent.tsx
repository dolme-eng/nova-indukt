'use client'

import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Trash2, Plus, Minus, ShoppingCart, ArrowRight, Truck, Package, 
  ChevronRight, ArrowLeft, Lock, CheckCircle, RotateCcw
} from 'lucide-react'
import { useCart } from '@/lib/store/cart'
import { useState } from 'react'
import { Product } from '@/lib/data/products'
import { formatPriceDe } from '@/lib/utils/vat'
import { SHIPPING_COST, FREE_SHIPPING_THRESHOLD, calculateShipping } from '@/lib/constants/shop'

export interface CartContentProps {
  recommendedProducts?: Product[]
}

export function CartContent({ recommendedProducts = [] }: CartContentProps) {
  const isLocalProductImage = (src: string) => src.startsWith('/images/products/')
  const router = useRouter()
  const { items, totalItems, totalPrice, updateQuantity, removeItem, isHydrated } = useCart()
  const [removingItem, setRemovingItem] = useState<string | null>(null)
  const [showSuccessToast, setShowSuccessToast] = useState(false)

  const subtotal = totalPrice
  const shipping = calculateShipping(subtotal)
  const total = subtotal + shipping
  const freeShippingRemaining = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal)
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
    <div data-testid="cart-page" className="min-h-screen bg-gray-50/50 pb-20 selection:bg-[#4ECCA3]/30">
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
              <span className="text-[#0C211E] font-bold">Ihr Warenkorb</span>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12 max-w-7xl">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <h1 className="text-xl sm:text-2xl font-black text-[#0C211E] font-heading tracking-tight uppercase">
            {items.length > 0 ? `Ihr Warenkorb (${totalItems})` : 'Ihr Warenkorb'}
          </h1>
          
          {items.length > 0 && (
            <Link 
              href="/produkte" 
              className="hidden lg:flex items-center gap-1.5 text-gray-400 hover:text-[#0C211E] transition-colors font-bold text-xs group"
            >
              <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
              Weiter einkaufen
            </Link>
          )}
        </div>
        
        {items.length === 0 ? (
          <motion.div 
            data-testid="empty-cart"
            initial={{ opacity: 0, scale: 0.95 }} 
            animate={{ opacity: 1, scale: 1 }} 
            className="max-w-xl mx-auto text-center py-12 px-6 bg-white rounded-3xl shadow-sm border border-gray-100"
          >
            <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <ShoppingCart className="w-8 h-8 text-gray-300" />
            </div>
            <h2 className="text-xl font-bold text-[#0C211E] mb-2 font-heading">Ihr Warenkorb ist leer</h2>
            <p className="text-gray-400 mb-8 text-sm max-w-xs mx-auto font-medium">
              Entdecke unsere Premium-Produkte und füge Deine Favoriten hinzu.
            </p>
            <Link 
              href="/produkte" 
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#0C211E] text-white rounded-xl hover:bg-black transition-all duration-300 font-bold text-xs shadow-lg active:scale-95"
            >
              <Package className="w-4 h-4" />
              Weiter einkaufen
            </Link>
          </motion.div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
            
            {/* Cart Items Area */}
            <div className="flex-1 space-y-4 sm:space-y-6">
              
              <div className="bg-white rounded-[2rem] shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-gray-100/50 overflow-hidden divide-y divide-gray-100">
                {items.map((item) => (
                  <motion.div 
                    data-testid="cart-item"
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
                          unoptimized={isLocalProductImage(item.product.images[0])}
                          className="object-contain p-2 hover:scale-110 transition-transform duration-500 mix-blend-multiply" 
                          sizes="(max-width: 640px) 96px, 128px"
                        />
                      </Link>
                      
                      {/* Product Details */}
                      <div className="flex-1 min-w-0 flex flex-col justify-between py-1">
                        
                        <div className="flex items-start justify-between gap-4">
                          <Link 
                            href={`/produkt/${item.product.slug}`}
                            className="font-bold text-[#0C211E] hover:text-nova-600 transition-colors line-clamp-1 text-sm sm:text-base leading-tight pr-6 sm:pr-0"
                          >
                            {item.product.name.de}
                          </Link>
                          
                          <button 
                            data-testid="remove-cart-item"
                            onClick={() => handleRemoveItem(item.product.id)}
                            className="hidden sm:flex p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        
                        <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5 mt-1">
                          <span data-testid="cart-item-price" className="text-red-600 font-black text-sm sm:text-lg tabular-nums whitespace-nowrap">
                            {formatPriceDe(item.product.price)}
                          </span>
                          {item.product.oldPrice && (
                            <span className="text-[10px] font-bold text-gray-400 line-through tabular-nums whitespace-nowrap">
                              {formatPriceDe(item.product.oldPrice)}
                            </span>
                          )}
                        </div>

                        {/* Controls & Total Row */}
                        <div className="flex items-center justify-between mt-auto pt-4 border-t sm:border-t-0 sm:pt-0 border-gray-50">
                          
                          {/* Quantity selector */}
                          <div data-testid="cart-quantity-selector" className="flex items-center border border-gray-200 rounded-xl bg-white shadow-sm overflow-hidden h-10 sm:h-12 w-28 sm:w-32">
                            <button 
                              data-testid="quantity-decrease"
                              onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                              disabled={item.quantity <= 1}
                              className="w-10 h-full flex items-center justify-center hover:bg-gray-50 transition-colors disabled:opacity-40 disabled:hover:bg-transparent text-gray-600"
                            >
                              <Minus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                            </button>
                            <input
                              data-testid="cart-quantity-input"
                              type="text"
                              readOnly
                              value={item.quantity}
                              className="flex-1 w-full text-center bg-transparent font-bold text-sm sm:text-base text-[#0C211E] outline-none"
                            />
                            <button 
                              data-testid="quantity-increase"
                              onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                              disabled={item.quantity >= item.product.stock}
                              className="w-10 h-full flex items-center justify-center hover:bg-gray-50 transition-colors disabled:opacity-40 disabled:hover:bg-transparent text-gray-600"
                            >
                              <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                            </button>
                          </div>
                          
                          {/* Price Desktop */}
                          <div className="hidden sm:block text-right">
                            <span className="text-xs text-gray-400 font-bold uppercase tracking-wider block mb-1">Preis</span>
                            <span data-testid="cart-item-total" className="font-bold text-[#0C211E] tabular-nums whitespace-nowrap">
                              {formatPriceDe(item.product.price * item.quantity)}
                            </span>
                          </div>
                          
                          {/* Remove Button - Mobile */}
                          <button 
                            data-testid="remove-cart-item-mobile"
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
              {items.length > 0 && recommendedProducts.length > 0 && (
                <div className="mt-8 mb-4">
                  <h3 className="text-lg font-bold text-[#0C211E] mb-4 font-heading">Passend dazu</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {recommendedProducts.filter(p => !items.find(i => i.product.id === p.id)).slice(0, 2).map((item) => (
                      <Link href={`/produkt/${item.slug}`} key={item.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden flex items-center p-3 gap-3 shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-lg hover:border-[#4ECCA3]/40 transition-all group">
                        <div className="w-16 h-16 bg-gray-50 rounded-xl relative flex-shrink-0">
                          <Image src={item.images[0]} alt={item.name.de} fill unoptimized={isLocalProductImage(item.images[0])} className="object-contain p-2 mix-blend-multiply group-hover:scale-110 transition-transform duration-500" sizes="64px" />
                        </div>
                        <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2">
                                    <span data-testid="cart-item-price" className="font-black text-[#0C211E] tabular-nums text-sm">{formatPriceDe(item.price)}</span>
                                    {item.oldPrice && (
                                      <span className="text-[10px] text-gray-400 line-through tabular-nums decoration-red-200/50">{formatPriceDe(item.oldPrice)}</span>
                                    )}
                                  </div>
                          <p className="text-sm font-bold text-[#0C211E] line-clamp-2 leading-tight group-hover:text-[#4ECCA3] transition-colors">{item.name.de}</p>
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
              <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100 sticky top-32">
                <h2 className="font-bold text-[#0C211E] mb-4 text-xl font-heading flex items-center gap-2 uppercase tracking-tight">
                  Zusammenfassung
                </h2>
                
                {/* Free Shipping Progress - Compact */}
                <div className="mb-6 p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <div className="flex items-center justify-between mb-2 text-[10px] font-black uppercase tracking-wider">
                    <span className="text-gray-900 flex items-center gap-2">
                       {isFreeShipping ? <CheckCircle className="w-3 h-3 text-green-500"/> : <Truck className="w-3 h-3"/>}
                       {isFreeShipping ? 'Gratisversand!' : `Noch ${freeShippingRemaining.toFixed(2).replace('.', ',')}€`}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1 overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100)}%` }}
                      transition={{ duration: 1, ease: 'easeOut' }}
                      className={`h-full rounded-full ${isFreeShipping ? 'bg-green-500' : 'bg-nova-900'}`}
                    />
                  </div>
                </div>
                
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between items-center text-xs font-bold uppercase tracking-tight">
                    <span className="text-gray-400">Netto</span>
                    <span data-testid="cart-subtotal" className="text-gray-900 tabular-nums">{formatPriceDe(subtotal)}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs font-bold uppercase tracking-tight">
                    <span className="text-gray-400">Versand</span>
                    <span className={shipping === 0 ? 'text-green-600' : 'text-gray-900'}>
                      {shipping === 0 ? 'GRATIS' : formatPriceDe(shipping)}
                    </span>
                  </div>
                </div>

                <div className="border-t border-gray-100 pt-3 mb-4">
                  <div className="flex justify-between items-end mb-0.5">
                    <span className="font-black text-[#0C211E] text-[10px] uppercase tracking-tighter">Gesamt (Brutto)</span>
                    <span className="font-black text-xl tracking-tighter text-nova-900 tabular-nums">
                      {formatPriceDe(total)}
                    </span>
                  </div>
                  <p className="text-[10px] text-gray-400 text-right font-medium italic">inkl. 19% MwSt.</p>
                </div>

                <motion.button 
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => router.push('/kasse')}
                  className="w-full py-3 bg-[#0C211E] text-white font-black rounded-xl hover:bg-black transition-colors flex items-center justify-center gap-2 text-xs uppercase tracking-widest shadow-xl shadow-gray-900/10"
                >
                  <Lock className="w-3.5 h-3.5 opacity-70" /> Zur Kasse
                </motion.button>
                
                {/* Payments accepted */}
                <div className="mt-6 flex flex-wrap justify-center gap-3">
                   <div className="px-3 py-1 bg-gray-50 rounded border border-gray-100 text-[10px] font-bold text-gray-500 uppercase tracking-wider">Banküberweisung</div>
                </div>

              </div>
            </div>
          </div>
        )}
      </div>

      {/* Mobile Sticky Summary Bar - Ultra Compact */}
      {items.length > 0 && (
        <motion.div 
          initial={{ y: 150 }}
          animate={{ y: 0 }}
          className="fixed bottom-0 left-0 right-0 z-40 lg:hidden bg-white/95 backdrop-blur-xl border-t border-gray-100 pt-2 pb-safe shadow-[0_-10px_40px_rgba(0,0,0,0.06)]"
        >
          <div className="px-4 pb-2 flex items-center justify-between gap-4">
            <div>
              <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Gesamt</p>
              <p className="text-xl font-black text-[#0C211E] tracking-tighter tabular-nums">{formatPriceDe(total)}</p>
            </div>
            <motion.button 
              whileTap={{ scale: 0.96 }}
              onClick={() => router.push('/kasse')}
              className="flex-1 py-3 bg-[#0C211E] text-white font-black rounded-xl hover:bg-black transition-colors flex items-center justify-center gap-2 text-xs uppercase tracking-widest"
            >
              <Lock className="w-3.5 h-3.5" /> Kasse
            </motion.button>
          </div>
        </motion.div>
      )}
    </div>
  )
}
