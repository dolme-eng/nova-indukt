'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  Search,
  X,
  SlidersHorizontal,
  Grid3X3,
  List,
  ShoppingCart,
  Star,
  Filter,
} from 'lucide-react'
import { Product, Category } from '@/lib/data/products'
import { formatPriceDe } from '@/lib/utils/vat'
import { useCart } from '@/lib/store/cart'

export interface SearchContentProps {
  initialProducts: Product[]
  initialCategories: Category[]
}

export default function SearchContent({ initialProducts, initialCategories }: SearchContentProps) {
  const searchParams = useSearchParams()
  const initialQuery = searchParams.get('q') || ''

  // Calculate max price from products
  const maxPrice = useMemo(() => {
    if (initialProducts.length === 0) return 1000
    return Math.ceil(Math.max(...initialProducts.map((p) => p.price)) / 100) * 100
  }, [initialProducts])

  const [searchQuery, setSearchQuery] = useState(initialQuery)
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [priceRange, setPriceRange] = useState<[number, number]>([0, maxPrice])
  const [sortBy, setSortBy] = useState('relevance')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [showFilters, setShowFilters] = useState(false)

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    const result = initialProducts.filter((product) => {
      const matchesSearch =
        searchQuery === '' ||
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, selectedCategory, priceRange, sortBy])

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Search Header */}
      <div className="sticky top-0 z-30 border-b border-gray-200 bg-white">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Produkte suchen..."
                className="w-full rounded-xl border border-gray-200 bg-gray-100 py-3 pl-12 pr-4 transition-colors focus:border-[#4ECCA3] focus:outline-none"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2"
                >
                  <X className="h-5 w-5 text-gray-400" />
                </button>
              )}
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 rounded-xl bg-gray-100 px-4 py-3 lg:hidden"
            >
              <Filter className="h-5 w-5" />
              <span>Filter</span>
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col gap-8 lg:flex-row">
          {/* Filters Sidebar */}
          <aside className={`flex-shrink-0 lg:w-64 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <div className="sticky top-24 rounded-2xl bg-white p-6 shadow-sm">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="flex items-center gap-2 font-semibold text-gray-900">
                  <SlidersHorizontal className="h-5 w-5" />
                  Filter
                </h2>
                <button
                  onClick={() => {
                    setSelectedCategory('all')
                    setPriceRange([0, maxPrice])
                  }}
                  className="text-sm text-[#4ECCA3] hover:underline"
                >
                  Zurücksetzen
                </button>
              </div>

              {/* Categories */}
              <div className="mb-6">
                <h3 className="mb-3 font-medium text-gray-900">Kategorien</h3>
                <div className="space-y-2">
                  <label className="flex cursor-pointer items-center gap-2">
                    <input
                      type="radio"
                      name="category"
                      value="all"
                      checked={selectedCategory === 'all'}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="h-4 w-4 text-[#4ECCA3]"
                    />
                    <span className="text-gray-600">Alle</span>
                  </label>
                  {initialCategories.map((cat) => (
                    <label key={cat.id} className="flex cursor-pointer items-center gap-2">
                      <input
                        type="radio"
                        name="category"
                        value={cat.id}
                        checked={selectedCategory === cat.id}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="h-4 w-4 text-[#4ECCA3]"
                      />
                      <span className="text-gray-600">{cat.name.de}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div>
                <h3 className="mb-3 font-medium text-gray-900">Preisbereich</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={priceRange[0]}
                      onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                      className="w-20 rounded-lg bg-gray-100 px-3 py-2 text-sm"
                    />
                    <span className="text-gray-400">-</span>
                    <input
                      type="number"
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                      className="w-20 rounded-lg bg-gray-100 px-3 py-2 text-sm"
                    />
                    <span className="text-gray-400">€</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max={maxPrice}
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
            <div className="mb-6 flex items-center justify-between">
              <p className="text-gray-600">
                {filteredProducts.length}{' '}
                {filteredProducts.length === 1 ? 'Ergebnis' : 'Ergebnisse'}
                {searchQuery && ` für "${searchQuery}"`}
              </p>
              <div className="flex items-center gap-4">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm focus:border-[#4ECCA3] focus:outline-none"
                >
                  <option value="relevance">Relevanz</option>
                  <option value="price-asc">Preis: Aufsteigend</option>
                  <option value="price-desc">Preis: Absteigend</option>
                  <option value="rating">Beste Bewertungen</option>
                </select>
                <div className="hidden items-center gap-1 rounded-xl border border-gray-200 bg-white p-1 sm:flex">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`rounded-lg p-2 transition-colors ${viewMode === 'grid' ? 'bg-[#4ECCA3] text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                  >
                    <Grid3X3 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`rounded-lg p-2 transition-colors ${viewMode === 'list' ? 'bg-[#4ECCA3] text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                  >
                    <List className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Products Grid */}
            {filteredProducts.length > 0 ? (
              <div
                className={
                  viewMode === 'grid'
                    ? 'grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3'
                    : 'space-y-4'
                }
              >
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
              <div className="py-12 text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
                  <Search className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-gray-900">
                  Keine Ergebnisse gefunden
                </h3>
                <p className="text-gray-600">
                  Versuche es mit anderen Filtern oder einem anderen Suchbegriff.
                </p>
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
  index,
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
      className={`group overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-shadow hover:shadow-lg ${
        viewMode === 'list' ? 'flex flex-row' : 'flex flex-col'
      }`}
    >
      <Link
        href={`/produkt/${product.slug}`}
        className={viewMode === 'list' ? 'flex w-full flex-row items-stretch' : 'block'}
      >
        <div
          className={`relative flex-shrink-0 bg-gray-50 ${viewMode === 'list' ? 'w-2/5 sm:w-48' : 'aspect-square'}`}
        >
          <Image
            src={product.images[0]}
            alt={product.name.de}
            fill
            className="object-contain p-4 mix-blend-multiply transition-transform duration-500 group-hover:scale-105"
          />
          {product.badges?.includes('premium') && (
            <span className="absolute left-2 top-2 rounded-md bg-[#4ECCA3] px-2 py-0.5 text-[9px] font-bold text-white sm:left-3 sm:top-3 sm:rounded-full sm:py-1 sm:text-xs">
              Premium
            </span>
          )}
        </div>
        <div className={`flex flex-1 flex-col p-4 ${viewMode === 'list' ? 'justify-center' : ''}`}>
          {viewMode === 'grid' && (
            <div className="mb-2 flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-3.5 w-3.5 ${i < Math.floor(product.rating) ? 'fill-amber-400 text-amber-400' : 'text-gray-300'}`}
                />
              ))}
              <span className="ml-1 text-xs text-gray-500">({product.reviewCount})</span>
            </div>
          )}
          <h3
            className={`font-bold text-gray-900 ${viewMode === 'list' ? 'text-sm leading-tight sm:text-xl' : 'text-[13px] leading-snug sm:text-base'} mb-2 line-clamp-2 flex-1 transition-colors group-hover:text-[#4ECCA3]`}
          >
            {product.name.de}
          </h3>

          <div className="relative mt-auto border-t border-gray-50 pt-3 sm:pt-4">
            <div
              className={`mb-1 flex items-end gap-1.5 sm:gap-2 ${viewMode === 'list' ? 'sm:mb-2' : ''}`}
            >
              <span className="whitespace-nowrap text-base font-bold tabular-nums text-emerald-600 sm:text-lg">
                {formatPriceDe(product.price)}
              </span>
              {product.oldPrice && (
                <span className="whitespace-nowrap pb-[2px] text-[11px] font-semibold tabular-nums text-gray-400 line-through decoration-gray-300 sm:text-xs">
                  {formatPriceDe(product.oldPrice)}
                </span>
              )}
            </div>
            {viewMode === 'grid' && (
              <p className="mb-3 block text-[9px] leading-[1.1] text-gray-400 sm:mb-4 sm:text-[10px]">
                inkl. MwSt.
                <br className="sm:hidden" /> zzgl. Versand
              </p>
            )}

            <button
              onClick={handleAddToCart}
              className={`flex w-full items-center justify-center gap-2 rounded-[0.85rem] border border-gray-200 bg-gray-50 py-2.5 text-[13px] font-bold text-gray-800 shadow-sm transition-all duration-300 group-hover:border-[#0C211E] group-hover:bg-[#0C211E] group-hover:text-white sm:rounded-xl sm:py-3.5 sm:text-sm ${viewMode === 'list' ? 'mt-3 sm:mt-1' : ''}`}
            >
              <ShoppingCart className="h-4 w-4 sm:h-[18px] sm:w-[18px]" />
              <span className="hidden sm:inline">In den Warenkorb</span>
            </button>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
