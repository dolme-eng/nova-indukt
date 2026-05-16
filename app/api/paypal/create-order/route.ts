import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { getPayPalAccessToken, PAYPAL_API_URL } from "@/lib/paypal"

export async function POST(request: NextRequest) {
  try {
    await auth()
    const body = await request.json()
    
    const { orderId } = body
    
    // C7 FIX: orderId is required — we read the amount from DB, never trust the client
    if (!orderId) {
      return NextResponse.json(
        { error: "Order ID is required" },
        { status: 400 }
      )
    }

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { items: true }
    })
    
    if (!order) {
      return NextResponse.json(
        { error: "Order not found" },
        { status: 404 }
      )
    }

    const subtotal = Number(order.subtotal)
    const shipping = Number(order.shippingCost)
    const total = Number(order.total)

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
          items: order.items.map(item => ({
            name: item.productName,
            unit_amount: {
              currency_code: "EUR",
              value: Number(item.unitPrice).toFixed(2),
            },
            quantity: item.quantity.toString(),
            category: "PHYSICAL_GOODS",
          })),
          description: `NOVA INDUKT Bestellung ${order.orderNumber}`,
          custom_id: orderId,
          invoice_id: order.orderNumber, // Use human-readable order number
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
