"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { toast } from "sonner"

type AuditRow = {
  id: string
  action: string
  entityType: string
  entityId: string
  userId: string | null
  createdAt: string
}

export function LogsAdminClient() {
  const [items, setItems] = useState<AuditRow[]>([])
  const [cursor, setCursor] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isMoreLoading, setIsMoreLoading] = useState(false)

  async function load(first = false) {
    if (first) setIsLoading(true)
    else setIsMoreLoading(true)
    try {
      const qs = new URLSearchParams()
      qs.set("take", "50")
      if (!first && cursor) qs.set("cursor", cursor)
      const res = await fetch(`/api/admin/audit?${qs.toString()}`, { cache: "no-store" })
      if (!res.ok) throw new Error("Failed to load audit logs")
      const json = await res.json()
      const nextItems = Array.isArray(json?.items) ? json.items : []
      setItems((prev) => (first ? nextItems : [...prev, ...nextItems]))
      setCursor(json?.nextCursor ?? null)
    } catch (e: any) {
      toast.error(e?.message || "Erreur")
    } finally {
      if (first) setIsLoading(false)
      else setIsMoreLoading(false)
    }
  }

  useEffect(() => {
    load(true)
  }, [])

  if (isLoading) return <div className="text-sm text-slate-600">Chargement…</div>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Audit Trail</h1>
          <p className="text-slate-600 mt-1">Qui a fait quoi, quand (actions admin).</p>
        </div>
        <Link href="/admin/settings" className="px-4 py-2 text-sm font-semibold border border-slate-200 rounded-lg bg-white hover:bg-slate-50">
          Retour
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-[10px] uppercase tracking-widest font-bold border-b border-slate-200">
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Action</th>
                <th className="px-6 py-4">Entité</th>
                <th className="px-6 py-4">User</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {items.map((r) => (
                <tr key={r.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-3 text-sm text-slate-700">{new Date(r.createdAt).toLocaleString()}</td>
                  <td className="px-6 py-3 text-sm font-semibold text-slate-900">{r.action}</td>
                  <td className="px-6 py-3 text-sm text-slate-700">
                    <span className="font-semibold">{r.entityType}</span>
                    <span className="text-slate-400"> · </span>
                    <span className="font-mono text-xs">{r.entityId}</span>
                  </td>
                  <td className="px-6 py-3 text-sm text-slate-700">{r.userId || "—"}</td>
                </tr>
              ))}
              {items.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-10 text-center text-slate-500">
                    Aucun log.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex justify-center">
        <button
          disabled={!cursor || isMoreLoading}
          onClick={() => load(false)}
          className="px-4 py-2 text-sm font-semibold rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-60"
        >
          {isMoreLoading ? "Chargement..." : cursor ? "Charger plus" : "Fin"}
        </button>
      </div>
    </div>
  )
}

