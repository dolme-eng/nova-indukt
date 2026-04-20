import { resend, FROM_EMAIL, FROM_NAME } from './resend'
import { render } from '@react-email/render'
import OrderConfirmationEmail from './templates/order-confirmation'
import ShippingNotificationEmail from './templates/shipping-notification'
import NewsletterConfirmationEmail from './templates/newsletter-confirmation'
import ContactNotificationEmail from './templates/contact-notification'
import PasswordResetEmail from './templates/password-reset'
import { prisma } from '../prisma'
import { VAT_RATE } from '../constants/vat'

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

    const result = await resend.emails.send({
      from: `${FROM_NAME} <${FROM_EMAIL}>`,
      to: params.to,
      subject: `Ihre Bestellung bei NOVA INDUKT - ${params.orderNumber}`,
      html,
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

    const result = await resend.emails.send({
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
export async function sendPaymentConfirmationEmail(order: any) {
  try {
    // Calculate totals
    const subtotal = order.items.reduce((sum: number, item: any) => 
      sum + (Number(item.unitPrice) * item.quantity), 0
    )
    const shipping = Number(order.shippingCost) || 0
    const total = Number(order.total) || subtotal + shipping
    
    const html = await render(
      OrderConfirmationEmail({
        orderNumber: order.orderNumber,
        customerName: order.customerName,
        items: order.items.map((item: any) => ({
          name: item.productName || item.product?.nameDe || 'Produkt',
          quantity: item.quantity,
          price: Number(item.unitPrice),
          image: item.product?.images?.[0]?.url,
        })),
        subtotal,
        shipping,
        tax: subtotal * 0.19, // 19% MwSt
        total,
        shippingAddress: typeof order.shippingAddress === 'object' 
          ? order.shippingAddress 
          : JSON.parse(order.shippingAddress || '{}'),
        estimatedDelivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString('de-DE', {
          weekday: 'long',
          day: 'numeric',
          month: 'long',
        }),
      })
    )

    const result = await resend.emails.send({
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

    if (!order || !order.user?.email) {
      throw new Error('Order or user email not found')
    }

    const typedOrder = order as any
    const shippingAddr = order.shippingAddress as any

    // Calculate subtotal (without tax)
    const subtotal = Number(order.subtotal) || typedOrder.items.reduce((sum: number, item: any) => sum + (Number(item.unitPrice) * item.quantity), 0)
    const shipping = Number(order.shippingCost) || 0
    const tax = subtotal * VAT_RATE
    const total = Number(order.total) || subtotal + shipping

    // Calculate estimated delivery (2-3 business days)
    const deliveryDate = new Date()
    deliveryDate.setDate(deliveryDate.getDate() + 3)
    const estimatedDelivery = deliveryDate.toLocaleDateString('de-DE', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
    })

    const result = await sendOrderConfirmation({
      to: typedOrder.user.email,
      customerName: typedOrder.user.name || 'Kunde',
      orderNumber: order.orderNumber,
      items: typedOrder.items.map((item: any) => ({
        id: item.id,
        name: item.product.nameDe,
        nameDe: item.product.nameDe,
        quantity: item.quantity,
        price: Number(item.unitPrice),
        image: item.product.images?.[0]?.url,
      })),
      subtotal,
      shipping,
      tax,
      total,
      shippingAddress: {
        name: shippingAddr?.name || typedOrder.user.name || '',
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
    const unsubscribeUrl = `https://nova-indukt.de/api/newsletter/unsubscribe?email=${encodeURIComponent(email)}`

    const html = await render(
      NewsletterConfirmationEmail({
        email,
        firstName,
        unsubscribeUrl,
      })
    )

    const result = await resend.emails.send({
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

    const result = await resend.emails.send({
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

    const result = await resend.emails.send({
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
