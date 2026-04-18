import { NextRequest, NextResponse } from "next/server"
import { stripe, toStripeAmount } from "@/lib/stripe"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    const body = await request.json()
    
    const { amount, orderId, metadata = {} } = body
    
    if (!amount || amount <= 0) {
      return NextResponse.json(
        { error: "Invalid amount" },
        { status: 400 }
      )
    }

    // Verify order exists and belongs to user
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
      
      // Check if order belongs to logged in user
      if (session?.user?.id && order.userId && order.userId !== session.user.id) {
        return NextResponse.json(
          { error: "Unauthorized" },
          { status: 403 }
        )
      }
    }

    // Create PaymentIntent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: toStripeAmount(amount),
      currency: "eur",
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        orderId: orderId || "",
        userId: session?.user?.id || "guest",
        ...metadata,
      },
      // 3D Secure configuration
      payment_method_options: {
        card: {
          request_three_d_secure: "automatic",
        },
      },
    })

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    })
  } catch (error) {
    console.error("Error creating payment intent:", error)
    return NextResponse.json(
      { error: "Failed to create payment intent" },
      { status: 500 }
    )
  }
}
