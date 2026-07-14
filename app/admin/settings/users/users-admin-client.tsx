"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { toast } from "sonner"

type UserRow = { id: string; email: string; name: string | null; role: "USER" | "ADMIN"; createdAt: string; emailVerified: string | null }

export function UsersAdminClient() {
  const [users, setUsers] = useState<UserRow[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  async function refresh() {
    setIsLoading(true)
    try {
      const res = await fetch("/api/admin/users", { cache: "no-store" })
      if (!res.ok) throw new Error("Failed to load users")
      const json = await res.json()
      const nextItems = Array.isArray(json?.items) ? json.items : []
      setUsers(nextItems)
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Erreur")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    refresh()
  }, [])

  async function setRole(id: string, role: "USER" | "ADMIN") {
    setIsSaving(true)
    try {
      const res = await fetch(`/api/admin/users/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role }),
      })
      const json = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(json?.error || "Failed to update role")
      toast.success("Rôle mis à jour")
      await refresh()
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Erreur")
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) return <div className="text-sm text-slate-600">Chargement…</div>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Utilisateurs</h1>
          <p className="text-slate-600 mt-1">Créer/supprimer admins via changement de rôle (audit log inclus).</p>
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
                <th className="px-6 py-4">Utilisateur</th>
                <th className="px-6 py-4">Rôle</th>
                <th className="px-6 py-4">Email vérifié</th>
                <th className="px-6 py-4">Créé</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-bold text-slate-900">{u.name || "—"}</span>
                      <span className="text-xs text-slate-500">{u.email}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`text-[10px] font-bold px-2 py-1 rounded-full ${
                        u.role === "ADMIN" ? "bg-purple-50 text-purple-700" : "bg-blue-50 text-blue-700"
                      }`}
                    >
                      {u.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">{u.emailVerified ? "Oui" : "Non"}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">{new Date(u.createdAt).toLocaleDateString()}</td>
                  <td className="px-6 py-4 text-right">
                    {u.role === "ADMIN" ? (
                      <button
                        disabled={isSaving}
                        onClick={() => setRole(u.id, "USER")}
                        className="px-3 py-1.5 text-sm font-semibold rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-60"
                      >
                        Retirer admin
                      </button>
                    ) : (
                      <button
                        disabled={isSaving}
                        onClick={() => setRole(u.id, "ADMIN")}
                        className="px-3 py-1.5 text-sm font-semibold rounded-lg bg-primary text-white hover:bg-primary/90 disabled:opacity-60"
                      >
                        Rendre admin
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-slate-500">
                    Aucun utilisateur.
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

