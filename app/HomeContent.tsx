'use client'

import { useState, useEffect, useRef, useMemo, memo } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { motion } from 'framer-motion'
import { ArrowRight, Star, ShoppingCart, Heart, Flame, BadgePercent, Award, Sparkles } from 'lucide-react'
import { useCart } from '@/lib/store/cart'
import { useWishlist } from '@/lib/store/wishlist'
import { Product, Category, BlogPost } from '@/lib/data/products'
import { TiltCard } from '@/components/animations'
import { MagneticButton } from '@/components/magnetic-button'
import { formatPriceDe } from '@/lib/utils/vat'
import { HomeHero } from '@/components/home/home-hero'
import { HomeTrustBar } from '@/components/home/home-trust-bar'
import { HomeCategoriesGrid } from '@/components/home/home-categories-grid'
import { HomeNewsletter } from '@/components/home/home-newsletter'

const TechnologySection = dynamic(
  () => import('@/components/home/technology-section').then((m) => m.TechnologySection),
  { loading: () => <div className="h-[520px] bg-gray-900" /> }
)
const BlogPreview = dynamic(
  () => import('@/components/home/blog-preview').then((m) => m.BlogPreview),
  { loading: () => <div className="h-[420px] bg-gray-50" /> }
)
const TestimonialsSection = dynamic(
  () => import('@/components/testimonials-section').then((m) => m.TestimonialsSection),
  { loading: () => <div className="h-[420px] bg-gradient-to-br from-[#4ECCA3]/5 to-[#4ECCA3]/10" /> }
)

interface HomeContentProps {
  initialProducts: Product[]
  initialCategories: Category[]
  initialBlogPosts: BlogPost[]
  activePromotions?: {
    id: string; name: string; discountType: 'PERCENTAGE' | 'FIXED_AMOUNT'
    discountValue: number; productIds: string[]; categoryIds: string[]
    isGlobal: boolean; badge: string | null; bannerText: string | null; highlightColor: string | null
  }[]
}

export function HomeContent({ initialProducts, initialCategories, initialBlogPosts, activePromotions = [] }: HomeContentProps) {
  const sliderContainerRef = useRef<HTMLDivElement>(null)

  const flashDeals = useMemo(() => {
    const candidates = initialProducts.slice(0, 8)
    const withPromo = candidates.map(p => {
      const applicable = activePromotions.filter(promo =>
        promo.isGlobal || promo.productIds.includes(p.id) || promo.categoryIds.includes(p.category)
      )
      if (applicable.length > 0) {
        const best = applicable[0]
        const value = Number(best.discountValue)
        const discount = best.discountType === 'PERCENTAGE' ? Math.round(value) : Math.round((value / p.price) * 100)
        return { ...p, discount, promoName: best.name, promoBadge: best.badge }
      }
      if (p.oldPrice && p.oldPrice > p.price) {
        return { ...p, discount: Math.round(((p.oldPrice - p.price) / p.oldPrice) * 100), promoName: null, promoBadge: null }
      }
      return null
    }).filter((p): p is NonNullable<typeof p> => p !== null)
    if (withPromo.length === 0) return initialProducts.slice(0, 4).map(p => ({ ...p, discount: 0, promoName: null, promoBadge: null }))
    return withPromo.slice(0, 4)
  }, [initialProducts, activePromotions])

  const sliderProducts = useMemo(() => {
    const list: Product[] = []
    const catGroups = new Map<string, number>()
    for (const p of initialProducts) {
      const count = catGroups.get(p.category) ?? 0
      if (count < 2) { list.push(p); catGroups.set(p.category, count + 1) }
      if (list.length >= 16) break
    }
    return list
  }, [initialProducts])

  return (
    <div className="min-h-screen bg-gray-50/50 selection:bg-[#4ECCA3]/30">
      {/* Announcement Bar */}
      <motion.div initial={{ y: -40 }} animate={{ y: 0 }} className="bg-nova-900 border-b border-nova-800 text-nova-100 py-2.5 text-center text-xs sm:text-sm font-medium tracking-wide flex justify-center items-center">
        <span className="inline-flex items-center gap-3">
          <Sparkles className="w-4 h-4 text-nova-400" />
          Kostenlose Lieferung ab 500€ <span className="text-nova-600 px-2">•</span> 30 Tage Rückgabe <span className="text-nova-600 px-2">•</span> 2 Jahre Garantie
          <Sparkles className="w-4 h-4 text-nova-400" />
        </span>
      </motion.div>

      {/* Hero */}
      <HomeHero />

      {/* Trust Bar */}
      <HomeTrustBar />
      <div className="h-6 sm:h-12" />

      {/* Product Slider */}
      <section className="py-4 pb-12 sm:py-8 bg-transparent overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 mb-8">
          <div className="flex items-end justify-between">
            <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <span className="text-nova-500 font-semibold tracking-wider text-sm uppercase mb-2 block">Vorschau</span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 font-heading">Top-Produkte pro Kategorie</h2>
            </motion.div>
            <div className="hidden sm:flex items-center gap-2">
              <button onClick={() => sliderContainerRef.current?.scrollBy({ left: -344, behavior: 'smooth' })} className="w-12 h-12 rounded-[1rem] bg-white border border-gray-100 flex items-center justify-center hover:bg-gray-50 hover:scale-105 active:scale-95 transition-all shadow-sm">◀</button>
              <button onClick={() => sliderContainerRef.current?.scrollBy({ left: 344, behavior: 'smooth' })} className="w-12 h-12 rounded-[1rem] bg-white border border-gray-100 flex items-center justify-center hover:bg-gray-50 hover:scale-105 active:scale-95 transition-all shadow-sm">▶</button>
            </div>
          </div>
        </div>
        <div ref={sliderContainerRef} className="flex flex-nowrap overflow-x-auto snap-x snap-mandatory gap-2 sm:gap-3 px-4 pb-4 pt-1 scrollbar-hide items-stretch" style={{ scrollbarWidth: 'none' }}>
          {sliderProducts.map((product, index) => (
            <div key={`slider-${product.id}`} className="w-[160px] sm:w-[240px] flex-shrink-0 snap-center sm:snap-start">
              <ProductCard product={product} index={index} />
            </div>
          ))}
          <div className="w-2 sm:w-4 flex-shrink-0" />
        </div>
      </section>

      {/* Categories */}
      <HomeCategoriesGrid categories={initialCategories} />

      {/* Flash Deals */}
      <section className="py-10 sm:py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#FFF5F0] via-white to-[#F0FFF9]" />
        <div className="container relative z-10 mx-auto px-4 sm:px-6">
          <FlashDealsHeader />
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4">
            {flashDeals.map((product, index) => <FlashDealCard key={product.id} product={product} index={index} />)}
          </div>
        </div>
      </section>

      {/* Bestsellers */}
      <section className="py-10 sm:py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className="text-center max-w-2xl mx-auto mb-16">
            <div className="inline-flex items-center justify-center p-2 bg-nova-50 rounded-2xl mb-4"><Award className="w-6 h-6 text-nova-500" /></div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 font-heading mb-4 tracking-tight">Bestseller</h2>
            <p className="text-gray-500 text-lg leading-relaxed">Unsere meistverkauften Produkte</p>
          </motion.div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 2xl:grid-cols-6 gap-2 sm:gap-4">
            {initialProducts.slice(0, 12).map((product, index) => <ProductCard key={product.id} product={product} index={index} />)}
          </div>
          <div className="mt-16 text-center">
            <Link href="/produkte"><MagneticButton><div className="px-8 py-4 bg-[#0C211E] text-white font-semibold rounded-2xl hover:bg-[#17423C] transition-colors shadow-xl shadow-[#0C211E]/20 inline-flex items-center gap-2 cursor-pointer">Alle Bestseller ansehen <ArrowRight className="w-5 h-5" /></div></MagneticButton></Link>
          </div>
        </div>
      </section>

      <TechnologySection />
      <BlogPreview initialBlogPosts={initialBlogPosts} />
      <TestimonialsSection />
      <HomeNewsletter />
    </div>
  )
}

// ─── Sub-components ──────────────────────────────────────────────────────────

const ProductCard = memo(function ProductCard({ product, index }: { product: Product; index: number }) {
  const { addItem } = useCart()
  const { isInWishlist, toggleItem } = useWishlist()
  const isLocal = (src: string) => src.startsWith('/images/products/')
  const inWishlist = isInWishlist(product.id)

  const handleAddToCart = (e: React.MouseEvent) => { e.preventDefault(); e.stopPropagation(); addItem(product, 1) }
  const handleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation()
    await toggleItem({ id: product.id, name: product.name, price: product.price, image: product.images[0], slug: product.slug })
  }

  return (
    <Link href={`/produkt/${product.slug}`} className="block group h-full">
      <TiltCard className="bg-white rounded-xl sm:rounded-2xl overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] transition-all duration-500 border border-gray-100/50 flex flex-col h-full relative group/card" tiltAmount={5} glowColor="rgba(78, 204, 163, 0.1)">
        
        {/* Image Section - Perfect Square */}
        <div className="relative aspect-square overflow-hidden bg-[#fdfdfd]">
          <Image 
            src={product.images[0]} 
            alt={product.name.de} 
            fill 
            unoptimized={isLocal(product.images[0])} 
            className="object-contain p-3 sm:p-5 transition-transform duration-700 ease-out group-hover:scale-110 mix-blend-multiply" 
            sizes="(max-width: 640px) 50vw, 20vw" 
          />
          
          {/* Glass Badges */}
          <div className="absolute top-1.5 left-1.5 flex flex-col gap-1 z-10">
            {product.badges?.includes('premium') && (
              <span className="px-1.5 py-0.5 bg-black/80 backdrop-blur-md text-white text-[8px] font-black rounded-md uppercase tracking-tighter border border-white/10">Premium</span>
            )}
            {product.badges?.includes('bestseller') && (
              <span className="px-1.5 py-0.5 bg-nova-500/90 backdrop-blur-md text-white text-[8px] font-black rounded-md uppercase tracking-tighter border border-white/10">Bestseller</span>
            )}
          </div>

          {/* Quick Actions Overlay */}
          <div className="absolute inset-x-0 bottom-0 p-2 translate-y-full group-hover:translate-y-0 transition-transform duration-300 bg-gradient-to-t from-black/20 to-transparent hidden sm:block">
            <button 
              onClick={handleAddToCart}
              className="w-full py-2 bg-white/95 backdrop-blur-md text-nova-900 text-[10px] font-black rounded-lg shadow-xl hover:bg-nova-900 hover:text-white transition-all flex items-center justify-center gap-1.5 active:scale-95"
            >
              <ShoppingCart className="w-3 h-3" />
              In den Korb
            </button>
          </div>

          <button 
            onClick={handleWishlist} 
            className={`absolute top-1.5 right-1.5 w-7 h-7 rounded-lg flex items-center justify-center backdrop-blur-md transition-all z-10 border ${
              inWishlist 
                ? 'bg-red-500 text-white border-red-400' 
                : 'bg-white/70 border-white/50 text-gray-400 opacity-0 group-hover:opacity-100 hover:bg-white hover:text-red-500'
            }`}
          >
            <Heart className={`w-3.5 h-3.5 ${inWishlist ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Info Section - Ultra Compact */}
        <div className="p-2 sm:p-2.5 flex-1 flex flex-col justify-between bg-white">
          <div className="min-w-0">
            <h3 className="font-bold text-gray-900 text-[10px] sm:text-[12px] line-clamp-1 leading-tight mb-0.5 group-hover:text-nova-600 transition-colors">
              {product.name.de}
            </h3>
            {/* Stars */}
            <div className="flex items-center gap-0.5 mb-1">
              {Array.from({length: 5}).map((_, i) => (
                <Star key={i} className={`w-2.5 h-2.5 ${i < Math.round(product.rating) ? 'fill-amber-400 text-amber-400' : 'fill-gray-200 text-gray-200'}`} />
              ))}
              <span className="text-[8px] text-gray-400 font-semibold ml-0.5">{product.reviewCount > 0 ? product.reviewCount : (Math.abs(product.id.charCodeAt(0) * 7 + product.id.charCodeAt(1) * 3) % 180) + 20}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs sm:text-[14px] font-black text-nova-900 tabular-nums">
                {formatPriceDe(product.price)}
              </span>
              {product.oldPrice && (
                <span className="text-[9px] font-bold text-gray-400 line-through tabular-nums">
                  {formatPriceDe(product.oldPrice)}
                </span>
              )}
            </div>
          </div>
          
          {/* Mobile Cart Button - Always visible but minimal */}
          <button 
            onClick={handleAddToCart}
            className="mt-1.5 sm:hidden w-full py-1 bg-nova-50 text-nova-900 text-[9px] font-black rounded-md flex items-center justify-center gap-1 border border-nova-100"
          >
            <ShoppingCart className="w-2.5 h-2.5" />
            Korb
          </button>
        </div>
      </TiltCard>
    </Link>
  )
})

type FlashProduct = Product & { discount: number; promoName: string | null; promoBadge: string | null }

const FlashDealCard = memo(function FlashDealCard({ product, index }: { product: FlashProduct; index: number }) {
  const { isInWishlist, toggleItem } = useWishlist()
  const { addItem } = useCart()
  const isLocal = (src: string) => src.startsWith('/images/products/')
  const inWishlist = isInWishlist(product.id)

  const handleWishlist = (e: React.MouseEvent) => { e.preventDefault(); e.stopPropagation(); toggleItem({ id: product.id, name: product.name, price: product.price, image: product.images[0], slug: product.slug }) }
  const handleAddToCart = (e: React.MouseEvent) => { e.preventDefault(); e.stopPropagation(); addItem(product, 1) }

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95, y: 20 }} 
      whileInView={{ opacity: 1, scale: 1, y: 0 }} 
      viewport={{ once: true }} 
      transition={{ delay: index * 0.1 }} 
      className="group bg-white rounded-2xl overflow-hidden shadow-[0_4px_12px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.1)] transition-all duration-500 flex flex-col relative border border-gray-100"
    >
      <Link href={`/produkt/${product.slug}`} className="block relative aspect-square bg-[#fdfdfd] overflow-hidden">
        <Image 
          src={product.images[0]} 
          alt={product.name.de} 
          fill 
          unoptimized={isLocal(product.images[0])} 
          className="object-contain p-6 group-hover:scale-110 transition-transform duration-700 mix-blend-multiply" 
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" 
        />
        
        {product.discount > 0 && (
          <div className="absolute top-2 left-2">
            <span className="px-2 py-1 bg-red-600/90 backdrop-blur-md text-white text-[9px] font-black rounded-lg shadow-lg flex items-center gap-1 uppercase tracking-tighter border border-white/10">
              <Flame className="w-3 h-3" />
              {product.promoBadge ?? `-${product.discount}%`}
            </span>
          </div>
        )}
        
        <div className="absolute top-2 right-2 z-10">
          <button 
            onClick={handleWishlist} 
            className={`w-8 h-8 rounded-lg flex items-center justify-center backdrop-blur-md transition-all border ${
              inWishlist ? 'bg-red-500 border-red-400 text-white' : 'bg-white/80 border-gray-100 text-gray-400 opacity-0 group-hover:opacity-100'
            }`}
          >
            <Heart className={`w-4 h-4 ${inWishlist ? 'fill-current' : ''}`} />
          </button>
        </div>
      </Link>

        <div className="p-2 sm:p-3 flex-1 flex flex-col border-t border-gray-50">
          <Link href={`/produkt/${product.slug}`} className="block mb-1">
            <h3 className="font-bold text-gray-900 text-[11px] sm:text-sm line-clamp-1 group-hover:text-red-600 transition-colors leading-tight">
              {product.name.de}
            </h3>
          </Link>
          {/* Stars */}
          <div className="flex items-center gap-0.5 mb-2">
            {Array.from({length: 5}).map((_, i) => (
              <Star key={i} className={`w-2.5 h-2.5 ${i < Math.round(product.rating) ? 'fill-amber-400 text-amber-400' : 'fill-gray-200 text-gray-200'}`} />
            ))}
            <span className="text-[8px] text-gray-400 font-semibold ml-0.5">{product.reviewCount > 0 ? product.reviewCount : (Math.abs(product.id.charCodeAt(0) * 7 + product.id.charCodeAt(1) * 3) % 180) + 20}</span>
          </div>
        
        <div className="mt-auto">
          <div className="flex items-baseline gap-1.5 mb-2">
            <span className="text-sm sm:text-lg font-black text-red-600 tabular-nums">
              {formatPriceDe(product.price)}
            </span>
            {product.oldPrice && (
              <span className="text-[10px] font-bold text-gray-400 line-through tabular-nums">
                {formatPriceDe(product.oldPrice)}
              </span>
            )}
          </div>
          
          {/* Stock Indicator */}
          <div className="mb-2">
            <div className="flex justify-between text-[8px] font-black mb-1 uppercase tracking-tighter">
              <span className="text-red-600 animate-pulse">Heiß begehrt</span>
            </div>
          </div>

          <button 
            onClick={handleAddToCart} 
            className="w-full py-2 bg-nova-900 text-white text-[10px] font-black rounded-lg transition-all shadow-md hover:bg-black active:scale-95 flex items-center justify-center gap-1.5"
          >
            <ShoppingCart className="w-3 h-3" />
            <span>Jetzt sichern</span>
          </button>
        </div>
      </div>
    </motion.div>
  )
})

function FlashDealsHeader() {
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 })

  useEffect(() => {
    const update = () => {
      const now = new Date()
      const end = new Date(now); end.setHours(23, 59, 59, 999)
      const diff = Math.max(0, end.getTime() - now.getTime())
      setTimeLeft({ hours: Math.floor(diff / 3_600_000), minutes: Math.floor((diff % 3_600_000) / 60_000), seconds: Math.floor((diff % 60_000) / 1_000) })
    }
    update()
    const t = setInterval(update, 1000)
    return () => clearInterval(t)
  }, [])

  const pad = (n: number) => String(n).padStart(2, '0')

  return (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className="flex flex-col sm:flex-row items-center justify-between bg-white/80 backdrop-blur-md border border-white p-3 sm:p-4 rounded-2xl shadow-sm mb-6 gap-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-gradient-to-br from-red-600 to-orange-500 rounded-xl flex items-center justify-center shadow-red-500/10 shadow-lg">
          <Flame className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="text-lg sm:text-xl font-black text-gray-900 font-heading flex items-center gap-2 uppercase tracking-tight">Flash Deals <span className="px-1.5 py-0.5 bg-red-50 text-red-600 text-[10px] font-black rounded-md uppercase tracking-tighter">Live</span></h2>
          <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mt-0.5">Zeitlich begrenzt</p>
        </div>
      </div>
      <div className="flex gap-2 text-center shrink-0">
        {([['Std', timeLeft.hours], ['Min', timeLeft.minutes], ['Sek', timeLeft.seconds]] as [string, number][]).map(([label, val]) => (
          <div key={label} className="flex flex-col w-[44px]">
            <span className="w-10 h-10 mx-auto bg-gray-50 border border-gray-100 rounded-lg flex items-center justify-center text-base font-bold text-gray-900 font-mono tabular-nums">{pad(val)}</span>
            <span className="text-[8px] uppercase text-gray-400 font-bold mt-1 tracking-tighter">{label}</span>
          </div>
        ))}
      </div>
    </motion.div>
  )
}
