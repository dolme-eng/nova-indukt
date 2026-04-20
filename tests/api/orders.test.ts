import { describe, it, expect, vi, beforeEach } from 'vitest'
import { GET as ordersHandler, POST as createOrderHandler } from '@/app/api/orders/route'
import { GET as orderDetailHandler } from '@/app/api/orders/[id]/route'
import { prisma } from '@/lib/prisma'

// Mock auth
vi.mock('@/lib/auth', () => ({
  auth: vi.fn(() => Promise.resolve({ user: { id: 'user-123', email: 'test@example.com', name: 'Test User' } })),
}))

import { auth as getServerSession } from '@/lib/auth'

describe('Orders API', () => {
  beforeEach(() => {
    vi.resetAllMocks()
    // Reset auth mock to default authenticated user
    vi.mocked(getServerSession).mockResolvedValue({
      user: { id: 'user-123', email: 'test@example.com', name: 'Test User' },
    } as any)
  })

  const mockUser = {
    id: 'user-123',
    email: 'test@example.com',
    name: 'Test User',
  }

  const mockOrder = {
    id: 'order-123',
    orderNumber: 'NOV-ABC123',
    userId: 'user-123',
    customerEmail: 'test@example.com',
    customerName: 'Test User',
    customerPhone: '+49123456789',
    shippingAddress: {
      firstName: 'Test',
      lastName: 'User',
      street: 'Teststraße 1',
      zip: '12345',
      city: 'Berlin',
      country: 'Deutschland',
    },
    paymentMethod: 'PAYPAL',
    status: 'PENDING',
    paymentStatus: 'PENDING',
    subtotal: 499.99,
    shippingCost: 9.99,
    total: 509.98,
    items: [
      {
        id: 'item-1',
        productId: 'prod-123',
        quantity: 1,
        unitPrice: 499.99,
        productName: 'Induktionskochfeld',
        productSlug: 'induktionskochfeld',
        vatRate: 19,
        product: {
          id: 'prod-123',
          name: 'Induktionskochfeld',
          slug: 'induktionskochfeld',
          images: [{ url: '/product.jpg' }],
          price: 499.99,
        },
      },
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  describe('GET /api/orders', () => {
    it('should return user orders when authenticated', async () => {
      vi.mocked(getServerSession).mockResolvedValue({
        user: { id: 'user-123', email: 'test@example.com', name: 'Test User' },
      } as any)

      vi.mocked(prisma.order.findMany).mockResolvedValue([mockOrder] as any)

      const request = new Request('http://localhost:3000/api/orders')
      const response = await ordersHandler(request as any)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data).toHaveLength(1)
      expect(data[0].orderNumber).toBe('NOV-ABC123')
      expect(data[0].total).toBe(509.98)
    })

    it('should return 401 when not authenticated', async () => {
      vi.mocked(getServerSession).mockResolvedValue(null as any)

      const request = new Request('http://localhost:3000/api/orders')
      const response = await ordersHandler(request as any)
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.error).toBe('Unauthorized')
    })

    it('should return orders sorted by date descending', async () => {
      vi.mocked(getServerSession).mockResolvedValue({
        user: { id: 'user-123' },
      } as any)

      vi.mocked(prisma.order.findMany).mockResolvedValue([mockOrder] as any)

      const request = new Request('http://localhost:3000/api/orders')
      await ordersHandler(request as any)

      expect(prisma.order.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          orderBy: { createdAt: 'desc' },
        })
      )
    })

    it('should handle database errors', async () => {
      vi.mocked(getServerSession).mockResolvedValue({
        user: { id: 'user-123' },
      } as any)

      vi.mocked(prisma.order.findMany).mockRejectedValue(new Error('DB Error'))

      const request = new Request('http://localhost:3000/api/orders')
      const response = await ordersHandler(request as any)
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.error).toBe('Failed to fetch orders')
    })
  })

  describe('POST /api/orders', () => {
    const validOrderData = {
      items: [
        {
          id: 'prod-123',
          name: 'Induktionskochfeld',
          price: 499.99,
          quantity: 1,
        },
      ],
      shippingData: {
        firstName: 'Test',
        lastName: 'User',
        email: 'test@example.com',
        phone: '+49123456789',
        address: 'Teststraße 1',
        zipCode: '12345',
        city: 'Berlin',
        country: 'Deutschland',
      },
      paymentMethod: 'paypal',
      subtotal: 499.99,
      shipping: 9.99,
      total: 509.98,
    }

    it('should create order successfully for authenticated user', async () => {
      vi.mocked(getServerSession).mockResolvedValue({
        user: { id: 'user-123', email: 'test@example.com', name: 'Test User' },
      } as any)

      vi.mocked(prisma.order.create).mockResolvedValue(mockOrder as any)
      vi.mocked(prisma.cartItem.deleteMany).mockResolvedValue({ count: 1 } as any)

      const request = new Request('http://localhost:3000/api/orders', {
        method: 'POST',
        body: JSON.stringify(validOrderData),
      })

      const response = await createOrderHandler(request as any)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.orderNumber).toBe('NOV-ABC123')
      expect(data.total).toBe(509.98)
      expect(prisma.order.create).toHaveBeenCalled()
    })

    it('should create order for guest user (no session)', async () => {
      vi.mocked(getServerSession).mockResolvedValue(null as any)
      vi.mocked(prisma.order.create).mockResolvedValue({
        ...mockOrder,
        userId: null,
      } as any)

      const request = new Request('http://localhost:3000/api/orders', {
        method: 'POST',
        body: JSON.stringify(validOrderData),
      })

      const response = await createOrderHandler(request as any)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.orderNumber).toBeDefined()
    })

    it('should return 400 if cart is empty', async () => {
      const emptyOrderData = {
        ...validOrderData,
        items: [],
      }

      const request = new Request('http://localhost:3000/api/orders', {
        method: 'POST',
        body: JSON.stringify(emptyOrderData),
      })

      const response = await createOrderHandler(request as any)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe('Cart is empty')
    })

    it('should clear cart after successful order creation', async () => {
      vi.mocked(getServerSession).mockResolvedValue({
        user: { id: 'user-123' },
      } as any)

      vi.mocked(prisma.order.create).mockResolvedValue(mockOrder as any)
      vi.mocked(prisma.cartItem.deleteMany).mockResolvedValue({ count: 1 } as any)

      const request = new Request('http://localhost:3000/api/orders', {
        method: 'POST',
        body: JSON.stringify(validOrderData),
      })

      await createOrderHandler(request as any)

      expect(prisma.cartItem.deleteMany).toHaveBeenCalledWith({
        where: {
          cart: {
            userId: 'user-123',
          },
        },
      })
    })

    it('should handle database errors during creation', async () => {
      vi.mocked(prisma.order.create).mockRejectedValue(new Error('DB Error'))

      const request = new Request('http://localhost:3000/api/orders', {
        method: 'POST',
        body: JSON.stringify(validOrderData),
      })

      const response = await createOrderHandler(request as any)
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.error).toBe('Failed to create order')
    })
  })

  describe('GET /api/orders/[id]', () => {
    it('should return order details for order owner', async () => {
      vi.mocked(getServerSession).mockResolvedValue({
        user: { id: 'user-123' },
      } as any)

      vi.mocked(prisma.order.findUnique).mockResolvedValue(mockOrder as any)

      const request = new Request('http://localhost:3000/api/orders/order-123')
      const params = Promise.resolve({ id: 'order-123' })
      const response = await orderDetailHandler(request as any, { params })
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.id).toBe('order-123')
      expect(data.orderNumber).toBe('NOV-ABC123')
      expect(data.items).toHaveLength(1)
    })

    it('should return 401 when not authenticated', async () => {
      vi.mocked(getServerSession).mockResolvedValue(null as any)

      const request = new Request('http://localhost:3000/api/orders/order-123')
      const params = Promise.resolve({ id: 'order-123' })
      const response = await orderDetailHandler(request as any, { params })
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.error).toBe('Unauthorized')
    })

    it('should return 404 for non-existent order', async () => {
      vi.mocked(getServerSession).mockResolvedValue({
        user: { id: 'user-123' },
      } as any)

      vi.mocked(prisma.order.findUnique).mockResolvedValue(null as any)

      const request = new Request('http://localhost:3000/api/orders/non-existent')
      const params = Promise.resolve({ id: 'non-existent' })
      const response = await orderDetailHandler(request as any, { params })
      const data = await response.json()

      expect(response.status).toBe(404)
      expect(data.error).toBe('Order not found')
    })

    it('should return 403 for order belonging to different user', async () => {
      vi.mocked(getServerSession).mockResolvedValue({
        user: { id: 'user-456' },
      } as any)

      vi.mocked(prisma.order.findUnique).mockResolvedValue({
        ...mockOrder,
        userId: 'user-123',
      } as any)

      const request = new Request('http://localhost:3000/api/orders/order-123')
      const params = Promise.resolve({ id: 'order-123' })
      const response = await orderDetailHandler(request as any, { params })
      const data = await response.json()

      expect(response.status).toBe(403)
      expect(data.error).toBe('Unauthorized')
    })
  })
})
