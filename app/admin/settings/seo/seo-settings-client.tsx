"use client"

import Link from "next/link"
import { useSiteSettings } from "../_components/useSiteSettings"

export function SeoSettingsClient() {
  const { data, setData, isLoading, isSaving, save } = useSiteSettings()
  if (isLoading) return <div className="text-sm text-slate-600">Chargement…</div>

  const seo = data.seo ?? {}

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">SEO</h1>
          <p className="text-slate-600 mt-1">Defaults SEO globaux (les pages peuvent surcharger).</p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/admin/settings" className="px-4 py-2 text-sm font-semibold border border-slate-200 rounded-lg bg-white hover:bg-slate-50">
            Retour
          </Link>
          <button
            onClick={() => save({ ...data, seo })}
            disabled={isSaving}
            className="px-4 py-2 text-sm font-semibold rounded-lg bg-primary text-white hover:bg-primary/90 disabled:opacity-60"
          >
            {isSaving ? "Sauvegarde..." : "Enregistrer"}
          </button>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-6 space-y-4">
        <h2 className="text-sm font-bold text-slate-900 uppercase tracking-widest">Meta</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Titre par défaut</label>
            <input
              value={seo.defaultTitle ?? ""}
              onChange={(e) => setData({ ...data, seo: { ...seo, defaultTitle: e.target.value } })}
              placeholder="NOVA INDUKT"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Description par défaut</label>
            <input
              value={seo.defaultDescription ?? ""}
              onChange={(e) => setData({ ...data, seo: { ...seo, defaultDescription: e.target.value } })}
              placeholder="Induktion, Premium Zubehör…"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">OpenGraph image URL</label>
            <input
              value={seo.ogImageUrl ?? ""}
              onChange={(e) => setData({ ...data, seo: { ...seo, ogImageUrl: e.target.value } })}
              placeholder="https://..."
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

