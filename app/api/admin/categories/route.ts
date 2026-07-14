import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/admin/require-admin'
import { rateLimit, getIP, createRateLimitKey } from '@/lib/rate-limit'
import { logError } from '@/lib/logger'

export async function GET(req: NextRequest) {
  try {
    const authz = await requireAdmin()
    if (!authz.ok) return NextResponse.json({ error: 'Unauthorized' }, { status: authz.status })

    const rl = await rateLimit(createRateLimitKey(getIP(req), 'admin:categories'), { windowMs: 60_000, maxRequests: 30 })
    if (!rl.success) return NextResponse.json({ error: 'Zu viele Anfragen' }, { status: 429 })

    const categories = await prisma.category.findMany({
      orderBy: { nameDe: 'asc' }
    })

    return NextResponse.json(categories)
  } catch (error) {
    logError("[CATEGORIES_GET]", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
