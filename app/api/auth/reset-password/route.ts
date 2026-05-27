import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { z } from "zod"
import { rateLimit, getIP, createRateLimitKey } from "@/lib/rate-limit"
import { hashPassword } from "@/lib/auth/auth.config"

const resetPasswordSchema = z.object({
  token: z.string().min(1, "Token ist erforderlich"),
  password: z.string().min(8, "Passwort muss mindestens 8 Zeichen lang sein"),
})

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
        { error: "Zu viele Anfragen. Bitte versuchen Sie es später erneut." },
        { status: 429 }
      )
    }

    const body = await request.json()

    // Validation
    const result = resetPasswordSchema.safeParse(body)
    if (!result.success) {
      return NextResponse.json(
        { error: "Validation failed", details: result.error.flatten() },
        { status: 400 }
      )
    }

    const { token, password } = result.data

    // Find user with valid reset token
    const user = await prisma.user.findUnique({
      where: { resetToken: token },
    })

    if (!user) {
      return NextResponse.json(
        { error: "Ungültiger oder abgelaufener Token" },
        { status: 400 }
      )
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
        { error: "Token ist abgelaufen. Bitte fordern Sie ein neues Passwort an." },
        { status: 400 }
      )
    }

    // Hash new password
    const hashedPassword = await hashPassword(password)

    // Update user password and clear reset token
    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpiry: null,
      },
    })

    return NextResponse.json(
      { success: true, message: "Passwort erfolgreich zurückgesetzt" },
      { status: 200 }
    )
  } catch (error) {
    console.error("Error in reset password:", error)
    return NextResponse.json(
      { error: "Ein Fehler ist aufgetreten" },
      { status: 500 }
    )
  }
}
