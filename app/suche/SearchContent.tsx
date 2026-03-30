'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { useDeTranslations } from '@/lib/i18n/useDeTranslations'
import { 
  Search, X, SlidersHorizontal, Grid3X3, List,
  ChevronRight, ShoppingCart, Heart, Star, Filter
} from 'lucide-react'
import { products, Product, categories } from '@/lib/data/products'
import { formatPriceDe } from '@/lib/utils/vat'
import { useCart } from '@/lib/store/cart'

export default function SearchContent() {
  const t = useDeTranslations()
  const searchParams = useSearchParams()
  const initialQuery = searchParams.get('q') || ''
  
  const [searchQuery, setSearchQuery] = useState(initialQuery)
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000])
  const [sortBy, setSortBy] = useState('relevance')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [showFilters, setShowFilters] = useState(false)

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let result = products.filter(product => {
      const matchesSearch = searchQuery === '' || 
        product.name.de.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.de.toLowerCase().includes(searchQuery.toLowerCase())
      
      const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory
      const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1]
      
      return matchesSearch && matchesCategory && matchesPrice
    })

    // Sort
    switch (sortBy) {
      case 'price-asc':
        result.sort((a, b) => a.price - b.price)
        break
      case 'price-desc':
        result.sort((a, b) => b.price - a.price)
        break
      case 'rating':
        result.sort((a, b) => b.rating - a.rating)
        break
      default:
        // relevance - no sorting
        break
    }

    return result
  }, [searchQuery, selectedCategory, priceRange, sortBy])

  const getLocalizedName = (item: { name: { de: string; en: string; fr: string } }) => {
    return item.name.de
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Search Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('products.search.placeholder')}
                className="w-full pl-12 pr-4 py-3 bg-gray-100 border border-gray-200 rounded-xl focus:outline-none focus:border-[#4ECCA3] transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2"
                >
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              )}
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden flex items-center gap-2 px-4 py-3 bg-gray-100 rounded-xl"
            >
              <Filter className="w-5 h-5" />
              <span>{t('filter')}</span>
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <aside className={`lg:w-64 flex-shrink-0 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <div className="bg-white rounded-2xl p-6 shadow-sm sticky top-24">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-semibold text-gray-900 flex items-center gap-2">
                  <SlidersHorizontal className="w-5 h-5" />
                  {t('filter')}
                </h2>
                <button
                  onClick={() => {
                    setSelectedCategory('all')
                    setPriceRange([0, 1000])
                  }}
                  className="text-sm text-[#4ECCA3] hover:underline"
                >
                  {t('reset')}
                </button>
              </div>

              {/* Categories */}
              <div className="mb-6">
                <h3 className="font-medium text-gray-900 mb-3">{t('categories.title')}</h3>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="category"
                      value="all"
                      checked={selectedCategory === 'all'}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="w-4 h-4 text-[#4ECCA3]"
                    />
                    <span className="text-gray-600">{t('categories.all')}</span>
                  </label>
                  {categories.map((cat) => (
                    <label key={cat.id} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="category"
                        value={cat.id}
                        checked={selectedCategory === cat.id}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="w-4 h-4 text-[#4ECCA3]"
                      />
                      <span className="text-gray-600">{cat.name.de}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div>
                <h3 className="font-medium text-gray-900 mb-3">{t('priceRange')}</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={priceRange[0]}
                      onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                      className="w-20 px-3 py-2 bg-gray-100 rounded-lg text-sm"
                    />
                    <span className="text-gray-400">-</span>
                    <input
                      type="number"
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                      className="w-20 px-3 py-2 bg-gray-100 rounded-lg text-sm"
                    />
                    <span className="text-gray-400">€</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1000"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                    className="w-full"
                  />
                </div>
              </div>
            </div>
          </aside>

          {/* Results */}
          <div className="flex-1">
            {/* Sort & View Options */}
            <div className="flex items-center justify-between mb-6">
              <p className="text-gray-600">
                {filteredProducts.length} {filteredProducts.length === 1 ? t('results.single') : t('results.multiple')}
                {searchQuery && ` für "${searchQuery}"`}
              </p>
              <div className="flex items-center gap-4">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#4ECCA3]"
                >
                  <option value="relevance">{t('sort.relevance')}</option>
                  <option value="price-asc">{t('sort.priceAsc')}</option>
                  <option value="price-desc">{t('sort.priceDesc')}</option>
                  <option value="rating">{t('sort.rating')}</option>
                </select>
                <div className="hidden sm:flex items-center gap-1 bg-white rounded-xl p-1 border border-gray-200">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-[#4ECCA3] text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                  >
                    <Grid3X3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-[#4ECCA3] text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Products Grid */}
            {filteredProducts.length > 0 ? (
              <div className={viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
                {filteredProducts.map((product, index) => (
                  <ProductCard 
                    key={product.id} 
                    product={product} 
                    viewMode={viewMode}
                    index={index}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('noResults.title')}</h3>
                <p className="text-gray-600">{t('noResults.description')}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// Product Card Component
function ProductCard({ 
  product, 
  viewMode, 
  index 
}: { 
  product: Product
  viewMode: 'grid' | 'list'
  index: number
}) {
  const { addItem } = useCart()

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    addItem(product, 1)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className={`group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow border border-gray-100 ${
        viewMode === 'list' ? 'flex flex-row' : 'flex flex-col'
      }`}
    >
      <Link href={`/produkt/${product.slug}`} className={viewMode === 'list' ? 'flex flex-row w-full items-stretch' : 'block'}>
        <div className={`relative bg-gray-50 flex-shrink-0 ${viewMode === 'list' ? 'w-2/5 sm:w-48' : 'aspect-square'}`}>
          <Image
            src={product.images[0]}
            alt={product.name.de}
            fill
            className="object-contain p-4 group-hover:scale-105 transition-transform duration-500 mix-blend-multiply"
          />
          {product.badges?.includes('premium') && (
            <span className="absolute top-2 left-2 sm:top-3 sm:left-3 px-2 py-0.5 sm:py-1 bg-[#4ECCA3] text-white text-[9px] sm:text-xs font-bold rounded-md sm:rounded-full">
              Premium
            </span>
          )}
        </div>
        <div className={`p-4 flex-1 flex flex-col ${viewMode === 'list' ? 'justify-center' : ''}`}>
          {viewMode === 'grid' && (
            <div className="flex items-center gap-1 mb-2">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-3.5 h-3.5 ${i < Math.floor(product.rating) ? 'text-amber-400 fill-amber-400' : 'text-gray-300'}`}
                />
              ))}
              <span className="text-xs text-gray-500 ml-1">({product.reviewCount})</span>
            </div>
          )}
          <h3 className={`font-bold text-gray-900 ${viewMode === 'list' ? 'text-sm sm:text-xl leading-tight' : 'text-[13px] sm:text-base leading-snug'} mb-2 line-clamp-2 group-hover:text-[#4ECCA3] transition-colors flex-1`}>
            {product.name.de}
          </h3>
          
          <div className="mt-auto pt-3 sm:pt-4 relative border-t border-gray-50">
            <div className={`flex items-end gap-1.5 sm:gap-2 mb-1 ${viewMode === 'list' ? 'sm:mb-2' : ''}`}>
              <span className="text-base sm:text-lg font-bold text-emerald-600 tabular-nums whitespace-nowrap">{formatPriceDe(product.price)}</span>
              {product.oldPrice && (
                <span className="text-[11px] sm:text-xs font-semibold text-gray-400 line-through decoration-gray-300 pb-[2px] tabular-nums whitespace-nowrap">{formatPriceDe(product.oldPrice)}</span>
              )}
            </div>
            {viewMode === 'grid' && (
              <p className="text-[9px] sm:text-[10px] text-gray-400 block mb-3 sm:mb-4 leading-[1.1]">inkl. MwSt.<br className="sm:hidden" /> zzgl. Versand</p>
            )}
            
            <button
              onClick={handleAddToCart}
              className={`w-full py-2.5 sm:py-3.5 bg-gray-50 text-gray-800 border border-gray-200 text-[13px] sm:text-sm font-bold rounded-[0.85rem] sm:rounded-xl group-hover:bg-[#0C211E] group-hover:text-white group-hover:border-[#0C211E] transition-all duration-300 flex items-center justify-center gap-2 shadow-sm ${viewMode === 'list' ? 'mt-3 sm:mt-1' : ''}`}
            >
              <ShoppingCart className="w-4 h-4 sm:w-[18px] sm:h-[18px]" />
              <span className="hidden sm:inline">In den Warenkorb</span>
            </button>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

