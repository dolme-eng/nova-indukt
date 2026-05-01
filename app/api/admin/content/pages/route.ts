import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAdmin } from "@/lib/admin/require-admin"
import { auditLog } from "@/lib/admin/audit"

export async function GET() {
  const authz = await requireAdmin()
  if (!authz.ok) return NextResponse.json({ error: "Unauthorized" }, { status: authz.status })

  const pages = await prisma.staticPageContent.findMany({
    orderBy: { updatedAt: "desc" },
    select: { id: true, slug: true, title: true, isActive: true, updatedAt: true },
  })
  return NextResponse.json(pages)
}

export async function POST(req: NextRequest) {
  const authz = await requireAdmin()
  if (!authz.ok) return NextResponse.json({ error: "Unauthorized" }, { status: authz.status })

  const body = await req.json()
  const { slug, title, content, isActive = true } = body ?? {}

  if (!slug || !title || typeof content !== "string") {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 })
  }

  const page = await prisma.staticPageContent.create({
    data: { slug, title, content, isActive: Boolean(isActive) },
  })

  await auditLog({
    action: "CREATE",
    entityType: "StaticPageContent",
    entityId: page.id,
    userId: authz.session.user.id,
    newValues: page,
    ipAddress: req.headers.get("x-forwarded-for"),
    userAgent: req.headers.get("user-agent"),
  })

  return NextResponse.json(page)
}

