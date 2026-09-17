import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { resetPasswordSchema } from '@/lib/validations/auth'
import { rateLimit, getIP, createRateLimitKey } from '@/lib/rate-limit'
import { hashPassword } from '@/lib/auth/auth.config'
import { logError } from '@/lib/logger'
import { validateCsrfToken } from '@/lib/csrf'
import { getRedis } from '@/lib/redis'

const RATE_LIMIT_WINDOW = 15 * 60 * 1000 // 15 minutes
const RATE_LIMIT_MAX = 5 // 5 attempts per 15 minutes per IP

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const ip = getIP(request)
    const key = createRateLimitKey(ip, 'reset-password')
    const limitResult = await rateLimit(key, {
      windowMs: RATE_LIMIT_WINDOW,
      maxRequests: RATE_LIMIT_MAX,
    })

    if (!limitResult.success) {
      return NextResponse.json(
        { error: 'Zu viele Anfragen. Bitte versuchen Sie es später erneut.' },
        { status: 429 }
      )
    }

    // CSRF protection
    const csrfError = validateCsrfToken(request)
    if (csrfError) return csrfError

    const body = await request.json()

    // Validation
    const result = resetPasswordSchema.safeParse(body)
    if (!result.success) {
      return NextResponse.json(
        { error: 'Validierung fehlgeschlagen' },
        { status: 400 }
      )
    }

    const { token, password } = result.data

    // Find user with valid reset token
    const user = await prisma.user.findUnique({
      where: { resetToken: token },
    })

    if (!user) {
      return NextResponse.json({ error: 'Ungültiger oder abgelaufener Token' }, { status: 400 })
    }

    // Check token expiry
    if (!user.resetTokenExpiry || user.resetTokenExpiry < new Date()) {
      // Clear expired token
      await prisma.user.update({
        where: { id: user.id },
        data: {
          resetToken: null,
          resetTokenExpiry: null,
        },
      })

      return NextResponse.json(
        { error: 'Token ist abgelaufen. Bitte fordern Sie ein neues Passwort an.' },
        { status: 400 }
      )
    }

    // Hash new password
    const hashedPassword = await hashPassword(password)

    // Update user password, clear reset token, and invalidate existing JWTs
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpiry: null,
        tokenVersion: { increment: 1 },
      },
    })

    // Update middleware tokenVersion cache in Redis (do not del — keep key for revocation check).
    // A failed write is logged loudly: the Edge revocation check degrades until
    // the next login rewrites the key (5-min grace covers fresh tokens).
    const redis = getRedis()
    if (redis) {
      await redis
        .set(`nova:tv:${user.id}`, String(updatedUser.tokenVersion), { ex: 30 * 24 * 3600 })
        .catch((redisError) => logError('[reset-password] tokenVersion cache write failed:', redisError))
    }

    return NextResponse.json(
      { success: true, message: 'Passwort erfolgreich zurückgesetzt' },
      { status: 200 }
    )
  } catch (error) {
    logError('Error in reset password:', error)
    return NextResponse.json({ error: 'Ein Fehler ist aufgetreten' }, { status: 500 })
  }
}
