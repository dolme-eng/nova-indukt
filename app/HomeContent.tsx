'use client'

import { useRef, useMemo, memo } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { motion } from 'framer-motion'
import { ArrowRight, Star, ShoppingCart, Heart, Flame, Award, Sparkles } from 'lucide-react'
import { useCart } from '@/lib/store/cart'
import { useWishlist } from '@/lib/store/wishlist'
import { Product, Category, BlogPost } from '@/lib/data/products'
import { TiltCard } from '@/components/animations'
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
  {
    loading: () => <div className="h-[420px] bg-gradient-to-br from-[#4ECCA3]/5 to-[#4ECCA3]/10" />,
  }
)

interface TestimonialData {
  id: string
  name: string
  rating: number
  comment: string
  productName: string
  createdAt: string
  isVerified: boolean
}

interface HomeContentProps {
  initialProducts: Product[]
  initialCategories: Category[]
  initialBlogPosts: BlogPost[]
  initialTestimonials?: TestimonialData[]
  activePromotions?: {
    id: string
    name: string
    discountType: 'PERCENTAGE' | 'FIXED_AMOUNT'
    discountValue: number
    productIds: string[]
    categoryIds: string[]
    isGlobal: boolean
    badge: string | null
    bannerText: string | null
    highlightColor: string | null
  }[]
}

export function HomeContent({
  initialProducts,
  initialCategories,
  initialBlogPosts,
  initialTestimonials = [],
  activePromotions = [],
}: HomeContentProps) {
  const sliderContainerRef = useRef<HTMLDivElement>(null)

  const flashDeals = useMemo(() => {
    const candidates = initialProducts.slice(0, 8)
    const withPromo = candidates
      .map((p) => {
        const applicable = activePromotions.filter(
          (promo) =>
            promo.isGlobal ||
            promo.productIds.includes(p.id) ||
            promo.categoryIds.includes(p.category)
        )
        if (applicable.length > 0) {
          const best = applicable[0]
          const value = Number(best.discountValue)
          const discount =
            best.discountType === 'PERCENTAGE'
              ? Math.round(value)
              : Math.round((value / p.price) * 100)
          return { ...p, discount, promoName: best.name, promoBadge: best.badge }
        }
        if (p.oldPrice && p.oldPrice > p.price) {
          return {
            ...p,
            discount: Math.round(((p.oldPrice - p.price) / p.oldPrice) * 100),
            promoName: null,
            promoBadge: null,
          }
        }
        return null
      })
      .filter((p): p is NonNullable<typeof p> => p !== null)
    if (withPromo.length === 0)
      return initialProducts
        .slice(0, 4)
        .map((p) => ({ ...p, discount: 0, promoName: null, promoBadge: null }))
    return withPromo.slice(0, 4)
  }, [initialProducts, activePromotions])

  const sliderProducts = useMemo(() => {
    const list: Product[] = []
    const catGroups = new Map<string, number>()
    for (const p of initialProducts) {
      const count = catGroups.get(p.category) ?? 0
      if (count < 2) {
        list.push(p)
        catGroups.set(p.category, count + 1)
      }
      if (list.length >= 16) break
    }
    return list
  }, [initialProducts])

  return (
    <div className="min-h-screen bg-gray-50/50 selection:bg-[#4ECCA3]/30">
      {/* Announcement Bar */}
      <motion.div
        initial={{ y: -40 }}
        animate={{ y: 0 }}
        className="flex items-center justify-center border-b border-nova-800 bg-nova-900 py-2.5 text-center text-xs font-medium tracking-wide text-nova-100 sm:text-sm"
      >
        <span className="inline-flex items-center gap-3">
          <Sparkles className="h-4 w-4 text-nova-400" />
          Kostenlose Lieferung ab 500€ <span className="px-2 text-nova-600">•</span> 30 Tage
          Rückgabe <span className="px-2 text-nova-600">•</span> 2 Jahre Garantie
          <Sparkles className="h-4 w-4 text-nova-400" />
        </span>
      </motion.div>

      {/* Hero */}
      <HomeHero />

      {/* Trust Bar */}
      <HomeTrustBar />
      <div className="h-6 sm:h-12" />

      {/* Product Slider */}
      <section className="overflow-hidden bg-transparent py-4 pb-12 sm:py-8">
        <div className="container mx-auto mb-8 px-4 sm:px-6">
          <div className="flex items-end justify-between">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <span className="mb-2 block text-sm font-semibold uppercase tracking-wider text-nova-500">
                Entdecken
              </span>
              <h2 className="font-heading text-2xl font-bold text-gray-900 sm:text-3xl lg:text-4xl">
                Top-Produkte pro Kategorie
              </h2>
            </motion.div>
            <div className="hidden items-center gap-2 sm:flex">
              <button
                onClick={() =>
                  sliderContainerRef.current?.scrollBy({ left: -344, behavior: 'smooth' })
                }
                className="flex h-12 w-12 items-center justify-center rounded-[1rem] border border-gray-100 bg-white shadow-sm transition-all hover:scale-105 hover:bg-gray-50 active:scale-95"
                aria-label="Vorherige Produkte"
              >
                ◀
              </button>
              <button
                onClick={() =>
                  sliderContainerRef.current?.scrollBy({ left: 344, behavior: 'smooth' })
                }
                className="flex h-12 w-12 items-center justify-center rounded-[1rem] border border-gray-100 bg-white shadow-sm transition-all hover:scale-105 hover:bg-gray-50 active:scale-95"
                aria-label="Nächste Produkte"
              >
                ▶
              </button>
            </div>
          </div>
        </div>
        <div
          ref={sliderContainerRef}
          className="scrollbar-hide flex snap-x snap-mandatory flex-nowrap items-stretch gap-2 overflow-x-auto px-4 pb-4 pt-1 sm:gap-3"
          style={{ scrollbarWidth: 'none' }}
        >
          {sliderProducts.map((product, index) => (
            <div
              key={`slider-${product.id}`}
              className="w-[160px] flex-shrink-0 snap-center sm:w-[240px] sm:snap-start"
            >
              <ProductCard product={product} index={index} />
            </div>
          ))}
          <div className="w-2 flex-shrink-0 sm:w-4" />
        </div>
      </section>

      {/* Categories */}
      <HomeCategoriesGrid categories={initialCategories} />

      {/* Flash Deals */}
      <section className="relative overflow-hidden py-10 sm:py-16">
        <div className="absolute inset-0 bg-gradient-to-br from-[#FFF5F0] via-white to-[#F0FFF9]" />
        <div className="container relative z-10 mx-auto px-4 sm:px-6">
          <FlashDealsHeader />
          <div className="grid grid-cols-2 gap-2 sm:gap-4 lg:grid-cols-4">
            {flashDeals.map((product, index) => (
              <FlashDealCard key={product.id} product={product} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Bestsellers */}
      <section className="bg-white py-10 sm:py-16">
        <div className="container mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="mx-auto mb-16 max-w-2xl text-center"
          >
            <div className="mb-4 inline-flex items-center justify-center rounded-2xl bg-nova-50 p-2">
              <Award className="h-6 w-6 text-nova-500" />
            </div>
            <h2 className="mb-4 font-heading text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl md:text-5xl">
              Bestseller
            </h2>
            <p className="text-lg leading-relaxed text-gray-500">Unsere meistverkauften Produkte</p>
          </motion.div>
          <div className="grid grid-cols-2 gap-2 sm:gap-4 md:grid-cols-3 lg:grid-cols-5 2xl:grid-cols-6">
            {initialProducts.slice(0, 12).map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </div>
          <div className="mt-16 text-center">
            <Link
              href="/produkte"
              className="inline-flex items-center gap-2 rounded-2xl bg-[#0C211E] px-8 py-4 font-semibold text-white shadow-xl shadow-[#0C211E]/20 transition-colors hover:bg-[#17423C]"
            >
              Alle Bestseller ansehen <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      <TechnologySection />
      <BlogPreview initialBlogPosts={initialBlogPosts} />
      <TestimonialsSection initialTestimonials={initialTestimonials} />
      <HomeNewsletter />
    </div>
  )
}

// ─── Sub-components ──────────────────────────────────────────────────────────

const ProductCard = memo(function ProductCard({ product }: { product: Product; index: number }) {
  const { addItem } = useCart()
  const { isInWishlist, toggleItem } = useWishlist()
  const isLocal = (src: string) => src?.startsWith('/images/products/') ?? false
  const inWishlist = isInWishlist(product.id)

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    addItem(product, 1)
  }
  const handleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    await toggleItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0],
      slug: product.slug,
    })
  }

  return (
    <Link href={`/produkt/${product.slug}`} className="group block h-full">
      <TiltCard
        className="group/card relative flex h-full flex-col overflow-hidden rounded-xl border border-gray-100/50 bg-white shadow-[0_2px_8px_rgba(0,0,0,0.04)] transition-all duration-500 hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] sm:rounded-2xl"
        tiltAmount={5}
        glowColor="rgba(78, 204, 163, 0.1)"
      >
        {/* Image Section - Perfect Square */}
        <div className="relative aspect-square overflow-hidden bg-[#fdfdfd]">
          <Image
            src={product.images[0]}
            alt={product.name.de}
            fill
            className="object-contain p-3 mix-blend-multiply transition-transform duration-700 ease-out group-hover:scale-110 sm:p-5"
            sizes="(max-width: 640px) 50vw, 20vw"
          />

          {/* Glass Badges */}
          <div className="absolute left-1.5 top-1.5 z-10 flex flex-col gap-1">
            {product.badges?.includes('premium') && (
              <span className="rounded-md border border-white/10 bg-black/80 px-1.5 py-0.5 text-[8px] font-black uppercase tracking-tighter text-white backdrop-blur-md">
                Premium
              </span>
            )}
            {product.badges?.includes('bestseller') && (
              <span className="rounded-md border border-white/10 bg-nova-500/90 px-1.5 py-0.5 text-[8px] font-black uppercase tracking-tighter text-white backdrop-blur-md">
                Bestseller
              </span>
            )}
          </div>

          {/* Quick Actions Overlay */}
          <div className="absolute inset-x-0 bottom-0 hidden translate-y-full bg-gradient-to-t from-black/20 to-transparent p-2 transition-transform duration-300 group-hover:translate-y-0 sm:block">
            <button
              onClick={handleAddToCart}
              className="flex w-full items-center justify-center gap-1.5 rounded-lg bg-white/95 py-2 text-[10px] font-black text-nova-900 shadow-xl backdrop-blur-md transition-all hover:bg-nova-900 hover:text-white active:scale-95"
            >
              <ShoppingCart className="h-3 w-3" />
              In den Korb
            </button>
          </div>

          <button
            onClick={handleWishlist}
            aria-label={inWishlist ? 'Von Wunschliste entfernen' : 'Zur Wunschliste hinzufügen'}
            className={`absolute right-1.5 top-1.5 z-10 flex h-7 w-7 items-center justify-center rounded-lg border backdrop-blur-md transition-all ${
              inWishlist
                ? 'border-red-400 bg-red-500 text-white'
                : 'border-white/50 bg-white/70 text-gray-400 opacity-0 hover:bg-white hover:text-red-500 group-hover:opacity-100'
            }`}
          >
            <Heart className={`h-3.5 w-3.5 ${inWishlist ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Info Section - Ultra Compact */}
        <div className="flex flex-1 flex-col justify-between bg-white p-2 sm:p-2.5">
          <div className="min-w-0">
            <h3 className="mb-0.5 line-clamp-1 text-[10px] font-bold leading-tight text-gray-900 transition-colors group-hover:text-nova-600 sm:text-[12px]">
              {product.name.de}
            </h3>
            {/* Stars */}
            <div className="mb-1 flex items-center gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`h-2.5 w-2.5 ${i < Math.round(product.rating) ? 'fill-amber-400 text-amber-400' : 'fill-gray-200 text-gray-200'}`}
                />
              ))}
              {product.reviewCount > 0 && (
                <span className="ml-0.5 text-[8px] font-semibold text-gray-400">
                  {product.reviewCount}
                </span>
              )}
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-black tabular-nums text-nova-900 sm:text-[14px]">
                {formatPriceDe(product.price)}
              </span>
              {product.oldPrice && (
                <span className="text-[9px] font-bold tabular-nums text-gray-400 line-through">
                  {formatPriceDe(product.oldPrice)}
                </span>
              )}
            </div>
          </div>

          {/* Mobile Cart Button - Always visible but minimal */}
          <button
            onClick={handleAddToCart}
            className="mt-1.5 flex w-full items-center justify-center gap-1 rounded-md border border-nova-100 bg-nova-50 py-1 text-[9px] font-black text-nova-900 sm:hidden"
          >
            <ShoppingCart className="h-2.5 w-2.5" />
            Korb
          </button>
        </div>
      </TiltCard>
    </Link>
  )
})

type FlashProduct = Product & {
  discount: number
  promoName: string | null
  promoBadge: string | null
}

const FlashDealCard = memo(function FlashDealCard({
  product,
  index,
}: {
  product: FlashProduct
  index: number
}) {
  const { isInWishlist, toggleItem } = useWishlist()
  const { addItem } = useCart()
  const isLocal = (src: string) => src?.startsWith('/images/products/') ?? false
  const inWishlist = isInWishlist(product.id)

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    toggleItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0],
      slug: product.slug,
    })
  }
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    addItem(product, 1)
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-[0_4px_12px_rgba(0,0,0,0.03)] transition-all duration-500 hover:shadow-[0_20px_40px_rgba(0,0,0,0.1)]"
    >
      <Link
        href={`/produkt/${product.slug}`}
        className="relative block aspect-square overflow-hidden bg-[#fdfdfd]"
      >
        <Image
          src={product.images[0]}
          alt={product.name.de}
          fill
          className="object-contain p-6 mix-blend-multiply transition-transform duration-700 group-hover:scale-110"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />

        {product.discount > 0 && (
          <div className="absolute left-2 top-2">
            <span className="flex items-center gap-1 rounded-lg border border-white/10 bg-red-600/90 px-2 py-1 text-[9px] font-black uppercase tracking-tighter text-white shadow-lg backdrop-blur-md">
              <Flame className="h-3 w-3" />
              {product.promoBadge ?? `-${product.discount}%`}
            </span>
          </div>
        )}

        <div className="absolute right-2 top-2 z-10">
          <button
            onClick={handleWishlist}
            className={`flex h-8 w-8 items-center justify-center rounded-lg border backdrop-blur-md transition-all ${
              inWishlist
                ? 'border-red-400 bg-red-500 text-white'
                : 'border-gray-100 bg-white/80 text-gray-400 opacity-0 group-hover:opacity-100'
            }`}
          >
            <Heart className={`h-4 w-4 ${inWishlist ? 'fill-current' : ''}`} />
          </button>
        </div>
      </Link>

      <div className="flex flex-1 flex-col border-t border-gray-50 p-2 sm:p-3">
        <Link href={`/produkt/${product.slug}`} className="mb-1 block">
          <h3 className="line-clamp-1 text-[11px] font-bold leading-tight text-gray-900 transition-colors group-hover:text-red-600 sm:text-sm">
            {product.name.de}
          </h3>
        </Link>
        {/* Stars */}
        <div className="mb-2 flex items-center gap-0.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={`h-2.5 w-2.5 ${i < Math.round(product.rating) ? 'fill-amber-400 text-amber-400' : 'fill-gray-200 text-gray-200'}`}
            />
          ))}
          {product.reviewCount > 0 && (
            <span className="ml-0.5 text-[8px] font-semibold text-gray-400">
              {product.reviewCount}
            </span>
          )}
        </div>

        <div className="mt-auto">
          <div className="mb-2 flex items-baseline gap-1.5">
            <span className="text-sm font-black tabular-nums text-red-600 sm:text-lg">
              {formatPriceDe(product.price)}
            </span>
            {product.oldPrice && (
              <span className="text-[10px] font-bold tabular-nums text-gray-400 line-through">
                {formatPriceDe(product.oldPrice)}
              </span>
            )}
          </div>

          {/* Stock Indicator */}
          <div className="mb-2">
            <div className="mb-1 flex justify-between text-[8px] font-black uppercase tracking-tighter">
              <span className="text-green-600">Auf Lager</span>
            </div>
          </div>

          <button
            onClick={handleAddToCart}
            className="flex w-full items-center justify-center gap-1.5 rounded-lg bg-nova-900 py-2 text-[10px] font-black text-white shadow-md transition-all hover:bg-black active:scale-95"
          >
            <ShoppingCart className="h-3 w-3" />
            <span>Jetzt sichern</span>
          </button>
        </div>
      </div>
    </motion.div>
  )
})

function FlashDealsHeader() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      className="mb-6 flex flex-col items-center justify-between gap-4 rounded-2xl border border-white bg-white/80 p-3 shadow-sm backdrop-blur-md sm:flex-row sm:p-4"
    >
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-red-600 to-orange-500 shadow-lg shadow-red-500/10">
          <Flame className="h-5 w-5 text-white" />
        </div>
        <div>
          <h2 className="flex items-center gap-2 font-heading text-lg font-black uppercase tracking-tight text-gray-900 sm:text-xl">
            Angebote
          </h2>
          <p className="mt-0.5 text-[10px] font-bold uppercase tracking-widest text-gray-400">
            spare bis zu 43%
          </p>
        </div>
      </div>
    </motion.div>
  )
}
