import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/admin/require-admin'
import { auditLog } from '@/lib/admin/audit'
import { logError } from '@/lib/logger'

export async function DELETE(req: NextRequest) {
  try {
    const authz = await requireAdmin()
    if (!authz.ok) return new NextResponse('Unauthorized', { status: authz.status })

    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')
    if (!id) {
      return NextResponse.json({ error: 'Subscriber ID required' }, { status: 400 })
    }

    const subscriber = await prisma.newsletterSubscriber.findUnique({ where: { id } })
    if (!subscriber) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    await prisma.newsletterSubscriber.delete({ where: { id } })

    await auditLog({
      action: 'DELETE',
      entityType: 'NewsletterSubscriber',
      entityId: id,
      userId: authz.session.user.id,
      newValues: { email: subscriber.email },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    logError('[NEWSLETTER_DELETE]', error)
    return new NextResponse('Internal error', { status: 500 })
  }
}
