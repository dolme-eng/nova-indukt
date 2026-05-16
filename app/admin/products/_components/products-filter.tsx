'use client'

import React, { useState, useEffect } from 'react'
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
    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
        <input 
          type="text" 
          placeholder="Produkt suchen (Name, SKU, EAN...)" 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-primary outline-none transition-all"
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
          className="inline-flex items-center gap-2 px-3 py-2 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors outline-none"
        >
          <option value="">Alle Kategorien</option>
          {categories.map(cat => (
            <option key={cat.id} value={cat.id}>{cat.nameDe}</option>
          ))}
        </select>
        <button className="inline-flex items-center gap-2 px-3 py-2 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors">
          <ArrowUpDown size={18} />
          <span className="hidden sm:inline">Sortieren</span>
        </button>
      </div>
    </div>
  )
}
