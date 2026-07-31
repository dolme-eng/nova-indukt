'use client'

import Link from 'next/link'
import { useSiteSettings } from '../_components/useSiteSettings'

function Section({
  title,
  desc,
  children,
}: {
  title: string
  desc: string
  children: React.ReactNode
}) {
  return (
    <div className="space-y-4 rounded-xl border border-slate-200 bg-white p-6">
      <div>
        <h2 className="text-sm font-bold uppercase tracking-widest text-slate-900">{title}</h2>
        <p className="mt-1 text-sm text-slate-600">{desc}</p>
      </div>
      {children}
    </div>
  )
}

export function PaymentSettingsClient() {
  const { data, setData, isLoading, isSaving, save } = useSiteSettings()

  if (isLoading) {
    return <div className="text-sm text-slate-600">Laden...</div>
  }

  const payment = data.payment ?? {}

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Zahlungseinstellungen</h1>
          <p className="mt-1 text-slate-600">Bankverbindung für Überweisungen verwalten.</p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/admin/settings"
            className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold hover:bg-slate-50"
          >
            Zurück
          </Link>
          <button
            onClick={() => save({ ...data, payment })}
            disabled={isSaving}
            className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary/90 disabled:opacity-60"
          >
            {isSaving ? 'Wird gespeichert...' : 'Speichern'}
          </button>
        </div>
      </div>

      <Section title="Bankverbindung" desc="IBAN, BIC und Kontoinhaber für Banküberweisungen.">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label
              htmlFor="bank-holder"
              className="text-xs font-bold uppercase tracking-widest text-slate-500"
            >
              Kontoinhaber
            </label>
            <input
              id="bank-holder"
              type="text"
              value={payment.holder ?? ''}
              onChange={(e) =>
                setData({ ...data, payment: { ...payment, holder: e.target.value } })
              }
              placeholder="NOVA INDUKT"
              className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm"
            />
          </div>
          <div className="space-y-2">
            <label
              htmlFor="bank-name"
              className="text-xs font-bold uppercase tracking-widest text-slate-500"
            >
              Bankname
            </label>
            <input
              id="bank-name"
              type="text"
              value={payment.bankName ?? ''}
              onChange={(e) =>
                setData({ ...data, payment: { ...payment, bankName: e.target.value } })
              }
              placeholder="Sparkasse / Commerzbank / …"
              className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm"
            />
          </div>
          <div className="space-y-2">
            <label
              htmlFor="bank-iban"
              className="text-xs font-bold uppercase tracking-widest text-slate-500"
            >
              IBAN
            </label>
            <input
              id="bank-iban"
              type="text"
              value={payment.iban ?? ''}
              onChange={(e) => setData({ ...data, payment: { ...payment, iban: e.target.value } })}
              placeholder="DE00 0000 0000 0000 0000 00"
              className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 font-mono text-sm"
            />
          </div>
          <div className="space-y-2">
            <label
              htmlFor="bank-bic"
              className="text-xs font-bold uppercase tracking-widest text-slate-500"
            >
              BIC
            </label>
            <input
              id="bank-bic"
              type="text"
              value={payment.bic ?? ''}
              onChange={(e) => setData({ ...data, payment: { ...payment, bic: e.target.value } })}
              placeholder="XXXXXXXXXXXXXXX"
              className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 font-mono text-sm"
            />
          </div>
        </div>
      </Section>
    </div>
  )
}
