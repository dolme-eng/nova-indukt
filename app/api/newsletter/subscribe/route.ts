import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { z } from "zod"
import { rateLimit, getIP, createRateLimitKey } from "@/lib/rate-limit"

const RATE_LIMIT_WINDOW = 60 * 60 * 1000 // 1 hour
const RATE_LIMIT_MAX = 10 // 10 subscriptions per hour per IP

const subscribeSchema = z.object({
  email: z.string().email("Ungültige E-Mail-Adresse"),
  firstName: z.string().optional(),
  source: z.string().default("homepage"),
})

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const ip = getIP(request)
    const key = createRateLimitKey(ip, 'newsletter-subscribe')
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
    const result = subscribeSchema.safeParse(body)
    if (!result.success) {
      return NextResponse.json(
        { error: "Validation failed", details: result.error.flatten() },
        { status: 400 }
      )
    }
    
    const { email, firstName, source } = result.data
    
    // Check if already subscribed
    const existing = await prisma.newsletterSubscriber.findUnique({
      where: { email }
    })
    
    if (existing) {
      if (existing.isActive) {
        return NextResponse.json(
          { error: "Diese E-Mail ist bereits angemeldet" },
          { status: 409 }
        )
      }
      
      // Reactivate subscription
      const updated = await prisma.newsletterSubscriber.update({
        where: { email },
        data: {
          isActive: true,
          unsubscribedAt: null,
          firstName: firstName || existing.firstName,
          source: source || existing.source,
        }
      })
      
      return NextResponse.json(
        { 
          success: true, 
          message: "Newsletter-Anmeldung reaktiviert",
          id: updated.id 
        },
        { status: 200 }
      )
    }
    
    // Create new subscription
    const subscriber = await prisma.newsletterSubscriber.create({
      data: {
        email,
        firstName,
        source,
        isActive: true,
      }
    })
    
    // TODO: Send confirmation email (Resend)
    
    return NextResponse.json(
      { 
        success: true, 
        message: "Erfolgreich zum Newsletter angemeldet",
        id: subscriber.id 
      },
      { status: 201 }
    )
  } catch (error) {
    console.error("Error subscribing to newsletter:", error)
    return NextResponse.json(
      { error: "Anmeldung fehlgeschlagen" },
      { status: 500 }
    )
  }
}
