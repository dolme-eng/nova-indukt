"use client"

import { useMemo, useState } from "react"
import { toast } from "sonner"

type OrderStatus = "PENDING" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED" | "REFUNDED"

export function ShippingActions(props: { orderId: string; currentStatus: OrderStatus; trackingNumber: string | null }) {
  const [status, setStatus] = useState<OrderStatus>(props.currentStatus)
  const [trackingNumber, setTrackingNumber] = useState(props.trackingNumber || "")
  const [carrier, setCarrier] = useState("DHL")
  const [trackingUrl, setTrackingUrl] = useState("")
  const [sendEmail, setSendEmail] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  const canSendEmail = useMemo(() => trackingNumber.trim().length > 0, [trackingNumber])

  async function save() {
    setIsSaving(true)
    try {
      const res = await fetch(`/api/admin/orders/${props.orderId}/shipping`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status,
          trackingNumber: trackingNumber.trim() ? trackingNumber.trim() : null,
          carrier,
          trackingUrl,
          sendEmail: Boolean(sendEmail && canSendEmail && status === "SHIPPED"),
        }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data?.error || "Failed to update shipping")
      }
      toast.success("Expédition mise à jour")
    } catch (e: any) {
      toast.error(e?.message || "Erreur")
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest">Actions expédition</h3>
        <button
          onClick={save}
          disabled={isSaving}
          className="px-4 py-2 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-primary/90 disabled:opacity-60"
        >
          {isSaving ? "Sauvegarde..." : "Sauvegarder"}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Statut</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as OrderStatus)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm"
          >
            <option value="PENDING">PENDING</option>
            <option value="PROCESSING">PROCESSING</option>
            <option value="SHIPPED">SHIPPED</option>
            <option value="DELIVERED">DELIVERED</option>
            <option value="CANCELLED">CANCELLED</option>
            <option value="REFUNDED">REFUNDED</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">N° de suivi</label>
          <input
            value={trackingNumber}
            onChange={(e) => setTrackingNumber(e.target.value)}
            placeholder="ex: JD014600006838..."
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Transporteur</label>
          <input
            value={carrier}
            onChange={(e) => setCarrier(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm"
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Lien de suivi (optionnel)</label>
          <input
            value={trackingUrl}
            onChange={(e) => setTrackingUrl(e.target.value)}
            placeholder="https://..."
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm"
          />
        </div>
      </div>

      <label className="flex items-center gap-2 text-sm text-slate-700">
        <input
          type="checkbox"
          checked={sendEmail}
          onChange={(e) => setSendEmail(e.target.checked)}
          disabled={!canSendEmail || status !== "SHIPPED"}
        />
        Envoyer l’email “commande expédiée” (uniquement si statut = SHIPPED + n° de suivi)
      </label>
    </div>
  )
}

