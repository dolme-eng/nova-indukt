/**
 * Shared Upstash Redis client — singleton lazy-init with TTL.
 *
 * All modules (rate-limit, login-lockout, etc.) should import from here
 * instead of creating their own Redis instances.
 */

import { Redis } from '@upstash/redis'

let _redis: Redis | null = null
let _expiresAt = 0
const SINGLETON_TTL_MS = 5 * 60 * 1000 // 5 minutes

export function getRedis(): Redis | null {
  if (_redis && Date.now() < _expiresAt) return _redis
  const url = process.env.UPSTASH_REDIS_REST_URL
  const token = process.env.UPSTASH_REDIS_REST_TOKEN
  if (!url || !token) return null
  _redis = new Redis({ url, token })
  _expiresAt = Date.now() + SINGLETON_TTL_MS
  return _redis
}
