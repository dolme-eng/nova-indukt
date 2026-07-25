'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Search, X, Loader2, ArrowRight, Clock, Trash2 } from 'lucide-react'
import { formatPriceDe } from '@/lib/utils/vat'

interface SearchResult {
  id: string
  nameDe: string
  slug: string
  price: number
  images: { url: string }[]
}

interface SearchOverlayProps {
  searchQuery: string
  onQueryChange: (q: string) => void
  onClose: () => void
  searchResults: SearchResult[]
  isSearching: boolean
  inputRef: React.RefObject<HTMLInputElement>
}

const POPULAR_SEARCHES = ['Induktionstopf', 'Bratpfanne', 'Messer aus Japan', 'Dampfgarer']
const RECENT_SEARCHES_KEY = 'nova-recent-searches'
const MAX_RECENT = 6

function getRecentSearches(): string[] {
  if (typeof window === 'undefined') return []
  try {
    return JSON.parse(localStorage.getItem(RECENT_SEARCHES_KEY) || '[]')
  } catch {
    return []
  }
}

function addRecentSearch(term: string) {
  const trimmed = term.trim()
  if (!trimmed || trimmed.length < 2) return
  const existing = getRecentSearches().filter((s) => s.toLowerCase() !== trimmed.toLowerCase())
  const updated = [trimmed, ...existing].slice(0, MAX_RECENT)
  localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated))
}

function clearRecentSearches() {
  localStorage.removeItem(RECENT_SEARCHES_KEY)
}

export function SearchOverlay({
  searchQuery,
  onQueryChange,
  onClose,
  searchResults,
  isSearching,
  inputRef,
}: SearchOverlayProps) {
  const [recentSearches, setRecentSearches] = useState<string[]>([])

  useEffect(() => {
    setRecentSearches(getRecentSearches())
  }, [])

  const handleQueryChange = useCallback((q: string) => {
    onQueryChange(q)
  }, [onQueryChange])

  useEffect(() => {
    if (searchQuery && searchQuery.length >= 2) {
      const timer = setTimeout(() => addRecentSearch(searchQuery), 800)
      return () => clearTimeout(timer)
    }
  }, [searchQuery])

  const clearAll = useCallback(() => {
    clearRecentSearches()
    setRecentSearches([])
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[110] bg-white/95 backdrop-blur-2xl flex flex-col"
    >
      {/* Search bar */}
      <div className="container mx-auto px-4 py-6 border-b border-gray-100 flex items-center justify-between">
        <div className="flex-1 max-w-4xl mx-auto relative flex items-center">
          <Search className="w-6 h-6 text-gray-400 absolute left-4" />
          <input
            data-testid="search-input"
            ref={inputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => onQueryChange(e.target.value)}
            placeholder="Wonach suchen Sie? (z.B. Pfanne, Messer)..."
            className="w-full bg-gray-50/50 hover:bg-gray-50 text-gray-900 placeholder:text-gray-400 px-14 py-5 rounded-2xl text-xl md:text-2xl font-bold font-heading outline-none border border-transparent focus:border-[#4ECCA3] focus:ring-4 focus:ring-[#4ECCA3]/10 transition-all"
          />
          <div className="absolute right-4 flex items-center gap-2">
            {isSearching && <Loader2 className="w-5 h-5 text-[#4ECCA3] animate-spin" />}
            {searchQuery && (
              <button
                onClick={() => onQueryChange('')}
                aria-label="Suche löschen"
                className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-200 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
        <button
          onClick={onClose}
          className="ml-4 p-3 hover:bg-gray-100 rounded-full text-gray-500 hover:text-gray-900 transition-all"
        >
          <span className="sr-only">Schließen</span>
          <X className="w-8 h-8" />
        </button>
      </div>

      {/* Results */}
      <div className="flex-1 overflow-y-auto container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {!searchQuery ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 opacity-70">
              {recentSearches.length > 0 && (
                <>
                  <div className="col-span-full mb-4 flex items-center justify-between">
                    <p className="text-sm font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5" /> Zuletzt gesucht
                    </p>
                    <button
                      onClick={clearAll}
                      className="text-xs text-gray-400 hover:text-gray-600 flex items-center gap-1 transition-colors"
                    >
                      <Trash2 className="w-3 h-3" /> Löschen
                    </button>
                  </div>
                  {recentSearches.map((term) => (
                    <button
                      key={`recent-${term}`}
                      onClick={() => handleQueryChange(term)}
                      className="px-5 py-3 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-xl font-bold text-sm text-left transition-colors border border-gray-100 flex items-center gap-2"
                    >
                      <Clock className="w-3.5 h-3.5 text-gray-400" /> {term}
                    </button>
                  ))}
                  <div className="col-span-full mt-4 mb-4">
                    <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Beliebte Suchen</p>
                  </div>
                </>
              )}
              {recentSearches.length === 0 && (
                <div className="col-span-full mb-4">
                  <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Beliebte Suchen</p>
                </div>
              )}
              {POPULAR_SEARCHES.map((term) => (
                <button
                  key={term}
                  onClick={() => onQueryChange(term)}
                  className="px-5 py-3 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-xl font-bold text-sm text-left transition-colors border border-gray-100 flex items-center gap-2"
                >
                  <Search className="w-3.5 h-3.5 text-gray-400" /> {term}
                </button>
              ))}
            </div>
          ) : searchResults.length > 0 ? (
            <div data-testid="search-suggestions">
              <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-6">
                Produkte ({searchResults.length})
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {searchResults.map((product) => (
                  <Link
                    href={`/produkt/${product.slug}`}
                    key={product.id}
                    data-testid="search-suggestion-item"
                    onClick={onClose}
                    className="group bg-white rounded-2xl border border-gray-100 hover:border-[#4ECCA3] shadow-sm hover:shadow-xl transition-all overflow-hidden flex flex-col"
                  >
                    <div className="aspect-square relative bg-gray-50 p-4">
                      <Image
                        src={product.images[0].url}
                        alt={product.nameDe}
                        fill
                        className="object-contain p-6 mix-blend-multiply group-hover:scale-110 transition-transform duration-500"
                        sizes="(max-width: 640px) 100vw, 256px"
                      />
                    </div>
                    <div className="p-4 flex flex-col flex-1 border-t border-gray-50">
                      <h3 className="font-bold text-gray-900 text-sm mb-2 line-clamp-2 group-hover:text-[#4ECCA3] transition-colors">
                        {product.nameDe}
                      </h3>
                      <div className="mt-auto pt-2 flex items-baseline gap-2">
                        <span className="font-black text-[#0C211E] tabular-nums whitespace-nowrap">
                          {formatPriceDe(product.price)}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
              <Link
                href="/produkte"
                onClick={onClose}
                className="mt-8 inline-flex items-center gap-2 font-bold text-[#0C211E] hover:text-[#4ECCA3] transition-colors"
              >
                Alle Ergebnisse für &quot;{searchQuery}&quot; ansehen <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="w-8 h-8 text-gray-300" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2 font-heading">Keine Ergebnisse gefunden</h3>
              <p className="text-gray-500">
                Wir konnten leider nichts für &quot;{searchQuery}&quot; finden. Bitte versuchen Sie einen anderen Suchbegriff.
              </p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}
