import { NextRequest, NextResponse } from 'next/server'
import { logError } from '@/lib/logger'

const RECAPTCHA_THRESHOLD = 0.5

export interface RecaptchaResult {
  success: boolean
  score: number
  action: string
  error?: string
}

/**
 * Verify a reCAPTCHA v3 token server-side.
 * Returns null if verification succeeds, or a NextResponse with error if it fails.
 */
export async function verifyRecaptcha(
  request: NextRequest,
  expectedAction: string
): Promise<NextResponse | null> {
  const secret = process.env.RECAPTCHA_SECRET_KEY
  if (!secret) return null // gracefully skip if not configured

  const token = request.headers.get('x-recaptcha-token')
  if (!token) {
    return NextResponse.json({ error: 'reCAPTCHA-Token fehlt' }, { status: 403 })
  }

  try {
    const body = new URLSearchParams()
    body.append('secret', secret)
    body.append('response', token)

    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
    if (ip) body.append('remoteip', ip)

    const res = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      body,
    })

    const data = await res.json()

    if (!data.success) {
      logError('reCAPTCHA verification failed:', data['error-codes'])
      return NextResponse.json({ error: 'reCAPTCHA-Verifizierung fehlgeschlagen' }, { status: 403 })
    }

    if (data.action !== expectedAction) {
      logError(`reCAPTCHA action mismatch: expected "${expectedAction}", got "${data.action}"`)
      return NextResponse.json({ error: 'reCAPTCHA-Aktion ungültig' }, { status: 403 })
    }

    if (data.score < RECAPTCHA_THRESHOLD) {
      logError(`reCAPTCHA low score: ${data.score} (threshold: ${RECAPTCHA_THRESHOLD})`)
      return NextResponse.json({ error: 'Verdächtige Aktivität erkannt' }, { status: 403 })
    }

    return null // success
  } catch (error) {
    logError('reCAPTCHA verification error:', error)
    // Fail open — don't block users if Google API is unreachable
    return null
  }
}
