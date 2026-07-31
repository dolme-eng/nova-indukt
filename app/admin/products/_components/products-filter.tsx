'use client'

import { useState, useEffect } from 'react'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { Search, ArrowUpDown, X } from 'lucide-react'
import { useDebounce } from '@/lib/hooks/use-debounce'

interface Category {
  id: string
  nameDe: string
}

export function ProductsFilter({ categories }: { categories: Category[] }) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [search, setSearch] = useState(searchParams.get('q') || '')
  const [category, setCategory] = useState(searchParams.get('category') || '')
  const debouncedSearch = useDebounce(search, 400)

  useEffect(() => {
    const params = new URLSearchParams(searchParams)
    if (debouncedSearch) params.set('q', debouncedSearch)
    else params.delete('q')

    if (category) params.set('category', category)
    else params.delete('category')

    router.push(`${pathname}?${params.toString()}`)
  }, [debouncedSearch, category, pathname, router, searchParams])

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm md:flex-row">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
        <input
          type="text"
          placeholder="Produkt suchen (Name, SKU, EAN...)"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pl-10 pr-4 text-sm outline-none transition-all focus:ring-2 focus:ring-primary"
        />
        {search && (
          <button
            onClick={() => setSearch('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
          >
            <X size={14} />
          </button>
        )}
      </div>
      <div className="flex gap-2">
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 outline-none transition-colors hover:bg-slate-50"
        >
          <option value="">Alle Kategorien</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.nameDe}
            </option>
          ))}
        </select>
        <button className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50">
          <ArrowUpDown size={18} />
          <span className="hidden sm:inline">Sortieren</span>
        </button>
      </div>
    </div>
  )
}
