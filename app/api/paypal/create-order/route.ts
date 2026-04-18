import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

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
    const session = await auth()
    const body = await request.json()
    
    const { amount, orderId, items = [] } = body
    
    if (!amount || amount <= 0) {
      return NextResponse.json(
        { error: "Invalid amount" },
        { status: 400 }
      )
    }

    // Verify order exists
    if (orderId) {
      const order = await prisma.order.findUnique({
        where: { id: orderId },
      })
      
      if (!order) {
        return NextResponse.json(
          { error: "Order not found" },
          { status: 404 }
        )
      }
    }

    const accessToken = await getPayPalAccessToken()

    // Create PayPal order
    const paypalOrder = {
      intent: "CAPTURE",
      purchase_units: [
        {
          amount: {
            currency_code: "EUR",
            value: amount.toFixed(2),
            breakdown: {
              item_total: {
                currency_code: "EUR",
                value: amount.toFixed(2),
              },
            },
          },
          description: `NOVA INDUKT Bestellung`,
          custom_id: orderId || "",
          invoice_id: orderId ? `INV-${orderId}` : undefined,
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
