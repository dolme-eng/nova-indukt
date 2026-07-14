import { NextRequest, NextResponse } from "next/server"
import { requireAdmin } from "@/lib/admin/require-admin"
import { auditLog } from "@/lib/admin/audit"
import { prisma } from "@/lib/prisma"
import { updateProductSchema } from "@/lib/validations/admin"
import type { Prisma } from "@prisma/client"
import { rateLimit, getIP, createRateLimitKey } from "@/lib/rate-limit"
import { logError } from "@/lib/logger"

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authz = await requireAdmin()
    if (!authz.ok) return NextResponse.json({ error: "Unauthorized" }, { status: authz.status })

    const ip = getIP(req)
    const { success } = await rateLimit(createRateLimitKey(ip, "admin:products:id"), { windowMs: 60_000, maxRequests: 15 })
    if (!success) return NextResponse.json({ error: "Zu viele Anfragen" }, { status: 429 })

    const { id } = await params

    const body = await req.json()
    const parsed = updateProductSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Ungültige Daten", details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      )
    }

    const { images, ...productData } = parsed.data
    const before = await prisma.product.findUnique({ where: { id } })

    const product = await prisma.product.update({
      where: { id },
      data: productData as Prisma.ProductUpdateInput,
    })

    if (images && Array.isArray(images)) {
      await prisma.productImage.deleteMany({ where: { productId: id } })
      await prisma.productImage.createMany({
        data: images.map((img, index) => ({
          productId: id,
          url: img.url,
          alt: img.alt || productData.nameDe || '',
          sortOrder: index,
          isMain: index === 0,
        }))
      })
    }

    await auditLog({
      action: "UPDATE",
      entityType: "Product",
      entityId: product.id,
      userId: authz.session.user.id,
      oldValues: before,
      newValues: product,
      ipAddress: req.headers.get("x-forwarded-for"),
      userAgent: req.headers.get("user-agent"),
    })

    return NextResponse.json(product)
  } catch (error) {
    logError("[PRODUCT_PATCH]", error)
    return new NextResponse("Internal error", { status: 500 })
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authz = await requireAdmin()
    if (!authz.ok) return NextResponse.json({ error: "Unauthorized" }, { status: authz.status })

    const ip = getIP(req)
    const { success } = await rateLimit(createRateLimitKey(ip, "admin:products:id"), { windowMs: 60_000, maxRequests: 15 })
    if (!success) return NextResponse.json({ error: "Zu viele Anfragen" }, { status: 429 })

    const { id } = await params

    const before = await prisma.product.findUnique({ where: { id } })
    await prisma.product.delete({ where: { id } })

    await auditLog({
      action: "DELETE",
      entityType: "Product",
      entityId: id,
      userId: authz.session.user.id,
      oldValues: before,
      ipAddress: req.headers.get("x-forwarded-for"),
      userAgent: req.headers.get("user-agent"),
    })

    return new NextResponse(null, { status: 204 })
  } catch (error) {
    logError("[PRODUCT_DELETE]", error)
    return new NextResponse("Internal error", { status: 500 })
  }
}
