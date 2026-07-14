import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { rateLimit, getIP, createRateLimitKey } from "@/lib/rate-limit"
import { logError } from "@/lib/logger"

/**
 * API Route pour vérifier l'adresse email.
 * Appelé depuis le lien de vérification envoyé par email.
 */
export async function GET(request: NextRequest) {
  const ip = getIP(request)
  const { success } = await rateLimit(createRateLimitKey(ip, "auth:verify-email"), { windowMs: 3_600_000, maxRequests: 10 })
  if (!success) return NextResponse.json({ error: "Zu viele Anfragen" }, { status: 429 })

  try {
    const { searchParams } = new URL(request.url)
    const token = searchParams.get("token")

    if (!token) {
      return NextResponse.redirect(new URL("/anmelden?error=invalid-token", request.url))
    }

    // Find user with this verification token
    const user = await prisma.user.findFirst({
      where: {
        verificationToken: token,
        verificationTokenExpiry: {
          gt: new Date()
        }
      }
    })

    if (!user) {
      return NextResponse.redirect(new URL("/anmelden?error=invalid-or-expired-token", request.url))
    }

    // Update user: mark email as verified and clear the token
    await prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerified: new Date(),
        verificationToken: null,
        verificationTokenExpiry: null,
      }
    })

    // Redirect to login with success message
    return NextResponse.redirect(new URL("/anmelden?verified=true", request.url))
  } catch (error) {
    logError("Email verification error:", error)
    return NextResponse.redirect(new URL("/anmelden?error=verification-failed", request.url))
  }
}
