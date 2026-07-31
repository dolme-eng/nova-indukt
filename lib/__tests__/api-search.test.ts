import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('@/lib/prisma', () => ({
  prisma: {
    product: {
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

import { GET } from '@/app/api/products/search/route'
import { prisma } from '@/lib/prisma'
import { NextRequest } from 'next/server'

function makeRequest(url: string) {
  return new NextRequest(new Request(url))
}

describe('GET /api/products/search', () => {
  const mockResults = [
    {
      id: '1',
      nameDe: 'Bratpfanne 28cm',
      slug: 'bratpfanne-28',
      price: 8999,
      images: [{ url: 'https://img.test/1.jpg' }],
    },
  ]

  beforeEach(() => {
    vi.clearAllMocks()
    ;(prisma.product.findMany as ReturnType<typeof vi.fn>).mockResolvedValue(mockResults)
  })

  it('returns formatted search results for valid query', async () => {
    const req = makeRequest('https://example.com/api/products/search?q=bratpfanne')
    const res = await GET(req)
    const data = await res.json()

    expect(res.status).toBe(200)
    expect(data).toHaveLength(1)
    expect(data[0].name.de).toBe('Bratpfanne 28cm')
    expect(data[0].price).toBe(8999)
    expect(data[0].slug).toBe('bratpfanne-28')
  })

  it('returns empty array for queries <2 chars', async () => {
    const req = makeRequest('https://example.com/api/products/search?q=a')
    const res = await GET(req)
    const data = await res.json()

    expect(res.status).toBe(200)
    expect(data).toHaveLength(0)
  })

  it('returns empty array for empty query', async () => {
    const req = makeRequest('https://example.com/api/products/search?q=')
    const res = await GET(req)
    const data = await res.json()

    expect(res.status).toBe(200)
    expect(data).toHaveLength(0)
  })

  it('truncates long queries to 200 chars', async () => {
    const longQuery = 'a'.repeat(300)
    const req = makeRequest(`https://example.com/api/products/search?q=${longQuery}`)
    await GET(req)

    expect(prisma.product.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          OR: expect.arrayContaining([
            expect.objectContaining({
              nameDe: expect.objectContaining({
                contains: 'a'.repeat(200),
              }),
            }),
          ]),
        }),
      })
    )
  })

  it('limits results to 5', async () => {
    const req = makeRequest('https://example.com/api/products/search?q=test')
    await GET(req)

    expect(prisma.product.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        take: 5,
      })
    )
  })

  it('returns 500 on database error', async () => {
    ;(prisma.product.findMany as ReturnType<typeof vi.fn>).mockRejectedValue(new Error('DB error'))
    const req = makeRequest('https://example.com/api/products/search?q=test')
    const res = await GET(req)

    expect(res.status).toBe(500)
  })
})
