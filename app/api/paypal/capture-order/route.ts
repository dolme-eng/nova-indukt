import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { sendPaymentConfirmationEmail } from "@/lib/email/send"

const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID
const PAYPAL_CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET
const PAYPAL_API_URL = process.env.NODE_ENV === "production" 
  ? "https://api-m.paypal.com" 
  : "https://api-m.sandbox.paypal.com"

async function getPayPalAccessToken(): Promise<string> {
  const auth = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`).toString("base64")
  
  const response = await fetch(`${PAYPAL_API_URL}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "Authorization": `Basic ${auth}`,
    },
    body: "grant_type=client_credentials",
  })

  if (!response.ok) {
    throw new Error("Failed to get PayPal access token")
  }

  const data = await response.json()
  return data.access_token
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { paypalOrderId, orderId } = body

    if (!paypalOrderId) {
      return NextResponse.json(
        { error: "PayPal order ID is required" },
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

    // Check if payment was successful
    if (captureData.status === "COMPLETED") {
      // Update order in database
      if (orderId) {
        const order = await prisma.order.update({
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

        console.log(`Order ${order.orderNumber} marked as PAID via PayPal`)

        // Send confirmation email
        try {
          await sendPaymentConfirmationEmail(order)
          console.log(`PayPal payment confirmation email sent for order ${order.orderNumber}`)
        } catch (emailError) {
          console.error("Failed to send PayPal payment confirmation email:", emailError)
        }

        // Clear cart
        if (order.userId) {
          await prisma.cartItem.deleteMany({
            where: {
              cart: {
                userId: order.userId,
              },
            },
          })
        }
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
