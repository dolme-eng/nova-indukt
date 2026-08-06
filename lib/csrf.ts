import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'

const CSRF_COOKIE_NAME = 'csrf-token'
const CSRF_HEADER_NAME = 'x-csrf-token'

export function validateCsrfToken(request: NextRequest): NextResponse | null {
  // Use dedicated env var instead of NODE_ENV to prevent test env leaking to production
  if (process.env.CSRF_DISABLED === 'true') return null

  const headerToken = request.headers.get(CSRF_HEADER_NAME)
  const cookieToken = request.cookies.get(CSRF_COOKIE_NAME)?.value

  if (!headerToken || !cookieToken) {
    return NextResponse.json(
      { error: 'CSRF-Token fehlt' },
      { status: 403 }
    )
  }

  try {
    if (!crypto.timingSafeEqual(Buffer.from(headerToken), Buffer.from(cookieToken))) {
      return NextResponse.json(
        { error: 'CSRF-Token ungültig' },
        { status: 403 }
      )
    }
  } catch {
    return NextResponse.json(
      { error: 'CSRF-Token ungültig' },
      { status: 403 }
    )
  }

  return null
}
