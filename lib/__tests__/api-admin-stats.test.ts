import { describe, it, expect, vi, beforeEach } from 'vitest'

const mockSession = vi.hoisted(() => ({ user: { id: 'admin1', role: 'ADMIN', name: 'Admin' } }))
const mockRequireAdmin = vi.hoisted(() => vi.fn())

vi.mock('@/lib/admin/require-admin', () => ({
  requireAdmin: mockRequireAdmin,
}))

vi.mock('@/lib/prisma', () => ({
  prisma: {
    order: {
      count: vi.fn(),
      aggregate: vi.fn(),
      findMany: vi.fn(),
    },
    user: { count: vi.fn() },
    product: { count: vi.fn() },
    review: { count: vi.fn() },
    promotion: {
      count: vi.fn(),
      aggregate: vi.fn(),
    },
    newsletterSubscriber: { count: vi.fn() },
    auditLog: { findMany: vi.fn() },
  },
}))

vi.mock('@/lib/admin/audit', () => ({
  auditLog: vi.fn().mockResolvedValue(undefined),
}))

vi.mock('@/lib/rate-limit', () => ({
  rateLimit: vi.fn().mockResolvedValue({ success: true }),
  getIP: vi.fn().mockReturnValue('127.0.0.1'),
  createRateLimitKey: vi.fn().mockReturnValue('test:key'),
}))

vi.mock('@/lib/logger', () => ({
  logError: vi.fn(),
}))

import { GET } from '@/app/api/admin/stats/route'
import { prisma } from '@/lib/prisma'
import { NextRequest } from 'next/server'

function makeGetRequest() {
  return new NextRequest(new Request('https://example.com/api/admin/stats', { method: 'GET' }))
}

describe('GET /api/admin/stats', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockRequireAdmin.mockResolvedValue({ ok: true, status: 200, session: mockSession })
    ;(prisma.order.count as ReturnType<typeof vi.fn>)
      .mockResolvedValueOnce(42) // totalOrders
      .mockResolvedValueOnce(5) // recentOrders
    ;(prisma.order.aggregate as ReturnType<typeof vi.fn>).mockResolvedValue({
      _sum: { total: 12500 },
    })
    ;(prisma.order.findMany as ReturnType<typeof vi.fn>).mockResolvedValue([
      {
        id: 'ord1',
        orderNumber: 'ORD-001',
        customerName: 'Max',
        status: 'DELIVERED',
        total: 299,
        createdAt: new Date(),
      },
      {
        id: 'ord2',
        orderNumber: 'ORD-002',
        customerName: 'Anna',
        status: 'PENDING',
        total: 149,
        createdAt: new Date(),
      },
    ])
    ;(prisma.user.count as ReturnType<typeof vi.fn>)
      .mockResolvedValueOnce(120) // totalCustomers
      .mockResolvedValueOnce(8) // newCustomers
    ;(prisma.product.count as ReturnType<typeof vi.fn>).mockResolvedValue(55)
    ;(prisma.review.count as ReturnType<typeof vi.fn>).mockResolvedValue(3)
    ;(prisma.promotion.count as ReturnType<typeof vi.fn>)
      .mockResolvedValueOnce(2) // activePromotions
      .mockResolvedValueOnce(10) // totalPromotions
    ;(prisma.promotion.aggregate as ReturnType<typeof vi.fn>).mockResolvedValue({
      _sum: { usageCount: 45 },
    })
    ;(prisma.newsletterSubscriber.count as ReturnType<typeof vi.fn>).mockResolvedValue(200)
    ;(prisma.auditLog.findMany as ReturnType<typeof vi.fn>).mockResolvedValue([])
  })

  it('returns stats with correct structure (200)', async () => {
    const req = makeGetRequest()
    const res = await GET(req)
    const data = await res.json()

    expect(res.status).toBe(200)
    expect(data).toHaveProperty('orders')
    expect(data).toHaveProperty('customers')
    expect(data).toHaveProperty('products')
    expect(data).toHaveProperty('reviews')
    expect(data).toHaveProperty('promotions')
    expect(data).toHaveProperty('newsletter')
    expect(data).toHaveProperty('recentOrdersList')
  })

  it('includes id field in recentOrdersList', async () => {
    const req = makeGetRequest()
    const res = await GET(req)
    const data = await res.json()

    expect(data.recentOrdersList).toHaveLength(2)
    expect(data.recentOrdersList[0]).toHaveProperty('id')
    expect(data.recentOrdersList[0].id).toBe('ord1')
    expect(data.recentOrdersList[0].orderNumber).toBe('ORD-001')
  })

  it('rejects unauthenticated users (401)', async () => {
    mockRequireAdmin.mockResolvedValue({ ok: false, status: 401, session: null })
    const req = makeGetRequest()
    const res = await GET(req)

    expect(res.status).toBe(401)
  })
})
