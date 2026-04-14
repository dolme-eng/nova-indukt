import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      include: {
        _count: {
          select: {
            products: true
          }
        }
      },
      orderBy: {
        nameDe: "asc"
      }
    })
    
    return NextResponse.json(
      categories.map(cat => ({
        id: cat.id,
        slug: cat.slug,
        name: {
          de: cat.nameDe,
          en: cat.nameEn
        },
        description: {
          de: cat.descriptionDe,
          en: cat.descriptionEn
        },
        image: cat.image,
        productCount: cat._count.products
      }))
    )
  } catch (error) {
    console.error("Error fetching categories:", error)
    return NextResponse.json(
      { error: "Failed to fetch categories" },
      { status: 500 }
    )
  }
}
