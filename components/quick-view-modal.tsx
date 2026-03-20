'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Link } from '@/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ShoppingCart, Heart, Star, ChevronLeft, ChevronRight } from 'lucide-react'
import { Product } from '@/lib/data/products'
import { useDeTranslations } from '@/lib/i18n/useDeTranslations'

interface QuickViewModalProps {
  product: Product | null
  isOpen: boolean
  onClose: () => void
}

export function QuickViewModal({ product, isOpen, onClose }: QuickViewModalProps) {
  const t = useDeTranslations()
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)

  if (!product) return null

  const getLocalizedName = () => {
    return product.name.de
  }

  const getLocalizedDescription = () => {
    return product.shortDescription.de
  }

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
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-4 md:inset-10 lg:inset-20 bg-white rounded-2xl shadow-2xl z-50 overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="font-semibold text-gray-900 line-clamp-1">{getLocalizedName()}</h2>
              <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-auto p-4 md:p-6">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Images */}
                <div className="space-y-4">
                  <div className="relative aspect-square bg-gray-100 rounded-xl overflow-hidden">
                    <Image
                      src={product.images[selectedImage]}
                      alt={getLocalizedName()}
                      fill
                      className="object-cover"
                    />
                    {product.images.length > 1 && (
                      <>
                        <button
                          onClick={() => setSelectedImage((prev) => (prev - 1 + product.images.length) % product.images.length)}
                          className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center shadow-lg"
                        >
                          <ChevronLeft className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setSelectedImage((prev) => (prev + 1) % product.images.length)}
                          className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center shadow-lg"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </>
                    )}
                  </div>
                  {product.images.length > 1 && (
                    <div className="flex gap-2 overflow-x-auto">
                      {product.images.map((img, index) => (
                        <button
                          key={index}
                          onClick={() => setSelectedImage(index)}
                          className={`relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 border-2 ${
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
                    <div className="flex items-center gap-2 mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'text-amber-400 fill-amber-400' : 'text-gray-300'}`}
                        />
                      ))}
                      <span className="text-sm text-gray-500">({product.reviewCount})</span>
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">{getLocalizedName()}</h1>
                    <p className="text-gray-600">{getLocalizedDescription()}</p>
                  </div>

                  <div className="flex items-baseline gap-3">
                    <span className="text-3xl font-bold text-[#4ECCA3]">{product.price} €</span>
                    {product.oldPrice && (
                      <span className="text-lg text-red-500 line-through decoration-black">{product.oldPrice} €</span>
                    )}
                  </div>

                  {/* Quantity */}
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-medium text-gray-700">{t('cart.quantity')}:</span>
                    <div className="flex items-center border border-gray-200 rounded-lg">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="w-10 h-10 flex items-center justify-center hover:bg-gray-50"
                      >
                        -
                      </button>
                      <span className="w-10 text-center font-medium">{quantity}</span>
                      <button
                        onClick={() => setQuantity(quantity + 1)}
                        className="w-10 h-10 flex items-center justify-center hover:bg-gray-50"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3">
                    <button className="flex-1 py-3 bg-[#4ECCA3] text-white font-semibold rounded-xl hover:bg-[#3BA88A] transition-colors flex items-center justify-center gap-2">
                      <ShoppingCart className="w-5 h-5" />
                      {t('cart.addToCart')}
                    </button>
                    <button className="w-12 h-12 border border-gray-200 rounded-xl flex items-center justify-center hover:bg-gray-50">
                      <Heart className="w-5 h-5" />
                    </button>
                  </div>

                  <Link
                    href={`/produkt/${product.slug}`}
                    onClick={onClose}
                    className="block text-center text-[#4ECCA3] hover:underline"
                  >
                    {t('products.viewProduct')} →
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
