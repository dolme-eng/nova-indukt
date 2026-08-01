import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('@/lib/prisma', () => ({
  prisma: {
    order: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      count: vi.fn(),
      update: vi.fn(),
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

vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}))

vi.mock('@/lib/email/send', () => ({
  sendOrderCancellationEmail: vi.fn().mockResolvedValue(undefined),
}))

import { GET, PATCH } from '@/app/api/orders/[id]/route'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { NextRequest } from 'next/server'

const mockUser = { id: 'user1', name: 'Max', email: 'max@test.de' }

const mockOrder = {
  id: 'order1',
  orderNumber: 'NOV-123456789ABC',
  userId: 'user1',
  customerEmail: 'max@test.de',
  customerName: 'Max Mustermann',
  status: 'PENDING',
  paymentStatus: 'PENDING',
  paymentMethod: 'BANK_TRANSFER',
  total: 209.97,
  subtotal: 199.98,
  shippingCost: 9.99,
  discountAmount: 0,
  createdAt: new Date('2025-01-15'),
  items: [
    {
      id: 'item1',
      quantity: 2,
      unitPrice: 99.99,
      productName: 'Induktionskochfeld',
      product: {
        price: 99.99,
        images: [{ url: 'https://example.com/img.jpg' }],
      },
    },
  ],
}

function makeRequest(method: string, body?: unknown) {
  const init: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
      'x-forwarded-for': '127.0.0.1',
    },
  }
  if (body) init.body = JSON.stringify(body)
  return new NextRequest(new Request('https://example.com/api/orders/order1', init))
}

describe('GET /api/orders/[id]', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    ;(auth as ReturnType<typeof vi.fn>).mockResolvedValue({ user: mockUser })
    ;(prisma.order.findUnique as ReturnType<typeof vi.fn>).mockResolvedValue(mockOrder)
  })

  it('returns order for authorized user', async () => {
    const req = makeRequest('GET')
    const res = await GET(req, { params: Promise.resolve({ id: 'order1' }) })

    expect(res.status).toBe(200)
    const data = await res.json()
    expect(data.orderNumber).toBe('NOV-123456789ABC')
    expect(data.total).toBe(209.97)
  })

  it('returns 401 for unauthenticated user', async () => {
    ;(auth as ReturnType<typeof vi.fn>).mockResolvedValue(null)
    const req = makeRequest('GET')
    const res = await GET(req, { params: Promise.resolve({ id: 'order1' }) })

    expect(res.status).toBe(401)
  })

  it('returns 403 for wrong user', async () => {
    ;(prisma.order.findUnique as ReturnType<typeof vi.fn>).mockResolvedValue({
      ...mockOrder,
      userId: 'other-user',
    })
    const req = makeRequest('GET')
    const res = await GET(req, { params: Promise.resolve({ id: 'order1' }) })

    expect(res.status).toBe(403)
  })

  it('returns 404 for nonexistent order', async () => {
    ;(prisma.order.findUnique as ReturnType<typeof vi.fn>).mockResolvedValue(null)
    const req = makeRequest('GET')
    const res = await GET(req, { params: Promise.resolve({ id: 'nonexistent' }) })

    expect(res.status).toBe(404)
  })
})

describe('PATCH /api/orders/[id]', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    ;(auth as ReturnType<typeof vi.fn>).mockResolvedValue({ user: mockUser })
    ;(prisma.order.findUnique as ReturnType<typeof vi.fn>).mockResolvedValue(mockOrder)
    ;(prisma.order.update as ReturnType<typeof vi.fn>).mockResolvedValue({})
  })

  it('cancels a pending order', async () => {
    const req = makeRequest('PATCH', { action: 'cancel' })
    const res = await PATCH(req, { params: Promise.resolve({ id: 'order1' }) })

    expect(res.status).toBe(200)
    const data = await res.json()
    expect(data.success).toBe(true)
    expect(prisma.order.update).toHaveBeenCalledWith({
      where: { id: 'order1' },
      data: { status: 'CANCELLED' },
    })
  })

  it('returns 400 for invalid action', async () => {
    const req = makeRequest('PATCH', { action: 'invalid' })
    const res = await PATCH(req, { params: Promise.resolve({ id: 'order1' }) })

    expect(res.status).toBe(400)
  })

  it('returns 400 when cancelling non-pending order', async () => {
    ;(prisma.order.findUnique as ReturnType<typeof vi.fn>).mockResolvedValue({
      ...mockOrder,
      status: 'SHIPPED',
    })
    const req = makeRequest('PATCH', { action: 'cancel' })
    const res = await PATCH(req, { params: Promise.resolve({ id: 'order1' }) })

    expect(res.status).toBe(400)
    const data = await res.json()
    expect(data.error).toContain('Ausstehend')
  })

  it('returns 404 for nonexistent order', async () => {
    ;(prisma.order.findUnique as ReturnType<typeof vi.fn>).mockResolvedValue(null)
    const req = makeRequest('PATCH', { action: 'cancel' })
    const res = await PATCH(req, { params: Promise.resolve({ id: 'nonexistent' }) })

    expect(res.status).toBe(404)
  })

  it('returns 403 for wrong user', async () => {
    ;(prisma.order.findUnique as ReturnType<typeof vi.fn>).mockResolvedValue({
      ...mockOrder,
      userId: 'other-user',
    })
    const req = makeRequest('PATCH', { action: 'cancel' })
    const res = await PATCH(req, { params: Promise.resolve({ id: 'order1' }) })

    expect(res.status).toBe(403)
  })

  it('returns 401 for unauthenticated user', async () => {
    ;(auth as ReturnType<typeof vi.fn>).mockResolvedValue(null)
    const req = makeRequest('PATCH', { action: 'cancel' })
    const res = await PATCH(req, { params: Promise.resolve({ id: 'order1' }) })

    expect(res.status).toBe(401)
  })
})
