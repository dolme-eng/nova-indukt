import { NextRequest, NextResponse } from 'next/server'
import { getBankDetails } from '@/lib/data/bank-details'
import { rateLimit, getIP, createRateLimitKey } from '@/lib/rate-limit'

/**
 * Public endpoint — returns current bank details for checkout display.
 * No auth required; data is already publicly visible on the /informations-de-paiement page.
 */
export async function GET(request: NextRequest) {
  try {
    const ip = getIP(request)
    const rl = await rateLimit(createRateLimitKey(ip, 'bank-details'), { windowMs: 60_000, maxRequests: 30 })
    if (!rl.success) {
      return NextResponse.json({ error: 'Zu viele Anfragen. Bitte versuchen Sie es später erneut.' }, { status: 429 })
    }

    const data = await getBankDetails()
    return NextResponse.json(data)
  } catch {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}
