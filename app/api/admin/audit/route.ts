import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAdmin } from "@/lib/admin/require-admin"
import { rateLimit, getIP, createRateLimitKey } from "@/lib/rate-limit"
import { logError } from "@/lib/logger"

export async function GET(req: NextRequest) {
  try {
    const authz = await requireAdmin()
    if (!authz.ok) return NextResponse.json({ error: "Unauthorized" }, { status: authz.status })

    const rl = await rateLimit(createRateLimitKey(getIP(req), "admin:audit"), { windowMs: 60_000, maxRequests: 20 })
    if (!rl.success) return NextResponse.json({ error: "Zu viele Anfragen" }, { status: 429 })

    const { searchParams } = new URL(req.url)
    const take = Math.min(Math.max(Number(searchParams.get("take") || 50), 1), 200)
    const cursor = searchParams.get("cursor")

    const items = await prisma.auditLog.findMany({
      orderBy: { createdAt: "desc" },
      take,
      ...(cursor ? { skip: 1, cursor: { id: cursor } } : {}),
      select: {
        id: true,
        action: true,
        entityType: true,
        entityId: true,
        userId: true,
        createdAt: true,
      },
    })

    const response = NextResponse.json({
      items,
      nextCursor: items.length === take ? items[items.length - 1].id : null,
    })
    response.headers.set("Cache-Control", "no-store")
    return response
  } catch (error) {
    logError("[AUDIT_GET]", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

