/**
 * Login brute-force protection — Upstash Redis lockout tracker.
 *
 * After MAX_ATTEMPTS failed logins for the same email within WINDOW_MS,
 * the account is temporarily locked for LOCKOUT_MS.
 *
 * Uses Upstash Redis when available; falls back to in-memory for local dev.
 */

import { logError } from '@/lib/logger'
import { getRedis } from '@/lib/redis'

const MAX_ATTEMPTS = 5
const WINDOW_MS = 15 * 60 * 1000 // 15 minutes
const LOCKOUT_MS = 30 * 60 * 1000 // 30 minutes lockout

// ── In-memory fallback (dev local only) ─────────────────────────────────────

interface LoginAttempt {
  count: number
  firstAttemptAt: number
  lockedUntil: number | null
}

const memoryAttempts = new Map<string, LoginAttempt>()

function memoryCleanup() {
  const now = Date.now()
  for (const [email, entry] of memoryAttempts) {
    if (entry.lockedUntil && entry.lockedUntil < now) {
      memoryAttempts.delete(email)
    } else if (entry.firstAttemptAt + WINDOW_MS < now) {
      memoryAttempts.delete(email)
    }
  }
}

// ── Public API ──────────────────────────────────────────────────────────────

const KEY_PREFIX = 'nova:login:lockout:'
const KEY_ATTEMPTS = 'nova:login:attempts:'

export async function isLockedOut(email: string): Promise<boolean> {
  const redis = getRedis()
  const normalizedEmail = email.toLowerCase()

  if (redis) {
    try {
      const locked = await redis.get<string>(KEY_PREFIX + normalizedEmail)
      return locked === 'locked'
    } catch (err) {
      logError('[login-lockout] Redis error in isLockedOut, falling back to memory:', err)
    }
  }

  // Fallback: in-memory
  memoryCleanup()
  const entry = memoryAttempts.get(normalizedEmail)
  if (!entry) return false
  const now = Date.now()
  if (entry.lockedUntil && entry.lockedUntil > now) return true
  if (entry.firstAttemptAt + WINDOW_MS < now) {
    memoryAttempts.delete(normalizedEmail)
    return false
  }
  return false
}

export async function recordFailedLogin(email: string): Promise<void> {
  const redis = getRedis()
  const now = Date.now()
  const normalizedEmail = email.toLowerCase()

  if (redis) {
    try {
      const key = KEY_ATTEMPTS + normalizedEmail
      const raw = await redis.get<{ count: number; firstAttemptAt: number }>(key)

      if (!raw || (raw.firstAttemptAt && now - raw.firstAttemptAt > WINDOW_MS)) {
        // New window
        await redis.set(key, { count: 1, firstAttemptAt: now }, { ex: Math.ceil(WINDOW_MS / 1000) })
        return
      }

      const count = (raw.count || 0) + 1
      if (count >= MAX_ATTEMPTS) {
        // Lock the account
        await redis.set(KEY_PREFIX + normalizedEmail, 'locked', { ex: Math.ceil(LOCKOUT_MS / 1000) })
      }
      await redis.set(
        key,
        { count, firstAttemptAt: raw.firstAttemptAt },
        { ex: Math.ceil(WINDOW_MS / 1000) }
      )
      return
    } catch (err) {
      logError('[login-lockout] Redis error in recordFailedLogin, falling back to memory:', err)
    }
  }

  // Fallback: in-memory
  memoryCleanup()
  const entry = memoryAttempts.get(normalizedEmail)

  if (!entry || entry.firstAttemptAt + WINDOW_MS < now) {
    memoryAttempts.set(normalizedEmail, { count: 1, firstAttemptAt: now, lockedUntil: null })
    return
  }

  entry.count++
  if (entry.count >= MAX_ATTEMPTS) {
    entry.lockedUntil = now + LOCKOUT_MS
  }
}

export async function recordSuccessfulLogin(email: string): Promise<void> {
  const redis = getRedis()
  const normalizedEmail = email.toLowerCase()

  if (redis) {
    try {
      await redis.del(KEY_PREFIX + normalizedEmail)
      await redis.del(KEY_ATTEMPTS + normalizedEmail)
    } catch (err) {
      logError('[login-lockout] Redis error in recordSuccessfulLogin:', err)
    }
    return
  }

  memoryAttempts.delete(normalizedEmail)
}

export async function getLoginLockoutInfo(email: string): Promise<{ remainingMs: number } | null> {
  const redis = getRedis()
  const normalizedEmail = email.toLowerCase()

  if (redis) {
    try {
      const ttl = await redis.pttl(KEY_PREFIX + normalizedEmail)
      if (ttl > 0) return { remainingMs: ttl }
    } catch (err) {
      logError('[login-lockout] Redis error in getLoginLockoutInfo, falling back to memory:', err)
    }
  }

  // Fallback: in-memory
  const entry = memoryAttempts.get(normalizedEmail)
  if (!entry?.lockedUntil) return null
  const remainingMs = entry.lockedUntil - Date.now()
  if (remainingMs <= 0) {
    memoryAttempts.delete(normalizedEmail)
    return null
  }
  return { remainingMs }
}
