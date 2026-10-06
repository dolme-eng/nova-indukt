'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { formatPriceDe } from '@/lib/utils/vat'
import { useDebounce } from '@/lib/hooks/use-debounce'
import {
  Search,
  Mail,
  Calendar,
  ChevronRight,
  ShieldCheck,
  UserCheck,
  Filter,
  ArrowUpDown,
  MailCheck,
  MailX,
} from 'lucide-react'
import { format } from 'date-fns'
import { de } from 'date-fns/locale'
import { buildQueryUrl } from '@/lib/utils/pagination'

export interface CustomerRow {
  id: string
  name: string | null
  email: string
  image: string | null
  role: string
  emailVerified: Date | string | null
  createdAt: Date | string
  orders: { total: unknown }[]
  _count: { orders: number }
}

type SortKey = 'date' | 'oldest' | 'name-asc' | 'name-desc' | 'spent-desc' | 'spent-asc' | 'orders-desc' | 'orders-asc'

const SORT_OPTIONS: Array<{ value: SortKey; label: string }> = [
  { value: 'date', label: 'Registriert ↓' },
  { value: 'oldest', label: 'Registriert ↑' },
  { value: 'name-asc', label: 'Name A–Z' },
  { value: 'name-desc', label: 'Name Z–A' },
  { value: 'spent-desc', label: 'Ausgaben ↓' },
  { value: 'spent-asc', label: 'Ausgaben ↑' },
  { value: 'orders-desc', label: 'Bestellungen ↓' },
  { value: 'orders-asc', label: 'Bestellungen ↑' },
]

/**
 * Filtering, sorting and paging are server-side: the previous version loaded
 * every user with all of their orders into the browser and filtered there,
 * which did not scale past a few hundred accounts.
 */
export default function CustomersTable({
  customers,
  currentParams,
  page,
  totalPages,
  totalCount,
}: {
  customers: CustomerRow[]
  currentParams: Record<string, string | undefined>
  page: number
  totalPages: number
  totalCount: number
}) {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState(currentParams.q ?? '')
  const [roleFilter, setRoleFilter] = useState<'all' | 'ADMIN' | 'USER'>(
    (currentParams.role as 'ADMIN' | 'USER') ?? 'all'
  )
  const [sortKey, setSortKey] = useState<SortKey>((currentParams.sort as SortKey) ?? 'date')
  const debouncedSearch = useDebounce(searchQuery, 400)

  function navigate(overrides: Record<string, string | number | undefined | null>) {
    router.push(
      buildQueryUrl(
        '/admin/customers',
        {
          ...currentParams,
          q: debouncedSearch || undefined,
          role: roleFilter === 'all' ? undefined : roleFilter,
          sort: sortKey === 'date' ? undefined : sortKey,
        },
        overrides,
        // Any filter change invalidates the current offset.
        { resetPage: true }
      )
    )
  }

  const isFiltered = Boolean(debouncedSearch) || roleFilter !== 'all' || sortKey !== 'date'

  return (
    <>
      <div className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm md:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <label htmlFor="customer-search" className="sr-only">
            Kunden nach Name oder E-Mail durchsuchen
          </label>
          <input
            id="customer-search"
            type="search"
            placeholder="Suchen nach Name, E-Mail..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onBlur={() => navigate({})}
            onKeyDown={(e) => {
              if (e.key === 'Enter') navigate({})
            }}
            className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pl-10 pr-4 text-sm outline-none transition-all focus:ring-2 focus:ring-primary"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <label htmlFor="customer-role" className="sr-only">
            Rolle filtern
          </label>
          <select
            id="customer-role"
            value={roleFilter}
            onChange={(e) => {
              setRoleFilter(e.target.value as 'all' | 'ADMIN' | 'USER')
              navigate({ role: e.target.value === 'all' ? null : e.target.value })
            }}
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-600"
          >
            <option value="all">Alle Rollen</option>
            <option value="ADMIN">Administrator</option>
            <option value="USER">Kunde</option>
          </select>

          <label htmlFor="customer-sort" className="sr-only">
            Sortierung
          </label>
          <div className="relative">
            <ArrowUpDown
              size={16}
              aria-hidden="true"
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <select
              id="customer-sort"
              value={sortKey}
              onChange={(e) => {
                const value = e.target.value as SortKey
                setSortKey(value)
                navigate({ sort: value === 'date' ? null : value })
              }}
              className="rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm font-medium text-slate-600"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {isFiltered && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery('')
                setRoleFilter('all')
                setSortKey('date')
                router.push('/admin/customers')
              }}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50"
            >
              <Filter size={16} />
              Zurücksetzen
            </button>
          )}
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <caption className="sr-only">
              Kundenliste, Seite {page} von {totalPages} ({totalCount} Einträge)
            </caption>
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-[10px] font-bold uppercase tracking-widest text-slate-500">
                <th scope="col" className="px-6 py-4">
                  Kunde
                </th>
                <th scope="col" className="px-6 py-4">
                  E-Mail Status
                </th>
                <th scope="col" className="px-6 py-4">
                  Rolle
                </th>
                <th scope="col" className="px-6 py-4">
                  Registriert am
                </th>
                <th scope="col" className="px-6 py-4 text-center">
                  Bestellungen
                </th>
                <th scope="col" className="px-6 py-4">
                  Gesamtausgaben
                </th>
                <th scope="col" className="px-6 py-4 text-right">
                  Aktionen
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {customers.map((customer) => {
                const totalSpent = customer.orders.reduce(
                  (sum, order) => sum + Number(order.total),
                  0
                )

                return (
                  <tr
                    key={customer.id}
                    className="transition-colors hover:bg-slate-50/50"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-white bg-slate-100 font-bold text-slate-600 shadow-sm ring-1 ring-slate-100">
                          {customer.image ? (
                            /* eslint-disable-next-line @next/next/no-img-element */
                            <img
                              src={customer.image}
                              alt=""
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            (customer.name?.charAt(0) || customer.email.charAt(0)).toUpperCase()
                          )}
                        </div>
                        <div className="flex min-w-0 flex-col">
                          <span className="truncate font-bold text-slate-900">
                            {customer.name || 'Namenloser Benutzer'}
                          </span>
                          <span className="flex items-center gap-1 truncate text-xs text-slate-500">
                            <Mail size={12} aria-hidden="true" />
                            {customer.email}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {customer.emailVerified ? (
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-100 bg-emerald-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-tighter text-emerald-700">
                          <MailCheck size={12} aria-hidden="true" />
                          Verifiziert
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-tighter text-slate-400">
                          <MailX size={12} aria-hidden="true" />
                          Nicht verifiziert
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {customer.role === 'ADMIN' ? (
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-purple-100 bg-purple-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-tighter text-purple-700">
                          <ShieldCheck size={12} aria-hidden="true" />
                          Administrator
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-100 bg-blue-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-tighter text-blue-700">
                          <UserCheck size={12} aria-hidden="true" />
                          Kunde
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      <span className="flex items-center gap-1.5">
                        <Calendar size={14} className="text-slate-400" aria-hidden="true" />
                        {format(new Date(customer.createdAt), 'dd MMM yyyy', { locale: de })}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex flex-col items-center">
                        <span className="text-sm font-bold text-slate-900">
                          {customer._count.orders}
                        </span>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                          Käufe
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-emerald-600">
                          {formatPriceDe(totalSpent)}
                        </span>
                        {customer._count.orders > 0 && (
                          <span className="text-[10px] font-bold text-slate-400">
                            Durchschn. {formatPriceDe(totalSpent / customer._count.orders)}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link
                        href={`/admin/customers/${customer.id}`}
                        aria-label={`Kundenakte von ${customer.name || customer.email} öffnen`}
                        className="inline-flex rounded-lg p-2 text-slate-400 transition-all hover:bg-slate-100 hover:text-primary"
                      >
                        <ChevronRight size={18} />
                      </Link>
                    </td>
                  </tr>
                )
              })}
              {customers.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-slate-500">
                    {isFiltered
                      ? 'Keine Kunden gefunden.'
                      : 'Derzeit sind keine Kunden registriert.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}
