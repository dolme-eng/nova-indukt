import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/admin/require-admin'
import { auditLog } from '@/lib/admin/audit'
import { logError } from '@/lib/logger'

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const authz = await requireAdmin()
    if (!authz.ok) return NextResponse.json({ error: 'Unauthorized' }, { status: authz.status })

    const { id } = await params
    const body = await request.json()
    const { status } = body

    if (!['NEW', 'IN_PROGRESS', 'RESOLVED', 'SPAM'].includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
    }

    const existing = await prisma.contactMessage.findUnique({ where: { id } })
    if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    const updated = await prisma.contactMessage.update({
      where: { id },
      data: { status },
    })

    auditLog({
      action: 'UPDATE',
      entityType: 'ContactMessage',
      entityId: id,
      userId: authz.session.user.id,
      oldValues: { status: existing.status },
      newValues: { status },
      ipAddress: request.headers.get('x-forwarded-for'),
    }).catch(() => {})

    return NextResponse.json({ data: updated })
  } catch (error) {
    logError('Error updating contact message:', error)
    return NextResponse.json({ error: 'Failed to update' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authz = await requireAdmin()
    if (!authz.ok) return NextResponse.json({ error: 'Unauthorized' }, { status: authz.status })

    const { id } = await params

    const existing = await prisma.contactMessage.findUnique({ where: { id } })
    if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    await prisma.contactMessage.delete({ where: { id } })

    auditLog({
      action: 'DELETE',
      entityType: 'ContactMessage',
      entityId: id,
      userId: authz.session.user.id,
      oldValues: { name: existing.name, email: existing.email, subject: existing.subject },
      ipAddress: request.headers.get('x-forwarded-for'),
    }).catch(() => {})

    return NextResponse.json({ success: true })
  } catch (error) {
    logError('Error deleting contact message:', error)
    return NextResponse.json({ error: 'Failed to delete' }, { status: 500 })
  }
}
