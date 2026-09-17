import { NextResponse } from 'next/server'
import { getRedis } from '@/lib/redis'
import { logError } from '@/lib/logger'

// Liveness probe — intentionally NOT rate-limited (used to diagnose outages).
// Exposes no sensitive data: only dependency reachability + deploy stamp.
export async function GET() {
  let redis: 'ok' | 'missing' | 'error' = 'missing'
  const redisClient = getRedis()
  if (redisClient) {
    try {
      await redisClient.ping()
      redis = 'ok'
    } catch (err) {
      logError('[health] Redis ping failed:', err)
      redis = 'error'
    }
  }

  const body = {
    status: 'ok',
    redis,
    timestamp: new Date().toISOString(),
  }

  // 503 when a hard dependency is down so monitors/uptime checks fire
  const status = redis === 'error' ? 503 : 200
  const response = NextResponse.json(body, { status })
  response.headers.set('Cache-Control', 'no-store')
  return response
}
