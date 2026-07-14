import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { rateLimit, getIP, createRateLimitKey } from '@/lib/rate-limit'
import { logError } from '@/lib/logger'

const validateCouponSchema = z.object({
  code: z.string().min(1, 'Code ist erforderlich').max(50),
  amount: z.number().positive('Betrag muss positiv sein'),
})

export async function POST(request: NextRequest) {
  try {
    // Rate limit: 10 validations per minute per IP (prevent brute-force)
    const ip = getIP(request)
    const rl = await rateLimit(createRateLimitKey(ip, 'coupons'), {
      windowMs: 60_000,
      maxRequests: 10,
    })
    if (!rl.success) {
      return NextResponse.json(
        { error: 'Zu viele Anfragen. Bitte warten Sie einen Moment.' },
        { status: 429 }
      )
    }

    const body = await request.json()

    // Zod validation
    const parsed = validateCouponSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Ungültige Daten', details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      )
    }

    const { code, amount } = parsed.data

    const promo = await prisma.promotion.findFirst({
      where: {
        code: { equals: code.toUpperCase(), mode: 'insensitive' },
        isCoupon: true,  // Security: only real coupons, not auto-promotions
        isActive: true,
      }
    })

    if (!promo) {
      return NextResponse.json({ error: 'Ungültiger oder abgelaufener Code' }, { status: 404 })
    }

    const now = new Date()
    if (now < promo.startDate || now > promo.endDate) {
      return NextResponse.json({ error: 'Dieser Code ist derzeit nicht gültig' }, { status: 400 })
    }

    if (promo.usageLimit && promo.usageCount >= promo.usageLimit) {
      return NextResponse.json({ error: 'Nutzungsgrenze für diesen Code erreicht' }, { status: 400 })
    }

    if (promo.minOrderAmount && amount < Number(promo.minOrderAmount)) {
      return NextResponse.json({ 
        error: `Mindestbestellwert von ${Number(promo.minOrderAmount).toFixed(2)}€ nicht erreicht` 
      }, { status: 400 })
    }

    // Calculate discount
    let discount = 0
    if (promo.discountType === 'PERCENTAGE') {
      discount = amount * (Number(promo.discountValue) / 100)
      if (promo.maxDiscount && discount > Number(promo.maxDiscount)) {
        discount = Number(promo.maxDiscount)
      }
    } else {
      discount = Number(promo.discountValue)
    }

    return NextResponse.json({
      valid: true,
      code: promo.code,
      discountType: promo.discountType,
      discountValue: Number(promo.discountValue),
      discountAmount: discount,
      promotionId: promo.id,
      name: promo.name
    })

  } catch (error) {
    logError('Coupon validation error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
