import { NextResponse, type NextRequest } from "next/server"
import { handlers } from "@/lib/auth/auth"
import { rateLimit, getIP, createRateLimitKey } from "@/lib/rate-limit"

// Next.js App Router requires named exports for each HTTP method.
// GET (session/CSRF) stays unthrottled — cheap JWT decode, polled by the client.
// POST (signin/signout/callback = credential-stuffing surface) gets an IP bucket.
export function GET(request: NextRequest) {
  return handlers.GET(request)
}

export async function POST(request: NextRequest) {
  const { success, resetTime, limit } = await rateLimit(
    createRateLimitKey(getIP(request), "auth:nextauth"),
    { windowMs: 60_000, maxRequests: 20 }
  )
  if (!success) {
    return NextResponse.json(
      { error: "Zu viele Anfragen. Bitte warten Sie einen Moment." },
      {
        status: 429,
        headers: {
          "Retry-After": String(Math.ceil((resetTime - Date.now()) / 1000)),
          "X-RateLimit-Limit": String(limit),
          "X-RateLimit-Remaining": "0",
        },
      }
    )
  }
  return handlers.POST(request)
}
