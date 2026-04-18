import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { z } from "zod"
import { rateLimit, getIP, createRateLimitKey } from "@/lib/rate-limit"
import { sendContactNotificationEmail } from '@/lib/email/send'

const RATE_LIMIT_WINDOW = 60 * 60 * 1000 // 1 hour
const RATE_LIMIT_MAX = 5 // 5 messages per hour per IP

const contactSchema = z.object({
  name: z.string().min(2, "Name muss mindestens 2 Zeichen haben"),
  email: z.string().email("Ungültige E-Mail-Adresse"),
  subject: z.string().min(3, "Betreff muss mindestens 3 Zeichen haben"),
  message: z.string().min(10, "Nachricht muss mindestens 10 Zeichen haben"),
})

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const ip = getIP(request)
    const key = createRateLimitKey(ip, 'contact')
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
    const result = contactSchema.safeParse(body)
    if (!result.success) {
      return NextResponse.json(
        { error: "Validation failed", details: result.error.flatten() },
        { status: 400 }
      )
    }
    
    const { name, email, subject, message } = result.data
    
    // Save to database
    const contactMessage = await prisma.contactMessage.create({
      data: {
        name,
        email,
        subject,
        message,
        status: "NEW",
      },
    })

    // Send admin notification email (non-blocking)
    try {
      await sendContactNotificationEmail(
        name,
        email,
        subject,
        message,
        contactMessage.id,
        contactMessage.createdAt
      )
    } catch (emailError) {
      console.error("Failed to send contact notification email:", emailError)
      // Continue - message is still saved even if email fails
    }

    return NextResponse.json(
      { 
        success: true, 
        message: "Nachricht erfolgreich gesendet",
        id: contactMessage.id 
      },
      { status: 201 }
    )
  } catch (error) {
    console.error("Error saving contact message:", error)
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 }
    )
  }
}

// Get all contact messages - ADMIN ONLY (désactivé temporairement)
export async function GET(request: NextRequest) {
  return NextResponse.json(
    { error: "Admin access required" },
    { status: 403 }
  )
}
