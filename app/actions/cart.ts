'use server'

import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { cookies } from 'next/headers'
import { logError } from '@/lib/logger'
import { z } from 'zod'

const addToCartSchema = z.object({
  productId: z.string().min(1, 'Product ID is required').max(100),
  quantity: z
    .number()
    .int()
    .min(1, 'Quantity must be at least 1')
    .max(99, 'Maximum quantity is 99')
    .default(1),
})

// Lightweight cookie entry — only IDs + quantities (no product objects)
interface CartCookieItem {
  productId: string
  quantity: number
}

const CART_COOKIE = 'nova-cart'
const CART_COOKIE_MAX_AGE = 60 * 60 * 24 * 30 // 30 days

// Helper to get or create cart
async function getCart() {
  const session = await auth()
  const cookieStore = await cookies()

  if (session?.user?.id) {
    // User is logged in - use database cart
    let cart = await prisma.cart.findUnique({
      where: { userId: session.user.id },
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
      },
    })

    if (!cart) {
      cart = await prisma.cart.create({
        data: {
          userId: session.user.id,
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
        },
      })
    }

    return { type: 'db' as const, cart }
  } else {
    // Guest user - use cookie cart
    const cartCookie = cookieStore.get(CART_COOKIE)
    let items: CartCookieItem[] = []
    if (cartCookie) {
      try {
        items = JSON.parse(cartCookie.value)
      } catch {
        items = []
      }
    }
    return { type: 'cookie' as const, items }
  }
}

// Lightweight cart fetch for mutation operations (no product images/details)
async function getCartMeta() {
  const session = await auth()
  const cookieStore = await cookies()

  if (session?.user?.id) {
    let cart = await prisma.cart.findUnique({
      where: { userId: session.user.id },
      include: {
        items: {
          select: { id: true, productId: true, quantity: true },
        },
      },
    })

    if (!cart) {
      cart = await prisma.cart.create({
        data: { userId: session.user.id },
        include: {
          items: {
            select: { id: true, productId: true, quantity: true },
          },
        },
      })
    }

    return { type: 'db' as const, cart }
  } else {
    const cartCookie = cookieStore.get(CART_COOKIE)
    let items: CartCookieItem[] = []
    if (cartCookie) {
      try {
        items = JSON.parse(cartCookie.value)
      } catch {
        items = []
      }
    }
    return { type: 'cookie' as const, items }
  }
}

// Add item to cart
export async function addToCart(productId: string, quantity: number = 1) {
  const parsed = addToCartSchema.safeParse({ productId, quantity })
  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors }
  }
  const { productId: validProductId, quantity: validQuantity } = parsed.data

  try {
    const cart = await getCartMeta()

    if (cart.type === 'db') {
      const existingItem = cart.cart.items.find((item) => item.productId === validProductId)

      if (existingItem) {
        await prisma.cartItem.update({
          where: { id: existingItem.id },
          data: { quantity: existingItem.quantity + validQuantity },
        })
      } else {
        await prisma.cartItem.create({
          data: {
            cartId: cart.cart.id,
            productId: validProductId,
            quantity: validQuantity,
          },
        })
      }
    } else {
      // Cookie cart for guests — store only IDs (product details hydrated on read)
      const cookieStore = await cookies()
      const items: CartCookieItem[] = cart.items as CartCookieItem[]

      const existingIndex = items.findIndex((item) => item.productId === validProductId)

      if (existingIndex >= 0) {
        items[existingIndex].quantity += validQuantity
      } else {
        items.push({ productId: validProductId, quantity: validQuantity })
      }

      cookieStore.set(CART_COOKIE, JSON.stringify(items), {
        maxAge: CART_COOKIE_MAX_AGE,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
      })
    }

    revalidatePath('/warenkorb')
    return { success: true }
  } catch (error) {
    logError('Error adding to cart:', error)
    return { success: false, error: 'Failed to add item' }
  }
}

// Update cart item quantity
export async function updateCartItem(productId: string, quantity: number) {
  try {
    const cart = await getCartMeta()

    if (cart.type === 'db') {
      const item = cart.cart.items.find((item) => item.productId === productId)

      if (item) {
        if (quantity <= 0) {
          await prisma.cartItem.delete({
            where: { id: item.id },
          })
        } else {
          await prisma.cartItem.update({
            where: { id: item.id },
            data: { quantity },
          })
        }
      }
    } else {
      const cookieStore = await cookies()
      let items = cart.items

      if (quantity <= 0) {
        items = items.filter((item) => item.productId !== productId)
      } else {
        const index = items.findIndex((item) => item.productId === productId)
        if (index >= 0) {
          items[index].quantity = quantity
        }
      }

      cookieStore.set(CART_COOKIE, JSON.stringify(items), {
        maxAge: CART_COOKIE_MAX_AGE,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
      })
    }

    revalidatePath('/warenkorb')
    return { success: true }
  } catch (error) {
    logError('Error updating cart:', error)
    return { success: false, error: 'Failed to update item' }
  }
}

// Remove item from cart
export async function removeFromCart(productId: string) {
  return updateCartItem(productId, 0)
}

// Get cart items with product details
export async function getCartItems() {
  try {
    const cart = await getCart()

    if (cart.type === 'db') {
      return cart.cart.items.map((item) => ({
        id: item.product.id,
        name: { de: item.product.nameDe },
        price: Number(item.product.price),
        image: item.product.images?.[0]?.url || '',
        slug: item.product.slug,
        quantity: item.quantity,
      }))
    } else {
      // Cookie cart — hydrate product details from DB
      const items = cart.items
      const productIds = items.map((item) => item.productId)

      const products = await prisma.product.findMany({
        where: { id: { in: productIds } },
        include: { images: true },
      })

      return items.map((item) => {
        const product = products.find((p) => p.id === item.productId)
        return {
          id: item.productId,
          name: { de: product?.nameDe || 'Produkt' },
          price: Number(product?.price || 0),
          image: product?.images?.[0]?.url || '',
          slug: product?.slug || '',
          quantity: item.quantity,
        }
      })
    }
  } catch (error) {
    logError('Error getting cart:', error)
    return []
  }
}

// Clear cart
export async function clearCart() {
  try {
    const cart = await getCartMeta()
    const cookieStore = await cookies()

    if (cart.type === 'db') {
      await prisma.cartItem.deleteMany({
        where: { cartId: cart.cart.id },
      })
    }

    // Always clear cookie
    cookieStore.delete(CART_COOKIE)

    revalidatePath('/warenkorb')
    return { success: true }
  } catch (error) {
    logError('Error clearing cart:', error)
    return { success: false, error: 'Failed to clear cart' }
  }
}

// Merge guest cart on login
export async function mergeGuestCartOnLogin() {
  try {
    const session = await auth()
    if (!session?.user?.id) return

    const cookieStore = await cookies()
    const cartCookie = cookieStore.get(CART_COOKIE)

    if (!cartCookie) return

    let guestItems: CartCookieItem[] = []
    try {
      guestItems = JSON.parse(cartCookie.value)
    } catch {
      cookieStore.delete(CART_COOKIE)
      return
    }
    if (guestItems.length === 0) return

    // Get or create user cart
    let cart = await prisma.cart.findUnique({
      where: { userId: session.user.id },
      include: { items: true },
    })

    if (!cart) {
      cart = await prisma.cart.create({
        data: { userId: session.user.id },
        include: { items: true },
      })
    }

    // Merge items in a transaction
    await prisma.$transaction(async (tx) => {
      for (const guestItem of guestItems) {
        const existingItem = cart!.items.find((item) => item.productId === guestItem.productId)

        if (existingItem) {
          await tx.cartItem.update({
            where: { id: existingItem.id },
            data: { quantity: existingItem.quantity + guestItem.quantity },
          })
        } else {
          await tx.cartItem.create({
            data: {
              cartId: cart!.id,
              productId: guestItem.productId,
              quantity: guestItem.quantity,
            },
          })
        }
      }
    })

    // Clear guest cart cookie
    cookieStore.delete(CART_COOKIE)
  } catch (error) {
    logError('Error merging cart:', error)
  }
}
