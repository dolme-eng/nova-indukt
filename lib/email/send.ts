import { resend, FROM_EMAIL, FROM_NAME } from './resend'
import { render } from '@react-email/render'
import OrderConfirmationEmail from './templates/order-confirmation'
import ShippingNotificationEmail from './templates/shipping-notification'
import { prisma } from '../prisma'

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
        shippingAddress: params.shippingAddress,
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

// Helper to calculate order totals and send confirmation
export async function sendOrderConfirmationForOrder(orderId: string) {
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
        shippingAddress: true,
      },
    })

    if (!order || !order.user?.email) {
      throw new Error('Order or user email not found')
    }

    // Calculate subtotal (without tax)
    const subtotal = order.subtotal || order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
    const shipping = order.shippingCost || 0
    const tax = order.tax || subtotal * 0.19
    const total = order.total || subtotal + shipping + tax

    // Calculate estimated delivery (2-3 business days)
    const deliveryDate = new Date()
    deliveryDate.setDate(deliveryDate.getDate() + 3)
    const estimatedDelivery = deliveryDate.toLocaleDateString('de-DE', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
    })

    const result = await sendOrderConfirmation({
      to: order.user.email,
      customerName: order.user.name || 'Kunde',
      orderNumber: order.orderNumber,
      items: order.items.map(item => ({
        id: item.id,
        name: item.product.nameDe,
        nameDe: item.product.nameDe,
        quantity: item.quantity,
        price: item.price,
        image: item.product.images?.[0]?.url,
      })),
      subtotal,
      shipping,
      tax,
      total,
      shippingAddress: {
        name: order.shippingAddress?.name || order.user.name || '',
        street: order.shippingAddress?.street || '',
        street2: order.shippingAddress?.street2,
        postalCode: order.shippingAddress?.postalCode || '',
        city: order.shippingAddress?.city || '',
        state: order.shippingAddress?.state,
        country: order.shippingAddress?.country || 'DE',
      },
      estimatedDelivery,
    })

    return result
  } catch (error) {
    console.error('Error sending order confirmation for order:', error)
    return { success: false, error }
  }
}
