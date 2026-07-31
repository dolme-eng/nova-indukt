'use client'

import { useMemo, useState } from 'react'
import { toast } from 'sonner'

type OrderStatus = 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED' | 'REFUNDED'

export function ShippingActions(props: {
  orderId: string
  currentStatus: OrderStatus
  trackingNumber: string | null
}) {
  const [status, setStatus] = useState<OrderStatus>(props.currentStatus)
  const [trackingNumber, setTrackingNumber] = useState(props.trackingNumber || '')
  const [carrier, setCarrier] = useState('DHL')
  const [trackingUrl, setTrackingUrl] = useState('')
  const [sendEmail, setSendEmail] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  const canSendEmail = useMemo(() => trackingNumber.trim().length > 0, [trackingNumber])

  async function save() {
    setIsSaving(true)
    try {
      const res = await fetch(`/api/admin/orders/${props.orderId}/shipping`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status,
          trackingNumber: trackingNumber.trim() ? trackingNumber.trim() : null,
          carrier,
          trackingUrl,
          sendEmail: Boolean(sendEmail && canSendEmail && status === 'SHIPPED'),
        }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data?.error || 'Versandaktualisierung fehlgeschlagen')
      }
      toast.success('Versand aktualisiert')
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : 'Fehler')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="space-y-4 overflow-hidden rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold uppercase tracking-widest text-slate-900">
          Versandaktionen
        </h3>
        <button
          onClick={save}
          disabled={isSaving}
          className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary/90 disabled:opacity-60"
        >
          {isSaving ? 'Wird gespeichert...' : 'Speichern'}
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-widest text-slate-500">
            Status
          </label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as OrderStatus)}
            className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm"
          >
            <option value="PENDING">Ausstehend</option>
            <option value="PROCESSING">In Bearbeitung</option>
            <option value="SHIPPED">Versandt</option>
            <option value="DELIVERED">Zugestellt</option>
            <option value="CANCELLED">Storniert</option>
            <option value="REFUNDED">Erstattet</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-widest text-slate-500">
            Sendungsnummer
          </label>
          <input
            value={trackingNumber}
            onChange={(e) => setTrackingNumber(e.target.value)}
            placeholder="z.B. JD014600006838..."
            className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-widest text-slate-500">
            Transportdienst
          </label>
          <input
            value={carrier}
            onChange={(e) => setCarrier(e.target.value)}
            className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm"
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-widest text-slate-500">
            Verfolgungslink (optional)
          </label>
          <input
            value={trackingUrl}
            onChange={(e) => setTrackingUrl(e.target.value)}
            placeholder="https://..."
            className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm"
          />
        </div>
      </div>

      <label className="flex items-center gap-2 text-sm text-slate-700">
        <input
          type="checkbox"
          checked={sendEmail}
          onChange={(e) => setSendEmail(e.target.checked)}
          disabled={!canSendEmail || status !== 'SHIPPED'}
        />
        E-Mail &quot;Bestellung versendet&quot; senden (nur bei Status = Versandt + Sendungsnummer)
      </label>
    </div>
  )
}
