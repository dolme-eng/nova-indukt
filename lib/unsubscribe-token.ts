/**
 * Signed unsubscribe token — HMAC-based, time-limited.
 *
 * Prevents mass-unsubscribe attacks by requiring a valid signature
 * and expiry timestamp in the URL.
 */

import crypto from 'crypto'

const SECRET = process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET
if (!SECRET) {
  throw new Error('AUTH_SECRET or NEXTAUTH_SECRET must be set')
}
const SIGNING_SECRET = SECRET
const EXPIRY_MS = 90 * 24 * 60 * 60 * 1000 // 90 days

function sign(data: string): string {
  return crypto.createHmac('sha256', SIGNING_SECRET).update(data).digest('hex')
}

/**
 * Canonical form of the signed payload. Both signing and verification MUST go
 * through this: email addresses are case-insensitive, so signing the raw input
 * and verifying a lower-cased copy produces signatures that never match for
 * mixed-case addresses (silently breaking the one-click unsubscribe link).
 */
function normalizeEmail(email: string): string {
  return email.trim().toLowerCase()
}

/**
 * Generate a signed unsubscribe token for an email address.
 * Returns URL search params string: `email=...&expires=...&sig=...`
 */
export function createUnsubscribeToken(email: string): string {
  const normalized = normalizeEmail(email)
  const expires = Date.now() + EXPIRY_MS
  const data = `${normalized}:${expires}`
  const sig = sign(data)
  return `email=${encodeURIComponent(normalized)}&expires=${expires}&sig=${sig}`
}

/**
 * Verify and extract email from a signed unsubscribe token.
 * Returns the canonical (lower-cased) email if valid, or null if
 * expired/tampered.
 */
export function verifyUnsubscribeToken(
  email: string | null,
  expires: string | null,
  sig: string | null
): string | null {
  if (!email || !expires || !sig) return null

  const expiresMs = parseInt(expires, 10)
  if (isNaN(expiresMs) || Date.now() > expiresMs) return null

  const normalized = normalizeEmail(email)
  const data = `${normalized}:${expires}`
  const expectedSig = sign(data)

  // Timing-safe comparison
  try {
    if (!crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expectedSig))) return null
  } catch {
    return null
  }

  return normalized
}
