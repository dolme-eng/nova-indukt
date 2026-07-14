import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { rateLimit, getIP, createRateLimitKey } from "@/lib/rate-limit"
import { sendOrderCancellationEmail } from "@/lib/email/send"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    const { id } = await params
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const rl = await rateLimit(createRateLimitKey(getIP(request), "orders:get"), { windowMs: 60_000, maxRequests: 20 })
    if (!rl.success) return NextResponse.json({ error: "Zu viele Anfragen" }, { status: 429 })
    
    const order = await prisma.order.findUnique({
      where: { id },
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
    
    if (!order) {
      return NextResponse.json(
        { error: "Order not found" },
        { status: 404 }
      )
    }
    
    if (order.userId !== session.user.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 403 }
      )
    }
    
    return NextResponse.json({
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
    })
  } catch (error) {
    console.error("Error fetching order:", error)
    return NextResponse.json(
      { error: "Failed to fetch order" },
      { status: 500 }
    )
  }
}

/**
 * PATCH: Annuler une commande (uniquement si le statut est PENDING)
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    const { id } = await params
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const rl = await rateLimit(createRateLimitKey(getIP(request), "orders:cancel"), { windowMs: 60_000, maxRequests: 5 })
    if (!rl.success) return NextResponse.json({ error: "Zu viele Anfragen" }, { status: 429 })
    
    const body = await request.json()
    const { action } = body

    if (action !== "cancel") {
      return NextResponse.json(
        { error: "Ungültige Aktion" },
        { status: 400 }
      )
    }
    
    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        items: true
      }
    })
    
    if (!order) {
      return NextResponse.json(
        { error: "Bestellung nicht gefunden" },
        { status: 404 }
      )
    }
    
    if (order.userId !== session.user.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 403 }
      )
    }

    // Only allow cancellation of PENDING orders
    if (order.status !== "PENDING") {
      return NextResponse.json(
        { error: "Nur Bestellungen mit Status 'Ausstehend' können storniert werden." },
        { status: 400 }
      )
    }

    // Cancel order
    await prisma.order.update({
      where: { id },
      data: { status: "CANCELLED" }
    })

    // Send cancellation email (non-blocking)
    const recipientEmail = order.customerEmail
    if (recipientEmail) {
      sendOrderCancellationEmail(
        recipientEmail,
        order.customerName,
        order.orderNumber,
        Number(order.total)
      ).catch(err => console.error("Failed to send cancellation email:", err))
    }
    
    return NextResponse.json({
      success: true,
      message: "Bestellung erfolgreich storniert."
    })
  } catch (error) {
    console.error("Error cancelling order:", error)
    return NextResponse.json(
      { error: "Failed to cancel order" },
      { status: 500 }
    )
  }
}
