import { NextRequest, NextResponse } from 'next/server'
import { rateLimit, getIP, createRateLimitKey } from "@/lib/rate-limit"

/**
 * Stock management is handled externally.
 * This endpoint is deprecated and returns a no-op response.
 */
export async function GET(request: NextRequest) {
  const ip = getIP(request)
  const { success } = await rateLimit(createRateLimitKey(ip, "cron:stock-check"), { windowMs: 60_000, maxRequests: 5 })
  if (!success) return NextResponse.json({ error: "Zu viele Anfragen" }, { status: 429 })

  return NextResponse.json({
    success: true,
    message: 'Stock management is handled externally.',
    timestamp: new Date().toISOString(),
  })
}
