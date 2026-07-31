import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('@/lib/prisma', () => ({
  prisma: {
    newsletterSubscriber: {
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
    },
  },
}))

vi.mock('@/lib/rate-limit', () => ({
  rateLimit: vi.fn().mockResolvedValue({ success: true }),
  getIP: vi.fn().mockReturnValue('127.0.0.1'),
  createRateLimitKey: vi.fn().mockReturnValue('test:key'),
}))

vi.mock('@/lib/logger', () => ({
  logError: vi.fn(),
  logInfo: vi.fn(),
}))

vi.mock('@/lib/email/send', () => ({
  sendNewsletterConfirmationEmail: vi.fn().mockResolvedValue(undefined),
}))

import { POST } from '@/app/api/newsletter/subscribe/route'
import { prisma } from '@/lib/prisma'
import { NextRequest } from 'next/server'

function makePostRequest(body: unknown) {
  return new NextRequest(
    new Request('https://example.com/api/newsletter/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
  )
}

describe('POST /api/newsletter/subscribe', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    ;(prisma.newsletterSubscriber.findUnique as ReturnType<typeof vi.fn>).mockResolvedValue(null)
    ;(prisma.newsletterSubscriber.create as ReturnType<typeof vi.fn>).mockResolvedValue({
      id: 'sub1',
      email: 'test@example.de',
    })
    ;(prisma.newsletterSubscriber.update as ReturnType<typeof vi.fn>).mockResolvedValue({
      id: 'sub1',
      email: 'test@example.de',
    })
  })

  it('subscribes a new email (201)', async () => {
    const req = makePostRequest({ email: 'test@example.de' })
    const res = await POST(req)
    const data = await res.json()

    expect(res.status).toBe(201)
    expect(data.success).toBe(true)
    expect(prisma.newsletterSubscriber.create).toHaveBeenCalled()
  })

  it('rejects invalid email', async () => {
    const req = makePostRequest({ email: 'not-valid' })
    const res = await POST(req)

    expect(res.status).toBe(400)
  })

  it('rejects empty email', async () => {
    const req = makePostRequest({ email: '' })
    const res = await POST(req)

    expect(res.status).toBe(400)
  })

  it('returns 409 for already active subscriber', async () => {
    ;(prisma.newsletterSubscriber.findUnique as ReturnType<typeof vi.fn>).mockResolvedValue({
      id: 'existing',
      email: 'test@example.de',
      isActive: true,
    })
    const req = makePostRequest({ email: 'test@example.de' })
    const res = await POST(req)

    expect(res.status).toBe(409)
  })

  it('reactivates inactive subscriber (200)', async () => {
    ;(prisma.newsletterSubscriber.findUnique as ReturnType<typeof vi.fn>).mockResolvedValue({
      id: 'inactive',
      email: 'test@example.de',
      isActive: false,
      firstName: null,
      source: 'homepage',
    })
    const req = makePostRequest({ email: 'test@example.de' })
    const res = await POST(req)
    const data = await res.json()

    expect(res.status).toBe(200)
    expect(data.success).toBe(true)
    expect(prisma.newsletterSubscriber.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { email: 'test@example.de' },
        data: expect.objectContaining({ isActive: true }),
      })
    )
  })

  it('returns 500 on database error', async () => {
    ;(prisma.newsletterSubscriber.findUnique as ReturnType<typeof vi.fn>).mockRejectedValue(
      new Error('DB error')
    )
    const req = makePostRequest({ email: 'test@example.de' })
    const res = await POST(req)

    expect(res.status).toBe(500)
  })
})
