import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const unsubscribeSchema = z.object({
  email: z.string().email("Ungültige E-Mail-Adresse"),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validation
    const result = unsubscribeSchema.safeParse(body)
    if (!result.success) {
      return NextResponse.json(
        { error: "Validation failed", details: result.error.flatten() },
        { status: 400 }
      )
    }
    
    const { email } = result.data
    
    // Check if subscriber exists
    const existing = await prisma.newsletterSubscriber.findUnique({
      where: { email }
    })
    
    if (!existing) {
      return NextResponse.json(
        { error: "E-Mail nicht gefunden" },
        { status: 404 }
      )
    }
    
    if (!existing.isActive) {
      return NextResponse.json(
        { error: "Diese E-Mail ist bereits abgemeldet" },
        { status: 409 }
      )
    }
    
    // Unsubscribe
    await prisma.newsletterSubscriber.update({
      where: { email },
      data: {
        isActive: false,
        unsubscribedAt: new Date(),
      }
    })
    
    return NextResponse.json(
      { 
        success: true, 
        message: "Erfolgreich vom Newsletter abgemeldet"
      },
      { status: 200 }
    )
  } catch (error) {
    console.error("Error unsubscribing from newsletter:", error)
    return NextResponse.json(
      { error: "Abmeldung fehlgeschlagen" },
      { status: 500 }
    )
  }
}

// Also support GET with token for unsubscribe links in emails
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const email = searchParams.get("email")
    
    if (!email) {
      return NextResponse.json(
        { error: "E-Mail erforderlich" },
        { status: 400 }
      )
    }
    
    // Validate email format
    const result = unsubscribeSchema.safeParse({ email })
    if (!result.success) {
      return NextResponse.json(
        { error: "Ungültige E-Mail-Adresse" },
        { status: 400 }
      )
    }
    
    const existing = await prisma.newsletterSubscriber.findUnique({
      where: { email }
    })
    
    if (!existing || !existing.isActive) {
      // Return success anyway to not leak info
      return NextResponse.json(
        { 
          success: true, 
          message: "Erfolgreich vom Newsletter abgemeldet"
        },
        { status: 200 }
      )
    }
    
    // Unsubscribe
    await prisma.newsletterSubscriber.update({
      where: { email },
      data: {
        isActive: false,
        unsubscribedAt: new Date(),
      }
    })
    
    return NextResponse.json(
      { 
        success: true, 
        message: "Erfolgreich vom Newsletter abgemeldet"
      },
      { status: 200 }
    )
  } catch (error) {
    console.error("Error unsubscribing from newsletter:", error)
    return NextResponse.json(
      { error: "Abmeldung fehlgeschlagen" },
      { status: 500 }
    )
  }
}
