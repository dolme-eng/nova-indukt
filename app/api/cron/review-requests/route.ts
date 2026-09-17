import { NextRequest, NextResponse } from 'next/server'
import { sendReviewRequests } from '@/lib/email/automated-emails'
import { logError } from '@/lib/logger'
import { rateLimit, getIP, createRateLimitKey } from '@/lib/rate-limit'
import crypto from 'crypto'

/**
 * Send review request emails.
 * Cron: 0 10 * * * (Every day at 10 AM, see vercel.json).
 * Vercel Cron invokes GET — POST kept for manual/external triggers.
 *
 * This checks for orders delivered 7 days ago and sends review requests
 */
export async function GET(request: NextRequest) {
  return runReviewRequests(request)
}

export async function POST(request: NextRequest) {
  return runReviewRequests(request)
}

async function runReviewRequests(request: NextRequest) {
  const ip = getIP(request)
  const { success } = await rateLimit(createRateLimitKey(ip, 'cron:review-requests'), { windowMs: 60_000, maxRequests: 5 })
  if (!success) return NextResponse.json({ error: 'Zu viele Anfragen' }, { status: 429 })
  try {
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
    
    const result = await sendReviewRequests()
    
    return NextResponse.json({
      ...result,
      success: true,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    logError('Error in review requests cron:', error)
    return NextResponse.json(
      { error: 'Failed to process review requests' },
      { status: 500 }
    )
  }
}
