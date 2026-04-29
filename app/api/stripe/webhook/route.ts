import { NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"
import { stripe } from "@/lib/stripe"
import { prisma } from "@/lib/prisma"
import { sendPaymentConfirmationEmail } from "@/lib/email/send"
import { logError, logInfo } from "@/lib/logger"
import type { Order } from "@prisma/client"

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

    let event: Stripe.Event

    try {
      event = stripe.webhooks.constructEvent(payload, signature, endpointSecret)
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error'
      logError('Webhook signature verification failed', err)
      return NextResponse.json(
        { error: "Invalid signature" },
        { status: 400 }
      )
    }

    logInfo('Processing webhook event', { eventType: event.type })

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
        logInfo('Unhandled webhook event type', { eventType: event.type })
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    logError('Error processing webhook', error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

async function handlePaymentSuccess(paymentIntent: Stripe.PaymentIntent) {
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

    logInfo('Order marked as PAID', { orderNumber: order.orderNumber, orderId: order.id })

    // Send payment confirmation email
    try {
      await sendPaymentConfirmationEmail(order)
      logInfo('Payment confirmation email sent', { orderNumber: order.orderNumber })
    } catch (emailError) {
      logError('Failed to send payment confirmation email', emailError, { orderNumber: order.orderNumber })
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
      logInfo('Cart cleared for user', { userId: order.userId })
    }
  } catch (error) {
    logError('Error handling payment success', error, { orderId })
    throw error
  }
}

async function handlePaymentFailure(paymentIntent: Stripe.PaymentIntent) {
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

    logInfo('Order marked as PAYMENT_FAILED', { orderId })
  } catch (error) {
    logError('Error handling payment failure', error, { orderId })
  }
}

async function handleRefund(charge: Stripe.Charge) {
  const paymentIntentId = charge.payment_intent
  
  if (!paymentIntentId) return

  try {
    // Find order by payment intent
    const order = await prisma.order.findFirst({
      where: { paymentIntentId: paymentIntentId as string },
    })

    if (!order) {
      logError('No order found for payment intent', null, { paymentIntentId })
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

    logInfo('Order refund processed', { orderNumber: order.orderNumber, isFullyRefunded })
  } catch (error) {
    logError('Error handling refund', error, { paymentIntentId })
  }
}
