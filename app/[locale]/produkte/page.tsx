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

  return { items, addItem, removeItem, isInWishlist, mounted }
}

type SortOption = 'featured' | 'price-asc' | 'price-desc' | 'rating' | 'newest'

interface ProductsContentProps {
  locale: string
}

function ProductsContent({ locale }: ProductsContentProps) {
  const t = useTranslations()
  const [searchQuery, setSearchQuery] = useState('')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [sortBy, setSortBy] = useState<SortOption>('featured')
  const [showMobileFilters, setShowMobileFilters] = useState(false)
  const { addItem: addToCart } = useCart()
  const { addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist } = useWishlist()
  const [addedToCart, setAddedToCart] = useState<string[]>([])

  const filteredProducts = useMemo(() => {
    let filtered = products.filter(product => {
      const matchesSearch = searchQuery === '' || 
        product.name[locale as 'de' | 'en' | 'fr'].toLowerCase().includes(searchQuery.toLowerCase())
      const matchesCategory = selectedCategory === null || product.category === selectedCategory
      return matchesSearch && matchesCategory
    })

    switch (sortBy) {
      case 'price-asc':
        filtered = [...filtered].sort((a, b) => a.price - b.price)
        break
      case 'price-desc':
        filtered = [...filtered].sort((a, b) => b.price - a.price)
        break
      case 'rating':
        filtered = [...filtered].sort((a, b) => b.rating - a.rating)
        break
      case 'newest':
        filtered = [...filtered].sort((a, b) => (b.badges?.includes('new') ? 1 : 0) - (a.badges?.includes('new') ? 1 : 0))
        break
      default:
        break
    }

    return filtered
  }, [searchQuery, selectedCategory, sortBy, locale])

  const handleAddToCart = (product: typeof products[0]) => {
    addToCart(product, 1)
    setAddedToCart(prev => [...prev, product.id])
    setTimeout(() => {
      setAddedToCart(prev => prev.filter(id => id !== product.id))
    }, 2000)
  }

  const handleWishlistToggle = (product: typeof products[0]) => {
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id)
    } else {
      addToWishlist({
        id: product.id,
        name: product.name[locale as 'de' | 'en' | 'fr'],
        price: product.price,
        image: product.images[0],
        slug: product.slug
      })
    }
  }

  const clearFilters = () => {
    setSearchQuery('')
    setSelectedCategory(null)
    setSortBy('featured')
  }

  const hasActiveFilters = searchQuery || selectedCategory || sortBy !== 'featured'

  const sortOptions: { value: SortOption; label: string }[] = [
    { value: 'featured', label: t('sort.featured') || 'Featured' },
    { value: 'price-asc', label: t('sort.priceAsc') || 'Price: Low to High' },
    { value: 'price-desc', label: t('sort.priceDesc') || 'Price: High to Low' },
    { value: 'rating', label: t('sort.rating') || 'Highest Rated' },
    { value: 'newest', label: t('sort.newest') || 'Newest' },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumbs */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-3">
          <nav className="flex items-center gap-2 text-sm">
            <Link href="/" className="text-gray-500 hover:text-gray-900 transition-colors">
              {t('nav.home')}
            </Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-900 font-medium">{t('products.title')}</span>
          </nav>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 sm:py-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">{t('products.title')}</h1>
          <p className="text-gray-600 text-sm sm:text-base">
            {filteredProducts.length} {filteredProducts.length === 1 ? t('products.product') : t('products.products')}
          </p>
        </div>

        {/* Filters & Controls */}
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-200 p-3 sm:p-4 mb-4 sm:mb-6">
          <div className="flex flex-col lg:flex-row gap-3 sm:gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('products.search')}
                className="w-full pl-10 sm:pl-12 pr-4 py-2.5 sm:py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#4ECCA3] focus:bg-white transition-all text-sm sm:text-base"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Controls Row */}
            <div className="flex items-center gap-2 sm:gap-3">
              <button
                onClick={() => setShowMobileFilters(true)}
                className="lg:hidden flex items-center gap-2 px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors text-sm font-medium"
              >
                <Filter className="w-4 h-4" />
                <span className="hidden sm:inline">{t('filters.title') || 'Filters'}</span>
                {(selectedCategory || sortBy !== 'featured') && (
                  <span className="w-2 h-2 bg-[#4ECCA3] rounded-full" />
                )}
              </button>

              <div className="hidden lg:block relative">
                <select
                  value={selectedCategory || ''}
                  onChange={(e) => setSelectedCategory(e.target.value || null)}
                  className="appearance-none px-4 py-3 pr-10 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#4ECCA3] text-sm font-medium cursor-pointer hover:bg-gray-100 transition-colors"
                >
                  <option value="">{t('categories.all')}</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.name[locale as 'de' | 'en' | 'fr']}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>

              <div className="hidden lg:block relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className="appearance-none px-4 py-3 pr-10 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#4ECCA3] text-sm font-medium cursor-pointer hover:bg-gray-100 transition-colors"
                >
                  {sortOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
                <ArrowUpDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>

              <div className="flex items-center bg-gray-100 rounded-xl p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-[#4ECCA3] text-white shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}
                >
                  <Grid3X3 className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-[#4ECCA3] text-white shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}
                >
                  <LayoutList className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </div>
            </div>
          </div>

          <AnimatePresence>
            {hasActiveFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="flex flex-wrap items-center gap-2 pt-3 mt-3 border-t border-gray-100">
                  <span className="text-xs sm:text-sm text-gray-500">{t('filters.active') || 'Active:'}</span>
                  {searchQuery && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-gray-100 rounded-full text-xs sm:text-sm">
                      {t('search.title')}: &quot;{searchQuery}&quot;
                      <button onClick={() => setSearchQuery('')} className="p-0.5 hover:text-red-500">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}
                  {selectedCategory && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-gray-100 rounded-full text-xs sm:text-sm">
                      {categories.find(c => c.id === selectedCategory)?.name[locale as 'de' | 'en' | 'fr']}
                      <button onClick={() => setSelectedCategory(null)} className="p-0.5 hover:text-red-500">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}
                  {sortBy !== 'featured' && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-gray-100 rounded-full text-xs sm:text-sm">
                      {sortOptions.find(o => o.value === sortBy)?.label}
                      <button onClick={() => setSortBy('featured')} className="p-0.5 hover:text-red-500">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}
                  <button
                    onClick={clearFilters}
                    className="text-xs sm:text-sm text-[#4ECCA3] hover:text-[#3BA88A] font-medium ml-auto"
                  >
                    {t('filters.clear') || 'Clear all'}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Products Grid */}
        <div className={viewMode === 'grid' 
          ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6' 
          : 'space-y-3 sm:space-y-4'
        }>
          {filteredProducts.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.03 }}
              className={`group bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow ${
                viewMode === 'list' ? 'flex flex-col sm:flex-row' : ''
              }`}
            >
              <Link 
                href={`/produkt/${product.slug}`} 
                className={`relative block overflow-hidden ${
                  viewMode === 'list' 
                    ? 'w-full sm:w-48 lg:w-56 h-48 sm:h-auto flex-shrink-0' 
                    : 'aspect-square'
                }`}
              >
                <Image
                  src={product.images[0]}
                  alt={product.name[locale as 'de' | 'en' | 'fr']}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes={viewMode === 'list' ? '(max-width: 640px) 100vw, 200px' : '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw'}
                />
                
                <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                  {product.badges?.includes('premium') && (
                    <span className="px-2.5 py-1 bg-[#4ECCA3] text-white text-[10px] sm:text-xs font-bold rounded-full shadow-sm">
                      Premium
                    </span>
                  )}
                  {product.badges?.includes('bestseller') && (
                    <span className="px-2.5 py-1 bg-gray-900 text-white text-[10px] sm:text-xs font-bold rounded-full shadow-sm">
                      Bestseller
                    </span>
                  )}
                  {product.badges?.includes('new') && (
                    <span className="px-2.5 py-1 bg-amber-400 text-gray-900 text-[10px] sm:text-xs font-bold rounded-full shadow-sm">
                      New
                    </span>
                  )}
                </div>

                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 sm:gap-3">
                  <button
                    onClick={(e) => { e.preventDefault(); handleWishlistToggle(product); }}
                    className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center transition-transform hover:scale-110 ${
                      isInWishlist(product.id) 
                        ? 'bg-red-500 text-white' 
                        : 'bg-white text-gray-900'
                    }`}
                  >
                    <Heart className={`w-4 h-4 sm:w-5 sm:h-5 ${isInWishlist(product.id) ? 'fill-white' : ''}`} />
                  </button>
                </div>
              </Link>

              <div className="p-3 sm:p-4 flex-1 flex flex-col">
                <div className="flex items-center gap-1 mb-2">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3 h-3 sm:w-3.5 sm:h-3.5 ${i < Math.floor(product.rating) ? 'text-amber-400 fill-amber-400' : 'text-gray-200'}`}
                      />
                    ))}
                  </div>
                  <span className="text-xs text-gray-500">({product.reviewCount})</span>
                </div>

                <Link href={`/produkt/${product.slug}`}>
                  <h3 className="font-semibold text-gray-900 mb-1 sm:mb-2 line-clamp-2 group-hover:text-[#4ECCA3] transition-colors text-sm sm:text-base">
                    {product.name[locale as 'de' | 'en' | 'fr']}
                  </h3>
                </Link>

                {viewMode === 'list' && (
                  <p className="text-gray-600 text-sm line-clamp-2 mb-3 hidden sm:block">
                    {product.shortDescription[locale as 'de' | 'en' | 'fr']}
                  </p>
                )}

                <div className="mt-auto flex items-center justify-between gap-2">
                  <div className="flex items-baseline gap-1.5 sm:gap-2">
                    <span className="text-lg sm:text-xl font-bold text-gray-900">{product.price} €</span>
                    {product.oldPrice && (
                      <span className="text-xs sm:text-sm text-gray-400 line-through">{product.oldPrice} €</span>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <button
                      onClick={() => handleWishlistToggle(product)}
                      className={`lg:hidden w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center transition-colors ${
                        isInWishlist(product.id) 
                          ? 'bg-red-100 text-red-500' 
                          : 'bg-gray-100 hover:bg-gray-200'
                      }`}
                    >
                      <Heart className={`w-4 h-4 sm:w-4.5 sm:h-4.5 ${isInWishlist(product.id) ? 'fill-red-500' : ''}`} />
                    </button>

                    <button
                      onClick={() => handleAddToCart(product)}
                      disabled={addedToCart.includes(product.id)}
                      className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl font-medium text-sm transition-all ${
                        addedToCart.includes(product.id)
                          ? 'bg-green-500 text-white'
                          : 'bg-[#4ECCA3] text-white hover:bg-[#3BA88A] active:scale-95'
                      }`}
                    >
                      {addedToCart.includes(product.id) ? (
                        <>
                          <Check className="w-4 h-4 sm:w-5 sm:h-5" />
                          <span className="hidden sm:inline">{t('cart.added') || 'Added'}</span>
                        </>
                      ) : (
                        <>
                          <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5" />
                          <span className="hidden sm:inline">{t('cart.add') || 'Add'}</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Empty State */}
        {filteredProducts.length === 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12 sm:py-20"
          >
            <div className="w-16 h-16 sm:w-24 sm:h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
              <Search className="w-8 h-8 sm:w-12 sm:h-12 text-gray-400" />
            </div>
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">{t('products.noResults')}</h3>
            <p className="text-gray-600 mb-4 sm:mb-6 text-sm sm:text-base max-w-md mx-auto">{t('products.tryDifferent')}</p>
            <button
              onClick={clearFilters}
              className="px-5 sm:px-6 py-2.5 sm:py-3 bg-[#4ECCA3] text-white font-medium rounded-xl hover:bg-[#3BA88A] transition-colors text-sm sm:text-base"
            >
              {t('filters.clear') || 'Clear all filters'}
            </button>
          </motion.div>
        )}
      </div>

      {/* Mobile Filter Drawer */}
      <AnimatePresence>
        {showMobileFilters && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 lg:hidden"
          >
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => setShowMobileFilters(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="absolute top-0 right-0 bottom-0 w-full max-w-sm bg-white shadow-2xl flex flex-col"
            >
              <div className="flex items-center justify-between p-4 border-b">
                <span className="font-semibold text-gray-900 text-lg">{t('filters.title') || 'Filters'}</span>
                <button
                  onClick={() => setShowMobileFilters(false)}
                  className="p-2 text-gray-500 hover:text-gray-900 transition-colors rounded-full hover:bg-gray-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">{t('categories.title') || 'Category'}</h3>
                  <div className="space-y-2">
                    <button
                      onClick={() => setSelectedCategory(null)}
                      className={`w-full text-left px-4 py-3 rounded-xl transition-colors ${
                        selectedCategory === null 
                          ? 'bg-[#4ECCA3]/10 text-[#4ECCA3] font-medium' 
                          : 'hover:bg-gray-100'
                      }`}
                    >
                      {t('categories.all')}
                    </button>
                    {categories.map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => setSelectedCategory(cat.id)}
                        className={`w-full text-left px-4 py-3 rounded-xl transition-colors ${
                          selectedCategory === cat.id 
                            ? 'bg-[#4ECCA3]/10 text-[#4ECCA3] font-medium' 
                            : 'hover:bg-gray-100'
                        }`}
                      >
                        {cat.name[locale as 'de' | 'en' | 'fr']}
                        <span className="ml-2 text-gray-400 text-sm">({cat.count})</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">{t('sort.title') || 'Sort by'}</h3>
                  <div className="space-y-2">
                    {sortOptions.map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => setSortBy(opt.value)}
                        className={`w-full text-left px-4 py-3 rounded-xl transition-colors ${
                          sortBy === opt.value 
                            ? 'bg-[#4ECCA3]/10 text-[#4ECCA3] font-medium' 
                            : 'hover:bg-gray-100'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-4 border-t space-y-3">
                <button
                  onClick={() => setShowMobileFilters(false)}
                  className="w-full py-3 bg-[#4ECCA3] text-white font-semibold rounded-xl hover:bg-[#3BA88A] transition-colors"
                >
                  {t('filters.showResults') || 'Show'} {filteredProducts.length} {t('products.products')}
                </button>
                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="w-full py-3 bg-gray-100 text-gray-700 font-medium rounded-xl hover:bg-gray-200 transition-colors"
                  >
                    {t('filters.clear') || 'Clear all'}
                  </button>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function ProductsPage({ params }: { params: { locale: string } }) {
  return <ProductsContent locale={params.locale} />
}
