import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { createProductSchema } from "@/lib/validations/product"
import type { ProductImageInput } from "@/lib/validations/product"

export async function POST(req: Request) {
  try {
    const session = await auth()
    if (!session || session.user?.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const body = await req.json()
    
    // Validation Zod du body
    const validationResult = createProductSchema.safeParse(body)
    
    if (!validationResult.success) {
      return NextResponse.json(
        { 
          error: 'Validation failed', 
          details: validationResult.error.flatten().fieldErrors 
        },
        { status: 400 }
      )
    }
    
    const {
      nameDe,
      slug,
      supplierSku,
      ean,
      descriptionDe,
      shortDescription,
      price,
      oldPrice,
      costPrice,
      stock,
      initialStock,
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
    } = validationResult.data

    const product = await prisma.product.create({
      data: {
        nameDe,
        slug,
        supplierSku,
        ean,
        descriptionDe,
        shortDescription,
        price,
        oldPrice,
        costPrice,
        stock,
        initialStock,
        stockAlertAt: stockAlertAt ?? undefined,
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
            data: images.map((img: ProductImageInput, index: number) => ({
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
