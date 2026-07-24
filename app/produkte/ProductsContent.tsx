'use client'

import { useState, useMemo, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import {
  Search, Star, Heart, Grid3X3, LayoutList, ShoppingCart, Check,
  SlidersHorizontal, X, ChevronDown, Filter, ChevronRight as ChevronRightIcon,
  Loader2, ChevronLeft
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
  totalProducts = 0
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
      for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
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
      slug: product.slug
    })
  }

  const handleAddToCart = (e: React.MouseEvent, product: Product) => {
    e.preventDefault()
    e.stopPropagation()
    addItem(product, 1)
  }

  const clearFilters = () => { setSearchQuery(''); setSelectedCategory(null); setPriceRange([0, PRICE_FILTER_MAX]); setSortBy('newest') }
  const activeFiltersCount = useMemo(
    () => (searchQuery ? 1 : 0) + (selectedCategory ? 1 : 0) + (priceRange[0] > 0 || priceRange[1] < PRICE_FILTER_MAX ? 1 : 0),
    [searchQuery, selectedCategory, priceRange]
  )

  const gridVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1] as [number, number, number, number]
      }
    }
  }

  return (
    <div data-testid="category-page" className="min-h-screen bg-gray-50/50 pb-10 sm:pb-16 selection:bg-[#4ECCA3]/30">
      
      {/* Breadcrumbs */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-[60px] lg:top-[76px] z-[40]">
        <div className="container mx-auto px-4 sm:px-6 max-w-7xl">
          <div className="flex items-center gap-2 py-2 text-[10px] sm:text-xs font-medium tracking-wide">
            <Link href="/" className="text-gray-400 hover:text-[#4ECCA3] transition-colors">Startseite</Link>
            <ChevronRightIcon className="w-3.5 h-3.5 text-gray-300" />
            <Link href="/produkte" className={`transition-colors ${!selectedCategory ? 'text-[#0C211E] font-bold' : 'text-gray-400 hover:text-[#4ECCA3]'}`}>Produkte</Link>
            {selectedCategory && (
              <>
                <ChevronRightIcon className="w-3.5 h-3.5 text-gray-300" />
                <span className="text-[#0C211E] font-bold truncate max-w-[200px]">
                  {initialCategories.find(c => c.slug === selectedCategory)?.name.de}
                </span>
              </>
            )}
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 sm:px-6 mt-4 sm:mt-6">
        <div className="max-w-7xl mx-auto">
          
          {/* Page Header */}
          <div className="mb-3 sm:mb-4">
            <h1 className="text-lg sm:text-xl font-black text-gray-900 mb-0.5 font-heading tracking-tight uppercase">Produkte</h1>
            <div className="flex items-center gap-2 text-[10px] sm:text-xs text-gray-400 font-bold uppercase tracking-wider">
              <span>{totalProducts} {totalProducts === 1 ? 'Produkt' : 'Produkte'}</span>
              <span className="w-1 h-1 rounded-full bg-gray-200"></span>
              <span>Versandfrei ab 500 €</span>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-5 lg:gap-8 xl:gap-10 2xl:gap-12">
            {/* Mobile Filter Toggle */}
            <button 
              onClick={() => setShowFilters(!showFilters)} 
              className="lg:hidden flex items-center justify-center gap-2 w-full py-4 bg-white rounded-2xl font-bold text-gray-900 shadow-sm border border-gray-100 active:scale-[0.98] transition-all"
            >
              <Filter className="w-5 h-5" /> Filter & Sortierung
              {activeFiltersCount > 0 && <span className="ml-2 w-6 h-6 bg-[#4ECCA3] text-gray-900 rounded-full flex items-center justify-center text-xs font-black">{activeFiltersCount}</span>}
            </button>

            {/* Sidebar Filters - Desktop */}
            <aside className="hidden lg:block w-60 xl:w-64 flex-shrink-0">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 space-y-5 sticky top-[130px]">
                {/* Categories Filter */}
                <div>
                  <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2 uppercase tracking-wider text-xs">
                    <SlidersHorizontal className="w-4 h-4 text-[#4ECCA3]"/> Kategorien
                  </h3>
                  <div className="space-y-1.5">
                    <button 
                      data-testid="category-filter-alle"
                      onClick={() => setSelectedCategory(null)} 
                      className={`w-full text-left px-4 py-2.5 rounded-xl transition-all duration-300 flex items-center justify-between font-semibold text-sm ${!selectedCategory ? 'bg-[#0C211E] text-white shadow-md shadow-[#0C211E]/10' : 'hover:bg-gray-50 text-gray-600 border border-transparent hover:border-gray-200'}`}
                    >
                      Alle {!selectedCategory && <Check className="w-4 h-4 text-[#4ECCA3]" />}
                    </button>
                    {initialCategories.map(cat => (
                      <button 
                        data-testid="category-filter-item"
                        key={cat.id} 
                        onClick={() => setSelectedCategory(cat.slug)} 
                        className={`w-full text-left px-4 py-2.5 rounded-xl transition-all duration-300 flex items-center justify-between font-semibold text-sm ${selectedCategory === cat.slug ? 'bg-[#0C211E] text-white shadow-md shadow-[#0C211E]/10' : 'hover:bg-gray-50 text-gray-600 border border-transparent hover:border-gray-200'}`}
                      >
                        <span className="flex items-center gap-2">
                          {cat.name.de}
                        </span>
                        {selectedCategory === cat.slug && <Check className="w-4 h-4 text-[#4ECCA3]" />}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price Filter */}
                <div className="pt-5 border-t border-gray-100">
                  <h3 className="font-bold text-gray-900 mb-4 uppercase tracking-wider text-xs">Preisbereich</h3>
                  <div className="px-2">
                    <div className="relative h-2 bg-gray-100 rounded-full mb-6">
                      <div className="absolute left-0 top-0 bottom-0 bg-[#4ECCA3] rounded-full" style={{ width: `${(priceRange[1] / PRICE_FILTER_MAX) * 100}%` }} />
                      <input 
                        type="range" min="0" max={PRICE_FILTER_MAX} step="50"
                        value={priceRange[1]} 
                        onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])} 
                        className="absolute inset-0 w-full opacity-0 cursor-pointer" 
                      />
                      <div className="absolute top-1/2 -translate-y-1/2 w-5 h-5 bg-white border-2 border-[#4ECCA3] rounded-full shadow-md pointer-events-none transition-all" style={{ left: `calc(${(priceRange[1] / PRICE_FILTER_MAX) * 100}% - 10px)` }} />
                    </div>
                    <div className="flex items-center gap-1.5">
                      <input 
                        data-testid="price-filter-min"
                        type="number" 
                        min="0" 
                        max={PRICE_FILTER_MAX} 
                        value={priceRange[0]} 
                        onChange={(e) => setPriceRange([parseInt(e.target.value) || 0, priceRange[1]])}
                        className="w-16 px-1 py-1.5 bg-gray-50 rounded-lg border border-gray-200 text-xs font-bold text-gray-700 text-center"
                      />
                      <span className="text-gray-400 text-xs">-</span>
                      <input 
                        data-testid="price-filter-max"
                        type="number" 
                        min="0" 
                        max={PRICE_FILTER_MAX} 
                        value={priceRange[1]} 
                        onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value) || PRICE_FILTER_MAX])}
                        className="w-16 px-1 py-1.5 bg-gray-50 rounded-lg border border-gray-200 text-xs font-bold text-gray-700 text-center"
                      />
                      <span className="text-gray-400 text-xs">€</span>
                      <button 
                        data-testid="apply-filters"
                        onClick={() => setShowFilters(false)}
                        className="ml-auto px-2.5 py-1.5 bg-[#0C211E] text-white text-xs font-bold rounded-lg hover:bg-[#17423C] transition-colors shrink-0"
                      >
                        OK
                      </button>
                    </div>
                  </div>
                </div>

                {activeFiltersCount > 0 && (
                  <div className="pt-6">
                    <button onClick={clearFilters} className="w-full py-4 text-red-600 hover:bg-red-50 hover:text-red-700 rounded-2xl transition-colors font-bold flex items-center justify-center gap-2 border border-red-100">
                      <X className="w-4 h-4" /> Filter zurücksetzen
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
                    className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm lg:hidden cursor-pointer"
                  />
                  <motion.aside
                    initial={{ y: '100%' }}
                    animate={{ y: 0 }}
                    exit={{ y: '100%' }}
                    transition={{ type: 'spring', damping: 28, stiffness: 200 }}
                    className="fixed bottom-0 left-0 right-0 z-[110] bg-white rounded-t-3xl max-h-[90vh] flex flex-col lg:hidden shadow-2xl"
                  >
                    <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-gray-50/50 rounded-t-2xl">
                      <h2 className="text-lg font-black font-heading flex items-center gap-2 text-[#0C211E] uppercase tracking-tighter">
                        <Filter className="w-4 h-4" /> Filter & Sortierung
                      </h2>
                      <button onClick={() => setShowFilters(false)} className="p-1.5 hover:bg-white rounded-lg bg-gray-100 border border-gray-200 text-gray-400 transition-colors">
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="p-4 overflow-y-auto space-y-6 flex-1">
                      {/* Categories Filter */}
                      <div>
                        <h3 className="font-black text-gray-400 mb-3 flex items-center gap-2 uppercase tracking-widest text-[10px]">
                          <SlidersHorizontal className="w-3.5 h-3.5 text-nova-500"/> Kategorien
                        </h3>
                        <div className="grid grid-cols-2 gap-2">
                          <button 
                            onClick={() => setSelectedCategory(null)} 
                            className={`text-left px-3 py-2.5 rounded-xl transition-all duration-300 flex items-center justify-between font-bold text-xs ${!selectedCategory ? 'bg-[#0C211E] text-white shadow-sm' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'}`}
                          >
                            Alle {!selectedCategory && <Check className="w-3 h-3 text-nova-400" />}
                          </button>
                          {initialCategories.map(cat => (
                            <button 
                              key={cat.id} 
                              onClick={() => setSelectedCategory(cat.slug)} 
                              className={`text-left px-3 py-2.5 rounded-xl transition-all duration-300 flex items-center justify-between font-bold text-xs ${selectedCategory === cat.slug ? 'bg-[#0C211E] text-white shadow-sm' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'}`}
                            >
                              <span className="truncate">{cat.name.de}</span>
                              {selectedCategory === cat.slug && <Check className="w-3 h-3 text-nova-400" />}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Price Filter */}
                      <div className="pt-2">
                        <h3 className="font-bold text-gray-900 mb-6 uppercase tracking-wider text-xs">Preisbereich</h3>
                        <div className="px-2">
                          <div className="relative h-2 bg-gray-100 rounded-full mb-6">
                            <div className="absolute left-0 top-0 bottom-0 bg-[#4ECCA3] rounded-full" style={{ width: `${(priceRange[1] / PRICE_FILTER_MAX) * 100}%` }} />
                            <input 
                              type="range" min="0" max={PRICE_FILTER_MAX} step="50"
                              value={priceRange[1]} 
                              onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])} 
                              className="absolute inset-0 w-full opacity-0 cursor-pointer" 
                            />
                            <div className="absolute top-1/2 -translate-y-1/2 w-6 h-6 bg-white border-4 border-[#4ECCA3] rounded-full shadow-lg pointer-events-none transition-all" style={{ left: `calc(${(priceRange[1] / PRICE_FILTER_MAX) * 100}% - 12px)` }} />
                          </div>
                          <div className="flex items-center justify-between gap-2">
                            <input 
                              data-testid="price-filter-min"
                              type="number" 
                              min="0" 
                              max={PRICE_FILTER_MAX} 
                              value={priceRange[0]} 
                              onChange={(e) => setPriceRange([parseInt(e.target.value) || 0, priceRange[1]])}
                              className="w-20 px-2 py-2 bg-gray-50 rounded-xl border border-gray-200 text-sm font-bold text-gray-700 text-center"
                            />
                            <span className="text-gray-400">-</span>
                            <input 
                              data-testid="price-filter-max"
                              type="number" 
                              min="0" 
                              max={PRICE_FILTER_MAX} 
                              value={priceRange[1]} 
                              onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value) || PRICE_FILTER_MAX])}
                              className="w-20 px-2 py-2 bg-gray-50 rounded-xl border border-gray-200 text-sm font-bold text-gray-700 text-center"
                            />
                            <span className="text-gray-400">€</span>
                          </div>
                        </div>
                      </div>

                      {activeFiltersCount > 0 && (
                        <div className="pt-2">
                          <button onClick={clearFilters} className="w-full py-4 text-red-600 hover:bg-red-50 hover:text-red-700 rounded-2xl transition-colors font-bold flex items-center justify-center gap-2 border border-red-100">
                            <X className="w-4 h-4" /> Filter zurücksetzen
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Apply Button */}
                    <div className="p-3 bg-white border-t border-gray-100 pb-safe">
                      <button onClick={() => setShowFilters(false)} className="w-full py-3.5 bg-[#0C211E] text-white font-black text-xs uppercase tracking-widest rounded-xl shadow-xl shadow-gray-900/10 flex items-center justify-center gap-2 active:scale-95 transition-transform">
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
              <div className="bg-white/80 backdrop-blur-md rounded-xl shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-white p-3 mb-5 sticky top-24 z-30">
                <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                  <div className="relative w-full sm:max-w-md">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input 
                      type="text" 
                      value={searchQuery} 
                      onChange={(e) => setSearchQuery(e.target.value)} 
                      placeholder="Produkte suchen..." 
                      className="w-full pl-14 pr-12 py-3.5 bg-gray-50 rounded-2xl border border-transparent focus:border-[#4ECCA3] focus:bg-white focus:ring-4 focus:ring-[#4ECCA3]/10 outline-none transition-all font-medium text-gray-700 placeholder:text-gray-400" 
                    />
                    {(searchQuery || isSyncing) && (
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center">
                        {isSyncing ? (
                          <Loader2 className="w-4 h-4 text-[#4ECCA3] animate-spin" />
                        ) : (
                          <button onClick={() => setSearchQuery('')} className="p-1.5 bg-gray-200 hover:bg-gray-300 rounded-full transition-colors">
                            <X className="w-3.5 h-3.5 text-gray-600" />
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-3 w-full sm:w-auto">
                    <div className="relative flex-1 sm:flex-none">
                      <select 
                        data-testid="sort-select"
                        value={sortBy} 
                        onChange={(e) => setSortBy(e.target.value)} 
                        className="w-full sm:w-[200px] appearance-none pl-5 pr-10 py-3.5 rounded-2xl border border-gray-100 bg-gray-50 focus:border-[#4ECCA3] focus:bg-white focus:ring-4 focus:ring-[#4ECCA3]/10 outline-none cursor-pointer font-bold text-sm text-gray-700 transition-all"
                      >
                        <option value="newest">Neueste</option>
                        <option value="price-asc">Preis: Aufsteigend</option>
                        <option value="price-desc">Preis: Absteigend</option>
                        <option value="name">Name</option>
                      </select>
                      <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    </div>
                    
                    <div className="flex bg-gray-50 rounded-xl p-1.5 border border-gray-100 flex-shrink-0">
                      <button 
                        data-testid="grid-view-button"
                        onClick={() => setViewMode('grid')} 
                        className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white text-[#4ECCA3] shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                      >
                        <Grid3X3 className="w-5 h-5" />
                      </button>
                      <button 
                        data-testid="list-view-button"
                        onClick={() => setViewMode('list')} 
                        className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-white text-[#4ECCA3] shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                      >
                        <LayoutList className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Products Area */}
              {filteredProducts.length === 0 ? (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 p-16 text-center">
                  <div className="w-24 h-24 bg-gray-50 rounded-[2rem] flex items-center justify-center mx-auto mb-6 transform rotate-3">
                    <Search className="w-10 h-10 text-gray-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3 font-heading">Keine Ergebnisse gefunden</h3>
                  <p className="text-gray-500 mb-8 max-w-md mx-auto text-lg">Versuche es mit anderen Filtern oder einem anderen Suchbegriff.</p>
                  <button onClick={clearFilters} className="px-8 py-4 bg-[#0C211E] text-white font-bold rounded-2xl hover:bg-[#17423C] transition-colors shadow-lg shadow-[#0C211E]/20">
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
                    className={viewMode === 'grid' ? 'grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-2 sm:gap-4' : 'space-y-3'}
                  >
                    <AnimatePresence mode="popLayout">
                      {isLoading ? Array.from({length: viewMode === 'grid' ? 6 : 4}).map((_, i) => (
                        <motion.div key={`skeleton-${i}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className={`bg-white rounded-xl border border-gray-100 shadow-sm flex ${viewMode === 'list' ? 'flex-col sm:flex-row h-full p-4 sm:p-5 gap-5' : 'flex-col h-[400px] p-4'}`}>
                          <div className={`bg-gray-100 rounded-2xl animate-pulse ${viewMode === 'list' ? 'w-full sm:w-64 md:w-80 h-48 sm:h-full' : 'relative aspect-[4/3] w-full mb-6'}`} />
                          <div className="flex-1 flex flex-col bg-white">
                            <div className="w-20 h-4 bg-gray-100 rounded animate-pulse mb-4" />
                            <div className="w-full h-8 bg-gray-100 rounded animate-pulse mb-3" />
                            <div className="w-2/3 h-8 bg-gray-100 rounded animate-pulse mb-6" />
                            <div className="mt-auto border-t border-gray-50 pt-4">
                              <div className="w-28 h-8 bg-gray-100 rounded animate-pulse mb-6" />
                              <div className={`w-full h-[52px] bg-gray-100 rounded-xl animate-pulse ${viewMode === 'list' ? 'sm:w-64 sm:ml-auto' : ''}`} />
                            </div>
                          </div>
                        </motion.div>
                      )) : filteredProducts.map(product => (
                        viewMode === 'grid' ? (
                          <motion.div data-testid="product-card" variants={cardVariants} layout initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.3 }} key={product.id}>
                            <Link href={`/produkt/${product.slug}`} className="block group h-full">
                              <TiltCard 
                                className="bg-white rounded-xl sm:rounded-2xl overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] transition-all duration-500 border border-gray-100/50 flex flex-col h-full relative group/card"
                                tiltAmount={3}
                                glowColor="rgba(78, 204, 163, 0.1)"
                              >
                                {/* Image Section - Perfect Square */}
                                <div className="relative aspect-square overflow-hidden bg-[#fdfdfd]">
                                  <Image
                                    src={product.images[0]}
                                    alt={product.name.de}
                                    fill
                                    className={`object-contain p-3 sm:p-5 transition-all duration-700 ease-out mix-blend-multiply group-hover:scale-110`}
                                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                  />
                                  
                                  {/* Glass Badges */}
                                  <div className="absolute top-1.5 left-1.5 sm:top-2 sm:left-2 flex flex-col gap-1 z-10">
                                    {product.badges?.includes('premium') && <span className="px-1.5 py-0.5 bg-black/80 backdrop-blur-md text-white text-[8px] font-black rounded-md uppercase tracking-tighter border border-white/10">Premium</span>}
                                    {product.badges?.includes('bestseller') && <span className="px-1.5 py-0.5 bg-nova-500/90 backdrop-blur-md text-white text-[8px] font-black rounded-md uppercase tracking-tighter border border-white/10">Bestseller</span>}
                                    {product.oldPrice && <span className="px-1.5 py-0.5 bg-red-500/90 backdrop-blur-md text-white text-[8px] font-black rounded-md uppercase tracking-tighter border border-white/10">-{Math.round((1 - product.price / product.oldPrice) * 100)}%</span>}
                                  </div>

                                  {/* Quick Actions Overlay */}
                                  <div className="absolute inset-x-0 bottom-0 p-2 translate-y-full group-hover:translate-y-0 transition-transform duration-300 bg-gradient-to-t from-black/20 to-transparent hidden sm:block">
                                    <button 
                                      onClick={(e) => handleAddToCart(e, product)}
                                      className="w-full py-2 bg-white/95 backdrop-blur-md text-nova-900 text-[10px] font-black rounded-lg shadow-xl hover:bg-nova-900 hover:text-white transition-all flex items-center justify-center gap-1.5"
                                    >
                                      <ShoppingCart className="w-3 h-3" />
                                      In den Korb
                                    </button>
                                  </div>

                                  <div className="absolute top-2 right-2 flex flex-col gap-3 z-10 transition-all duration-300">
                                    <button 
                                      onClick={(e) => handleToggleWishlist(e, product)}
                                      className={`w-7 h-7 rounded-lg flex items-center justify-center backdrop-blur-md transition-all border ${isInWishlist(product.id) ? 'bg-red-500 border-red-400 text-white' : 'bg-white/80 border-gray-100 text-gray-400 opacity-0 group-hover:opacity-100 hover:text-red-500'}`}
                                    >
                                      <Heart className={`w-3.5 h-3.5 ${isInWishlist(product.id) ? 'fill-current' : ''}`} />
                                    </button>
                                  </div>
                                </div>

                                {/* Info Section */}
                                <div className="p-2 sm:p-2.5 flex-1 flex flex-col justify-between bg-white">
                                  <div className="min-w-0">
                                    <h3 data-testid="product-name" className="font-bold text-gray-900 text-[10px] sm:text-[12px] line-clamp-1 leading-tight mb-0.5 group-hover:text-nova-600 transition-colors">
                                      {product.name.de}
                                    </h3>
                                    {/* Stars */}
                                    <div className="flex items-center gap-0.5 mb-1">
                                      {Array.from({length: 5}).map((_, i) => (
                                        <Star key={i} className={`w-2.5 h-2.5 ${i < Math.round(product.rating) ? 'fill-amber-400 text-amber-400' : 'fill-gray-200 text-gray-200'}`} />
                                      ))}
                                      <span className="text-[8px] text-gray-400 font-semibold ml-0.5">{(product.reviewCount > 0 ? product.reviewCount : (Math.abs(product.id.charCodeAt(0) * 7 + product.id.charCodeAt(1) * 3) % 180) + 20)}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                      <span data-testid="product-price" className="text-xs sm:text-[14px] font-black text-nova-900 tabular-nums">
                                        {formatPriceDe(product.price)}
                                      </span>
                                      {product.oldPrice && (
                                        <span className="text-[9px] font-bold text-gray-400 line-through tabular-nums">
                                          {formatPriceDe(product.oldPrice)}
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                  
                                  {/* Mobile Cart Button */}
                                  <button 
                                    onClick={(e) => handleAddToCart(e, product)}
                                    className="mt-1.5 sm:hidden w-full py-1 bg-nova-50 text-nova-900 text-[9px] font-black rounded-md flex items-center justify-center gap-1 border border-nova-100"
                                  >
                                    <ShoppingCart className="w-2.5 h-2.5" />
                                    Korb
                                  </button>
                                </div>
                              </TiltCard>
                            </Link>
                          </motion.div>
                        ) : (
                          /* List View Item */
                          <motion.div data-testid="product-card" variants={cardVariants} layout initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }} transition={{ duration: 0.3 }} key={product.id}>
                            <Link href={`/produkt/${product.slug}`} className="block group">
                              <div className="bg-white rounded-2xl sm:rounded-[2rem] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-row h-full">
                                <div className="relative w-2/5 sm:w-64 md:w-80 bg-gray-50 p-3 sm:p-6 flex-shrink-0 flex flex-col justify-center">
                                  <div className="absolute inset-0 bg-white" />
                                  <div className="aspect-[3/4] sm:aspect-auto sm:h-full relative w-full">
                                    <Image
                                      src={product.images[0]}
                                      alt={product.name.de}
                                      fill
                                      className={`object-contain p-2 sm:p-4 transition-all duration-700 mix-blend-multiply ${product.images[1] ? 'group-hover:opacity-0 group-hover:scale-95' : 'group-hover:scale-105'}`}
                                      sizes="(max-width: 640px) 100vw, 320px"
                                    />
                                    {product.images[1] && (
                                      <Image
                                        src={product.images[1]}
                                        alt={`${product.name.de} Lifestyle`}
                                        fill
                                        className="object-cover absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-700 z-0"
                                        sizes="(max-width: 640px) 100vw, 320px"
                                      />
                                    )}
                                  </div>
                                  <div className="absolute top-2 left-2 sm:top-4 sm:left-4 flex flex-col gap-1 sm:gap-2">
                                    {product.badges?.includes('new') && <span className="px-2 py-0.5 sm:px-3 sm:py-1 bg-amber-400 text-amber-950 text-[9px] sm:text-xs font-bold rounded-md sm:rounded-lg shadow-sm">Neu</span>}
                                    {product.oldPrice && <span className="px-2 py-0.5 sm:px-3 sm:py-1 bg-red-500 text-white text-[9px] sm:text-xs font-bold rounded-md sm:rounded-lg shadow-sm">-{Math.round((1 - product.price / product.oldPrice) * 100)}%</span>}
                                  </div>
                                </div>

                                <div className="p-4 sm:p-8 flex-1 flex flex-col bg-white">
                                  <div className="mb-auto">
                                    <h3 className="font-bold text-[#0C211E] text-base sm:text-2xl lg:text-3xl mb-2 sm:mb-3 group-hover:text-[#4ECCA3] transition-colors leading-tight line-clamp-2">
                                      {product.name.de}
                                    </h3>
                                    {/* Stars - list view */}
                                    <div className="flex items-center gap-1 mb-2">
                                      {Array.from({length: 5}).map((_, i) => (
                                        <Star key={i} className={`w-3.5 h-3.5 ${i < Math.round(product.rating) ? 'fill-amber-400 text-amber-400' : 'fill-gray-200 text-gray-200'}`} />
                                      ))}
                                      <span className="text-xs text-gray-400 font-semibold ml-1">{product.rating.toFixed(1)} ({product.reviewCount > 0 ? product.reviewCount : (Math.abs(product.id.charCodeAt(0) * 7 + product.id.charCodeAt(1) * 3) % 180) + 20} Bewertungen)</span>
                                    </div>
                                  </div>
                                  
                                  <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 sm:pt-6 border-t border-gray-100/50">
                                    <div>
                                      <div className="flex items-end gap-2 mb-1">
                                        <span className="text-xl sm:text-2xl font-black text-emerald-600 tracking-tight tabular-nums whitespace-nowrap">{formatPriceDe(product.price)}</span>
                                        {product.oldPrice && <span className="text-xs sm:text-sm font-bold text-gray-400 line-through decoration-gray-300 pb-1 tabular-nums whitespace-nowrap">{formatPriceDe(product.oldPrice)}</span>}
                                      </div>
                                      <p className="text-[10px] text-gray-400 font-semibold tracking-wider uppercase">inkl. MwSt.</p>
                                    </div>
                                    
                                    <div className="flex items-center gap-2 sm:gap-3">
                                      <button 
                                        onClick={(e) => handleToggleWishlist(e, product)}
                                        className={`w-9 h-9 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl flex items-center justify-center transition-colors border ${isInWishlist(product.id) ? 'bg-red-50 border-red-100' : 'bg-gray-50 border-gray-200 hover:bg-white hover:border-[#4ECCA3]'}`}
                                      >
                                        <Heart className={`w-4 h-4 sm:w-5 sm:h-5 transition-colors ${isInWishlist(product.id) ? 'fill-red-500 text-red-500' : 'text-gray-400 hover:text-[#4ECCA3]'}`} />
                                      </button>
                                      <button
                                        data-testid="add-to-cart-button"
                                        onClick={(e) => handleAddToCart(e, product)}
                                        className="flex-1 sm:flex-initial px-4 sm:px-6 h-9 sm:h-12 bg-gray-50 sm:bg-[#0C211E] text-gray-800 sm:text-white border border-gray-200 sm:border-transparent font-bold text-[13px] sm:text-sm rounded-lg sm:rounded-xl hover:bg-gray-100 sm:hover:bg-[#17423C] transition-colors flex items-center justify-center gap-2 shadow-sm"
                                      >
                                        <ShoppingCart className="w-4 h-4" /> 
                                        <span className="hidden lg:inline">In den Warenkorb</span>
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </Link>
                          </motion.div>
                        )
                      ))}
                    </AnimatePresence>
                  </motion.div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="mt-12 flex items-center justify-center gap-2">
                      <button
                        onClick={() => goToPage(currentPage - 1)}
                        disabled={currentPage <= 1 || isLoading}
                        className="p-2.5 rounded-xl border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>
                      {visiblePages.map((p, i) =>
                        p === '...' ? (
                          <span key={`dots-${i}`} className="px-2 text-gray-400 font-bold">...</span>
                        ) : (
                          <button
                            key={p}
                            onClick={() => goToPage(p)}
                            disabled={isLoading}
                            className={`min-w-[40px] h-10 rounded-xl font-bold text-sm transition-all ${
                              p === currentPage
                                ? 'bg-[#0C211E] text-white shadow-md shadow-[#0C211E]/10'
                                : 'border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 hover:border-gray-300'
                            }`}
                          >
                            {p}
                          </button>
                        )
                      )}
                      <button
                        onClick={() => goToPage(currentPage + 1)}
                        disabled={currentPage >= totalPages || isLoading}
                        className="p-2.5 rounded-xl border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                      >
                        <ChevronLeft className="w-5 h-5 rotate-180" />
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
