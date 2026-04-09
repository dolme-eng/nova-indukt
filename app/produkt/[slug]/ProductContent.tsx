'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import type { LucideIcon } from 'lucide-react'
import {
  Star, Heart, Share2, Truck, Shield, RotateCcw, ChevronRight, ChevronDown,
  Minus, Plus, ShoppingCart, Check,
  Award, Zap, Leaf, ZoomIn, ArrowLeft, ShieldCheck, Lock,
  Sparkles, Layers, Maximize, Scale, Droplets, Barcode, Building2, Hash, Info,
} from 'lucide-react'
import { useCart } from '@/lib/store/cart'
import { useWishlist } from '@/lib/store/wishlist'
import { products, categories, Product } from '@/lib/data/products'
import { ProductReviews } from '@/components/product-reviews'
import { ImageLightbox } from '@/components/image-lightbox'
import { DEFAULT_DE_VAT_PERCENT, formatDeEuro, formatPriceDe, grossFromNet, netFromGross } from '@/lib/utils/vat'

const SHELL = 'w-full max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 2xl:px-14'

// Escape HTML special characters to prevent XSS in JSON-LD
function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
}

function buildProductJsonLd(product: Product) {
  const o: Record<string, unknown> = {
    '@context': 'https://schema.org/',
    '@type': 'Product',
    name: escapeHtml(product.name.de),
    image: product.images,
    description: escapeHtml(product.shortDescription.de),
    sku: product.supplierSku || product.id,
    offers: {
      '@type': 'Offer',
      url: `https://nova-indukt.de/produkt/${product.slug}`,
      priceCurrency: 'EUR',
      price: product.price,
      availability:
        product.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      itemCondition: 'https://schema.org/NewCondition',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: product.rating,
      reviewCount: product.reviewCount,
    },
  }
  if (product.brand) o.brand = { '@type': 'Brand', name: escapeHtml(product.brand) }
  const ean = product.ean?.replace(/\s/g, '')
  if (ean && /^\d{8,14}$/.test(ean)) o.gtin13 = ean
  if (product.supplierSku) o.mpn = product.supplierSku
  return o
}

function supplierSpecCards(product: Product): { icon: LucideIcon; label: string; value: string }[] {
  const out: { icon: LucideIcon; label: string; value: string }[] = []
  if (product.brand) out.push({ icon: Building2, label: 'Marke', value: product.brand })
  if (product.ean) out.push({ icon: Barcode, label: 'EAN / GTIN', value: product.ean })
  if (product.supplierSku) out.push({ icon: Hash, label: 'Lieferanten-Art.-Nr.', value: product.supplierSku })
  return out
}

interface ProductContentProps {
  product: Product
}

export function ProductContent({ product }: ProductContentProps) {
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
      slug: product.slug,
    })
    setWishlistToastMessage(
      added ? 'Zur Wunschliste hinzugefügt' : 'Von Wunschliste entfernt',
    )
    setShowWishlistToast(true)
    setTimeout(() => setShowWishlistToast(false), 2000)
  }

  const category = categories.find((c) => c.id === product.category)
  const relatedProducts = products.filter((p) => p.category === product?.category && p.id !== product?.id).slice(0, 4)
  const vatPct = product.vatRatePercent ?? DEFAULT_DE_VAT_PERCENT
  const priceIncludesVat = product.priceIncludesVat !== false
  const supplierCards = supplierSpecCards(product)

  const shareProduct = () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      void navigator.share({ title: product.name.de, url: window.location.href })
    } else if (typeof window !== 'undefined') {
      void navigator.clipboard.writeText(window.location.href)
    }
  }

  const serviceItems = [
    {
      icon: Truck,
      title: '1–3 Werktage',
      sub: 'Kostenlos ab 500 €',
    },
    {
      icon: ShieldCheck,
      title: '2 Jahre Garantie',
      sub: 'Auf alle Artikel',
    },
    {
      icon: RotateCcw,
      title: '30 Tage Retour',
      sub: 'Einfach & schnell',
    },
  ]

  return (
    <article className="min-h-screen bg-[#f6f7f6] pb-24 lg:pb-14" itemScope itemType="https://schema.org/Product">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(buildProductJsonLd(product)) }} />

      <AnimatePresence>
        {showStickyBar && (
          <motion.div
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            exit={{ y: 100 }}
            className="fixed bottom-0 inset-x-0 z-40 border-t border-gray-200/80 bg-white/95 backdrop-blur-xl shadow-[0_-8px_32px_rgba(0,0,0,0.08)] pb-[max(0.75rem,env(safe-area-inset-bottom))]"
          >
            <div className={`${SHELL} flex flex-row items-center gap-3 py-3 sm:py-3.5`}>
              <div className="flex min-w-0 flex-1 items-center gap-3">
                <div className="relative hidden h-11 w-11 shrink-0 overflow-hidden rounded-lg border border-gray-100 bg-gray-50 sm:block">
                  <Image src={product.images[0]} alt={product.name.de} fill className="object-cover p-0.5 mix-blend-multiply" />
                </div>
                <div className="min-w-0">
                  <p className="font-bold tabular-nums text-[#0C211E] text-sm sm:text-base whitespace-nowrap">{formatPriceDe(product.price)}</p>
                  <p className="hidden truncate text-xs font-medium text-gray-500 sm:block">{product.name.de}</p>
                </div>
              </div>
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={() => addItem(product, 1)}
                className="flex h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-[#0C211E] px-4 text-sm font-bold text-white shadow-md sm:px-8"
              >
                <ShoppingCart className="h-4 w-4" />
                <span className="hidden sm:inline">Warenkorb</span>
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <nav
        aria-label="Breadcrumb"
        className="sticky top-16 z-30 border-b border-gray-200/80 bg-white/90 backdrop-blur-md sm:top-[72px] lg:top-[88px]"
      >
        <div className={SHELL}>
          <div className="flex items-center gap-2 py-3 text-xs font-medium tracking-wide sm:py-3.5 sm:text-sm">
            <Link
              href="/produkte"
              className="inline-flex items-center gap-1.5 rounded-full border border-gray-100 bg-gray-50 px-3 py-1.5 text-gray-600 transition-colors hover:text-[#0C211E] lg:hidden"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Zurück
            </Link>
            <div className="hidden min-w-0 flex-1 items-center gap-2 lg:flex">
              <Link href="/" className="shrink-0 text-gray-400 transition-colors hover:text-[#4ECCA3]">
                Startseite
              </Link>
              <ChevronRight className="h-3.5 w-3.5 shrink-0 text-gray-300" />
              <Link href="/produkte" className="shrink-0 text-gray-400 transition-colors hover:text-[#4ECCA3]">
                Produkte
              </Link>
              {category && (
                <>
                  <ChevronRight className="h-3.5 w-3.5 shrink-0 text-gray-300" />
                  <Link
                    href={`/produkte?kategorie=${category.id}`}
                    className="shrink-0 text-gray-400 transition-colors hover:text-[#4ECCA3]"
                  >
                    {category.name.de}
                  </Link>
                </>
              )}
              <ChevronRight className="h-3.5 w-3.5 shrink-0 text-gray-300" />
              <span className="min-w-0 truncate font-bold text-[#0C211E]">{product.name.de}</span>
            </div>
          </div>
        </div>
      </nav>

      <div className={SHELL}>
        {/* ——— Hero: galerie | colonne achat (50/50 dès lg) ——— */}
        <section className="grid grid-cols-1 gap-6 pt-4 sm:gap-8 lg:grid-cols-[55%_1fr] lg:gap-8 lg:pt-6 xl:gap-10 2xl:gap-12">
          {/* Galerie */}
          <div className="flex min-w-0 flex-col gap-4 sm:flex-row-reverse sm:gap-5 lg:gap-6">
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative aspect-square w-full min-h-0 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm sm:aspect-auto sm:h-[min(56vh,480px)] sm:min-h-[360px] lg:h-[min(72vh,680px)] lg:min-h-[460px] xl:rounded-3xl cursor-zoom-in group"
              onClick={() => setLightboxOpen(true)}
              onMouseMove={(e) => {
                const { left, top, width, height } = e.currentTarget.getBoundingClientRect()
                e.currentTarget.style.setProperty('--x', `${((e.clientX - left) / width) * 100}%`)
                e.currentTarget.style.setProperty('--y', `${((e.clientY - top) / height) * 100}%`)
              }}
            >
              <Image
                src={product.images[selectedImage]}
                alt={product.name.de}
                fill
                priority
                className="object-contain p-4 sm:p-6 lg:p-8 mix-blend-multiply transition-transform duration-200 ease-out group-hover:scale-[2.2] origin-[var(--x,50%)_var(--y,50%)]"
                sizes="(max-width: 1023px) 100vw, 50vw"
              />
              <div className="pointer-events-none absolute bottom-4 right-4 hidden rounded-xl border border-gray-100 bg-white/90 p-2.5 shadow-md opacity-0 transition-opacity group-hover:opacity-100 sm:block">
                <ZoomIn className="h-5 w-5 text-gray-700" />
              </div>
              <div className="absolute left-4 top-4 flex flex-col gap-2">
                {product.badges?.includes('premium') && (
                  <span className="rounded-lg bg-[#0C211E] px-3 py-1 text-xs font-bold text-white shadow">Premium</span>
                )}
                {product.badges?.includes('bestseller') && (
                  <span className="rounded-lg bg-[#4ECCA3] px-3 py-1 text-xs font-bold text-[#0C211E] shadow">Bestseller</span>
                )}
                {product.badges?.includes('new') && (
                  <span className="rounded-lg bg-amber-400 px-3 py-1 text-xs font-bold text-amber-950 shadow">Neu</span>
                )}
                {product.oldPrice && (
                  <span className="rounded-lg bg-red-500 px-3 py-1 text-xs font-bold text-white shadow">
                    -{Math.round((1 - product.price / product.oldPrice) * 100)}%
                  </span>
                )}
              </div>
            </motion.div>

            {product.images.length > 1 && (
              <div className="flex gap-2.5 overflow-x-auto pb-1 scrollbar-hide sm:w-20 sm:flex-col sm:overflow-y-auto sm:overflow-x-visible sm:pb-0 md:w-24 lg:w-[5.5rem]">
                {product.images.map((img, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setSelectedImage(index)}
                    className={`relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border-2 bg-white transition-colors sm:h-20 sm:w-full md:h-[4.5rem] ${
                      selectedImage === index ? 'border-[#4ECCA3] ring-2 ring-[#4ECCA3]/20' : 'border-gray-100 hover:border-gray-300'
                    }`}
                  >
                    <Image src={img} alt={`${product.name.de} ${index + 1}`} fill className="object-contain p-2 mix-blend-multiply" sizes="80px" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Colonne achat — une seule colonne fluide, pas de sous-grille étroite */}
          <div ref={infoRef} className="relative flex min-w-0 flex-col gap-4 lg:sticky lg:top-28 lg:self-start xl:top-32">
            <header className="space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-3">
                {category && (
                  <Link
                    href={`/produkte?kategorie=${category.id}`}
                    className="text-xs font-bold uppercase tracking-wider text-[#4ECCA3] transition-colors hover:text-[#0C211E] sm:text-sm"
                  >
                    {category.name.de}
                  </Link>
                )}
                <div className="flex items-center gap-1.5 rounded-lg border border-gray-100 bg-white px-2.5 py-1 text-sm shadow-sm">
                  <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                  <span className="font-bold text-gray-900">{product.rating}</span>
                  <span className="text-xs text-gray-400">({product.reviewCount})</span>
                </div>
              </div>
              <h1 className="font-heading text-2xl font-bold leading-tight tracking-tight text-[#0C211E] sm:text-3xl lg:text-[1.85rem] xl:text-4xl 2xl:text-[2.5rem]">
                {product.name.de}
              </h1>
              <p className="text-base leading-relaxed text-gray-600 lg:text-lg">{product.shortDescription.de}</p>
            </header>

            {/* Carte prix & CTA */}
            <div className="relative rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6 xl:rounded-3xl">
              <AnimatePresence>
                {showWishlistToast && (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="absolute right-4 top-4 z-10 flex items-center gap-2 rounded-xl bg-[#0C211E] px-3 py-2 text-xs font-bold text-white shadow-lg sm:text-sm"
                  >
                    <Check className="h-4 w-4 text-[#4ECCA3]" />
                    {wishlistToastMessage}
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="mb-4 flex flex-wrap items-baseline gap-x-3 gap-y-1 border-b border-gray-100 pb-4">
                <span className="text-2xl font-black tabular-nums tracking-tight text-[#0C211E] sm:text-3xl whitespace-nowrap">
                  {formatPriceDe(product.price)}
                </span>
                {product.oldPrice && (
                  <span className="text-base font-semibold text-gray-400 line-through tabular-nums whitespace-nowrap sm:text-lg">
                    {formatPriceDe(product.oldPrice)}
                  </span>
                )}
              </div>
              <p className="mb-1 text-xs text-gray-500">
                {priceIncludesVat ? (
                  <>
                    inkl. {vatPct}% MwSt. zzgl.{' '}
                    <Link href="/lieferung" className="underline decoration-dotted hover:text-gray-700">
                      Versand
                    </Link>
                  </>
                ) : (
                  <>
                    Netto zzgl. {vatPct}% MwSt. und{' '}
                    <Link href="/lieferung" className="underline decoration-dotted hover:text-gray-700">
                      Versand
                    </Link>
                  </>
                )}
              </p>
              {priceIncludesVat && vatPct > 0 && (
                <p className="mb-4 text-[11px] text-gray-500">Nettoanteil: {formatDeEuro(netFromGross(product.price, vatPct))}</p>
              )}
              {!priceIncludesVat && vatPct > 0 && (
                <p className="mb-4 text-[11px] text-gray-500">Brutto: {formatDeEuro(grossFromNet(product.price, vatPct))}</p>
              )}

              <div
                className={`mb-5 inline-flex items-center gap-2 rounded-xl border px-3 py-2.5 text-sm font-bold ${
                  product.stock > 0
                    ? 'border-green-200 bg-green-50/80 text-green-800'
                    : 'border-red-200 bg-red-50 text-red-800'
                }`}
              >
                {product.stock > 0 ? (
                  <>
                    <span className="h-2 w-2 animate-pulse rounded-full bg-green-500" />
                    Sofort lieferbar ({product.stock} auf Lager)
                  </>
                ) : (
                  <>
                    <span className="h-2 w-2 rounded-full bg-red-500" />
                    Nicht vorrätig
                  </>
                )}
              </div>

              {product.deliveryNote && (
                <div className="mb-5 flex gap-2 text-sm text-gray-600">
                  <Info className="mt-0.5 h-4 w-4 shrink-0 text-[#4ECCA3]" />
                  <span>{product.deliveryNote}</span>
                </div>
              )}

              <div className="flex flex-col gap-3 sm:flex-row sm:items-stretch">
                <div className="flex h-14 shrink-0 items-center overflow-hidden rounded-2xl border border-gray-200 bg-gray-50/80 sm:w-36">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                    className="flex h-full w-11 items-center justify-center text-gray-500 hover:bg-white disabled:opacity-40"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="flex-1 text-center font-bold text-[#0C211E]">{quantity}</span>
                  <button
                    type="button"
                    onClick={() => setQuantity(quantity + 1)}
                    disabled={quantity >= product.stock}
                    className="flex h-full w-11 items-center justify-center text-gray-500 hover:bg-white disabled:opacity-40"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => addItem(product, quantity)}
                  disabled={product.stock <= 0}
                  className="flex h-14 flex-1 items-center justify-center gap-2 rounded-2xl bg-[#0C211E] font-bold text-white shadow-lg shadow-[#0C211E]/15 transition-colors hover:bg-[#17423C] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <ShoppingCart className="h-5 w-5" />
                  In den Warenkorb
                </motion.button>
                <button
                  type="button"
                  onClick={handleWishlistToggle}
                  className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border shadow-sm transition-colors ${
                    isWishlisted ? 'border-red-100 bg-red-50' : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                  aria-label="Wunschliste"
                >
                  <Heart className={`h-5 w-5 ${isWishlisted ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} />
                </button>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3">
                <button
                  type="button"
                  className="flex h-11 items-center justify-center gap-1.5 rounded-xl bg-black text-sm font-bold text-white"
                >
                  <span className="text-lg leading-none"></span> Pay
                </button>
                <button
                  type="button"
                  className="flex h-11 items-center justify-center rounded-xl bg-[#FFC439] text-sm font-bold italic text-[#003087]"
                >
                  PayPal
                </button>
              </div>

              {relatedProducts.length > 0 && (
                <div className="mt-6 rounded-2xl border-2 border-[#4ECCA3]/25 bg-gradient-to-br from-[#4ECCA3]/12 to-transparent p-4 sm:p-5">
                  <div className="mb-3 flex items-center gap-2 text-sm font-bold text-[#0C211E]">
                    <Sparkles className="h-4 w-4 text-[#4ECCA3]" />
                    Häufig zusammen gekauft
                  </div>
                  <div className="flex gap-3">
                    <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-gray-100 bg-white">
                      <Image
                        src={relatedProducts[0].images[0]}
                        alt={relatedProducts[0].name.de}
                        fill
                        className="object-contain p-1.5 mix-blend-multiply"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="line-clamp-2 text-xs font-bold text-gray-800">{relatedProducts[0].name.de}</p>
                      <p className="mt-1 text-sm font-black tabular-nums text-[#0C211E]">
                        <span className="text-[#4ECCA3]">+</span>{' '}
                        <span className="whitespace-nowrap">{formatPriceDe(relatedProducts[0].price)}</span>
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      addItem(product, quantity)
                      addItem(relatedProducts[0], 1)
                    }}
                    className="mt-4 w-full rounded-xl border-2 border-[#0C211E] py-3 text-sm font-bold text-[#0C211E] transition-colors hover:bg-[#0C211E] hover:text-[#4ECCA3]"
                  >
                    Beides in den Warenkorb
                  </button>
                </div>
              )}
            </div>

            {/* Bandeau service — pleine largeur de la colonne */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              {serviceItems.map((item) => (
                <div
                  key={item.title}
                  className="flex gap-3 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#4ECCA3]/12">
                    <item.icon className="h-5 w-5 text-[#4ECCA3]" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[#0C211E]">{item.title}</p>
                    <p className="text-xs text-gray-500">{item.sub}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Confiance + partage */}
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3">
              {[
                { icon: Shield, label: 'TÜV' },
                { icon: Lock, label: 'SSL' },
                { icon: RotateCcw, label: '30 Tage' },
                { icon: Truck, label: 'DHL' },
              ].map((b) => (
                <div
                  key={b.label}
                  className="flex items-center gap-2 rounded-xl border border-gray-100 bg-gray-50/80 px-2.5 py-2 text-[10px] font-bold text-gray-700 sm:text-xs"
                >
                  <b.icon className="h-3.5 w-3.5 shrink-0 text-[#4ECCA3] sm:h-4 sm:w-4" />
                  {b.label}
                </div>
              ))}
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <button
                type="button"
                onClick={shareProduct}
                className="inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-2xl border-2 border-gray-200 bg-white font-bold text-[#0C211E] transition-colors hover:border-[#4ECCA3] hover:bg-[#4ECCA3]/5"
              >
                <Share2 className="h-4 w-4" />
                Produkt teilen
              </button>
              <Link
                href="/lieferung"
                className="inline-flex h-12 flex-1 items-center justify-center text-center text-sm font-bold text-[#4ECCA3] underline-offset-2 hover:text-[#0C211E] hover:underline"
              >
                Versand & Rückgabe
              </Link>
            </div>
          </div>
        </section>

        {/* Desktop: onglets pleine largeur */}
        <section className="mt-8 hidden w-full lg:mt-12 lg:block xl:mt-14">
          <div className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm">
            <div className="flex flex-wrap justify-center gap-4 border-b border-gray-100 px-4 py-2 sm:gap-8 xl:gap-12">
              {(
                [
                  { id: 'description' as const, label: 'Beschreibung' },
                  { id: 'specs' as const, label: 'Technische Daten' },
                  { id: 'reviews' as const, label: `Bewertungen (${product.reviewCount})` },
                ]
              ).map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative py-4 text-sm font-bold transition-colors sm:text-base ${
                    activeTab === tab.id ? 'text-[#0C211E]' : 'text-gray-400 hover:text-gray-600'
                  }`}
                >
                  {tab.label}
                  {activeTab === tab.id && (
                    <motion.span layoutId="pd-tab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#4ECCA3]" />
                  )}
                </button>
              ))}
            </div>
            <div className="p-6 sm:p-8 lg:p-10 xl:p-12">
              <AnimatePresence mode="wait">
                {activeTab === 'description' && (
                  <motion.div
                    key="d"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="w-full"
                  >
                    <h2 className="mb-6 font-heading text-xl font-bold text-[#0C211E] sm:text-2xl xl:text-3xl">Produktdetails</h2>
                    <p className="mb-10 max-w-4xl text-base leading-relaxed text-gray-600 xl:text-lg">{product.description.de}</p>
                    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                      {[
                        { icon: Zap, title: 'SmartHeat™', desc: 'Präzise Temperaturkontrolle' },
                        { icon: Leaf, title: 'EcoPower™', desc: 'Energieeffizientes Kochen' },
                        { icon: Shield, title: 'SafetyGuard™', desc: 'Maximale Sicherheit' },
                        { icon: Award, title: 'Premium Qualität', desc: 'Langlebigkeit garantiert' },
                      ].map((f) => (
                        <div key={f.title} className="flex gap-3 rounded-2xl border border-gray-100 bg-gray-50/50 p-4">
                          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#0C211E]">
                            <f.icon className="h-5 w-5 text-[#4ECCA3]" />
                          </div>
                          <div>
                            <h3 className="font-bold text-[#0C211E]">{f.title}</h3>
                            <p className="text-sm text-gray-500">{f.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
                {activeTab === 'specs' && (
                  <motion.div key="s" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:gap-4">
                      {[
                        ...supplierCards,
                        { icon: Layers, label: 'Material', value: product.specs.material },
                        { icon: Maximize, label: 'Abmessungen', value: product.specs.dimensions },
                        { icon: Scale, label: 'Gewicht', value: product.specs.weight },
                        {
                          icon: Droplets,
                          label: 'Spülmaschine',
                          value: product.specs.dishwasher ? 'Geeignet' : 'Handwäsche',
                        },
                        {
                          icon: Zap,
                          label: 'Induktion',
                          value: product.specs.induction ? 'Ja' : 'Nein',
                        },
                        { icon: ShieldCheck, label: 'Garantie', value: '2 Jahre' },
                      ].map((spec, index) => (
                        <div
                          key={`${spec.label}-${index}`}
                          className="flex flex-col items-center rounded-2xl border border-gray-100 bg-white p-5 text-center shadow-sm transition-shadow hover:shadow-md"
                        >
                          <spec.icon className="mb-3 h-8 w-8 text-[#4ECCA3]" />
                          <span className="mb-1 text-[10px] font-bold uppercase tracking-wider text-gray-400">{spec.label}</span>
                          <span className="text-sm font-bold text-[#0C211E]">{spec.value}</span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
                {activeTab === 'reviews' && (
                  <motion.div key="r" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="w-full">
                    <ProductReviews
                      productId={product.id}
                      averageRating={product.rating}
                      totalReviews={product.reviewCount}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </section>

        {/* Mobile: accordéons */}
        <section className="mt-8 space-y-3 lg:hidden">
          {[
            {
              id: 'description',
              label: 'Beschreibung',
              content: (
                <div className="space-y-4 text-sm leading-relaxed text-gray-600">
                  <p>{product.description.de}</p>
                  <div className="grid gap-2">
                    {[
                      { icon: Zap, t: 'SmartHeat', d: 'Gleichmäßige Hitze.' },
                      { icon: Leaf, t: 'Eco', d: 'Ressourcenschonend.' },
                    ].map((x) => (
                      <div key={x.t} className="flex gap-3 rounded-xl border border-gray-100 bg-gray-50 p-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#0C211E]">
                          <x.icon className="h-4 w-4 text-[#4ECCA3]" />
                        </div>
                        <div>
                          <p className="font-bold text-[#0C211E]">{x.t}</p>
                          <p className="text-xs text-gray-500">{x.d}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ),
            },
            {
              id: 'specs',
              label: 'Technische Daten',
              content: (
                <div className="grid grid-cols-2 gap-2">
                  {[
                    ...supplierCards,
                    { icon: Layers, label: 'Material', value: product.specs.material },
                    { icon: Scale, label: 'Gewicht', value: product.specs.weight },
                    { icon: Droplets, label: 'Spülmaschine', value: product.specs.dishwasher ? 'Ja' : 'Nein' },
                    { icon: Maximize, label: 'Größe', value: product.specs.dimensions },
                  ].map((spec, index) => (
                    <div key={`${spec.label}-m-${index}`} className="rounded-xl border border-gray-100 bg-gray-50 p-3 text-center">
                      <spec.icon className="mx-auto mb-1 h-5 w-5 text-[#4ECCA3]" />
                      <p className="text-[9px] font-bold uppercase text-gray-400">{spec.label}</p>
                      <p className="text-xs font-bold text-[#0C211E]">{spec.value}</p>
                    </div>
                  ))}
                </div>
              ),
            },
            {
              id: 'reviews',
              label: `Bewertungen (${product.reviewCount})`,
              content: (
                <ProductReviews productId={product.id} averageRating={product.rating} totalReviews={product.reviewCount} />
              ),
            },
          ].map((section) => (
            <div key={section.id} className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
              <button
                type="button"
                onClick={() => setExpandedAccordion(expandedAccordion === section.id ? null : section.id)}
                className="flex w-full items-center justify-between p-4 text-left sm:p-5"
              >
                <span className="font-bold text-[#0C211E]">{section.label}</span>
                <ChevronDown
                  className={`h-5 w-5 text-gray-400 transition-transform ${expandedAccordion === section.id ? 'rotate-180' : ''}`}
                />
              </button>
              <AnimatePresence>
                {expandedAccordion === section.id && (
                  <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden border-t border-gray-50">
                    <div className="p-4 pt-0 sm:p-5 sm:pt-0">{section.content}</div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </section>

        {/* Produits associés */}
        {relatedProducts.length > 0 && (
          <section className="mt-12 border-t border-gray-200 pt-10 lg:mt-16 lg:pt-14">
            <h2 className="mb-6 font-heading text-xl font-bold text-[#0C211E] sm:text-2xl xl:text-3xl">Passend dazu</h2>
            <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4 lg:gap-6">
              {relatedProducts.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Link href={`/produkt/${item.slug}`} className="group block h-full">
                    <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-shadow hover:shadow-lg">
                      <div className="relative aspect-square bg-gray-50 p-4">
                        <Image
                          src={item.images[0]}
                          alt={item.name.de}
                          fill
                          className="object-contain p-3 mix-blend-multiply transition-transform group-hover:scale-105"
                          sizes="(max-width: 640px) 45vw, 22vw"
                        />
                      </div>
                      <div className="flex flex-1 flex-col border-t border-gray-50 p-3 sm:p-4">
                        <h3 className="mb-2 line-clamp-2 text-xs font-bold text-gray-900 group-hover:text-[#4ECCA3] sm:text-sm">{item.name.de}</h3>
                        <div className="mt-auto flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                          <span className="text-sm font-black tabular-nums text-[#0C211E] sm:text-base whitespace-nowrap">
                            {formatPriceDe(item.price)}
                          </span>
                          {item.oldPrice && (
                            <span className="text-xs text-gray-400 line-through tabular-nums whitespace-nowrap">
                              {formatPriceDe(item.oldPrice)}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </section>
        )}

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
