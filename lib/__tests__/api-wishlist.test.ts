import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('@/lib/prisma', () => ({
  prisma: {
    wishlistItem: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      create: vi.fn(),
      deleteMany: vi.fn(),
    },
    product: {
      findUnique: vi.fn(),
    },
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
}))

vi.mock('@/lib/csrf', () => ({
  validateCsrfToken: vi.fn().mockReturnValue(null),
}))

import { GET, POST, DELETE } from '@/app/api/wishlist/route'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { validateCsrfToken } from '@/lib/csrf'
import { rateLimit } from '@/lib/rate-limit'
import { NextRequest } from 'next/server'

const mockUser = { id: 'user1' }

const mockWishlistItem = {
  id: 'wish1',
  userId: 'user1',
  productId: 'prod1',
  createdAt: new Date('2025-01-15'),
  product: {
    id: 'prod1',
    nameDe: 'Induktionskochfeld',
    price: 599.99,
    oldPrice: null,
    slug: 'induktionskochfeld',
    images: [{ url: 'https://example.com/main.jpg', isMain: true }],
    category: { nameDe: 'Kochfelder' },
  },
}

function makePostRequest(body: unknown) {
  return new NextRequest(
    new Request('https://example.com/api/wishlist', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
  )
}

function makeDeleteRequest(url: string = 'https://example.com/api/wishlist') {
  return new NextRequest(
    new Request(url, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
    })
  )
}

describe('GET /api/wishlist', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    ;(auth as ReturnType<typeof vi.fn>).mockResolvedValue({ user: mockUser })
    ;(prisma.wishlistItem.findMany as ReturnType<typeof vi.fn>).mockResolvedValue([mockWishlistItem])
  })

  it('returns 401 for unauthenticated user', async () => {
    ;(auth as ReturnType<typeof vi.fn>).mockResolvedValue(null)
    const res = await GET()

    expect(res.status).toBe(401)
    const data = await res.json()
    expect(data.error).toBe('Unauthorized')
  })

  it('returns 200 with mapped wishlist items', async () => {
    const res = await GET()
    const data = await res.json()

    expect(res.status).toBe(200)
    expect(data).toHaveLength(1)
    expect(data[0]).toEqual({
      id: 'prod1',
      wishlistItemId: 'wish1',
      name: { de: 'Induktionskochfeld', en: 'Induktionskochfeld' },
      price: 599.99,
      oldPrice: null,
      image: 'https://example.com/main.jpg',
      slug: 'induktionskochfeld',
      category: 'Kochfelder',
      addedAt: expect.stringContaining('2025-01-15'),
    })
    expect(prisma.wishlistItem.findMany).toHaveBeenCalledWith({
      where: { userId: 'user1' },
      include: {
        product: {
          include: { images: true, category: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    })
  })

  it('returns 200 with empty array for empty wishlist', async () => {
    ;(prisma.wishlistItem.findMany as ReturnType<typeof vi.fn>).mockResolvedValue([])
    const res = await GET()
    const data = await res.json()

    expect(res.status).toBe(200)
    expect(data).toEqual([])
  })

  it('returns 500 on database error', async () => {
    ;(prisma.wishlistItem.findMany as ReturnType<typeof vi.fn>).mockRejectedValue(new Error('DB error'))
    const res = await GET()

    expect(res.status).toBe(500)
    const data = await res.json()
    expect(data.error).toBe('Synchronisation fehlgeschlagen')
  })
})

describe('POST /api/wishlist', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    ;(rateLimit as ReturnType<typeof vi.fn>).mockResolvedValue({ success: true })
    ;(validateCsrfToken as ReturnType<typeof vi.fn>).mockReturnValue(null)
    ;(auth as ReturnType<typeof vi.fn>).mockResolvedValue({ user: mockUser })
    ;(prisma.product.findUnique as ReturnType<typeof vi.fn>).mockResolvedValue({ id: 'prod1' })
    ;(prisma.wishlistItem.findUnique as ReturnType<typeof vi.fn>).mockResolvedValue(null)
    ;(prisma.wishlistItem.create as ReturnType<typeof vi.fn>).mockResolvedValue({
      id: 'wish1',
      product: {
        id: 'prod1',
        nameDe: 'Induktionskochfeld',
        price: 599.99,
        slug: 'induktionskochfeld',
        images: [{ url: 'https://example.com/main.jpg', isMain: true }],
      },
    })
  })

  it('returns 401 for unauthenticated user', async () => {
    ;(auth as ReturnType<typeof vi.fn>).mockResolvedValue(null)
    const req = makePostRequest({ productId: 'prod1' })
    const res = await POST(req)

    expect(res.status).toBe(401)
    const data = await res.json()
    expect(data.error).toBe('Unauthorized')
  })

  it('returns 429 when rate limited', async () => {
    ;(rateLimit as ReturnType<typeof vi.fn>).mockResolvedValue({ success: false })
    const req = makePostRequest({ productId: 'prod1' })
    const res = await POST(req)

    expect(res.status).toBe(429)
    const data = await res.json()
    expect(data.error).toBe('Zu viele Anfragen')
  })

  it('returns 403 on CSRF failure', async () => {
    const csrfResponse = new Response(null, { status: 403 })
    ;(validateCsrfToken as ReturnType<typeof vi.fn>).mockReturnValue(csrfResponse)
    const req = makePostRequest({ productId: 'prod1' })
    const res = await POST(req)

    expect(res.status).toBe(403)
  })

  it('returns 400 for empty body', async () => {
    const req = makePostRequest({})
    const res = await POST(req)

    expect(res.status).toBe(400)
    const data = await res.json()
    expect(data.error).toBe('Validierung fehlgeschlagen')
  })

  it('returns 404 when product not found', async () => {
    ;(prisma.product.findUnique as ReturnType<typeof vi.fn>).mockResolvedValue(null)
    const req = makePostRequest({ productId: 'nonexistent' })
    const res = await POST(req)

    expect(res.status).toBe(404)
    const data = await res.json()
    expect(data.error).toBe('Produkt nicht gefunden')
  })

  it('returns 409 when product already in wishlist', async () => {
    ;(prisma.wishlistItem.findUnique as ReturnType<typeof vi.fn>).mockResolvedValue({
      id: 'existing',
      userId: 'user1',
      productId: 'prod1',
    })
    const req = makePostRequest({ productId: 'prod1' })
    const res = await POST(req)

    expect(res.status).toBe(409)
    const data = await res.json()
    expect(data.error).toBe('Produkt bereits auf der Wunschliste')
  })

  it('returns 201 on successful add', async () => {
    const req = makePostRequest({ productId: 'prod1' })
    const res = await POST(req)
    const data = await res.json()

    expect(res.status).toBe(201)
    expect(data.success).toBe(true)
    expect(data.product).toEqual({
      id: 'prod1',
      name: 'Induktionskochfeld',
      price: 599.99,
      image: 'https://example.com/main.jpg',
      slug: 'induktionskochfeld',
    })
    expect(prisma.wishlistItem.create).toHaveBeenCalledWith({
      data: { userId: 'user1', productId: 'prod1' },
      include: { product: { include: { images: true } } },
    })
  })

  it('returns 500 on database error', async () => {
    ;(prisma.wishlistItem.create as ReturnType<typeof vi.fn>).mockRejectedValue(new Error('DB error'))
    const req = makePostRequest({ productId: 'prod1' })
    const res = await POST(req)

    expect(res.status).toBe(500)
    const data = await res.json()
    expect(data.error).toBe('Hinzufügen fehlgeschlagen')
  })
})

describe('DELETE /api/wishlist', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    ;(rateLimit as ReturnType<typeof vi.fn>).mockResolvedValue({ success: true })
    ;(validateCsrfToken as ReturnType<typeof vi.fn>).mockReturnValue(null)
    ;(auth as ReturnType<typeof vi.fn>).mockResolvedValue({ user: mockUser })
    ;(prisma.wishlistItem.deleteMany as ReturnType<typeof vi.fn>).mockResolvedValue({ count: 1 })
  })

  it('returns 401 for unauthenticated user', async () => {
    ;(auth as ReturnType<typeof vi.fn>).mockResolvedValue(null)
    const req = makeDeleteRequest()
    const res = await DELETE(req)

    expect(res.status).toBe(401)
    const data = await res.json()
    expect(data.error).toBe('Unauthorized')
  })

  it('returns 429 when rate limited', async () => {
    ;(rateLimit as ReturnType<typeof vi.fn>).mockResolvedValue({ success: false })
    const req = makeDeleteRequest()
    const res = await DELETE(req)

    expect(res.status).toBe(429)
    const data = await res.json()
    expect(data.error).toBe('Zu viele Anfragen')
  })

  it('returns 403 on CSRF failure', async () => {
    const csrfResponse = new Response(null, { status: 403 })
    ;(validateCsrfToken as ReturnType<typeof vi.fn>).mockReturnValue(csrfResponse)
    const req = makeDeleteRequest()
    const res = await DELETE(req)

    expect(res.status).toBe(403)
  })

  it('deletes a specific item when productId is provided', async () => {
    const req = makeDeleteRequest('https://example.com/api/wishlist?productId=prod1')
    const res = await DELETE(req)
    const data = await res.json()

    expect(res.status).toBe(200)
    expect(data.success).toBe(true)
    expect(data.message).toBe('Item removed from wishlist')
    expect(prisma.wishlistItem.deleteMany).toHaveBeenCalledWith({
      where: { userId: 'user1', productId: 'prod1' },
    })
  })

  it('clears entire wishlist when no productId is provided', async () => {
    const req = makeDeleteRequest()
    const res = await DELETE(req)
    const data = await res.json()

    expect(res.status).toBe(200)
    expect(data.success).toBe(true)
    expect(data.message).toBe('Wishlist cleared')
    expect(prisma.wishlistItem.deleteMany).toHaveBeenCalledWith({
      where: { userId: 'user1' },
    })
  })

  it('returns 500 on database error', async () => {
    ;(prisma.wishlistItem.deleteMany as ReturnType<typeof vi.fn>).mockRejectedValue(new Error('DB error'))
    const req = makeDeleteRequest()
    const res = await DELETE(req)

    expect(res.status).toBe(500)
    const data = await res.json()
    expect(data.error).toBe('Entfernen fehlgeschlagen')
  })
})
