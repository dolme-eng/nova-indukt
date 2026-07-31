import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('@/lib/prisma', () => ({
  prisma: {
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
}))

import { GET } from '@/app/api/categories/route'
import { prisma } from '@/lib/prisma'
import { NextRequest } from 'next/server'

function makeRequest(url: string) {
  return new NextRequest(new Request(url))
}

describe('GET /api/categories', () => {
  const mockCategories = [
    {
      id: 'c1',
      slug: 'bratpfannen',
      nameDe: 'Bratpfannen',
      description: ' desc',
      image: 'img.jpg',
      _count: { products: 12 },
    },
    {
      id: 'c2',
      slug: 'kochtöpfe',
      nameDe: 'Kochtöpfe',
      description: ' desc',
      image: null,
      _count: { products: 8 },
    },
    {
      id: 'c3',
      slug: 'leer',
      nameDe: 'Leer',
      description: null,
      image: null,
      _count: { products: 0 },
    },
  ]

  beforeEach(() => {
    vi.clearAllMocks()
    ;(prisma.category.findMany as ReturnType<typeof vi.fn>).mockResolvedValue(mockCategories)
  })

  it('returns categories with product counts, filtering out empty ones', async () => {
    const req = makeRequest('https://example.com/api/categories')
    const res = await GET(req)
    const data = await res.json()

    expect(res.status).toBe(200)
    expect(data).toHaveLength(2)
    expect(data[0].name.de).toBe('Bratpfannen')
    expect(data[0].productCount).toBe(12)
  })

  it('only queries active categories', async () => {
    const req = makeRequest('https://example.com/api/categories')
    await GET(req)

    expect(prisma.category.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { isActive: true },
      })
    )
  })

  it('uses select with _count', async () => {
    const req = makeRequest('https://example.com/api/categories')
    await GET(req)

    expect(prisma.category.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        select: expect.objectContaining({
          _count: { select: { products: true } },
        }),
      })
    )
  })

  it('sets cache-control header', async () => {
    const req = makeRequest('https://example.com/api/categories')
    const res = await GET(req)

    expect(res.headers.get('Cache-Control')).toContain('s-maxage')
  })

  it('returns 500 on database error', async () => {
    ;(prisma.category.findMany as ReturnType<typeof vi.fn>).mockRejectedValue(new Error('DB error'))
    const req = makeRequest('https://example.com/api/categories')
    const res = await GET(req)

    expect(res.status).toBe(500)
  })
})
