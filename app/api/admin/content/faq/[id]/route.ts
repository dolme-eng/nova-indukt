import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAdmin } from "@/lib/admin/require-admin"
import { auditLog } from "@/lib/admin/audit"
import { updateFaqSchema } from "@/lib/validations/admin"
import { rateLimit, getIP, createRateLimitKey } from "@/lib/rate-limit"
import { logError } from "@/lib/logger"

export async function PUT(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  const rl = await rateLimit(createRateLimitKey(getIP(req), 'admin:content:faq:put'), { windowMs: 60_000, maxRequests: 15 })
  if (!rl.success) return NextResponse.json({ error: 'Zu viele Anfragen' }, { status: 429 })
  try {
    const authz = await requireAdmin()
    if (!authz.ok) return NextResponse.json({ error: "Unauthorized" }, { status: authz.status })

    const { id } = await context.params
    const before = await prisma.faqItem.findUnique({ where: { id } })
    if (!before) return NextResponse.json({ error: "Not found" }, { status: 404 })

    const body = await req.json()
    const parsed = updateFaqSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Ungültige Daten", details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      )
    }

    const item = await prisma.faqItem.update({
      where: { id },
      data: parsed.data,
    })

    await auditLog({
      action: "UPDATE",
      entityType: "FaqItem",
      entityId: item.id,
      userId: authz.session.user.id,
      oldValues: before,
      newValues: item,
      ipAddress: req.headers.get("x-forwarded-for"),
      userAgent: req.headers.get("user-agent"),
    })

    return NextResponse.json(item)
  } catch (error) {
    logError("[FAQ_PUT]", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  const rl = await rateLimit(createRateLimitKey(getIP(req), 'admin:content:faq:delete'), { windowMs: 60_000, maxRequests: 15 })
  if (!rl.success) return NextResponse.json({ error: 'Zu viele Anfragen' }, { status: 429 })
  try {
    const authz = await requireAdmin()
    if (!authz.ok) return NextResponse.json({ error: "Unauthorized" }, { status: authz.status })

    const { id } = await context.params
    const before = await prisma.faqItem.findUnique({ where: { id } })
    if (!before) return NextResponse.json({ error: "Not found" }, { status: 404 })

    await prisma.faqItem.delete({ where: { id } })

    await auditLog({
      action: "DELETE",
      entityType: "FaqItem",
      entityId: before.id,
      userId: authz.session.user.id,
      oldValues: before,
      ipAddress: req.headers.get("x-forwarded-for"),
      userAgent: req.headers.get("user-agent"),
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    logError("[FAQ_DELETE]", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

