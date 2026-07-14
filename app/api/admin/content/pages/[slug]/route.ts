import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAdmin } from "@/lib/admin/require-admin"
import { auditLog } from "@/lib/admin/audit"
import { updateStaticPageSchema } from "@/lib/validations/admin"

export async function GET(_req: NextRequest, context: { params: Promise<{ slug: string }> }) {
  try {
    const authz = await requireAdmin()
    if (!authz.ok) return NextResponse.json({ error: "Unauthorized" }, { status: authz.status })

    const { slug } = await context.params
    const page = await prisma.staticPageContent.findUnique({ where: { slug } })
    if (!page) return NextResponse.json({ error: "Not found" }, { status: 404 })
    return NextResponse.json(page)
  } catch (error) {
    console.error("[PAGES_SLUG_GET]", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

export async function PUT(req: NextRequest, context: { params: Promise<{ slug: string }> }) {
  try {
    const authz = await requireAdmin()
    if (!authz.ok) return NextResponse.json({ error: "Unauthorized" }, { status: authz.status })

    const { slug } = await context.params
    const before = await prisma.staticPageContent.findUnique({ where: { slug } })
    if (!before) return NextResponse.json({ error: "Not found" }, { status: 404 })

    const body = await req.json()
    const parsed = updateStaticPageSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Ungültige Daten", details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      )
    }

    const page = await prisma.staticPageContent.update({
      where: { slug },
      data: parsed.data,
    })

    await auditLog({
      action: "UPDATE",
      entityType: "StaticPageContent",
      entityId: page.id,
      userId: authz.session.user.id,
      oldValues: before,
      newValues: page,
      ipAddress: req.headers.get("x-forwarded-for"),
      userAgent: req.headers.get("user-agent"),
    })

    return NextResponse.json(page)
  } catch (error) {
    console.error("[PAGES_SLUG_PUT]", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

