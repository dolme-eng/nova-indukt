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

export function ShopSettingsClient() {
  const { data, setData, isLoading, isSaving, save } = useSiteSettings()

  if (isLoading) {
    return <div className="text-sm text-slate-600">Laden...</div>
  }

  const shop = data.shop ?? {}

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Shop</h1>
          <p className="mt-1 text-slate-600">
            Zahlungen, Steuern und Versand (zentrale Konfiguration).
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
            onClick={() => save({ ...data, shop })}
            disabled={isSaving}
            className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary/90 disabled:opacity-60"
          >
            {isSaving ? 'Wird gespeichert...' : 'Speichern'}
          </button>
        </div>
      </div>

      <Section title="Zahlungsmethoden" desc="Aktive Zahlungsmethoden für den Shop.">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <label className="flex items-center gap-2 text-sm text-slate-700">
            <input
              type="checkbox"
              checked={shop.payments?.bankTransferEnabled ?? true}
              onChange={(e) =>
                setData({
                  ...data,
                  shop: {
                    ...shop,
                    payments: { ...(shop.payments ?? {}), bankTransferEnabled: e.target.checked },
                  },
                })
              }
            />
            Banküberweisung aktiviert
          </label>
        </div>
      </Section>

      <Section title="Steuern" desc="Standard-MwSt. (Anzeige & Berechnung).">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="space-y-2">
            <label
              htmlFor="vatRatePercent"
              className="text-xs font-bold uppercase tracking-widest text-slate-500"
            >
              MwSt. (%)
            </label>
            <input
              id="vatRatePercent"
              type="number"
              value={shop.taxes?.vatRatePercent ?? 19}
              onChange={(e) =>
                setData({
                  ...data,
                  shop: {
                    ...shop,
                    taxes: { ...(shop.taxes ?? {}), vatRatePercent: Number(e.target.value) },
                  },
                })
              }
              className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm"
            />
          </div>
        </div>
      </Section>

      <Section title="Versand" desc="Versandkosten und kostenloser Versand ab Bestellwert.">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="space-y-2">
            <label
              htmlFor="shippingCost"
              className="text-xs font-bold uppercase tracking-widest text-slate-500"
            >
              Versandkosten (€)
            </label>
            <input
              id="shippingCost"
              type="number"
              value={shop.shipping?.cost ?? 9.99}
              onChange={(e) =>
                setData({
                  ...data,
                  shop: {
                    ...shop,
                    shipping: { ...(shop.shipping ?? {}), cost: Number(e.target.value) },
                  },
                })
              }
              className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm"
            />
          </div>
          <div className="space-y-2">
            <label
              htmlFor="freeThreshold"
              className="text-xs font-bold uppercase tracking-widest text-slate-500"
            >
              Kostenlos ab (€)
            </label>
            <input
              id="freeThreshold"
              type="number"
              value={shop.shipping?.freeThreshold ?? 500}
              onChange={(e) =>
                setData({
                  ...data,
                  shop: {
                    ...shop,
                    shipping: { ...(shop.shipping ?? {}), freeThreshold: Number(e.target.value) },
                  },
                })
              }
              className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm"
            />
          </div>
        </div>
      </Section>

      <Section title="Website" desc="Öffentliche URL für E-Mail-Links und SEO.">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-slate-500">
              Base URL
            </label>
            <input
              value={data.site?.baseUrl ?? ''}
              onChange={(e) =>
                setData({ ...data, site: { ...(data.site ?? {}), baseUrl: e.target.value } })
              }
              placeholder="https://nova-indukt.de"
              className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm"
            />
          </div>
        </div>
      </Section>
    </div>
  )
}
