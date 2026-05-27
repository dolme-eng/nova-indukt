import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { revalidatePath } from "next/cache"
import { sendOrderConfirmationForOrder } from "@/lib/email/send"
import { VAT_RATE_PERCENT, vatFromGross } from "@/lib/utils/vat"
import { createOrderSchema, type OrderItemInput } from "@/lib/validations/order"
import { rateLimit, getIP, createRateLimitKey } from "@/lib/rate-limit"
import { calculateShipping } from "@/lib/constants/shop"
import { applyPromotionsToProducts, validateCoupon, incrementPromotionUsage } from "@/lib/promotions"
import { randomUUID } from "crypto"

// Get user's orders
export async function GET() {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }
    
    const orders = await prisma.order.findMany({
      where: { userId: session.user.id },
      include: {
        items: {
          include: {
            product: {
              include: {
                images: true
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: "desc"
      }
    })
    
    return NextResponse.json(
      orders.map(order => ({
        ...order,
        total: Number(order.total),
        subtotal: Number(order.subtotal),
        shippingCost: Number(order.shippingCost),
        items: order.items.map(item => ({
          ...item,
          unitPrice: Number(item.unitPrice),
          product: {
            ...item.product,
            price: Number(item.product.price)
          }
        }))
      }))
    )
  } catch (error) {
    console.error("Error fetching orders:", error)
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    )
  }
}

// Create new order
export async function POST(request: NextRequest) {
  try {
    // Rate limit: 5 orders per minute per IP
    const ip = getIP(request)
    const rl = await rateLimit(createRateLimitKey(ip, 'orders'), { windowMs: 60_000, maxRequests: 5 })
    if (!rl.success) {
      return NextResponse.json(
        { error: 'Zu viele Anfragen. Bitte warten Sie einen Moment.' },
        {
          status: 429,
          headers: {
            'Retry-After': String(Math.ceil((rl.resetTime - Date.now()) / 1000)),
            'X-RateLimit-Limit': String(rl.limit),
            'X-RateLimit-Remaining': '0',
          },
        }
      )
    }

    const session = await auth()
    const body = await request.json()

    // ── Validation Zod ──────────────────────────────────────────────────────
    const parsed = createOrderSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        {
          error: 'Ungültige Bestelldaten',
          details: parsed.error.flatten().fieldErrors,
        },
        { status: 400 }
      )
    }

    const {
      items,
      shippingData,
      paymentMethod,
      discountAmount,
      appliedPromoCode,
    } = parsed.data
    // ────────────────────────────────────────────────────────────────────────

    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: "Cart is empty" },
        { status: 400 }
      )
    }

    // ── Verify product prices from database ─────────────────────────────────
    const productIds = items.map(item => item.id)
    const dbProducts = await prisma.product.findMany({
      where: { id: { in: productIds } },
      select: { id: true, price: true, nameDe: true, stock: true, isActive: true, categoryId: true }
    })

    const dbProductMap = new Map(dbProducts.map(p => [p.id, p]))
    const serverItems: Array<OrderItemInput & { dbPrice: number }> = []

    // ── Fix N+1: single DB call for ALL promotions before the loop ───────────
    const promotionMap = await applyPromotionsToProducts(
      dbProducts.map(p => ({ id: p.id, categoryId: p.categoryId, price: Number(p.price) }))
    )

    for (const item of items) {
      const dbProduct = dbProductMap.get(item.id)
      if (!dbProduct) {
        return NextResponse.json(
          { error: `Produkt ${item.name} nicht gefunden` },
          { status: 404 }
        )
      }
      if (!dbProduct.isActive) {
        return NextResponse.json(
          { error: `Produkt ${item.name} ist nicht mehr verfügbar` },
          { status: 400 }
        )
      }

      // Use pre-fetched promotion map — zero extra DB calls per item
      const promo = promotionMap.get(dbProduct.id)
      const discountedPrice = promo?.discountedPrice ?? Number(dbProduct.price)

      serverItems.push({
        ...item,
        dbPrice: discountedPrice
      })
    }

    // Recalculate subtotal, shipping and total from DB prices (server-side truth)
    const serverSubtotal = serverItems.reduce((sum, item) => {
      return sum + item.dbPrice * item.quantity
    }, 0)
    
    const serverShipping = calculateShipping(serverSubtotal)
    
    // VERIFY COUPON ON SERVER
    let serverDiscountAmount = 0
    let verifiedPromotionId: string | undefined

    if (appliedPromoCode) {
      const couponResult = await validateCoupon(appliedPromoCode, serverSubtotal)
      if (!couponResult.isValid) {
        return NextResponse.json(
          { error: couponResult.error || "Gutschein ungültig" },
          { status: 400 }
        )
      }
      serverDiscountAmount = couponResult.discountAmount
      verifiedPromotionId = couponResult.promotionId
    }

    const serverTotal = Math.max(0, serverSubtotal + serverShipping - serverDiscountAmount)
    // ────────────────────────────────────────────────────────────────────────

    // 2. Generate collision-safe order number (UUID v4, no Date.now() race condition)
    const orderNumber = `NOV-${randomUUID().replace(/-/g, '').slice(0, 12).toUpperCase()}`
    
    // 3. Create order in a transaction to include stock update
    const order = await prisma.$transaction(async (tx) => {
      // Create the order — using server-calculated totals
      const newOrder = await tx.order.create({
        data: {
          orderNumber,
          userId: session?.user?.id || null,
          customerEmail: shippingData.email,
          customerName: `${shippingData.firstName} ${shippingData.lastName}`,
          customerPhone: shippingData.phone,
          shippingAddress: {
            firstName: shippingData.firstName,
            lastName: shippingData.lastName,
            name: `${shippingData.firstName} ${shippingData.lastName}`,
            street: shippingData.address,
            postalCode: shippingData.zipCode,
            city: shippingData.city,
            country: shippingData.country,
          },
          paymentMethod: paymentMethod.toUpperCase() as import('@prisma/client').PaymentMethod,
          status: "PENDING",
          paymentStatus: "PENDING",
          subtotal: serverSubtotal,
          shippingCost: serverShipping,
          discountAmount: serverDiscountAmount,
          appliedPromoCode: serverDiscountAmount > 0 ? appliedPromoCode : null,
          vatAmount: vatFromGross(serverSubtotal + serverShipping, VAT_RATE_PERCENT),
          total: serverTotal,
          items: {
            create: serverItems.map((item) => {
              return {
                productId: item.id,
                quantity: item.quantity,
                unitPrice: item.dbPrice, // C7 FIX: Use discounted DB price
                productName: item.name,
                productSlug: item.slug || '',
                vatRate: VAT_RATE_PERCENT,
              }
            })
          }
        },
        include: {
          items: {
            include: {
              product: {
                include: {
                  images: true
                }
              }
            }
          }
        }
      })

      // Update stocks — atomic check inside transaction to prevent race conditions
      for (const item of items) {
        const updated = await tx.product.updateMany({
          where: { id: item.id, stock: { gte: item.quantity } },
          data: { stock: { decrement: item.quantity } },
        })
        if (updated.count === 0) {
          throw new Error(`STOCK_INSUFFICIENT:${item.name}`)
        }
      }

      // Increment promo usage if applicable
      if (verifiedPromotionId) {
        await tx.promotion.update({
          where: { id: verifiedPromotionId },
          data: {
            usageCount: {
              increment: 1
            }
          }
        })
      }

      return newOrder
    })
    
    // 4. Clear user's cart if logged in
    if (session?.user?.id) {
      await prisma.cartItem.deleteMany({
        where: {
          cart: {
            userId: session.user.id
          }
        }
      })
    }
    
    // Send order confirmation email only for BANK_TRANSFER
    // For PAYPAL, the webhook (PAYMENT.CAPTURE.COMPLETED) handles the confirmation
    // to avoid sending a duplicate email to the customer.
    if (paymentMethod.toUpperCase() === "BANK_TRANSFER") {
      try {
        await sendOrderConfirmationForOrder(order.id)
      } catch (emailError) {
        console.error("Failed to send order confirmation email:", emailError)
        // Continue - order is still created even if email fails
      }
    }
    
    revalidatePath("/mein-konto")
    
    return NextResponse.json({
      ...order,
      total: Number(order.total),
      subtotal: Number(order.subtotal),
      shippingCost: Number(order.shippingCost)
    })
  } catch (error) {
    console.error("Error creating order:", error)
    if (error instanceof Error && error.message.startsWith("STOCK_INSUFFICIENT:")) {
      const productName = error.message.replace("STOCK_INSUFFICIENT:", "")
      return NextResponse.json(
        { error: `Nicht genügend Lagerbestand für ${productName}` },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    )
  }
}
