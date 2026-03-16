'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { Link } from '@/navigation'
import { useTranslations } from 'next-intl'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Star, Heart, Share2, Truck, Shield, RotateCcw, ChevronRight, ChevronDown,
  Minus, Plus, ShoppingCart, Check, AlertCircle,
  Award, Zap, Leaf, ZoomIn, ArrowLeft
} from 'lucide-react'
import { useCart } from '@/lib/store/cart'
import { products, categories, Product } from '@/lib/data/products'
import { ProductReviews } from '@/components/product-reviews'
import { ImageLightbox } from '@/components/image-lightbox'

interface WishlistItem {
  id: string
  name: string
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

  const addItem = (item: WishlistItem) => {
    if (!items.find(i => i.id === item.id)) {
      setItems([...items, item])
      return true
    }
    return false
  }

  const removeItem = (id: string) => {
    setItems(items.filter(i => i.id !== id))
  }

  const isInWishlist = (id: string) => items.some(i => i.id === id)

  return { items, addItem, removeItem, isInWishlist, count: items.length, mounted }
}

interface ProductContentProps {
  product: Product
  locale: string
}

export function ProductContent({ product, locale }: ProductContentProps) {
  const t = useTranslations('product')
  const [selectedImage, setSelectedImage] = useState(0)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [quantity, setQuantity] = useState(1)
  const [activeTab, setActiveTab] = useState<'description' | 'specs' | 'reviews'>('description')
  const [expandedAccordion, setExpandedAccordion] = useState<string | null>('description')
  const [showWishlistToast, setShowWishlistToast] = useState(false)
  const [wishlistToastMessage, setWishlistToastMessage] = useState('')
  const [showStickyBar, setShowStickyBar] = useState(false)
  const { addItem } = useCart()
  const { addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist } = useWishlist()
  const infoRef = useRef<HTMLDivElement>(null)

  const isWishlisted = isInWishlist(product.id)

  // Show sticky bar when scrolling past product info
  useEffect(() => {
    const handleScroll = () => {
      if (infoRef.current) {
        const rect = infoRef.current.getBoundingClientRect()
        setShowStickyBar(rect.bottom < 0)
      }
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleWishlistToggle = () => {
    if (isWishlisted) {
      removeFromWishlist(product.id)
      setWishlistToastMessage(t('wishlist.removed'))
    } else {
      addToWishlist({
        id: product.id,
        name: product.name[locale as 'de' | 'en' | 'fr'],
        price: product.price,
        image: product.images[0],
        slug: product.slug
      })
      setWishlistToastMessage(t('wishlist.added'))
    }
    setShowWishlistToast(true)
    setTimeout(() => setShowWishlistToast(false), 2000)
  }

  const getLocalizedName = (item: { name: { de: string; en: string; fr: string } }) => {
    return item.name[locale as 'de' | 'en' | 'fr']
  }

  const category = categories.find(c => c.id === product.category)

  const relatedProducts = products
    .filter(p => p.category === product?.category && p.id !== product?.id)
    .slice(0, 4)

  return (
    <article className="min-h-screen bg-gray-50 pb-20 lg:pb-0" itemScope itemType="https://schema.org/Product">
      {/* Mobile Sticky Add to Cart Bar */}
      <AnimatePresence>
        {showStickyBar && (
          <motion.div
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            exit={{ y: 100 }}
            className="fixed bottom-0 left-0 right-0 z-40 lg:hidden bg-white border-t border-gray-200 px-4 py-3 shadow-lg"
          >
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0 w-12 h-12 relative rounded-lg overflow-hidden">
                <Image
                  src={product.images[0]}
                  alt={product.name[locale as 'de' | 'en' | 'fr']}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900 truncate text-sm">{product.name[locale as 'de' | 'en' | 'fr']}</p>
                <p className="text-[#4ECCA3] font-bold">{product.price} €</p>
              </div>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => addItem(product, 1)}
                className="flex-shrink-0 px-5 py-2.5 bg-[#4ECCA3] text-white font-semibold rounded-xl text-sm"
              >
                <ShoppingCart className="w-4 h-4" />
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile-Optimized Breadcrumb */}
      <nav aria-label="Breadcrumb" className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-2 py-3 text-sm">
            <Link href="/produkte" className="flex items-center gap-1 text-gray-500 hover:text-gray-900 transition-colors lg:hidden">
              <ArrowLeft className="w-4 h-4" />
              <span>{t('back') || 'Back'}</span>
            </Link>
            <div className="hidden lg:flex items-center gap-2">
              <Link href="/" className="text-gray-500 hover:text-gray-900 transition-colors">{t('nav.home')}</Link>
              <ChevronRight className="w-4 h-4 text-gray-400" />
              <Link href="/produkte" className="text-gray-500 hover:text-gray-900 transition-colors">{t('products.title')}</Link>
              {category && (
                <>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                  <Link href={`/produkte?kategorie=${category.id}`} className="text-gray-500 hover:text-gray-900 transition-colors">
                    {getLocalizedName(category)}
                  </Link>
                </>
              )}
              <ChevronRight className="w-4 h-4 text-gray-400" />
              <span className="text-gray-900 font-medium truncate max-w-xs">{product.name[locale as 'de' | 'en' | 'fr']}</span>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-4 sm:py-6 lg:py-8">
        <div className="grid lg:grid-cols-2 gap-6 lg:gap-8 xl:gap-12">
          {/* Gallery */}
          <div className="space-y-3 sm:space-y-4">
            {/* Main Image */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="relative aspect-square bg-white rounded-xl sm:rounded-2xl overflow-hidden shadow-sm cursor-zoom-in group"
              onClick={() => setLightboxOpen(true)}
            >
              <Image
                src={product.images[selectedImage]}
                alt={product.name[locale as 'de' | 'en' | 'fr']}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              
              {/* Zoom Icon */}
              <div className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 w-10 h-10 sm:w-12 sm:h-12 bg-white/90 backdrop-blur rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
                <ZoomIn className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700" />
              </div>

              {/* Badges */}
              <div className="absolute top-3 left-3 sm:top-4 sm:left-4 flex flex-col gap-1.5 sm:gap-2">
                {product.badges?.includes('premium') && (
                  <span className="px-2.5 py-1 sm:px-3 sm:py-1.5 bg-[#4ECCA3] text-white text-xs sm:text-sm font-bold rounded-full flex items-center gap-1 shadow-sm">
                    <Award className="w-3 h-3 sm:w-4 sm:h-4" /> Premium
                  </span>
                )}
                {product.badges?.includes('bestseller') && (
                  <span className="px-2.5 py-1 sm:px-3 sm:py-1.5 bg-gray-900 text-white text-xs sm:text-sm font-bold rounded-full shadow-sm">Bestseller</span>
                )}
                {product.badges?.includes('new') && (
                  <span className="px-2.5 py-1 sm:px-3 sm:py-1.5 bg-amber-400 text-gray-900 text-xs sm:text-sm font-bold rounded-full shadow-sm">Neu</span>
                )}
              </div>

              {/* Wishlist Button */}
              <button
                onClick={(e) => { e.stopPropagation(); handleWishlistToggle(); }}
                className="absolute top-3 right-3 sm:top-4 sm:right-4 w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors"
              >
                <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
              </button>

              {/* Wishlist Toast */}
              <AnimatePresence>
                {showWishlistToast && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute top-16 left-1/2 -translate-x-1/2 px-4 py-2 bg-gray-900 text-white text-sm rounded-full shadow-lg whitespace-nowrap"
                  >
                    {wishlistToastMessage}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Thumbnails */}
            {product.images.length > 1 && (
              <div className="flex gap-2 sm:gap-3 overflow-x-auto pb-2 scrollbar-hide">
                {product.images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-lg sm:rounded-xl overflow-hidden flex-shrink-0 border-2 transition-all ${
                      selectedImage === index ? 'border-[#4ECCA3] ring-2 ring-[#4ECCA3]/20' : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <Image 
                      src={img} 
                      alt={`${product.name[locale as 'de' | 'en' | 'fr']} - ${index + 1}`} 
                      fill 
                      className="object-cover" 
                      sizes="80px"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div ref={infoRef} className="space-y-4 sm:space-y-6">
            {/* Category & Rating */}
            <div>
              <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                {category && (
                  <Link href={`/produkte?kategorie=${category.id}`} className="text-sm text-[#4ECCA3] font-medium hover:underline">
                    {getLocalizedName(category)}
                  </Link>
                )}
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${i < Math.floor(product.rating) ? 'text-amber-400 fill-amber-400' : 'text-gray-300'}`} />
                  ))}
                  <span className="text-xs sm:text-sm text-gray-500 ml-1">({product.reviewCount})</span>
                </div>
              </div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 font-heading mb-2">{product.name[locale as 'de' | 'en' | 'fr']}</h1>
              <p className="text-gray-600 text-sm sm:text-base">{product.shortDescription[locale as 'de' | 'en' | 'fr']}</p>
            </div>

            {/* Price */}
            <div className="flex flex-wrap items-baseline gap-2 sm:gap-4 py-3 sm:py-4 border-y border-gray-200">
              <span className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">{product.price} €</span>
              {product.oldPrice && (
                <>
                  <span className="text-lg sm:text-xl text-gray-400 line-through">{product.oldPrice} €</span>
                  <span className="px-2 py-1 bg-red-100 text-red-600 text-xs sm:text-sm font-bold rounded-full">
                    -{Math.round((1 - product.price / product.oldPrice) * 100)}%
                  </span>
                </>
              )}
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-2 sm:gap-4">
              <div className="flex flex-col sm:flex-row items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-gray-600 text-center sm:text-left">
                <Truck className="w-4 h-4 sm:w-5 sm:h-5 text-[#4ECCA3] flex-shrink-0" />
                <span>{t('freeShipping')}</span>
              </div>
              <div className="flex flex-col sm:flex-row items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-gray-600 text-center sm:text-left">
                <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-[#4ECCA3] flex-shrink-0" />
                <span>{t('warranty', { years: 2 })}</span>
              </div>
              <div className="flex flex-col sm:flex-row items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-gray-600 text-center sm:text-left">
                <RotateCcw className="w-4 h-4 sm:w-5 sm:h-5 text-[#4ECCA3] flex-shrink-0" />
                <span>{t('returns', { days: 30 })}</span>
              </div>
            </div>

            {/* Quantity & Add to Cart */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <div className="flex items-center border border-gray-200 rounded-xl bg-white">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))} 
                  className="w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center hover:bg-gray-50 rounded-l-xl transition-colors"
                  disabled={quantity <= 1}
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-12 sm:w-14 text-center font-semibold text-base sm:text-lg">{quantity}</span>
                <button 
                  onClick={() => setQuantity(quantity + 1)} 
                  disabled={quantity >= product.stock}
                  className="w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center hover:bg-gray-50 rounded-r-xl transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={() => addItem(product, quantity)}
                className="flex-1 flex items-center justify-center gap-2 py-3.5 sm:py-4 bg-[#4ECCA3] text-white font-semibold rounded-xl hover:bg-[#3BA88A] transition-colors text-base sm:text-lg shadow-lg shadow-[#4ECCA3]/20"
              >
                <ShoppingCart className="w-5 h-5" />
                {t('addToCart')}
              </motion.button>
              
              <button className="hidden sm:flex w-14 h-14 border border-gray-200 rounded-xl items-center justify-center hover:bg-gray-50 transition-colors bg-white">
                <Share2 className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            {/* Stock Status & SKU */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-sm">
              <div className="flex items-center gap-2">
                {product.stock > 0 ? (
                  <>
                    <Check className="w-5 h-5 text-green-500" />
                    <span className="text-green-600 font-medium">{t('inStock', { count: product.stock })}</span>
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-5 h-5 text-red-500" />
                    <span className="text-red-600 font-medium">{t('outOfStock')}</span>
                  </>
                )}
              </div>
              <div className="text-gray-500">
                {t('sku')}: <span className="font-medium text-gray-900">{product.id}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Desktop Tabs / Mobile Accordion */}
        <div className="mt-8 sm:mt-12">
          {/* Desktop Tabs */}
          <div className="hidden lg:block border-b border-gray-200">
            <div className="flex gap-8">
              {[
                { id: 'description', label: t('tabDescription') },
                { id: 'specs', label: t('tabSpecs') },
                { id: 'reviews', label: `${t('tabReviews')} (${product.reviewCount})` },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as typeof activeTab)}
                  className={`py-4 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === tab.id ? 'border-[#4ECCA3] text-[#4ECCA3]' : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Desktop Tab Content */}
          <div className="hidden lg:block py-8">
            <AnimatePresence mode="wait">
              {activeTab === 'description' && (
                <motion.div key="description" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="max-w-3xl">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">{t('productDescription')}</h3>
                  <p className="text-gray-600 leading-relaxed">{product.description[locale as 'de' | 'en' | 'fr']}</p>
                  <div className="mt-8 grid sm:grid-cols-2 gap-4">
                    {[
                      { icon: Zap, title: t('features.smartHeat.title'), desc: t('features.smartHeat.desc') },
                      { icon: Leaf, title: t('features.ecoPower.title'), desc: t('features.ecoPower.desc') },
                      { icon: Shield, title: t('features.safetyGuard.title'), desc: t('features.safetyGuard.desc') },
                      { icon: Award, title: t('features.premium.title'), desc: t('features.premium.desc') },
                    ].map((feature) => (
                      <div key={feature.title} className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
                        <div className="w-10 h-10 bg-[#4ECCA3]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                          <feature.icon className="w-5 h-5 text-[#4ECCA3]" />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">{feature.title}</h4>
                          <p className="text-sm text-gray-500">{feature.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {activeTab === 'specs' && (
                <motion.div key="specs" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="max-w-2xl">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">{t('technicalData')}</h3>
                  <div className="divide-y divide-gray-200">
                    {[
                      { label: t('specs.material'), value: product.specs.material },
                      { label: t('specs.dimensions'), value: product.specs.dimensions },
                      { label: t('specs.weight'), value: product.specs.weight },
                      { label: t('specs.dishwasher'), value: product.specs.dishwasher ? t('yes') : t('no') },
                      { label: t('specs.induction'), value: product.specs.induction ? t('yes') : t('no') },
                    ].map((spec) => (
                      <div key={spec.label} className="py-4 flex justify-between">
                        <span className="text-gray-500">{spec.label}</span>
                        <span className="font-medium text-gray-900">{spec.value}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {activeTab === 'reviews' && (
                <motion.div key="reviews" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                  <ProductReviews productId={product.id} averageRating={product.rating} totalReviews={product.reviewCount} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Mobile Accordion */}
          <div className="lg:hidden space-y-2 mt-6">
            {[
              { 
                id: 'description', 
                label: t('tabDescription'),
                content: (
                  <div className="pt-4">
                    <p className="text-gray-600 leading-relaxed text-sm sm:text-base">{product.description[locale as 'de' | 'en' | 'fr']}</p>
                    <div className="mt-6 grid gap-3">
                      {[
                        { icon: Zap, title: t('features.smartHeat.title'), desc: t('features.smartHeat.desc') },
                        { icon: Leaf, title: t('features.ecoPower.title'), desc: t('features.ecoPower.desc') },
                        { icon: Shield, title: t('features.safetyGuard.title'), desc: t('features.safetyGuard.desc') },
                        { icon: Award, title: t('features.premium.title'), desc: t('features.premium.desc') },
                      ].map((feature) => (
                        <div key={feature.title} className="flex items-start gap-3 p-3 sm:p-4 bg-gray-50 rounded-xl">
                          <div className="w-9 h-9 sm:w-10 sm:h-10 bg-[#4ECCA3]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                            <feature.icon className="w-4 h-4 sm:w-5 sm:h-5 text-[#4ECCA3]" />
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900 text-sm sm:text-base">{feature.title}</h4>
                            <p className="text-xs sm:text-sm text-gray-500">{feature.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              },
              { 
                id: 'specs', 
                label: t('tabSpecs'),
                content: (
                  <div className="pt-4">
                    <div className="divide-y divide-gray-200">
                      {[
                        { label: t('specs.material'), value: product.specs.material },
                        { label: t('specs.dimensions'), value: product.specs.dimensions },
                        { label: t('specs.weight'), value: product.specs.weight },
                        { label: t('specs.dishwasher'), value: product.specs.dishwasher ? t('yes') : t('no') },
                        { label: t('specs.induction'), value: product.specs.induction ? t('yes') : t('no') },
                      ].map((spec) => (
                        <div key={spec.label} className="py-3 sm:py-4 flex justify-between text-sm sm:text-base">
                          <span className="text-gray-500">{spec.label}</span>
                          <span className="font-medium text-gray-900">{spec.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              },
              { 
                id: 'reviews', 
                label: `${t('tabReviews')} (${product.reviewCount})`,
                content: (
                  <div className="pt-4">
                    <ProductReviews productId={product.id} averageRating={product.rating} totalReviews={product.reviewCount} />
                  </div>
                )
              },
            ].map((section) => (
              <div key={section.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <button
                  onClick={() => setExpandedAccordion(expandedAccordion === section.id ? null : section.id)}
                  className="w-full flex items-center justify-between p-4 text-left"
                >
                  <span className="font-semibold text-gray-900 text-sm sm:text-base">{section.label}</span>
                  <motion.div
                    animate={{ rotate: expandedAccordion === section.id ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronDown className="w-5 h-5 text-gray-500" />
                  </motion.div>
                </button>
                <AnimatePresence>
                  {expandedAccordion === section.id && (
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: 'auto' }}
                      exit={{ height: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="px-4 pb-4">
                        {section.content}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-10 sm:mt-12">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 font-heading mb-4 sm:mb-6">{t('relatedProducts')}</h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
              {relatedProducts.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="group bg-white rounded-xl sm:rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow border border-gray-100"
                >
                  <Link href={`/produkt/${item.slug}`}>
                    <div className="relative aspect-square bg-gray-100">
                      <Image 
                        src={item.images[0]} 
                        alt={item.name[locale as 'de' | 'en' | 'fr']} 
                        fill 
                        className="object-cover group-hover:scale-105 transition-transform duration-500" 
                        sizes="(max-width: 640px) 50vw, 25vw"
                      />
                    </div>
                    <div className="p-3 sm:p-4">
                      <h3 className="font-medium text-gray-900 mb-1.5 sm:mb-2 line-clamp-1 group-hover:text-[#4ECCA3] transition-colors text-sm sm:text-base">{item.name[locale as 'de' | 'en' | 'fr']}</h3>
                      <div className="flex items-center gap-2">
                        <span className="text-base sm:text-lg font-bold text-gray-900">{item.price} €</span>
                        {item.oldPrice && <span className="text-xs sm:text-sm text-gray-400 line-through">{item.oldPrice} €</span>}
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Lightbox */}
        <ImageLightbox
          images={product.images}
          currentIndex={selectedImage}
          isOpen={lightboxOpen}
          onClose={() => setLightboxOpen(false)}
          onNavigate={setSelectedImage}
          productName={product.name[locale as 'de' | 'en' | 'fr']}
        />
      </div>
    </article>
  )
}
