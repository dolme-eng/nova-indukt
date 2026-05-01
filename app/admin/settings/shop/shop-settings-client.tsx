"use client"

import Link from "next/link"
import { useSiteSettings } from "../_components/useSiteSettings"

function Section({ title, desc, children }: { title: string; desc: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 space-y-4">
      <div>
        <h2 className="text-sm font-bold text-slate-900 uppercase tracking-widest">{title}</h2>
        <p className="text-sm text-slate-600 mt-1">{desc}</p>
      </div>
      {children}
    </div>
  )
}

export function ShopSettingsClient() {
  const { data, setData, isLoading, isSaving, save } = useSiteSettings()

  if (isLoading) {
    return <div className="text-sm text-slate-600">Chargement…</div>
  }

  const shop = data.shop ?? {}

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Shop</h1>
          <p className="text-slate-600 mt-1">Paiements, taxes et livraison (config centrale).</p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/admin/settings" className="px-4 py-2 text-sm font-semibold border border-slate-200 rounded-lg bg-white hover:bg-slate-50">
            Retour
          </Link>
          <button
            onClick={() => save({ ...data, shop })}
            disabled={isSaving}
            className="px-4 py-2 text-sm font-semibold rounded-lg bg-primary text-white hover:bg-primary/90 disabled:opacity-60"
          >
            {isSaving ? "Sauvegarde..." : "Enregistrer"}
          </button>
        </div>
      </div>

      <Section title="Paiements" desc="Stripe est retiré. On garde PayPal + e-mail (virement).">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label className="flex items-center gap-2 text-sm text-slate-700">
            <input
              type="checkbox"
              checked={shop.payments?.paypalEnabled ?? true}
              onChange={(e) => setData({ ...data, shop: { ...shop, payments: { ...(shop.payments ?? {}), paypalEnabled: e.target.checked } } })}
            />
            PayPal activé
          </label>
          <label className="flex items-center gap-2 text-sm text-slate-700">
            <input
              type="checkbox"
              checked={shop.payments?.bankTransferEnabled ?? true}
              onChange={(e) =>
                setData({ ...data, shop: { ...shop, payments: { ...(shop.payments ?? {}), bankTransferEnabled: e.target.checked } } })
              }
            />
            Paiement par e-mail / virement activé
          </label>
        </div>
      </Section>

      <Section title="Taxes" desc="TVA par défaut (affichage & calcul).">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">TVA (%)</label>
            <input
              type="number"
              value={shop.taxes?.vatRatePercent ?? 19}
              onChange={(e) =>
                setData({ ...data, shop: { ...shop, taxes: { ...(shop.taxes ?? {}), vatRatePercent: Number(e.target.value) } } })
              }
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm"
            />
          </div>
        </div>
      </Section>

      <Section title="Livraison" desc="Coût et seuil de gratuité.">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Frais (€)</label>
            <input
              type="number"
              value={shop.shipping?.cost ?? 9.99}
              onChange={(e) =>
                setData({ ...data, shop: { ...shop, shipping: { ...(shop.shipping ?? {}), cost: Number(e.target.value) } } })
              }
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Gratuit à partir de (€)</label>
            <input
              type="number"
              value={shop.shipping?.freeThreshold ?? 500}
              onChange={(e) =>
                setData({ ...data, shop: { ...shop, shipping: { ...(shop.shipping ?? {}), freeThreshold: Number(e.target.value) } } })
              }
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm"
            />
          </div>
        </div>
      </Section>

      <Section title="Site" desc="URL publique utilisée pour les liens emails/SEO.">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Base URL</label>
            <input
              value={data.site?.baseUrl ?? ""}
              onChange={(e) => setData({ ...data, site: { ...(data.site ?? {}), baseUrl: e.target.value } })}
              placeholder="https://nova-indukt.de"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm"
            />
          </div>
        </div>
      </Section>
    </div>
  )
}

