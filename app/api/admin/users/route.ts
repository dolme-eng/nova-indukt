import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAdmin } from "@/lib/admin/require-admin"

export async function GET(req: NextRequest) {
  const authz = await requireAdmin()
  if (!authz.ok) return NextResponse.json({ error: "Unauthorized" }, { status: authz.status })

  const { searchParams } = new URL(req.url)
  const take = Math.min(Math.max(Number(searchParams.get("take") || 200), 1), 500)
  const cursor = searchParams.get("cursor")

  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    take,
    ...(cursor ? { skip: 1, cursor: { id: cursor } } : {}),
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
      emailVerified: true,
    },
  })
  const response = NextResponse.json({
    items: users,
    nextCursor: users.length === take ? users[users.length - 1].id : null,
  })
  response.headers.set("Cache-Control", "no-store")
  return response
}

