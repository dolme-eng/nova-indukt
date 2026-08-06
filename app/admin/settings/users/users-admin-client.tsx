'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

type UserRow = {
  id: string
  email: string
  name: string | null
  role: 'USER' | 'ADMIN'
  createdAt: string
  emailVerified: string | null
}

export function UsersAdminClient() {
  const [users, setUsers] = useState<UserRow[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)

  async function refresh() {
    setIsLoading(true)
    try {
      const [usersRes, sessionRes] = await Promise.all([
        fetch('/api/admin/users', { cache: 'no-store' }),
        fetch('/api/auth/session'),
      ])
      if (!usersRes.ok) throw new Error('Failed to load users')
      const usersJson = await usersRes.json()
      const nextItems = Array.isArray(usersJson?.items) ? usersJson.items : []
      setUsers(nextItems)

      const sessionJson = await sessionRes.json()
      if (sessionJson?.user?.id) {
        setCurrentUserId(sessionJson.user.id)
      }
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : 'Fehler')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    refresh()
  }, [])

  async function setRole(id: string, role: 'USER' | 'ADMIN') {
    // Prevent self-demotion
    if (id === currentUserId && role === 'USER') {
      toast.error('Sie können Ihre eigene Admin-Berechtigung nicht entziehen.')
      return
    }

    // Count current admins before demoting
    if (role === 'USER') {
      const adminCount = users.filter((u) => u.role === 'ADMIN').length
      if (adminCount <= 1) {
        toast.error('Es muss mindestens ein Admin vorhanden bleiben.')
        return
      }
    }
    if (
      !confirm(
        role === 'ADMIN'
          ? 'Diesem Benutzer Admin-Rechte geben?'
          : 'Admin-Rechte für diesen Benutzer entziehen?'
      )
    )
      return
    setIsSaving(true)
    try {
      const res = await fetch(`/api/admin/users/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role }),
      })
      const json = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(json?.error || 'Failed to update role')
      toast.success('Rolle aktualisiert')
      await refresh()
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : 'Fehler')
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) return <div className="text-sm text-slate-600">Laden...</div>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Benutzer</h1>
          <p className="mt-1 text-slate-600">
            Admin-Rechte über Rollen verwalten (mit Audit-Protokoll).
          </p>
        </div>
        <Link
          href="/admin/settings"
          className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold hover:bg-slate-50"
        >
          Zurück
        </Link>
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-[10px] font-bold uppercase tracking-widest text-slate-500">
                <th className="px-6 py-4">Benutzer</th>
                <th className="px-6 py-4">Rolle</th>
                <th className="px-6 py-4">E-Mail verifiziert</th>
                <th className="px-6 py-4">Erstellt</th>
                <th className="px-6 py-4 text-right">Aktion</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {users.map((u) => (
                <tr key={u.id} className="transition-colors hover:bg-slate-50/50">
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-bold text-slate-900">{u.name || '—'}</span>
                      <span className="text-xs text-slate-500">{u.email}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`rounded-full px-2 py-1 text-[10px] font-bold ${
                        u.role === 'ADMIN'
                          ? 'bg-purple-50 text-purple-700'
                          : 'bg-blue-50 text-blue-700'
                      }`}
                    >
                      {u.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">
                    {u.emailVerified ? 'Ja' : 'Nein'}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">
                    {new Date(u.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    {u.role === 'ADMIN' ? (
                      <button
                        disabled={isSaving}
                        onClick={() => setRole(u.id, 'USER')}
                        className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-semibold hover:bg-slate-50 disabled:opacity-60"
                      >
                        Admin entfernen
                      </button>
                    ) : (
                      <button
                        disabled={isSaving}
                        onClick={() => setRole(u.id, 'ADMIN')}
                        className="rounded-lg bg-primary px-3 py-1.5 text-sm font-semibold text-white hover:bg-primary/90 disabled:opacity-60"
                      >
                        Admin machen
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-slate-500">
                    Keine Benutzer.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
