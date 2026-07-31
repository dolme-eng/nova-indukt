'use client'

import { useEffect, useState } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || ''

declare global {
  interface Window {
    gtag: (...args: unknown[]) => void
    dataLayer: unknown[]
  }
}

export function GoogleAnalytics() {
  const [loaded, setLoaded] = useState(false)
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    if (!GA_MEASUREMENT_ID) return

    const consent = getConsent()
    if (!consent?.analytics) return

    loadGtag(GA_MEASUREMENT_ID)
    setLoaded(true)
  }, [])

  useEffect(() => {
    if (!loaded || !GA_MEASUREMENT_ID) return
    const url = pathname + (searchParams.toString() ? `?${searchParams.toString()}` : '')
    window.gtag('config', GA_MEASUREMENT_ID, { page_path: url })
  }, [pathname, searchParams, loaded])

  return null
}

export function getConsent() {
  if (typeof window === 'undefined') return null
  try {
    const raw = localStorage.getItem('cookie-consent')
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function setGAConsent(granted: boolean) {
  if (!GA_MEASUREMENT_ID || typeof window === 'undefined') return

  window.dataLayer = window.dataLayer || []
  window.gtag =
    window.gtag ||
    function (...args: unknown[]) {
      window.dataLayer.push(args)
    }

  window.gtag('consent', 'update', {
    analytics_storage: granted ? 'granted' : 'denied',
  })

  if (granted && !loaded) {
    loadGtag(GA_MEASUREMENT_ID)
  }
}

let loaded = false

function loadGtag(id: string) {
  if (loaded || typeof window === 'undefined') return
  loaded = true

  window.dataLayer = window.dataLayer || []
  window.gtag =
    window.gtag ||
    function (...args: unknown[]) {
      window.dataLayer.push(args)
    }
  window.gtag('js', new Date())
  window.gtag('config', id, {
    send_page_view: false,
    cookie_flags: 'SameSite=None;Secure',
  })

  const script = document.createElement('script')
  script.async = true
  script.src = `https://www.googletagmanager.com/gtag/js?id=${id}`
  document.head.appendChild(script)
}

export function trackEvent(name: string, params?: Record<string, unknown>) {
  if (!GA_MEASUREMENT_ID || typeof window === 'undefined') return
  window.gtag?.('event', name, params)
}
