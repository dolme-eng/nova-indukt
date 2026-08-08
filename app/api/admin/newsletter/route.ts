import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/admin/require-admin'
import { auditLog } from '@/lib/admin/audit'
import { logError } from '@/lib/logger'
import { rateLimit, getIP, createRateLimitKey } from '@/lib/rate-limit'
import { validateCsrfToken } from '@/lib/csrf'

export async function DELETE(req: NextRequest) {
  try {
    const authz = await requireAdmin()
    if (!authz.ok) return NextResponse.json({ error: 'Nicht autorisiert' }, { status: authz.status })

    const csrfError = validateCsrfToken(req)
    if (csrfError) return csrfError

    const rl = await rateLimit(createRateLimitKey(getIP(req), 'admin:newsletter:delete'), { windowMs: 60_000, maxRequests: 15 })
    if (!rl.success) return NextResponse.json({ error: 'Zu viele Anfragen' }, { status: 429 })

    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')
    if (!id) {
      return NextResponse.json({ error: 'Abonnent-ID erforderlich' }, { status: 400 })
    }

    const subscriber = await prisma.newsletterSubscriber.findUnique({ where: { id } })
    if (!subscriber) {
      return NextResponse.json({ error: 'Nicht gefunden' }, { status: 404 })
    }

    await prisma.newsletterSubscriber.delete({ where: { id } })

    await auditLog({
      action: 'DELETE',
      entityType: 'NewsletterSubscriber',
      entityId: id,
      userId: authz.session.user.id,
      oldValues: { email: subscriber.email },
      ipAddress: req.headers.get('x-forwarded-for'),
      userAgent: req.headers.get('user-agent'),
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    logError('[NEWSLETTER_DELETE]', error)
    return NextResponse.json({ error: 'Interner Fehler' }, { status: 500 })
  }
}
