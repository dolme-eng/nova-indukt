import { describe, it, expect, vi, beforeEach } from 'vitest'

const mockSession = vi.hoisted(() => ({ user: { id: 'user1', name: 'Test User' } }))

const mockCsrfValidate = vi.hoisted(() => vi.fn().mockReturnValue(null))
const mockRecaptchaVerify = vi.hoisted(() => vi.fn().mockResolvedValue(null))
const mockRateLimit = vi.hoisted(() => vi.fn().mockResolvedValue({ success: true }))
const mockGetIP = vi.hoisted(() => vi.fn().mockReturnValue('127.0.0.1'))
const mockCreateRateLimitKey = vi.hoisted(() => vi.fn().mockReturnValue('test:key'))
const mockAuth = vi.hoisted(() => vi.fn().mockResolvedValue(mockSession))
const mockFindMany = vi.hoisted(() => vi.fn())
const mockTransaction = vi.hoisted(() => vi.fn())
const mockCartDeleteMany = vi.hoisted(() => vi.fn().mockResolvedValue({ count: 1 }))
const mockPromotionUpdate = vi.hoisted(() => vi.fn())
const mockSendEmail = vi.hoisted(() => vi.fn().mockResolvedValue(undefined))
const mockAuditLog = vi.hoisted(() => vi.fn().mockResolvedValue(undefined))
const mockRevalidatePath = vi.hoisted(() => vi.fn())
const mockLogError = vi.hoisted(() => vi.fn())
const mockApplyPromotions = vi.hoisted(() => vi.fn().mockResolvedValue(new Map()))
const mockValidateCoupon = vi.hoisted(() =>
  vi.fn().mockResolvedValue({ isValid: true, discountAmount: 0, promotionId: undefined })
)
const mockCalculateShipping = vi.hoisted(() => vi.fn().mockReturnValue(9.99))
const mockRandomUUID = vi.hoisted(() => vi.fn().mockReturnValue('550e8400-e29b-41d4-a716-446655440000'))

vi.mock('@/lib/prisma', () => ({
  prisma: {
    product: { findMany: mockFindMany },
    order: { create: vi.fn() },
    promotion: { update: mockPromotionUpdate },
    cartItem: { deleteMany: mockCartDeleteMany },
    $transaction: mockTransaction,
  },
}))

vi.mock('@/lib/auth', () => ({ auth: mockAuth }))
vi.mock('@/lib/csrf', () => ({ validateCsrfToken: mockCsrfValidate }))
vi.mock('@/lib/recaptcha', () => ({ verifyRecaptcha: mockRecaptchaVerify }))
vi.mock('@/lib/rate-limit', () => ({
  rateLimit: mockRateLimit,
  getIP: mockGetIP,
  createRateLimitKey: mockCreateRateLimitKey,
}))
vi.mock('@/lib/logger', () => ({ logError: mockLogError }))
vi.mock('@/lib/email/send', () => ({ sendOrderConfirmationForOrder: mockSendEmail }))
vi.mock('@/lib/admin/audit', () => ({ auditLog: mockAuditLog }))
vi.mock('@/lib/constants/shop', () => ({ calculateShipping: mockCalculateShipping }))
vi.mock('@/lib/promotions', () => ({
  applyPromotionsToProducts: mockApplyPromotions,
  validateCoupon: mockValidateCoupon,
}))
vi.mock('next/cache', () => ({ revalidatePath: mockRevalidatePath }))
vi.mock('crypto', () => ({ randomUUID: mockRandomUUID }))

import { POST } from '@/app/api/orders/route'
import { NextRequest } from 'next/server'

function makePostRequest(body: unknown, headers?: Record<string, string>) {
  return new NextRequest(
    new Request('https://example.com/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...headers },
      body: JSON.stringify(body),
    })
  )
}

const validShippingData = {
  email: 'max@example.de',
  firstName: 'Max',
  lastName: 'Mustermann',
  phone: '+491234567890',
  address: 'Musterstraße 1',
  zipCode: '10115',
  city: 'Berlin',
  country: 'Deutschland',
}

function makeValidBody(overrides?: Record<string, unknown>) {
  return {
    items: [
      {
        id: 'clx1234567890abcdefg',
        quantity: 1,
        price: 49.99,
        name: 'Bratpfanne',
        slug: 'bratpfanne',
      },
    ],
    shippingData: validShippingData,
    paymentMethod: 'BANK_TRANSFER',
    subtotal: 49.99,
    shipping: 9.99,
    discountAmount: 0,
    total: 59.98,
    ...overrides,
  }
}

const dbProduct = {
  id: 'clx1234567890abcdefg',
  price: 49.99,
  nameDe: 'Bratpfanne',
  isActive: true,
  categoryId: 'cat-1',
  slug: 'bratpfanne',
}

const mockCreatedOrder = {
  id: 'order-1',
  orderNumber: 'NOV-550E8400E29B',
  userId: 'user1',
  customerEmail: 'max@example.de',
  customerName: 'Max Mustermann',
  customerPhone: '+491234567890',
  shippingAddress: {
    firstName: 'Max',
    lastName: 'Mustermann',
    name: 'Max Mustermann',
    street: 'Musterstraße 1',
    postalCode: '10115',
    city: 'Berlin',
    country: 'Deutschland',
  },
  paymentMethod: 'BANK_TRANSFER',
  status: 'PENDING',
  paymentStatus: 'PENDING',
  subtotal: 49.99,
  shippingCost: 9.99,
  discountAmount: 0,
  appliedPromoCode: null,
  vatAmount: 9.5,
  total: 59.98,
  items: [
    {
      id: 'item-1',
      productId: 'clx1234567890abcdefg',
      quantity: 1,
      unitPrice: 49.99,
      productName: 'Bratpfanne',
      productSlug: 'bratpfanne',
      vatRate: 19,
    },
  ],
}

function setupTransactionMock(orderResult?: Record<string, unknown>) {
  mockTransaction.mockImplementation(async (fn: (tx: Record<string, unknown>) => Promise<unknown>) => {
    const tx = {
      order: { create: vi.fn().mockResolvedValue(orderResult ?? mockCreatedOrder) },
      promotion: { update: mockPromotionUpdate },
    }
    return fn(tx)
  })
}

describe('POST /api/orders', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockCsrfValidate.mockReturnValue(null)
    mockRecaptchaVerify.mockResolvedValue(null)
    mockRateLimit.mockResolvedValue({ success: true })
    mockGetIP.mockReturnValue('127.0.0.1')
    mockCreateRateLimitKey.mockReturnValue('test:key')
    mockAuth.mockResolvedValue(mockSession)
    mockFindMany.mockResolvedValue([dbProduct])
    mockCartDeleteMany.mockResolvedValue({ count: 1 })
    mockSendEmail.mockResolvedValue(undefined)
    mockAuditLog.mockResolvedValue(undefined)
    mockApplyPromotions.mockResolvedValue(new Map())
    mockValidateCoupon.mockResolvedValue({ isValid: true, discountAmount: 0, promotionId: undefined })
    mockCalculateShipping.mockReturnValue(9.99)
    mockRandomUUID.mockReturnValue('550e8400-e29b-41d4-a716-446655440000')
    setupTransactionMock()
  })

  it('creates an order with 1 item (200)', async () => {
    const req = makePostRequest(makeValidBody())
    const res = await POST(req)
    const data = await res.json()

    expect(res.status).toBe(200)
    expect(data.orderNumber).toBe('NOV-550E8400E29B')
    expect(data.status).toBe('PENDING')
    expect(data.paymentMethod).toBe('BANK_TRANSFER')
    expect(data.total).toBe(59.98)
    expect(data.items).toHaveLength(1)
    expect(data.items[0].productName).toBe('Bratpfanne')
  })

  it('creates an order with 2 items and verifies server-side price lookup', async () => {
    const dbProducts = [
      dbProduct,
      {
        id: 'clx1234567890abcdefx',
        price: 25.00,
        nameDe: 'Produkt B',
        isActive: true,
        categoryId: 'cat-2',
        slug: 'produkt-b',
      },
    ]
    mockFindMany.mockResolvedValue(dbProducts)

    const twoItemOrder = {
      ...mockCreatedOrder,
      items: [
        mockCreatedOrder.items[0],
        {
          id: 'item-2',
          productId: 'clx1234567890abcdefx',
          quantity: 2,
          unitPrice: 25.00,
          productName: 'Produkt B',
          productSlug: 'produkt-b',
          vatRate: 19,
        },
      ],
    }
    setupTransactionMock(twoItemOrder)

    const body = makeValidBody({
      items: [
        { id: 'clx1234567890abcdefg', quantity: 1, price: 10.00, name: 'Bratpfanne' },
        { id: 'clx1234567890abcdefx', quantity: 2, price: 20.00, name: 'Produkt B' },
      ],
      subtotal: 55.00,
      shipping: 9.99,
      total: 64.99,
    })

    const req = makePostRequest(body)
    const res = await POST(req)
    const data = await res.json()

    expect(res.status).toBe(200)
    expect(data.items).toHaveLength(2)
    expect(mockFindMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: { in: ['clx1234567890abcdefg', 'clx1234567890abcdefx'] } },
      })
    )
  })

  it('returns 400 for empty body', async () => {
    const req = makePostRequest({})
    const res = await POST(req)

    expect(res.status).toBe(400)
  })

  it('returns 400 for empty items array', async () => {
    const body = makeValidBody({ items: [] })
    const req = makePostRequest(body)
    const res = await POST(req)

    expect(res.status).toBe(400)
  })

  it('returns 400 for invalid email', async () => {
    const body = makeValidBody({
      shippingData: { ...validShippingData, email: 'not-an-email' },
    })
    const req = makePostRequest(body)
    const res = await POST(req)

    expect(res.status).toBe(400)
  })

  it('returns 400 for invalid paymentMethod', async () => {
    const body = makeValidBody({ paymentMethod: 'PAYPAL' })
    const req = makePostRequest(body)
    const res = await POST(req)

    expect(res.status).toBe(400)
  })

  it('returns 400 when total does not match subtotal + shipping - discount', async () => {
    const body = makeValidBody({ total: 999.99 })
    const req = makePostRequest(body)
    const res = await POST(req)

    expect(res.status).toBe(400)
  })

  it('returns 404 when product not found in database', async () => {
    mockFindMany.mockResolvedValue([])
    const req = makePostRequest(makeValidBody())
    const res = await POST(req)
    const data = await res.json()

    expect(res.status).toBe(404)
    expect(data.error).toContain('nicht gefunden')
  })

  it('returns 400 when product is inactive', async () => {
    mockFindMany.mockResolvedValue([{ ...dbProduct, isActive: false }])
    const req = makePostRequest(makeValidBody())
    const res = await POST(req)
    const data = await res.json()

    expect(res.status).toBe(400)
    expect(data.error).toContain('nicht mehr verfügbar')
  })

  it('returns 400 for invalid coupon code', async () => {
    mockValidateCoupon.mockResolvedValue({
      isValid: false,
      discountAmount: 0,
      error: 'Gutschein ungültig',
    })
    const body = makeValidBody({ appliedPromoCode: 'INVALID10' })
    const req = makePostRequest(body)
    const res = await POST(req)
    const data = await res.json()

    expect(res.status).toBe(400)
    expect(data.error).toBe('Gutschein ungültig')
  })

  it('applies valid coupon and applies discount', async () => {
    mockValidateCoupon.mockResolvedValue({
      isValid: true,
      discountAmount: 10.00,
      promotionId: 'promo-1',
    })

    const orderWithDiscount = {
      ...mockCreatedOrder,
      discountAmount: 10.00,
      appliedPromoCode: 'SAVE10',
      total: 49.98,
    }
    setupTransactionMock(orderWithDiscount)

    const body = makeValidBody({
      appliedPromoCode: 'SAVE10',
      discountAmount: 10.00,
      total: 49.98,
    })
    const req = makePostRequest(body)
    const res = await POST(req)
    const data = await res.json()

    expect(res.status).toBe(200)
    expect(mockValidateCoupon).toHaveBeenCalledWith('SAVE10', 49.99, [
      { productId: 'clx1234567890abcdefg', categoryId: 'cat-1' },
    ])
    expect(data.discountAmount).toBe(10.00)
    expect(data.appliedPromoCode).toBe('SAVE10')
  })

  it('returns 403 when CSRF validation fails', async () => {
    mockCsrfValidate.mockReturnValue(
      new Response(JSON.stringify({ error: 'CSRF-Token fehlt' }), { status: 403 })
    )
    const req = makePostRequest(makeValidBody())
    const res = await POST(req)

    expect(res.status).toBe(403)
  })

  it('returns 403 when reCAPTCHA verification fails', async () => {
    mockRecaptchaVerify.mockResolvedValue(
      new Response(JSON.stringify({ error: 'Verdächtige Aktivität erkannt' }), { status: 403 })
    )
    const req = makePostRequest(makeValidBody())
    const res = await POST(req)

    expect(res.status).toBe(403)
  })

  it('returns 429 when rate limit is exceeded', async () => {
    mockRateLimit.mockResolvedValue({ success: false })
    const req = makePostRequest(makeValidBody())
    const res = await POST(req)
    const data = await res.json()

    expect(res.status).toBe(429)
    expect(data.error).toContain('Zu viele Anfragen')
  })

  it('returns 500 on database error', async () => {
    mockFindMany.mockRejectedValue(new Error('DB connection failed'))
    const req = makePostRequest(makeValidBody())
    const res = await POST(req)

    expect(res.status).toBe(500)
    expect(mockLogError).toHaveBeenCalledWith('Error creating order:', expect.any(Error))
  })

  it('sends order confirmation email for BANK_TRANSFER', async () => {
    const req = makePostRequest(makeValidBody())
    await POST(req)

    expect(mockSendEmail).toHaveBeenCalledWith('order-1')
  })

  it('clears cart after successful order for logged-in user', async () => {
    const req = makePostRequest(makeValidBody())
    await POST(req)

    expect(mockCartDeleteMany).toHaveBeenCalledWith({
      where: { cart: { userId: 'user1' } },
    })
  })

  it('does not clear cart for guest user', async () => {
    mockAuth.mockResolvedValue(null)
    const req = makePostRequest(makeValidBody())
    await POST(req)

    expect(mockCartDeleteMany).not.toHaveBeenCalled()
  })

  it('calls audit log after successful order', async () => {
    const req = makePostRequest(makeValidBody())
    await POST(req)

    expect(mockAuditLog).toHaveBeenCalledWith(
      expect.objectContaining({
        action: 'CREATE',
        entityType: 'Order',
        entityId: 'order-1',
        userId: 'user1',
        newValues: expect.objectContaining({
          orderNumber: 'NOV-550E8400E29B',
          total: 59.98,
          paymentMethod: 'BANK_TRANSFER',
          customerName: 'Max Mustermann',
          itemCount: 1,
        }),
      })
    )
  })

  it('revalidates /mein-konto path after order', async () => {
    const req = makePostRequest(makeValidBody())
    await POST(req)

    expect(mockRevalidatePath).toHaveBeenCalledWith('/mein-konto')
  })

  it('increments promotion usage when coupon is applied', async () => {
    mockValidateCoupon.mockResolvedValue({
      isValid: true,
      discountAmount: 5.00,
      promotionId: 'promo-abc',
    })

    let capturedTx: Record<string, unknown>
    mockTransaction.mockImplementation(async (fn: (tx: Record<string, unknown>) => Promise<unknown>) => {
      const tx = {
        order: { create: vi.fn().mockResolvedValue(mockCreatedOrder) },
        promotion: { update: vi.fn() },
      }
      capturedTx = tx
      return fn(tx)
    })

    const body = makeValidBody({
      appliedPromoCode: 'SAVE5',
      discountAmount: 5.00,
      total: 54.98,
    })
    const req = makePostRequest(body)
    await POST(req)

    expect(capturedTx!.promotion.update).toHaveBeenCalledWith({
      where: { id: 'promo-abc' },
      data: { usageCount: { increment: 1 } },
    })
  })
})
