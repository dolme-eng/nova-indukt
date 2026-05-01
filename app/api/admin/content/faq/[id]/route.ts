import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAdmin } from "@/lib/admin/require-admin"
import { auditLog } from "@/lib/admin/audit"

export async function PUT(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  const authz = await requireAdmin()
  if (!authz.ok) return NextResponse.json({ error: "Unauthorized" }, { status: authz.status })

  const { id } = await context.params
  const before = await prisma.faqItem.findUnique({ where: { id } })
  if (!before) return NextResponse.json({ error: "Not found" }, { status: 404 })

  const body = await req.json()
  const { question, answer, category, sortOrder, isActive } = body ?? {}

  const item = await prisma.faqItem.update({
    where: { id },
    data: {
      category: typeof category === "string" ? category : undefined,
      question: typeof question === "string" ? question : undefined,
      answer: typeof answer === "string" ? answer : undefined,
      sortOrder: typeof sortOrder === "number" ? sortOrder : undefined,
      isActive: typeof isActive === "boolean" ? isActive : undefined,
    },
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
}

export async function DELETE(req: NextRequest, context: { params: Promise<{ id: string }> }) {
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
}

