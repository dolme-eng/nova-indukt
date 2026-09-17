/**
 * Rate limiting module — Upstash Redis (distribué, compatible serverless).
 *
 * Required environment variables:
 *   UPSTASH_REDIS_REST_URL   — URL REST de votre base Redis Upstash
 *   UPSTASH_REDIS_REST_TOKEN — Token d'authentification Upstash
 *
 * - Redis configuré → Sliding Window Redis distribué.
 * - Redis NON configuré → fallback in-memory (dev local uniquement).
 * - Redis configuré mais INJOIGNABLE en production → fail closed (429/503
 *   côté appelant) : un rate-limiter local par instance serait contournable
 *   en distribué et masquerait la panne. En dev → fallback mémoire.
 *
 * Docs : https://upstash.com/docs/redis/sdks/ratelimit-ts/overview
 */

import { Ratelimit } from '@upstash/ratelimit'
import { logError } from '@/lib/logger'
import { getRedis } from '@/lib/redis'

// ── Fallback in-memory (dev local uniquement) ────────────────────────────────

interface Entry {
  count: number
  resetTime: number
}

const MAX_ENTRIES = 10_000
const memoryStore = new Map<string, Entry>()

function evictExpired(): void {
  const now = Date.now()
  for (const [key, entry] of memoryStore) {
    if (entry.resetTime < now) memoryStore.delete(key)
    if (memoryStore.size < MAX_ENTRIES * 0.8) break
  }
}

function memoryRateLimit(
  identifier: string,
  windowMs: number,
  maxRequests: number
): RateLimitResult {
  const now = Date.now()
  if (memoryStore.size >= MAX_ENTRIES) evictExpired()

  const existing = memoryStore.get(identifier)

  if (!existing || existing.resetTime < now) {
    memoryStore.set(identifier, { count: 1, resetTime: now + windowMs })
    return {
      success: true,
      limit: maxRequests,
      remaining: maxRequests - 1,
      resetTime: now + windowMs,
    }
  }

  if (existing.count >= maxRequests) {
    return { success: false, limit: maxRequests, remaining: 0, resetTime: existing.resetTime }
  }

  existing.count++
  return {
    success: true,
    limit: maxRequests,
    remaining: maxRequests - existing.count,
    resetTime: existing.resetTime,
  }
}

// ── Ratelimiter cache ───────────────────────────────────────────────────────

const _ratelimiters: Map<string, Ratelimit> = new Map()

/**
 * Returns an Upstash Ratelimit configured with Sliding Window.
 * La clé cache inclut maxRequests + windowMs pour supporter plusieurs configs.
 */
function getRatelimiter(maxRequests: number, windowSeconds: number): Ratelimit | null {
  const redis = getRedis()
  if (!redis) return null

  const cacheKey = `${maxRequests}:${windowSeconds}`
  if (_ratelimiters.has(cacheKey)) return _ratelimiters.get(cacheKey)!

  const limiter = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(maxRequests, `${windowSeconds} s`),
    prefix: 'nova:rl',
    analytics: false,
  })
  _ratelimiters.set(cacheKey, limiter)
  return limiter
}

// ── Interface publique ───────────────────────────────────────────────────────

export interface RateLimitOptions {
  /** Fenêtre de temps en millisecondes (défaut : 60 000 = 1 min) */
  windowMs?: number
  /** Nombre maximum de requêtes par fenêtre (défaut : 10) */
  maxRequests?: number
  /**
   * Si true, une panne Redis en production dégrade vers le bucket mémoire
   * local au lieu de refuser. Réservé aux lectures publiques (catalogue) :
   * mieux vaut un rate-limit approximatif qu'un catalogue 100 % down.
   * Écritures/auth : laisser false (fail closed).
   */
  allowMemoryFallback?: boolean
}

export interface RateLimitResult {
  success: boolean
  limit: number
  remaining: number
  resetTime: number
}

/**
 * Applies rate limiting to `identifier`.
 *
 * - Redis configuré → Sliding Window Redis distribué.
 * - Redis non configuré → fallback in-memory (dev local).
 * - Redis configuré mais erreur → fail closed en production
 *   (`success: false`), fallback mémoire en dev uniquement.
 *
 * @param identifier - Clé unique, ex. `"${ip}:contact"`
 * @param options    - windowMs et maxRequests
 */
export async function rateLimit(
  identifier: string,
  options: RateLimitOptions = {}
): Promise<RateLimitResult> {
  const windowMs = options.windowMs ?? 60_000
  const maxRequests = options.maxRequests ?? 10
  const windowSeconds = Math.ceil(windowMs / 1000)

  const limiter = getRatelimiter(maxRequests, windowSeconds)

  if (!limiter) {
    // No Redis configured: in-memory fallback (dev local only).
    if (process.env.NODE_ENV === 'production') {
      logError('[rate-limit] Redis not configured in production — falling back to memory')
    }
    return memoryRateLimit(identifier, windowMs, maxRequests)
  }

  try {
    const { success, limit, remaining, reset } = await limiter.limit(identifier)
    return {
      success,
      limit,
      remaining,
      resetTime: Number(reset),
    }
  } catch (err) {
    logError('[rate-limit] Redis error:', err)
    if (process.env.NODE_ENV === 'production' && !options.allowMemoryFallback) {
      // Fail closed: a per-instance memory bucket would be bypassable in
      // serverless and would hide the outage. Callers translate to 429.
      return { success: false, limit: maxRequests, remaining: 0, resetTime: Date.now() + windowMs }
    }
    return memoryRateLimit(identifier, windowMs, maxRequests)
  }
}

/**
 * Standard 429 response with Retry-After + X-RateLimit-* headers so
 * legitimate clients (and auditors) back off instead of hammering.
 */
export function rateLimitResponse(result: RateLimitResult, message = 'Zu viele Anfragen'): Response {
  const retryAfter = Math.max(1, Math.ceil((result.resetTime - Date.now()) / 1000))
  return Response.json(
    { error: message },
    {
      status: 429,
      headers: {
        'Retry-After': String(retryAfter),
        'X-RateLimit-Limit': String(result.limit),
        'X-RateLimit-Remaining': '0',
      },
    }
  )
}

// ── Helpers ──────────────────────────────────────────────────────────────────

/** Extracts the real IP address from request headers */
export function getIP(request: Request): string {
  // Prefer x-real-ip: set (and overwritten) by the hosting edge (Vercel),
  // single value — not spoofable through the proxy.
  const realIp = request.headers.get('x-real-ip')
  if (realIp) {
    const ip = realIp.split(',')[0].trim()
    if (ip) return ip
  }

  // x-forwarded-for is client-controlled on its left side: proxies APPEND
  // the real client IP, so the LAST entry is the most trustworthy, not the first.
  const forwarded = request.headers.get('x-forwarded-for')
  if (forwarded) {
    const parts = forwarded.split(',').map((p) => p.trim()).filter(Boolean)
    if (parts.length > 0) return parts[parts.length - 1]
  }

  return 'unknown'
}

/** Builds the rate-limit key: "<ip>:<route>" */
export function createRateLimitKey(ip: string, route: string): string {
  return `${ip}:${route}`
}
