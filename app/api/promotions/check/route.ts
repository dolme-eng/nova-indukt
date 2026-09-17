import { NextRequest, NextResponse } from 'next/server'
import { checkAndCreateRandomPromotion, cleanupExpiredPromotions } from '@/lib/promotions/random-promotions'
import { logError } from '@/lib/logger'
import { rateLimit, getIP, createRateLimitKey } from '@/lib/rate-limit'
import { revalidateTag } from 'next/cache'
import crypto from 'crypto'

// API Route: Check and create random promotions
// Should be called by a cron job (e.g., Vercel Cron, GitHub Actions)
// 
// Cron: 0 9 * * * (Every day at 9 AM)
// Or: Every 30 minutes (30 * * * *) for more frequent checks
// Vercel Cron invokes GET — POST kept for manual/external triggers.
export async function GET(request: NextRequest) {
  return runPromotionCheck(request)
}

export async function POST(request: NextRequest) {
  return runPromotionCheck(request)
}

async function runPromotionCheck(request: NextRequest) {
  try {
    // Rate-limit before secret check — slows online brute-force of CRON_SECRET
    const { success } = await rateLimit(createRateLimitKey(getIP(request), 'promotions:check'), {
      windowMs: 60_000,
      maxRequests: 5,
    })
    if (!success) {
      return NextResponse.json({ error: 'Zu viele Anfragen' }, { status: 429 })
    }

    // Verify cron secret — mandatory in all environments (fail closed)
    const authHeader = request.headers.get('authorization')
    const cronSecret = process.env.CRON_SECRET
    
    if (!cronSecret) {
      logError('CRON_SECRET is not configured. Rejecting request.')
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      )
    }
    
    // Timing-safe Bearer comparison
    const expected = `Bearer ${cronSecret}`
    if (!authHeader || authHeader.length !== expected.length) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }
    if (!crypto.timingSafeEqual(Buffer.from(authHeader), Buffer.from(expected))) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
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
