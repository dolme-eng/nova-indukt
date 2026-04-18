import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    const { id } = await params

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

    // Update product and handle images separately
    const product = await prisma.product.update({
      where: { id },
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
      }
    })

    // Update images if provided
    if (images && Array.isArray(images)) {
      // Simple approach: delete all and recreate
      await prisma.productImage.deleteMany({
        where: { productId: id }
      })

      await prisma.productImage.createMany({
        data: images.map((img: any, index: number) => ({
          productId: id,
          url: img.url,
          alt: img.alt || nameDe,
          sortOrder: index,
          isMain: index === 0
        }))
      })
    }

    return NextResponse.json(product)
  } catch (error) {
    console.error("[PRODUCT_PATCH]", error)
    return new NextResponse("Internal error", { status: 500 })
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    const { id } = await params

    if (!session || session.user?.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    await prisma.product.delete({
      where: { id }
    })

    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error("[PRODUCT_DELETE]", error)
    return new NextResponse("Internal error", { status: 500 })
  }
}
