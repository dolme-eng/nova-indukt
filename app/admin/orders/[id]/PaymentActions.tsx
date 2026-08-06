'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { CreditCard, CheckCircle, XCircle, RotateCcw } from 'lucide-react'

type PaymentStatus = 'PENDING' | 'AUTHORIZED' | 'PAID' | 'FAILED' | 'REFUNDED' | 'PARTIALLY_REFUNDED'

const paymentLabels: Record<string, string> = {
  PENDING: 'Ausstehend',
  PAID: 'Bezahlt',
  FAILED: 'Fehlgeschlagen',
  REFUNDED: 'Erstattet',
}

export function PaymentActions(props: {
  orderId: string
  orderNumber: string
  currentPaymentStatus: PaymentStatus
  paymentMethod?: string
  paidAt?: string | null
}) {
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>(props.currentPaymentStatus)
  const [isSaving, setIsSaving] = useState(false)
  const [confirmStatus, setConfirmStatus] = useState<PaymentStatus | null>(null)

  async function updatePaymentStatus(newStatus: PaymentStatus) {
    setConfirmStatus(null)
    setIsSaving(true)
    try {
      const res = await fetch(`/api/admin/orders/${props.orderId}/payment`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentStatus: newStatus }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data?.error || 'Zahlungsstatus konnte nicht aktualisiert werden')
      }
      setPaymentStatus(newStatus)
      toast.success(`Zahlungsstatus auf „${paymentLabels[newStatus]}" aktualisiert`)
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : 'Fehler')
    } finally {
      setIsSaving(false)
    }
  }

  // Show payment actions for all payment methods
  const paidDate = props.paidAt
    ? new Date(props.paidAt).toLocaleDateString('de-DE', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      })
    : null

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center gap-2">
        <CreditCard size={16} className="text-slate-600" />
        <h3 className="text-sm font-bold uppercase tracking-widest text-slate-900">
          Zahlungsstatus
        </h3>
      </div>

      <div className="mb-4 flex items-center gap-3">
        <span className="text-sm text-slate-600">Aktueller Status:</span>
        <span
          className={`rounded-full border px-2.5 py-0.5 text-xs font-bold ${
            paymentStatus === 'PAID'
              ? 'border-green-200 bg-green-100 text-green-700'
              : paymentStatus === 'FAILED'
                ? 'border-red-200 bg-red-100 text-red-700'
                : paymentStatus === 'REFUNDED'
                  ? 'border-gray-200 bg-gray-100 text-gray-700'
                  : 'border-amber-200 bg-amber-100 text-amber-700'
          }`}
        >
          {paymentLabels[paymentStatus]}
        </span>
      </div>

      {paymentStatus === 'PAID' && paidDate && (
        <p className="mb-4 flex items-center gap-1 text-sm text-green-600">
          <CheckCircle size={14} />
          Zahlung bestätigt am {paidDate}
        </p>
      )}

      {confirmStatus ? (
        <div className="space-y-3 rounded-lg border border-slate-200 bg-slate-50 p-4">
          <p className="text-sm font-semibold text-slate-800">
            Status auf „{paymentLabels[confirmStatus]}" ändern?
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => updatePaymentStatus(confirmStatus)}
              disabled={isSaving}
              className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold text-white transition-colors disabled:opacity-60 ${
                confirmStatus === 'PAID'
                  ? 'bg-green-600 hover:bg-green-700'
                  : confirmStatus === 'FAILED'
                    ? 'bg-red-600 hover:bg-red-700'
                    : 'bg-gray-600 hover:bg-gray-700'
              }`}
            >
              {isSaving ? 'Wird gespeichert...' : 'Bestätigen'}
            </button>
            <button
              onClick={() => setConfirmStatus(null)}
              disabled={isSaving}
              className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-50"
            >
              Abbrechen
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-wrap gap-2">
          {paymentStatus !== 'PAID' && (
            <button
              onClick={() => setConfirmStatus('PAID')}
              disabled={isSaving}
              className="flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-green-700 disabled:opacity-60"
            >
              <CheckCircle size={16} />
              Als bezahlt markieren
            </button>
          )}
          {paymentStatus === 'PAID' && (
            <>
              <button
                onClick={() => setConfirmStatus('FAILED')}
                disabled={isSaving}
                className="flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-red-700 disabled:opacity-60"
              >
                <XCircle size={16} />
                Fehlgeschlagen markieren
              </button>
              <button
                onClick={() => setConfirmStatus('REFUNDED')}
                disabled={isSaving}
                className="flex items-center gap-2 rounded-lg bg-gray-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-gray-700 disabled:opacity-60"
              >
                <RotateCcw size={16} />
                Erstattung markieren
              </button>
            </>
          )}
        </div>
      )}
    </div>
  )
}
