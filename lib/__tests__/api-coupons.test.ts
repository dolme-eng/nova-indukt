import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('@/lib/prisma', () => ({
  prisma: {
    product: {
      findMany: vi.fn(),
    },
    promotion: {
      findFirst: vi.fn(),
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

vi.mock('@/lib/csrf', () => ({
  validateCsrfToken: vi.fn().mockReturnValue(null),
}))

vi.mock('@/lib/recaptcha', () => ({
  verifyRecaptcha: vi.fn().mockResolvedValue(null),
}))

// Real calculateDiscountedPrice, mocked auto-promotion map
vi.mock('@/lib/promotions', async (importOriginal) => {
  const mod = await importOriginal<typeof import('@/lib/promotions')>()
  return {
    ...mod,
    applyPromotionsToProducts: vi.fn().mockResolvedValue(new Map()),
  }
})

import { POST } from '@/app/api/coupons/validate/route'
import { prisma } from '@/lib/prisma'
import { NextRequest } from 'next/server'

function makePostRequest(body: unknown) {
  return new NextRequest(
    new Request('https://example.com/api/coupons/validate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
  )
}

const now = new Date()
const promoBase = {
  id: 'promo1',
  code: 'SAVE10',
  isCoupon: true,
  isActive: true,
  startDate: new Date(now.getTime() - 86400000),
  endDate: new Date(now.getTime() + 86400000),
  usageLimit: null,
  usageCount: 0,
  minOrderAmount: null,
  maxDiscount: null,
  productIds: [],
  categoryIds: [],
  discountType: 'PERCENTAGE',
  discountValue: 10,
}

describe('POST /api/coupons/validate', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    ;(prisma.promotion.findFirst as ReturnType<typeof vi.fn>).mockResolvedValue(promoBase)
    ;(prisma.product.findMany as ReturnType<typeof vi.fn>).mockResolvedValue([])
  })

  it('returns 404 for unknown code', async () => {
    ;(prisma.promotion.findFirst as ReturnType<typeof vi.fn>).mockResolvedValue(null)
    const res = await POST(makePostRequest({ code: 'NOPE', amount: 100 }))
    expect(res.status).toBe(404)
  })

  it('returns 400 for expired code', async () => {
    ;(prisma.promotion.findFirst as ReturnType<typeof vi.fn>).mockResolvedValue({
      ...promoBase,
      endDate: new Date(now.getTime() - 1000),
    })
    const res = await POST(makePostRequest({ code: 'SAVE10', amount: 100 }))
    expect(res.status).toBe(400)
  })

  it('returns 400 when usage limit is reached', async () => {
    ;(prisma.promotion.findFirst as ReturnType<typeof vi.fn>).mockResolvedValue({
      ...promoBase,
      usageLimit: 5,
      usageCount: 5,
    })
    const res = await POST(makePostRequest({ code: 'SAVE10', amount: 100 }))
    expect(res.status).toBe(400)
  })

  it('computes minOrderAmount on the SERVER base, not the client amount', async () => {
    ;(prisma.promotion.findFirst as ReturnType<typeof vi.fn>).mockResolvedValue({
      ...promoBase,
      minOrderAmount: 500,
    })
    // Client claims 600, DB says 1 × 100
    ;(prisma.product.findMany as ReturnType<typeof vi.fn>).mockResolvedValue([
      { id: 'c'.padEnd(25, '0'), price: 100, categoryId: 'k'.padEnd(25, '0') },
    ])
    const res = await POST(
      makePostRequest({
        code: 'SAVE10',
        amount: 600,
        items: [{ id: 'c'.padEnd(25, '0'), quantity: 1 }],
      })
    )
    expect(res.status).toBe(400)
  })

  it('computes percentage discount on the server base, rounded to cents', async () => {
    ;(prisma.product.findMany as ReturnType<typeof vi.fn>).mockResolvedValue([
      { id: 'c'.padEnd(25, '0'), price: 99.99, categoryId: 'k'.padEnd(25, '0') },
    ])
    const res = await POST(
      makePostRequest({
        code: 'SAVE10',
        amount: 1,
        items: [{ id: 'c'.padEnd(25, '0'), quantity: 3 }],
      })
    )
    expect(res.status).toBe(200)
    const data = await res.json()
    // 3 × 99.99 = 299.97 → 10 % = 29.997 → 30.00 (no 1ct drift)
    expect(data.discountAmount).toBe(30)
  })

  it('falls back to client amount when no usable items are sent', async () => {
    const res = await POST(makePostRequest({ code: 'SAVE10', amount: 200 }))
    expect(res.status).toBe(200)
    const data = await res.json()
    expect(data.discountAmount).toBe(20)
  })

  it('returns 400 on validation failure', async () => {
    const res = await POST(makePostRequest({ code: '', amount: -5 }))
    expect(res.status).toBe(400)
  })
})
