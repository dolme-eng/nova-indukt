'use client'

import Link from 'next/link'
import { useSiteSettings } from '../_components/useSiteSettings'

export function EmailSettingsClient() {
  const { data, setData, isLoading, isSaving, save } = useSiteSettings()
  if (isLoading) return <div className="text-sm text-slate-600">Laden...</div>

  const email = data.email ?? {}

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">E-Mails</h1>
          <p className="mt-1 text-slate-600">
            Funktionale E-Mail-Einstellungen (Secrets bleiben in Umgebungsvariablen).
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
            onClick={() => save({ ...data, email })}
            disabled={isSaving}
            className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary/90 disabled:opacity-60"
          >
            {isSaving ? 'Wird gespeichert...' : 'Speichern'}
          </button>
        </div>
      </div>

      <div className="space-y-4 rounded-xl border border-slate-200 bg-white p-6">
        <h2 className="text-sm font-bold uppercase tracking-widest text-slate-900">
          Benachrichtigungen
        </h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-slate-500">
              Admin-E-Mail (Kontakt)
            </label>
            <input
              value={email.adminEmail ?? ''}
              onChange={(e) =>
                setData({ ...data, email: { ...email, adminEmail: e.target.value } })
              }
              placeholder="admin@nova-indukt.de"
              className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-slate-500">
              Überweisungstext (Checkout-E-Mail)
            </label>
            <input
              value={email.bankTransferText ?? ''}
              onChange={(e) =>
                setData({ ...data, email: { ...email, bankTransferText: e.target.value } })
              }
              placeholder="Sie erhalten die Zahlungsinformationen per E-Mail."
              className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
