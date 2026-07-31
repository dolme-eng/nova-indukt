'use client'

import { useState, useMemo } from 'react'
import { Mail, UserCheck, UserX, Calendar, Search } from 'lucide-react'
import { format } from 'date-fns'
import { de } from 'date-fns/locale'
import { DeleteSubscriberButton } from './delete-subscriber-button'

interface Subscriber {
  id: string
  email: string
  firstName: string | null
  lastName: string | null
  source: string | null
  isActive: boolean
  createdAt: Date
}

export default function NewsletterTable({
  initialSubscribers,
}: {
  initialSubscribers: Subscriber[]
}) {
  const [searchQuery, setSearchQuery] = useState('')

  const filteredSubscribers = useMemo(() => {
    if (!searchQuery) return initialSubscribers
    const q = searchQuery.toLowerCase()
    return initialSubscribers.filter(
      (s) =>
        s.email.toLowerCase().includes(q) ||
        s.firstName?.toLowerCase().includes(q) ||
        s.lastName?.toLowerCase().includes(q) ||
        s.source?.toLowerCase().includes(q)
    )
  }, [initialSubscribers, searchQuery])

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="flex flex-col gap-4 border-b border-slate-100 p-4 md:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Abonnenten suchen..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pl-10 pr-4 text-sm outline-none transition-all focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50 text-[10px] font-bold uppercase tracking-widest text-slate-500">
              <th className="px-6 py-4">Abonnent</th>
              <th className="px-6 py-4">Quelle</th>
              <th className="px-6 py-4">Registriert am</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Aktionen</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredSubscribers.map((subscriber) => (
              <tr key={subscriber.id} className="group transition-colors hover:bg-slate-50/50">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                      <Mail size={16} />
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
                  <div className="flex items-center gap-1.5">
                    <Calendar size={14} className="text-slate-400" />
                    {format(new Date(subscriber.createdAt), 'dd MMM yyyy', { locale: de })}
                  </div>
                </td>
                <td className="px-6 py-4">
                  {subscriber.isActive ? (
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-100 bg-emerald-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-emerald-700">
                      <UserCheck size={12} />
                      Aktiv
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                      <UserX size={12} />
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
            {filteredSubscribers.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                  {searchQuery
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
