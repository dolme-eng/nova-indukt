/**
 * Rate limiting module — in-memory avec LRU eviction.
 *
 * ⚠️  LIMITATION PRODUCTION (Netlify / serverless) :
 *     Chaque Function instance a sa propre mémoire isolée.
 *     Ce store N'EST PAS partagé entre instances parallèles.
 *     → Un attaquant peut contourner ce rate limit en distribuant
 *       ses requêtes sur plusieurs instances.
 *
 * 🔧  MIGRATION RECOMMANDÉE vers Upstash Redis :
 *     1. npm install @upstash/ratelimit @upstash/redis
 *     2. Ajouter UPSTASH_REDIS_REST_URL et UPSTASH_REDIS_REST_TOKEN dans .env
 *     3. Remplacer ce module par :
 *
 *     import { Ratelimit } from "@upstash/ratelimit"
 *     import { Redis } from "@upstash/redis"
 *     const ratelimit = new Ratelimit({
 *       redis: Redis.fromEnv(),
 *       limiter: Ratelimit.slidingWindow(10, "60 s"),
 *     })
 *     const { success } = await ratelimit.limit(identifier)
 *
 *  En attendant, ce module est suffisant pour ralentir les abus
 *  sur une instance unique (dev, preview déployé seul).
 */

interface Entry {
  count: number
  resetTime: number
}

// Capacité max du store avant eviction des entrées les plus anciennes
const MAX_ENTRIES = 10_000
const store = new Map<string, Entry>()

function evictExpired(): void {
  const now = Date.now()
  for (const [key, entry] of store) {
    if (entry.resetTime < now) store.delete(key)
    // Arrêt anticipé : on ne nettoie pas tout si c'est déjà OK
    if (store.size < MAX_ENTRIES * 0.8) break
  }
}

interface RateLimitOptions {
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

export function rateLimit(
  identifier: string,
  options: RateLimitOptions = {}
): RateLimitResult {
  const windowMs = options.windowMs ?? 60_000
  const maxRequests = options.maxRequests ?? 10
  const now = Date.now()

  // Nettoyage périodique si le store grossit trop
  if (store.size >= MAX_ENTRIES) evictExpired()

  const existing = store.get(identifier)

  if (!existing || existing.resetTime < now) {
    // Nouvelle fenêtre
    store.set(identifier, { count: 1, resetTime: now + windowMs })
    return { success: true, limit: maxRequests, remaining: maxRequests - 1, resetTime: now + windowMs }
  }

  if (existing.count >= maxRequests) {
    return {
      success: false,
      limit: maxRequests,
      remaining: 0,
      resetTime: existing.resetTime,
    }
  }

  existing.count++
  return {
    success: true,
    limit: maxRequests,
    remaining: maxRequests - existing.count,
    resetTime: existing.resetTime,
  }
}

// ── Helpers ─────────────────────────────────────────────────────────────────

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
