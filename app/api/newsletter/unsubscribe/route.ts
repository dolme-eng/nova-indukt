import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { rateLimit, getIP, createRateLimitKey } from '@/lib/rate-limit'
import { logError } from '@/lib/logger'

const unsubscribeSchema = z.object({
  email: z.string().email('Ungültige E-Mail-Adresse'),
})

const HTML_TEMPLATE = `<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Newsletter abgemeldet – NOVA INDUKT</title>
  <style>
    body { font-family: system-ui, sans-serif; display: flex; justify-content: center; align-items: center; min-height: 100vh; margin: 0; background: #f8f9fa; }
    .card { background: white; border-radius: 16px; padding: 48px; max-width: 480px; text-align: center; box-shadow: 0 4px 24px rgba(0,0,0,0.06); }
    h1 { font-size: 24px; color: #1a1a2e; margin-bottom: 12px; }
    p { color: #6b7280; line-height: 1.6; }
    a { color: #c9a96e; text-decoration: none; font-weight: 600; }
    a:hover { text-decoration: underline; }
  </style>
</head>
<body>
  <div class="card">
    <h1>Erfolgreich abgemeldet</h1>
    <p>Sie wurden erfolgreich vom NOVA INDUKT Newsletter abgemeldet. Sie werden keine weiteren E-Mails erhalten.</p>
    <p style="margin-top: 24px"><a href="/">← Zurück zur Startseite</a></p>
  </div>
</body>
</html>`

export async function POST(request: NextRequest) {
  try {
    const rl = await rateLimit(createRateLimitKey(getIP(request), 'newsletter:unsub'), {
      windowMs: 60_000,
      maxRequests: 5,
    })
    if (!rl.success) return NextResponse.json({ error: 'Zu viele Anfragen' }, { status: 429 })

    const body = await request.json()

    const result = unsubscribeSchema.safeParse(body)
    if (!result.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: result.error.flatten() },
        { status: 400 }
      )
    }

    const { email } = result.data

    const existing = await prisma.newsletterSubscriber.findUnique({
      where: { email },
    })

    if (existing && existing.isActive) {
      await prisma.newsletterSubscriber.update({
        where: { email },
        data: {
          isActive: false,
          unsubscribedAt: new Date(),
        },
      })
    }

    return new NextResponse(HTML_TEMPLATE, {
      status: 200,
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
    })
  } catch (error) {
    logError('Error unsubscribing from newsletter:', error)
    return NextResponse.json({ error: 'Abmeldung fehlgeschlagen' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const rl = await rateLimit(createRateLimitKey(getIP(request), 'newsletter:unsub'), {
      windowMs: 60_000,
      maxRequests: 10,
    })
    if (!rl.success) {
      return new NextResponse(HTML_TEMPLATE, {
        status: 200,
        headers: { 'Content-Type': 'text/html; charset=utf-8' },
      })
    }

    const { searchParams } = new URL(request.url)
    const email = searchParams.get('email')

    if (!email) {
      return new NextResponse(HTML_TEMPLATE, {
        status: 200,
        headers: { 'Content-Type': 'text/html; charset=utf-8' },
      })
    }

    const result = unsubscribeSchema.safeParse({ email })
    if (!result.success) {
      return new NextResponse(HTML_TEMPLATE, {
        status: 200,
        headers: { 'Content-Type': 'text/html; charset=utf-8' },
      })
    }

    const existing = await prisma.newsletterSubscriber.findUnique({
      where: { email },
    })

    if (existing && existing.isActive) {
      await prisma.newsletterSubscriber.update({
        where: { email },
        data: {
          isActive: false,
          unsubscribedAt: new Date(),
        },
      })
    }

    return new NextResponse(HTML_TEMPLATE, {
      status: 200,
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
    })
  } catch (error) {
    logError('Error unsubscribing from newsletter:', error)
    return new NextResponse(HTML_TEMPLATE, {
      status: 200,
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
    })
  }
}
