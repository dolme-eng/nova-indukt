import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { prisma } from "@/lib/prisma"
import { requireAdmin } from "@/lib/admin/require-admin"
import { auditLog } from "@/lib/admin/audit"
import type { Prisma } from "@prisma/client"

const KEY = "site"

const settingsSchema = z.record(z.string(), z.unknown())

export async function GET() {
  const authz = await requireAdmin()
  if (!authz.ok) return NextResponse.json({ error: "Unauthorized" }, { status: authz.status })

  const cfg = await prisma.appConfig.findUnique({ where: { key: KEY } })
  return NextResponse.json({ key: KEY, data: cfg?.data ?? {} })
}

export async function PUT(req: NextRequest) {
  const authz = await requireAdmin()
  if (!authz.ok) return NextResponse.json({ error: "Unauthorized" }, { status: authz.status })

  const body = await req.json()
  const parsed = settingsSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Ungültige Daten", details: parsed.error.flatten().fieldErrors },
      { status: 400 }
    )
  }

  const data = parsed.data
  const before = await prisma.appConfig.findUnique({ where: { key: KEY } })

  const cfg = await prisma.appConfig.upsert({
    where: { key: KEY },
    update: { data: data as Prisma.InputJsonValue },
    create: { key: KEY, data: data as Prisma.InputJsonValue },
  })

  await auditLog({
    action: "UPSERT",
    entityType: "AppConfig",
    entityId: cfg.id,
    userId: authz.session.user.id,
    oldValues: before?.data ?? null,
    newValues: cfg.data,
    ipAddress: req.headers.get("x-forwarded-for"),
    userAgent: req.headers.get("user-agent"),
  })

  return NextResponse.json({ key: KEY, data: cfg.data })
}

