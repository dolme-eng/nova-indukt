import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { rateLimit, getIP, createRateLimitKey } from '@/lib/rate-limit'
import { logError } from '@/lib/logger'

/**
 * GET: Track order by email + order number (guest-friendly)
 * No auth required — uses email + orderNumber as verification
 */
export async function GET(request: NextRequest) {
  try {
    const ip = getIP(request)
    const { success } = await rateLimit(createRateLimitKey(ip, 'orders:track'), { windowMs: 60_000, maxRequests: 10 })
    if (!success) return NextResponse.json({ error: 'Zu viele Anfragen' }, { status: 429 })

    const { searchParams } = new URL(request.url)
    const email = searchParams.get('email')
    const orderNumber = searchParams.get('orderNumber')

    if (!email || !orderNumber) {
      return NextResponse.json({ error: 'E-Mail und Bestellnummer sind erforderlich.' }, { status: 400 })
    }

    const order = await prisma.order.findFirst({
      where: {
        orderNumber: orderNumber.trim().toUpperCase(),
        customerEmail: email.trim().toLowerCase(),
      },
      select: {
        id: true,
        orderNumber: true,
        status: true,
        paymentStatus: true,
        total: true,
        createdAt: true,
        shippingAddress: true,
        items: {
          select: {
            productName: true,
            quantity: true,
            unitPrice: true,
          },
        },
      },
    })

    if (!order) {
      return NextResponse.json({ error: 'Bestellung nicht gefunden. Bitte überprüfen Sie Ihre Angaben.' }, { status: 404 })
    }

    return NextResponse.json(order)
  } catch (error) {
    logError('[ORDER_TRACK]', error)
    return NextResponse.json({ error: 'Interner Fehler' }, { status: 500 })
  }
}
