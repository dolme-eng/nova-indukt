'use client'

import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Trash2,
  Plus,
  Minus,
  ShoppingCart,
  ArrowRight,
  Truck,
  Package,
  ChevronRight,
  ArrowLeft,
  Lock,
  CheckCircle,
  RotateCcw,
} from 'lucide-react'
import { useCart } from '@/lib/store/cart'
import { useState } from 'react'
import { Product } from '@/lib/data/products'
import { formatPriceDe } from '@/lib/utils/vat'
import { calculateShipping, FREE_SHIPPING_THRESHOLD } from '@/lib/constants/shop'

export interface CartContentProps {
  recommendedProducts?: Product[]
}

export function CartContent({ recommendedProducts = [] }: CartContentProps) {
  const isLocalProductImage = (src: string) => src?.startsWith('/images/products/') ?? false
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
        <div className="border-b border-gray-100 bg-white/80 backdrop-blur-sm">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center gap-3">
              <div className="h-5 w-5 animate-pulse rounded bg-gray-200" />
              <div className="h-5 w-24 animate-pulse rounded bg-gray-200" />
            </div>
          </div>
        </div>
        <div className="container mx-auto max-w-7xl px-4 py-8">
          <div className="mb-8 h-10 w-48 animate-pulse rounded-lg bg-gray-200" />
          <div className="flex items-center justify-center py-20">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-100 border-t-[#0C211E]" />
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
    <div
      data-testid="cart-page"
      className="min-h-screen bg-gray-50/50 pb-20 selection:bg-[#4ECCA3]/30"
    >
      {/* Success Toast */}
      <AnimatePresence>
        {showSuccessToast && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed left-1/2 top-24 z-50 flex -translate-x-1/2 items-center gap-3 rounded-2xl border border-[#17423C] bg-[#0C211E] px-6 py-3 text-sm font-bold text-white shadow-xl"
          >
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#4ECCA3]/20">
              <CheckCircle className="h-4 w-4 text-[#4ECCA3]" />
            </div>
            Artikel aus dem Warenkorb entfernt
          </motion.div>
        )}
      </AnimatePresence>

      {/* Breadcrumbs */}
      <nav className="sticky top-[72px] z-30 border-b border-gray-100 bg-white/80 shadow-[0_4px_20px_rgb(0,0,0,0.02)] backdrop-blur-md lg:top-[88px]">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex items-center gap-2 py-4 text-xs font-medium tracking-wide sm:text-sm">
            <Link
              href="/produkte"
              className="flex items-center gap-1.5 rounded-full border border-gray-100 bg-gray-50 px-3 py-1.5 text-gray-500 transition-colors hover:text-gray-900 lg:hidden"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Weiter einkaufen</span>
            </Link>
            <div className="hidden items-center gap-2.5 lg:flex">
              <Link href="/" className="text-gray-400 transition-colors hover:text-[#4ECCA3]">
                Startseite
              </Link>
              <ChevronRight className="h-3.5 w-3.5 text-gray-300" />
              <Link
                href="/produkte"
                className="text-gray-400 transition-colors hover:text-[#4ECCA3]"
              >
                Produkte
              </Link>
              <ChevronRight className="h-3.5 w-3.5 text-gray-300" />
              <span className="font-bold text-[#0C211E]">Ihr Warenkorb</span>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12">
        <div className="mb-4 flex items-center justify-between sm:mb-6">
          <h1 className="font-heading text-xl font-black uppercase tracking-tight text-[#0C211E] sm:text-2xl">
            {items.length > 0 ? `Ihr Warenkorb (${totalItems})` : 'Ihr Warenkorb'}
          </h1>

          {items.length > 0 && (
            <Link
              href="/produkte"
              className="group hidden items-center gap-1.5 text-xs font-bold text-gray-400 transition-colors hover:text-[#0C211E] lg:flex"
            >
              <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" />
              Weiter einkaufen
            </Link>
          )}
        </div>

        {items.length === 0 ? (
          <motion.div
            data-testid="empty-cart"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mx-auto max-w-xl rounded-3xl border border-gray-100 bg-white px-6 py-12 text-center shadow-sm"
          >
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-50">
              <ShoppingCart className="h-8 w-8 text-gray-300" />
            </div>
            <h2 className="mb-2 font-heading text-xl font-bold text-[#0C211E]">
              Ihr Warenkorb ist leer
            </h2>
            <p className="mx-auto mb-8 max-w-xs text-sm font-medium text-gray-400">
              Entdecke unsere Premium-Produkte und füge Deine Favoriten hinzu.
            </p>
            <Link
              href="/produkte"
              className="inline-flex items-center gap-2 rounded-xl bg-[#0C211E] px-6 py-3 text-xs font-bold text-white shadow-lg transition-all duration-300 hover:bg-black active:scale-95"
            >
              <Package className="h-4 w-4" />
              Weiter einkaufen
            </Link>
          </motion.div>
        ) : (
          <div className="flex flex-col gap-8 lg:flex-row lg:gap-12">
            {/* Cart Items Area */}
            <div className="flex-1 space-y-4 sm:space-y-6">
              <div className="divide-y divide-gray-100 overflow-hidden rounded-[2rem] border border-gray-100/50 bg-white shadow-[0_4px_20px_rgb(0,0,0,0.03)]">
                {items.map((item) => (
                  <motion.div
                    data-testid="cart-item"
                    key={item.product.id}
                    initial={{ opacity: 0 }}
                    animate={{
                      opacity: removingItem === item.product.id ? 0 : 1,
                      x: removingItem === item.product.id ? -50 : 0,
                      height: removingItem === item.product.id ? 0 : 'auto',
                      marginBottom: removingItem === item.product.id ? 0 : 'auto',
                    }}
                    transition={{ duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
                    className="group relative bg-white p-5 transition-colors hover:bg-gray-50/50 sm:p-8"
                  >
                    <div className="flex gap-4 sm:gap-6 lg:gap-8">
                      {/* Product Image */}
                      <Link
                        href={`/produkt/${item.product.slug}`}
                        className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-2xl border border-gray-100 bg-gray-50 sm:h-32 sm:w-32"
                      >
                        <Image
                          src={item.product.images[0]}
                          alt={item.product.name.de}
                          fill
                          unoptimized={isLocalProductImage(item.product.images[0])}
                          className="object-contain p-2 mix-blend-multiply transition-transform duration-500 hover:scale-110"
                          sizes="(max-width: 640px) 96px, 128px"
                        />
                      </Link>

                      {/* Product Details */}
                      <div className="flex min-w-0 flex-1 flex-col justify-between py-1">
                        <div className="flex items-start justify-between gap-4">
                          <Link
                            href={`/produkt/${item.product.slug}`}
                            className="line-clamp-1 pr-6 text-sm font-bold leading-tight text-[#0C211E] transition-colors hover:text-nova-600 sm:pr-0 sm:text-base"
                          >
                            {item.product.name.de}
                          </Link>

                          <button
                            data-testid="remove-cart-item"
                            onClick={() => handleRemoveItem(item.product.id)}
                            className="hidden rounded-lg p-2 text-gray-400 transition-all hover:bg-red-50 hover:text-red-500 sm:flex"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>

                        <div className="mt-1 flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                          <span
                            data-testid="cart-item-price"
                            className="whitespace-nowrap text-sm font-black tabular-nums text-red-600 sm:text-lg"
                          >
                            {formatPriceDe(item.product.price)}
                          </span>
                          {item.product.oldPrice && (
                            <span className="whitespace-nowrap text-[10px] font-bold tabular-nums text-gray-400 line-through">
                              {formatPriceDe(item.product.oldPrice)}
                            </span>
                          )}
                        </div>

                        {/* Controls & Total Row */}
                        <div className="mt-auto flex items-center justify-between border-t border-gray-50 pt-4 sm:border-t-0 sm:pt-0">
                          {/* Quantity selector */}
                          <div
                            data-testid="cart-quantity-selector"
                            className="flex h-10 w-28 items-center overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm sm:h-12 sm:w-32"
                          >
                            <button
                              data-testid="quantity-decrease"
                              onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                              disabled={item.quantity <= 1}
                              className="flex h-full w-10 items-center justify-center text-gray-600 transition-colors hover:bg-gray-50 disabled:opacity-40 disabled:hover:bg-transparent"
                            >
                              <Minus className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                            </button>
                            <input
                              data-testid="cart-quantity-input"
                              type="text"
                              readOnly
                              value={item.quantity}
                              className="w-full flex-1 bg-transparent text-center text-sm font-bold text-[#0C211E] outline-none sm:text-base"
                            />
                            <button
                              data-testid="quantity-increase"
                              onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                              className="flex h-full w-10 items-center justify-center text-gray-600 transition-colors hover:bg-gray-50"
                            >
                              <Plus className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                            </button>
                          </div>

                          {/* Price Desktop */}
                          <div className="hidden text-right sm:block">
                            <span className="mb-1 block text-xs font-bold uppercase tracking-wider text-gray-400">
                              Preis
                            </span>
                            <span
                              data-testid="cart-item-total"
                              className="whitespace-nowrap font-bold tabular-nums text-[#0C211E]"
                            >
                              {formatPriceDe(item.product.price * item.quantity)}
                            </span>
                          </div>

                          {/* Remove Button - Mobile */}
                          <button
                            data-testid="remove-cart-item-mobile"
                            onClick={() => handleRemoveItem(item.product.id)}
                            className="rounded-lg border border-gray-100 bg-white p-2 text-red-500 transition-colors hover:bg-red-50 sm:hidden"
                            title="Entfernen"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Trust Badges under cart */}
              <div className="mb-8 flex flex-col items-center justify-center gap-4 rounded-2xl border border-gray-100 bg-white p-6 text-sm font-bold text-gray-500 sm:flex-row sm:justify-between">
                <div className="flex items-center gap-2">
                  <Lock className="h-5 w-5 text-gray-400" /> SSL - Verschlüsselt
                </div>
                <div className="hidden h-1.5 w-1.5 rounded-full bg-gray-200 sm:block" />
                <div className="flex items-center gap-2">
                  <Truck className="h-5 w-5 text-gray-400" /> DHL & DPD Express
                </div>
                <div className="hidden h-1.5 w-1.5 rounded-full bg-gray-200 sm:block" />
                <div className="flex items-center gap-2">
                  <RotateCcw className="h-5 w-5 text-gray-400" /> 30 Tage Rückgabe
                </div>
              </div>

              {/* Cross-Selling / Recommended */}
              {items.length > 0 && recommendedProducts.length > 0 && (
                <div className="mb-4 mt-8">
                  <h3 className="mb-4 font-heading text-lg font-bold text-[#0C211E]">
                    Passend dazu
                  </h3>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {recommendedProducts
                      .filter((p) => !items.find((i) => i.product.id === p.id))
                      .slice(0, 2)
                      .map((item) => (
                        <Link
                          href={`/produkt/${item.slug}`}
                          key={item.id}
                          className="group flex items-center gap-3 overflow-hidden rounded-2xl border border-gray-100 bg-white p-3 shadow-[0_4px_20px_rgb(0,0,0,0.03)] transition-all hover:border-[#4ECCA3]/40 hover:shadow-lg"
                        >
                          <div className="relative h-16 w-16 flex-shrink-0 rounded-xl bg-gray-50">
                            <Image
                              src={item.images[0]}
                              alt={item.name.de}
                              fill
                              unoptimized={isLocalProductImage(item.images[0])}
                              className="object-contain p-2 mix-blend-multiply transition-transform duration-500 group-hover:scale-110"
                              sizes="64px"
                            />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                              <span
                                data-testid="cart-item-price"
                                className="text-sm font-black tabular-nums text-[#0C211E]"
                              >
                                {formatPriceDe(item.price)}
                              </span>
                              {item.oldPrice && (
                                <span className="text-[10px] tabular-nums text-gray-400 line-through decoration-red-200/50">
                                  {formatPriceDe(item.oldPrice)}
                                </span>
                              )}
                            </div>
                            <p className="line-clamp-2 text-sm font-bold leading-tight text-[#0C211E] transition-colors group-hover:text-[#4ECCA3]">
                              {item.name.de}
                            </p>
                          </div>
                          <div className="mr-1 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border border-gray-200 bg-gray-50 text-[#0C211E] transition-colors group-hover:border-[#4ECCA3] group-hover:bg-[#4ECCA3] group-hover:text-white">
                            <ArrowRight className="h-4 w-4" />
                          </div>
                        </Link>
                      ))}
                  </div>
                </div>
              )}
            </div>

            {/* Order Summary - Desktop Sidebar */}
            <div className="hidden flex-shrink-0 lg:block lg:w-[420px]">
              <div className="sticky top-32 rounded-3xl border border-gray-100 bg-white p-5 shadow-sm">
                <h2 className="mb-4 flex items-center gap-2 font-heading text-xl font-bold uppercase tracking-tight text-[#0C211E]">
                  Zusammenfassung
                </h2>

                {/* Free Shipping Progress - Compact */}
                <div className="mb-6 rounded-xl border border-gray-100 bg-gray-50 p-4">
                  <div className="mb-2 flex items-center justify-between text-[10px] font-black uppercase tracking-wider">
                    <span className="flex items-center gap-2 text-gray-900">
                      {isFreeShipping ? (
                        <CheckCircle className="h-3 w-3 text-green-500" />
                      ) : (
                        <Truck className="h-3 w-3" />
                      )}
                      {isFreeShipping
                        ? 'Gratisversand!'
                        : `Noch ${freeShippingRemaining.toFixed(2).replace('.', ',')}€`}
                    </span>
                  </div>
                  <div className="h-1 w-full overflow-hidden rounded-full bg-gray-200">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{
                        width: `${Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100)}%`,
                      }}
                      transition={{ duration: 1, ease: 'easeOut' }}
                      className={`h-full rounded-full ${isFreeShipping ? 'bg-green-500' : 'bg-nova-900'}`}
                    />
                  </div>
                </div>

                <div className="mb-4 space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold uppercase tracking-tight">
                    <span className="text-gray-400">Zwischensumme</span>
                    <span data-testid="cart-subtotal" className="tabular-nums text-gray-900">
                      {formatPriceDe(subtotal)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs font-bold uppercase tracking-tight">
                    <span className="text-gray-400">Versand</span>
                    <span className={shipping === 0 ? 'text-green-600' : 'text-gray-900'}>
                      {shipping === 0 ? 'GRATIS' : formatPriceDe(shipping)}
                    </span>
                  </div>
                </div>

                <div className="mb-4 border-t border-gray-100 pt-3">
                  <div className="mb-0.5 flex items-end justify-between">
                    <span className="text-[10px] font-black uppercase tracking-tighter text-[#0C211E]">
                      Gesamt (Brutto)
                    </span>
                    <span className="text-xl font-black tabular-nums tracking-tighter text-nova-900">
                      {formatPriceDe(total)}
                    </span>
                  </div>
                  <p className="text-right text-[10px] font-medium italic text-gray-400">
                    inkl. 19% MwSt.
                  </p>
                </div>

                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => router.push('/kasse')}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#0C211E] py-3 text-xs font-black uppercase tracking-widest text-white shadow-xl shadow-gray-900/10 transition-colors hover:bg-black"
                >
                  <Lock className="h-3.5 w-3.5 opacity-70" /> Zur Kasse
                </motion.button>

                {/* Payments accepted */}
                <div className="mt-6 flex flex-wrap justify-center gap-3">
                  <div className="rounded border border-gray-100 bg-gray-50 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-gray-500">
                    Banküberweisung
                  </div>
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
          className="pb-safe fixed bottom-0 left-0 right-0 z-40 border-t border-gray-100 bg-white/95 pt-2 shadow-[0_-10px_40px_rgba(0,0,0,0.06)] backdrop-blur-xl lg:hidden"
        >
          <div className="flex items-center justify-between gap-4 px-4 pb-2">
            <div>
              <p className="text-[9px] font-black uppercase tracking-widest text-gray-400">
                Gesamt
              </p>
              <p className="text-xl font-black tabular-nums tracking-tighter text-[#0C211E]">
                {formatPriceDe(total)}
              </p>
            </div>
            <motion.button
              whileTap={{ scale: 0.96 }}
              onClick={() => router.push('/kasse')}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#0C211E] py-3 text-xs font-black uppercase tracking-widest text-white transition-colors hover:bg-black"
            >
              <Lock className="h-3.5 w-3.5" /> Kasse
            </motion.button>
          </div>
        </motion.div>
      )}
    </div>
  )
}
