import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { z } from "zod"
import crypto from "crypto"
import { rateLimit, getIP, createRateLimitKey } from "@/lib/rate-limit"
import { sendPasswordResetEmail } from "@/lib/email/send"

const forgotPasswordSchema = z.object({
  email: z.string().email("Ungültige E-Mail-Adresse"),
})

const RATE_LIMIT_WINDOW = 60 * 60 * 1000 // 1 hour
const RATE_LIMIT_MAX = 3 // 3 attempts per hour per IP

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const ip = getIP(request)
    const key = createRateLimitKey(ip, 'forgot-password')
    const limitResult = rateLimit(key, {
      windowMs: RATE_LIMIT_WINDOW,
      maxRequests: RATE_LIMIT_MAX,
    })

    if (!limitResult.success) {
      return NextResponse.json(
        { error: "Zu viele Anfragen. Bitte versuchen Sie es später erneut." },
        { status: 429 }
      )
    }

    const body = await request.json()

    // Validation
    const result = forgotPasswordSchema.safeParse(body)
    if (!result.success) {
      return NextResponse.json(
        { error: "Validation failed", details: result.error.flatten() },
        { status: 400 }
      )
    }

    const { email } = result.data

    // Find user
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    })

    // Always return success to prevent email enumeration
    if (!user) {
      return NextResponse.json(
        { success: true, message: "Wenn ein Konto mit dieser E-Mail existiert, wurde eine E-Mail zum Zurücksetzen des Passworts gesendet." },
        { status: 200 }
      )
    }

    // Generate reset token (expires in 1 hour)
    const resetToken = crypto.randomBytes(32).toString("hex")
    const resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000) // 1 hour

    // Save token to user
    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetToken,
        resetTokenExpiry,
      },
    })

    // Send password reset email (non-blocking)
    try {
      await sendPasswordResetEmail(user.email, user.name, resetToken)
    } catch (emailError) {
      console.error("Failed to send password reset email:", emailError)
      // Continue - don't expose email sending failure to user
    }

    return NextResponse.json(
      { success: true, message: "Wenn ein Konto mit dieser E-Mail existiert, wurde eine E-Mail zum Zurücksetzen des Passworts gesendet." },
      { status: 200 }
    )
  } catch (error) {
    console.error("Error in forgot password:", error)
    return NextResponse.json(
      { error: "Ein Fehler ist aufgetreten" },
      { status: 500 }
    )
  }
}
