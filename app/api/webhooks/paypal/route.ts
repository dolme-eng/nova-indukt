import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { sendPaymentConfirmationEmail } from "@/lib/email/send"
import type { ShippingAddress } from "@/types/order"
import { getPayPalAccessToken, PAYPAL_API_URL } from "@/lib/paypal"
import { rateLimit, getIP, createRateLimitKey } from "@/lib/rate-limit"

const PAYPAL_WEBHOOK_ID = process.env.PAYPAL_WEBHOOK_ID

async function verifyWebhookSignature(request: NextRequest, rawBody: string): Promise<boolean> {
  if (!PAYPAL_WEBHOOK_ID) {
    if (process.env.NODE_ENV === "development") {
      console.warn("⚠️ PAYPAL_WEBHOOK_ID not set. Skipping signature verification in development.")
      return true
    }
    console.error("❌ PAYPAL_WEBHOOK_ID is not set in production. Failing closed.")
    return false
  }

  try {
    const accessToken = await getPayPalAccessToken()

    const verificationBody = {
      auth_algo: request.headers.get("paypal-auth-algo"),
      cert_url: request.headers.get("paypal-cert-url"),
      transmission_id: request.headers.get("paypal-transmission-id"),
      transmission_sig: request.headers.get("paypal-transmission-sig"),
      transmission_time: request.headers.get("paypal-transmission-time"),
      webhook_id: PAYPAL_WEBHOOK_ID,
      webhook_event: JSON.parse(rawBody),
    }

    const response = await fetch(`${PAYPAL_API_URL}/v1/notifications/verify-webhook-signature`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${accessToken}`,
      },
      body: JSON.stringify(verificationBody),
    })

    if (!response.ok) {
      console.error("PayPal webhook verification request failed", await response.text())
      return false
    }

    const data = await response.json()
    return data.verification_status === "SUCCESS"
  } catch (error) {
    console.error("Error during webhook verification:", error)
    return false
  }
}

export async function POST(request: NextRequest) {
  try {
    const rl = await rateLimit(createRateLimitKey(getIP(request), "webhooks:paypal"), { windowMs: 60_000, maxRequests: 100 })
    if (!rl.success) return NextResponse.json({ error: "Zu viele Anfragen" }, { status: 429 })

    const rawBody = await request.text()
    
    // Verify Webhook Signature
    const isValid = await verifyWebhookSignature(request, rawBody)
    if (!isValid) {
      return NextResponse.json({ error: "Invalid webhook signature" }, { status: 400 })
    }

    const event = JSON.parse(rawBody)

    // Handle Payment Capture Completed
    if (event.event_type === "PAYMENT.CAPTURE.COMPLETED") {
      const resource = event.resource
      
      // custom_id contains our internal order ID (we send this during create-order)
      const customId = resource.custom_id
      const captureId = resource.id

      if (!customId) {
        console.warn("PayPal webhook received but no custom_id (internal order ID) found.", event)
        return NextResponse.json({ received: true })
      }

      // Check if order exists
      const existingOrder = await prisma.order.findUnique({
        where: { id: customId },
        include: { items: { include: { product: { include: { images: true } } } }, user: true }
      })

      if (!existingOrder) {
        console.error(`Order with ID ${customId} not found for PayPal Webhook`)
        return NextResponse.json({ received: true })
      }

      // If the order isn't already paid (could have been paid by the client capture route first)
      if (existingOrder.paymentStatus !== "PAID") {
        const updatedOrder = await prisma.order.update({
          where: { id: customId },
          data: {
            paymentStatus: "PAID",
            status: "PROCESSING",
            paidAt: new Date(),
            paymentIntentId: captureId,
            paymentMethod: "PAYPAL",
          },
          include: { items: { include: { product: { include: { images: true } } } }, user: true }
        })

        console.log(`Order ${updatedOrder.orderNumber} automatically marked as PAID via PayPal Webhook.`)

        // Send Email using the strictly typed OrderInput
        try {
          // Use customerEmail (stored at order creation) — works for both guests and registered users
          const recipientEmail = updatedOrder.customerEmail || updatedOrder.user?.email
          if (!recipientEmail) {
            console.error(`No email available for order ${updatedOrder.orderNumber}. Skipping confirmation email.`)
          } else {
            await sendPaymentConfirmationEmail({
              orderNumber: updatedOrder.orderNumber,
              customerName: updatedOrder.customerName,
              customerEmail: recipientEmail,
              shippingCost: Number(updatedOrder.shippingCost || 0),
              total: Number(updatedOrder.total || 0),
              items: updatedOrder.items.map(item => ({
                unitPrice: Number(item.unitPrice),
                quantity: item.quantity,
                productName: item.productName || item.product?.nameDe,
                product: item.product ? {
                  nameDe: item.product.nameDe,
                  images: item.product.images || []
                } : undefined
              })),
              shippingAddress: updatedOrder.shippingAddress as unknown as ShippingAddress
            })
            console.log(`PayPal webhook payment confirmation email sent for order ${updatedOrder.orderNumber}`)
          }
        } catch (emailErr) {
          console.error("Webhook email sending failed:", emailErr)
        }
      } else {
        console.log(`Order ${existingOrder.orderNumber} is already PAID. Webhook ignored.`)
      }
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("PayPal Webhook processing error:", error)
    if (error instanceof SyntaxError) {
      return NextResponse.json({ error: "Invalid JSON format" }, { status: 400 })
    }
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
