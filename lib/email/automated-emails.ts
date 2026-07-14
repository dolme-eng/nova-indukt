import { prisma } from '@/lib/prisma'
import { Prisma } from '@prisma/client'
import { getResend, FROM_EMAIL, FROM_NAME } from './resend'
import { render } from '@react-email/render'
import ShippingNotificationEmail from './templates/shipping-notification'
import ReviewRequestEmail from './templates/review-request'
import WelcomeEmail from './templates/welcome'

/**
 * Send shipping notification when order is marked as shipped
 * Called when admin (or automation) updates order status to SHIPPED
 */
export async function sendShippingNotification(orderId: string, trackingInfo?: {
  trackingNumber: string
  carrier: string
  trackingUrl: string
}) {
  try {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: {
          include: {
            product: true,
          },
        },
        user: true,
      },
    })

    // M14 FIX: Support guest orders
    const recipientEmail = order?.user?.email || order?.customerEmail
    if (!order || !recipientEmail) {
      throw new Error('Order or recipient email not found')
    }

    const html = await render(
      ShippingNotificationEmail({
        orderNumber: order.orderNumber,
        customerName: order.user?.name || order.customerName || 'Kunde',
        trackingNumber: trackingInfo?.trackingNumber || '',
        carrier: trackingInfo?.carrier || 'DHL',
        trackingUrl: trackingInfo?.trackingUrl || '#',
        items: order.items.map(item => ({
          name: item.productName || item.product?.nameDe || 'Produkt',
          quantity: item.quantity,
        })),
        shippingAddress: typeof order.shippingAddress === 'object'
          ? order.shippingAddress
          : JSON.parse((order.shippingAddress as string) || '{}'),
      })
    )

    const result = await getResend()?.emails.send({
      from: `${FROM_NAME} <${FROM_EMAIL}>`,
      to: recipientEmail,
      subject: `Ihre Bestellung wurde versandt! - ${order.orderNumber}`,
      html,
    }) ?? { data: null, error: { name: 'resend_not_configured', message: 'Resend not configured' } }

    if (result.error) {
      console.error('Failed to send shipping notification:', result.error)
      return { success: false, error: result.error }
    }

    // M18 FIX: Mark shipping email as sent
    await prisma.order.update({
      where: { id: orderId },
      data: {
        shippingEmailSentAt: new Date(),
      },
    })

    return { success: true, id: result.data?.id }
  } catch (error) {
    console.error('Error sending shipping notification:', error)
    return { success: false, error }
  }
}

/**
 * Send review request email (7 days after order marked as delivered)
 * Called by cron job
 */
export async function sendReviewRequests() {
  try {
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
    
    const oneDayAgo = new Date()
    oneDayAgo.setDate(oneDayAgo.getDate() - 1)

    // Find orders delivered 7 days ago that haven't received review request
    const orders = await prisma.order.findMany({
      where: {
        status: 'DELIVERED',
        updatedAt: {
          gte: sevenDaysAgo,
          lt: oneDayAgo,
        },
        // M18 FIX: Filter out orders that already received review email
        reviewEmailSentAt: null,
        user: {
          isNot: null,
        },
      },
      include: {
        items: {
          include: {
            product: {
              include: {
                images: true,
              },
            },
          },
        },
        user: true,
      },
    })

    // Found N orders ready for review requests

    type OrderWithProduct = Prisma.OrderGetPayload<{
      include: {
        items: {
          include: {
            product: {
              include: {
                images: true,
              },
            },
          },
        },
        user: true,
      }
    }>

    const results = []

    for (const order of orders) {
      const typedOrder = order as OrderWithProduct
      if (!typedOrder.user?.email) continue

      try {
        const html = await render(
          ReviewRequestEmail({
            orderNumber: typedOrder.orderNumber,
            customerName: typedOrder.user.name || 'Kunde',
            items: typedOrder.items.map((item) => ({
              productId: item.productId,
              name: item.product?.nameDe || item.productName || 'Produkt',
              image: item.product?.images?.[0]?.url,
              reviewUrl: `${process.env.NEXTAUTH_URL}/produkt/${item.product?.slug || ''}?review=true`,
            })),
          })
        )

        const result = await getResend()?.emails.send({
          from: `${FROM_NAME} <${FROM_EMAIL}>`,
          to: typedOrder.user.email,
          subject: `Wie gefällt Ihnen Ihre Bestellung ${typedOrder.orderNumber}?`,
          html,
        }) ?? { data: null, error: null }

        if (result.error) {
          results.push({ orderId: typedOrder.id, success: false, error: result.error })
          continue
        }

        // M18 FIX: Mark review email as sent
        await prisma.order.update({
          where: { id: typedOrder.id },
          data: {
            reviewEmailSentAt: new Date(),
          },
        })

        results.push({ orderId: typedOrder.id, success: true, id: result.data?.id })
      } catch (error) {
        console.error(`Failed to send review request for order ${order.id}:`, error)
        results.push({ orderId: order.id, success: false, error })
      }
    }

    return { success: true, sent: results.filter(r => r.success).length, results }
  } catch (error) {
    console.error('Error in review request batch:', error)
    return { success: false, error }
  }
}

/**
 * Stock management is handled externally.
 * This function is deprecated and returns a no-op.
 */
export async function checkStockAndAlert() {
  return { success: true, message: 'Stock management is handled externally.' }
}

/**
 * Send welcome email to new newsletter subscriber
 */
export async function sendWelcomeEmail(subscriberEmail: string, firstName?: string) {
  try {
    const html = await render(
      WelcomeEmail({
        firstName: firstName || 'Kunde',
        unsubscribeUrl: `${process.env.NEXTAUTH_URL}/api/newsletter/unsubscribe?email=${encodeURIComponent(subscriberEmail)}`,
      })
    )

    const result = await getResend()?.emails.send({
      from: `${FROM_NAME} <${FROM_EMAIL}>`,
      to: subscriberEmail,
      subject: 'Willkommen bei NOVA INDUKT! Ihr 10% Rabatt wartet auf Sie',
      html,
    }) ?? { data: null, error: null }

    if (result.error) {
      console.error('Failed to send welcome email:', result.error)
      return { success: false, error: result.error }
    }

    return { success: true, id: result.data?.id }
  } catch (error) {
    console.error('Error sending welcome email:', error)
    return { success: false, error }
  }
}
