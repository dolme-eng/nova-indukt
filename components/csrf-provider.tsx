'use client'

import { useEffect } from 'react'

const CSRF_COOKIE_NAME = 'csrf-token'
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
      document.cookie = `${CSRF_COOKIE_NAME}=${token}; Path=/; SameSite=Strict${window.location.protocol === 'https:' ? '; Secure' : ''}`
    }
  }, [])

  return <>{children}</>
}
