import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/admin/require-admin'
import { rateLimit, getIP, createRateLimitKey } from '@/lib/rate-limit'

export async function GET(req: NextRequest) {
  const authz = await requireAdmin()
  if (!authz.ok) return NextResponse.json({ error: 'Unauthorized' }, { status: authz.status })

  const rl = await rateLimit(createRateLimitKey(getIP(req), 'admin:categories'), { windowMs: 60_000, maxRequests: 30 })
  if (!rl.success) return NextResponse.json({ error: 'Zu viele Anfragen' }, { status: 429 })

  const categories = await prisma.category.findMany({
    orderBy: { nameDe: 'asc' }
  })

  return NextResponse.json(categories)
}
