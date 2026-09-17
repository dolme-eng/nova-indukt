import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createUnsubscribeToken } from '@/lib/unsubscribe-token'

vi.mock('@/lib/prisma', () => ({
  prisma: {
    newsletterSubscriber: {
      findUnique: vi.fn(),
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
}))

vi.mock('@/lib/auth', () => ({
  auth: vi.fn().mockResolvedValue(null),
}))

vi.mock('@/lib/csrf', () => ({
  validateCsrfToken: vi.fn().mockReturnValue(null),
}))

import { POST, GET } from '@/app/api/newsletter/unsubscribe/route'
import { prisma } from '@/lib/prisma'
import { NextRequest } from 'next/server'

function makePostRequest(body: unknown) {
  return new NextRequest(
    new Request('https://example.com/api/newsletter/unsubscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
  )
}

function makeGetRequest(email?: string) {
  const url = email
    ? `https://example.com/api/newsletter/unsubscribe?${createUnsubscribeToken(email)}`
    : 'https://example.com/api/newsletter/unsubscribe'
  return new NextRequest(new Request(url, { method: 'GET' }))
}

describe('POST /api/newsletter/unsubscribe', () => {
  beforeEach(async () => {
    vi.clearAllMocks()
    const { auth } = await import('@/lib/auth')
    ;(auth as ReturnType<typeof vi.fn>).mockResolvedValue(null)
    ;(prisma.newsletterSubscriber.findUnique as ReturnType<typeof vi.fn>).mockResolvedValue({
      id: 'sub1',
      email: 'test@example.de',
      isActive: true,
    })
    ;(prisma.newsletterSubscriber.update as ReturnType<typeof vi.fn>).mockResolvedValue({})
  })

  function signedBody(email: string) {
    const params = new URLSearchParams(createUnsubscribeToken(email))
    return {
      email,
      expires: params.get('expires')!,
      sig: params.get('sig')!,
    }
  }

  it('returns 403 without session and without token', async () => {
    const req = makePostRequest({ email: 'test@example.de' })
    const res = await POST(req)

    expect(res.status).toBe(403)
  })

  it('unsubscribes with a valid signed token and returns JSON (200)', async () => {
    const req = makePostRequest(signedBody('test@example.de'))
    const res = await POST(req)

    expect(res.status).toBe(200)
    expect(res.headers.get('Content-Type')).toContain('application/json')
    const data = await res.json()
    expect(data.success).toBe(true)
    expect(prisma.newsletterSubscriber.update).toHaveBeenCalledWith({
      where: { email: 'test@example.de' },
      data: expect.objectContaining({
        isActive: false,
        unsubscribedAt: expect.any(Date),
      }),
    })
  })

  it('unsubscribes session owner without token', async () => {
    const { auth } = await import('@/lib/auth')
    ;(auth as ReturnType<typeof vi.fn>).mockResolvedValue({
      user: { id: 'user1', email: 'test@example.de', role: 'USER' },
    })
    const req = makePostRequest({ email: 'test@example.de' })
    const res = await POST(req)

    expect(res.status).toBe(200)
    expect(prisma.newsletterSubscriber.update).toHaveBeenCalled()
  })

  it('returns JSON even for already inactive subscriber', async () => {
    ;(prisma.newsletterSubscriber.findUnique as ReturnType<typeof vi.fn>).mockResolvedValue({
      id: 'sub1',
      email: 'test@example.de',
      isActive: false,
    })
    const req = makePostRequest(signedBody('test@example.de'))
    const res = await POST(req)

    expect(res.status).toBe(200)
    const data = await res.json()
    expect(data.success).toBe(true)
    expect(prisma.newsletterSubscriber.update).not.toHaveBeenCalled()
  })

  it('returns JSON even for unknown email (no enumeration)', async () => {
    ;(prisma.newsletterSubscriber.findUnique as ReturnType<typeof vi.fn>).mockResolvedValue(null)
    const req = makePostRequest(signedBody('unknown@example.de'))
    const res = await POST(req)

    expect(res.status).toBe(200)
    const data = await res.json()
    expect(data.success).toBe(true)
  })

  it('rejects invalid email (400)', async () => {
    const req = makePostRequest({ email: 'not-valid' })
    const res = await POST(req)

    expect(res.status).toBe(400)
  })

  it('returns 500 on database error', async () => {
    ;(prisma.newsletterSubscriber.findUnique as ReturnType<typeof vi.fn>).mockRejectedValue(
      new Error('DB error')
    )
    const req = makePostRequest(signedBody('test@example.de'))
    const res = await POST(req)

    expect(res.status).toBe(500)
  })
})

describe('GET /api/newsletter/unsubscribe', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    ;(prisma.newsletterSubscriber.findUnique as ReturnType<typeof vi.fn>).mockResolvedValue({
      id: 'sub1',
      email: 'test@example.de',
      isActive: true,
    })
    ;(prisma.newsletterSubscriber.update as ReturnType<typeof vi.fn>).mockResolvedValue({})
  })

  it('returns HTML confirmation page (200)', async () => {
    const req = makeGetRequest('test@example.de')
    const res = await GET(req)

    expect(res.status).toBe(200)
    expect(res.headers.get('Content-Type')).toContain('text/html')
    const html = await res.text()
    expect(html).toContain('Erfolgreich abgemeldet')
  })

  it('unsubscribes active subscriber via GET', async () => {
    const req = makeGetRequest('test@example.de')
    await GET(req)

    expect(prisma.newsletterSubscriber.update).toHaveBeenCalledWith({
      where: { email: 'test@example.de' },
      data: expect.objectContaining({ isActive: false }),
    })
  })

  it('returns HTML when no email param (graceful)', async () => {
    const req = makeGetRequest()
    const res = await GET(req)

    expect(res.status).toBe(200)
    expect(res.headers.get('Content-Type')).toContain('text/html')
  })

  it('returns HTML for invalid email format (graceful)', async () => {
    const req = makeGetRequest('not-valid')
    const res = await GET(req)

    expect(res.status).toBe(200)
    expect(res.headers.get('Content-Type')).toContain('text/html')
  })

  it('returns HTML for unknown email (no enumeration)', async () => {
    ;(prisma.newsletterSubscriber.findUnique as ReturnType<typeof vi.fn>).mockResolvedValue(null)
    const req = makeGetRequest('unknown@example.de')
    const res = await GET(req)

    expect(res.status).toBe(200)
    expect(res.headers.get('Content-Type')).toContain('text/html')
  })

  it('returns HTML even on rate limit', async () => {
    const { rateLimit } = await import('@/lib/rate-limit')
    ;(rateLimit as ReturnType<typeof vi.fn>).mockResolvedValue({ success: false })
    const req = makeGetRequest('test@example.de')
    const res = await GET(req)

    expect(res.status).toBe(200)
    expect(res.headers.get('Content-Type')).toContain('text/html')
  })
})
