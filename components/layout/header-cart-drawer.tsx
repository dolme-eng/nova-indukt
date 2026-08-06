'use client'

import { useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { ShoppingCart, X, Trash2, Plus, Minus, Check, Truck, Lock, Shield } from 'lucide-react'
import { formatPriceDe } from '@/lib/utils/vat'
import type { CartItem } from '@/lib/store/cart'
import { FREE_SHIPPING_THRESHOLD } from '@/lib/constants/shop'
import { useFocusTrap } from '@/lib/hooks/use-focus-trap'

interface CartDrawerProps {
  isOpen: boolean
  onClose: () => void
  items: CartItem[]
  totalItems: number
  totalPrice: number
  removeItem: (id: string) => void
  updateQuantity: (id: string, qty: number) => void
}

export function CartDrawer({
  isOpen,
  onClose,
  items,
  totalItems,
  totalPrice,
  removeItem,
  updateQuantity,
}: CartDrawerProps) {
  const closeButtonRef = useRef<HTMLButtonElement>(null)

  const { containerRef } = useFocusTrap<HTMLDivElement>({
    isOpen,
    onClose,
  })

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[110] bg-black/40 backdrop-blur-sm"
          />

          {/* Drawer */}
          <motion.div
            ref={containerRef}
            data-testid="cart-drawer"
            role="dialog"
            aria-modal="true"
            aria-label="Warenkorb"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 200 }}
            className="fixed bottom-0 right-0 top-0 z-[120] flex w-full flex-col bg-white shadow-2xl sm:w-[420px] md:w-[480px]"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-gray-100 p-6">
              <h2 className="flex items-center gap-2 font-heading text-xl font-bold text-[#0C211E]">
                <ShoppingCart className="h-6 w-6 text-[#4ECCA3]" /> Warenkorb ({totalItems})
              </h2>
              <button
                ref={closeButtonRef}
                onClick={onClose}
                aria-label="Warenkorb schließen"
                className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full text-gray-400 transition-all hover:bg-gray-100 hover:text-gray-900"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto bg-white p-6">
              {items.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center space-y-6 py-8 text-center">
                  <div className="flex h-24 w-24 items-center justify-center rounded-full bg-[#4ECCA3]/10">
                    <ShoppingCart className="h-10 w-10 text-[#4ECCA3]/40" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-heading text-2xl font-bold text-[#0C211E]">
                      Ihr Warenkorb ist leer
                    </h3>
                    <p className="max-w-[300px] text-sm text-gray-500">
                      Entdecken Sie unsere Premium-Kochgeschirr-Kollektion und finden Sie Ihr neues
                      Lieblingsstück.
                    </p>
                  </div>
                  <div className="flex w-full max-w-[300px] flex-col gap-3 sm:flex-row">
                    <Link
                      href="/produkte"
                      onClick={onClose}
                      className="flex-1 rounded-xl bg-[#0C211E] px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-[#0C211E]/20 transition-all hover:bg-[#17423C]"
                    >
                      Zum Shop
                    </Link>
                    <Link
                      href="/produkte?bestseller=true"
                      onClick={onClose}
                      className="flex-1 rounded-xl border border-gray-200 bg-white px-6 py-3.5 text-sm font-bold text-[#0C211E] transition-colors hover:bg-gray-50"
                    >
                      Bestseller
                    </Link>
                  </div>
                  <div className="mt-2 flex items-center gap-2 text-xs text-gray-400">
                    <Truck className="h-3.5 w-3.5" /> Kostenloser Versand ab 500 €
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <AnimatePresence>
                    {items.map((item) => (
                      <motion.div
                        data-testid="cart-item"
                        layout
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        key={item.product.id}
                        className="flex gap-4 bg-white"
                      >
                        <Link
                          href={`/produkt/${item.product.slug}`}
                          onClick={onClose}
                          className="group relative h-24 w-24 flex-shrink-0 rounded-2xl border border-gray-50 bg-gray-50 p-2 transition-colors hover:border-[#4ECCA3]"
                        >
                          <Image
                            src={item.product.images[0] || '/images/placeholder-product.jpg'}
                            alt={item.product.name.de}
                            fill
                            className="object-contain p-2 mix-blend-multiply transition-transform group-hover:scale-110"
                          />
                        </Link>

                        <div className="flex flex-1 flex-col justify-between py-1">
                          <div className="flex justify-between gap-2">
                            <div>
                              <h4 className="line-clamp-2 text-sm font-bold leading-snug text-[#0C211E]">
                                <Link
                                  href={`/produkt/${item.product.slug}`}
                                  onClick={onClose}
                                  className="transition-colors hover:text-[#4ECCA3]"
                                >
                                  {item.product.name.de}
                                </Link>
                              </h4>
                              <p
                                data-testid="cart-item-price"
                                className="mt-1 whitespace-nowrap text-sm font-black tabular-nums text-[#0C211E]"
                              >
                                {formatPriceDe(item.product.price)}
                              </p>
                            </div>
                            <button
                              onClick={() => removeItem(item.product.id)}
                              aria-label={`${item.product.name.de} entfernen`}
                              className="self-start p-1 text-gray-400 transition-colors hover:text-red-500"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>

                          <div className="flex items-center gap-3">
                            <div className="flex items-center rounded-xl border border-gray-100 bg-gray-50 p-1">
                              <button
                                onClick={() =>
                                  updateQuantity(item.product.id, Math.max(1, item.quantity - 1))
                                }
                                aria-label="Menge verringern"
                                className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-500 shadow-sm transition-colors hover:bg-white"
                              >
                                <Minus className="h-4 w-4" />
                              </button>
                              <input
                                data-testid="cart-quantity-input"
                                type="text"
                                readOnly
                                value={item.quantity}
                                aria-label={`Anzahl: ${item.quantity}`}
                                className="w-8 bg-transparent text-center text-sm font-bold text-gray-900 outline-none"
                              />
                              <button
                                onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                                aria-label="Menge erhöhen"
                                className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-500 shadow-sm transition-colors hover:bg-white"
                              >
                                <Plus className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>

                  {/* Shipping progress */}
                  <div className="mt-8 border-t border-gray-100 pt-6">
                    {totalPrice < FREE_SHIPPING_THRESHOLD ? (
                      <div className="rounded-2xl border border-[#4ECCA3]/20 bg-[#4ECCA3]/10 p-4">
                        <p className="mb-3 flex items-center gap-2 text-sm font-bold text-[#0C211E]">
                          <Truck className="h-4 w-4 text-[#4ECCA3]" />
                          Nur noch {formatPriceDe(FREE_SHIPPING_THRESHOLD - totalPrice)} bis zum{' '}
                          <span className="text-[#4ECCA3]">Gratisversand</span>!
                        </p>
                        <div className="h-2.5 overflow-hidden rounded-full border border-gray-50 bg-white">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${(totalPrice / FREE_SHIPPING_THRESHOLD) * 100}%` }}
                            transition={{ duration: 0.5, ease: 'easeOut' }}
                            className="h-full bg-[#4ECCA3]"
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-3 rounded-2xl border border-[#4ECCA3]/20 bg-[#4ECCA3]/10 p-4 text-sm font-bold text-[#0C211E]">
                        <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-[#4ECCA3] text-gray-900">
                          <Check className="h-4 w-4" />
                        </div>
                        Wir schenken Ihnen die Versandkosten!
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Footer CTA */}
            {items.length > 0 && (
              <div className="pb-safe z-10 border-t border-gray-100 bg-gray-50/80 p-4 shadow-[0_-10px_30px_rgba(0,0,0,0.03)]">
                <div className="mb-4 space-y-2">
                  <div className="flex justify-between text-xs font-bold uppercase tracking-tight text-gray-400">
                    <span>Brutto</span>
                    <span data-testid="cart-subtotal" className="tabular-nums text-gray-900">
                      {formatPriceDe(totalPrice)}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs font-bold uppercase tracking-tight text-gray-400">
                    <span>Versand</span>
                    <span
                      className={
                        totalPrice >= FREE_SHIPPING_THRESHOLD ? 'text-green-600' : 'text-gray-900'
                      }
                    >
                      {totalPrice >= FREE_SHIPPING_THRESHOLD ? 'GRATIS' : 'Berechnet'}
                    </span>
                  </div>
                  <div className="mt-2 flex items-end justify-between border-t border-gray-200 pt-3">
                    <span className="text-[10px] font-black uppercase tracking-tighter text-[#0C211E]">
                      Gesamt (Brutto)
                    </span>
                    <span className="text-xl font-black tabular-nums text-nova-900">
                      {formatPriceDe(totalPrice)}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <Link
                    href="/kasse"
                    data-testid="checkout-button"
                    onClick={onClose}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#0C211E] py-3.5 text-center text-xs font-black uppercase tracking-widest text-white shadow-xl shadow-gray-900/10 transition-all hover:bg-black"
                  >
                    <Lock className="h-3.5 w-3.5" /> Sicher zur Kasse
                  </Link>
                  <Link
                    href="/warenkorb"
                    onClick={onClose}
                    className="w-full rounded-xl border border-gray-200 bg-white py-3 text-center text-[10px] font-black uppercase tracking-widest text-[#0C211E] transition-colors hover:bg-gray-50"
                  >
                    Warenkorb ansehen
                  </Link>
                  <div className="mt-4 flex justify-center gap-4 opacity-60">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-gray-400">
                      <Shield className="h-3.5 w-3.5" /> ssl-secure
                    </div>
                    <div className="flex items-center gap-1.5 text-xs font-bold text-gray-400">
                      <Truck className="h-3.5 w-3.5" /> express
                    </div>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
