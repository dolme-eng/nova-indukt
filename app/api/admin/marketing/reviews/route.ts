import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { requireAdmin } from "@/lib/admin/require-admin"
import { auditLog } from "@/lib/admin/audit"
import { prisma } from "@/lib/prisma"

const marketingReviewSchema = z.discriminatedUnion('action', [
  z.object({
    id: z.string().min(1),
    action: z.literal('toggle-publish'),
    isPublished: z.boolean(),
  }),
  z.object({
    id: z.string().min(1),
    action: z.literal('toggle-verify'),
    isVerified: z.boolean(),
  }),
])

export async function PATCH(req: NextRequest) {
  try {
    const authz = await requireAdmin()
    if (!authz.ok) return new NextResponse("Unauthorized", { status: authz.status })

    const body = await req.json()
    const parsed = marketingReviewSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Ungültige Daten", details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      )
    }

    const { id, action } = parsed.data

    if (action === "toggle-publish") {
      const { isPublished } = parsed.data
      const before = await prisma.review.findUnique({ where: { id } })
      const review = await prisma.review.update({
        where: { id },
        data: { isPublished }
      })

      const publishedReviews = await prisma.review.findMany({
        where: { productId: review.productId, isPublished: true },
        select: { rating: true }
      })

      const avgRating = publishedReviews.length > 0
        ? publishedReviews.reduce((sum, r) => sum + r.rating, 0) / publishedReviews.length
        : 0

      await prisma.product.update({
        where: { id: review.productId },
        data: {
          reviewCount: publishedReviews.length,
          rating: Math.round(avgRating * 10) / 10
        }
      })

      await auditLog({
        action: "UPDATE",
        entityType: "Review",
        entityId: id,
        userId: authz.session.user.id,
        oldValues: { isPublished: before?.isPublished },
        newValues: { isPublished },
        ipAddress: req.headers.get("x-forwarded-for"),
        userAgent: req.headers.get("user-agent"),
      })

      return NextResponse.json(review)
    }

    if (action === "toggle-verify") {
      const { isVerified } = parsed.data
      const before = await prisma.review.findUnique({ where: { id } })
      const review = await prisma.review.update({
        where: { id },
        data: { isVerified }
      })

      await auditLog({
        action: "UPDATE",
        entityType: "Review",
        entityId: id,
        userId: authz.session.user.id,
        oldValues: { isVerified: before?.isVerified },
        newValues: { isVerified },
        ipAddress: req.headers.get("x-forwarded-for"),
        userAgent: req.headers.get("user-agent"),
      })

      return NextResponse.json(review)
    }

    return new NextResponse("Invalid action", { status: 400 })
  } catch (error) {
    console.error("[MARKETING_PATCH]", error)
    return new NextResponse("Internal error", { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const authz = await requireAdmin()
    if (!authz.ok) return new NextResponse("Unauthorized", { status: authz.status })

    const { searchParams } = new URL(req.url)
    const id = searchParams.get("id")
    if (!id) return new NextResponse("Missing ID", { status: 400 })

    const before = await prisma.review.findUnique({ where: { id } })
    await prisma.review.delete({ where: { id } })

    await auditLog({
      action: "DELETE",
      entityType: "Review",
      entityId: id,
      userId: authz.session.user.id,
      oldValues: before,
      ipAddress: req.headers.get("x-forwarded-for"),
      userAgent: req.headers.get("user-agent"),
    })

    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error("[MARKETING_DELETE]", error)
    return new NextResponse("Internal error", { status: 500 })
  }
}
