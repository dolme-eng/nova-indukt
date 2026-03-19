'use client'

import { useState, useMemo, useEffect } from 'react'
import Image from 'next/image'
import { Link } from '@/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { 
  Search, Star, Heart, Grid3X3, LayoutList, ShoppingCart, Check,
  SlidersHorizontal, X, ChevronDown, ArrowUpDown, Filter
} from 'lucide-react'
import { products, categories } from '@/lib/data/products'
import { useCart } from '@/lib/store/cart'

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
    setItems(prev => prev.find(i => i.id === item.id) ? prev : [...prev, item])
  }
  const removeItem = (id: string) => setItems(prev => prev.filter(i => i.id !== id))
  const isInWishlist = (id: string) => items.some(i => i.id === id)
  return { items, addItem, removeItem, isInWishlist, mounted, wishlistCount: items.length }
}

const ITEMS_PER_PAGE = 12

export function ProductsContent() {
  const t = useTranslations('products')
  const tc = useTranslations('cart')
  const tw = useTranslations('wishlist')
  const { addItem } = useCart()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000])
  const [sortBy, setSortBy] = useState('newest')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [showFilters, setShowFilters] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const { addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist, mounted } = useWishlist()

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

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE)
  const paginatedProducts = filteredProducts.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)

  useEffect(() => { setCurrentPage(1) }, [searchQuery, selectedCategory, sortBy])

  const toggleWishlist = (product: typeof products[0]) => {
    if (isInWishlist(product.id)) removeFromWishlist(product.id)
    else addToWishlist({ id: product.id, name: product.name.de, price: product.price, image: product.images[0], slug: product.slug })
  }

  const clearFilters = () => { setSearchQuery(''); setSelectedCategory(null); setPriceRange([0, 1000]); setSortBy('newest') }
  const activeFiltersCount = (searchQuery ? 1 : 0) + (selectedCategory ? 1 : 0) + (priceRange[0] > 0 || priceRange[1] < 1000 ? 1 : 0)

  return (
    <div className="min-h-screen bg-gray-50 py-6 sm:py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">{t('title')}</h1>
            <p className="text-gray-600">{filteredProducts.length} {filteredProducts.length === 1 ? t('product') : t('products')}</p>
          </div>

          <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
            <button onClick={() => setShowFilters(!showFilters)} className="lg:hidden flex items-center justify-center gap-2 py-3 bg-white rounded-xl font-medium shadow-sm">
              <Filter className="w-5 h-5" />{t('filters.title')}{activeFiltersCount > 0 && <span className="ml-2 w-6 h-6 bg-[#4ECCA3] text-white rounded-full flex items-center justify-center text-sm">{activeFiltersCount}</span>}
            </button>

            <aside className={`${showFilters ? 'block' : 'hidden'} lg:block w-full lg:w-72 flex-shrink-0`}>
              <div className="bg-white rounded-2xl shadow-sm p-6 space-y-6 sticky top-24">
                <div className="flex items-center justify-between lg:hidden">
                  <h2 className="text-lg font-semibold">{t('filters.title')}</h2>
                  <button onClick={() => setShowFilters(false)} className="p-2 hover:bg-gray-100 rounded-full"><X className="w-5 h-5" /></button>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2"><SlidersHorizontal className="w-4 h-4"/>{t('filters.categories')}</h3>
                  <div className="space-y-2">
                    <button onClick={() => setSelectedCategory(null)} className={`w-full text-left px-4 py-2.5 rounded-xl transition-colors flex items-center justify-between ${!selectedCategory ? 'bg-[#4ECCA3] text-white' : 'hover:bg-gray-50 text-gray-600'}`}>
                      {t('filters.all')} {!selectedCategory && <Check className="w-4 h-4" />}
                    </button>
                    {categories.map(cat => (
                      <button key={cat.id} onClick={() => setSelectedCategory(cat.id)} className={`w-full text-left px-4 py-2.5 rounded-xl transition-colors flex items-center justify-between ${selectedCategory === cat.id ? 'bg-[#4ECCA3] text-white' : 'hover:bg-gray-50 text-gray-600'}`}>
                        {cat.name.de} {selectedCategory === cat.id && <Check className="w-4 h-4" />}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">{t('filters.priceRange')}</h3>
                  <div className="px-2">
                    <input type="range" min="0" max="1000" value={priceRange[1]} onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])} className="w-full accent-[#4ECCA3]" />
                    <div className="flex justify-between text-sm text-gray-600 mt-2">
                      <span>{priceRange[0]}€</span><span>{priceRange[1]}€</span>
                    </div>
                  </div>
                </div>
                {activeFiltersCount > 0 && (
                  <button onClick={clearFilters} className="w-full py-2.5 text-red-600 hover:bg-red-50 rounded-xl transition-colors font-medium flex items-center justify-center gap-2">
                    <X className="w-4 h-4" />{t('filters.clear')}
                  </button>
                )}
              </div>
            </aside>

            <main className="flex-1">
              <div className="bg-white rounded-2xl shadow-sm p-4 mb-6">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder={t('search.placeholder')} className="w-full pl-12 pr-4 py-3 rounded-xl border focus:border-[#4ECCA3] focus:ring-2 focus:ring-[#4ECCA3]/20 outline-none transition-all" />
                    {searchQuery && <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full"><X className="w-4 h-4 text-gray-400" /></button>}
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="appearance-none pl-4 pr-10 py-3 rounded-xl border bg-white focus:border-[#4ECCA3] focus:ring-2 focus:ring-[#4ECCA3]/20 outline-none cursor-pointer">
                        <option value="newest">{t('sort.newest')}</option>
                        <option value="price-asc">{t('sort.priceAsc')}</option>
                        <option value="price-desc">{t('sort.priceDesc')}</option>
                        <option value="name">{t('sort.name')}</option>
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    </div>
                    <div className="flex bg-gray-100 rounded-xl p-1">
                      <button onClick={() => setViewMode('grid')} className={`p-2.5 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white text-[#4ECCA3] shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}><Grid3X3 className="w-5 h-5" /></button>
                      <button onClick={() => setViewMode('list')} className={`p-2.5 rounded-lg transition-all ${viewMode === 'list' ? 'bg-white text-[#4ECCA3] shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}><LayoutList className="w-5 h-5" /></button>
                    </div>
                  </div>
                </div>
              </div>

              {filteredProducts.length === 0 ? (
                <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
                  <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4"><Search className="w-10 h-10 text-gray-400" /></div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('noResults')}</h3>
                  <p className="text-gray-600 mb-4">{t('noResultsDesc')}</p>
                  <button onClick={clearFilters} className="text-[#4ECCA3] font-medium hover:underline">{t('filters.clear')}</button>
                </div>
              ) : (
                <>
                  <div className={viewMode === 'grid' ? 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4' : 'space-y-3'}>
                    {paginatedProducts.map(product => (
                      <motion.div layout key={product.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className={`bg-white rounded-2xl shadow-sm overflow-hidden group hover:shadow-lg transition-all ${viewMode === 'list' ? 'flex' : ''}`}>
                        <div className={`relative bg-gray-100 overflow-hidden ${viewMode === 'list' ? 'w-24 sm:w-32 md:w-40 h-24 sm:h-32 md:h-40 flex-shrink-0' : 'aspect-square'}`}>
                          <Link href={`/produkt/${product.slug}`}>
                            <Image src={product.images[0]} alt={product.name.de} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" />
                          </Link>
                          {product.oldPrice && <span className="absolute top-2 left-2 px-2 py-0.5 bg-red-500 text-white text-xs font-bold rounded-full">-{Math.round((1 - product.price / product.oldPrice) * 100)}%</span>}
                          <button onClick={() => toggleWishlist(product)} className={`absolute top-2 right-2 w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center transition-all shadow-sm ${isInWishlist(product.id) ? 'bg-red-500 text-white' : 'bg-white/90 text-gray-400 hover:text-red-500'}`}>
                            <Heart className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isInWishlist(product.id) ? 'fill-current' : ''}`} />
                          </button>
                        </div>
                        <div className={`p-2 sm:p-3 flex flex-col ${viewMode === 'list' ? 'flex-1 justify-between' : ''}`}>
                          <div className={`flex items-start justify-between gap-1 ${viewMode === 'list' ? 'mb-1' : ''}`}>
                            <Link href={`/produkt/${product.slug}`} className="font-semibold text-gray-900 hover:text-[#4ECCA3] transition-colors line-clamp-1 text-xs sm:text-sm leading-tight">{product.name.de}</Link>
                          </div>
                          {viewMode === 'list' && (
                            <p className="text-gray-600 text-xs mb-2 line-clamp-2 max-w-md">{product.shortDescription.de}</p>
                          )}
                          <div className="flex items-center gap-0.5 mt-1">
                            <Star className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-yellow-400 text-yellow-400" />
                            <span className="text-xs font-medium">{product.rating}</span>
                            <span className="text-gray-400 text-xs">({product.reviewCount})</span>
                          </div>
                          <div className="flex items-center justify-end mt-1 pt-1 border-t border-gray-100">
                            <button onClick={() => addItem(product, 1)} className="flex-shrink-0 w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center bg-[#4ECCA3] text-white rounded-sm hover:bg-[#3dAB8F] transition-colors">
                              <ShoppingCart className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {totalPages > 1 && (
                    <div className="mt-8 flex items-center justify-center gap-2">
                      <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="p-2 rounded-lg border disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"><ArrowUpDown className="w-5 h-5 rotate-90" /></button>
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                        <button key={page} onClick={() => setCurrentPage(page)} className={`w-10 h-10 rounded-lg font-medium transition-colors ${currentPage === page ? 'bg-[#4ECCA3] text-white' : 'border hover:bg-gray-50'}`}>{page}</button>
                      ))}
                      <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="p-2 rounded-lg border disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"><ArrowUpDown className="w-5 h-5 -rotate-90" /></button>
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
