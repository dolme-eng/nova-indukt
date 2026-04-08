'use client'

import { useState, useMemo, useEffect } from 'react'
import Image from 'next/image'
import { Link } from '@/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { useDeTranslations } from '@/lib/i18n/useDeTranslations'
import { 
  Search, Star, Heart, Grid3X3, LayoutList, ShoppingCart, Check,
  SlidersHorizontal, X, ChevronDown, ArrowRight, Filter, ChevronRight as ChevronRightIcon
} from 'lucide-react'
import { products, categories } from '@/lib/data/products'
import { formatPriceDe } from '@/lib/utils/vat'
import { useCart } from '@/lib/store/cart'
import { useWishlist } from '@/lib/store/wishlist'
import { TiltCard } from '@/components/animations'

const ITEMS_PER_PAGE = 12
const PRICE_FILTER_MAX = 2500

export function ProductsContent() {
  const t = useDeTranslations('products')
  const tc = useDeTranslations('cart')
  const { addItem } = useCart()
  const { isInWishlist, toggleItem } = useWishlist()
  
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 2500])
  const [sortBy, setSortBy] = useState('newest')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [showFilters, setShowFilters] = useState(false)
  const [displayedCount, setDisplayedCount] = useState(ITEMS_PER_PAGE)

  const filteredProducts = useMemo(() => {
    let result = products
    if (searchQuery) result = result.filter(p => p.name.de.toLowerCase().includes(searchQuery.toLowerCase()))
    if (selectedCategory) result = result.filter(p => p.category === selectedCategory)
    result = result.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1])
    switch(sortBy) {
      case 'price-asc': result = [...result].sort((a, b) => a.price - b.price); break
      case 'price-desc': result = [...result].sort((a, b) => b.price - a.price); break
      case 'name': result = [...result].sort((a, b) => a.name.de.localeCompare(b.name.de)); break
      default: result = [...result].sort((a, b) => (b.badges?.includes('new') ? 1 : 0) - (a.badges?.includes('new') ? 1 : 0))
    }
    return result
  }, [searchQuery, selectedCategory, priceRange, sortBy])

  const paginatedProducts = filteredProducts.slice(0, displayedCount)

  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => { setDisplayedCount(ITEMS_PER_PAGE) }, [searchQuery, selectedCategory, sortBy])

  useEffect(() => {
    setIsLoading(true)
    const t = setTimeout(() => setIsLoading(false), 500)
    return () => clearTimeout(t)
  }, [searchQuery, selectedCategory, priceRange, sortBy, displayedCount, viewMode])

  const handleToggleWishlist = (e: React.MouseEvent, product: typeof products[0]) => {
    e.preventDefault()
    e.stopPropagation()
    toggleItem({ id: product.id, name: product.name, price: product.price, image: product.images[0], slug: product.slug })
  }

  const handleAddToCart = (e: React.MouseEvent, product: typeof products[0]) => {
    e.preventDefault()
    e.stopPropagation()
    addItem(product, 1)
  }

  const clearFilters = () => { setSearchQuery(''); setSelectedCategory(null); setPriceRange([0, PRICE_FILTER_MAX]); setSortBy('newest') }
  const activeFiltersCount = (searchQuery ? 1 : 0) + (selectedCategory ? 1 : 0) + (priceRange[0] > 0 || priceRange[1] < PRICE_FILTER_MAX ? 1 : 0)

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
        ease: [0.22, 1, 0.36, 1]
      }
    }
  }

  return (
    <div className="min-h-screen bg-gray-50/50 pb-10 sm:pb-16 selection:bg-[#4ECCA3]/30">
      
      {/* Breadcrumbs */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-[72px] lg:top-[88px] z-[40]">
        <div className="container mx-auto px-4 sm:px-6 max-w-[1400px]">
          <div className="flex items-center gap-2 py-2.5 text-xs sm:text-sm font-medium tracking-wide">
            <Link href="/" className="text-gray-400 hover:text-[#4ECCA3] transition-colors">{t('nav.home') || 'Startseite'}</Link>
            <ChevronRightIcon className="w-3.5 h-3.5 text-gray-300" />
            <Link href="/produkte" className={`transition-colors ${!selectedCategory ? 'text-[#0C211E] font-bold' : 'text-gray-400 hover:text-[#4ECCA3]'}`}>{t('title') || 'Produkte'}</Link>
            {selectedCategory && (
              <>
                <ChevronRightIcon className="w-3.5 h-3.5 text-gray-300" />
                <span className="text-[#0C211E] font-bold truncate max-w-[200px]">
                  {categories.find(c => c.id === selectedCategory)?.name.de}
                </span>
              </>
            )}
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 mt-5 sm:mt-8">
        <div className="max-w-[1400px] 2xl:max-w-[1600px] mx-auto">
          
          {/* Page Header */}
          <div className="mb-6 sm:mb-8">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-2 font-heading tracking-tight">{t('title')}</h1>
            <div className="flex items-center gap-3 text-sm text-gray-500 font-medium">
              <span>{filteredProducts.length} {filteredProducts.length === 1 ? t('product') : t('products')}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-gray-300"></span>
              <span>Kostenloser Versand ab 500 €</span>
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
            <aside className="hidden lg:block w-72 xl:w-80 flex-shrink-0">
              <div className="bg-white rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] xl:shadow-[0_12px_40px_rgb(0,0,0,0.06)] border border-gray-100 p-5 xl:p-6 space-y-6 sticky top-[150px]">
                {/* Categories Filter */}
                <div>
                  <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2 uppercase tracking-wider text-xs">
                    <SlidersHorizontal className="w-4 h-4 text-[#4ECCA3]"/> {t('filters.categories')}
                  </h3>
                  <div className="space-y-1.5">
                    <button 
                      onClick={() => setSelectedCategory(null)} 
                      className={`w-full text-left px-4 py-2.5 rounded-xl transition-all duration-300 flex items-center justify-between font-semibold text-sm ${!selectedCategory ? 'bg-[#0C211E] text-white shadow-md shadow-[#0C211E]/10' : 'hover:bg-gray-50 text-gray-600 border border-transparent hover:border-gray-200'}`}
                    >
                      {t('filters.all')} {!selectedCategory && <Check className="w-4 h-4 text-[#4ECCA3]" />}
                    </button>
                    {categories.map(cat => (
                      <button 
                        key={cat.id} 
                        onClick={() => setSelectedCategory(cat.id)} 
                        className={`w-full text-left px-4 py-2.5 rounded-xl transition-all duration-300 flex items-center justify-between font-semibold text-sm ${selectedCategory === cat.id ? 'bg-[#0C211E] text-white shadow-md shadow-[#0C211E]/10' : 'hover:bg-gray-50 text-gray-600 border border-transparent hover:border-gray-200'}`}
                      >
                        {cat.name.de} {selectedCategory === cat.id && <Check className="w-4 h-4 text-[#4ECCA3]" />}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price Filter */}
                <div className="pt-5 border-t border-gray-100">
                  <h3 className="font-bold text-gray-900 mb-4 uppercase tracking-wider text-xs">{t('filters.priceRange')}</h3>
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
                    <div className="flex items-center justify-between">
                      <div className="px-4 py-2 bg-gray-50 rounded-xl border border-gray-200 text-sm font-bold text-gray-700">{priceRange[0]} €</div>
                      <span className="text-gray-400">-</span>
                      <div className="px-4 py-2 bg-gray-50 rounded-xl border border-gray-200 text-sm font-bold text-gray-700">{priceRange[1]} €</div>
                    </div>
                  </div>
                </div>

                {activeFiltersCount > 0 && (
                  <div className="pt-6">
                    <button onClick={clearFilters} className="w-full py-4 text-red-600 hover:bg-red-50 hover:text-red-700 rounded-2xl transition-colors font-bold flex items-center justify-center gap-2 border border-red-100">
                      <X className="w-4 h-4" /> {t('filters.clear')}
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
                    <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gray-50/50 rounded-t-3xl">
                      <h2 className="text-xl font-bold font-heading flex items-center gap-2 text-[#0C211E]">
                        <Filter className="w-5 h-5" /> Filter & Sortierung
                      </h2>
                      <button onClick={() => setShowFilters(false)} className="p-2 hover:bg-white rounded-full bg-gray-100 border border-gray-200 text-gray-500 transition-colors">
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    <div className="p-6 overflow-y-auto space-y-8 flex-1">
                      {/* Categories Filter */}
                      <div>
                        <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2 uppercase tracking-wider text-xs">
                          <SlidersHorizontal className="w-4 h-4 text-[#4ECCA3]"/> {t('filters.categories')}
                        </h3>
                        <div className="space-y-1.5">
                          <button 
                            onClick={() => setSelectedCategory(null)} 
                            className={`w-full text-left px-5 py-3.5 rounded-2xl transition-all duration-300 flex items-center justify-between font-semibold text-sm ${!selectedCategory ? 'bg-[#0C211E] text-white shadow-md shadow-[#0C211E]/10' : 'bg-gray-50 text-gray-700 hover:bg-gray-100'}`}
                          >
                            {t('filters.all')} {!selectedCategory && <Check className="w-4 h-4 text-[#4ECCA3]" />}
                          </button>
                          {categories.map(cat => (
                            <button 
                              key={cat.id} 
                              onClick={() => setSelectedCategory(cat.id)} 
                              className={`w-full text-left px-5 py-3.5 rounded-2xl transition-all duration-300 flex items-center justify-between font-semibold text-sm ${selectedCategory === cat.id ? 'bg-[#0C211E] text-white shadow-md shadow-[#0C211E]/10' : 'bg-gray-50 text-gray-700 hover:bg-gray-100'}`}
                            >
                              {cat.name.de} {selectedCategory === cat.id && <Check className="w-4 h-4 text-[#4ECCA3]" />}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Price Filter */}
                      <div className="pt-2">
                        <h3 className="font-bold text-gray-900 mb-6 uppercase tracking-wider text-xs">{t('filters.priceRange')}</h3>
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
                          <div className="flex items-center justify-between">
                            <div className="px-4 py-2 bg-gray-50 rounded-xl border border-gray-200 text-sm font-bold text-gray-700">{priceRange[0]} €</div>
                            <span className="text-gray-400">-</span>
                            <div className="px-4 py-2 bg-gray-50 rounded-xl border border-gray-200 text-sm font-bold text-gray-700">{priceRange[1]} €</div>
                          </div>
                        </div>
                      </div>

                      {activeFiltersCount > 0 && (
                        <div className="pt-2">
                          <button onClick={clearFilters} className="w-full py-4 text-red-600 hover:bg-red-50 hover:text-red-700 rounded-2xl transition-colors font-bold flex items-center justify-center gap-2 border border-red-100">
                            <X className="w-4 h-4" /> {t('filters.clear')}
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Apply Button */}
                    <div className="p-4 bg-white border-t border-gray-100 shadow-[0_-10px_30px_rgba(0,0,0,0.05)] pb-safe">
                      <button onClick={() => setShowFilters(false)} className="w-full py-4 bg-[#0C211E] text-white font-bold text-lg rounded-2xl shadow-xl shadow-[#0C211E]/20 flex items-center justify-center gap-2 active:scale-95 transition-transform">
                        Zeige {filteredProducts.length} Produkte
                      </button>
                    </div>
                  </motion.aside>
                </>
              )}
            </AnimatePresence>

            {/* Main Content */}
            <main className="flex-1">
              
              {/* Top Bar for View & Sort */}
              <div className="bg-white/80 backdrop-blur-md rounded-xl shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-white p-3 mb-5 sticky top-24 z-30">
                <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                  <div className="relative w-full sm:max-w-md">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input 
                      type="text" 
                      value={searchQuery} 
                      onChange={(e) => setSearchQuery(e.target.value)} 
                      placeholder={t('search.placeholder')} 
                      className="w-full pl-14 pr-12 py-3.5 bg-gray-50 rounded-2xl border border-transparent focus:border-[#4ECCA3] focus:bg-white focus:ring-4 focus:ring-[#4ECCA3]/10 outline-none transition-all font-medium text-gray-700 placeholder:text-gray-400" 
                    />
                    {searchQuery && (
                      <button onClick={() => setSearchQuery('')} className="absolute right-4 top-1/2 -translate-y-1/2 p-1.5 bg-gray-200 hover:bg-gray-300 rounded-full transition-colors">
                        <X className="w-3.5 h-3.5 text-gray-600" />
                      </button>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-3 w-full sm:w-auto">
                    <div className="relative flex-1 sm:flex-none">
                      <select 
                        value={sortBy} 
                        onChange={(e) => setSortBy(e.target.value)} 
                        className="w-full sm:w-[200px] appearance-none pl-5 pr-10 py-3.5 rounded-2xl border border-gray-100 bg-gray-50 focus:border-[#4ECCA3] focus:bg-white focus:ring-4 focus:ring-[#4ECCA3]/10 outline-none cursor-pointer font-bold text-sm text-gray-700 transition-all"
                      >
                        <option value="newest">{t('sort.newest')}</option>
                        <option value="price-asc">{t('sort.priceAsc')}</option>
                        <option value="price-desc">{t('sort.priceDesc')}</option>
                        <option value="name">{t('sort.name')}</option>
                      </select>
                      <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    </div>
                    
                    <div className="flex bg-gray-50 rounded-xl p-1.5 border border-gray-100 flex-shrink-0">
                      <button 
                        onClick={() => setViewMode('grid')} 
                        className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white text-[#4ECCA3] shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                      >
                        <Grid3X3 className="w-5 h-5" />
                      </button>
                      <button 
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
                  <h3 className="text-2xl font-bold text-gray-900 mb-3 font-heading">{t('noResults')}</h3>
                  <p className="text-gray-500 mb-8 max-w-md mx-auto text-lg">{t('noResultsDesc')}</p>
                  <button onClick={clearFilters} className="px-8 py-4 bg-[#0C211E] text-white font-bold rounded-2xl hover:bg-[#17423C] transition-colors shadow-lg shadow-[#0C211E]/20">
                    {t('filters.clear')}
                  </button>
                </motion.div>
              ) : (
                <>
                  <motion.div 
                    variants={gridVariants}
                    initial="hidden"
                    animate="visible"
                    key={`${selectedCategory}-${sortBy}-${viewMode}`}
                    className={viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-3 sm:gap-4 xl:gap-5' : 'space-y-4'}
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
                      )) : paginatedProducts.map(product => (
                        viewMode === 'grid' ? (
                          <motion.div variants={cardVariants} layout initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.3 }} key={product.id}>
                            <Link href={`/produkt/${product.slug}`} className="block group h-full">
                              <TiltCard 
                                className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-[0_20px_40px_rgba(0,0,0,0.06)] transition-all duration-500 border border-gray-100 flex flex-col h-full"
                                tiltAmount={3}
                                glowColor="rgba(78, 204, 163, 0.1)"
                              >
                                <div className="relative aspect-[4/3] overflow-hidden bg-gray-50 p-3">
                                  <div className="absolute inset-0 bg-white" />
                                  <Image
                                    src={product.images[0]}
                                    alt={product.name.de}
                                    fill
                                    className={`object-contain p-3 sm:p-4 transition-all duration-700 ease-out mix-blend-multiply ${product.images[1] ? 'group-hover:opacity-0 group-hover:scale-95' : 'group-hover:scale-110'}`}
                                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                  />
                                  {product.images[1] && (
                                    <Image
                                      src={product.images[1]}
                                      alt={`${product.name.de} Lifestyle`}
                                      fill
                                      className="object-cover absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-700 z-0"
                                    />
                                  )}
                                  
                                  <div className="absolute top-2 left-2 sm:top-3 sm:left-3 flex flex-col gap-1.5 z-10">
                                    {product.badges?.includes('premium') && <span className="px-3 py-1 bg-[#0C211E] text-white text-xs font-bold rounded-lg shadow-sm">Premium</span>}
                                    {product.badges?.includes('bestseller') && <span className="px-3 py-1 bg-[#4ECCA3] text-gray-900 text-xs font-bold rounded-lg shadow-sm">Bestseller</span>}
                                    {product.badges?.includes('new') && <span className="px-3 py-1 bg-amber-400 text-amber-950 text-xs font-bold rounded-lg shadow-sm">Neu</span>}
                                    {product.oldPrice && <span className="px-3 py-1 bg-red-500 text-white text-xs font-bold rounded-lg shadow-sm">-{Math.round((1 - product.price / product.oldPrice) * 100)}%</span>}
                                  </div>

                                  <div className="absolute top-4 right-4 flex flex-col gap-3 z-10 sm:translate-x-4 sm:opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300">
                                    <button 
                                      onClick={(e) => handleToggleWishlist(e, product)}
                                      className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-lg transition-colors border ${isInWishlist(product.id) ? 'bg-red-50 border-red-100' : 'bg-white border-gray-100 hover:bg-gray-50'}`}
                                    >
                                      <Heart className={`w-5 h-5 transition-colors ${isInWishlist(product.id) ? 'fill-red-500 text-red-500' : 'text-gray-400 hover:text-red-500'}`} />
                                    </button>
                                  </div>
                                </div>

                                <div className="p-2.5 sm:p-3 flex-1 flex flex-col bg-white">
                                  <div className="flex items-center gap-1.5 mb-1">
                                    <div className="flex text-amber-400">
                                      {[...Array(5)].map((_, i) => (<Star key={i} className={`w-3.5 h-3.5 ${i < Math.floor(product.rating) ? 'fill-amber-400' : 'fill-gray-100 text-gray-100'}`} />))}
                                    </div>
                                    <span className="text-xs font-bold text-gray-400">({product.reviewCount})</span>
                                  </div>
                                  
                                  <h3 className="font-bold text-gray-900 text-[13px] sm:text-sm mb-1 line-clamp-2 group-hover:text-[#4ECCA3] transition-colors leading-snug flex-1">
                                    {product.name.de}
                                  </h3>
                                  
                                  <div className="mt-2 pt-1.5 relative border-t border-gray-50">
                                    <div className="flex items-end gap-1.5 sm:gap-2 mb-0.5">
                                      <span className="text-sm sm:text-base font-black text-emerald-600 tabular-nums whitespace-nowrap">{formatPriceDe(product.price)}</span>
                                      {product.oldPrice && <span className="text-[11px] sm:text-xs font-semibold text-gray-400 line-through decoration-gray-300 pb-[2px] tabular-nums whitespace-nowrap">{formatPriceDe(product.oldPrice)}</span>}
                                    </div>
                                    <p className="text-[9px] sm:text-[10px] text-gray-400 block mb-1.5 sm:mb-2 font-medium leading-[1.1]">inkl. MwSt.<br className="sm:hidden" /> zzgl. <span className="underline decoration-dotted cursor-help hover:text-gray-500">Versand</span></p>
                                    
                                    <button
                                      onClick={(e) => handleAddToCart(e, product)}
                                      className="w-full py-1.5 sm:py-2 bg-gray-50 text-gray-800 border border-gray-200 text-[13px] sm:text-sm font-bold rounded-lg sm:rounded-xl group-hover:bg-[#0C211E] group-hover:text-white group-hover:border-[#0C211E] transition-all duration-300 flex items-center justify-center gap-2"
                                    >
                                      <ShoppingCart className="w-4 h-4 sm:w-[18px] sm:h-[18px]" />
                                      <span className="hidden sm:inline">In den Warenkorb</span>
                                    </button>
                                  </div>
                                </div>
                              </TiltCard>
                            </Link>
                          </motion.div>
                        ) : (
                          /* List View Item */
                          <motion.div variants={cardVariants} layout initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }} transition={{ duration: 0.3 }} key={product.id}>
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
                                    />
                                    {product.images[1] && (
                                      <Image
                                        src={product.images[1]}
                                        alt={`${product.name.de} Lifestyle`}
                                        fill
                                        className="object-cover absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-700 z-0"
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
                                    <h3 className="font-bold text-[#0C211E] text-base sm:text-2xl lg:text-3xl mb-2 sm:mb-4 group-hover:text-[#4ECCA3] transition-colors leading-tight line-clamp-2">
                                      {product.name.de}
                                    </h3>
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

                  {/* Load More Button */}
                  {displayedCount < filteredProducts.length && (
                    <div className="mt-16 flex items-center justify-center">
                      <button 
                        onClick={() => setDisplayedCount(prev => prev + ITEMS_PER_PAGE)} 
                        className="px-10 py-4 bg-white border-2 border-[#0C211E] text-[#0C211E] font-bold text-lg rounded-2xl hover:bg-[#0C211E] hover:text-white transition-colors flex items-center gap-3 group"
                      >
                        Mehr laden
                        <ArrowRight className="w-5 h-5 group-hover:translate-y-1 group-hover:translate-x-0 transition-transform rotate-90" />
                      </button>
                    </div>
                  )}
                </>
              )}
            </main>
          </div>
        </div>
      </div>
    </div>
  )
}
