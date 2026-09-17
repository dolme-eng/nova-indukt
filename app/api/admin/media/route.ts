import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { prisma } from "@/lib/prisma"
import { requireAdmin } from "@/lib/admin/require-admin"
import { auditLog } from "@/lib/admin/audit"
import { deleteImage } from "@/lib/cloudinary"
import { rateLimit, getIP, createRateLimitKey } from "@/lib/rate-limit"
import { logError } from "@/lib/logger"
import { validateCsrfToken } from "@/lib/csrf"

const mediaAssetSchema = z.object({
  publicId: z.string().min(1).max(200),
  url: z.string().url().max(2000),
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
    // Cursor pagination (publicId is @unique): ?cursor=<publicId> continues
    // after it. Without cursor the first page is returned.
    const cursor = searchParams.get("cursor") || undefined

    const assets = await prisma.mediaAsset.findMany({
      where: folder ? { folder } : undefined,
      orderBy: { createdAt: "desc" },
      ...(cursor ? { cursor: { publicId: cursor }, skip: 1 } : {}),
      take: 200,
    })

    return NextResponse.json({
      assets,
      nextCursor:
        assets.length === 200 ? assets[assets.length - 1].publicId : null,
    })
  } catch (error) {
    logError("[MEDIA_GET]", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const authz = await requireAdmin()
    if (!authz.ok) return NextResponse.json({ error: "Unauthorized" }, { status: authz.status })

    const csrfError = validateCsrfToken(req)
    if (csrfError) return csrfError

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
      ipAddress: getIP(req),
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

    const csrfError = validateCsrfToken(req)
    if (csrfError) return csrfError

    const rl = await rateLimit(createRateLimitKey(getIP(req), "admin:media:delete"), { windowMs: 60_000, maxRequests: 15 })
    if (!rl.success) return NextResponse.json({ error: "Zu viele Anfragen" }, { status: 429 })

    const { searchParams } = new URL(req.url)
    const publicId = searchParams.get("publicId")
    if (!publicId) return NextResponse.json({ error: "publicId required" }, { status: 400 })

    const before = await prisma.mediaAsset.findUnique({ where: { publicId } })

    try {
      await deleteImage(publicId)
    } catch (cloudErr) {
      logError("[MEDIA_DELETE_CLOUDINARY]", cloudErr)
      return NextResponse.json({ error: "Cloudinary-Löschfehlgeschlagen" }, { status: 500 })
    }

    if (before) {
      try {
        await prisma.mediaAsset.delete({ where: { publicId } })
      } catch (dbError) {
        const { Prisma } = await import("@prisma/client")
        // P2025 = deleted concurrently after our read
        if (
          dbError instanceof Prisma.PrismaClientKnownRequestError &&
          dbError.code === "P2025"
        ) {
          return NextResponse.json({ success: true, deduped: true })
        }
        throw dbError
      }
    }

    if (before) {
      await auditLog({
        action: "DELETE",
        entityType: "MediaAsset",
        entityId: before.id,
        userId: authz.session.user.id,
        oldValues: before,
        ipAddress: getIP(req),
        userAgent: req.headers.get("user-agent"),
      })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    logError("[MEDIA_DELETE]", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

