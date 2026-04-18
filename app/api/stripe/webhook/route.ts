import { NextRequest, NextResponse } from "next/server"
import { stripe } from "@/lib/stripe"
import { prisma } from "@/lib/prisma"
import { sendPaymentConfirmationEmail } from "@/lib/email/send"

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET

export async function POST(request: NextRequest) {
  try {
    const payload = await request.text()
    const signature = request.headers.get("stripe-signature") || ""

    if (!endpointSecret) {
      console.error("STRIPE_WEBHOOK_SECRET is not defined")
      return NextResponse.json(
        { error: "Webhook secret not configured" },
        { status: 500 }
      )
    }

    let event

    try {
      event = stripe.webhooks.constructEvent(payload, signature, endpointSecret)
    } catch (err: any) {
      console.error(`Webhook signature verification failed: ${err.message}`)
      return NextResponse.json(
        { error: "Invalid signature" },
        { status: 400 }
      )
    }

    console.log(`Processing webhook event: ${event.type}`)

    // Handle the event
    switch (event.type) {
      case "payment_intent.succeeded": {
        const paymentIntent = event.data.object
        await handlePaymentSuccess(paymentIntent)
        break
      }

      case "payment_intent.payment_failed": {
        const paymentIntent = event.data.object
        await handlePaymentFailure(paymentIntent)
        break
      }

      case "charge.refunded": {
        const charge = event.data.object
        await handleRefund(charge)
        break
      }

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("Error processing webhook:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

async function handlePaymentSuccess(paymentIntent: any) {
  const orderId = paymentIntent.metadata?.orderId
  
  if (!orderId) {
    console.error("No orderId found in payment intent metadata")
    return
  }

  try {
    // Update order status
    const order = await prisma.order.update({
      where: { id: orderId },
      data: {
        paymentStatus: "PAID",
        status: "PROCESSING", // Move to processing since payment confirmed
        paidAt: new Date(),
        paymentIntentId: paymentIntent.id,
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    })

    console.log(`Order ${order.orderNumber} marked as PAID`)

    // Send payment confirmation email
    try {
      await sendPaymentConfirmationEmail(order)
      console.log(`Payment confirmation email sent for order ${order.orderNumber}`)
    } catch (emailError) {
      console.error("Failed to send payment confirmation email:", emailError)
      // Don't throw - order is already marked as paid
    }

    // Clear cart for logged in users
    if (order.userId) {
      await prisma.cartItem.deleteMany({
        where: {
          cart: {
            userId: order.userId,
          },
        },
      })
      console.log(`Cart cleared for user ${order.userId}`)
    }
  } catch (error) {
    console.error("Error handling payment success:", error)
    throw error
  }
}

async function handlePaymentFailure(paymentIntent: any) {
  const orderId = paymentIntent.metadata?.orderId
  
  if (!orderId) return

  try {
    await prisma.order.update({
      where: { id: orderId },
      data: {
        paymentStatus: "FAILED",
        status: "PENDING", // Keep as pending to allow retry
      },
    })

    console.log(`Order ${orderId} marked as PAYMENT_FAILED`)
  } catch (error) {
    console.error("Error handling payment failure:", error)
  }
}

async function handleRefund(charge: any) {
  const paymentIntentId = charge.payment_intent
  
  if (!paymentIntentId) return

  try {
    // Find order by payment intent
    const order = await prisma.order.findFirst({
      where: { paymentIntentId },
    })

    if (!order) {
      console.error(`No order found for payment intent ${paymentIntentId}`)
      return
    }

    // Check if fully or partially refunded
    const isFullyRefunded = charge.refunded && charge.amount_refunded === charge.amount
    
    await prisma.order.update({
      where: { id: order.id },
      data: {
        paymentStatus: isFullyRefunded ? "REFUNDED" : "PARTIALLY_REFUNDED",
        status: isFullyRefunded ? "REFUNDED" : order.status,
      },
    })

    console.log(`Order ${order.orderNumber} marked as ${isFullyRefunded ? "REFUNDED" : "PARTIALLY_REFUNDED"}`)
  } catch (error) {
    console.error("Error handling refund:", error)
  }
}
