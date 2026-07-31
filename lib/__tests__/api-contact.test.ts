import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('@/lib/prisma', () => ({
  prisma: {
    contactMessage: {
      create: vi.fn(),
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
  sendContactNotificationEmail: vi.fn().mockResolvedValue(undefined),
}))

import { POST } from '@/app/api/contact/route'
import { prisma } from '@/lib/prisma'
import { NextRequest } from 'next/server'

function makePostRequest(body: unknown) {
  return new NextRequest(
    new Request('https://example.com/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
  )
}

describe('POST /api/contact', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    ;(prisma.contactMessage.create as ReturnType<typeof vi.fn>).mockResolvedValue({
      id: 'msg1',
      createdAt: new Date(),
    })
  })

  const validContact = {
    name: 'Max Mustermann',
    email: 'max@example.de',
    subject: 'Frage zum Produkt',
    message: 'Ich habe eine Frage zu Ihrer Bratpfanne.',
  }

  it('creates a contact message with valid data (201)', async () => {
    const req = makePostRequest(validContact)
    const res = await POST(req)
    const data = await res.json()

    expect(res.status).toBe(201)
    expect(data.success).toBe(true)
    expect(prisma.contactMessage.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          name: 'Max Mustermann',
          email: 'max@example.de',
          subject: 'Frage zum Produkt',
          status: 'NEW',
        }),
      })
    )
  })

  it('rejects missing name', async () => {
    const req = makePostRequest({ ...validContact, name: '' })
    const res = await POST(req)

    expect(res.status).toBe(400)
  })

  it('rejects invalid email', async () => {
    const req = makePostRequest({ ...validContact, email: 'not-an-email' })
    const res = await POST(req)

    expect(res.status).toBe(400)
  })

  it('rejects short message (<10 chars)', async () => {
    const req = makePostRequest({ ...validContact, message: 'kurz' })
    const res = await POST(req)

    expect(res.status).toBe(400)
  })

  it('rejects empty body', async () => {
    const req = makePostRequest({})
    const res = await POST(req)

    expect(res.status).toBe(400)
  })

  it('sets status to NEW', async () => {
    const req = makePostRequest(validContact)
    await POST(req)

    expect(prisma.contactMessage.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          status: 'NEW',
        }),
      })
    )
  })

  it('returns 500 on database error', async () => {
    ;(prisma.contactMessage.create as ReturnType<typeof vi.fn>).mockRejectedValue(
      new Error('DB error')
    )
    const req = makePostRequest(validContact)
    const res = await POST(req)

    expect(res.status).toBe(500)
  })
})
