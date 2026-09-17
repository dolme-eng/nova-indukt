'use client'

import { useEffect } from 'react'

const CSRF_COOKIE_NAME = 'csrf-token'
const CSRF_HEADER_NAME = 'x-csrf-token'
const TOKEN_LENGTH = 32

function generateToken(): string {
  const array = new Uint8Array(TOKEN_LENGTH)
  crypto.getRandomValues(array)
  return Array.from(array, (b) => b.toString(16).padStart(2, '0')).join('')
}

function getCookie(name: string): string | null {
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'))
  return match ? decodeURIComponent(match[2]) : null
}

export function getCsrfToken(): string | null {
  return getCookie(CSRF_COOKIE_NAME)
}

export function CsrfProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (!getCookie(CSRF_COOKIE_NAME)) {
      const token = generateToken()
      // Max-Age 24h: token rotates daily (set only when missing).
      // Host-only (no Domain), SameSite=Strict, Secure on https.
      // Non-HttpOnly by design (double-submit: JS must read it).
      document.cookie = `${CSRF_COOKIE_NAME}=${token}; Path=/; Max-Age=86400; SameSite=Strict${window.location.protocol === 'https:' ? '; Secure' : ''}`
    }

    const originalFetch = window.fetch
    window.fetch = function (input, init) {
      const method =
        init?.method?.toUpperCase() || (input instanceof Request ? input.method : 'GET')

      if (method !== 'GET' && method !== 'HEAD') {
        const token = getCookie(CSRF_COOKIE_NAME)
        if (token) {
          init = init || {}
          init.headers = { ...init.headers, [CSRF_HEADER_NAME]: token }
        }
      }

      return originalFetch.call(this, input, init)
    }

    return () => {
      window.fetch = originalFetch
    }
  }, [])

  return <>{children}</>
}
