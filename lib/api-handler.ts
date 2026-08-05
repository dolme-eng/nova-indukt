import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { rateLimit, getIP, createRateLimitKey } from '@/lib/rate-limit'
import { validateCsrfToken } from '@/lib/csrf'
import { verifyRecaptcha } from '@/lib/recaptcha'
import { logError } from '@/lib/logger'
import type { Session } from 'next-auth'

type RouteContext = { params: Promise<Record<string, string>> }
type Handler = (request: NextRequest, context?: RouteContext) => Promise<NextResponse>
type AuthHandler = (request: NextRequest, session: Session, context?: RouteContext) => Promise<NextResponse>

function jsonResponse(status: number, body: Record<string, unknown>): NextResponse {
  return NextResponse.json(body, { status })
}

/**
 * Wraps a handler with try/catch + logError + 500 fallback.
 */
export function withErrorHandling(handler: Handler): Handler {
  return async (request, context) => {
    try {
      return await handler(request, context)
    } catch (error) {
      logError(`Error in ${request.method} ${request.nextUrl.pathname}:`, error)
      return jsonResponse(500, { error: 'Internal Server Error' })
    }
  }
}

/**
 * Wraps a handler with auth check. Passes session to the handler.
 * Options:
 *   - admin: true → requires ADMIN role (403 if not)
 */
export function withAuth(
  handler: AuthHandler,
  options?: { admin?: boolean }
): Handler {
  return async (request, context) => {
    const session = await auth()

    if (!session?.user?.id) {
      return jsonResponse(401, { error: 'Unauthorized' })
    }

    if (options?.admin && session.user.role !== 'ADMIN') {
      return jsonResponse(403, { error: 'Forbidden' })
    }

    return handler(request, session, context)
  }
}

/**
 * Wraps a handler with rate limiting.
 * @param routeKey - Unique key for this route (e.g. "wishlist:post")
 * @param options  - windowMs (default 60s) and maxRequests (default 10)
 */
export function withRateLimit(
  routeKey: string,
  options?: { windowMs?: number; maxRequests?: number }
): (handler: Handler) => Handler {
  return (handler) => async (request, context) => {
    const ip = getIP(request)
    const rl = await rateLimit(createRateLimitKey(ip, routeKey), {
      windowMs: options?.windowMs ?? 60_000,
      maxRequests: options?.maxRequests ?? 10,
    })

    if (!rl.success) {
      return jsonResponse(429, { error: 'Zu viele Anfragen' })
    }

    return handler(request, context)
  }
}

/**
 * Wraps a handler with CSRF token validation.
 */
export function withCsrf(handler: Handler): Handler {
  return async (request, context) => {
    const csrfError = validateCsrfToken(request)
    if (csrfError) return csrfError
    return handler(request, context)
  }
}

/**
 * Wraps a handler with reCAPTCHA verification.
 * @param action - The reCAPTCHA action name (e.g. "checkout", "contact")
 */
export function withRecaptcha(
  action: string
): (handler: Handler) => Handler {
  return (handler) => async (request, context) => {
    const recaptchaError = await verifyRecaptcha(request, action)
    if (recaptchaError) return recaptchaError
    return handler(request, context)
  }
}
