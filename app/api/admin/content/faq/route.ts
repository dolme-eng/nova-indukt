import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAdmin } from "@/lib/admin/require-admin"
import { auditLog } from "@/lib/admin/audit"
import { createFaqSchema } from "@/lib/validations/admin"

export async function GET() {
  try {
    const authz = await requireAdmin()
    if (!authz.ok) return NextResponse.json({ error: "Unauthorized" }, { status: authz.status })

    const items = await prisma.faqItem.findMany({
      orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
    })
    return NextResponse.json(items)
  } catch (error) {
    console.error("[FAQ_GET]", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const authz = await requireAdmin()
    if (!authz.ok) return NextResponse.json({ error: "Unauthorized" }, { status: authz.status })

    const body = await req.json()
    const parsed = createFaqSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Ungültige Daten", details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      )
    }

    const item = await prisma.faqItem.create({ data: parsed.data })

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
  } catch (error) {
    console.error("[FAQ_POST]", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

