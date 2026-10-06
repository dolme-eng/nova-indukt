/**
 * Login brute-force protection — Upstash Redis lockout tracker.
 *
 * Two independent counters, both required before an account is locked:
 *
 *   - per EMAIL: stops password guessing against one account
 *   - per IP:    stops spraying one password across many accounts
 *
 * Tracking the email alone let anyone lock an arbitrary customer out of their
 * own account for 30 minutes with 5 wrong passwords (an unauthenticated, cheap,
 * targeted denial of service).
 *
 * Uses Upstash Redis when available; falls back to in-memory for local dev.
 */

import { logError } from '@/lib/logger'
import { getRedis } from '@/lib/redis'

const MAX_ATTEMPTS = 5
const MAX_ATTEMPTS_PER_IP = 20
const WINDOW_MS = 15 * 60 * 1000 // 15 minutes
const LOCKOUT_MS = 30 * 60 * 1000 // 30 minutes lockout
const IP_LOCKOUT_MS = 60 * 60 * 1000 // 1 hour — an IP spraying many accounts is worse

// ── In-memory fallback (dev local only) ─────────────────────────────────────

interface LoginAttempt {
  count: number
  firstAttemptAt: number
  lockedUntil: number | null
}

const memoryAttempts = new Map<string, LoginAttempt>()
const memoryIpAttempts = new Map<string, LoginAttempt>()

function purgeIfStale(map: Map<string, LoginAttempt>, key: string, entry: LoginAttempt) {
  const now = Date.now()
  // A live lockout outranks the sliding window: IP_LOCKOUT_MS (1h) is longer
  // than WINDOW_MS (15min), so testing the window first would drop the entry
  // and unblock the IP after 15 minutes.
  if (entry.lockedUntil) {
    if (entry.lockedUntil < now) map.delete(key)
    return
  }
  if (entry.firstAttemptAt + WINDOW_MS < now) map.delete(key)
}

function memoryCleanup() {
  for (const [key, entry] of memoryAttempts) purgeIfStale(memoryAttempts, key, entry)
  for (const [key, entry] of memoryIpAttempts) purgeIfStale(memoryIpAttempts, key, entry)
}

// ── Public API ──────────────────────────────────────────────────────────────

const KEY_PREFIX = 'nova:login:lockout:'
const KEY_ATTEMPTS = 'nova:login:attempts:'
const KEY_IP_PREFIX = 'nova:login:lockout:ip:'
const KEY_IP_ATTEMPTS = 'nova:login:attempts:ip:'

function keyForEmail(email: string): string {
  return email.trim().toLowerCase()
}

function keyForIp(ip: string): string {
  return ip && ip !== 'unknown' ? ip : 'unknown'
}

/** True when this client address is currently blocked from logging in. */
export async function isIpLockedOut(ip: string): Promise<boolean> {
  const redis = getRedis()
  const normalizedIp = keyForIp(ip)

  if (redis) {
    try {
      return (await redis.get<string>(KEY_IP_PREFIX + normalizedIp)) === 'locked'
    } catch (err) {
      logError('[login-lockout] Redis error in isIpLockedOut, falling back to memory:', err)
    }
  }

  memoryCleanup()
  const entry = memoryIpAttempts.get(normalizedIp)
  if (!entry?.lockedUntil) return false
  if (entry.lockedUntil <= Date.now()) {
    memoryIpAttempts.delete(normalizedIp)
    return false
  }
  return true
}

export async function isLockedOut(email: string, ip?: string): Promise<boolean> {
  const redis = getRedis()
  const normalizedEmail = keyForEmail(email)

  if (redis) {
    try {
      const locked = await redis.get<string>(KEY_PREFIX + normalizedEmail)
      if (locked === 'locked') return true
    } catch (err) {
      logError('[login-lockout] Redis error in isLockedOut, falling back to memory:', err)
    }
  }

  // An IP blocked for spraying stays blocked even when the per-account counter
  // has expired — otherwise the same client simply resumes where it stopped.
  if (ip !== undefined && (await isIpLockedOut(ip))) return true

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

export async function recordFailedLogin(email: string, ip?: string): Promise<void> {
  const redis = getRedis()
  const now = Date.now()
  const normalizedEmail = keyForEmail(email)
  const normalizedIp = ip !== undefined ? keyForIp(ip) : null

  if (redis) {
    try {
      const key = KEY_ATTEMPTS + normalizedEmail
      const raw = await redis.get<{ count: number; firstAttemptAt: number }>(key)

      if (!raw || (raw.firstAttemptAt && now - raw.firstAttemptAt > WINDOW_MS)) {
        // New window
        await redis.set(key, { count: 1, firstAttemptAt: now }, { ex: Math.ceil(WINDOW_MS / 1000) })
      } else {
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
      }

      if (normalizedIp) {
        await bumpIpAttempts(normalizedIp, now)
      }
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
  } else {
    entry.count++
    if (entry.count >= MAX_ATTEMPTS) {
      entry.lockedUntil = now + LOCKOUT_MS
    }
  }

  if (normalizedIp) bumpIpAttemptsMemory(normalizedIp, now)
}

/** Second counter: many distinct accounts from one address. */
async function bumpIpAttempts(ip: string, now: number): Promise<void> {
  const redis = getRedis()
  if (!redis) return
  const key = KEY_IP_ATTEMPTS + ip
  const raw = await redis.get<{ count: number; firstAttemptAt: number }>(key)

  if (!raw || (raw.firstAttemptAt && now - raw.firstAttemptAt > WINDOW_MS)) {
    await redis.set(key, { count: 1, firstAttemptAt: now }, { ex: Math.ceil(WINDOW_MS / 1000) })
    return
  }

  const count = (raw.count || 0) + 1
  if (count >= MAX_ATTEMPTS_PER_IP) {
    await redis.set(KEY_IP_PREFIX + ip, 'locked', { ex: Math.ceil(IP_LOCKOUT_MS / 1000) })
  }
  await redis.set(key, { count, firstAttemptAt: raw.firstAttemptAt }, { ex: Math.ceil(WINDOW_MS / 1000) })
}

function bumpIpAttemptsMemory(ip: string, now: number): void {
  const entry = memoryIpAttempts.get(ip)
  if (!entry || entry.firstAttemptAt + WINDOW_MS < now) {
    memoryIpAttempts.set(ip, { count: 1, firstAttemptAt: now, lockedUntil: null })
    return
  }
  entry.count++
  if (entry.count >= MAX_ATTEMPTS_PER_IP) {
    entry.lockedUntil = now + IP_LOCKOUT_MS
  }
}

export async function recordSuccessfulLogin(email: string): Promise<void> {
  const redis = getRedis()
  const normalizedEmail = keyForEmail(email)

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
  const normalizedEmail = keyForEmail(email)

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
