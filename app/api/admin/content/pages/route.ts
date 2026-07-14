import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAdmin } from "@/lib/admin/require-admin"
import { auditLog } from "@/lib/admin/audit"
import { createStaticPageSchema } from "@/lib/validations/admin"
import { rateLimit, getIP, createRateLimitKey } from "@/lib/rate-limit"
import { logError } from "@/lib/logger"

export async function GET(req: NextRequest) {
  const rl = await rateLimit(createRateLimitKey(getIP(req), 'admin:content:pages'), { windowMs: 60_000, maxRequests: 30 })
  if (!rl.success) return NextResponse.json({ error: 'Zu viele Anfragen' }, { status: 429 })
  try {
    const authz = await requireAdmin()
    if (!authz.ok) return NextResponse.json({ error: "Unauthorized" }, { status: authz.status })

    const pages = await prisma.staticPageContent.findMany({
      orderBy: { updatedAt: "desc" },
      select: { id: true, slug: true, title: true, isActive: true, updatedAt: true },
    })
    return NextResponse.json(pages)
  } catch (error) {
    logError("[PAGES_GET]", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  const rl = await rateLimit(createRateLimitKey(getIP(req), 'admin:content:pages:post'), { windowMs: 60_000, maxRequests: 15 })
  if (!rl.success) return NextResponse.json({ error: 'Zu viele Anfragen' }, { status: 429 })
  try {
    const authz = await requireAdmin()
    if (!authz.ok) return NextResponse.json({ error: "Unauthorized" }, { status: authz.status })

    const body = await req.json()
    const parsed = createStaticPageSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Ungültige Daten", details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      )
    }

    const page = await prisma.staticPageContent.create({ data: parsed.data })

    await auditLog({
      action: "CREATE",
      entityType: "StaticPageContent",
      entityId: page.id,
      userId: authz.session.user.id,
      newValues: page,
      ipAddress: req.headers.get("x-forwarded-for"),
      userAgent: req.headers.get("user-agent"),
    })

    return NextResponse.json(page)
  } catch (error) {
    logError("[PAGES_POST]", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

