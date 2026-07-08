import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { getPayPalAccessToken, PAYPAL_API_URL } from "@/lib/paypal"
import { rateLimit, getIP, createRateLimitKey } from "@/lib/rate-limit"

const createPaypalOrderSchema = z.object({
  orderId: z.string().min(1, "Order ID is required"),
})

export async function POST(request: NextRequest) {
  try {
    // Rate limit: 10 PayPal order creations per minute per IP
    const ip = getIP(request)
    const rl = await rateLimit(createRateLimitKey(ip, "paypal-create"), {
      windowMs: 60_000,
      maxRequests: 10,
    })
    if (!rl.success) {
      return NextResponse.json(
        { error: "Zu viele Anfragen. Bitte warten Sie einen Moment." },
        { status: 429 }
      )
    }

    // Auth required — only the order owner or an admin can create a PayPal order
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()

    // Zod validation
    const parsed = createPaypalOrderSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Ungültige Daten", details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      )
    }

    const { orderId } = parsed.data

    // Verify order exists and user owns it (or is admin)
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      select: { id: true, userId: true, paymentStatus: true },
    })
    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 })
    }
    const isAdmin = session.user.role === "ADMIN"
    const isOwner = order.userId === session.user.id
    if (!isAdmin && !isOwner) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    // Prevent creating PayPal order for already-paid orders
    if (order.paymentStatus === "PAID") {
      return NextResponse.json(
        { error: "Diese Bestellung wurde bereits bezahlt" },
        { status: 400 }
      )
    }

    // Fetch full order details for PayPal
    const fullOrder = await prisma.order.findUnique({
      where: { id: orderId },
      include: { items: true }
    })
    
    if (!fullOrder) {
      return NextResponse.json(
        { error: "Order not found" },
        { status: 404 }
      )
    }

    const subtotal = Number(fullOrder.subtotal)
    const shipping = Number(fullOrder.shippingCost)
    const total = Number(fullOrder.total)

    const accessToken = await getPayPalAccessToken()

    // Create PayPal order with detailed breakdown from DB
    const paypalOrder = {
      intent: "CAPTURE",
      purchase_units: [
        {
          amount: {
            currency_code: "EUR",
            value: total.toFixed(2),
            breakdown: {
              item_total: {
                currency_code: "EUR",
                value: subtotal.toFixed(2),
              },
              shipping: {
                currency_code: "EUR",
                value: shipping.toFixed(2),
              }
            },
          },
          items: fullOrder.items.map(item => ({
            name: item.productName,
            unit_amount: {
              currency_code: "EUR",
              value: Number(item.unitPrice).toFixed(2),
            },
            quantity: item.quantity.toString(),
            category: "PHYSICAL_GOODS",
          })),
          description: `NOVA INDUKT Bestellung ${fullOrder.orderNumber}`,
          custom_id: orderId,
          invoice_id: fullOrder.orderNumber, // Use human-readable order number
        },
      ],
      application_context: {
        brand_name: "NOVA INDUKT",
        landing_page: "BILLING",
        user_action: "PAY_NOW",
        return_url: `${process.env.NEXTAUTH_URL}/kasse?paypal=success`,
        cancel_url: `${process.env.NEXTAUTH_URL}/kasse?paypal=cancel`,
      },
    }

    const response = await fetch(`${PAYPAL_API_URL}/v2/checkout/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${accessToken}`,
        "Prefer": "return=representation",
      },
      body: JSON.stringify(paypalOrder),
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error("PayPal order creation failed:", errorData)
      return NextResponse.json(
        { error: "Failed to create PayPal order" },
        { status: 500 }
      )
    }

    const data = await response.json()

    return NextResponse.json({
      orderId: data.id,
      status: data.status,
      links: data.links,
    })
  } catch (error) {
    console.error("Error creating PayPal order:", error)
    return NextResponse.json(
      { error: "Failed to create PayPal order" },
      { status: 500 }
    )
  }
}
