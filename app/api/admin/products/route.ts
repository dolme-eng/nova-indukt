import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAdmin } from "@/lib/admin/require-admin"
import { auditLog } from "@/lib/admin/audit"
import { createProductSchema } from "@/lib/validations/product"
import type { ProductImageInput } from "@/lib/validations/product"
import { rateLimit, getIP, createRateLimitKey } from "@/lib/rate-limit"
import { logError } from "@/lib/logger"
import { validateCsrfToken } from "@/lib/csrf"

export async function GET(req: NextRequest) {
  try {
    const authz = await requireAdmin()
    if (!authz.ok) return NextResponse.json({ error: "Nicht autorisiert" }, { status: authz.status })

    const { searchParams } = new URL(req.url)
    const limit = Math.min(parseInt(searchParams.get('limit') || '100', 10) || 100, 500)
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10) || 1)
    const skip = (page - 1) * limit

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        take: limit,
        skip,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          nameDe: true,
          slug: true,
          price: true,
          isActive: true,
          categoryId: true,
          images: {
            where: { isMain: true },
            take: 1,
            select: { url: true },
          },
        },
      }),
      prisma.product.count(),
    ])

    return NextResponse.json({
      products,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      total,
    })
  } catch (error) {
    logError("[PRODUCTS_GET]", error)
    return NextResponse.json({ error: 'Interner Fehler' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const authz = await requireAdmin()
    if (!authz.ok) return NextResponse.json({ error: "Nicht autorisiert" }, { status: authz.status })

    const csrfError = validateCsrfToken(req)
    if (csrfError) return csrfError

    const rl = await rateLimit(createRateLimitKey(getIP(req), "admin:products"), { windowMs: 60_000, maxRequests: 10 })
    if (!rl.success) return NextResponse.json({ error: "Zu viele Anfragen" }, { status: 429 })

    const body = await req.json()
    
    const validationResult = createProductSchema.safeParse(body)
    
    if (!validationResult.success) {
      return NextResponse.json(
        { 
          error: 'Validierung fehlgeschlagen', 
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
    logError("[PRODUCTS_POST]", error)
    return NextResponse.json({ error: 'Interner Fehler' }, { status: 500 })
  }
}
