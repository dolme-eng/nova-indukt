import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function POST(req: Request) {
  try {
    const session = await auth()
    if (!session || session.user?.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const body = await req.json()
    const {
      nameDe,
      nameEn,
      slug,
      supplierSku,
      ean,
      descriptionDe,
      descriptionEn,
      shortDescription,
      price,
      oldPrice,
      costPrice,
      stock,
      stockAlertAt,
      categoryId,
      isActive,
      weightKg,
      brand,
      material,
      dimensions,
      dishwasherSafe,
      inductionSafe,
      images
    } = body

    if (!nameDe || !slug || !price || !categoryId) {
      return new NextResponse("Missing required fields", { status: 400 })
    }

    const product = await prisma.product.create({
      data: {
        nameDe,
        nameEn,
        slug,
        supplierSku,
        ean,
        descriptionDe,
        descriptionEn,
        shortDescription,
        price,
        oldPrice,
        costPrice,
        stock,
        stockAlertAt,
        categoryId,
        isActive,
        weightKg,
        brand,
        material,
        dimensions,
        dishwasherSafe,
        inductionSafe,
        images: {
          createMany: {
            data: images.map((img: any, index: number) => ({
              url: img.url,
              alt: img.alt || nameDe,
              sortOrder: index,
              isMain: index === 0
            }))
          }
        }
      }
    })

    return NextResponse.json(product)
  } catch (error) {
    console.error("[PRODUCTS_POST]", error)
    return new NextResponse("Internal error", { status: 500 })
  }
}
