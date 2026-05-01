import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAdmin } from "@/lib/admin/require-admin"
import { auditLog } from "@/lib/admin/audit"
import { deleteImage } from "@/lib/cloudinary"

export async function GET(req: NextRequest) {
  const authz = await requireAdmin()
  if (!authz.ok) return NextResponse.json({ error: "Unauthorized" }, { status: authz.status })

  const { searchParams } = new URL(req.url)
  const folder = searchParams.get("folder") || undefined

  const assets = await prisma.mediaAsset.findMany({
    where: folder ? { folder } : undefined,
    orderBy: { createdAt: "desc" },
    take: 200,
  })

  return NextResponse.json(assets)
}

export async function POST(req: NextRequest) {
  const authz = await requireAdmin()
  if (!authz.ok) return NextResponse.json({ error: "Unauthorized" }, { status: authz.status })

  const body = await req.json()
  const { publicId, url, width, height, bytes, format, folder } = body ?? {}

  if (!publicId || !url) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 })
  }

  const asset = await prisma.mediaAsset.upsert({
    where: { publicId },
    update: {
      url,
      width: typeof width === "number" ? width : undefined,
      height: typeof height === "number" ? height : undefined,
      bytes: typeof bytes === "number" ? bytes : undefined,
      format: typeof format === "string" ? format : undefined,
      folder: typeof folder === "string" ? folder : undefined,
    },
    create: {
      publicId,
      url,
      width: typeof width === "number" ? width : undefined,
      height: typeof height === "number" ? height : undefined,
      bytes: typeof bytes === "number" ? bytes : undefined,
      format: typeof format === "string" ? format : undefined,
      folder: typeof folder === "string" ? folder : undefined,
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
}

export async function DELETE(req: NextRequest) {
  const authz = await requireAdmin()
  if (!authz.ok) return NextResponse.json({ error: "Unauthorized" }, { status: authz.status })

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
}

