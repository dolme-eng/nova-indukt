'use client'

import { useEffect } from 'react'
import { logError } from '@/lib/logger'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    logError('Global error (root layout crash):', error)
  }, [error])

  return (
    <html lang="de">
      <body>
        <div
          style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: 'system-ui, sans-serif',
            backgroundColor: '#f9fafb',
          }}
        >
          <div
            style={{
              maxWidth: '400px',
              textAlign: 'center',
              padding: '48px',
              backgroundColor: 'white',
              borderRadius: '16px',
              boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
            }}
          >
            <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '12px' }}>
              Etwas ist schief gelaufen
            </h1>
            <p style={{ color: '#6b7280', marginBottom: '24px' }}>
              Ein unerwarteter Fehler ist aufgetreten. Bitte versuchen Sie es erneut.
            </p>
            <button
              onClick={() => reset()}
              style={{
                padding: '12px 24px',
                backgroundColor: '#0C211E',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                cursor: 'pointer',
                fontWeight: 'bold',
                fontSize: '14px',
              }}
            >
              Erneut versuchen
            </button>
            {error.digest && (
              <p
                style={{
                  marginTop: '16px',
                  fontSize: '10px',
                  color: '#9ca3af',
                  fontFamily: 'monospace',
                }}
              >
                Error ID: {error.digest}
              </p>
            )}
          </div>
        </div>
      </body>
    </html>
  )
}
