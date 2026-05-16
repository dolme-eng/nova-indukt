import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { hashPassword } from "@/lib/auth/auth.config"
import { registerSchema } from "@/lib/validations/auth"

/**
 * API Route de registration.
 * Le store Zustand (lib/store/auth.ts) appelle cette route via fetch().
 * La logique est dupliquée depuis la Server Action pour éviter les problèmes
 * d'appel de Server Actions depuis une API Route.
 * Validation Zod + bcrypt identiques.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validation Zod stricte — identique à app/actions/auth.ts
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

    // Hash password avec bcrypt (via hashPassword partagé)
    const hashedPassword = await hashPassword(password)

    // Create user
    const user = await prisma.user.create({
      data: {
        email: email.toLowerCase(),
        name,
        password: hashedPassword,
        role: "USER"
      }
    })

    return NextResponse.json({
      success: true,
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
