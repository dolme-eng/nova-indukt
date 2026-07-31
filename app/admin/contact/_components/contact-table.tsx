'use client'

import { useState, useMemo } from 'react'
import {
  Search,
  Mail,
  Clock,
  CheckCircle2,
  Trash2,
  AlertTriangle,
  MessageSquare,
} from 'lucide-react'

interface ContactMessage {
  id: string
  name: string
  email: string
  subject: string
  message: string
  status: string
  createdAt: string
}

export default function ContactTable({ initialMessages }: { initialMessages: ContactMessage[] }) {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [messages, setMessages] = useState(initialMessages)

  const filtered = useMemo(() => {
    return messages.filter((m) => {
      const matchesSearch =
        search === '' ||
        m.name.toLowerCase().includes(search.toLowerCase()) ||
        m.email.toLowerCase().includes(search.toLowerCase()) ||
        m.subject.toLowerCase().includes(search.toLowerCase())
      const matchesStatus = statusFilter === 'all' || m.status === statusFilter
      return matchesSearch && matchesStatus
    })
  }, [messages, search, statusFilter])

  const statusCounts = useMemo(
    () => ({
      all: messages.length,
      NEW: messages.filter((m) => m.status === 'NEW').length,
      IN_PROGRESS: messages.filter((m) => m.status === 'IN_PROGRESS').length,
      RESOLVED: messages.filter((m) => m.status === 'RESOLVED').length,
      SPAM: messages.filter((m) => m.status === 'SPAM').length,
    }),
    [messages]
  )

  async function updateStatus(id: string, status: string) {
    try {
      await fetch(`/api/admin/contact/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })
      setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, status } : m)))
    } catch {
      /* ignore */
    }
  }

  async function deleteMessage(id: string) {
    if (!confirm('Nachricht wirklich löschen?')) return
    try {
      await fetch(`/api/admin/contact/${id}`, { method: 'DELETE' })
      setMessages((prev) => prev.filter((m) => m.id !== id))
    } catch {
      /* ignore */
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
      {/* Filters */}
      <div className="flex flex-col gap-3 border-b border-slate-100 p-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Name, E-Mail oder Betreff suchen..."
            className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pl-10 pr-4 text-sm focus:border-transparent focus:ring-2 focus:ring-nova-400"
          />
        </div>
        <div className="flex gap-1">
          {(['all', 'NEW', 'IN_PROGRESS', 'RESOLVED', 'SPAM'] as const).map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-colors ${
                statusFilter === s
                  ? 'bg-nova-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {s === 'all'
                ? `Alle (${statusCounts.all})`
                : `${statusLabel(s)} (${statusCounts[s]})`}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      <div className="divide-y divide-slate-100">
        {filtered.length === 0 ? (
          <div className="p-12 text-center">
            <MessageSquare className="mx-auto mb-3 text-slate-300" size={40} />
            <p className="font-medium text-slate-500">Keine Nachrichten gefunden</p>
          </div>
        ) : (
          filtered.map((msg) => (
            <div key={msg.id} className="p-4 transition-colors hover:bg-slate-50/50">
              <div
                className="flex cursor-pointer items-start justify-between gap-4"
                onClick={() => setExpandedId(expandedId === msg.id ? null : msg.id)}
              >
                <div className="min-w-0 flex-1">
                  <div className="mb-1 flex items-center gap-2">
                    <span
                      className={`rounded px-2 py-0.5 text-[10px] font-bold ${statusStyle(msg.status)}`}
                    >
                      {statusLabel(msg.status)}
                    </span>
                    <h3 className="truncate text-sm font-bold text-slate-900">{msg.subject}</h3>
                  </div>
                  <p className="text-xs text-slate-500">
                    <span className="font-semibold">{msg.name}</span> &lt;{msg.email}&gt; ·{' '}
                    {new Date(msg.createdAt).toLocaleDateString('de-DE', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
                <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                  <a
                    href={`mailto:${msg.email}?subject=Re: ${encodeURIComponent(msg.subject)}`}
                    className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-blue-50 hover:text-blue-600"
                    title="Antworten"
                  >
                    <Mail size={16} />
                  </a>
                </div>
              </div>

              {expandedId === msg.id && (
                <div className="mt-3 rounded-lg bg-slate-50 p-4">
                  <p className="whitespace-pre-wrap text-sm text-slate-700">{msg.message}</p>
                  <div className="mt-3 flex gap-2" onClick={(e) => e.stopPropagation()}>
                    {msg.status !== 'IN_PROGRESS' && (
                      <button
                        onClick={() => updateStatus(msg.id, 'IN_PROGRESS')}
                        className="flex items-center gap-1 rounded-lg bg-amber-50 px-3 py-1.5 text-xs font-bold text-amber-700 transition-colors hover:bg-amber-100"
                      >
                        <Clock size={12} /> In Bearbeitung
                      </button>
                    )}
                    {msg.status !== 'RESOLVED' && (
                      <button
                        onClick={() => updateStatus(msg.id, 'RESOLVED')}
                        className="flex items-center gap-1 rounded-lg bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700 transition-colors hover:bg-emerald-100"
                      >
                        <CheckCircle2 size={12} /> Erledigt
                      </button>
                    )}
                    {msg.status !== 'SPAM' && (
                      <button
                        onClick={() => updateStatus(msg.id, 'SPAM')}
                        className="flex items-center gap-1 rounded-lg bg-red-50 px-3 py-1.5 text-xs font-bold text-red-700 transition-colors hover:bg-red-100"
                      >
                        <AlertTriangle size={12} /> Spam
                      </button>
                    )}
                    <button
                      onClick={() => deleteMessage(msg.id)}
                      className="ml-auto flex items-center gap-1 rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-600 transition-colors hover:bg-red-50 hover:text-red-600"
                    >
                      <Trash2 size={12} /> Löschen
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
