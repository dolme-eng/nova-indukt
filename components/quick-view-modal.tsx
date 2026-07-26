'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ShoppingCart, Heart, Star, ChevronLeft, ChevronRight, Check } from 'lucide-react'
import { Product } from '@/lib/data/products'
import { useCart } from '@/lib/store/cart'
import { useWishlist } from '@/lib/store/wishlist'
import { formatPriceDe } from '@/lib/utils/vat'
import { toast } from 'sonner'

interface QuickViewModalProps {
  product: Product | null
  isOpen: boolean
  onClose: () => void
}

export function QuickViewModal({ product, isOpen, onClose }: QuickViewModalProps) {
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const { addItem } = useCart()
  const { toggleItem, isInWishlist } = useWishlist()
  const [isAdded, setIsAdded] = useState(false)
  const modalRef = useRef<HTMLDivElement>(null)
  const previousFocusRef = useRef<HTMLElement | null>(null)

  // Focus trap
  useEffect(() => {
    if (isOpen) {
      previousFocusRef.current = document.activeElement as HTMLElement
      // Focus the modal after animation
      const timer = setTimeout(() => {
        modalRef.current?.focus()
      }, 100)
      return () => clearTimeout(timer)
    } else {
      // Restore focus when closing
      previousFocusRef.current?.focus()
    }
  }, [isOpen])

  // Escape key handler
  useEffect(() => {
    if (!isOpen) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
        return
      }
      // Focus trap: Tab cycles within modal
      if (e.key === 'Tab' && modalRef.current) {
        const focusable = modalRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        )
        if (focusable.length === 0) return
        const first = focusable[0]
        const last = focusable[focusable.length - 1]
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault()
          last.focus()
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      return () => {
        document.body.style.overflow = ''
      }
    }
  }, [isOpen])

  if (!product) return null

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
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
            aria-hidden="true"
          />

          {/* Modal */}
          <motion.div
            ref={modalRef}
            role="dialog"
            aria-modal="true"
            aria-label={product.name.de}
            tabIndex={-1}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-4 z-50 flex flex-col overflow-hidden rounded-2xl bg-white shadow-2xl outline-none md:inset-10 lg:inset-20"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b p-4">
              <h2 className="line-clamp-1 font-semibold text-gray-900">{product.name.de}</h2>
              <button
                onClick={onClose}
                aria-label="Schnellansicht schließen"
                className="rounded-lg p-2 hover:bg-gray-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-auto p-4 md:p-6">
              <div className="grid gap-6 md:grid-cols-2">
                {/* Images */}
                <div className="space-y-4">
                  <div className="relative aspect-square overflow-hidden rounded-xl bg-gray-100">
                    <Image
                      src={product.images[selectedImage]}
                      alt={`${product.name.de} — Bild ${selectedImage + 1} von ${product.images.length}`}
                      fill
                      className="object-cover"
                    />
                    {product.images.length > 1 && (
                      <>
                        <button
                          onClick={() =>
                            setSelectedImage(
                              (prev) => (prev - 1 + product.images.length) % product.images.length
                            )
                          }
                          className="absolute left-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 shadow-lg"
                          aria-label="Vorheriges Bild"
                        >
                          <ChevronLeft className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() =>
                            setSelectedImage((prev) => (prev + 1) % product.images.length)
                          }
                          className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 shadow-lg"
                          aria-label="Nächstes Bild"
                        >
                          <ChevronRight className="h-4 w-4" />
                        </button>
                      </>
                    )}
                  </div>
                  {product.images.length > 1 && (
                    <div
                      className="flex gap-2 overflow-x-auto"
                      role="group"
                      aria-label="Bildergalerie"
                    >
                      {product.images.map((img, index) => (
                        <button
                          key={index}
                          onClick={() => setSelectedImage(index)}
                          aria-label={`Bild ${index + 1} anzeigen`}
                          aria-pressed={selectedImage === index}
                          className={`relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg border-2 ${
                            selectedImage === index ? 'border-[#4ECCA3]' : 'border-gray-200'
                          }`}
                        >
                          <Image src={img} alt="" fill className="object-cover" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="space-y-4">
                  <div>
                    <div
                      className="mb-2 flex items-center gap-2"
                      aria-label={`Bewertung: ${product.rating} von 5 Sternen`}
                    >
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${i < Math.floor(product.rating) ? 'fill-amber-400 text-amber-400' : 'text-gray-300'}`}
                          aria-hidden="true"
                        />
                      ))}
                      <span className="text-sm text-gray-500">({product.reviewCount})</span>
                    </div>
                    <h1 className="mb-2 text-2xl font-bold text-gray-900">{product.name.de}</h1>
                    <p className="text-gray-600">{product.shortDescription.de}</p>
                  </div>

                  <div className="flex items-baseline gap-3">
                    <span className="text-3xl font-bold text-[#4ECCA3]">
                      {formatPriceDe(product.price)}
                    </span>
                    {product.oldPrice && (
                      <span className="text-lg text-red-500 line-through decoration-black">
                        {formatPriceDe(product.oldPrice)}
                      </span>
                    )}
                  </div>

                  {/* Quantity */}
                  <div className="flex items-center gap-4">
                    <label
                      htmlFor="quickview-quantity"
                      className="text-sm font-medium text-gray-700"
                    >
                      Menge:
                    </label>
                    <div className="flex items-center rounded-lg border border-gray-200">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        aria-label="Menge verringern"
                        className="flex h-10 w-10 items-center justify-center hover:bg-gray-50"
                      >
                        -
                      </button>
                      <span
                        id="quickview-quantity"
                        className="w-10 text-center font-medium"
                        aria-live="polite"
                      >
                        {quantity}
                      </span>
                      <button
                        onClick={() => setQuantity(quantity + 1)}
                        aria-label="Menge erhöhen"
                        className="flex h-10 w-10 items-center justify-center hover:bg-gray-50"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3">
                    <button
                      onClick={() => {
                        addItem(product, quantity)
                        setIsAdded(true)
                        toast.success(`${product.name.de} wurde zum Warenkorb hinzugefügt`)
                        setTimeout(() => setIsAdded(false), 2000)
                      }}
                      aria-label={`${product.name.de} in den Warenkorb legen`}
                      className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-3 font-semibold transition-all ${
                        isAdded
                          ? 'bg-green-500 text-white'
                          : 'bg-[#4ECCA3] text-white hover:bg-[#3BA88A]'
                      }`}
                    >
                      {isAdded ? (
                        <>
                          <Check className="h-5 w-5" />
                          Hinzugefügt
                        </>
                      ) : (
                        <>
                          <ShoppingCart className="h-5 w-5" />
                          In den Warenkorb
                        </>
                      )}
                    </button>
                    <button
                      onClick={async () => {
                        const added = await toggleItem({
                          id: product.id,
                          name: product.name,
                          price: product.price,
                          image: product.images[0] ?? '',
                          slug: product.slug,
                        })
                        toast.success(
                          added
                            ? `${product.name.de} zur Wunschliste hinzugefügt`
                            : `${product.name.de} von der Wunschliste entfernt`
                        )
                      }}
                      aria-label={
                        isInWishlist(product.id)
                          ? `${product.name.de} von Wunschliste entfernen`
                          : `${product.name.de} zur Wunschliste hinzufügen`
                      }
                      className={`flex h-12 w-12 items-center justify-center rounded-xl border transition-all ${
                        isInWishlist(product.id)
                          ? 'border-red-200 bg-red-50 text-red-500'
                          : 'border-gray-200 text-gray-400 hover:bg-gray-50 hover:text-red-500'
                      }`}
                    >
                      <Heart
                        className={`h-5 w-5 transition-colors ${isInWishlist(product.id) ? 'fill-red-500 text-red-500' : ''}`}
                      />
                    </button>
                  </div>

                  <Link
                    href={`/produkt/${product.slug}`}
                    onClick={onClose}
                    className="block text-center text-[#4ECCA3] hover:underline"
                  >
                    Produkt ansehen →
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
