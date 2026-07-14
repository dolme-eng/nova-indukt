import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { sendPaymentConfirmationEmail } from "@/lib/email/send"
import type { ShippingAddress } from "@/types/order"
import { getPayPalAccessToken, PAYPAL_API_URL } from "@/lib/paypal"
import { rateLimit, getIP, createRateLimitKey } from "@/lib/rate-limit"
import { logInfo } from "@/lib/logger"

const captureOrderSchema = z.object({
  paypalOrderId: z.string().min(1, "PayPal order ID is required"),
  orderId: z.string().min(1, "Order ID is required"),
})

export async function POST(request: NextRequest) {
  try {
    // Rate limit: 10 captures per minute per IP
    const ip = getIP(request)
    const rl = await rateLimit(createRateLimitKey(ip, "paypal-capture"), {
      windowMs: 60_000,
      maxRequests: 10,
    })
    if (!rl.success) {
      return NextResponse.json(
        { error: "Zu viele Anfragen. Bitte warten Sie einen Moment." },
        { status: 429 }
      )
    }

    // Auth required — only the order owner or an admin can capture
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()

    // Zod validation
    const parsed = captureOrderSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Ungültige Daten", details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      )
    }

    const { paypalOrderId, orderId } = parsed.data

    // Verify order ownership — user must own the order or be admin
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

    // Prevent double-capture
    if (order.paymentStatus === "PAID") {
      return NextResponse.json(
        { error: "Diese Bestellung wurde bereits bezahlt" },
        { status: 400 }
      )
    }

    const accessToken = await getPayPalAccessToken()

    // Capture the payment
    const response = await fetch(
      `${PAYPAL_API_URL}/v2/checkout/orders/${paypalOrderId}/capture`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${accessToken}`,
          "Prefer": "return=representation",
        },
      }
    )

    if (!response.ok) {
      const errorData = await response.json()
      console.error("PayPal capture failed:", errorData)
      return NextResponse.json(
        { error: "Failed to capture PayPal payment" },
        { status: 500 }
      )
    }

    const captureData = await response.json()
    const customId = captureData.purchase_units?.[0]?.custom_id

    // Security check: Verify that the PayPal order belongs to our local order
    if (orderId && customId !== orderId) {
      console.error(`Security Alert: custom_id mismatch. Expected ${orderId}, got ${customId}`)
      return NextResponse.json(
        { error: "Zahlungsverifizierung fehlgeschlagen (ID mismatch)" },
        { status: 403 }
      )
    }

    // Check if payment was successful
    if (captureData.status === "COMPLETED") {
      // Update order in database
      const updatedOrder = await prisma.order.update({
        where: { id: orderId },
        data: {
          paymentStatus: "PAID",
          status: "PROCESSING",
          paidAt: new Date(),
          paymentIntentId: paypalOrderId,
          paymentMethod: "PAYPAL",
        },
        include: {
          items: {
            include: {
              product: true,
            },
          },
        },
      })

      logInfo("[PAYPAL_CAPTURE] Order marked as PAID", { orderId: updatedOrder.orderNumber })

      // Send confirmation email — normalize Decimal fields to number
      try {
        await sendPaymentConfirmationEmail({
          orderNumber: updatedOrder.orderNumber,
          customerName: updatedOrder.customerName,
          customerEmail: updatedOrder.customerEmail || '',
          shippingCost: Number(updatedOrder.shippingCost || 0),
          total: Number(updatedOrder.total || 0),
          items: updatedOrder.items.map(item => ({
            unitPrice: Number(item.unitPrice),
            quantity: item.quantity,
            productName: item.productName || item.product?.nameDe,
            product: item.product ? {
              nameDe: item.product.nameDe,
              images: []
            } : undefined
          })),
          shippingAddress: updatedOrder.shippingAddress as unknown as ShippingAddress
        })
        logInfo("[PAYPAL_CAPTURE] Confirmation email sent", { orderId: updatedOrder.orderNumber })
      } catch (emailError) {
        console.error("Failed to send PayPal payment confirmation email:", emailError)
      }

      // Clear cart
      if (updatedOrder.userId) {
        await prisma.cartItem.deleteMany({
          where: {
            cart: {
              userId: updatedOrder.userId,
            },
          },
        })
      }

      return NextResponse.json({
        success: true,
        status: "COMPLETED",
        captureId: captureData.purchase_units?.[0]?.payments?.captures?.[0]?.id,
      })
    } else {
      return NextResponse.json({
        success: false,
        status: captureData.status,
        message: "Payment not completed",
      })
    }
  } catch (error) {
    console.error("Error capturing PayPal order:", error)
    return NextResponse.json(
      { error: "Failed to capture PayPal payment" },
      { status: 500 }
    )
  }
}
