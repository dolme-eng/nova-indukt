import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { prisma } from "@/lib/prisma"
import { requireAdmin } from "@/lib/admin/require-admin"
import { auditLog } from "@/lib/admin/audit"
import { sendShippingNotification, sendEmailWithRetry, FROM_EMAIL, FROM_NAME } from "@/lib/email/send"
import { render } from "@react-email/render"
import type { OrderStatus } from "@prisma/client"
import { rateLimit, getIP, createRateLimitKey } from "@/lib/rate-limit"
import { logError } from "@/lib/logger"

const shippingUpdateSchema = z.object({
  status: z.enum(['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'REFUNDED']).optional(),
  trackingNumber: z.string().max(100).optional().nullable(),
  carrier: z.string().max(50).optional(),
  trackingUrl: z.string().url().optional().nullable(),
  sendEmail: z.boolean().default(false),
})

export async function PATCH(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  const rl = await rateLimit(createRateLimitKey(getIP(req), 'admin:orders:shipping'), { windowMs: 60_000, maxRequests: 15 })
  if (!rl.success) return NextResponse.json({ error: 'Zu viele Anfragen' }, { status: 429 })
  const authz = await requireAdmin()
  if (!authz.ok) return NextResponse.json({ error: "Unauthorized" }, { status: authz.status })

  try {
    const { id } = await context.params
    const order = await prisma.order.findUnique({
      where: { id },
      include: { items: true },
    })
    if (!order) return NextResponse.json({ error: "Not found" }, { status: 404 })

    const body = await req.json()
    const parsed = shippingUpdateSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Ungültige Daten", details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      )
    }

    const { status, trackingNumber, carrier, trackingUrl, sendEmail } = parsed.data

    const next = await prisma.order.update({
      where: { id },
      data: {
        status: status as OrderStatus,
        trackingNumber: trackingNumber ?? undefined,
        shippedAt: status === "SHIPPED" ? new Date() : undefined,
        deliveredAt: status === "DELIVERED" ? new Date() : undefined,
      },
    })

    await auditLog({
      action: "UPDATE",
      entityType: "Order",
      entityId: next.id,
      userId: authz.session.user.id,
      oldValues: { status: order.status, trackingNumber: order.trackingNumber },
      newValues: { status: next.status, trackingNumber: next.trackingNumber },
      ipAddress: req.headers.get("x-forwarded-for"),
      userAgent: req.headers.get("user-agent"),
    })

    // Send email based on status change
    if (sendEmail) {
      const shippingAddress = (order.shippingAddress as Record<string, string>) || {}

      if (status === "SHIPPED" && next.trackingNumber) {
        // Send shipping notification with tracking
        await sendShippingNotification({
          to: order.customerEmail,
          customerName: order.customerName,
          orderNumber: order.orderNumber,
          trackingNumber: next.trackingNumber,
          carrier: carrier || "DHL",
          trackingUrl: trackingUrl || "https://www.dhl.de/de/privatkunden/dhl-sendungsverfolgung.html",
          items: order.items.map((i) => ({ name: i.productName, quantity: i.quantity })),
          shippingAddress: {
            name: shippingAddress?.name || order.customerName,
            street: shippingAddress?.street || "",
            postalCode: shippingAddress?.postalCode || "",
            city: shippingAddress?.city || "",
            country: shippingAddress?.country || "DE",
          },
        })
      } else if (status === "PROCESSING") {
        // Send processing notification
        const html = await render(
          OrderStatusEmail({
            orderNumber: order.orderNumber,
            customerName: order.customerName,
            status: "In Bearbeitung",
            statusMessage: "Ihre Bestellung wird nun bearbeitet und vorbereitet.",
          })
        )

        await sendEmailWithRetry({
          from: `${FROM_NAME} <${FROM_EMAIL}>`,
          to: order.customerEmail,
          subject: `Bestellung in Bearbeitung - ${order.orderNumber}`,
          html,
        })
      } else if (status === "DELIVERED") {
        // Send delivery confirmation
        const html = await render(
          OrderStatusEmail({
            orderNumber: order.orderNumber,
            customerName: order.customerName,
            status: "Zugestellt",
            statusMessage: "Ihre Bestellung wurde erfolgreich zugestellt. Wir hoffen, Sie sind zufrieden!",
          })
        )

        await sendEmailWithRetry({
          from: `${FROM_NAME} <${FROM_EMAIL}>`,
          to: order.customerEmail,
          subject: `Bestellung zugestellt - ${order.orderNumber}`,
          html,
        })
      }
    }

    return NextResponse.json(next)
  } catch (error) {
    logError("[SHIPPING_PATCH]", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

// Simple email template for order status updates
function OrderStatusEmail({
  orderNumber,
  customerName,
  status,
  statusMessage,
}: {
  orderNumber: string
  customerName: string
  status: string
  statusMessage: string
}) {
  const escapeHtml = (str: string) =>
    str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

  const safeName = escapeHtml(customerName)
  const safeMessage = escapeHtml(statusMessage)
  const safeOrderNumber = escapeHtml(orderNumber)
  const safeStatus = escapeHtml(status)

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f5f5f5; margin: 0; padding: 20px;">
        <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.05);">
          <div style="background-color: #0C211E; padding: 30px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 24px; letter-spacing: 2px;">NOVA INDUKT</h1>
          </div>
          <div style="padding: 40px;">
            <h2 style="color: #0C211E; margin: 0 0 20px 0;">Hallo ${safeName},</h2>
            <p style="color: #374151; line-height: 1.6; margin: 0 0 20px 0;">
              ${safeMessage}
            </p>
            <div style="background-color: #f9fafb; border-radius: 12px; padding: 20px; margin: 20px 0;">
              <p style="margin: 0 0 10px 0; color: #6b7280; font-size: 14px;">Bestellnummer</p>
              <p style="margin: 0; color: #0C211E; font-weight: bold; font-size: 18px;">${safeOrderNumber}</p>
            </div>
            <div style="background-color: #4ECCA3; border-radius: 12px; padding: 20px; margin: 20px 0; text-align: center;">
              <p style="margin: 0; color: #0C211E; font-weight: bold; font-size: 16px;">Status: ${safeStatus}</p>
            </div>
          </div>
          <div style="background-color: #f9fafb; padding: 20px; text-align: center; border-top: 1px solid #e5e7eb;">
            <p style="margin: 0; color: #9ca3af; font-size: 12px;">
              © ${new Date().getFullYear()} NOVA INDUKT. Alle Rechte vorbehalten.
            </p>
          </div>
        </div>
      </body>
    </html>
  `
}
