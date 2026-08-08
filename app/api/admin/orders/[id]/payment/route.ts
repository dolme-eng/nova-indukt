import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/admin/require-admin'
import { auditLog } from '@/lib/admin/audit'
import { logError } from '@/lib/logger'
import { sendPaymentConfirmationEmail } from '@/lib/email/send'
import { revalidatePath } from 'next/cache'
import { validateCsrfToken } from '@/lib/csrf'
import { rateLimit, getIP, createRateLimitKey } from '@/lib/rate-limit'

interface ShippingAddress {
  name: string
  street: string
  street2?: string
  postalCode: string
  city: string
  country: string
}

/**
 * PATCH: Update payment status for an order (admin only)
 * Used to mark bank transfer orders as PAID after confirming receipt.
 */
export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const authz = await requireAdmin()
    if (!authz.ok) return NextResponse.json({ error: 'Nicht autorisiert' }, { status: authz.status })

    const csrfError = validateCsrfToken(request)
    if (csrfError) return csrfError

    const rl = await rateLimit(createRateLimitKey(getIP(request), 'payment:update'), { windowMs: 60_000, maxRequests: 20 })
    if (!rl.success) return NextResponse.json({ error: 'Zu viele Anfragen' }, { status: 429 })
    const { id } = await params
    const body = await request.json()
    const { paymentStatus } = body

    if (!paymentStatus || !['PENDING', 'PAID', 'FAILED', 'REFUNDED'].includes(paymentStatus)) {
      return NextResponse.json({ error: 'Ungültiger Zahlungsstatus' }, { status: 400 })
    }

    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            product: {
              include: { images: true },
            },
          },
        },
        user: { select: { email: true, name: true } },
      },
    })

    if (!order) {
      return NextResponse.json({ error: 'Bestellung nicht gefunden' }, { status: 404 })
    }

    const previousPaymentStatus = order.paymentStatus

    const updatedOrder = await prisma.order.update({
      where: { id },
      data: {
        paymentStatus: paymentStatus,
        ...(paymentStatus === 'PAID' ? { paidAt: new Date() } : {}),
      },
    })

    // Send payment confirmation email when marked as PAID
    if (paymentStatus === 'PAID' && previousPaymentStatus !== 'PAID') {
      const recipientEmail = order.user?.email || order.customerEmail
      if (recipientEmail) {
        const addr = (order.shippingAddress as Record<string, string>) || {}
        sendPaymentConfirmationEmail({
          orderNumber: order.orderNumber,
          customerName: order.user?.name || order.customerName || 'Kunde',
          customerEmail: recipientEmail,
          items: order.items.map((item) => ({
            productName: item.product.nameDe,
            unitPrice: Number(item.unitPrice),
            quantity: item.quantity,
            product: {
              nameDe: item.product.nameDe,
              images: item.product.images,
            },
          })),
          shippingCost: Number(order.shippingCost),
          total: Number(order.total),
          shippingAddress: {
            name: addr.name || order.user?.name || '',
            street: addr.street || '',
            street2: addr.street2 || '',
            postalCode: addr.postalCode || '',
            city: addr.city || '',
            country: addr.country || 'DE',
          } as ShippingAddress,
        }).catch((err) => logError('[PAYMENT_CONFIRMATION_EMAIL]', err))
      }
    }

    await auditLog({
      action: 'UPDATE',
      entityType: 'Order',
      entityId: id,
      userId: authz.session.user.id,
      oldValues: { paymentStatus: previousPaymentStatus },
      newValues: { paymentStatus },
      ipAddress: request.headers.get('x-forwarded-for'),
      userAgent: request.headers.get('user-agent'),
    })

    revalidatePath(`/admin/orders/${id}`)
    revalidatePath('/admin/orders')

    return NextResponse.json({
      success: true,
      order: {
        id: updatedOrder.id,
        orderNumber: updatedOrder.orderNumber,
        paymentStatus: updatedOrder.paymentStatus,
        paidAt: updatedOrder.paidAt,
      },
    })
  } catch (error) {
    logError('[ADMIN_ORDER_PAYMENT_UPDATE]', error)
    return NextResponse.json({ error: 'Interner Fehler' }, { status: 500 })
  }
}
