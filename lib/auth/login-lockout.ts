/**
 * Login brute-force protection — in-memory lockout tracker.
 *
 * After MAX_ATTEMPTS failed logins for the same email within WINDOW_MS,
 * the account is temporarily locked for LOCKOUT_MS.
 *
 * In production with Upstash, this could be backed by Redis for
 * distributed lockout across serverless instances. The in-memory
 * fallback is acceptable as a first layer of defense.
 */

interface LoginAttempt {
  count: number
  firstAttemptAt: number
  lockedUntil: number | null
}

const MAX_ATTEMPTS = 5
const WINDOW_MS = 15 * 60 * 1000 // 15 minutes
const LOCKOUT_MS = 30 * 60 * 1000 // 30 minutes lockout

const attempts = new Map<string, LoginAttempt>()

// Periodic cleanup to prevent memory leaks
const CLEANUP_INTERVAL = 5 * 60 * 1000
let lastCleanup = Date.now()

function cleanup() {
  const now = Date.now()
  if (now - lastCleanup < CLEANUP_INTERVAL) return
  lastCleanup = now

  const entries = Array.from(attempts.entries())
  for (const [email, entry] of entries) {
    // Remove expired lockouts and old windows
    if (entry.lockedUntil && entry.lockedUntil < now) {
      attempts.delete(email)
    } else if (entry.firstAttemptAt + WINDOW_MS < now) {
      attempts.delete(email)
    }
  }
}

export function isLockedOut(email: string): boolean {
  cleanup()

  const entry = attempts.get(email)
  if (!entry) return false

  const now = Date.now()

  // Currently locked out
  if (entry.lockedUntil && entry.lockedUntil > now) {
    return true
  }

  // Window expired — reset
  if (entry.firstAttemptAt + WINDOW_MS < now) {
    attempts.delete(email)
    return false
  }

  return false
}

export function recordFailedLogin(email: string): void {
  cleanup()

  const now = Date.now()
  const entry = attempts.get(email)

  if (!entry || entry.firstAttemptAt + WINDOW_MS < now) {
    // New window
    attempts.set(email, {
      count: 1,
      firstAttemptAt: now,
      lockedUntil: null,
    })
    return
  }

  entry.count++

  if (entry.count >= MAX_ATTEMPTS) {
    entry.lockedUntil = now + LOCKOUT_MS
  }
}

export function recordSuccessfulLogin(email: string): void {
  attempts.delete(email)
}

export function getLoginLockoutInfo(email: string): { remainingMs: number } | null {
  const entry = attempts.get(email)
  if (!entry?.lockedUntil) return null

  const remainingMs = entry.lockedUntil - Date.now()
  if (remainingMs <= 0) {
    attempts.delete(email)
    return null
  }

  return { remainingMs }
}
