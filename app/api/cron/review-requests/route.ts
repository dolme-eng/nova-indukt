import { NextRequest, NextResponse } from 'next/server'
import { sendReviewRequests } from '@/lib/email/automated-emails'
import { logError } from '@/lib/logger'
import { rateLimit, getIP, createRateLimitKey } from '@/lib/rate-limit'
import crypto from 'crypto'

/**
 * Send review request emails.
 * Cron: 0 10 * * * (Every day at 10 AM, see vercel.json).
 *
 * POST is the only method that mutates data. GET exists because Vercel Cron
 * can only issue GET, but it is strictly read-only and reports what POST would
 * do: the previous version sent up to 100 emails from a plain GET, which any
 * prefetching browser could trigger.
 */
export async function GET(request: NextRequest) {
  try {
    verifyCronSecret(request)
  } catch (error) {
    return cronErrorResponse(error)
  }

  return NextResponse.json({
    success: true,
    dryRun: true,
    message: 'Read-only preview. POST (or the Vercel Cron GET with the Authorization header) runs the job.',
    timestamp: new Date().toISOString(),
  })
}

export async function POST(request: NextRequest) {
  return runReviewRequests(request)
}

/**
 * Throws on a missing/invalid secret. Deliberately separate from the handler
 * so the secret can be checked *before* the rate limiter.
 */
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

async function runReviewRequests(request: NextRequest) {
  try {
    // Secret first: rate-limiting the legitimate cron by IP was a self-DoS
    // risk, since Vercel Cron invocations can share egress addresses.
    verifyCronSecret(request)
  } catch (error) {
    return cronErrorResponse(error)
  }

  const { success } = await rateLimit(createRateLimitKey(getIP(request), 'cron:review-requests'), {
    windowMs: 60_000,
    maxRequests: 5,
  })
  if (!success) return NextResponse.json({ error: 'Zu viele Anfragen' }, { status: 429 })

  try {
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
