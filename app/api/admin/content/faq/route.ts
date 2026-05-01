import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAdmin } from "@/lib/admin/require-admin"
import { auditLog } from "@/lib/admin/audit"

export async function GET() {
  const authz = await requireAdmin()
  if (!authz.ok) return NextResponse.json({ error: "Unauthorized" }, { status: authz.status })

  const items = await prisma.faqItem.findMany({
    orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
  })
  return NextResponse.json(items)
}

export async function POST(req: NextRequest) {
  const authz = await requireAdmin()
  if (!authz.ok) return NextResponse.json({ error: "Unauthorized" }, { status: authz.status })

  const body = await req.json()
  const { question, answer, category = "support", sortOrder = 0, isActive = true } = body ?? {}

  if (!question || !answer) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 })
  }

  const item = await prisma.faqItem.create({
    data: { question, answer, category, sortOrder: Number(sortOrder) || 0, isActive: Boolean(isActive) },
  })

  await auditLog({
    action: "CREATE",
    entityType: "FaqItem",
    entityId: item.id,
    userId: authz.session.user.id,
    newValues: item,
    ipAddress: req.headers.get("x-forwarded-for"),
    userAgent: req.headers.get("user-agent"),
  })

  return NextResponse.json(item)
}

