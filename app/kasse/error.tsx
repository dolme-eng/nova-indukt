'use client'

import { useEffect } from 'react'
import { logError } from '@/lib/logger'

export default function CheckoutError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    logError('Page error', error)
  }, [error])

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center p-8 text-center">
      <h2 className="mb-2 text-xl font-bold text-gray-900">Fehler im Checkout</h2>
      <p className="mb-6 max-w-md text-sm text-gray-500">
        Beim Laden der Kasse ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut.
      </p>
      <button
        onClick={reset}
        className="rounded-xl bg-[#4ECCA3] px-6 py-3 font-semibold text-white transition-colors hover:bg-[#3BA88A]"
      >
        Erneut versuchen
      </button>
    </div>
  )
}
