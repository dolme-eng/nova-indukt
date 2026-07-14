import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { prisma } from "@/lib/prisma"
import { requireAdmin } from "@/lib/admin/require-admin"
import { auditLog } from "@/lib/admin/audit"
import { deleteImage } from "@/lib/cloudinary"
import { rateLimit, getIP, createRateLimitKey } from "@/lib/rate-limit"
import { logError } from "@/lib/logger"

const mediaAssetSchema = z.object({
  publicId: z.string().min(1),
  url: z.string().url(),
  width: z.number().positive().optional(),
  height: z.number().positive().optional(),
  bytes: z.number().nonnegative().optional(),
  format: z.string().max(10).optional(),
  folder: z.string().max(200).optional(),
})

export async function GET(req: NextRequest) {
  try {
    const authz = await requireAdmin()
    if (!authz.ok) return NextResponse.json({ error: "Unauthorized" }, { status: authz.status })

    const rl = await rateLimit(createRateLimitKey(getIP(req), "admin:media"), { windowMs: 60_000, maxRequests: 30 })
    if (!rl.success) return NextResponse.json({ error: "Zu viele Anfragen" }, { status: 429 })

    const { searchParams } = new URL(req.url)
    const folder = searchParams.get("folder") || undefined

    const assets = await prisma.mediaAsset.findMany({
      where: folder ? { folder } : undefined,
      orderBy: { createdAt: "desc" },
      take: 200,
    })

    return NextResponse.json(assets)
  } catch (error) {
    logError("[MEDIA_GET]", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const authz = await requireAdmin()
    if (!authz.ok) return NextResponse.json({ error: "Unauthorized" }, { status: authz.status })

    const rl = await rateLimit(createRateLimitKey(getIP(req), "admin:media:post"), { windowMs: 60_000, maxRequests: 15 })
    if (!rl.success) return NextResponse.json({ error: "Zu viele Anfragen" }, { status: 429 })

    const body = await req.json()
    const parsed = mediaAssetSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Ungültige Daten", details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      )
    }

    const { publicId, url, width, height, bytes, format, folder } = parsed.data

    const asset = await prisma.mediaAsset.upsert({
      where: { publicId },
      update: {
        url,
        width,
        height,
        bytes,
        format,
        folder,
      },
      create: {
        publicId,
        url,
        width,
        height,
        bytes,
        format,
        folder,
        uploadedByUserId: authz.session.user.id,
      },
    })

    await auditLog({
      action: "UPSERT",
      entityType: "MediaAsset",
      entityId: asset.id,
      userId: authz.session.user.id,
      newValues: asset,
      ipAddress: req.headers.get("x-forwarded-for"),
      userAgent: req.headers.get("user-agent"),
    })

    return NextResponse.json(asset)
  } catch (error) {
    logError("[MEDIA_POST]", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const authz = await requireAdmin()
    if (!authz.ok) return NextResponse.json({ error: "Unauthorized" }, { status: authz.status })

    const rl = await rateLimit(createRateLimitKey(getIP(req), "admin:media:delete"), { windowMs: 60_000, maxRequests: 15 })
    if (!rl.success) return NextResponse.json({ error: "Zu viele Anfragen" }, { status: 429 })

    const { searchParams } = new URL(req.url)
    const publicId = searchParams.get("publicId")
    if (!publicId) return NextResponse.json({ error: "publicId required" }, { status: 400 })

    const before = await prisma.mediaAsset.findUnique({ where: { publicId } })
    if (before) {
      await prisma.mediaAsset.delete({ where: { publicId } })
    }
    await deleteImage(publicId)

    if (before) {
      await auditLog({
        action: "DELETE",
        entityType: "MediaAsset",
        entityId: before.id,
        userId: authz.session.user.id,
        oldValues: before,
        ipAddress: req.headers.get("x-forwarded-for"),
        userAgent: req.headers.get("user-agent"),
      })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    logError("[MEDIA_DELETE]", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

