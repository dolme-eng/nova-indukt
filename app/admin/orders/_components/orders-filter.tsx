'use client'

import { useState, useEffect } from 'react'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { Search, Calendar, X } from 'lucide-react'
import { useDebounce } from '@/lib/hooks/use-debounce'

export function OrdersFilter() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [search, setSearch] = useState(searchParams.get('q') || '')
  const [status, setStatus] = useState(searchParams.get('status') || '')
  const [dateFrom, setDateFrom] = useState(searchParams.get('dateFrom') || '')
  const [dateTo, setDateTo] = useState(searchParams.get('dateTo') || '')
  const [showDateFilter, setShowDateFilter] = useState(false)
  const debouncedSearch = useDebounce(search, 400)

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams(searchParams)
    params.delete('page')

    if (debouncedSearch) params.set('q', debouncedSearch)
    else params.delete('q')

    if (status) params.set('status', status)
    else params.delete('status')

    if (dateFrom) params.set('dateFrom', dateFrom)
    else params.delete('dateFrom')

    if (dateTo) params.set('dateTo', dateTo)
    else params.delete('dateTo')

    router.push(`${pathname}?${params.toString()}`)
  }, [debouncedSearch, status, dateFrom, dateTo, pathname, router, searchParams])

  const hasActiveDateFilter = dateFrom || dateTo

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm md:flex-row">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
        <input
          type="text"
          placeholder="Suchen (Kunde, Bestellnummer, E-Mail...)"
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
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 outline-none transition-colors hover:bg-slate-50"
        >
          <option value="">Alle Status</option>
          <option value="PENDING">Ausstehend</option>
          <option value="PROCESSING">Bearbeitung</option>
          <option value="SHIPPED">Versandt</option>
          <option value="DELIVERED">Zugestellt</option>
          <option value="CANCELLED">Storniert</option>
          <option value="REFUNDED">Erstattet</option>
        </select>
        <div className="relative">
          <button
            onClick={() => setShowDateFilter(!showDateFilter)}
            className={`inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${
              hasActiveDateFilter
                ? 'border-primary bg-primary/5 text-primary'
                : 'border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Calendar size={18} />
            <span className="hidden sm:inline">Datum</span>
          </button>
          {showDateFilter && (
            <div className="absolute right-0 top-full z-10 mt-1 w-64 rounded-lg border border-slate-200 bg-white p-3 shadow-lg">
              <div className="space-y-2">
                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-500">Von</label>
                  <input
                    type="date"
                    value={dateFrom}
                    onChange={(e) => setDateFrom(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-500">Bis</label>
                  <input
                    type="date"
                    value={dateTo}
                    onChange={(e) => setDateTo(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                {hasActiveDateFilter && (
                  <button
                    onClick={() => {
                      setDateFrom('')
                      setDateTo('')
                    }}
                    className="w-full rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-600 transition-colors hover:bg-slate-200"
                  >
                    Filter zurücksetzen
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
