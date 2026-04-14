import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { z } from "zod"

const syncSchema = z.object({
  localItems: z.array(z.object({
    id: z.string(),
  })),
})

// POST - Sync localStorage wishlist with DB on login
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
    const result = syncSchema.safeParse(body)
    
    if (!result.success) {
      return NextResponse.json(
        { error: "Validation failed", details: result.error.flatten() },
        { status: 400 }
      )
    }
    
    const { localItems } = result.data
    const userId = session.user.id
    
    // Get existing DB wishlist
    const existingDbItems = await prisma.wishlistItem.findMany({
      where: { userId },
      select: { productId: true },
    })
    
    const existingProductIds = new Set(existingDbItems.map(item => item.productId))
    const localProductIds = localItems.map(item => item.id)
    
    // Find items to add (in local but not in DB)
    const itemsToAdd = localProductIds.filter(id => !existingProductIds.has(id))
    
    // Find items to remove from local (optional - if you want bidirectional sync)
    // const itemsToRemove = [...existingProductIds].filter(id => !localProductIds.includes(id))
    
    // Add new items to DB
    if (itemsToAdd.length > 0) {
      // Verify products exist
      const existingProducts = await prisma.product.findMany({
        where: {
          id: { in: itemsToAdd },
        },
        select: { id: true },
      })
      
      const validProductIds = new Set(existingProducts.map(p => p.id))
      
      const createData = itemsToAdd
        .filter(id => validProductIds.has(id))
        .map(productId => ({
          userId,
          productId,
        }))
      
      if (createData.length > 0) {
        await prisma.wishlistItem.createMany({
          data: createData,
          skipDuplicates: true,
        })
      }
    }
    
    // Fetch updated wishlist
    const updatedWishlist = await prisma.wishlistItem.findMany({
      where: { userId },
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
    
    return NextResponse.json({
      success: true,
      added: itemsToAdd.length,
      wishlist: updatedWishlist.map(item => ({
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
      })),
    })
  } catch (error) {
    console.error("Error syncing wishlist:", error)
    return NextResponse.json(
      { error: "Failed to sync wishlist" },
      { status: 500 }
    )
  }
}
