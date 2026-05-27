/**
 * Rate limiting module — Upstash Redis (distribué, compatible serverless Netlify).
 *
 * Variables d'environnement requises :
 *   UPSTASH_REDIS_REST_URL   — URL REST de votre base Redis Upstash
 *   UPSTASH_REDIS_REST_TOKEN — Token d'authentification Upstash
 *
 * Si ces variables sont absentes (dev local sans Redis), on bascule
 * automatiquement sur un fallback in-memory LRU pour ne pas bloquer le dev.
 *
 * Docs : https://upstash.com/docs/redis/sdks/ratelimit-ts/overview
 */

import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

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
    return { success: true, limit: maxRequests, remaining: maxRequests - 1, resetTime: now + windowMs }
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

// ── Upstash Redis client (lazy init) ────────────────────────────────────────

let _redis: Redis | null = null
let _ratelimiters: Map<string, Ratelimit> = new Map()

function getRedis(): Redis | null {
  if (_redis) return _redis
  const url = process.env.UPSTASH_REDIS_REST_URL
  const token = process.env.UPSTASH_REDIS_REST_TOKEN
  if (!url || !token) return null
  _redis = new Redis({ url, token })
  return _redis
}

/**
 * Retourne un Ratelimit Upstash configuré en Sliding Window.
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
 * Applique un rate limit sur `identifier`.
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
    // Fallback in-memory synchrone
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
    // En cas d'erreur Redis (timeout, connexion), on fail-open pour ne pas bloquer les users
    console.error('[rate-limit] Redis error, fail-open:', err)
    return { success: true, limit: maxRequests, remaining: 1, resetTime: Date.now() + windowMs }
  }
}

// ── Helpers ──────────────────────────────────────────────────────────────────

/** Extrait l'adresse IP réelle depuis les headers de la requête */
export function getIP(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for')
  if (forwarded) return forwarded.split(',')[0].trim()
  return request.headers.get('x-real-ip') ?? 'unknown'
}

/** Construit la clé de rate-limit : "<ip>:<route>" */
export function createRateLimitKey(ip: string, route: string): string {
  return `${ip}:${route}`
}
