import { prisma } from '@/lib/prisma'
import { getResend, FROM_EMAIL, FROM_NAME } from './resend'
import { render } from '@react-email/render'
import ShippingNotificationEmail from './templates/shipping-notification'
import ReviewRequestEmail from './templates/review-request'
import LowStockAlertEmail from './templates/low-stock-alert'
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

    const results = []

    for (const order of orders) {
      const typedOrder = order as any
      if (!typedOrder.user?.email) continue

      try {
        const html = await render(
          ReviewRequestEmail({
            orderNumber: typedOrder.orderNumber,
            customerName: typedOrder.user.name || 'Kunde',
            items: typedOrder.items.map((item: { productId: string; productName?: string; product?: { nameDe?: string; slug?: string; images?: { url: string }[] } }) => ({
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
 * Check stock levels and send low stock alerts
 * Called by cron job daily
 */
export async function checkStockAndAlert() {
  try {
    const LOW_STOCK_THRESHOLD = 5
    const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@nova-indukt.de'

    // Find products with low stock
    const lowStockProducts = await prisma.product.findMany({
      where: {
        stock: {
          lte: LOW_STOCK_THRESHOLD,
          gt: 0,
        },
        isActive: true,
        // Don't alert if already alerted in last 7 days
        /* 
        NOT: {
          metadata: {
            path: ['lowStockAlertedAt'],
            not: null,
          },
        },
        */
      },
      include: {
        category: true,
      },
      orderBy: {
        stock: 'asc',
      },
    })

    // Find out of stock products
    const outOfStockProducts = await prisma.product.findMany({
      where: {
        stock: 0,
        isActive: true,
      },
      include: {
        category: true,
      },
    })

    if (lowStockProducts.length === 0 && outOfStockProducts.length === 0) {
      return { success: true, message: 'No stock alerts needed' }
    }

    const html = await render(
      LowStockAlertEmail({
        lowStockProducts: lowStockProducts.map(p => ({
          id: p.id,
          name: p.nameDe,
          stock: p.stock,
          category: (p as any).category?.nameDe,
          adminUrl: `${process.env.NEXTAUTH_URL}/admin/products/${p.id}`,
        })),
        outOfStockProducts: outOfStockProducts.map(p => ({
          id: p.id,
          name: p.nameDe,
          category: (p as any).category?.nameDe,
          adminUrl: `${process.env.NEXTAUTH_URL}/admin/products/${p.id}`,
        })),
        date: new Date().toLocaleDateString('de-DE'),
      })
    )

    const result = await getResend()?.emails.send({
      from: `${FROM_NAME} <${FROM_EMAIL}>`,
      to: ADMIN_EMAIL,
      subject: `⚠️ Lagerbestands-Warnung - ${new Date().toLocaleDateString('de-DE')}`,
      html,
    }) ?? { data: null, error: null }

    if (result.error) {
      return { success: false, error: result.error }
    }

    // Mark low stock products as alerted - skip metadata for now
    /* 
    for (const product of lowStockProducts) {
      await prisma.product.update({
        where: { id: product.id },
        data: {
          metadata: {
            ...(product.metadata as object || {}),
            lowStockAlertedAt: new Date().toISOString(),
          },
        },
      })
    }
    */

    // Auto-disable out of stock products
    if (outOfStockProducts.length > 0) {
      await prisma.product.updateMany({
        where: {
          id: {
            in: outOfStockProducts.map(p => p.id),
          },
        },
        data: {
          isActive: false,
          /* 
          metadata: {
            autoDisabledAt: new Date().toISOString(),
            autoDisabledReason: 'out_of_stock',
          },
          */
        },
      })
    }

    return {
      success: true,
      lowStockCount: lowStockProducts.length,
      outOfStockCount: outOfStockProducts.length,
      autoDisabled: outOfStockProducts.length,
    }
  } catch (error) {
    console.error('Error checking stock:', error)
    return { success: false, error }
  }
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
