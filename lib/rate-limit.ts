/**
 * Rate limiting module — Upstash Redis (distribué, compatible serverless Netlify).
 *
 * Required environment variables:
 *   UPSTASH_REDIS_REST_URL   — URL REST de votre base Redis Upstash
 *   UPSTASH_REDIS_REST_TOKEN — Token d'authentification Upstash
 *
 * Si ces variables sont absentes :
 *   - En dev local → fallback in-memory (suffisant pour un seul process)
 *   - En production → fail closed (bloque les requêtes) car le fallback
 *     in-memory est inutile en serverless (pas de partage entre instances)
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
 * - En production avec Upstash configuré → Sliding Window Redis distribué.
 * - Sinon (dev / Redis non configuré) → fallback in-memory (non distribué).
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
    // No Redis configured:
    // - In dev: use in-memory fallback (single process, sufficient)
    // - In production: fail closed (in-memory is useless in serverless)
    if (process.env.NODE_ENV === 'production') {
      logError('[rate-limit] Redis not configured in production — failing closed')
      return { success: false, limit: maxRequests, remaining: 0, resetTime: Date.now() + windowMs }
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
    // On Redis error, fail closed in production to prevent abuse
    logError('[rate-limit] Redis error, failing closed:', err)
    if (process.env.NODE_ENV === 'production') {
      return { success: false, limit: maxRequests, remaining: 0, resetTime: Date.now() + windowMs }
    }
    return { success: true, limit: maxRequests, remaining: 1, resetTime: Date.now() + windowMs }
  }
}

// ── Helpers ──────────────────────────────────────────────────────────────────

/** Extracts the real IP address from request headers */
export function getIP(request: Request): string {
  // In production behind Vercel/cloud proxy, only trust x-real-ip
  // x-forwarded-for can be spoofed by clients
  const realIp = request.headers.get('x-real-ip')
  if (realIp) return realIp.trim().split(',')[0]

  const forwarded = request.headers.get('x-forwarded-for')
  if (forwarded) {
    // Take only the first IP (the original client)
    return forwarded.split(',')[0].trim()
  }
  return 'unknown'
}

/** Builds the rate-limit key: "<ip>:<route>" */
export function createRateLimitKey(ip: string, route: string): string {
  return `${ip}:${route}`
}
