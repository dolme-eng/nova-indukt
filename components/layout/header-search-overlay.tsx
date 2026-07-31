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
  inputRef: React.RefObject<HTMLInputElement | null>
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

  const handleQueryChange = useCallback(
    (q: string) => {
      onQueryChange(q)
    },
    [onQueryChange]
  )

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
      className="fixed inset-0 z-[110] flex flex-col bg-white/95 backdrop-blur-2xl"
    >
      {/* Search bar */}
      <div className="container mx-auto flex items-center justify-between border-b border-gray-100 px-4 py-6">
        <div className="relative mx-auto flex max-w-4xl flex-1 items-center">
          <Search className="absolute left-4 h-6 w-6 text-gray-400" />
          <input
            data-testid="search-input"
            ref={inputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => onQueryChange(e.target.value)}
            placeholder="Wonach suchen Sie? (z.B. Pfanne, Messer)..."
            className="w-full rounded-2xl border border-transparent bg-gray-50/50 px-14 py-5 font-heading text-xl font-bold text-gray-900 outline-none transition-all placeholder:text-gray-400 hover:bg-gray-50 focus:border-[#4ECCA3] focus:ring-4 focus:ring-[#4ECCA3]/10 md:text-2xl"
          />
          <div className="absolute right-4 flex items-center gap-2">
            {isSearching && <Loader2 className="h-5 w-5 animate-spin text-[#4ECCA3]" />}
            {searchQuery && (
              <button
                onClick={() => onQueryChange('')}
                aria-label="Suche löschen"
                className="rounded-full p-2 text-gray-400 transition-colors hover:bg-gray-200 hover:text-gray-900"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>
        </div>
        <button
          onClick={onClose}
          className="ml-4 rounded-full p-3 text-gray-500 transition-all hover:bg-gray-100 hover:text-gray-900"
        >
          <span className="sr-only">Schließen</span>
          <X className="h-8 w-8" />
        </button>
      </div>

      {/* Results */}
      <div className="container mx-auto flex-1 overflow-y-auto px-4 py-8">
        <div className="mx-auto max-w-4xl">
          {!searchQuery ? (
            <div className="grid grid-cols-2 gap-4 opacity-70 md:grid-cols-4">
              {recentSearches.length > 0 && (
                <>
                  <div className="col-span-full mb-4 flex items-center justify-between">
                    <p className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-gray-400">
                      <Clock className="h-3.5 w-3.5" /> Zuletzt gesucht
                    </p>
                    <button
                      onClick={clearAll}
                      className="flex items-center gap-1 text-xs text-gray-400 transition-colors hover:text-gray-600"
                    >
                      <Trash2 className="h-3 w-3" /> Löschen
                    </button>
                  </div>
                  {recentSearches.map((term) => (
                    <button
                      key={`recent-${term}`}
                      onClick={() => handleQueryChange(term)}
                      className="flex items-center gap-2 rounded-xl border border-gray-100 bg-gray-50 px-5 py-3 text-left text-sm font-bold text-gray-700 transition-colors hover:bg-gray-100"
                    >
                      <Clock className="h-3.5 w-3.5 text-gray-400" /> {term}
                    </button>
                  ))}
                  <div className="col-span-full mb-4 mt-4">
                    <p className="text-sm font-bold uppercase tracking-widest text-gray-400">
                      Beliebte Suchen
                    </p>
                  </div>
                </>
              )}
              {recentSearches.length === 0 && (
                <div className="col-span-full mb-4">
                  <p className="text-sm font-bold uppercase tracking-widest text-gray-400">
                    Beliebte Suchen
                  </p>
                </div>
              )}
              {POPULAR_SEARCHES.map((term) => (
                <button
                  key={term}
                  onClick={() => onQueryChange(term)}
                  className="flex items-center gap-2 rounded-xl border border-gray-100 bg-gray-50 px-5 py-3 text-left text-sm font-bold text-gray-700 transition-colors hover:bg-gray-100"
                >
                  <Search className="h-3.5 w-3.5 text-gray-400" /> {term}
                </button>
              ))}
            </div>
          ) : searchResults.length > 0 ? (
            <div data-testid="search-suggestions">
              <p className="mb-6 text-sm font-bold uppercase tracking-widest text-gray-400">
                Produkte ({searchResults.length})
              </p>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {searchResults.map((product) => (
                  <Link
                    href={`/produkt/${product.slug}`}
                    key={product.id}
                    data-testid="search-suggestion-item"
                    onClick={onClose}
                    className="group flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all hover:border-[#4ECCA3] hover:shadow-xl"
                  >
                    <div className="relative aspect-square bg-gray-50 p-4">
                      <Image
                        src={product.images[0].url}
                        alt={product.nameDe}
                        fill
                        className="object-contain p-6 mix-blend-multiply transition-transform duration-500 group-hover:scale-110"
                        sizes="(max-width: 640px) 100vw, 256px"
                      />
                    </div>
                    <div className="flex flex-1 flex-col border-t border-gray-50 p-4">
                      <h3 className="mb-2 line-clamp-2 text-sm font-bold text-gray-900 transition-colors group-hover:text-[#4ECCA3]">
                        {product.nameDe}
                      </h3>
                      <div className="mt-auto flex items-baseline gap-2 pt-2">
                        <span className="whitespace-nowrap font-black tabular-nums text-[#0C211E]">
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
                className="mt-8 inline-flex items-center gap-2 font-bold text-[#0C211E] transition-colors hover:text-[#4ECCA3]"
              >
                Alle Ergebnisse für &quot;{searchQuery}&quot; ansehen{' '}
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
          ) : (
            <div className="py-20 text-center">
              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gray-50">
                <Search className="h-8 w-8 text-gray-300" />
              </div>
              <h3 className="mb-2 font-heading text-2xl font-bold text-gray-900">
                Keine Ergebnisse gefunden
              </h3>
              <p className="text-gray-500">
                Wir konnten leider nichts für &quot;{searchQuery}&quot; finden. Bitte versuchen Sie
                einen anderen Suchbegriff.
              </p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}
