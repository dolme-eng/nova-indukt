import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('@/lib/prisma', () => ({
  prisma: {
    product: {
      findMany: vi.fn(),
      count: vi.fn(),
    },
    category: {
      findMany: vi.fn(),
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
  logWarn: vi.fn(),
}))

import { GET } from '@/app/api/products/route'
import { prisma } from '@/lib/prisma'
import { NextRequest } from 'next/server'

function makeRequest(url: string) {
  return new NextRequest(new Request(url))
}

describe('GET /api/products', () => {
  const mockProducts = [
    {
      id: '1',
      nameDe: 'Test Product',
      slug: 'test-product',
      price: 99.99,
      oldPrice: null,
      costPrice: null,
      isActive: true,
      category: { id: 'c1', nameDe: 'Kategorie' },
      images: [],
    },
  ]

  beforeEach(() => {
    vi.clearAllMocks()
    ;(prisma.product.findMany as ReturnType<typeof vi.fn>).mockResolvedValue(mockProducts)
    ;(prisma.product.count as ReturnType<typeof vi.fn>).mockResolvedValue(1)
  })

  it('returns paginated products', async () => {
    const req = makeRequest('https://example.com/api/products?page=1&limit=12')
    const res = await GET(req)
    const data = await res.json()

    expect(res.status).toBe(200)
    expect(data.products).toHaveLength(1)
    expect(data.pagination).toEqual({
      page: 1,
      limit: 12,
      total: 1,
      totalPages: 1,
    })
  })

  it('converts Decimal prices to numbers', async () => {
    const req = makeRequest('https://example.com/api/products')
    const res = await GET(req)
    const data = await res.json()

    expect(typeof data.products[0].price).toBe('number')
    expect(data.products[0].price).toBe(99.99)
  })

  it('filters by category slug', async () => {
    const req = makeRequest('https://example.com/api/products?category=pfannen')
    await GET(req)

    expect(prisma.product.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          category: { slug: 'pfannen' },
        }),
      })
    )
  })

  it('filters by search term', async () => {
    const req = makeRequest('https://example.com/api/products?search=bratpfanne')
    await GET(req)

    expect(prisma.product.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          OR: expect.arrayContaining([
            expect.objectContaining({
              nameDe: expect.objectContaining({ contains: 'bratpfanne' }),
            }),
          ]),
        }),
      })
    )
  })

  it('filters by price range', async () => {
    const req = makeRequest('https://example.com/api/products?minPrice=50&maxPrice=200')
    await GET(req)

    expect(prisma.product.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          price: { gte: 50, lte: 200 },
        }),
      })
    )
  })

  it('sorts by price ascending', async () => {
    const req = makeRequest('https://example.com/api/products?sortBy=price-asc')
    await GET(req)

    expect(prisma.product.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        orderBy: { price: 'asc' },
      })
    )
  })

  it('sorts by price descending', async () => {
    const req = makeRequest('https://example.com/api/products?sortBy=price-desc')
    await GET(req)

    expect(prisma.product.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        orderBy: { price: 'desc' },
      })
    )
  })

  it('defaults to newest sort', async () => {
    const req = makeRequest('https://example.com/api/products')
    await GET(req)

    expect(prisma.product.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        orderBy: { createdAt: 'desc' },
      })
    )
  })

  it('clamps page to minimum 1', async () => {
    const req = makeRequest('https://example.com/api/products?page=-5')
    await GET(req)

    expect(prisma.product.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        skip: 0,
      })
    )
  })

  it('clamps limit to max 36', async () => {
    const req = makeRequest('https://example.com/api/products?limit=100')
    await GET(req)

    expect(prisma.product.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        take: 36,
      })
    )
  })

  it('sets cache-control header', async () => {
    const req = makeRequest('https://example.com/api/products')
    const res = await GET(req)

    expect(res.headers.get('Cache-Control')).toContain('s-maxage')
  })

  it('returns 500 on database error', async () => {
    ;(prisma.product.findMany as ReturnType<typeof vi.fn>).mockRejectedValue(new Error('DB error'))
    const req = makeRequest('https://example.com/api/products')
    const res = await GET(req)

    expect(res.status).toBe(500)
  })
})
