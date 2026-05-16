import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      where: {
        isActive: true,
      },
      select: {
        id: true,
        slug: true,
        nameDe: true,
        description: true,
        image: true,
        _count: {
          select: {
            products: true
          }
        }
      },
      orderBy: {
        sortOrder: "asc"
      }
    })
    
    // Ne retourner que les catégories avec des produits
    const categoriesWithProducts = categories.filter(cat => cat._count.products > 0)
    
    const response = NextResponse.json(
      categoriesWithProducts.map(cat => ({
        id: cat.id,
        slug: cat.slug,
        name: {
          de: cat.nameDe,
          en: cat.nameDe
        },
        description: {
          de: cat.description,
          en: cat.description
        },
        image: cat.image,
        productCount: cat._count.products
      }))
    )
    response.headers.set("Cache-Control", "public, s-maxage=300, stale-while-revalidate=900")
    return response
  } catch (error) {
    console.error("Error fetching categories:", error)
    return NextResponse.json(
      { error: "Failed to fetch categories" },
      { status: 500 }
    )
  }
}
