import { Resend } from 'resend'

// Lazy initialization: do NOT throw at module load time so Next.js build
// (static page collection) doesn't fail when env vars are absent.
let _resend: Resend | null = null

export function getResend(): Resend {
  if (!process.env.RESEND_API_KEY) {
    throw new Error('RESEND_API_KEY is not defined')
  }
  if (!_resend) {
    _resend = new Resend(process.env.RESEND_API_KEY)
  }
  return _resend
}

/** @deprecated Use getResend() instead for lazy initialization */
export const resend = new Proxy({} as Resend, {
  get(_target, prop) {
    return getResend()[prop as keyof Resend]
  }
})

export const FROM_EMAIL = process.env.FROM_EMAIL || 'noreply@nova-indukt.de'
export const FROM_NAME = process.env.FROM_NAME || 'NOVA INDUKT'
