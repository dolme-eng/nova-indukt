"use server"

import { revalidatePath } from "next/cache"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { cookies } from "next/headers"
import { CartItem } from "@/lib/store/cart"

const CART_COOKIE = "nova-cart"
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
            product: true
          }
        }
      }
    })
    
    if (!cart) {
      cart = await prisma.cart.create({
        data: {
          userId: session.user.id
        },
        include: {
          items: {
            include: {
              product: true
            }
          }
        }
      })
    }
    
    return { type: "db" as const, cart }
  } else {
    // Guest user - use cookie cart
    const cartCookie = cookieStore.get(CART_COOKIE)
    const items: CartItem[] = cartCookie ? JSON.parse(cartCookie.value) : []
    
    return { type: "cookie" as const, items }
  }
}

// Add item to cart
export async function addToCart(productId: string, quantity: number = 1) {
  try {
    const cart = await getCart()
    
    if (cart.type === "db") {
      // Database cart for logged in users
      const existingItem = cart.cart.items.find(
        item => item.productId === productId
      )
      
      if (existingItem) {
        await prisma.cartItem.update({
          where: { id: existingItem.id },
          data: { quantity: existingItem.quantity + quantity }
        })
      } else {
        await prisma.cartItem.create({
          data: {
            cartId: cart.cart.id,
            productId,
            quantity
          }
        })
      }
    } else {
      // Cookie cart for guests
      const cookieStore = await cookies()
      const items = cart.items
      
      const existingIndex = items.findIndex(item => item.product.id === productId)
      
      if (existingIndex >= 0) {
        items[existingIndex].quantity += quantity
      } else {
        // We need to fetch the product to add it to the cookie cart
        const product = await prisma.product.findUnique({
          where: { id: productId },
          include: { images: true }
        })
        
        if (product) {
          items.push({ 
            product: {
              ...product,
              price: Number(product.price),
              oldPrice: product.oldPrice ? Number(product.oldPrice) : undefined
            } as any, 
            quantity 
          })
        }
      }
      
      cookieStore.set(CART_COOKIE, JSON.stringify(items), {
        maxAge: CART_COOKIE_MAX_AGE,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax"
      })
    }
    
    revalidatePath("/warenkorb")
    return { success: true }
  } catch (error) {
    console.error("Error adding to cart:", error)
    return { success: false, error: "Failed to add item" }
  }
}

// Update cart item quantity
export async function updateCartItem(productId: string, quantity: number) {
  try {
    const cart = await getCart()
    
    if (cart.type === "db") {
      const item = cart.cart.items.find(item => item.productId === productId)
      
      if (item) {
        if (quantity <= 0) {
          await prisma.cartItem.delete({
            where: { id: item.id }
          })
        } else {
          await prisma.cartItem.update({
            where: { id: item.id },
            data: { quantity }
          })
        }
      }
    } else {
      const cookieStore = await cookies()
      let items = cart.items
      
      if (quantity <= 0) {
        items = items.filter(item => item.product.id !== productId)
      } else {
        const index = items.findIndex(item => item.product.id === productId)
        if (index >= 0) {
          items[index].quantity = quantity
        }
      }
      
      cookieStore.set(CART_COOKIE, JSON.stringify(items), {
        maxAge: CART_COOKIE_MAX_AGE,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax"
      })
    }
    
    revalidatePath("/warenkorb")
    return { success: true }
  } catch (error) {
    console.error("Error updating cart:", error)
    return { success: false, error: "Failed to update item" }
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
    
    if (cart.type === "db") {
      return cart.cart.items.map(item => ({
        id: item.product.id,
        name: item.product.nameDe,
        price: Number(item.product.price),
        image: (item.product as any).images?.[0]?.url || "",
        slug: item.product.slug,
        quantity: item.quantity
      }))
    } else {
      // For cookie cart, fetch product details
      const items = cart.items
      const productIds = items.map(item => item.product.id)
      
      const products = await prisma.product.findMany({
        where: { id: { in: productIds } },
        include: { images: true }
      })
      
      return items.map(item => {
        const product = products.find(p => p.id === item.product.id)
        return {
          id: product?.id || item.product.id,
          name: product?.nameDe || "Produkt",
          price: Number(product?.price || 0),
          image: product?.images?.[0]?.url || "",
          slug: product?.slug || "",
          quantity: item.quantity
        }
      })
    }
  } catch (error) {
    console.error("Error getting cart:", error)
    return []
  }
}

// Clear cart
export async function clearCart() {
  try {
    const cart = await getCart()
    const cookieStore = await cookies()
    
    if (cart.type === "db") {
      await prisma.cartItem.deleteMany({
        where: { cartId: cart.cart.id }
      })
    }
    
    // Always clear cookie
    cookieStore.delete(CART_COOKIE)
    
    revalidatePath("/warenkorb")
    return { success: true }
  } catch (error) {
    console.error("Error clearing cart:", error)
    return { success: false, error: "Failed to clear cart" }
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
    
    const guestItems: CartItem[] = JSON.parse(cartCookie.value)
    if (guestItems.length === 0) return
    
    // Get or create user cart
    let cart = await prisma.cart.findUnique({
      where: { userId: session.user.id },
      include: { items: true }
    })
    
    if (!cart) {
      cart = await prisma.cart.create({
        data: { userId: session.user.id },
        include: { items: true }
      })
    }
    
    // Merge items
    for (const guestItem of guestItems) {
      const existingItem = cart.items.find(
        item => item.productId === guestItem.product.id
      )
      
      if (existingItem) {
        await prisma.cartItem.update({
          where: { id: existingItem.id },
          data: { quantity: existingItem.quantity + guestItem.quantity }
        })
      } else {
        await prisma.cartItem.create({
          data: {
            cartId: cart.id,
            productId: guestItem.product.id,
            quantity: guestItem.quantity
          }
        })
      }
    }
    
    // Clear guest cart cookie
    cookieStore.delete(CART_COOKIE)
    
  } catch (error) {
    console.error("Error merging cart:", error)
  }
}
