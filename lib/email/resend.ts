import { Resend } from 'resend'

// Lazy initialization: do NOT throw at module load time so Next.js build
// (static page collection) doesn't fail when env vars are absent.
let _resend: Resend | null = null

export function getResend(): Resend | null {
  if (!process.env.RESEND_API_KEY) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('RESEND_API_KEY is required in production')
    }
    console.warn('RESEND_API_KEY not set - emails disabled')
    return null
  }
  if (!_resend) {
    _resend = new Resend(process.env.RESEND_API_KEY)
  }
  return _resend
}

/** @deprecated Use getResend() instead for lazy initialization */
export const resend = new Proxy({} as Resend, {
  get(_target, prop) {
    const client = getResend()
    if (!client) {
      throw new Error('Resend client not initialized - check RESEND_API_KEY')
    }
    return client[prop as keyof Resend]
  }
})

export const FROM_EMAIL = process.env.FROM_EMAIL || 'noreply@nova-indukt.de'
export const FROM_NAME = process.env.FROM_NAME || 'NOVA INDUKT'
