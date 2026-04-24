"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { hashPassword } from "@/lib/auth/auth.config"

interface RegisterData {
  name: string
  email: string
  password: string
}

export async function register(data: RegisterData) {
  try {
    // Validate input
    if (!data.email || !data.password || !data.name) {
      return { success: false, error: "Alle Felder sind erforderlich" }
    }
    
    if (data.password.length < 6) {
      return { success: false, error: "Passwort muss mindestens 6 Zeichen lang sein" }
    }
    
    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email }
    })
    
    if (existingUser) {
      return { success: false, error: "Ein Benutzer mit dieser E-Mail existiert bereits" }
    }
    
    // Hash password
    const hashedPassword = await hashPassword(data.password)
    
    // Create user
    const user = await prisma.user.create({
      data: {
        email: data.email,
        name: data.name,
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
