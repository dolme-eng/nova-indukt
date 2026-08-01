/**
 * Signed unsubscribe token — HMAC-based, time-limited.
 *
 * Prevents mass-unsubscribe attacks by requiring a valid signature
 * and expiry timestamp in the URL.
 */

import crypto from 'crypto'

const SECRET = process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET || 'fallback-dev-secret'
const EXPIRY_MS = 365 * 24 * 60 * 60 * 1000 // 1 year (emails are long-lived)

function sign(data: string): string {
  return crypto.createHmac('sha256', SECRET).update(data).digest('hex').slice(0, 16)
}

/**
 * Generate a signed unsubscribe token for an email address.
 * Returns URL search params string: `email=...&expires=...&sig=...`
 */
export function createUnsubscribeToken(email: string): string {
  const expires = Date.now() + EXPIRY_MS
  const data = `${email}:${expires}`
  const sig = sign(data)
  return `email=${encodeURIComponent(email)}&expires=${expires}&sig=${sig}`
}

/**
 * Verify and extract email from a signed unsubscribe token.
 * Returns the email if valid, or null if expired/tampered.
 */
export function verifyUnsubscribeToken(
  email: string | null,
  expires: string | null,
  sig: string | null
): string | null {
  if (!email || !expires || !sig) return null

  const expiresMs = parseInt(expires, 10)
  if (isNaN(expiresMs) || Date.now() > expiresMs) return null

  const data = `${email}:${expires}`
  const expectedSig = sign(data)

  // Timing-safe comparison
  try {
    if (!crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expectedSig))) return null
  } catch {
    return null
  }

  return email.toLowerCase()
}
