import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextRequest, NextResponse } from 'next/server'

const mockSession = vi.hoisted(() => ({ user: { id: 'admin1', role: 'ADMIN', name: 'Admin' } }))
const mockRequireAdmin = vi.hoisted(() => vi.fn())

vi.mock('@/lib/admin/require-admin', () => ({
  requireAdmin: mockRequireAdmin,
}))

vi.mock('@/lib/prisma', () => ({
  prisma: {
    product: {
      findMany: vi.fn(),
      count: vi.fn(),
      create: vi.fn(),
    },
    promotion: {
      findMany: vi.fn(),
      create: vi.fn(),
    },
    blogPost: {
      create: vi.fn(),
    },
    user: {
      findMany: vi.fn(),
    },
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

vi.mock('@/lib/csrf', () => ({
  validateCsrfToken: vi.fn().mockReturnValue(null),
}))

vi.mock('@/lib/validations/product', () => ({
  createProductSchema: { safeParse: vi.fn() },
}))

vi.mock('@/lib/validations/admin', () => ({
  createPromotionAdminSchema: { safeParse: vi.fn() },
  createBlogPostSchema: { safeParse: vi.fn() },
}))

import { GET as productsGET, POST as productsPOST } from '@/app/api/admin/products/route'
import { GET as promotionsGET, POST as promotionsPOST } from '@/app/api/admin/promotions/route'
import { POST as blogPOST } from '@/app/api/admin/blog/route'
import { GET as usersGET } from '@/app/api/admin/users/route'
import { prisma } from '@/lib/prisma'
import { auditLog } from '@/lib/admin/audit'
import { rateLimit, getIP, createRateLimitKey } from '@/lib/rate-limit'
import { validateCsrfToken } from '@/lib/csrf'
import { createProductSchema } from '@/lib/validations/product'
import { createPromotionAdminSchema, createBlogPostSchema } from '@/lib/validations/admin'

function makeGetRequest(url = 'https://example.com/api/admin/products'): NextRequest {
  return new NextRequest(new Request(url, { method: 'GET' }))
}

function makePostRequest(url: string, body: object): NextRequest {
  return new NextRequest(
    new Request(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
  )
}

function makeCsrfError(): NextResponse {
  return NextResponse.json({ error: 'CSRF token mismatch' }, { status: 403 })
}

function mockRateLimitBlocked(): void {
  vi.mocked(rateLimit).mockResolvedValue({ success: false } as ReturnType<typeof vi.fn> extends (...args: any) => infer R ? R : never)
}

describe('Admin API Routes', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockRequireAdmin.mockResolvedValue({ ok: true, status: 200, session: mockSession })
    vi.mocked(validateCsrfToken).mockReturnValue(null as any)
    vi.mocked(rateLimit).mockResolvedValue({ success: true } as any)
    vi.mocked(getIP).mockReturnValue('127.0.0.1')
    vi.mocked(createRateLimitKey).mockReturnValue('test:key')
  })

  // ── Admin Products ────────────────────────────────────────

  describe('GET /api/admin/products', () => {
    it('returns 401 for non-admin', async () => {
      mockRequireAdmin.mockResolvedValue({ ok: false, status: 401, session: null })
      const res = await productsGET(makeGetRequest())
      expect(res.status).toBe(401)
    })

    it('returns products (200)', async () => {
      const products = [{ id: 'p1', nameDe: 'Krug', slug: 'krug', price: 29.99, isActive: true, categoryId: 'c1', images: [] }]
      vi.mocked(prisma.product.findMany).mockResolvedValue(products as any)
      vi.mocked(prisma.product.count).mockResolvedValue(1)
      const res = await productsGET(makeGetRequest())
      const data = await res.json()
      expect(res.status).toBe(200)
      expect(data.products).toEqual(products)
    })

    it('returns 500 on database error', async () => {
      vi.mocked(prisma.product.findMany).mockRejectedValue(new Error('DB failure'))
      const res = await productsGET(makeGetRequest())
      expect(res.status).toBe(500)
    })
  })

  describe('POST /api/admin/products', () => {
    const validProduct = {
      nameDe: 'Test Produkt',
      slug: 'test-produkt',
      price: 19.99,
      categoryId: 'cat1',
      images: [{ url: '/img.jpg', alt: 'Test' }],
    }

    it('returns 401 for non-admin', async () => {
      mockRequireAdmin.mockResolvedValue({ ok: false, status: 401, session: null })
      const res = await productsPOST(makePostRequest('https://example.com/api/admin/products', validProduct))
      expect(res.status).toBe(401)
    })

    it('returns 403 on CSRF failure', async () => {
      vi.mocked(validateCsrfToken).mockReturnValue(makeCsrfError() as any)
      const res = await productsPOST(makePostRequest('https://example.com/api/admin/products', validProduct))
      expect(res.status).toBe(403)
    })

    it('returns 400 on validation failure (missing nameDe)', async () => {
      vi.mocked(createProductSchema.safeParse).mockReturnValue({
        success: false,
        error: { flatten: () => ({ fieldErrors: { nameDe: ['Required'] } }) },
      } as any)
      const res = await productsPOST(makePostRequest('https://example.com/api/admin/products', {}))
      const body = await res.json()
      expect(res.status).toBe(400)
      expect(body.error).toBe('Validierung fehlgeschlagen')
      expect(body.details).toEqual({ nameDe: ['Required'] })
    })

    it('creates product and writes audit log (200)', async () => {
      vi.mocked(createProductSchema.safeParse).mockReturnValue({ success: true, data: validProduct } as any)
      vi.mocked(prisma.product.create).mockResolvedValue({ id: 'p1', ...validProduct } as any)
      const res = await productsPOST(makePostRequest('https://example.com/api/admin/products', validProduct))
      expect(res.status).toBe(200)
      expect(prisma.product.create).toHaveBeenCalled()
      expect(auditLog).toHaveBeenCalledWith(
        expect.objectContaining({
          action: 'CREATE',
          entityType: 'Product',
          entityId: 'p1',
          userId: 'admin1',
        })
      )
    })

    it('returns 500 on database error', async () => {
      vi.mocked(createProductSchema.safeParse).mockReturnValue({ success: true, data: validProduct } as any)
      vi.mocked(prisma.product.create).mockRejectedValue(new Error('DB failure'))
      const res = await productsPOST(makePostRequest('https://example.com/api/admin/products', validProduct))
      expect(res.status).toBe(500)
    })
  })

  // ── Admin Promotions ──────────────────────────────────────

  describe('GET /api/admin/promotions', () => {
    it('returns 401 for non-admin', async () => {
      mockRequireAdmin.mockResolvedValue({ ok: false, status: 401, session: null })
      const res = await promotionsGET(makeGetRequest('https://example.com/api/admin/promotions'))
      expect(res.status).toBe(401)
    })

    it('returns 429 when rate limited', async () => {
      mockRateLimitBlocked()
      const res = await promotionsGET(makeGetRequest('https://example.com/api/admin/promotions'))
      const body = await res.json()
      expect(res.status).toBe(429)
      expect(body.error).toBe('Zu viele Anfragen')
    })

    it('returns promotions (200)', async () => {
      const promos = [{ id: 'pr1', code: 'SUMMER', discountPercent: 20 }]
      vi.mocked(prisma.promotion.findMany).mockResolvedValue(promos as any)
      const res = await promotionsGET(makeGetRequest('https://example.com/api/admin/promotions'))
      const data = await res.json()
      expect(res.status).toBe(200)
      expect(data).toEqual(promos)
    })

    it('returns 500 on database error', async () => {
      vi.mocked(prisma.promotion.findMany).mockRejectedValue(new Error('DB failure'))
      const res = await promotionsGET(makeGetRequest('https://example.com/api/admin/promotions'))
      expect(res.status).toBe(500)
    })
  })

  describe('POST /api/admin/promotions', () => {
    const validPromotion = {
      code: 'SUMMER25',
      discountPercent: 25,
      startDate: '2025-06-01',
      endDate: '2025-08-31',
    }

    it('returns 401 for non-admin', async () => {
      mockRequireAdmin.mockResolvedValue({ ok: false, status: 401, session: null })
      const res = await promotionsPOST(makePostRequest('https://example.com/api/admin/promotions', validPromotion))
      expect(res.status).toBe(401)
    })

    it('returns 403 on CSRF failure', async () => {
      vi.mocked(validateCsrfToken).mockReturnValue(makeCsrfError() as any)
      const res = await promotionsPOST(makePostRequest('https://example.com/api/admin/promotions', validPromotion))
      expect(res.status).toBe(403)
    })

    it('returns 400 on validation failure', async () => {
      vi.mocked(createPromotionAdminSchema.safeParse).mockReturnValue({
        success: false,
        error: { flatten: () => ({ fieldErrors: { code: ['Required'] } }) },
      } as any)
      const res = await promotionsPOST(makePostRequest('https://example.com/api/admin/promotions', {}))
      const body = await res.json()
      expect(res.status).toBe(400)
      expect(body.error).toBe('Ungültige Daten')
    })

    it('creates promotion and writes audit log (200)', async () => {
      vi.mocked(createPromotionAdminSchema.safeParse).mockReturnValue({ success: true, data: validPromotion } as any)
      vi.mocked(prisma.promotion.create).mockResolvedValue({ id: 'pr1', ...validPromotion, autoGenerated: false } as any)
      const res = await promotionsPOST(makePostRequest('https://example.com/api/admin/promotions', validPromotion))
      expect(res.status).toBe(200)
      expect(prisma.promotion.create).toHaveBeenCalled()
      expect(auditLog).toHaveBeenCalledWith(
        expect.objectContaining({
          action: 'CREATE',
          entityType: 'Promotion',
          entityId: 'pr1',
          userId: 'admin1',
        })
      )
    })

    it('returns 500 on database error', async () => {
      vi.mocked(createPromotionAdminSchema.safeParse).mockReturnValue({ success: true, data: validPromotion } as any)
      vi.mocked(prisma.promotion.create).mockRejectedValue(new Error('DB failure'))
      const res = await promotionsPOST(makePostRequest('https://example.com/api/admin/promotions', validPromotion))
      expect(res.status).toBe(500)
    })
  })

  // ── Admin Blog ────────────────────────────────────────────

  describe('POST /api/admin/blog', () => {
    const validPost = {
      titleDe: 'Neuer Blog Post',
      slug: 'neuer-blog-post',
      contentDe: 'Das ist der Inhalt.',
      isPublished: true,
    }

    it('returns 401 for non-admin', async () => {
      mockRequireAdmin.mockResolvedValue({ ok: false, status: 401, session: null })
      const res = await blogPOST(makePostRequest('https://example.com/api/admin/blog', validPost))
      expect(res.status).toBe(401)
    })

    it('returns 403 on CSRF failure', async () => {
      vi.mocked(validateCsrfToken).mockReturnValue(makeCsrfError() as any)
      const res = await blogPOST(makePostRequest('https://example.com/api/admin/blog', validPost))
      expect(res.status).toBe(403)
    })

    it('returns 400 on validation failure', async () => {
      vi.mocked(createBlogPostSchema.safeParse).mockReturnValue({
        success: false,
        error: { flatten: () => ({ fieldErrors: { titleDe: ['Required'] } }) },
      } as any)
      const res = await blogPOST(makePostRequest('https://example.com/api/admin/blog', {}))
      const body = await res.json()
      expect(res.status).toBe(400)
      expect(body.error).toBe('Ungültige Daten')
    })

    it('creates blog post and writes audit log (200)', async () => {
      vi.mocked(createBlogPostSchema.safeParse).mockReturnValue({ success: true, data: validPost } as any)
      vi.mocked(prisma.blogPost.create).mockResolvedValue({ id: 'bp1', ...validPost } as any)
      const res = await blogPOST(makePostRequest('https://example.com/api/admin/blog', validPost))
      expect(res.status).toBe(200)
      expect(prisma.blogPost.create).toHaveBeenCalled()
      expect(auditLog).toHaveBeenCalledWith(
        expect.objectContaining({
          action: 'CREATE',
          entityType: 'BlogPost',
          entityId: 'bp1',
          userId: 'admin1',
        })
      )
    })

    it('returns 500 on database error', async () => {
      vi.mocked(createBlogPostSchema.safeParse).mockReturnValue({ success: true, data: validPost } as any)
      vi.mocked(prisma.blogPost.create).mockRejectedValue(new Error('DB failure'))
      const res = await blogPOST(makePostRequest('https://example.com/api/admin/blog', validPost))
      expect(res.status).toBe(500)
    })
  })

  // ── Admin Users ───────────────────────────────────────────

  describe('GET /api/admin/users', () => {
    it('returns 401 for non-admin', async () => {
      mockRequireAdmin.mockResolvedValue({ ok: false, status: 401, session: null })
      const res = await usersGET(makeGetRequest('https://example.com/api/admin/users'))
      expect(res.status).toBe(401)
    })

    it('returns 429 when rate limited', async () => {
      mockRateLimitBlocked()
      const res = await usersGET(makeGetRequest('https://example.com/api/admin/users'))
      const body = await res.json()
      expect(res.status).toBe(429)
      expect(body.error).toBe('Zu viele Anfragen')
    })

    it('returns users with pagination (200)', async () => {
      const users = [
        { id: 'u1', name: 'Alice', email: 'alice@test.de', role: 'USER', createdAt: '2025-01-15T10:00:00.000Z', emailVerified: true },
        { id: 'u2', name: 'Bob', email: 'bob@test.de', role: 'ADMIN', createdAt: '2025-02-20T14:30:00.000Z', emailVerified: false },
      ]
      vi.mocked(prisma.user.findMany).mockResolvedValue(users as any)
      const res = await usersGET(makeGetRequest('https://example.com/api/admin/users'))
      const body = await res.json()
      expect(res.status).toBe(200)
      expect(body.items).toEqual(users)
      expect(body.nextCursor).toBeNull()
    })

    it('returns nextCursor when more results exist', async () => {
      const users = [
        { id: 'u1', name: 'Alice' },
        { id: 'u2', name: 'Bob' },
      ]
      vi.mocked(prisma.user.findMany).mockResolvedValue(users as any)
      const res = await usersGET(makeGetRequest('https://example.com/api/admin/users?take=2'))
      const body = await res.json()
      expect(res.status).toBe(200)
      expect(body.items).toHaveLength(2)
      expect(body.nextCursor).toBe('u2')
    })

    it('returns 500 on database error', async () => {
      vi.mocked(prisma.user.findMany).mockRejectedValue(new Error('DB failure'))
      const res = await usersGET(makeGetRequest('https://example.com/api/admin/users'))
      expect(res.status).toBe(500)
    })
  })
})
