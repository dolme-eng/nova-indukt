import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAdmin } from "@/lib/admin/require-admin"
import { auditLog } from "@/lib/admin/audit"
import { createProductSchema } from "@/lib/validations/product"
import type { ProductImageInput } from "@/lib/validations/product"
import { rateLimit, getIP, createRateLimitKey } from "@/lib/rate-limit"

export async function POST(req: NextRequest) {
  try {
    const authz = await requireAdmin()
    if (!authz.ok) return new NextResponse("Unauthorized", { status: authz.status })

    const rl = await rateLimit(createRateLimitKey(getIP(req), "admin:products"), { windowMs: 60_000, maxRequests: 10 })
    if (!rl.success) return NextResponse.json({ error: "Zu viele Anfragen" }, { status: 429 })

    const body = await req.json()
    
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
      ean,
      descriptionDe,
      shortDescription,
      price,
      oldPrice,
      costPrice,
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
        ean,
        descriptionDe,
        shortDescription,
        price,
        oldPrice,
        costPrice,
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

    await auditLog({
      action: "CREATE",
      entityType: "Product",
      entityId: product.id,
      userId: authz.session.user.id,
      newValues: { slug: product.slug, nameDe: product.nameDe, price: product.price },
      ipAddress: req.headers.get("x-forwarded-for"),
      userAgent: req.headers.get("user-agent"),
    })

    return NextResponse.json(product)
  } catch (error) {
    console.error("[PRODUCTS_POST]", error)
    return new NextResponse("Internal error", { status: 500 })
  }
}
