import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { z } from "zod"

const wishlistItemSchema = z.object({
  productId: z.string(),
})

// GET - Fetch user's wishlist
export async function GET() {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }
    
    const wishlistItems = await prisma.wishlistItem.findMany({
      where: { userId: session.user.id },
      include: {
        product: {
          include: {
            images: true,
            category: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })
    
    return NextResponse.json(
      wishlistItems.map(item => ({
        id: item.product.id,
        wishlistItemId: item.id,
        name: {
          de: item.product.nameDe,
          en: item.product.nameEn,
        },
        price: Number(item.product.price),
        oldPrice: item.product.oldPrice ? Number(item.product.oldPrice) : null,
        image: item.product.images.find(img => img.isMain)?.url || item.product.images[0]?.url,
        slug: item.product.slug,
        category: item.product.category?.nameDe,
        stock: item.product.stock,
        addedAt: item.createdAt,
      }))
    )
  } catch (error) {
    console.error("Error fetching wishlist:", error)
    return NextResponse.json(
      { error: "Failed to fetch wishlist" },
      { status: 500 }
    )
  }
}

// POST - Add item to wishlist
export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }
    
    const body = await request.json()
    const result = wishlistItemSchema.safeParse(body)
    
    if (!result.success) {
      return NextResponse.json(
        { error: "Validation failed", details: result.error.flatten() },
        { status: 400 }
      )
    }
    
    const { productId } = result.data
    
    // Check if product exists
    const product = await prisma.product.findUnique({
      where: { id: productId },
    })
    
    if (!product) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      )
    }
    
    // Check if already in wishlist
    const existing = await prisma.wishlistItem.findUnique({
      where: {
        userId_productId: {
          userId: session.user.id,
          productId,
        },
      },
    })
    
    if (existing) {
      return NextResponse.json(
        { error: "Product already in wishlist" },
        { status: 409 }
      )
    }
    
    // Add to wishlist
    const wishlistItem = await prisma.wishlistItem.create({
      data: {
        userId: session.user.id,
        productId,
      },
      include: {
        product: {
          include: {
            images: true,
          },
        },
      },
    })
    
    return NextResponse.json(
      {
        success: true,
        id: wishlistItem.id,
        product: {
          id: wishlistItem.product.id,
          name: wishlistItem.product.nameDe,
          price: Number(wishlistItem.product.price),
          image: wishlistItem.product.images.find(img => img.isMain)?.url || wishlistItem.product.images[0]?.url,
          slug: wishlistItem.product.slug,
        },
      },
      { status: 201 }
    )
  } catch (error) {
    console.error("Error adding to wishlist:", error)
    return NextResponse.json(
      { error: "Failed to add to wishlist" },
      { status: 500 }
    )
  }
}

// DELETE - Clear entire wishlist or specific item
export async function DELETE(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }
    
    const { searchParams } = new URL(request.url)
    const productId = searchParams.get('productId')
    
    if (productId) {
      // Delete specific item
      await prisma.wishlistItem.deleteMany({
        where: {
          userId: session.user.id,
          productId,
        },
      })
      
      return NextResponse.json(
        { success: true, message: "Item removed from wishlist" }
      )
    } else {
      // Clear entire wishlist
      await prisma.wishlistItem.deleteMany({
        where: { userId: session.user.id },
      })
      
      return NextResponse.json(
        { success: true, message: "Wishlist cleared" }
      )
    }
  } catch (error) {
    console.error("Error removing from wishlist:", error)
    return NextResponse.json(
      { error: "Failed to remove from wishlist" },
      { status: 500 }
    )
  }
}
