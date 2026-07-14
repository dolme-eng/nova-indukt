import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { requireAdmin } from "@/lib/admin/require-admin"
import { auditLog } from "@/lib/admin/audit"
import { uploadImage } from "@/lib/cloudinary"
import { rateLimit, getIP, createRateLimitKey } from "@/lib/rate-limit"
import { logError } from "@/lib/logger"

const ALLOWED_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"]
const MAX_SIZE = 10 * 1024 * 1024

export async function POST(request: NextRequest) {
  try {
    const authz = await requireAdmin()
    if (!authz.ok) return new NextResponse("Unauthorized", { status: authz.status })

    const rl = await rateLimit(createRateLimitKey(getIP(request), "admin:upload"), { windowMs: 60_000, maxRequests: 15 })
    if (!rl.success) return NextResponse.json({ error: "Zu viele Anfragen" }, { status: 429 })

    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json({ error: "Ungültiger Dateityp. Erlaubt: JPG, PNG, WebP, GIF" }, { status: 400 })
    }

    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: "Datei zu groß. Maximum: 10MB" }, { status: 400 })
    }

    const buffer = Buffer.from(await file.arrayBuffer())
    const base64File = `data:${file.type};base64,${buffer.toString("base64")}`

    const result = await uploadImage(base64File, "nova-indukt/products")

    await auditLog({
      action: "CREATE",
      entityType: "MediaAsset",
      entityId: result.public_id,
      userId: authz.session.user.id,
      newValues: { url: result.secure_url, publicId: result.public_id, format: result.format, size: result.bytes },
      ipAddress: request.headers.get("x-forwarded-for"),
      userAgent: request.headers.get("user-agent"),
    })

    return NextResponse.json({
      url: result.secure_url,
      publicId: result.public_id
    })
  } catch (error) {
    logError("Upload error:", error)
    return NextResponse.json({ error: "Upload failed" }, { status: 500 })
  }
}
