import { getResend, FROM_EMAIL, FROM_NAME } from './resend'
import type { Resend } from 'resend'
import { render } from '@react-email/render'
import OrderConfirmationEmail from './templates/order-confirmation'
import ShippingNotificationEmail from './templates/shipping-notification'
import NewsletterConfirmationEmail from './templates/newsletter-confirmation'
import ContactNotificationEmail from './templates/contact-notification'
import PasswordResetEmail from './templates/password-reset'
import { prisma } from '../prisma'
import { calculateOrderTotals } from '../utils/pricing'
import { SHOP_DOMAIN } from '../constants/shop'
import { generateInvoicePDF } from '../utils/invoice'

async function sendEmailWithRetry(payload: Parameters<Resend['emails']['send']>[0], maxRetries = 3) {
  const resend = getResend()
  if (!resend) {
    console.warn('Resend client not available — skipping email send (RESEND_API_KEY missing?)')
    return { data: null, error: { name: 'resend_not_configured', message: 'Resend not configured' } as any }
  }

  let attempt = 0;
  let lastError: any = null;
  
  while (attempt < maxRetries) {
    try {
      const result = await resend.emails.send(payload);
      if (result.error) {
        // Retry on non-validation errors
        const shouldRetry = result.error.name !== 'validation_error';
        if (shouldRetry && attempt < maxRetries - 1) {
          console.warn(`Resend API error (${result.error.message}). Retrying attempt ${attempt + 1}/${maxRetries}...`);
          attempt++;
          await new Promise(res => setTimeout(res, Math.pow(2, attempt) * 500));
          continue;
        }
        return result;
      }
      return result;
    } catch (error) {
      lastError = error;
      if (attempt < maxRetries - 1) {
        console.warn(`Exception sending email. Retrying attempt ${attempt + 1}/${maxRetries}...`, error);
        attempt++;
        await new Promise(res => setTimeout(res, Math.pow(2, attempt) * 500));
        continue;
      }
      break;
    }
  }
  return { data: null, error: lastError as any };
}

interface OrderItem {
  id: string
  name: string
  nameDe: string
  quantity: number
  price: number
  image?: string
}

interface ShippingAddress {
  name: string
  street: string
  street2?: string | null
  postalCode: string
  city: string
  state?: string | null
  country: string
}

interface SendOrderConfirmationParams {
  to: string
  customerName: string
  orderNumber: string
  items: OrderItem[]
  subtotal: number
  shipping: number
  tax: number
  total: number
  paymentMethod?: string
  shippingAddress: ShippingAddress
  estimatedDelivery: string
}

export async function sendOrderConfirmation(params: SendOrderConfirmationParams) {
  try {
    const html = await render(
      OrderConfirmationEmail({
        orderNumber: params.orderNumber,
        customerName: params.customerName,
        items: params.items.map(item => ({
          name: item.nameDe || item.name,
          quantity: item.quantity,
          price: item.price,
          image: item.image,
        })),
        subtotal: params.subtotal,
        shipping: params.shipping,
        tax: params.tax,
        total: params.total,
        paymentMethod: params.paymentMethod,
        shippingAddress: {
          name: params.shippingAddress.name,
          street: params.shippingAddress.street,
          street2: params.shippingAddress.street2 || '',
          postalCode: params.shippingAddress.postalCode,
          city: params.shippingAddress.city,
          country: params.shippingAddress.country,
        },
        estimatedDelivery: params.estimatedDelivery,
      })
    )

    // Generate PDF invoice
    const invoicePDF = generateInvoicePDF({
      orderNumber: params.orderNumber,
      items: params.items.map(item => ({
        name: item.nameDe || item.name,
        quantity: item.quantity,
        price: item.price,
      })),
      subtotal: params.subtotal,
      shipping: params.shipping,
      total: params.total,
      createdAt: new Date(),
    })

    const pdfBuffer = Buffer.from(invoicePDF.output('arraybuffer'))

    const result = await sendEmailWithRetry({
      from: `${FROM_NAME} <${FROM_EMAIL}>`,
      to: params.to,
      subject: `Ihre Bestellung bei NOVA INDUKT - ${params.orderNumber}`,
      html,
      attachments: [
        {
          filename: `Rechnung-${params.orderNumber}.pdf`,
          content: pdfBuffer,
          contentType: 'application/pdf',
        },
      ],
    })

    if (result.error) {
      console.error('Failed to send order confirmation email:', result.error)
      return { success: false, error: result.error }
    }

    return { success: true, id: result.data?.id }
  } catch (error) {
    console.error('Error sending order confirmation:', error)
    return { success: false, error }
  }
}

interface SendShippingNotificationParams {
  to: string
  customerName: string
  orderNumber: string
  trackingNumber: string
  carrier: string
  trackingUrl: string
  items: Array<{ name: string; quantity: number }>
  shippingAddress: ShippingAddress
}

export async function sendShippingNotification(params: SendShippingNotificationParams) {
  try {
    const html = await render(
      ShippingNotificationEmail({
        orderNumber: params.orderNumber,
        customerName: params.customerName,
        trackingNumber: params.trackingNumber,
        carrier: params.carrier,
        trackingUrl: params.trackingUrl,
        items: params.items.map(item => ({
          name: item.name,
          quantity: item.quantity,
        })),
        shippingAddress: {
          name: params.shippingAddress.name,
          street: params.shippingAddress.street,
          city: params.shippingAddress.city,
          postalCode: params.shippingAddress.postalCode,
        },
      })
    )

    const result = await sendEmailWithRetry({
      from: `${FROM_NAME} <${FROM_EMAIL}>`,
      to: params.to,
      subject: `Ihre Bestellung wurde versandt! - ${params.orderNumber}`,
      html,
    })

    if (result.error) {
      console.error('Failed to send shipping notification:', result.error)
      return { success: false, error: result.error }
    }

    return { success: true, id: result.data?.id }
  } catch (error) {
    console.error('Error sending shipping notification:', error)
    return { success: false, error }
  }
}

// New function: Send payment confirmation (separate from order confirmation)
type OrderItemWithProduct = {
  unitPrice: number | string
  quantity: number
  productName?: string
  product?: { nameDe?: string; images?: { url: string }[] }
}

type OrderInput = {
  orderNumber: string
  customerName: string
  customerEmail: string
  shippingCost?: number | string
  total?: number | string
  items: OrderItemWithProduct[]
  shippingAddress?: ShippingAddress | string
}

export async function sendPaymentConfirmationEmail(order: OrderInput) {
  try {
    // Calculate totals using shared utility
    const totals = calculateOrderTotals(
      order.items.map(item => ({ price: item.unitPrice, quantity: item.quantity })),
      order.shippingCost,
      order.total
    )
    
    const html = await render(
      OrderConfirmationEmail({
        orderNumber: order.orderNumber,
        customerName: order.customerName,
        items: order.items.map((item: OrderItemWithProduct) => ({
          name: item.productName || item.product?.nameDe || 'Produkt',
          quantity: item.quantity,
          price: Number(item.unitPrice),
          image: item.product?.images?.[0]?.url,
        })),
        subtotal: totals.subtotal,
        shipping: totals.shipping,
        tax: totals.tax, // 19% MwSt
        total: totals.total,
        shippingAddress: (() => {
          const addr = typeof order.shippingAddress === 'object' 
            ? (order.shippingAddress as ShippingAddress)
            : (JSON.parse(order.shippingAddress || '{}') as ShippingAddress);
          return {
            name: addr.name || order.customerName,
            street: addr.street || '',
            street2: addr.street2 || '',
            postalCode: addr.postalCode || '',
            city: addr.city || '',
            country: addr.country || 'DE',
          };
        })(),
        estimatedDelivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString('de-DE', {
          weekday: 'long',
          day: 'numeric',
          month: 'long',
        }),
      })
    )

    const result = await sendEmailWithRetry({
      from: `${FROM_NAME} <${FROM_EMAIL}>`,
      to: order.customerEmail,
      subject: `Zahlung bestätigt - Bestellung ${order.orderNumber}`,
      html,
    })

    if (result.error) {
      console.error('Failed to send payment confirmation email:', result.error)
      return { success: false, error: result.error }
    }

    return { success: true, id: result.data?.id }
  } catch (error) {
    console.error('Error sending payment confirmation:', error)
    return { success: false, error }
  }
}

// Helper to calculate order totals and send confirmation
export async function sendOrderConfirmationForOrder(orderId: string) {
  try {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: {
          include: {
            product: {
              include: {
                images: true
              }
            },
          },
        },
        user: true,
      },
    })

    // M14 FIX: Use customerEmail as fallback for guest orders
    const recipientEmail = order?.user?.email || order?.customerEmail
    if (!order || !recipientEmail) {
      throw new Error('Order or recipient email not found')
    }

    type DbOrder = typeof order;
    type DbOrderItem = DbOrder['items'][0];
    
    const shippingAddr = order.shippingAddress as Record<string, string>

    // Calculate totals using shared utility
    const totals = calculateOrderTotals(
      order.items.map(item => ({ price: Number(item.unitPrice), quantity: item.quantity })),
      Number(order.shippingCost),
      Number(order.total),
      Number(order.subtotal)
    )

    // Calculate estimated delivery (2-3 business days)
    const deliveryDate = new Date()
    deliveryDate.setDate(deliveryDate.getDate() + 3)
    const estimatedDelivery = deliveryDate.toLocaleDateString('de-DE', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
    })

    const result = await sendOrderConfirmation({
      to: recipientEmail,
      customerName: order.user?.name || order.customerName || 'Kunde',
      orderNumber: order.orderNumber,
      items: order.items.map((item: DbOrderItem) => ({
        id: item.id,
        name: item.product.nameDe,
        nameDe: item.product.nameDe,
        quantity: item.quantity,
        price: Number(item.unitPrice),
        image: item.product.images[0]?.url,
      })),
      subtotal: totals.subtotal,
      shipping: totals.shipping,
      tax: totals.tax,
      total: totals.total,
      paymentMethod: order.paymentMethod,
      shippingAddress: {
        name: shippingAddr?.name || order.user?.name || order.customerName || '',
        street: shippingAddr?.street || '',
        street2: shippingAddr?.street2 || '',
        postalCode: shippingAddr?.postalCode || '',
        city: shippingAddr?.city || '',
        country: shippingAddr?.country || 'DE',
      },
      estimatedDelivery,
    })

    return result
  } catch (error) {
    console.error('Error sending order confirmation for order:', error)
    return { success: false, error }
  }
}

// Newsletter confirmation email
export async function sendNewsletterConfirmationEmail(
  email: string,
  firstName?: string
) {
  try {
    const unsubscribeUrl = `${SHOP_DOMAIN}/api/newsletter/unsubscribe?email=${encodeURIComponent(email)}`

    const html = await render(
      NewsletterConfirmationEmail({
        email,
        firstName,
        unsubscribeUrl,
      })
    )

    const result = await sendEmailWithRetry({
      from: `${FROM_NAME} <${FROM_EMAIL}>`,
      to: email,
      subject: 'Willkommen beim NOVA INDUKT Newsletter!',
      html,
    })

    if (result.error) {
      console.error('Failed to send newsletter confirmation email:', result.error)
      return { success: false, error: result.error }
    }

    return { success: true, id: result.data?.id }
  } catch (error) {
    console.error('Error sending newsletter confirmation email:', error)
    return { success: false, error }
  }
}

// Contact form notification to admin
export async function sendContactNotificationEmail(
  name: string,
  email: string,
  subject: string,
  message: string,
  messageId: string,
  createdAt: Date
) {
  try {
    const adminEmail = process.env.ADMIN_EMAIL || FROM_EMAIL
    const formattedDate = createdAt.toLocaleString('de-DE', {
      dateStyle: 'medium',
      timeStyle: 'short',
    })

    const html = await render(
      ContactNotificationEmail({
        name,
        email,
        subject,
        message,
        messageId,
        createdAt: formattedDate,
      })
    )

    const result = await sendEmailWithRetry({
      from: `${FROM_NAME} <${FROM_EMAIL}>`,
      to: adminEmail,
      subject: `Neue Kontaktanfrage: ${subject}`,
      html,
      replyTo: email,
    })

    if (result.error) {
      console.error('Failed to send contact notification email:', result.error)
      return { success: false, error: result.error }
    }

    return { success: true, id: result.data?.id }
  } catch (error) {
    console.error('Error sending contact notification email:', error)
    return { success: false, error }
  }
}

// Password reset email
export async function sendPasswordResetEmail(
  email: string,
  firstName: string | null,
  resetToken: string
) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://nova-indukt.de'
    const resetUrl = `${baseUrl}/passwort-zuruecksetzen?token=${resetToken}`

    const html = await render(
      PasswordResetEmail({
        firstName: firstName || undefined,
        resetUrl,
        expiresIn: '1 Stunde',
      })
    )

    const result = await sendEmailWithRetry({
      from: `${FROM_NAME} <${FROM_EMAIL}>`,
      to: email,
      subject: 'Passwort zurücksetzen - NOVA INDUKT',
      html,
    })

    if (result.error) {
      console.error('Failed to send password reset email:', result.error)
      return { success: false, error: result.error }
    }

    return { success: true, id: result.data?.id }
  } catch (error) {
    console.error('Error sending password reset email:', error)
    return { success: false, error }
  }
}
