import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { rateLimit, getIP, createRateLimitKey } from '@/lib/rate-limit'
import { sendContactNotificationEmail } from '@/lib/email/send'
import { logError } from '@/lib/logger'
import { validateCsrfToken } from '@/lib/csrf'
import { verifyRecaptcha } from '@/lib/recaptcha'
import { stripHtml } from '@/lib/utils/sanitize'
import { contactFormSchema } from '@/lib/validations/contact'

const RATE_LIMIT_WINDOW = 60 * 60 * 1000 // 1 hour
const RATE_LIMIT_MAX = 5 // 5 messages per hour per IP

export async function POST(request: NextRequest) {
  try {
    // Rate limiting first (cheap) — before costly Google reCAPTCHA call
    const ip = getIP(request)
    const key = createRateLimitKey(ip, 'contact')
    const limitResult = await rateLimit(key, {
      windowMs: RATE_LIMIT_WINDOW,
      maxRequests: RATE_LIMIT_MAX,
    })

    if (!limitResult.success) {
      return NextResponse.json(
        { error: 'Zu viele Anfragen. Bitte versuchen Sie es später erneut.' },
        { status: 429 }
      )
    }

    const csrfError = validateCsrfToken(request)
    if (csrfError) return csrfError

    const recaptchaError = await verifyRecaptcha(request, 'contact')
    if (recaptchaError) return recaptchaError

    const body = await request.json()

    // Validation
    const result = contactFormSchema.safeParse(body)
    if (!result.success) {
      return NextResponse.json(
        { error: 'Validierung fehlgeschlagen', details: result.error.flatten().fieldErrors },
        { status: 400 }
      )
    }

    const { name: rawName, email: rawEmail, subject: rawSubject, message: rawMessage } = result.data
    const email = rawEmail.toLowerCase()
    const name = stripHtml(rawName)
    const subject = stripHtml(rawSubject)
    const message = stripHtml(rawMessage)

    // Save to database
    const contactMessage = await prisma.contactMessage.create({
      data: {
        name,
        email,
        subject,
        message,
        status: 'NEW',
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
    } catch (emailErr) {
      logError('[CONTACT_EMAIL]', emailErr)
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Nachricht erfolgreich gesendet',
        id: contactMessage.id,
      },
      { status: 201 }
    )
  } catch (error) {
    logError('Error sending contact message:', error)
    return NextResponse.json({ error: 'Nachricht konnte nicht gesendet werden' }, { status: 500 })
  }
}

// Get all contact messages - ADMIN ONLY (désactivé temporairement)
export async function GET() {
  return NextResponse.json({ error: 'Nicht autorisiert' }, { status: 401 })
}
