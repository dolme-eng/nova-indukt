import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { revalidatePath } from "next/cache"
import { sendOrderConfirmationForOrder } from "@/lib/email/send"

// Get user's orders
export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }
    
    const orders = await prisma.order.findMany({
      where: { userId: session.user.id },
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
      },
      orderBy: {
        createdAt: "desc"
      }
    })
    
    return NextResponse.json(
      orders.map(order => ({
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
      }))
    )
  } catch (error) {
    console.error("Error fetching orders:", error)
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    )
  }
}

// Create new order
export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    const body = await request.json()
    
    const {
      items,
      shippingData,
      paymentMethod,
      subtotal,
      shipping,
      total
    } = body
    
    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: "Cart is empty" },
        { status: 400 }
      )
    }
    
    // Generate order number
    const orderNumber = `NOV-${Date.now().toString(36).toUpperCase()}`
    
    // Create order
    const order = await prisma.order.create({
      data: {
        orderNumber,
        userId: session?.user?.id || null,
        customerEmail: shippingData.email,
        customerName: `${shippingData.firstName} ${shippingData.lastName}`,
        customerPhone: shippingData.phone,
        shippingAddress: {
          firstName: shippingData.firstName,
          lastName: shippingData.lastName,
          street: shippingData.address,
          zip: shippingData.zipCode,
          city: shippingData.city,
          country: shippingData.country,
        },
        paymentMethod: paymentMethod.toUpperCase(),
        status: "PENDING",
        paymentStatus: "PENDING",
        subtotal,
        shippingCost: shipping,
        total,
        items: {
          create: items.map((item: any) => ({
            productId: item.id,
            quantity: item.quantity,
            unitPrice: item.price,
            productName: item.name,
            productSlug: item.slug || '',
            vatRate: 19,
          }))
        }
      },
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
    
    // Clear user's cart if logged in
    if (session?.user?.id) {
      await prisma.cartItem.deleteMany({
        where: {
          cart: {
            userId: session.user.id
          }
        }
      })
    }
    
    // Send order confirmation email
    // This is non-blocking - we don't want to fail the order if email fails
    try {
      await sendOrderConfirmationForOrder(order.id)
    } catch (emailError) {
      console.error("Failed to send order confirmation email:", emailError)
      // Continue - order is still created even if email fails
    }
    
    revalidatePath("/mein-konto/orders")
    
    return NextResponse.json({
      ...order,
      total: Number(order.total),
      subtotal: Number(order.subtotal),
      shippingCost: Number(order.shippingCost)
    })
  } catch (error) {
    console.error("Error creating order:", error)
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    )
  }
}
