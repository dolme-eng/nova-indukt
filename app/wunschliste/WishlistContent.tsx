'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Heart, ShoppingCart, Trash2, Check, Package, ChevronRight, ArrowLeft } from 'lucide-react'
import { products, Product } from '@/lib/data/products'
import { useCart } from '@/lib/store/cart'
import { useWishlist, WishlistItem } from '@/lib/store/wishlist'
import { toast } from 'sonner'
import { formatPriceDe } from '@/lib/utils/vat'

// Extended interface for display purposes (combines WishlistItem with Product data)
interface DisplayWishlistItem extends WishlistItem {
  product: Product
}

export default function WishlistContent() {
  const [addedToCart, setAddedToCart] = useState<string[]>([])
  const [isHydrated, setIsHydrated] = useState(false)
  const { addItem } = useCart()
  const { items: wishlistItems, removeItem, mounted } = useWishlist()

  // Build display items by looking up full product data
  const [displayItems, setDisplayItems] = useState<DisplayWishlistItem[]>([])

  useEffect(() => {
    setIsHydrated(mounted)
  }, [mounted])

  useEffect(() => {
    const display: DisplayWishlistItem[] = wishlistItems
      .map(item => {
        const product = products.find(p => p.id === item.id)
        return product ? { ...item, product } : null
      })
      .filter((item): item is DisplayWishlistItem => item !== null && item.product !== undefined)
    setDisplayItems(display)
  }, [wishlistItems])

  const handleRemoveItem = async (productId: string) => {
    await removeItem(productId)
    toast.success('Artikel von der Wunschliste entfernt')
  }

  const handleAddToCart = (item: DisplayWishlistItem) => {
    if (item.product) {
      addItem(item.product, 1)
      setAddedToCart(prev => [...prev, item.id])
      setTimeout(() => {
        setAddedToCart(prev => prev.filter(id => id !== item.id))
      }, 2000)
    }
  }

  if (!isHydrated) {
    return (
      <div className="min-h-screen bg-gray-50">
        <nav className="bg-white border-b border-gray-100">
          <div className="container mx-auto px-4">
            <div className="flex items-center gap-2 py-3 text-sm">
              <Link href="/" className="text-gray-500 hover:text-gray-900 transition-colors">Startseite</Link>
              <ChevronRight className="w-4 h-4 text-gray-400" />
              <span className="text-gray-900 font-medium">Wunschliste</span>
            </div>
          </div>
        </nav>
        <div className="container mx-auto px-4 py-6 sm:py-8">
          <div className="animate-pulse">
            <div className="h-8 w-48 bg-gray-200 rounded mb-6" />
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-white rounded-xl p-4">
                  <div className="aspect-square bg-gray-200 rounded-lg mb-3" />
                  <div className="h-4 bg-gray-200 rounded mb-2 w-3/4" />
                  <div className="h-3 bg-gray-200 rounded mb-2 w-1/2" />
                  <div className="h-6 bg-gray-200 rounded w-1/3" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <nav className="bg-white border-b border-gray-100">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-2 py-3 text-sm">
            <Link href="/" className="flex items-center gap-1 text-gray-500 hover:text-gray-900 transition-colors lg:hidden">
              <ArrowLeft className="w-4 h-4" />
              <span>Startseite</span>
            </Link>
            <div className="hidden lg:flex items-center gap-2">
              <Link href="/" className="text-gray-500 hover:text-gray-900 transition-colors">Startseite</Link>
              <ChevronRight className="w-4 h-4 text-gray-400" />
              <span className="text-gray-900 font-medium">Wunschliste</span>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-4 sm:py-6 lg:py-8">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">Wunschliste</h1>
          {displayItems.length > 0 && (
            <span className="text-sm text-gray-500">
              {displayItems.length} {displayItems.length === 1 ? 'Artikel' : 'Artikel'}
            </span>
          )}
        </div>
        
        {displayItems.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl sm:rounded-2xl p-8 sm:p-12 text-center shadow-sm"
          >
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="w-8 h-8 sm:w-10 sm:h-10 text-gray-300" />
            </div>
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">Deine Wunschliste ist leer</h2>
            <p className="text-gray-600 mb-6 text-sm sm:text-base max-w-md mx-auto">Füge Produkte hinzu, die Dir gefallen, um sie später einfacher wiederzufinden.</p>
            <Link 
              href="/produkte" 
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#4ECCA3] text-white font-medium rounded-xl hover:bg-[#3BA88A] transition-colors text-sm sm:text-base"
            >
              <Package className="w-4 h-4 sm:w-5 sm:h-5" />
              Produkte durchstöbern
            </Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
            <AnimatePresence>
              {displayItems.map((item, index) => {
                const product = item.product
                if (!product) return null
                return (
                  <motion.div 
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-white rounded-xl shadow-sm overflow-hidden group hover:shadow-md transition-shadow border border-gray-100"
                  >
                    <div className="relative aspect-square bg-gray-100">
                      <Image 
                        src={item.image} 
                        alt={item.name.de} 
                        fill 
                        className="object-cover" 
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      />
                      <button 
                        onClick={() => handleRemoveItem(item.id)}
                        className="absolute top-2 right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity hover:bg-red-50"
                        title="Entfernen"
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </button>
                    </div>
                    <div className="p-3 sm:p-4">
                      <Link href={`/produkt/${item.slug}`} className="block">
                        <h3 className="font-medium text-gray-900 line-clamp-1 hover:text-[#4ECCA3] transition-colors text-sm sm:text-base">
                          {item.name.de}
                        </h3>
                      </Link>
                      <p className="text-xs sm:text-sm text-gray-500 line-clamp-1 mt-1">
                        {product.shortDescription.de}
                      </p>
                      <div className="flex items-center gap-1 mt-2">
                        <span className="text-xs sm:text-sm text-amber-500">★</span>
                        <span className="text-xs sm:text-sm text-gray-600">{product.rating}</span>
                        <span className="text-xs text-gray-400">({product.reviewCount})</span>
                      </div>
                      <p className="text-base sm:text-lg font-semibold text-[#4ECCA3] mt-2 tabular-nums whitespace-nowrap">
                        {formatPriceDe(item.price)}
                      </p>
                      <button 
                        onClick={() => handleAddToCart(item)}
                        disabled={addedToCart.includes(item.id)}
                        className={`w-full mt-3 py-2 sm:py-2.5 text-white text-xs sm:text-sm font-medium rounded-lg transition-colors flex items-center justify-center gap-2 ${
                          addedToCart.includes(item.id) 
                            ? 'bg-green-500' 
                            : 'bg-[#4ECCA3] hover:bg-[#3BA88A]'
                        }`}
                      >
                        {addedToCart.includes(item.id) ? (
                          <>
                            <Check className="w-4 h-4" />
                            Hinzugefügt
                          </>
                        ) : (
                          <>
                            <ShoppingCart className="w-4 h-4" />
                            In den Warenkorb
                          </>
                        )}
                      </button>
                    </div>
                  </motion.div>
                )
              })}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  )
}
