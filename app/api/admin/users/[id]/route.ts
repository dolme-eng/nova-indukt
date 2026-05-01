import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAdmin } from "@/lib/admin/require-admin"
import { auditLog } from "@/lib/admin/audit"

export async function PATCH(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  const authz = await requireAdmin()
  if (!authz.ok) return NextResponse.json({ error: "Unauthorized" }, { status: authz.status })

  const { id } = await context.params
  const before = await prisma.user.findUnique({ where: { id } })
  if (!before) return NextResponse.json({ error: "Not found" }, { status: 404 })

  const body = await req.json()
  const { role } = body ?? {}

  if (role !== "USER" && role !== "ADMIN") {
    return NextResponse.json({ error: "Invalid role" }, { status: 400 })
  }

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
}

