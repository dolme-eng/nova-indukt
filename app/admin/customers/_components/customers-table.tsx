'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import {
  Search,
  Mail,
  Calendar,
  ChevronRight,
  MoreVertical,
  ShieldCheck,
  UserCheck,
  Filter,
  ArrowUpDown,
  MailCheck,
  MailX,
} from 'lucide-react'
import { format } from 'date-fns'
import { de } from 'date-fns/locale'

interface Customer {
  id: string
  name: string | null
  email: string
  image: string | null
  role: string
  emailVerified: Date | null
  createdAt: Date
  orders: { id: string; total: unknown; createdAt: Date }[]
  _count: { orders: number }
}

type SortKey = 'date' | 'spent-desc' | 'spent-asc' | 'orders-desc' | 'orders-asc'

export default function CustomersTable({ initialCustomers }: { initialCustomers: Customer[] }) {
  const [searchQuery, setSearchQuery] = useState('')
  const [roleFilter, setRoleFilter] = useState<'all' | 'ADMIN' | 'USER'>('all')
  const [sortKey, setSortKey] = useState<SortKey>('date')

  const sortOptions: SortKey[] = ['date', 'spent-desc', 'spent-asc', 'orders-desc', 'orders-asc']
  const sortLabels: Record<SortKey, string> = {
    date: 'Registriert',
    'spent-desc': 'Ausgaben ↓',
    'spent-asc': 'Ausgaben ↑',
    'orders-desc': 'Bestellungen ↓',
    'orders-asc': 'Bestellungen ↑',
  }

  const filteredCustomers = useMemo(() => {
    const result = initialCustomers.filter((c) => {
      const matchesSearch =
        !searchQuery ||
        c.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.email.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesRole = roleFilter === 'all' || c.role === roleFilter
      return matchesSearch && matchesRole
    })

    result.sort((a, b) => {
      const aSpent = a.orders.reduce((sum, o) => sum + Number(o.total), 0)
      const bSpent = b.orders.reduce((sum, o) => sum + Number(o.total), 0)
      switch (sortKey) {
        case 'spent-desc':
          return bSpent - aSpent
        case 'spent-asc':
          return aSpent - bSpent
        case 'orders-desc':
          return b._count.orders - a._count.orders
        case 'orders-asc':
          return a._count.orders - b._count.orders
        case 'date':
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      }
    })

    return result
  }, [initialCustomers, searchQuery, roleFilter, sortKey])

  const cycleRole = () => {
    setRoleFilter(roleFilter === 'all' ? 'ADMIN' : roleFilter === 'ADMIN' ? 'USER' : 'all')
  }

  const cycleSort = () => {
    const idx = sortOptions.indexOf(sortKey)
    setSortKey(sortOptions[(idx + 1) % sortOptions.length])
  }

  return (
    <>
      {/* Filters & Search */}
      <div className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm md:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Suchen nach Name, E-Mail..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pl-10 pr-4 text-sm outline-none transition-all focus:ring-2 focus:ring-primary"
          />
        </div>
        <div className="flex gap-2">
          <button
            onClick={cycleRole}
            className={`inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${
              roleFilter !== 'all'
                ? 'border-blue-200 bg-blue-50 text-blue-700'
                : 'border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Filter size={18} />
            Rolle{roleFilter !== 'all' ? `: ${roleFilter === 'ADMIN' ? 'Admin' : 'Kunde'}` : ''}
          </button>
          <button
            onClick={cycleSort}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50"
          >
            <ArrowUpDown size={18} />
            {sortLabels[sortKey]}
          </button>
        </div>
      </div>

      {/* Customers Table */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-[10px] font-bold uppercase tracking-widest text-slate-500">
                <th className="px-6 py-4">Kunde</th>
                <th className="px-6 py-4">E-Mail Status</th>
                <th className="px-6 py-4">Rolle</th>
                <th className="px-6 py-4">Registriert am</th>
                <th className="px-6 py-4 text-center">Bestellungen</th>
                <th className="px-6 py-4">Gesamtausgaben</th>
                <th className="px-6 py-4 text-right">Aktionen</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredCustomers.map((customer) => {
                const totalSpent = customer.orders.reduce(
                  (sum, order) => sum + Number(order.total),
                  0
                )

                return (
                  <tr key={customer.id} className="group transition-colors hover:bg-slate-50/50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-white bg-slate-100 font-bold text-slate-600 shadow-sm ring-1 ring-slate-100">
                          {customer.image ? (
                            /* eslint-disable-next-line @next/next/no-img-element */
                            <img
                              src={customer.image}
                              alt={customer.name || ''}
                              className="h-full w-full rounded-full object-cover"
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
                            <Mail size={12} />
                            {customer.email}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {customer.emailVerified ? (
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-100 bg-emerald-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-tighter text-emerald-700">
                          <MailCheck size={12} />
                          Verifiziert
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-tighter text-slate-400">
                          <MailX size={12} />
                          Nicht verifiziert
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {customer.role === 'ADMIN' ? (
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-purple-100 bg-purple-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-tighter text-purple-700">
                          <ShieldCheck size={12} />
                          Administrator
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-100 bg-blue-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-tighter text-blue-700">
                          <UserCheck size={12} />
                          Kunde
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      <div className="flex items-center gap-1.5">
                        <Calendar size={14} className="text-slate-400" />
                        {format(new Date(customer.createdAt), 'dd MMM yyyy', { locale: de })}
                      </div>
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
                          {totalSpent.toFixed(2)} €
                        </span>
                        {customer._count.orders > 0 && (
                          <span className="text-[10px] font-bold text-slate-400">
                            Durchschn. {(totalSpent / customer._count.orders).toFixed(2)} €
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/customers/${customer.id}`}
                          className="rounded-lg p-2 text-slate-400 transition-all hover:bg-slate-100 hover:text-primary"
                          title="Kundenakte"
                        >
                          <ChevronRight size={18} />
                        </Link>
                        <button className="rounded-lg p-2 text-slate-400 transition-all hover:bg-slate-100 hover:text-slate-900">
                          <MoreVertical size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
              {filteredCustomers.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-slate-500">
                    {searchQuery || roleFilter !== 'all'
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
