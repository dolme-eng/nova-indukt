import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { prisma } from "@/lib/prisma"
import { requireAdmin } from "@/lib/admin/require-admin"
import { auditLog } from "@/lib/admin/audit"
import { rateLimit, getIP, createRateLimitKey } from "@/lib/rate-limit"

const updateUserRoleSchema = z.object({
  role: z.enum(["USER", "ADMIN"]),
})

export async function PATCH(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const authz = await requireAdmin()
    if (!authz.ok) return NextResponse.json({ error: "Unauthorized" }, { status: authz.status })

    const rl = await rateLimit(createRateLimitKey(getIP(req), "admin:users:update"), { windowMs: 60_000, maxRequests: 20 })
    if (!rl.success) return NextResponse.json({ error: "Zu viele Anfragen" }, { status: 429 })

    const { id } = await context.params
    const before = await prisma.user.findUnique({ where: { id } })
    if (!before) return NextResponse.json({ error: "Not found" }, { status: 404 })

    const body = await req.json()
    const parsed = updateUserRoleSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Ungültige Daten", details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      )
    }

    const { role } = parsed.data

    // Prevent self-demotion from ADMIN (basic safety)
    if (before.id === authz.session.user.id && before.role === "ADMIN" && role !== "ADMIN") {
      return NextResponse.json({ error: "You cannot remove your own admin role." }, { status: 400 })
    }

    const user = await prisma.user.update({
      where: { id },
      data: { role },
      select: { id: true, email: true, role: true, name: true },
    })

    await auditLog({
      action: "UPDATE",
      entityType: "User",
      entityId: user.id,
      userId: authz.session.user.id,
      oldValues: { role: before.role },
      newValues: { role: user.role },
      ipAddress: req.headers.get("x-forwarded-for"),
      userAgent: req.headers.get("user-agent"),
    })

    return NextResponse.json(user)
  } catch (error) {
    console.error("[USERS_PATCH]", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

