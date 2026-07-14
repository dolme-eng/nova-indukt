import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { hashPassword } from "@/lib/auth/auth.config"
import { registerSchema } from "@/lib/validations/auth"
import { rateLimit, getIP, createRateLimitKey } from "@/lib/rate-limit"
import crypto from "crypto"
import { sendEmailWithRetry, FROM_EMAIL, FROM_NAME } from "@/lib/email/send"
import EmailVerificationEmail from "@/lib/email/templates/email-verification"
import { render } from "@react-email/render"

/**
 * API Route de registration.
 * Envoie un email de vérification après l'inscription.
 */
export async function POST(request: NextRequest) {
  try {
    // Rate limit: 5 registrations per hour per IP
    const ip = getIP(request)
    const rl = await rateLimit(createRateLimitKey(ip, "register"), {
      windowMs: 60 * 60 * 1000,
      maxRequests: 5,
    })
    if (!rl.success) {
      return NextResponse.json(
        { success: false, error: "Zu viele Anfragen. Bitte versuchen Sie es später erneut." },
        { status: 429 }
      )
    }

    const body = await request.json()

    // Validation Zod stricte
    const parsed = registerSchema.safeParse(body)
    if (!parsed.success) {
      const firstError = parsed.error.issues[0]
      const translations: Record<string, string> = {
        "Name must be at least 2 characters": "Name muss mindestens 2 Zeichen haben",
        "Invalid email address": "Ungültige E-Mail-Adresse",
        "Password must be at least 8 characters": "Passwort muss mindestens 8 Zeichen lang sein",
        "Password must contain at least one uppercase letter": "Passwort muss mindestens einen Großbuchstaben enthalten",
        "Password must contain at least one lowercase letter": "Passwort muss mindestens einen Kleinbuchstaben enthalten",
        "Password must contain at least one number": "Passwort muss mindestens eine Ziffer enthalten",
      }
      const message = translations[firstError.message] ?? firstError.message
      return NextResponse.json(
        { success: false, error: message },
        { status: 400 }
      )
    }

    const { name, email, password } = parsed.data

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    })

    if (existingUser) {
      return NextResponse.json(
        { success: false, error: "Ein Benutzer mit dieser E-Mail existiert bereits" },
        { status: 409 }
      )
    }

    // Hash password
    const hashedPassword = await hashPassword(password)

    // Generate verification token
    const verificationToken = crypto.randomBytes(32).toString("hex")
    const verificationExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours

    // Create user
    const user = await prisma.user.create({
      data: {
        email: email.toLowerCase(),
        name,
        password: hashedPassword,
        role: "USER",
        verificationToken: verificationToken,
        verificationTokenExpiry: verificationExpiry,
      }
    })

    // Send verification email
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://nova-indukt.de"
    const verificationUrl = `${siteUrl}/api/auth/verify-email?token=${verificationToken}`

    const html = await render(
      EmailVerificationEmail({
        firstName: name?.split(" ")[0],
        verificationUrl,
        expiresIn: "24 Stunden",
      })
    )

    await sendEmailWithRetry({
      from: `${FROM_NAME} <${FROM_EMAIL}>`,
      to: email.toLowerCase(),
      subject: "E-Mail-Adresse verifizieren - NOVA INDUKT",
      html,
    })

    return NextResponse.json({
      success: true,
      message: "Registrierung erfolgreich. Bitte überprüfen Sie Ihre E-Mail zur Verifizierung.",
      user: {
        id: user.id,
        email: user.email,
        name: user.name
      }
    })
  } catch (error) {
    console.error("Registration API error:", error)
    return NextResponse.json(
      { success: false, error: "Registrierung fehlgeschlagen" },
      { status: 500 }
    )
  }
}
