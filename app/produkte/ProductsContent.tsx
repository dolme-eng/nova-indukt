'use client'

import { useState, useMemo, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import {
  Search,
  Star,
  Heart,
  Grid3X3,
  LayoutList,
  ShoppingCart,
  Check,
  SlidersHorizontal,
  X,
  ChevronDown,
  Filter,
  ChevronRight as ChevronRightIcon,
  Loader2,
  ChevronLeft,
} from 'lucide-react'
import { Product, Category } from '@/lib/data/products'
import { formatPriceDe } from '@/lib/utils/vat'
import { useCart } from '@/lib/store/cart'
import { useWishlist } from '@/lib/store/wishlist'
import { TiltCard } from '@/components/animations'

const PRICE_FILTER_MAX = 2500

export interface ProductsContentProps {
  initialProducts: Product[]
  initialCategories: Category[]
  activeCategory?: string
  initialSearch?: string
  initialPriceRange?: [number, number]
  initialSort?: string
  currentPage?: number
  totalPages?: number
  totalProducts?: number
}

export function ProductsContent({
  initialProducts,
  initialCategories,
  activeCategory,
  initialSearch = '',
  initialPriceRange = [0, 2500],
  initialSort = 'newest',
  currentPage = 1,
  totalPages = 1,
  totalProducts = 0,
}: ProductsContentProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const { addItem } = useCart()
  const { isInWishlist, toggleItem } = useWishlist()

  const [searchQuery, setSearchQuery] = useState(initialSearch)
  const debouncedSearchQuery = useDebouncedValue(searchQuery, 300)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(activeCategory || null)
  const [priceRange, setPriceRange] = useState<[number, number]>(initialPriceRange)
  const [sortBy, setSortBy] = useState(initialSort)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [showFilters, setShowFilters] = useState(false)
  const [isSyncing, setIsSyncing] = useState(false)

  // Sync filters with URL (reset to page 1)
  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString())

    if (selectedCategory) params.set('kategorie', selectedCategory)
    else params.delete('kategorie')

    if (debouncedSearchQuery) params.set('suche', debouncedSearchQuery)
    else params.delete('suche')

    if (priceRange[0] > 0) params.set('minPrice', priceRange[0].toString())
    else params.delete('minPrice')

    if (priceRange[1] < PRICE_FILTER_MAX) params.set('maxPrice', priceRange[1].toString())
    else params.delete('maxPrice')

    if (sortBy !== 'newest') params.set('sort', sortBy)
    else params.delete('sort')

    // Réinitialiser à la page 1 quand les filtres changent
    params.delete('page')

    const newQuery = params.toString()
    const currentQuery = searchParams.toString()

    if (newQuery !== currentQuery) {
      setIsSyncing(true)
      router.push(`${pathname}${newQuery ? `?${newQuery}` : ''}`, { scroll: false })
    }
  }, [selectedCategory, debouncedSearchQuery, priceRange, sortBy, pathname, router, searchParams])

  useEffect(() => {
    setIsSyncing(false)
    setIsLoading(false)
  }, [initialProducts])

  const filteredProducts = initialProducts

  const [isLoading, setIsLoading] = useState(false)

  const goToPage = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString())
    if (newPage > 1) params.set('page', newPage.toString())
    else params.delete('page')
    setIsLoading(true)
    router.push(`${pathname}?${params.toString()}`, { scroll: false })
  }

  // Générer les numéros de page à afficher
  const visiblePages = useMemo(() => {
    const pages: (number | '...')[] = []
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i)
    } else {
      pages.push(1)
      if (currentPage > 3) pages.push('...')
      for (
        let i = Math.max(2, currentPage - 1);
        i <= Math.min(totalPages - 1, currentPage + 1);
        i++
      ) {
        pages.push(i)
      }
      if (currentPage < totalPages - 2) pages.push('...')
      pages.push(totalPages)
    }
    return pages
  }, [currentPage, totalPages])

  // Loading court pour le changement de vue (grid/list) - sans skeleton complet
  useEffect(() => {
    setIsLoading(true)
    const t = setTimeout(() => setIsLoading(false), 200)
    return () => clearTimeout(t)
  }, [viewMode])

  // Empêcher le scroll du body quand le menu des filtres (budget/catégories) est ouvert sur mobile
  useEffect(() => {
    if (showFilters) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [showFilters])

  const handleToggleWishlist = async (e: React.MouseEvent, product: Product) => {
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

  const handleAddToCart = (e: React.MouseEvent, product: Product) => {
    e.preventDefault()
    e.stopPropagation()
    addItem(product, 1)
  }

  const clearFilters = () => {
    setSearchQuery('')
    setSelectedCategory(null)
    setPriceRange([0, PRICE_FILTER_MAX])
    setSortBy('newest')
  }
  const activeFiltersCount = useMemo(
    () =>
      (searchQuery ? 1 : 0) +
      (selectedCategory ? 1 : 0) +
      (priceRange[0] > 0 || priceRange[1] < PRICE_FILTER_MAX ? 1 : 0),
    [searchQuery, selectedCategory, priceRange]
  )

  const gridVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
      },
    },
  }

  return (
    <div
      data-testid="category-page"
      className="min-h-screen bg-gray-50/50 pb-10 selection:bg-[#4ECCA3]/30 sm:pb-16"
    >
      {/* Breadcrumbs */}
      <nav className="sticky top-[60px] z-[40] border-b border-gray-100 bg-white/80 backdrop-blur-md lg:top-[76px]">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex items-center gap-2 py-2 text-[10px] font-medium tracking-wide sm:text-xs">
            <Link href="/" className="text-gray-400 transition-colors hover:text-[#4ECCA3]">
              Startseite
            </Link>
            <ChevronRightIcon className="h-3.5 w-3.5 text-gray-300" />
            <Link
              href="/produkte"
              className={`transition-colors ${!selectedCategory ? 'font-bold text-[#0C211E]' : 'text-gray-400 hover:text-[#4ECCA3]'}`}
            >
              Produkte
            </Link>
            {selectedCategory && (
              <>
                <ChevronRightIcon className="h-3.5 w-3.5 text-gray-300" />
                <span className="max-w-[200px] truncate font-bold text-[#0C211E]">
                  {initialCategories.find((c) => c.slug === selectedCategory)?.name.de}
                </span>
              </>
            )}
          </div>
        </div>
      </nav>

      <div className="container mx-auto mt-4 px-4 sm:mt-6 sm:px-6">
        <div className="mx-auto max-w-7xl">
          {/* Page Header */}
          <div className="mb-3 sm:mb-4">
            <h1 className="mb-0.5 font-heading text-lg font-black uppercase tracking-tight text-gray-900 sm:text-xl">
              Produkte
            </h1>
            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-gray-400 sm:text-xs">
              <span>
                {totalProducts} {totalProducts === 1 ? 'Produkt' : 'Produkte'}
              </span>
              <span className="h-1 w-1 rounded-full bg-gray-200"></span>
              <span>Versandfrei ab 500 €</span>
            </div>
          </div>

          <div className="flex flex-col gap-5 lg:flex-row lg:gap-8 xl:gap-10 2xl:gap-12">
            {/* Mobile Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex w-full items-center justify-center gap-2 rounded-2xl border border-gray-100 bg-white py-4 font-bold text-gray-900 shadow-sm transition-all active:scale-[0.98] lg:hidden"
            >
              <Filter className="h-5 w-5" /> Filter & Sortierung
              {activeFiltersCount > 0 && (
                <span className="ml-2 flex h-6 w-6 items-center justify-center rounded-full bg-[#4ECCA3] text-xs font-black text-gray-900">
                  {activeFiltersCount}
                </span>
              )}
            </button>

            {/* Sidebar Filters - Desktop */}
            <aside className="hidden w-60 flex-shrink-0 lg:block xl:w-64">
              <div className="sticky top-[130px] space-y-5 rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
                {/* Categories Filter */}
                <div>
                  <h3 className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-900">
                    <SlidersHorizontal className="h-4 w-4 text-[#4ECCA3]" /> Kategorien
                  </h3>
                  <div className="space-y-1.5">
                    <button
                      data-testid="category-filter-alle"
                      onClick={() => setSelectedCategory(null)}
                      className={`flex w-full items-center justify-between rounded-xl px-4 py-2.5 text-left text-sm font-semibold transition-all duration-300 ${!selectedCategory ? 'bg-[#0C211E] text-white shadow-md shadow-[#0C211E]/10' : 'border border-transparent text-gray-600 hover:border-gray-200 hover:bg-gray-50'}`}
                    >
                      Alle {!selectedCategory && <Check className="h-4 w-4 text-[#4ECCA3]" />}
                    </button>
                    {initialCategories.map((cat) => (
                      <button
                        data-testid="category-filter-item"
                        key={cat.id}
                        onClick={() => setSelectedCategory(cat.slug)}
                        className={`flex w-full items-center justify-between rounded-xl px-4 py-2.5 text-left text-sm font-semibold transition-all duration-300 ${selectedCategory === cat.slug ? 'bg-[#0C211E] text-white shadow-md shadow-[#0C211E]/10' : 'border border-transparent text-gray-600 hover:border-gray-200 hover:bg-gray-50'}`}
                      >
                        <span className="flex items-center gap-2">{cat.name.de}</span>
                        {selectedCategory === cat.slug && (
                          <Check className="h-4 w-4 text-[#4ECCA3]" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price Filter */}
                <div className="border-t border-gray-100 pt-5">
                  <h3 className="mb-4 text-xs font-bold uppercase tracking-wider text-gray-900">
                    Preisbereich
                  </h3>
                  <div className="px-2">
                    <div className="relative mb-6 h-2 rounded-full bg-gray-100">
                      <div
                        className="absolute bottom-0 left-0 top-0 rounded-full bg-[#4ECCA3]"
                        style={{ width: `${(priceRange[1] / PRICE_FILTER_MAX) * 100}%` }}
                      />
                      <input
                        type="range"
                        min="0"
                        max={PRICE_FILTER_MAX}
                        step="50"
                        value={priceRange[1]}
                        onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                        className="absolute inset-0 w-full cursor-pointer opacity-0"
                      />
                      <div
                        className="pointer-events-none absolute top-1/2 h-5 w-5 -translate-y-1/2 rounded-full border-2 border-[#4ECCA3] bg-white shadow-md transition-all"
                        style={{
                          left: `calc(${(priceRange[1] / PRICE_FILTER_MAX) * 100}% - 10px)`,
                        }}
                      />
                    </div>
                    <div className="flex items-center gap-1.5">
                      <input
                        data-testid="price-filter-min"
                        type="number"
                        min="0"
                        max={PRICE_FILTER_MAX}
                        value={priceRange[0]}
                        onChange={(e) =>
                          setPriceRange([parseInt(e.target.value) || 0, priceRange[1]])
                        }
                        className="w-16 rounded-lg border border-gray-200 bg-gray-50 px-1 py-1.5 text-center text-xs font-bold text-gray-700"
                      />
                      <span className="text-xs text-gray-400">-</span>
                      <input
                        data-testid="price-filter-max"
                        type="number"
                        min="0"
                        max={PRICE_FILTER_MAX}
                        value={priceRange[1]}
                        onChange={(e) =>
                          setPriceRange([
                            priceRange[0],
                            parseInt(e.target.value) || PRICE_FILTER_MAX,
                          ])
                        }
                        className="w-16 rounded-lg border border-gray-200 bg-gray-50 px-1 py-1.5 text-center text-xs font-bold text-gray-700"
                      />
                      <span className="text-xs text-gray-400">€</span>
                      <button
                        data-testid="apply-filters"
                        onClick={() => setShowFilters(false)}
                        className="ml-auto shrink-0 rounded-lg bg-[#0C211E] px-2.5 py-1.5 text-xs font-bold text-white transition-colors hover:bg-[#17423C]"
                      >
                        OK
                      </button>
                    </div>
                  </div>
                </div>

                {activeFiltersCount > 0 && (
                  <div className="pt-6">
                    <button
                      onClick={clearFilters}
                      className="flex w-full items-center justify-center gap-2 rounded-2xl border border-red-100 py-4 font-bold text-red-600 transition-colors hover:bg-red-50 hover:text-red-700"
                    >
                      <X className="h-4 w-4" /> Filter zurücksetzen
                    </button>
                  </div>
                )}
              </div>
            </aside>

            {/* Mobile Bottom Sheet Filters */}
            <AnimatePresence>
              {showFilters && (
                <>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setShowFilters(false)}
                    className="fixed inset-0 z-[100] cursor-pointer bg-black/40 backdrop-blur-sm lg:hidden"
                  />
                  <motion.aside
                    initial={{ y: '100%' }}
                    animate={{ y: 0 }}
                    exit={{ y: '100%' }}
                    transition={{ type: 'spring', damping: 28, stiffness: 200 }}
                    className="fixed bottom-0 left-0 right-0 z-[110] flex max-h-[90vh] flex-col rounded-t-3xl bg-white shadow-2xl lg:hidden"
                  >
                    <div className="flex items-center justify-between rounded-t-2xl border-b border-gray-100 bg-gray-50/50 p-4">
                      <h2 className="flex items-center gap-2 font-heading text-lg font-black uppercase tracking-tighter text-[#0C211E]">
                        <Filter className="h-4 w-4" /> Filter & Sortierung
                      </h2>
                      <button
                        onClick={() => setShowFilters(false)}
                        className="rounded-lg border border-gray-200 bg-gray-100 p-1.5 text-gray-400 transition-colors hover:bg-white"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="flex-1 space-y-6 overflow-y-auto p-4">
                      {/* Categories Filter */}
                      <div>
                        <h3 className="mb-3 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400">
                          <SlidersHorizontal className="h-3.5 w-3.5 text-nova-500" /> Kategorien
                        </h3>
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            onClick={() => setSelectedCategory(null)}
                            className={`flex items-center justify-between rounded-xl px-3 py-2.5 text-left text-xs font-bold transition-all duration-300 ${!selectedCategory ? 'bg-[#0C211E] text-white shadow-sm' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'}`}
                          >
                            Alle {!selectedCategory && <Check className="h-3 w-3 text-nova-400" />}
                          </button>
                          {initialCategories.map((cat) => (
                            <button
                              key={cat.id}
                              onClick={() => setSelectedCategory(cat.slug)}
                              className={`flex items-center justify-between rounded-xl px-3 py-2.5 text-left text-xs font-bold transition-all duration-300 ${selectedCategory === cat.slug ? 'bg-[#0C211E] text-white shadow-sm' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'}`}
                            >
                              <span className="truncate">{cat.name.de}</span>
                              {selectedCategory === cat.slug && (
                                <Check className="h-3 w-3 text-nova-400" />
                              )}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Price Filter */}
                      <div className="pt-2">
                        <h3 className="mb-6 text-xs font-bold uppercase tracking-wider text-gray-900">
                          Preisbereich
                        </h3>
                        <div className="px-2">
                          <div className="relative mb-6 h-2 rounded-full bg-gray-100">
                            <div
                              className="absolute bottom-0 left-0 top-0 rounded-full bg-[#4ECCA3]"
                              style={{ width: `${(priceRange[1] / PRICE_FILTER_MAX) * 100}%` }}
                            />
                            <input
                              type="range"
                              min="0"
                              max={PRICE_FILTER_MAX}
                              step="50"
                              value={priceRange[1]}
                              onChange={(e) =>
                                setPriceRange([priceRange[0], parseInt(e.target.value)])
                              }
                              className="absolute inset-0 w-full cursor-pointer opacity-0"
                            />
                            <div
                              className="pointer-events-none absolute top-1/2 h-6 w-6 -translate-y-1/2 rounded-full border-4 border-[#4ECCA3] bg-white shadow-lg transition-all"
                              style={{
                                left: `calc(${(priceRange[1] / PRICE_FILTER_MAX) * 100}% - 12px)`,
                              }}
                            />
                          </div>
                          <div className="flex items-center justify-between gap-2">
                            <input
                              data-testid="price-filter-min"
                              type="number"
                              min="0"
                              max={PRICE_FILTER_MAX}
                              value={priceRange[0]}
                              onChange={(e) =>
                                setPriceRange([parseInt(e.target.value) || 0, priceRange[1]])
                              }
                              className="w-20 rounded-xl border border-gray-200 bg-gray-50 px-2 py-2 text-center text-sm font-bold text-gray-700"
                            />
                            <span className="text-gray-400">-</span>
                            <input
                              data-testid="price-filter-max"
                              type="number"
                              min="0"
                              max={PRICE_FILTER_MAX}
                              value={priceRange[1]}
                              onChange={(e) =>
                                setPriceRange([
                                  priceRange[0],
                                  parseInt(e.target.value) || PRICE_FILTER_MAX,
                                ])
                              }
                              className="w-20 rounded-xl border border-gray-200 bg-gray-50 px-2 py-2 text-center text-sm font-bold text-gray-700"
                            />
                            <span className="text-gray-400">€</span>
                          </div>
                        </div>
                      </div>

                      {activeFiltersCount > 0 && (
                        <div className="pt-2">
                          <button
                            onClick={clearFilters}
                            className="flex w-full items-center justify-center gap-2 rounded-2xl border border-red-100 py-4 font-bold text-red-600 transition-colors hover:bg-red-50 hover:text-red-700"
                          >
                            <X className="h-4 w-4" /> Filter zurücksetzen
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Apply Button */}
                    <div className="pb-safe border-t border-gray-100 bg-white p-3">
                      <button
                        onClick={() => setShowFilters(false)}
                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#0C211E] py-3.5 text-xs font-black uppercase tracking-widest text-white shadow-xl shadow-gray-900/10 transition-transform active:scale-95"
                      >
                        Zeige {totalProducts} Produkte
                      </button>
                    </div>
                  </motion.aside>
                </>
              )}
            </AnimatePresence>

            {/* Main Content */}
            <div className="flex-1">
              {/* Top Bar for View & Sort */}
              <div className="sticky top-24 z-30 mb-5 rounded-xl border border-white bg-white/80 p-3 shadow-[0_4px_20px_rgb(0,0,0,0.03)] backdrop-blur-md">
                <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
                  <div className="relative w-full sm:max-w-md">
                    <Search className="absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Produkte suchen..."
                      className="w-full rounded-2xl border border-transparent bg-gray-50 py-3.5 pl-14 pr-12 font-medium text-gray-700 outline-none transition-all placeholder:text-gray-400 focus:border-[#4ECCA3] focus:bg-white focus:ring-4 focus:ring-[#4ECCA3]/10"
                    />
                    {(searchQuery || isSyncing) && (
                      <div className="absolute right-4 top-1/2 flex -translate-y-1/2 items-center">
                        {isSyncing ? (
                          <Loader2 className="h-4 w-4 animate-spin text-[#4ECCA3]" />
                        ) : (
                          <button
                            onClick={() => setSearchQuery('')}
                            className="rounded-full bg-gray-200 p-1.5 transition-colors hover:bg-gray-300"
                          >
                            <X className="h-3.5 w-3.5 text-gray-600" />
                          </button>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="flex w-full items-center gap-3 sm:w-auto">
                    <div className="relative flex-1 sm:flex-none">
                      <select
                        data-testid="sort-select"
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="w-full cursor-pointer appearance-none rounded-2xl border border-gray-100 bg-gray-50 py-3.5 pl-5 pr-10 text-sm font-bold text-gray-700 outline-none transition-all focus:border-[#4ECCA3] focus:bg-white focus:ring-4 focus:ring-[#4ECCA3]/10 sm:w-[200px]"
                      >
                        <option value="newest">Neueste</option>
                        <option value="price-asc">Preis: Aufsteigend</option>
                        <option value="price-desc">Preis: Absteigend</option>
                        <option value="name">Name</option>
                      </select>
                      <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    </div>

                    <div className="flex flex-shrink-0 rounded-xl border border-gray-100 bg-gray-50 p-1.5">
                      <button
                        data-testid="grid-view-button"
                        onClick={() => setViewMode('grid')}
                        className={`rounded-lg p-2 transition-all ${viewMode === 'grid' ? 'bg-white text-[#4ECCA3] shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                      >
                        <Grid3X3 className="h-5 w-5" />
                      </button>
                      <button
                        data-testid="list-view-button"
                        onClick={() => setViewMode('list')}
                        className={`rounded-lg p-2 transition-all ${viewMode === 'list' ? 'bg-white text-[#4ECCA3] shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                      >
                        <LayoutList className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Products Area */}
              {filteredProducts.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-[2.5rem] border border-gray-100 bg-white p-16 text-center shadow-sm"
                >
                  <div className="mx-auto mb-6 flex h-24 w-24 rotate-3 transform items-center justify-center rounded-[2rem] bg-gray-50">
                    <Search className="h-10 w-10 text-gray-400" />
                  </div>
                  <h3 className="mb-3 font-heading text-2xl font-bold text-gray-900">
                    Keine Ergebnisse gefunden
                  </h3>
                  <p className="mx-auto mb-8 max-w-md text-lg text-gray-500">
                    Versuche es mit anderen Filtern oder einem anderen Suchbegriff.
                  </p>
                  <button
                    onClick={clearFilters}
                    className="rounded-2xl bg-[#0C211E] px-8 py-4 font-bold text-white shadow-lg shadow-[#0C211E]/20 transition-colors hover:bg-[#17423C]"
                  >
                    Filter zurücksetzen
                  </button>
                </motion.div>
              ) : (
                <>
                  <motion.div
                    data-testid="product-grid"
                    variants={gridVariants}
                    initial="hidden"
                    animate="visible"
                    key={`${selectedCategory}-${sortBy}-${viewMode}`}
                    className={
                      viewMode === 'grid'
                        ? 'grid grid-cols-2 gap-2 sm:gap-4 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5'
                        : 'space-y-3'
                    }
                  >
                    <AnimatePresence mode="popLayout">
                      {isLoading
                        ? Array.from({ length: viewMode === 'grid' ? 6 : 4 }).map((_, i) => (
                            <motion.div
                              key={`skeleton-${i}`}
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              className={`flex rounded-xl border border-gray-100 bg-white shadow-sm ${viewMode === 'list' ? 'h-full flex-col gap-5 p-4 sm:flex-row sm:p-5' : 'h-[400px] flex-col p-4'}`}
                            >
                              <div
                                className={`animate-pulse rounded-2xl bg-gray-100 ${viewMode === 'list' ? 'h-48 w-full sm:h-full sm:w-64 md:w-80' : 'relative mb-6 aspect-[4/3] w-full'}`}
                              />
                              <div className="flex flex-1 flex-col bg-white">
                                <div className="mb-4 h-4 w-20 animate-pulse rounded bg-gray-100" />
                                <div className="mb-3 h-8 w-full animate-pulse rounded bg-gray-100" />
                                <div className="mb-6 h-8 w-2/3 animate-pulse rounded bg-gray-100" />
                                <div className="mt-auto border-t border-gray-50 pt-4">
                                  <div className="mb-6 h-8 w-28 animate-pulse rounded bg-gray-100" />
                                  <div
                                    className={`h-[52px] w-full animate-pulse rounded-xl bg-gray-100 ${viewMode === 'list' ? 'sm:ml-auto sm:w-64' : ''}`}
                                  />
                                </div>
                              </div>
                            </motion.div>
                          ))
                        : filteredProducts.map((product) =>
                            viewMode === 'grid' ? (
                              <motion.div
                                data-testid="product-card"
                                variants={cardVariants}
                                layout
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ duration: 0.3 }}
                                key={product.id}
                              >
                                <Link
                                  href={`/produkt/${product.slug}`}
                                  className="group block h-full"
                                >
                                  <TiltCard
                                    className="group/card relative flex h-full flex-col overflow-hidden rounded-xl border border-gray-100/50 bg-white shadow-[0_2px_8px_rgba(0,0,0,0.04)] transition-all duration-500 hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] sm:rounded-2xl"
                                    tiltAmount={3}
                                    glowColor="rgba(78, 204, 163, 0.1)"
                                  >
                                    {/* Image Section - Perfect Square */}
                                    <div className="relative aspect-square overflow-hidden bg-[#fdfdfd]">
                                      <Image
                                        src={product.images[0]}
                                        alt={product.name.de}
                                        fill
                                        className={`object-contain p-3 mix-blend-multiply transition-all duration-700 ease-out group-hover:scale-110 sm:p-5`}
                                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                      />

                                      {/* Glass Badges */}
                                      <div className="absolute left-1.5 top-1.5 z-10 flex flex-col gap-1 sm:left-2 sm:top-2">
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
                                        {product.oldPrice && (
                                          <span className="rounded-md border border-white/10 bg-red-500/90 px-1.5 py-0.5 text-[8px] font-black uppercase tracking-tighter text-white backdrop-blur-md">
                                            -
                                            {Math.round(
                                              (1 - product.price / product.oldPrice) * 100
                                            )}
                                            %
                                          </span>
                                        )}
                                      </div>

                                      {/* Quick Actions Overlay */}
                                      <div className="absolute inset-x-0 bottom-0 hidden translate-y-full bg-gradient-to-t from-black/20 to-transparent p-2 transition-transform duration-300 group-hover:translate-y-0 sm:block">
                                        <button
                                          onClick={(e) => handleAddToCart(e, product)}
                                          className="flex w-full items-center justify-center gap-1.5 rounded-lg bg-white/95 py-2 text-[10px] font-black text-nova-900 shadow-xl backdrop-blur-md transition-all hover:bg-nova-900 hover:text-white"
                                        >
                                          <ShoppingCart className="h-3 w-3" />
                                          In den Korb
                                        </button>
                                      </div>

                                      <div className="absolute right-2 top-2 z-10 flex flex-col gap-3 transition-all duration-300">
                                        <button
                                          onClick={(e) => handleToggleWishlist(e, product)}
                                          aria-label={
                                            isInWishlist(product.id)
                                              ? 'Von Wunschliste entfernen'
                                              : 'Zur Wunschliste hinzufügen'
                                          }
                                          className={`flex h-7 w-7 items-center justify-center rounded-lg border backdrop-blur-md transition-all ${isInWishlist(product.id) ? 'border-red-400 bg-red-500 text-white' : 'border-gray-100 bg-white/80 text-gray-400 opacity-0 hover:text-red-500 group-hover:opacity-100'}`}
                                        >
                                          <Heart
                                            className={`h-3.5 w-3.5 ${isInWishlist(product.id) ? 'fill-current' : ''}`}
                                          />
                                        </button>
                                      </div>
                                    </div>

                                    {/* Info Section */}
                                    <div className="flex flex-1 flex-col justify-between bg-white p-2 sm:p-2.5">
                                      <div className="min-w-0">
                                        <h3
                                          data-testid="product-name"
                                          className="mb-0.5 line-clamp-1 text-[10px] font-bold leading-tight text-gray-900 transition-colors group-hover:text-nova-600 sm:text-[12px]"
                                        >
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
                                          <span className="ml-0.5 text-[8px] font-semibold text-gray-400">
                                            {product.reviewCount > 0 ? product.reviewCount : 0}
                                          </span>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                          <span
                                            data-testid="product-price"
                                            className="text-xs font-black tabular-nums text-nova-900 sm:text-[14px]"
                                          >
                                            {formatPriceDe(product.price)}
                                          </span>
                                          {product.oldPrice && (
                                            <span className="text-[9px] font-bold tabular-nums text-gray-400 line-through">
                                              {formatPriceDe(product.oldPrice)}
                                            </span>
                                          )}
                                        </div>
                                      </div>

                                      {/* Mobile Cart Button */}
                                      <button
                                        onClick={(e) => handleAddToCart(e, product)}
                                        className="mt-1.5 flex w-full items-center justify-center gap-1 rounded-md border border-nova-100 bg-nova-50 py-1 text-[9px] font-black text-nova-900 sm:hidden"
                                      >
                                        <ShoppingCart className="h-2.5 w-2.5" />
                                        Korb
                                      </button>
                                    </div>
                                  </TiltCard>
                                </Link>
                              </motion.div>
                            ) : (
                              /* List View Item */
                              <motion.div
                                data-testid="product-card"
                                variants={cardVariants}
                                layout
                                initial={{ opacity: 0, scale: 0.98 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.98 }}
                                transition={{ duration: 0.3 }}
                                key={product.id}
                              >
                                <Link href={`/produkt/${product.slug}`} className="group block">
                                  <div className="flex h-full flex-row overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all duration-300 hover:shadow-xl sm:rounded-[2rem]">
                                    <div className="relative flex w-2/5 flex-shrink-0 flex-col justify-center bg-gray-50 p-3 sm:w-64 sm:p-6 md:w-80">
                                      <div className="absolute inset-0 bg-white" />
                                      <div className="relative aspect-[3/4] w-full sm:aspect-auto sm:h-full">
                                        <Image
                                          src={product.images[0]}
                                          alt={product.name.de}
                                          fill
                                          className={`object-contain p-2 mix-blend-multiply transition-all duration-700 sm:p-4 ${product.images[1] ? 'group-hover:scale-95 group-hover:opacity-0' : 'group-hover:scale-105'}`}
                                          sizes="(max-width: 640px) 100vw, 320px"
                                        />
                                        {product.images[1] && (
                                          <Image
                                            src={product.images[1]}
                                            alt={`${product.name.de} Lifestyle`}
                                            fill
                                            className="absolute inset-0 z-0 object-cover opacity-0 transition-all duration-700 group-hover:opacity-100"
                                            sizes="(max-width: 640px) 100vw, 320px"
                                          />
                                        )}
                                      </div>
                                      <div className="absolute left-2 top-2 flex flex-col gap-1 sm:left-4 sm:top-4 sm:gap-2">
                                        {product.badges?.includes('new') && (
                                          <span className="rounded-md bg-amber-400 px-2 py-0.5 text-[9px] font-bold text-amber-950 shadow-sm sm:rounded-lg sm:px-3 sm:py-1 sm:text-xs">
                                            Neu
                                          </span>
                                        )}
                                        {product.oldPrice && (
                                          <span className="rounded-md bg-red-500 px-2 py-0.5 text-[9px] font-bold text-white shadow-sm sm:rounded-lg sm:px-3 sm:py-1 sm:text-xs">
                                            -
                                            {Math.round(
                                              (1 - product.price / product.oldPrice) * 100
                                            )}
                                            %
                                          </span>
                                        )}
                                      </div>
                                    </div>

                                    <div className="flex flex-1 flex-col bg-white p-4 sm:p-8">
                                      <div className="mb-auto">
                                        <h3 className="mb-2 line-clamp-2 text-base font-bold leading-tight text-[#0C211E] transition-colors group-hover:text-[#4ECCA3] sm:mb-3 sm:text-2xl lg:text-3xl">
                                          {product.name.de}
                                        </h3>
                                        {/* Stars - list view */}
                                        <div className="mb-2 flex items-center gap-1">
                                          {Array.from({ length: 5 }).map((_, i) => (
                                            <Star
                                              key={i}
                                              className={`h-3.5 w-3.5 ${i < Math.round(product.rating) ? 'fill-amber-400 text-amber-400' : 'fill-gray-200 text-gray-200'}`}
                                            />
                                          ))}
                                          <span className="ml-1 text-xs font-semibold text-gray-400">
                                            {product.rating.toFixed(1)} (
                                            {product.reviewCount > 0 ? product.reviewCount : 0}{' '}
                                            Bewertungen)
                                          </span>
                                        </div>
                                      </div>

                                      <div className="mt-4 flex flex-col justify-between gap-4 border-t border-gray-100/50 pt-4 sm:flex-row sm:items-center sm:pt-6">
                                        <div>
                                          <div className="mb-1 flex items-end gap-2">
                                            <span className="whitespace-nowrap text-xl font-black tabular-nums tracking-tight text-emerald-600 sm:text-2xl">
                                              {formatPriceDe(product.price)}
                                            </span>
                                            {product.oldPrice && (
                                              <span className="whitespace-nowrap pb-1 text-xs font-bold tabular-nums text-gray-400 line-through decoration-gray-300 sm:text-sm">
                                                {formatPriceDe(product.oldPrice)}
                                              </span>
                                            )}
                                          </div>
                                          <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                                            inkl. MwSt.
                                          </p>
                                        </div>

                                        <div className="flex items-center gap-2 sm:gap-3">
                                          <button
                                            onClick={(e) => handleToggleWishlist(e, product)}
                                            aria-label={
                                              isInWishlist(product.id)
                                                ? 'Von Wunschliste entfernen'
                                                : 'Zur Wunschliste hinzufügen'
                                            }
                                            className={`flex h-9 w-9 items-center justify-center rounded-lg border transition-colors sm:h-12 sm:w-12 sm:rounded-xl ${isInWishlist(product.id) ? 'border-red-100 bg-red-50' : 'border-gray-200 bg-gray-50 hover:border-[#4ECCA3] hover:bg-white'}`}
                                          >
                                            <Heart
                                              className={`h-4 w-4 transition-colors sm:h-5 sm:w-5 ${isInWishlist(product.id) ? 'fill-red-500 text-red-500' : 'text-gray-400 hover:text-[#4ECCA3]'}`}
                                            />
                                          </button>
                                          <button
                                            data-testid="add-to-cart-button"
                                            onClick={(e) => handleAddToCart(e, product)}
                                            className="flex h-9 flex-1 items-center justify-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-4 text-[13px] font-bold text-gray-800 shadow-sm transition-colors hover:bg-gray-100 sm:h-12 sm:flex-initial sm:rounded-xl sm:border-transparent sm:bg-[#0C211E] sm:px-6 sm:text-sm sm:text-white sm:hover:bg-[#17423C]"
                                          >
                                            <ShoppingCart className="h-4 w-4" />
                                            <span className="hidden lg:inline">
                                              In den Warenkorb
                                            </span>
                                          </button>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </Link>
                              </motion.div>
                            )
                          )}
                    </AnimatePresence>
                  </motion.div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="mt-12 flex items-center justify-center gap-2">
                      <button
                        onClick={() => goToPage(currentPage - 1)}
                        disabled={currentPage <= 1 || isLoading}
                        className="rounded-xl border border-gray-200 bg-white p-2.5 text-gray-600 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        <ChevronLeft className="h-5 w-5" />
                      </button>
                      {visiblePages.map((p, i) =>
                        p === '...' ? (
                          <span key={`dots-${i}`} className="px-2 font-bold text-gray-400">
                            ...
                          </span>
                        ) : (
                          <button
                            key={p}
                            onClick={() => goToPage(p)}
                            disabled={isLoading}
                            className={`h-10 min-w-[40px] rounded-xl text-sm font-bold transition-all ${
                              p === currentPage
                                ? 'bg-[#0C211E] text-white shadow-md shadow-[#0C211E]/10'
                                : 'border border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50'
                            }`}
                          >
                            {p}
                          </button>
                        )
                      )}
                      <button
                        onClick={() => goToPage(currentPage + 1)}
                        disabled={currentPage >= totalPages || isLoading}
                        className="rounded-xl border border-gray-200 bg-white p-2.5 text-gray-600 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        <ChevronLeft className="h-5 w-5 rotate-180" />
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function useDebouncedValue<T>(value: T, delayMs: number): T {
  const [debounced, setDebounced] = useState(value)

  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delayMs)
    return () => clearTimeout(t)
  }, [value, delayMs])

  return debounced
}
