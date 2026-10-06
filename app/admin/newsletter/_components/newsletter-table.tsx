'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Mail, UserCheck, UserX, Calendar, Search, Filter } from 'lucide-react'
import { format } from 'date-fns'
import { de } from 'date-fns/locale'
import { DeleteSubscriberButton } from './delete-subscriber-button'
import { buildQueryUrl } from '@/lib/utils/pagination'

export interface SubscriberRow {
  id: string
  email: string
  firstName: string | null
  source: string | null
  isActive: boolean
  createdAt: Date | string
}

/**
 * Search and status filtering run server-side: this table used to receive every
 * subscriber in the RSC payload and filter in the browser.
 */
export default function NewsletterTable({
  subscribers,
  currentParams,
  hasFilters,
}: {
  subscribers: SubscriberRow[]
  currentParams: Record<string, string | undefined>
  hasFilters: boolean
}) {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState(currentParams.q ?? '')
  const [status, setStatus] = useState<'all' | 'active' | 'inactive'>(
    (currentParams.status as 'active' | 'inactive') ?? 'all'
  )

  function navigate(overrides: Record<string, string | number | undefined | null>) {
    router.push(
      buildQueryUrl(
        '/admin/newsletter',
        {
          ...currentParams,
          q: searchQuery.trim() || undefined,
          status: status === 'all' ? undefined : status,
        },
        overrides,
        { resetPage: true }
      )
    )
  }

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="flex flex-col gap-4 border-b border-slate-100 p-4 md:flex-row md:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <label htmlFor="newsletter-search" className="sr-only">
            Abonnenten suchen
          </label>
          <input
            id="newsletter-search"
            type="search"
            placeholder="Abonnenten suchen..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onBlur={() => navigate({})}
            onKeyDown={(e) => {
              if (e.key === 'Enter') navigate({})
            }}
            className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pl-10 pr-4 text-sm outline-none transition-all focus:ring-2 focus:ring-primary"
          />
        </div>

        <div className="flex items-center gap-2">
          <label htmlFor="newsletter-status" className="sr-only">
            Status filtern
          </label>
          <select
            id="newsletter-status"
            value={status}
            onChange={(e) => {
              const value = e.target.value as 'all' | 'active' | 'inactive'
              setStatus(value)
              navigate({ status: value === 'all' ? null : value })
            }}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-600"
          >
            <option value="all">Alle Status</option>
            <option value="active">Aktiv</option>
            <option value="inactive">Abgemeldet</option>
          </select>

          {hasFilters && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery('')
                setStatus('all')
                router.push('/admin/newsletter')
              }}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50"
            >
              <Filter size={16} />
              Zurücksetzen
            </button>
          )}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <caption className="sr-only">Newsletter-Abonnenten</caption>
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50 text-[10px] font-bold uppercase tracking-widest text-slate-500">
              <th scope="col" className="px-6 py-4">
                Abonnent
              </th>
              <th scope="col" className="px-6 py-4">
                Quelle
              </th>
              <th scope="col" className="px-6 py-4">
                Registriert am
              </th>
              <th scope="col" className="px-6 py-4">
                Status
              </th>
              <th scope="col" className="px-6 py-4 text-right">
                Aktionen
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {subscribers.map((subscriber) => (
              <tr
                key={subscriber.id}
                className="transition-colors hover:bg-slate-50/50"
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                      <Mail size={16} aria-hidden="true" />
                    </div>
                    <div className="flex min-w-0 flex-col">
                      <span className="truncate font-bold text-slate-900">{subscriber.email}</span>
                      <span className="truncate text-xs text-slate-500">
                        {subscriber.firstName || 'Unbekannt'}
                      </span>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="rounded border border-slate-200 bg-slate-100 px-2 py-0.5 text-xs font-bold uppercase tracking-tighter text-slate-600">
                    {subscriber.source || 'Direkt'}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm font-medium text-slate-600">
                  <span className="flex items-center gap-1.5">
                    <Calendar size={14} className="text-slate-400" aria-hidden="true" />
                    {format(new Date(subscriber.createdAt), 'dd MMM yyyy', { locale: de })}
                  </span>
                </td>
                <td className="px-6 py-4">
                  {subscriber.isActive ? (
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-100 bg-emerald-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-emerald-700">
                      <UserCheck size={12} aria-hidden="true" />
                      Aktiv
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                      <UserX size={12} aria-hidden="true" />
                      Abgemeldet
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <DeleteSubscriberButton subscriberId={subscriber.id} />
                  </div>
                </td>
              </tr>
            ))}
            {subscribers.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                  {hasFilters
                    ? 'Keine Abonnenten gefunden.'
                    : 'Derzeit sind keine Newsletter-Abonnenten vorhanden.'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
