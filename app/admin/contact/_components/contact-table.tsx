'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import {
  Search,
  Mail,
  Clock,
  CheckCircle2,
  Trash2,
  AlertTriangle,
  MessageSquare,
} from 'lucide-react'
import { buildQueryUrl } from '@/lib/utils/pagination'

export interface ContactMessageRow {
  id: string
  name: string
  email: string
  subject: string
  message: string
  status: string
  createdAt: Date | string
}

/**
 * Search and status filtering run server-side. This table used to receive every
 * contact message in the RSC payload and filter it in the browser, and to
 * recompute the per-status counters from that same full array — so the counts
 * shown in the tabs were page-dependent.
 */
export default function ContactTable({
  messages: initialMessages,
  currentParams,
  statusCounts,
}: {
  messages: ContactMessageRow[]
  currentParams: Record<string, string | undefined>
  statusCounts: Record<string, number>
}) {
  const router = useRouter()
  const [search, setSearch] = useState(currentParams.q ?? '')
  const [statusFilter, setStatusFilter] = useState<string>(currentParams.status ?? 'all')
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [messages, setMessages] = useState(initialMessages)

  function navigate(overrides: Record<string, string | number | undefined | null>) {
    router.push(
      buildQueryUrl(
        '/admin/contact',
        {
          ...currentParams,
          q: search.trim() || undefined,
          status: statusFilter === 'all' ? undefined : statusFilter,
        },
        overrides,
        { resetPage: true }
      )
    )
  }

  const hasFilters = Boolean(currentParams.q) || statusFilter !== 'all'

  async function updateStatus(id: string, status: string) {
    try {
      const res = await fetch(`/api/admin/contact/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data?.error || 'Status konnte nicht aktualisiert werden')
      }
      setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, status } : m)))
      // Recompute the counters server-side so the tab labels stay truthful.
      router.refresh()
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : 'Fehler beim Aktualisieren des Status')
    }
  }

  async function deleteMessage(id: string) {
    if (!confirm('Nachricht wirklich löschen?')) return
    try {
      const res = await fetch(`/api/admin/contact/${id}`, { method: 'DELETE' })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data?.error || 'Nachricht konnte nicht gelöscht werden')
      }
      setMessages((prev) => prev.filter((m) => m.id !== id))
      router.refresh()
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : 'Fehler beim Löschen')
    }
  }

  const statusStyle = (status: string) => {
    switch (status) {
      case 'NEW':
        return 'bg-blue-50 text-blue-700 border border-blue-100'
      case 'IN_PROGRESS':
        return 'bg-amber-50 text-amber-700 border border-amber-100'
      case 'RESOLVED':
        return 'bg-emerald-50 text-emerald-700 border border-emerald-100'
      case 'SPAM':
        return 'bg-red-50 text-red-700 border border-red-100'
      default:
        return 'bg-slate-50 text-slate-700 border border-slate-100'
    }
  }

  const statusLabel = (status: string) => {
    switch (status) {
      case 'NEW':
        return 'Neu'
      case 'IN_PROGRESS':
        return 'In Bearbeitung'
      case 'RESOLVED':
        return 'Erledigt'
      case 'SPAM':
        return 'Spam'
      default:
        return status
    }
  }

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="flex flex-col gap-3 border-b border-slate-100 p-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <label htmlFor="contact-search" className="sr-only">
            Nachrichten durchsuchen
          </label>
          <input
            id="contact-search"
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onBlur={() => navigate({})}
            onKeyDown={(e) => {
              if (e.key === 'Enter') navigate({})
            }}
            placeholder="Name, E-Mail oder Betreff suchen..."
            className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pl-10 pr-4 text-sm focus:border-transparent focus:ring-2 focus:ring-nova-400"
          />
        </div>

        <div className="flex flex-wrap gap-1" role="group" aria-label="Nachricht filtern">
          {(['all', 'NEW', 'IN_PROGRESS', 'RESOLVED', 'SPAM'] as const).map((s) => (
            <button
              key={s}
              type="button"
              aria-pressed={statusFilter === s}
              onClick={() => {
                setStatusFilter(s)
                navigate({ status: s === 'all' ? null : s })
              }}
              className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-colors ${
                statusFilter === s
                  ? 'bg-nova-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {s === 'all'
                ? `Alle (${statusCounts.all ?? 0})`
                : `${statusLabel(s)} (${statusCounts[s] ?? 0})`}
            </button>
          ))}
          {hasFilters && (
            <button
              type="button"
              onClick={() => {
                setSearch('')
                setStatusFilter('all')
                router.push('/admin/contact')
              }}
              className="rounded-lg px-3 py-1.5 text-xs font-bold text-slate-500 underline hover:text-slate-700"
            >
              Zurücksetzen
            </button>
          )}
        </div>
      </div>

      <div className="divide-y divide-slate-100">
        {messages.length === 0 ? (
          <div className="p-12 text-center">
            <MessageSquare className="mx-auto mb-3 text-slate-300" size={40} aria-hidden="true" />
            <p className="font-medium text-slate-500">
              {hasFilters ? 'Keine Nachrichten gefunden' : 'Noch keine Nachrichten'}
            </p>
          </div>
        ) : (
          messages.map((msg) => (
            <div key={msg.id} className="p-4 transition-colors hover:bg-slate-50/50">
              <div className="flex items-start justify-between gap-4">
                <button
                  type="button"
                  onClick={() => setExpandedId(expandedId === msg.id ? null : msg.id)}
                  aria-expanded={expandedId === msg.id}
                  className="min-w-0 flex-1 text-left"
                >
                  <div className="mb-1 flex items-center gap-2">
                    <span
                      className={`rounded px-2 py-0.5 text-[10px] font-bold ${statusStyle(msg.status)}`}
                    >
                      {statusLabel(msg.status)}
                    </span>
                    <span className="truncate text-sm font-bold text-slate-900">
                      {msg.subject}
                    </span>
                  </div>
                  <span className="block text-xs text-slate-500">
                    <span className="font-semibold">{msg.name}</span>{' '}
                    &lt;{msg.email}&gt; ·{' '}
                    {new Date(msg.createdAt).toLocaleDateString('de-DE', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </button>
                <a
                  href={`mailto:${msg.email}?subject=Re: ${encodeURIComponent(msg.subject)}`}
                  aria-label={`Auf ${msg.subject} antworten`}
                  className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-blue-50 hover:text-blue-600"
                >
                  <Mail size={16} aria-hidden="true" />
                </a>
              </div>

              {expandedId === msg.id && (
                <div className="mt-3 rounded-lg bg-slate-50 p-4">
                  <p className="whitespace-pre-wrap text-sm text-slate-700">{msg.message}</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {msg.status !== 'IN_PROGRESS' && (
                      <button
                        type="button"
                        onClick={() => updateStatus(msg.id, 'IN_PROGRESS')}
                        className="flex items-center gap-1 rounded-lg bg-amber-50 px-3 py-1.5 text-xs font-bold text-amber-700 transition-colors hover:bg-amber-100"
                      >
                        <Clock size={12} aria-hidden="true" /> In Bearbeitung
                      </button>
                    )}
                    {msg.status !== 'RESOLVED' && (
                      <button
                        type="button"
                        onClick={() => updateStatus(msg.id, 'RESOLVED')}
                        className="flex items-center gap-1 rounded-lg bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700 transition-colors hover:bg-emerald-100"
                      >
                        <CheckCircle2 size={12} aria-hidden="true" /> Erledigt
                      </button>
                    )}
                    {msg.status !== 'SPAM' && (
                      <button
                        type="button"
                        onClick={() => updateStatus(msg.id, 'SPAM')}
                        className="flex items-center gap-1 rounded-lg bg-red-50 px-3 py-1.5 text-xs font-bold text-red-700 transition-colors hover:bg-red-100"
                      >
                        <AlertTriangle size={12} aria-hidden="true" /> Spam
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => deleteMessage(msg.id)}
                      className="ml-auto flex items-center gap-1 rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-600 transition-colors hover:bg-red-50 hover:text-red-600"
                    >
                      <Trash2 size={12} aria-hidden="true" /> Löschen
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}
