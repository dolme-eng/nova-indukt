'use client'

import { useCallback, useRef } from 'react'

declare global {
  interface Window {
    grecaptcha?: {
      ready: (cb: () => void) => void
      execute: (siteKey: string, options: { action: string }) => Promise<string>
    }
  }
}

const SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY

/**
 * Execute reCAPTCHA v3 and return the token.
 * Returns null if reCAPTCHA is not configured or fails.
 */
export function useRecaptcha() {
  const loadedRef = useRef(false)

  const loadScript = useCallback(() => {
    if (loadedRef.current || !SITE_KEY) return
    if (typeof window === 'undefined') return

    const existing = document.querySelector(`script[src*="recaptcha"][data-sitekey="${SITE_KEY}"]`)
    if (existing) {
      loadedRef.current = true
      return
    }

    const script = document.createElement('script')
    script.src = `https://www.google.com/recaptcha/enterprise.js?render=${SITE_KEY}`
    script.async = true
    script.defer = true
    script.dataset.sitekey = SITE_KEY
    document.head.appendChild(script)
    loadedRef.current = true
  }, [])

  const execute = useCallback(
    async (action: string): Promise<string | null> => {
      if (!SITE_KEY) return null

      loadScript()

      try {
        await new Promise<void>((resolve) => {
          if (window.grecaptcha?.ready) {
            window.grecaptcha.ready(resolve)
          } else {
            const check = setInterval(() => {
              if (window.grecaptcha?.ready) {
                clearInterval(check)
                window.grecaptcha.ready(resolve)
              }
            }, 100)
            // Timeout after 5s
            setTimeout(() => {
              clearInterval(check)
              resolve()
            }, 5000)
          }
        })

        if (!window.grecaptcha) return null

        const token = await window.grecaptcha.execute(SITE_KEY, { action })
        return token
      } catch {
        return null
      }
    },
    [loadScript]
  )

  return { execute }
}
