import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAdmin } from "@/lib/admin/require-admin"
import { auditLog } from "@/lib/admin/audit"

export async function GET(_req: NextRequest, context: { params: Promise<{ slug: string }> }) {
  const authz = await requireAdmin()
  if (!authz.ok) return NextResponse.json({ error: "Unauthorized" }, { status: authz.status })

  const { slug } = await context.params
  const page = await prisma.staticPageContent.findUnique({ where: { slug } })
  if (!page) return NextResponse.json({ error: "Not found" }, { status: 404 })
  return NextResponse.json(page)
}

export async function PUT(req: NextRequest, context: { params: Promise<{ slug: string }> }) {
  const authz = await requireAdmin()
  if (!authz.ok) return NextResponse.json({ error: "Unauthorized" }, { status: authz.status })

  const { slug } = await context.params
  const before = await prisma.staticPageContent.findUnique({ where: { slug } })
  if (!before) return NextResponse.json({ error: "Not found" }, { status: 404 })

  const body = await req.json()
  const { title, content, isActive } = body ?? {}

  const page = await prisma.staticPageContent.update({
    where: { slug },
    data: {
      title: typeof title === "string" ? title : undefined,
      content: typeof content === "string" ? content : undefined,
      isActive: typeof isActive === "boolean" ? isActive : undefined,
    },
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
}

