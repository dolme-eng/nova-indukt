import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// WebCrypto API based hash function (Edge Runtime compatible)
async function sha256(message: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(message)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
}

// Generate random salt
function generateSalt(): string {
  const array = new Uint8Array(16)
  crypto.getRandomValues(array)
  return Array.from(array).map(b => b.toString(16).padStart(2, '0')).join('')
}

// Hash password using SHA-256 with salt
async function hashPassword(password: string): Promise<string> {
  const salt = generateSalt()
  const hash = await sha256(password + salt)
  return `${salt}:${hash}`
}

export async function POST(request: NextRequest) {
  try {
    const { name, email, password } = await request.json()
    
    // Validation
    if (!email || !password || !name) {
      return NextResponse.json(
        { success: false, error: "Alle Felder sind erforderlich" },
        { status: 400 }
      )
    }
    
    if (password.length < 6) {
      return NextResponse.json(
        { success: false, error: "Passwort muss mindestens 6 Zeichen lang sein" },
        { status: 400 }
      )
    }
    
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
    console.error("Registration error:", error)
    return NextResponse.json(
      { success: false, error: "Registrierung fehlgeschlagen" },
      { status: 500 }
    )
  }
}
