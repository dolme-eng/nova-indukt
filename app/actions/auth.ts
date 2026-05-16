"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { hashPassword } from "@/lib/auth/auth.config"
import { registerSchema } from "@/lib/validations/auth"

interface RegisterData {
  name: string
  email: string
  password: string
}

export async function register(data: RegisterData) {
  try {
    // Validation Zod — schéma complet (min 8, majuscule, minuscule, chiffre)
    const parsed = registerSchema.safeParse(data)
    if (!parsed.success) {
      const firstError = parsed.error.issues[0]
      // Traduction des messages Zod en allemand
      const translations: Record<string, string> = {
        "Name must be at least 2 characters": "Name muss mindestens 2 Zeichen haben",
        "Invalid email address": "Ungültige E-Mail-Adresse",
        "Password must be at least 8 characters": "Passwort muss mindestens 8 Zeichen lang sein",
        "Password must contain at least one uppercase letter": "Passwort muss mindestens einen Großbuchstaben enthalten",
        "Password must contain at least one lowercase letter": "Passwort muss mindestens einen Kleinbuchstaben enthalten",
        "Password must contain at least one number": "Passwort muss mindestens eine Ziffer enthalten",
      }
      const message = translations[firstError.message] ?? firstError.message
      return { success: false, error: message }
    }

    const { name, email, password } = parsed.data

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return { success: false, error: "Ein Benutzer mit dieser E-Mail existiert bereits" }
    }

    // Hash password (12 rounds)
    const hashedPassword = await hashPassword(password)

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
        role: "USER"
      }
    })

    revalidatePath("/anmelden")

    return { success: true, user: { id: user.id, email: user.email, name: user.name } }
  } catch (error) {
    console.error("Registration error:", error)
    return { success: false, error: "Registrierung fehlgeschlagen" }
  }
}

// Get user by email (for login validation)
export async function getUserByEmail(email: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        addresses: true
      }
    })
    return user
  } catch (error) {
    console.error("Error fetching user:", error)
    return null
  }
}
