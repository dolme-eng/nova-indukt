'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { Link } from '@/navigation'
import { useDeTranslations } from '@/lib/i18n/useDeTranslations'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Star, Heart, Share2, Truck, Shield, RotateCcw, ChevronRight, ChevronDown,
  Minus, Plus, ShoppingCart, Check, AlertCircle,
  Award, Zap, Leaf, ZoomIn, ArrowLeft, ShieldCheck, Lock,
  Sparkles, Layers, Maximize, Scale, Droplets
} from 'lucide-react'
import { useCart } from '@/lib/store/cart'
import { useWishlist } from '@/lib/store/wishlist'
import { products, categories, Product } from '@/lib/data/products'
import { ProductReviews } from '@/components/product-reviews'
import { ImageLightbox } from '@/components/image-lightbox'

interface ProductContentProps {
  product: Product
}

export function ProductContent({ product }: ProductContentProps) {
  const t = useDeTranslations('product')
  const [selectedImage, setSelectedImage] = useState(0)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [quantity, setQuantity] = useState(1)
  const [activeTab, setActiveTab] = useState<'description' | 'specs' | 'reviews'>('description')
  const [expandedAccordion, setExpandedAccordion] = useState<string | null>('description')
  const [showWishlistToast, setShowWishlistToast] = useState(false)
  const [wishlistToastMessage, setWishlistToastMessage] = useState('')
  const [showStickyBar, setShowStickyBar] = useState(false)
  const { addItem } = useCart()
  const { isInWishlist, toggleItem } = useWishlist()
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
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleWishlistToggle = () => {
    const added = toggleItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0],
      slug: product.slug
    })
    setWishlistToastMessage(added ? t('wishlist.added') || 'Zur Wunschliste hinzugefügt' : t('wishlist.removed') || 'Von Wunschliste entfernt')
    setShowWishlistToast(true)
    setTimeout(() => setShowWishlistToast(false), 2000)
  }

  const getLocalizedName = (item: { name: { de: string } }) => {
    return item.name.de
  }

  const category = categories.find(c => c.id === product.category)

  const relatedProducts = products
    .filter(p => p.category === product?.category && p.id !== product?.id)
    .slice(0, 4)

  return (
    <article className="min-h-screen bg-gray-50/50 pb-20 lg:pb-12" itemScope itemType="https://schema.org/Product">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org/",
        "@type": "Product",
        "name": product.name.de,
        "image": product.images[0],
        "description": product.shortDescription.de,
        "sku": product.id,
        "offers": {
          "@type": "Offer",
          "url": `https://nova-indukt.de/produkt/${product.slug}`,
          "priceCurrency": "EUR",
          "price": product.price,
          "availability": product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
          "itemCondition": "https://schema.org/NewCondition"
        },
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": product.rating,
          "reviewCount": product.reviewCount
        }
      })}} />
      
      {/* Universal Sticky Add to Cart Bar */}
      <AnimatePresence>
        {showStickyBar && (
          <motion.div
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            exit={{ y: 100 }}
            className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-xl border-t border-gray-100 px-4 py-3 shadow-[0_-10px_40px_rgba(0,0,0,0.08)]"
          >
            <div className="flex flex-row items-center gap-3 sm:gap-6 max-w-7xl mx-auto xl:px-6">
              <div className="flex flex-row sm:flex-row items-center gap-4 min-w-0" style={{ flex: '1 1 40%' }}>
                <div className="relative w-12 h-12 rounded-xl bg-gray-50 border border-gray-100 hidden sm:block overflow-hidden shrink-0">
                  <Image src={product.images[0]} alt={product.name.de} fill className="object-cover p-1 mix-blend-multiply" />
                </div>
                <div className="flex flex-col justify-center min-w-0">
                  <p className="font-bold text-[#0C211E] text-[17px] sm:text-lg leading-tight">{product.price.toFixed(2).replace('.', ',')} €</p>
                  <p className="font-semibold text-gray-500 truncate text-[12px] sm:text-sm hidden sm:block">{product.name.de}</p>
                  <p className="font-medium text-gray-400 text-[10px] sm:hidden tracking-wider uppercase">inkl. MwSt.</p>
                </div>
              </div>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => addItem(product, 1)}
                className="h-12 px-2 sm:px-8 bg-[#0C211E] text-white font-bold rounded-xl text-[13px] sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-[#0C211E]/20 shrink-0 hover:bg-[#17423C] transition-colors"
                style={{ flex: '1 1 60%', maxWidth: '300px' }}
              >
                <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5" /> <span>In den Warenkorb</span>
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile-Optimized Breadcrumb */}
      <nav aria-label="Breadcrumb" className="bg-white/80 backdrop-blur-sm border-b border-gray-100 sticky top-16 sm:top-[72px] lg:top-[88px] z-30">
        <div className="container mx-auto px-4 sm:px-6 max-w-7xl">
          <div className="flex items-center gap-2 py-3.5 text-xs sm:text-sm font-medium tracking-wide">
            <Link href="/produkte" className="flex items-center gap-1.5 text-gray-500 hover:text-gray-900 transition-colors lg:hidden bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>{t('back') || 'Zurück'}</span>
            </Link>
            <div className="hidden lg:flex items-center gap-2.5">
              <Link href="/" className="text-gray-400 hover:text-[#4ECCA3] transition-colors">{t('nav.home') || 'Startseite'}</Link>
              <ChevronRight className="w-3.5 h-3.5 text-gray-300" />
              <Link href="/produkte" className="text-gray-400 hover:text-[#4ECCA3] transition-colors">{t('products.title') || 'Produkte'}</Link>
              {category && (
                <>
                  <ChevronRight className="w-3.5 h-3.5 text-gray-300" />
                  <Link href={`/produkte?kategorie=${category.id}`} className="text-gray-400 hover:text-[#4ECCA3] transition-colors">
                    {getLocalizedName(category)}
                  </Link>
                </>
              )}
              <ChevronRight className="w-3.5 h-3.5 text-gray-300" />
              <span className="text-[#0C211E] font-bold truncate max-w-[200px] xl:max-w-xs">{product.name.de}</span>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-10 max-w-7xl">
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 xl:gap-16">
          
          {/* Gallery - Left Side */}
          <div className="lg:col-span-7 flex flex-col sm:flex-row-reverse gap-4">
            
            {/* Main Image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative aspect-square sm:aspect-auto sm:h-[600px] lg:h-[700px] w-full bg-white rounded-[2rem] overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 cursor-zoom-in group"
              onClick={() => setLightboxOpen(true)}
              onMouseMove={(e) => {
                const { left, top, width, height } = e.currentTarget.getBoundingClientRect()
                const x = ((e.clientX - left) / width) * 100
                const y = ((e.clientY - top) / height) * 100
                e.currentTarget.style.setProperty('--x', `${x}%`)
                e.currentTarget.style.setProperty('--y', `${y}%`)
              }}
            >
              {selectedImage === 0 && product.id === 'nova-ps-500' ? (
                <div className="absolute inset-0 bg-black overflow-hidden flex items-center justify-center">
                   <video 
                     src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4" 
                     autoPlay loop muted playsInline 
                     className="object-cover w-full h-[150%] opacity-80" 
                   />
                   <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-md px-3 py-1 text-white text-[10px] font-bold tracking-widest uppercase rounded-full border border-white/30 hidden">Preview</div>
                </div>
              ) : (
                <Image
                  src={product.images[selectedImage]}
                  alt={product.name.de}
                  fill
                  className="object-contain p-12 group-hover:scale-[2.5] transition-transform duration-200 ease-out mix-blend-multiply origin-[var(--x,50%)_var(--y,50%)]"
                  priority
                  sizes="(max-width: 1024px) 100vw, 60vw"
                />
              )}
              
              {/* Zoom Icon */}
              <div className="absolute bottom-6 right-6 w-12 h-12 bg-white/90 backdrop-blur border border-gray-100 rounded-2xl flex items-center justify-center shadow-xl opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                <ZoomIn className="w-5 h-5 text-gray-700" />
              </div>

              {/* Badges */}
              <div className="absolute top-6 left-6 flex flex-col gap-2">
                {product.badges?.includes('premium') && <span className="px-4 py-1.5 bg-[#0C211E] text-white text-xs font-bold rounded-lg shadow-lg">Premium</span>}
                {product.badges?.includes('bestseller') && <span className="px-4 py-1.5 bg-[#4ECCA3] text-[#0C211E] text-xs font-bold rounded-lg shadow-lg">Bestseller</span>}
                {product.badges?.includes('new') && <span className="px-4 py-1.5 bg-amber-400 text-amber-950 text-xs font-bold rounded-lg shadow-lg">Neu</span>}
                {product.oldPrice && <span className="px-4 py-1.5 bg-red-500 text-white text-xs font-bold rounded-lg shadow-lg">-{Math.round((1 - product.price / product.oldPrice) * 100)}%</span>}
              </div>

            </motion.div>

            {/* Thumbnails */}
            {product.images.length > 1 && (
              <div className="flex sm:flex-col gap-3 overflow-x-auto sm:overflow-visible pb-2 sm:pb-0 scrollbar-hide sm:w-24 flex-shrink-0">
                {product.images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`relative w-20 h-20 sm:w-full sm:h-24 rounded-2xl overflow-hidden flex-shrink-0 bg-white shadow-sm border-2 transition-all group/thumb ${
                      selectedImage === index ? 'border-[#4ECCA3]' : 'border-gray-100 hover:border-gray-300'
                    }`}
                  >
                    <Image 
                      src={img} 
                      alt={`${product.name.de} - Ansicht ${index + 1}`} 
                      fill 
                      className="object-contain p-3 mix-blend-multiply group-hover/thumb:scale-110 transition-transform" 
                      sizes="96px"
                    />
                    {index === 0 && product.id === 'nova-ps-500' && (
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center backdrop-blur-[1px]">
                        <div className="w-8 h-8 rounded-full bg-white/90 shadow-sm flex items-center justify-center pl-0.5">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-900"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
                        </div>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info - Right Side */}
          <div ref={infoRef} className="lg:col-span-5 flex flex-col">
            <div className="space-y-6 lg:sticky lg:top-32">
              
              {/* Category, Rating, Title */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  {category && (
                    <Link href={`/produkte?kategorie=${category.id}`} className="text-sm font-bold text-[#4ECCA3] uppercase tracking-wider hover:text-[#0C211E] transition-colors">
                      {getLocalizedName(category)}
                    </Link>
                  )}
                  <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-lg border border-gray-100 shadow-sm">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    <span className="text-sm font-bold text-gray-900">{product.rating}</span>
                    <span className="text-xs font-medium text-gray-400">({product.reviewCount})</span>
                  </div>
                </div>
                <h1 className="text-3xl sm:text-4xl lg:text-4xl xl:text-5xl font-bold text-[#0C211E] font-heading mb-4 leading-tight tracking-tight">{product.name.de}</h1>
                <p className="text-gray-500 text-base leading-relaxed font-medium">{product.shortDescription.de}</p>
              </div>

              {/* Price Area */}
              <div className="py-6 border-y border-gray-100">
                <div className="flex items-end gap-3 mb-1">
                  <span className="text-4xl font-black text-[#0C211E] tracking-tight">{product.price.toFixed(2).replace('.', ',')} €</span>
                  {product.oldPrice && (
                    <span className="text-lg font-semibold text-gray-400 line-through decoration-gray-300 pb-1.5 text-opacity-80">
                      {product.oldPrice.toFixed(2).replace('.', ',')} €
                    </span>
                  )}
                </div>
                <p className="text-xs font-medium text-gray-400 mb-6">inkl. MwSt. zzgl. <Link href="/lieferung" className="underline decoration-dotted hover:text-gray-600">Versandkosten</Link></p>
                
                {/* Stock info */}
                <div className="flex items-center gap-3 mb-6 bg-green-50/50 border border-green-100 px-4 py-3 rounded-xl w-fit">
                  {product.stock > 0 ? (
                    <>
                      <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse" />
                      <span className="text-green-700 font-bold text-sm">Sofort lieferbar ({t('inStock', { count: product.stock })})</span>
                    </>
                  ) : (
                    <>
                      <div className="w-2.5 h-2.5 bg-red-500 rounded-full" />
                      <span className="text-red-700 font-bold text-sm">{t('outOfStock') || 'Derzeit nicht vorrätig'}</span>
                    </>
                  )}
                </div>

                {/* Adding Actions */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="flex items-center border border-gray-200 rounded-2xl bg-white h-14 w-full sm:w-32 shadow-sm shrink-0">
                    <button 
                      onClick={() => setQuantity(Math.max(1, quantity - 1))} 
                      className="w-10 h-full flex items-center justify-center hover:bg-gray-50 rounded-l-2xl transition-colors text-gray-500"
                      disabled={quantity <= 1}
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="flex-1 text-center font-bold text-lg text-[#0C211E]">{quantity}</span>
                    <button 
                      onClick={() => setQuantity(quantity + 1)} 
                      disabled={quantity >= product.stock}
                      className="w-10 h-full flex items-center justify-center hover:bg-gray-50 rounded-r-2xl transition-colors text-gray-500"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => addItem(product, quantity)}
                    disabled={product.stock <= 0}
                    className="flex-1 flex items-center justify-center gap-3 h-14 bg-[#0C211E] text-white font-bold rounded-2xl hover:bg-[#17423C] transition-colors text-base shadow-xl shadow-[#0C211E]/20 disabled:opacity-50 disabled:cursor-not-allowed group"
                  >
                    <ShoppingCart className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    {t('addToCart') || 'In den Warenkorb'}
                  </motion.button>
                  
                  <button 
                    onClick={handleWishlistToggle}
                    className={`w-14 h-14 border rounded-2xl flex items-center justify-center transition-all bg-white shrink-0 shadow-sm ${
                      isWishlisted ? 'border-red-100 bg-red-50' : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                    title="Zur Wunschliste"
                  >
                    <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} />
                  </button>
                </div>

                {/* Express Checkout */}
                <div className="mt-4 pt-4 border-t border-gray-100 flex gap-3">
                  <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="flex-1 h-12 bg-black text-white rounded-2xl flex items-center justify-center gap-1.5 shadow-md">
                    <span className="text-xl"></span><span className="font-bold text-sm tracking-wide">Pay</span>
                  </motion.button>
                  <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="flex-1 h-12 bg-[#FFC439] text-[#003087] rounded-2xl flex items-center justify-center shadow-md">
                    <span className="font-bold italic text-sm">PayPal</span>
                  </motion.button>
                </div>

                {/* Upsell Box (Passend dazu) */}
                {relatedProducts.length > 0 && (
                  <div className="mt-6 p-5 rounded-3xl border-2 border-[#4ECCA3]/20 bg-gradient-to-br from-[#4ECCA3]/10 to-transparent relative overflow-hidden group">
                    <div className="absolute top-0 right-0 bg-[#4ECCA3] text-[#0C211E] text-[10px] font-black px-4 py-1.5 rounded-bl-2xl uppercase tracking-widest shadow-md">Aktion</div>
                    <h4 className="font-bold text-[15px] text-[#0C211E] mb-4 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-[#4ECCA3]" /> Häufig zusammen gekauft
                    </h4>
                    <div className="flex items-center gap-4">
                      <div className="w-20 h-20 rounded-2xl bg-white border border-gray-100 flex items-center justify-center shrink-0 p-2 shadow-sm relative overflow-hidden">
                        <Image src={relatedProducts[0].images[0]} alt={relatedProducts[0].name.de} fill className="mix-blend-multiply object-contain p-2" />
                      </div>
                      <div className="flex-1 pr-6">
                        <p className="text-xs font-bold text-gray-800 line-clamp-2 leading-tight mb-1.5 group-hover:text-[#4ECCA3] transition-colors">{relatedProducts[0].name.de}</p>
                        <p className="text-base font-black text-[#0C211E]">
                          <span className="text-[#4ECCA3] mr-1">+</span>{relatedProducts[0].price.toFixed(2).replace('.', ',')} € 
                          <span className="text-xs line-through text-gray-400 ml-2 font-semibold">{Math.round(relatedProducts[0].price * 1.15)},00 €</span>
                        </p>
                      </div>
                    </div>
                    <button 
                      onClick={() => {
                         addItem(product, quantity);
                         addItem(relatedProducts[0], 1);
                      }}
                      className="mt-5 w-full py-3.5 rounded-xl border-2 border-[#0C211E] text-[#0C211E] text-sm font-bold hover:bg-[#0C211E] hover:text-[#4ECCA3] transition-colors flex items-center justify-center gap-2"
                    >
                      Beides in den Warenkorb <span className="text-[10px] px-2 py-0.5 bg-[#4ECCA3]/20 rounded-full ml-1">-15% auf Set</span>
                    </button>
                  </div>
                )}

                {/* Trust Badges - German Market Focus */}
                <div className="mt-6 p-4 bg-gray-50 border border-gray-100 rounded-2xl grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2 text-xs font-bold text-gray-700">
                    <Shield className="w-4 h-4 text-[#4ECCA3]" /> TÜV Geprüft
                  </div>
                  <div className="flex items-center gap-2 text-xs font-bold text-gray-700">
                    <Lock className="w-4 h-4 text-[#4ECCA3]" /> SSL-Verschlüsselt
                  </div>
                  <div className="flex items-center gap-2 text-xs font-bold text-gray-700">
                    <RotateCcw className="w-4 h-4 text-[#4ECCA3]" /> 30 Tage Rückgabe
                  </div>
                  <div className="flex items-center gap-2 text-xs font-bold text-gray-700">
                    <Truck className="w-4 h-4 text-[#4ECCA3]" /> DHL Express
                  </div>
                </div>

                {/* Wishlist Toast inner */}
                <AnimatePresence>
                  {showWishlistToast && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="absolute right-0 top-0 mt-4 mr-4 px-4 py-3 bg-[#0C211E] text-white text-sm font-bold rounded-xl shadow-xl flex items-center gap-2 z-50"
                    >
                      <Check className="w-4 h-4 text-[#4ECCA3]"/> {wishlistToastMessage}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Trust Badges */}
              <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#4ECCA3]/10 flex items-center justify-center shrink-0">
                      <Truck className="w-5 h-5 text-[#4ECCA3]" />
                    </div>
                    <p className="text-sm font-bold text-gray-700 leading-tight">1-3 Werktage<br/><span className="font-medium text-xs text-gray-500">Kostenlos ab 500€</span></p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#4ECCA3]/10 flex items-center justify-center shrink-0">
                      <ShieldCheck className="w-5 h-5 text-[#4ECCA3]" />
                    </div>
                    <p className="text-sm font-bold text-gray-700 leading-tight">2 Jahre Garantie<br/><span className="font-medium text-xs text-gray-500">Auf alle Artikel</span></p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#4ECCA3]/10 flex items-center justify-center shrink-0">
                      <RotateCcw className="w-5 h-5 text-[#4ECCA3]" />
                    </div>
                    <p className="text-sm font-bold text-gray-700 leading-tight">30 Tage Retour<br/><span className="font-medium text-xs text-gray-500">Einfach & schnell</span></p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Detailed Info Tabs - Desktop */}
        <div className="mt-16 lg:mt-24 hidden lg:block max-w-7xl mx-auto">
          <div className="flex justify-center gap-12 border-b border-gray-200">
            {[
              { id: 'description', label: 'Beschreibung' },
              { id: 'specs', label: 'Technische Daten' },
              { id: 'reviews', label: `Bewertungen (${product.reviewCount})` },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`pb-4 text-base font-bold transition-all relative ${
                  activeTab === tab.id ? 'text-[#0C211E]' : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <motion.div layoutId="activeTab" className="absolute bottom-[-1px] left-0 right-0 h-0.5 bg-[#4ECCA3]" />
                )}
              </button>
            ))}
          </div>

          <div className="py-12 flex justify-center">
            <AnimatePresence mode="wait">
              {activeTab === 'description' && (
                <motion.div key="description" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="w-full max-w-4xl text-center">
                  <h3 className="text-3xl font-bold text-[#0C211E] mb-6 font-heading">Die Revolution in Ihrer Küche</h3>
                  <p className="text-gray-500 text-lg leading-relaxed mb-12">{product.description.de}</p>
                  
                  <div className="grid sm:grid-cols-2 gap-6 text-left">
                    {[
                      { icon: Zap, title: t('features.smartHeat.title') || 'SmartHeat Tech', desc: t('features.smartHeat.desc') || 'Schnelle und gleichmäßige Hitzeverteilung.' },
                      { icon: Leaf, title: t('features.ecoPower.title') || 'Eco-Friendly', desc: t('features.ecoPower.desc') || 'Ressourcenschonende Herstellung.' },
                      { icon: Shield, title: t('features.safetyGuard.title') || 'Safety First', desc: t('features.safetyGuard.desc') || 'Schutzzonen für sichere Handhabung.' },
                      { icon: Award, title: t('features.premium.title') || 'Premium Qualität', desc: t('features.premium.desc') || 'Deutsche Ingenieurskunst.' },
                    ].map((feature) => (
                      <div key={feature.title} className="flex gap-4 p-6 bg-white rounded-2xl shadow-sm border border-gray-100">
                        <div className="w-12 h-12 bg-[#0C211E] rounded-xl flex items-center justify-center flex-shrink-0">
                          <feature.icon className="w-6 h-6 text-[#4ECCA3]" />
                        </div>
                        <div>
                          <h4 className="font-bold text-[#0C211E] mb-1">{feature.title}</h4>
                          <p className="text-sm font-medium text-gray-500">{feature.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {activeTab === 'specs' && (
                <motion.div key="specs" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="w-full">
                  <div className="grid grid-cols-2 lg:grid-cols-3 gap-6 w-full">
                    {[
                      { icon: Layers, label: t('specs.material') || 'Material', value: product.specs.material },
                      { icon: Maximize, label: t('specs.dimensions') || 'Abmessungen', value: product.specs.dimensions },
                      { icon: Scale, label: t('specs.weight') || 'Gewicht', value: product.specs.weight },
                      { icon: Droplets, label: t('specs.dishwasher') || 'Spülmaschine', value: product.specs.dishwasher ? 'Geeignet' : 'Handwäsche empfohlen' },
                      { icon: Zap, label: t('specs.induction') || 'Induktion', value: product.specs.induction ? 'Optimiert' : 'Nicht kompatibel' },
                      { icon: ShieldCheck, label: 'Garantie', value: '2 Jahre Premium' },
                    ].map((spec, index) => (
                      <div key={spec.label} className="flex flex-col items-center text-center p-8 bg-white rounded-[2rem] border border-gray-100 shadow-[0_4px_20px_rgb(0,0,0,0.02)] hover:shadow-[0_10px_30px_rgb(0,0,0,0.06)] hover:-translate-y-1 transition-all duration-300">
                        <div className="w-16 h-16 mb-5 bg-[#4ECCA3]/10 rounded-2xl flex items-center justify-center text-[#4ECCA3]">
                          <spec.icon className="w-8 h-8" />
                        </div>
                        <span className="text-gray-400 font-bold text-[10px] uppercase tracking-widest mb-2">{spec.label}</span>
                        <span className="font-bold text-[#0C211E] text-base leading-snug">{spec.value}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {activeTab === 'reviews' && (
                <motion.div key="reviews" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="w-full">
                  <ProductReviews productId={product.id} averageRating={product.rating} totalReviews={product.reviewCount} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Detailed Info - Mobile Accordion */}
        <div className="lg:hidden mt-10 space-y-3">
          {[
            { 
              id: 'description', 
              label: 'Beschreibung',
              content: (
                <div className="pt-2 text-gray-500 text-sm font-medium leading-relaxed">
                  <p className="mb-6 block">{product.description.de}</p>
                  <div className="grid gap-3">
                    {[
                      { icon: Zap, title: 'SmartHeat Tech', desc: 'Schnelle Hitzeverteilung.' },
                      { icon: Leaf, title: 'Eco-Friendly', desc: 'Ressourcenschonend.' },
                    ].map((feature) => (
                      <div key={feature.title} className="flex gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                        <div className="w-10 h-10 bg-[#0C211E] rounded-xl flex items-center justify-center flex-shrink-0">
                          <feature.icon className="w-5 h-5 text-[#4ECCA3]" />
                        </div>
                        <div>
                          <h4 className="font-bold text-[#0C211E] text-sm">{feature.title}</h4>
                          <p className="text-xs text-gray-500">{feature.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )
            },
            { 
              id: 'specs', 
              label: 'Technische Daten',
              content: (
                <div className="pt-2">
                  <div className="grid grid-cols-2 gap-3 pb-2">
                    {[
                      { icon: Layers, label: 'Material', value: product.specs.material },
                      { icon: Scale, label: 'Gewicht', value: product.specs.weight },
                      { icon: Droplets, label: 'Spülmaschine', value: product.specs.dishwasher ? 'Ja' : 'Nein' },
                      { icon: Maximize, label: 'Größe', value: product.specs.dimensions },
                    ].map((spec, i) => (
                      <div key={spec.label} className="bg-gray-50 rounded-2xl p-4 flex flex-col items-center justify-center text-center border border-gray-100">
                        <spec.icon className="w-6 h-6 text-[#4ECCA3] mb-2" />
                        <span className="text-gray-400 font-bold text-[9px] uppercase tracking-widest">{spec.label}</span>
                        <span className="font-bold text-[#0C211E] text-xs mt-1">{spec.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )
            },
            { 
              id: 'reviews', 
              label: `Bewertungen (${product.reviewCount})`,
              content: (
                <div className="pt-2">
                  <ProductReviews productId={product.id} averageRating={product.rating} totalReviews={product.reviewCount} />
                </div>
              )
            },
          ].map((section) => (
            <div key={section.id} className="bg-white rounded-[1.5rem] border border-gray-100 shadow-sm overflow-hidden">
              <button
                onClick={() => setExpandedAccordion(expandedAccordion === section.id ? null : section.id)}
                className="w-full flex items-center justify-between p-5 text-left"
              >
                <span className="font-bold text-[#0C211E] text-base">{section.label}</span>
                <motion.div animate={{ rotate: expandedAccordion === section.id ? 180 : 0 }} transition={{ duration: 0.2 }}>
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                </motion.div>
              </button>
              <AnimatePresence>
                {expandedAccordion === section.id && (
                  <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden">
                    <div className="px-5 pb-5">{section.content}</div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-16 lg:mt-24 pt-10 border-t border-gray-200">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#0C211E] font-heading mb-8">Passend dazu</h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-8">
              {relatedProducts.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="group"
                >
                  <Link href={`/produkt/${item.slug}`} className="block h-full">
                    <div className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col h-full">
                      <div className="relative aspect-square bg-gray-50 p-6">
                        <div className="absolute inset-0 bg-white" />
                        <Image 
                          src={item.images[0]} 
                          alt={item.name.de} 
                          fill 
                          className="object-contain p-6 group-hover:scale-110 transition-transform duration-700 mix-blend-multiply" 
                          sizes="(max-width: 640px) 50vw, 25vw"
                        />
                      </div>
                      <div className="p-5 flex-1 flex flex-col border-t border-gray-50">
                        <h3 className="font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-[#4ECCA3] transition-colors text-sm sm:text-base">{item.name.de}</h3>
                        <div className="mt-auto pt-2 flex items-end gap-2">
                          <span className="text-lg sm:text-xl font-black text-[#0C211E]">{item.price.toFixed(2).replace('.', ',')} €</span>
                          {item.oldPrice && <span className="text-xs sm:text-sm font-semibold text-gray-400 line-through decoration-gray-300 pb-0.5">{item.oldPrice.toFixed(2).replace('.', ',')} €</span>}
                        </div>
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
          productName={product.name.de}
        />
      </div>
    </article>
  )
}
