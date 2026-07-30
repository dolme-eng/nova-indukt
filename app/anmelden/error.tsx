'use client'

import { useEffect } from 'react'

export default function AnmeldenError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Route error:', error)
  }, [error])

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center p-8 text-center">
      <h2 className="mb-2 text-xl font-bold text-gray-900">Anmeldefehler</h2>
      <p className="mb-6 max-w-md text-sm text-gray-500">
        Beim Laden der Anmeldeseite ist ein Fehler aufgetreten.
      </p>
      <button
        onClick={reset}
        className="rounded-xl bg-[#4ECCA3] px-6 py-3 font-semibold text-white hover:bg-[#3BA88A] transition-colors"
      >
        Erneut versuchen
      </button>
    </div>
  )
}
