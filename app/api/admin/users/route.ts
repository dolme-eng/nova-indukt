import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAdmin } from "@/lib/admin/require-admin"
import { auditLog } from "@/lib/admin/audit"
import { rateLimit, getIP, createRateLimitKey } from "@/lib/rate-limit"

export async function GET(req: NextRequest) {
  try {
    const authz = await requireAdmin()
    if (!authz.ok) return NextResponse.json({ error: "Unauthorized" }, { status: authz.status })

    const rl = await rateLimit(createRateLimitKey(getIP(req), "admin:users"), { windowMs: 60_000, maxRequests: 20 })
    if (!rl.success) return NextResponse.json({ error: "Zu viele Anfragen" }, { status: 429 })

    const { searchParams } = new URL(req.url)
    const take = Math.min(Math.max(Number(searchParams.get("take") || 200), 1), 500)
    const cursor = searchParams.get("cursor")

    const users = await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      take,
      ...(cursor ? { skip: 1, cursor: { id: cursor } } : {}),
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        emailVerified: true,
      },
    })

    await auditLog({
      action: "READ",
      entityType: "User",
      entityId: "list",
      userId: authz.session.user.id,
      newValues: { count: users.length, take, hasCursor: !!cursor },
      ipAddress: req.headers.get("x-forwarded-for"),
      userAgent: req.headers.get("user-agent"),
    })

    const response = NextResponse.json({
      items: users,
      nextCursor: users.length === take ? users[users.length - 1].id : null,
    })
    response.headers.set("Cache-Control", "no-store")
    return response
  } catch (error) {
    console.error("[USERS_GET]", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

