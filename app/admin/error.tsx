'use client'

import { useEffect } from 'react'

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Admin error:', error)
  }, [error])

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center p-8 text-center">
      <h2 className="mb-2 text-xl font-bold text-gray-900">Fehler im Admin-Bereich</h2>
      <p className="mb-6 max-w-md text-sm text-gray-500">
        Beim Laden der Admin-Seite ist ein Fehler aufgetreten.
      </p>
      <button
        onClick={reset}
        className="rounded-xl bg-primary px-6 py-3 font-semibold text-white transition-colors hover:bg-primary/90"
      >
        Erneut versuchen
      </button>
    </div>
  )
}
