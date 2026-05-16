'use client'

import React, { useState, useEffect } from 'react'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { Search, Calendar, X } from 'lucide-react'
import { useDebounce } from '@/lib/hooks/use-debounce'

export function OrdersFilter() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [search, setSearch] = useState(searchParams.get('q') || '')
  const [status, setStatus] = useState(searchParams.get('status') || '')
  const debouncedSearch = useDebounce(search, 400)
  
  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams(searchParams)
    if (debouncedSearch) params.set('q', debouncedSearch)
    else params.delete('q')
    
    if (status) params.set('status', status)
    else params.delete('status')
    
    router.push(`${pathname}?${params.toString()}`)
  }, [debouncedSearch, status, pathname, router, searchParams])

  return (
    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
        <input 
          type="text" 
          placeholder="Suchen (Kunde, Bestellnummer, E-Mail...)" 
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
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="inline-flex items-center gap-2 px-3 py-2 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors outline-none"
        >
          <option value="">Alle Status</option>
          <option value="PENDING">Ausstehend</option>
          <option value="PROCESSING">Bearbeitung</option>
          <option value="SHIPPED">Versandt</option>
          <option value="DELIVERED">Zugestellt</option>
          <option value="CANCELLED">Storniert</option>
        </select>
        <button className="inline-flex items-center gap-2 px-3 py-2 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors">
          <Calendar size={18} />
          <span className="hidden sm:inline">Datum</span>
        </button>
      </div>
    </div>
  )
}
