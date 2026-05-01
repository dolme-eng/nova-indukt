import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAdmin } from "@/lib/admin/require-admin"

export async function GET(req: NextRequest) {
  const authz = await requireAdmin()
  if (!authz.ok) return NextResponse.json({ error: "Unauthorized" }, { status: authz.status })

  const { searchParams } = new URL(req.url)
  const take = Math.min(Math.max(Number(searchParams.get("take") || 50), 1), 200)
  const cursor = searchParams.get("cursor")

  const items = await prisma.auditLog.findMany({
    orderBy: { createdAt: "desc" },
    take,
    ...(cursor ? { skip: 1, cursor: { id: cursor } } : {}),
    select: {
      id: true,
      action: true,
      entityType: true,
      entityId: true,
      userId: true,
      createdAt: true,
    },
  })

  const response = NextResponse.json({
    items,
    nextCursor: items.length === take ? items[items.length - 1].id : null,
  })
  response.headers.set("Cache-Control", "no-store")
  return response
}

