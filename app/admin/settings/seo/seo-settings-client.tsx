'use client'

import Link from 'next/link'
import { useSiteSettings } from '../_components/useSiteSettings'

export function SeoSettingsClient() {
  const { data, setData, isLoading, isSaving, save } = useSiteSettings()
  if (isLoading) return <div className="text-sm text-slate-600">Laden...</div>

  const seo = data.seo ?? {}

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">SEO</h1>
          <p className="mt-1 text-slate-600">
            Globale SEO-Standardwerte (einzelne Seiten können überschreiben).
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/admin/settings"
            className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold hover:bg-slate-50"
          >
            Zurück
          </Link>
          <button
            onClick={() => save({ ...data, seo })}
            disabled={isSaving}
            className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary/90 disabled:opacity-60"
          >
            {isSaving ? 'Speichern...' : 'Speichern'}
          </button>
        </div>
      </div>

      <div className="space-y-4 rounded-xl border border-slate-200 bg-white p-6">
        <h2 className="text-sm font-bold uppercase tracking-widest text-slate-900">Meta</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-slate-500">
              Standard-Titel
            </label>
            <input
              value={seo.defaultTitle ?? ''}
              onChange={(e) => setData({ ...data, seo: { ...seo, defaultTitle: e.target.value } })}
              placeholder="NOVA INDUKT"
              className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-slate-500">
              Standard-Beschreibung
            </label>
            <input
              value={seo.defaultDescription ?? ''}
              onChange={(e) =>
                setData({ ...data, seo: { ...seo, defaultDescription: e.target.value } })
              }
              placeholder="Induktion, Premium Zubehör…"
              className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-slate-500">
              OpenGraph image URL
            </label>
            <input
              value={seo.ogImageUrl ?? ''}
              onChange={(e) => setData({ ...data, seo: { ...seo, ogImageUrl: e.target.value } })}
              placeholder="https://..."
              className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
