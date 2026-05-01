"use client"

import Link from "next/link"
import { useSiteSettings } from "../_components/useSiteSettings"

export function EmailSettingsClient() {
  const { data, setData, isLoading, isSaving, save } = useSiteSettings()
  if (isLoading) return <div className="text-sm text-slate-600">Chargement…</div>

  const email = data.email ?? {}

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">E-Mails</h1>
          <p className="text-slate-600 mt-1">Paramètres fonctionnels (les secrets restent dans les variables d’environnement).</p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/admin/settings" className="px-4 py-2 text-sm font-semibold border border-slate-200 rounded-lg bg-white hover:bg-slate-50">
            Retour
          </Link>
          <button
            onClick={() => save({ ...data, email })}
            disabled={isSaving}
            className="px-4 py-2 text-sm font-semibold rounded-lg bg-primary text-white hover:bg-primary/90 disabled:opacity-60"
          >
            {isSaving ? "Sauvegarde..." : "Enregistrer"}
          </button>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-6 space-y-4">
        <h2 className="text-sm font-bold text-slate-900 uppercase tracking-widest">Notifications</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Admin email (contact)</label>
            <input
              value={email.adminEmail ?? ""}
              onChange={(e) => setData({ ...data, email: { ...email, adminEmail: e.target.value } })}
              placeholder="admin@nova-indukt.de"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Texte virement (checkout email)</label>
            <input
              value={email.bankTransferText ?? ""}
              onChange={(e) => setData({ ...data, email: { ...email, bankTransferText: e.target.value } })}
              placeholder="Vous recevrez les informations de paiement par e-mail."
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

