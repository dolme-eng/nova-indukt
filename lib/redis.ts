/**
 * Shared Upstash Redis client — singleton lazy-init.
 *
 * All modules (rate-limit, login-lockout, etc.) should import from here
 * instead of creating their own Redis instances.
 */

import { Redis } from '@upstash/redis'

let _redis: Redis | null = null

export function getRedis(): Redis | null {
  if (_redis) return _redis
  const url = process.env.UPSTASH_REDIS_REST_URL
  const token = process.env.UPSTASH_REDIS_REST_TOKEN
  if (!url || !token) return null
  _redis = new Redis({ url, token })
  return _redis
}
