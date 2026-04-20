import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  try {
    const { code, amount } = await request.json()

    if (!code) {
      return NextResponse.json({ error: 'Code ist erforderlich' }, { status: 400 })
    }

    const promo = await prisma.promotion.findUnique({
      where: { code: code.toUpperCase() }
    })

    if (!promo || !promo.isActive) {
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
      name: promo.name
    })

  } catch (error) {
    console.error('Coupon validation error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
