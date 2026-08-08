import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAdmin } from "@/lib/admin/require-admin"
import { auditLog } from "@/lib/admin/audit"
import type { Prisma } from "@prisma/client"
import { rateLimit, getIP, createRateLimitKey } from "@/lib/rate-limit"
import { logError } from "@/lib/logger"
import { validateCsrfToken } from "@/lib/csrf"

const KEY = "site"

// Validate settings: max 2 levels of nesting, max 50KB, max 50 chars per string value
function validateSettings(data: unknown): { ok: boolean; error?: string } {
  if (typeof data !== 'object' || data === null || Array.isArray(data)) {
    return { ok: false, error: 'Settings must be an object' }
  }
  const json = JSON.stringify(data)
  if (json.length > 50_000) {
    return { ok: false, error: 'Settings payload too large (max 50KB)' }
  }
  function walk(obj: Record<string, unknown>, depth: number): string | null {
    if (depth > 2) return 'Settings nesting too deep (max 2 levels)'
    for (const [k, v] of Object.entries(obj)) {
      if (k.length > 100) return `Key "${k.slice(0, 30)}..." too long (max 100)`
      if (typeof v === 'string' && v.length > 500) {
        return `Value for "${k}" too long (max 500 chars)`
      }
      if (typeof v === 'object' && v !== null && !Array.isArray(v)) {
        const err = walk(v as Record<string, unknown>, depth + 1)
        if (err) return err
      }
    }
    return null
  }
  const err = walk(data as Record<string, unknown>, 0)
  if (err) return { ok: false, error: err }
  return { ok: true }
}

export async function GET(req: NextRequest) {
  const authz = await requireAdmin()
  if (!authz.ok) return NextResponse.json({ error: "Unauthorized" }, { status: authz.status })
  try {
    const rl = await rateLimit(createRateLimitKey(getIP(req), 'admin:settings'), { windowMs: 60_000, maxRequests: 30 })
    if (!rl.success) return NextResponse.json({ error: 'Zu viele Anfragen' }, { status: 429 })

    const cfg = await prisma.appConfig.findUnique({ where: { key: KEY } })
    return NextResponse.json({ key: KEY, data: cfg?.data ?? {} })
  } catch (error) {
    logError("[SETTINGS_GET]", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  const authz = await requireAdmin()
  if (!authz.ok) return NextResponse.json({ error: "Unauthorized" }, { status: authz.status })
  try {
    const rl = await rateLimit(createRateLimitKey(getIP(req), 'admin:settings:put'), { windowMs: 60_000, maxRequests: 15 })
    if (!rl.success) return NextResponse.json({ error: 'Zu viele Anfragen' }, { status: 429 })

    const csrfError = validateCsrfToken(req)
    if (csrfError) return csrfError

    const body = await req.json()
    const validation = validateSettings(body)
    if (!validation.ok) {
      return NextResponse.json(
        { error: validation.error },
        { status: 400 }
      )
    }

    const data = body
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
  } catch (error) {
    logError("[SETTINGS_PUT]", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

