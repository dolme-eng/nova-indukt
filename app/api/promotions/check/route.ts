import { NextRequest, NextResponse } from 'next/server'
import { checkAndCreateRandomPromotion, cleanupExpiredPromotions } from '@/lib/promotions/random-promotions'
import { logError } from '@/lib/logger'
import { rateLimit, getIP, createRateLimitKey } from '@/lib/rate-limit'
import { revalidateTag } from 'next/cache'
import crypto from 'crypto'

// Cron: 0 9 * * * (Every day at 9 AM, see vercel.json)
//
// POST is the only method that writes. Vercel Cron can only issue GET, so GET
// is kept — but it is strictly read-only: the previous version let a plain GET
// (browser prefetch, crawler, leaked link) disable expired promotions and
// create new ones.
export async function GET(request: NextRequest) {
  try {
    verifyCronSecret(request)
  } catch (error) {
    return cronErrorResponse(error)
  }

  return NextResponse.json({
    success: true,
    dryRun: true,
    message: 'Read-only preview. POST runs cleanup + random promotion generation.',
    timestamp: new Date().toISOString(),
  })
}

export async function POST(request: NextRequest) {
  return runPromotionCheck(request)
}

/** Throws on a missing/invalid secret, before the rate limiter. */
function verifyCronSecret(request: NextRequest): void {
  const cronSecret = process.env.CRON_SECRET
  if (!cronSecret) {
    logError('CRON_SECRET is not configured. Rejecting request.')
    const err = new Error('Server configuration error')
    err.name = 'CronConfigError'
    throw err
  }

  const authHeader = request.headers.get('authorization')
  const expected = `Bearer ${cronSecret}`
  if (!authHeader || authHeader.length !== expected.length) {
    const err = new Error('Unauthorized')
    err.name = 'CronAuthError'
    throw err
  }
  if (!crypto.timingSafeEqual(Buffer.from(authHeader), Buffer.from(expected))) {
    const err = new Error('Unauthorized')
    err.name = 'CronAuthError'
    throw err
  }
}

function cronErrorResponse(error: unknown) {
  const name = error instanceof Error ? error.name : ''
  const status = name === 'CronConfigError' ? 500 : 401
  const message = name === 'CronConfigError' ? 'Server configuration error' : 'Unauthorized'
  return NextResponse.json({ error: message }, { status })
}

async function runPromotionCheck(request: NextRequest) {
  try {
    // Secret first. Rate-limiting on IP alone meant Vercel Cron invocations
    // sharing an egress address could 429 the shop's own promotion job.
    verifyCronSecret(request)

    // Rate-limit AFTER the secret so unauthenticated attempts are cheap to
    // reject but can never throttle the legitimate schedule.
    const { success } = await rateLimit(createRateLimitKey(getIP(request), 'promotions:check'), {
      windowMs: 60_000,
      maxRequests: 5,
    })
    if (!success) {
      return NextResponse.json({ error: 'Zu viele Anfragen' }, { status: 429 })
    }

    // Cleanup expired promotions first
    const cleanedCount = await cleanupExpiredPromotions()

    // Try to create a new random promotion
    const created = await checkAndCreateRandomPromotion()

    // Writes happened above — bust the 60s promotions cache
    revalidateTag('promotions', 'default')
    
    return NextResponse.json({
      success: true,
      cleanedCount,
      promotionCreated: created,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    logError('Error in promotion check:', error)
    return NextResponse.json(
      { error: 'Failed to check promotions' },
      { status: 500 }
    )
  }
}
