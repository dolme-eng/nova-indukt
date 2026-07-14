import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/admin/require-admin'
import { auditLog } from '@/lib/admin/audit'
import { prisma } from '@/lib/prisma'
import { updatePromotionAdminSchema } from '@/lib/validations/admin'
import { rateLimit, getIP, createRateLimitKey } from '@/lib/rate-limit'

// GET - Récupérer une promotion spécifique
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const rl = await rateLimit(createRateLimitKey(getIP(request), 'admin:promotions:get'), { windowMs: 60_000, maxRequests: 30 })
  if (!rl.success) return NextResponse.json({ error: 'Zu viele Anfragen' }, { status: 429 })
  try {
    const authz = await requireAdmin()
    if (!authz.ok) return NextResponse.json({ error: 'Unauthorized' }, { status: authz.status })

    const { id } = await params
    const promotion = await prisma.promotion.findUnique({ where: { id } })

    if (!promotion) {
      return NextResponse.json({ error: 'Promotion not found' }, { status: 404 })
    }

    return NextResponse.json(promotion)
  } catch (error) {
    console.error('Error fetching promotion:', error)
    return NextResponse.json({ error: 'Failed to fetch promotion' }, { status: 500 })
  }
}

// PUT - Mettre à jour une promotion
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const rl = await rateLimit(createRateLimitKey(getIP(request), 'admin:promotions:put'), { windowMs: 60_000, maxRequests: 15 })
  if (!rl.success) return NextResponse.json({ error: 'Zu viele Anfragen' }, { status: 429 })
  try {
    const authz = await requireAdmin()
    if (!authz.ok) return NextResponse.json({ error: 'Unauthorized' }, { status: authz.status })

    const { id } = await params
    const body = await request.json()
    const parsed = updatePromotionAdminSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Ungültige Daten', details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      )
    }

    const before = await prisma.promotion.findUnique({ where: { id } })
    if (!before) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    const data = parsed.data
    const promotion = await prisma.promotion.update({
      where: { id },
      data: {
        ...data,
        startDate: data.startDate ? new Date(data.startDate) : undefined,
        endDate: data.endDate ? new Date(data.endDate) : undefined,
      }
    })

    await auditLog({
      action: 'UPDATE',
      entityType: 'Promotion',
      entityId: promotion.id,
      userId: authz.session.user.id,
      oldValues: before,
      newValues: promotion,
      ipAddress: request.headers.get('x-forwarded-for'),
      userAgent: request.headers.get('user-agent'),
    })

    return NextResponse.json(promotion)
  } catch (error) {
    console.error('Error updating promotion:', error)
    return NextResponse.json({ error: 'Failed to update promotion' }, { status: 500 })
  }
}

// DELETE - Supprimer une promotion
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const rl = await rateLimit(createRateLimitKey(getIP(request), 'admin:promotions:delete'), { windowMs: 60_000, maxRequests: 15 })
  if (!rl.success) return NextResponse.json({ error: 'Zu viele Anfragen' }, { status: 429 })
  try {
    const authz = await requireAdmin()
    if (!authz.ok) return NextResponse.json({ error: 'Unauthorized' }, { status: authz.status })

    const { id } = await params
    const before = await prisma.promotion.findUnique({ where: { id } })
    if (!before) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    await prisma.promotion.delete({ where: { id } })

    await auditLog({
      action: 'DELETE',
      entityType: 'Promotion',
      entityId: id,
      userId: authz.session.user.id,
      oldValues: before,
      ipAddress: request.headers.get('x-forwarded-for'),
      userAgent: request.headers.get('user-agent'),
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting promotion:', error)
    return NextResponse.json({ error: 'Failed to delete promotion' }, { status: 500 })
  }
}
