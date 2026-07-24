'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ShoppingCart, X, Trash2, Plus, Minus, Check, Truck, Lock, Shield,
} from 'lucide-react'
import { formatPriceDe } from '@/lib/utils/vat'
import type { CartItem } from '@/lib/store/cart'
import { FREE_SHIPPING_THRESHOLD } from '@/lib/constants/shop'

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
            data-testid="cart-drawer"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 200 }}
            className="fixed top-0 right-0 bottom-0 w-full sm:w-[420px] md:w-[480px] bg-white z-[120] shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold font-heading flex items-center gap-2 text-[#0C211E]">
                <ShoppingCart className="w-6 h-6 text-[#4ECCA3]" /> Warenkorb ({totalItems})
              </h2>
              <button
                onClick={onClose}
                aria-label="Warenkorb schließen"
                className="min-w-[44px] min-h-[44px] flex items-center justify-center hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-900 transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-6 bg-white">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                  <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center">
                    <ShoppingCart className="w-8 h-8 text-gray-300" />
                  </div>
                  <h3 className="text-2xl font-bold font-heading text-[#0C211E]">Ihr Warenkorb ist leer</h3>
                  <p className="text-gray-500 max-w-[280px]">
                    Entdecken Sie unsere Premium-Kollektionen und lassen Sie sich inspirieren.
                  </p>
                  <Link
                    href="/produkte"
                    onClick={onClose}
                    className="px-8 py-4 bg-[#0C211E] text-white rounded-xl font-bold hover:bg-[#17423C] shadow-lg shadow-[#0C211E]/20 transition-all mt-4"
                  >
                    Zum Shop
                  </Link>
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
                          className="w-24 h-24 bg-gray-50 rounded-2xl relative flex-shrink-0 border border-gray-50 hover:border-[#4ECCA3] transition-colors group p-2"
                        >
                          <Image
                            src={item.product.images[0]}
                            alt={item.product.name.de}
                            fill
                            className="object-contain p-2 mix-blend-multiply group-hover:scale-110 transition-transform"
                          />
                        </Link>

                        <div className="flex-1 flex flex-col justify-between py-1">
                          <div className="flex justify-between gap-2">
                            <div>
                              <h4 className="font-bold text-[#0C211E] text-sm line-clamp-2 leading-snug">
                                <Link
                                  href={`/produkt/${item.product.slug}`}
                                  onClick={onClose}
                                  className="hover:text-[#4ECCA3] transition-colors"
                                >
                                  {item.product.name.de}
                                </Link>
                              </h4>
                              <p
                                data-testid="cart-item-price"
                                className="text-[#0C211E] font-black text-sm mt-1 tabular-nums whitespace-nowrap"
                              >
                                {formatPriceDe(item.product.price)}
                              </p>
                            </div>
                            <button
                              onClick={() => removeItem(item.product.id)}
                              aria-label={`${item.product.name.de} entfernen`}
                              className="text-gray-400 hover:text-red-500 transition-colors p-1 self-start"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>

                          <div className="flex items-center gap-3">
                            <div className="flex items-center bg-gray-50 rounded-xl p-1 border border-gray-100">
                              <button
                                onClick={() => updateQuantity(item.product.id, Math.max(1, item.quantity - 1))}
                                aria-label="Menge verringern"
                                className="w-7 h-7 flex items-center justify-center text-gray-500 hover:bg-white rounded-lg shadow-sm transition-colors"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <input
                                data-testid="cart-quantity-input"
                                type="text"
                                readOnly
                                value={item.quantity}
                                aria-label={`Anzahl: ${item.quantity}`}
                                className="w-8 text-center bg-transparent text-sm font-bold text-gray-900 outline-none"
                              />
                              <button
                                onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                                aria-label="Menge erhöhen"
                                className="w-7 h-7 flex items-center justify-center text-gray-500 hover:bg-white rounded-lg shadow-sm transition-colors"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>

                  {/* Shipping progress */}
                  <div className="mt-8 pt-6 border-t border-gray-100">
                    {totalPrice < FREE_SHIPPING_THRESHOLD ? (
                      <div className="bg-[#4ECCA3]/10 border border-[#4ECCA3]/20 rounded-2xl p-4">
                        <p className="text-sm font-bold text-[#0C211E] mb-3 flex items-center gap-2">
                          <Truck className="w-4 h-4 text-[#4ECCA3]" />
                          Nur noch {formatPriceDe(FREE_SHIPPING_THRESHOLD - totalPrice)} bis zum{' '}
                          <span className="text-[#4ECCA3]">Gratisversand</span>!
                        </p>
                        <div className="h-2.5 bg-white rounded-full overflow-hidden border border-gray-50">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${(totalPrice / FREE_SHIPPING_THRESHOLD) * 100}%` }}
                            transition={{ duration: 0.5, ease: 'easeOut' }}
                            className="h-full bg-[#4ECCA3]"
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="bg-[#4ECCA3]/10 border border-[#4ECCA3]/20 rounded-2xl p-4 flex items-center gap-3 text-sm font-bold text-[#0C211E]">
                        <div className="w-8 h-8 rounded-full bg-[#4ECCA3] text-gray-900 flex items-center justify-center flex-shrink-0">
                          <Check className="w-4 h-4" />
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
              <div className="p-4 border-t border-gray-100 bg-gray-50/80 pb-safe shadow-[0_-10px_30px_rgba(0,0,0,0.03)] z-10">
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-xs text-gray-400 font-bold uppercase tracking-tight">
                    <span>Brutto</span>
                    <span data-testid="cart-subtotal" className="text-gray-900 tabular-nums">
                      {formatPriceDe(totalPrice)}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs text-gray-400 font-bold uppercase tracking-tight">
                    <span>Versand</span>
                    <span className={totalPrice >= FREE_SHIPPING_THRESHOLD ? 'text-green-600' : 'text-gray-900'}>
                      {totalPrice >= FREE_SHIPPING_THRESHOLD ? 'GRATIS' : 'Berechnet'}
                    </span>
                  </div>
                  <div className="flex justify-between items-end pt-3 border-t border-gray-200 mt-2">
                    <span className="font-black text-[#0C211E] text-[10px] uppercase tracking-tighter">Gesamt (Brutto)</span>
                    <span className="text-nova-900 text-xl font-black tabular-nums">{formatPriceDe(totalPrice)}</span>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <Link
                    href="/kasse"
                    data-testid="checkout-button"
                    onClick={onClose}
                    className="w-full py-3.5 text-center bg-[#0C211E] text-white font-black rounded-xl hover:bg-black shadow-xl shadow-gray-900/10 transition-all flex items-center justify-center gap-2 text-xs uppercase tracking-widest"
                  >
                    <Lock className="w-3.5 h-3.5" /> Sicher zur Kasse
                  </Link>
                  <Link
                    href="/warenkorb"
                    onClick={onClose}
                    className="w-full py-3 text-center bg-white border border-gray-200 text-[#0C211E] font-black rounded-xl hover:bg-gray-50 transition-colors text-[10px] uppercase tracking-widest"
                  >
                    Warenkorb ansehen
                  </Link>
                  <div className="flex justify-center gap-4 mt-4 opacity-60">
                    <div className="text-xs font-bold text-gray-400 flex items-center gap-1.5">
                      <Shield className="w-3.5 h-3.5" /> ssl-secure
                    </div>
                    <div className="text-xs font-bold text-gray-400 flex items-center gap-1.5">
                      <Truck className="w-3.5 h-3.5" /> express
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
