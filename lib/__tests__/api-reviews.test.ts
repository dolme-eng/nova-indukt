vi.mock('@/lib/prisma', () => ({
  prisma: {
    review: {
      findMany: vi.fn(),
      count: vi.fn(),
      groupBy: vi.fn(),
      findFirst: vi.fn(),
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
    },
    product: {
      findUnique: vi.fn(),
    },
    orderItem: {
      findFirst: vi.fn(),
    },
    reviewHelpfulVote: {
      findUnique: vi.fn(),
      create: vi.fn(),
    },
    $transaction: vi.fn(),
  },
}))

vi.mock('@/lib/auth', () => ({
  auth: vi.fn(),
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

vi.mock('@/lib/csrf', () => ({
  validateCsrfToken: vi.fn().mockReturnValue(null),
}))

vi.mock('@/lib/recaptcha', () => ({
  verifyRecaptcha: vi.fn().mockResolvedValue(null),
}))

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { GET, POST, PUT } from '@/app/api/reviews/route'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { rateLimit } from '@/lib/rate-limit'
import { validateCsrfToken } from '@/lib/csrf'
import { verifyRecaptcha } from '@/lib/recaptcha'
import { NextRequest, NextResponse } from 'next/server'

function makeGetRequest(url: string) {
  return new NextRequest(new Request(url, { method: 'GET' }))
}

function makePostRequest(body: unknown) {
  return new NextRequest(
    new Request('https://example.com/api/reviews', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
  )
}

function makePutRequest(url: string) {
  return new NextRequest(new Request(url, { method: 'PUT' }))
}

const mockReview = {
  id: 'rev1',
  rating: 4,
  title: 'Great product',
  content: 'Really enjoyed this product.',
  isVerified: true,
  isPublished: true,
  createdAt: '2025-01-15T00:00:00.000Z',
  user: { id: 'user1', name: 'Max M.' },
}

const mockReviewMapped = {
  id: 'rev1',
  rating: 4,
  title: 'Great product',
  content: 'Really enjoyed this product.',
  verified: true,
  status: 'approved',
  createdAt: '2025-01-15T00:00:00.000Z',
  user: { name: 'Max M.', displayName: 'M****' },
}

const mockRatingStats = [
  { rating: 4, _count: { rating: 2 } },
  { rating: 5, _count: { rating: 1 } },
]

const p = prisma as unknown as {
  review: {
    findMany: ReturnType<typeof vi.fn>
    count: ReturnType<typeof vi.fn>
    groupBy: ReturnType<typeof vi.fn>
    findFirst: ReturnType<typeof vi.fn>
    findUnique: ReturnType<typeof vi.fn>
    create: ReturnType<typeof vi.fn>
    update: ReturnType<typeof vi.fn>
  }
  product: { findUnique: ReturnType<typeof vi.fn> }
  orderItem: { findFirst: ReturnType<typeof vi.fn> }
  reviewHelpfulVote: { findUnique: ReturnType<typeof vi.fn>; create: ReturnType<typeof vi.fn> }
  $transaction: ReturnType<typeof vi.fn>
}

describe('GET /api/reviews', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    p.review.findMany.mockResolvedValue([mockReview])
    p.review.count.mockResolvedValue(1)
    p.review.groupBy.mockResolvedValue(mockRatingStats)
  })

  it('returns 400 when productId is missing', async () => {
    const res = await GET(makeGetRequest('https://example.com/api/reviews'))
    expect(res.status).toBe(400)
    const data = await res.json()
    expect(data.error).toBe('Produkt-ID erforderlich')
  })

  it('returns 200 with reviews and stats', async () => {
    const res = await GET(makeGetRequest('https://example.com/api/reviews?productId=p1'))
    const data = await res.json()

    expect(res.status).toBe(200)
    expect(data.reviews).toHaveLength(1)
    expect(data.reviews[0]).toEqual(mockReviewMapped)
    expect(data.pagination.total).toBe(1)
    expect(data.stats.average).toBe(4.3)
    expect(data.stats.count).toBe(3)
    expect(data.stats.distribution[4]).toBe(2)
    expect(data.stats.distribution[5]).toBe(1)
  })

  it('returns 200 with empty results', async () => {
    p.review.findMany.mockResolvedValue([])
    p.review.count.mockResolvedValue(0)
    p.review.groupBy.mockResolvedValue([])

    const res = await GET(makeGetRequest('https://example.com/api/reviews?productId=p1'))
    const data = await res.json()

    expect(res.status).toBe(200)
    expect(data.reviews).toHaveLength(0)
    expect(data.pagination.total).toBe(0)
    expect(data.stats.average).toBe(0)
    expect(data.stats.count).toBe(0)
  })

  it('returns 500 on database error', async () => {
    p.review.findMany.mockRejectedValue(new Error('DB error'))
    const res = await GET(makeGetRequest('https://example.com/api/reviews?productId=p1'))
    expect(res.status).toBe(500)
  })
})

describe('POST /api/reviews', () => {
  const validReview = {
    productId: 'p1',
    rating: 4,
    title: 'Great product',
    content: 'Really enjoyed this product very much.',
  }

  beforeEach(() => {
    vi.clearAllMocks()
    ;(auth as ReturnType<typeof vi.fn>).mockResolvedValue({ user: { id: 'user1' } })
    ;(validateCsrfToken as ReturnType<typeof vi.fn>).mockReturnValue(null)
    ;(verifyRecaptcha as ReturnType<typeof vi.fn>).mockResolvedValue(null)
    ;(rateLimit as ReturnType<typeof vi.fn>).mockResolvedValue({ success: true })
    p.product.findUnique.mockResolvedValue({ id: 'p1', name: 'Test Product' })
    p.review.findFirst.mockResolvedValue(null)
    p.orderItem.findFirst.mockResolvedValue({ id: 'oi1' })
    p.review.create.mockResolvedValue({
      id: 'rev2',
      rating: 4,
      title: 'Great product',
      content: 'Really enjoyed this product very much.',
      isVerified: true,
      isPublished: false,
      createdAt: new Date(),
      user: { id: 'user1', name: 'Max' },
    })
  })

  it('returns 403 on CSRF failure', async () => {
    ;(validateCsrfToken as ReturnType<typeof vi.fn>).mockReturnValue(
      NextResponse.json({ error: 'Invalid CSRF' }, { status: 403 })
    )
    const res = await POST(makePostRequest(validReview))
    expect(res.status).toBe(403)
  })

  it('returns 401 when not authenticated', async () => {
    ;(auth as ReturnType<typeof vi.fn>).mockResolvedValue(null)
    const res = await POST(makePostRequest(validReview))
    expect(res.status).toBe(401)
    const data = await res.json()
    expect(data.error).toBe('Unauthorized')
  })

  it('returns 429 when rate limited', async () => {
    ;(rateLimit as ReturnType<typeof vi.fn>).mockResolvedValue({ success: false })
    const res = await POST(makePostRequest(validReview))
    expect(res.status).toBe(429)
  })

  it('returns 400 on validation failure (missing rating)', async () => {
    const badReview = { ...validReview, rating: undefined }
    const res = await POST(makePostRequest(badReview))
    expect(res.status).toBe(400)
    const data = await res.json()
    expect(data.error).toBe('Validierung fehlgeschlagen')
  })

  it('returns 404 when product not found', async () => {
    p.product.findUnique.mockResolvedValue(null)
    const res = await POST(makePostRequest(validReview))
    expect(res.status).toBe(404)
  })

  it('returns 409 when user already reviewed the product', async () => {
    p.review.findFirst.mockResolvedValue({ id: 'existing-rev' })
    const res = await POST(makePostRequest(validReview))
    expect(res.status).toBe(409)
  })

  it('returns 201 with verified flag when user has purchased', async () => {
    const res = await POST(makePostRequest(validReview))
    const data = await res.json()

    expect(res.status).toBe(201)
    expect(data.success).toBe(true)
    expect(data.review.verified).toBe(true)
    expect(p.review.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ isVerified: true }),
      })
    )
  })

  it('sets isVerified to false when user has not purchased', async () => {
    p.orderItem.findFirst.mockResolvedValue(null)
    p.review.create.mockResolvedValue({
      id: 'rev3',
      rating: 4,
      title: 'Great product',
      content: 'Really enjoyed this product very much.',
      isVerified: false,
      isPublished: false,
      createdAt: new Date(),
      user: { id: 'user1', name: 'Max' },
    })

    const res = await POST(makePostRequest(validReview))
    const data = await res.json()

    expect(res.status).toBe(201)
    expect(data.review.verified).toBe(false)
  })

  it('returns 500 on database error', async () => {
    p.review.create.mockRejectedValue(new Error('DB error'))
    const res = await POST(makePostRequest(validReview))
    expect(res.status).toBe(500)
  })
})

describe('PUT /api/reviews', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    ;(auth as ReturnType<typeof vi.fn>).mockResolvedValue({ user: { id: 'user1' } })
    ;(rateLimit as ReturnType<typeof vi.fn>).mockResolvedValue({ success: true })
    ;(validateCsrfToken as ReturnType<typeof vi.fn>).mockReturnValue(null)
    p.review.findUnique.mockResolvedValue({ id: 'rev1', isPublished: true, helpful: 0 })
    p.reviewHelpfulVote.findUnique.mockResolvedValue(null)
    p.reviewHelpfulVote.create.mockResolvedValue({ userId: 'user1', reviewId: 'rev1' })
    p.review.update.mockResolvedValue({ id: 'rev1', helpful: 1 })
    p.$transaction.mockResolvedValue([
      { userId: 'user1', reviewId: 'rev1' },
      { id: 'rev1', helpful: 1 },
    ])
  })

  it('returns 401 when not authenticated', async () => {
    ;(auth as ReturnType<typeof vi.fn>).mockResolvedValue(null)
    const res = await PUT(makePutRequest('https://example.com/api/reviews?id=rev1&action=helpful'))
    expect(res.status).toBe(401)
  })

  it('returns 429 when rate limited', async () => {
    ;(rateLimit as ReturnType<typeof vi.fn>).mockResolvedValue({ success: false })
    const res = await PUT(makePutRequest('https://example.com/api/reviews?id=rev1&action=helpful'))
    expect(res.status).toBe(429)
  })

  it('returns 403 on CSRF failure', async () => {
    ;(validateCsrfToken as ReturnType<typeof vi.fn>).mockReturnValue(
      NextResponse.json({ error: 'Invalid CSRF' }, { status: 403 })
    )
    const res = await PUT(makePutRequest('https://example.com/api/reviews?id=rev1&action=helpful'))
    expect(res.status).toBe(403)
  })

  it('returns 400 when review id is missing', async () => {
    const res = await PUT(makePutRequest('https://example.com/api/reviews?action=helpful'))
    expect(res.status).toBe(400)
  })

  it('returns 400 when action is not helpful', async () => {
    const res = await PUT(makePutRequest('https://example.com/api/reviews?id=rev1&action=like'))
    expect(res.status).toBe(400)
  })

  it('returns 404 when review not found', async () => {
    p.review.findUnique.mockResolvedValue(null)
    const res = await PUT(makePutRequest('https://example.com/api/reviews?id=rev1&action=helpful'))
    expect(res.status).toBe(404)
  })

  it('returns 404 when review is unpublished', async () => {
    p.review.findUnique.mockResolvedValue({ id: 'rev1', isPublished: false, helpful: 0 })
    const res = await PUT(makePutRequest('https://example.com/api/reviews?id=rev1&action=helpful'))
    expect(res.status).toBe(404)
  })

  it('returns 409 when user already voted', async () => {
    p.reviewHelpfulVote.findUnique.mockResolvedValue({ userId: 'user1', reviewId: 'rev1' })
    const res = await PUT(makePutRequest('https://example.com/api/reviews?id=rev1&action=helpful'))
    expect(res.status).toBe(409)
  })

  it('returns 200 with helpful count on success', async () => {
    const res = await PUT(makePutRequest('https://example.com/api/reviews?id=rev1&action=helpful'))
    const data = await res.json()

    expect(res.status).toBe(200)
    expect(data.success).toBe(true)
    expect(data.helpful).toBe(1)
    expect(p.reviewHelpfulVote.create).toHaveBeenCalledWith({
      data: { userId: 'user1', reviewId: 'rev1' },
    })
    expect(p.review.update).toHaveBeenCalledWith({
      where: { id: 'rev1' },
      data: { helpful: { increment: 1 } },
    })
  })

  it('returns 500 on database error', async () => {
    p.$transaction.mockRejectedValue(new Error('DB error'))
    const res = await PUT(makePutRequest('https://example.com/api/reviews?id=rev1&action=helpful'))
    expect(res.status).toBe(500)
  })
})
