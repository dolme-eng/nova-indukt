import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAdmin } from "@/lib/admin/require-admin"
import { auditLog } from "@/lib/admin/audit"
import { sendShippingNotification } from "@/lib/email/send"

export async function PATCH(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  const authz = await requireAdmin()
  if (!authz.ok) return NextResponse.json({ error: "Unauthorized" }, { status: authz.status })

  const { id } = await context.params
  const order = await prisma.order.findUnique({
    where: { id },
    include: { items: true },
  })
  if (!order) return NextResponse.json({ error: "Not found" }, { status: 404 })

  const body = await req.json()
  const {
    status,
    trackingNumber,
    carrier,
    trackingUrl,
    sendEmail = false,
  } = body ?? {}

  const next = await prisma.order.update({
    where: { id },
    data: {
      status: typeof status === "string" ? (status as any) : undefined,
      trackingNumber: typeof trackingNumber === "string" ? trackingNumber : trackingNumber === null ? null : undefined,
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

  if (sendEmail && next.trackingNumber) {
    const shippingAddress = order.shippingAddress as any
    await sendShippingNotification({
      to: order.customerEmail,
      customerName: order.customerName,
      orderNumber: order.orderNumber,
      trackingNumber: next.trackingNumber,
      carrier: typeof carrier === "string" ? carrier : "DHL",
      trackingUrl:
        typeof trackingUrl === "string" && trackingUrl.length > 0
          ? trackingUrl
          : "https://www.dhl.de/de/privatkunden/dhl-sendungsverfolgung.html",
      items: order.items.map((i) => ({ name: i.productName, quantity: i.quantity })),
      shippingAddress: {
        name: shippingAddress?.name || order.customerName,
        street: shippingAddress?.street || "",
        postalCode: shippingAddress?.postalCode || "",
        city: shippingAddress?.city || "",
        country: shippingAddress?.country || "DE",
      },
    })
  }

  return NextResponse.json(next)
}

