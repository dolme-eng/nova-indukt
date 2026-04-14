import { describe, it, expect, vi, beforeEach } from 'vitest'
import {
  addToCart,
  updateCartItem,
  removeFromCart,
  getCartItems,
  clearCart,
  mergeGuestCartOnLogin,
} from '@/app/actions/cart'
import { prisma } from '@/lib/prisma'
import { cookies } from 'next/headers'

// Mock auth
vi.mock('@/lib/auth', () => ({
  auth: vi.fn(),
}))

import { auth as getServerSession } from '@/lib/auth'

describe('Cart Server Actions', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  const mockUser = { id: 'user-123', email: 'test@example.com' }
  const mockProduct = {
    id: 'prod-123',
    name: 'Test Produkt',
    price: 99.99,
    images: [{ url: '/product.jpg' }],
    slug: 'test-produkt',
  }

  const mockCart = {
    id: 'cart-123',
    userId: 'user-123',
    items: [
      {
        id: 'item-1',
        productId: 'prod-123',
        quantity: 2,
        product: mockProduct,
      },
    ],
  }

  describe('addToCart', () => {
    it('should add item to database cart for authenticated user', async () => {
      vi.mocked(getServerSession).mockResolvedValue({
        user: mockUser,
      } as any)

      vi.mocked(prisma.cart.findUnique).mockResolvedValue(mockCart as any)
      vi.mocked(prisma.cartItem.create).mockResolvedValue({
        id: 'item-2',
        cartId: 'cart-123',
        productId: 'prod-456',
        quantity: 1,
      } as any)

      const result = await addToCart('prod-456', 1)

      expect(result.success).toBe(true)
      expect(prisma.cartItem.create).toHaveBeenCalledWith({
        data: {
          cartId: 'cart-123',
          productId: 'prod-456',
          quantity: 1,
        },
      })
    })

    it('should update quantity for existing item in database cart', async () => {
      vi.mocked(getServerSession).mockResolvedValue({
        user: mockUser,
      } as any)

      vi.mocked(prisma.cart.findUnique).mockResolvedValue(mockCart as any)
      vi.mocked(prisma.cartItem.update).mockResolvedValue({
        id: 'item-1',
        cartId: 'cart-123',
        productId: 'prod-123',
        quantity: 5,
      } as any)

      const result = await addToCart('prod-123', 3)

      expect(result.success).toBe(true)
      expect(prisma.cartItem.update).toHaveBeenCalledWith({
        where: { id: 'item-1' },
        data: { quantity: 5 },
      })
    })

    it('should create new cart if user has no cart', async () => {
      vi.mocked(getServerSession).mockResolvedValue({
        user: mockUser,
      } as any)

      vi.mocked(prisma.cart.findUnique).mockResolvedValue(null)
      vi.mocked(prisma.cart.create).mockResolvedValue({
        id: 'cart-new',
        userId: 'user-123',
        items: [],
      } as any)
      vi.mocked(prisma.cartItem.create).mockResolvedValue({
        id: 'item-1',
        cartId: 'cart-new',
        productId: 'prod-123',
        quantity: 1,
      } as any)

      const result = await addToCart('prod-123', 1)

      expect(result.success).toBe(true)
      expect(prisma.cart.create).toHaveBeenCalledWith({
        data: { userId: 'user-123' },
        include: { items: { include: { product: true } } },
      })
    })

    it('should add item to cookie cart for guest user', async () => {
      vi.mocked(getServerSession).mockResolvedValue(null)

      const mockCookieStore = {
        get: vi.fn().mockReturnValue(null),
        set: vi.fn(),
      }
      vi.mocked(cookies).mockReturnValue(mockCookieStore as any)

      const result = await addToCart('prod-123', 2)

      expect(result.success).toBe(true)
      expect(mockCookieStore.set).toHaveBeenCalledWith(
        'nova-cart',
        JSON.stringify([{ productId: 'prod-123', quantity: 2 }]),
        expect.objectContaining({
          maxAge: 60 * 60 * 24 * 30,
          httpOnly: true,
          secure: false,
          sameSite: 'lax',
        })
      )
    })

    it('should handle errors gracefully', async () => {
      vi.mocked(getServerSession).mockRejectedValue(new Error('Session Error'))

      const result = await addToCart('prod-123', 1)

      expect(result.success).toBe(false)
      expect(result.error).toBe('Failed to add item')
    })
  })

  describe('updateCartItem', () => {
    it('should update quantity for database cart', async () => {
      vi.mocked(getServerSession).mockResolvedValue({
        user: mockUser,
      } as any)

      vi.mocked(prisma.cart.findUnique).mockResolvedValue(mockCart as any)
      vi.mocked(prisma.cartItem.update).mockResolvedValue({
        id: 'item-1',
        quantity: 5,
      } as any)

      const result = await updateCartItem('prod-123', 5)

      expect(result.success).toBe(true)
      expect(prisma.cartItem.update).toHaveBeenCalledWith({
        where: { id: 'item-1' },
        data: { quantity: 5 },
      })
    })

    it('should delete item when quantity is 0 or less', async () => {
      vi.mocked(getServerSession).mockResolvedValue({
        user: mockUser,
      } as any)

      vi.mocked(prisma.cart.findUnique).mockResolvedValue(mockCart as any)
      vi.mocked(prisma.cartItem.delete).mockResolvedValue({ id: 'item-1' } as any)

      const result = await updateCartItem('prod-123', 0)

      expect(result.success).toBe(true)
      expect(prisma.cartItem.delete).toHaveBeenCalledWith({
        where: { id: 'item-1' },
      })
    })

    it('should update quantity in cookie cart for guest', async () => {
      vi.mocked(getServerSession).mockResolvedValue(null)

      const existingCart = [{ productId: 'prod-123', quantity: 2 }]
      const mockCookieStore = {
        get: vi.fn().mockReturnValue({ value: JSON.stringify(existingCart) }),
        set: vi.fn(),
      }
      vi.mocked(cookies).mockReturnValue(mockCookieStore as any)

      const result = await updateCartItem('prod-123', 5)

      expect(result.success).toBe(true)
      expect(mockCookieStore.set).toHaveBeenCalledWith(
        'nova-cart',
        JSON.stringify([{ productId: 'prod-123', quantity: 5 }]),
        expect.any(Object)
      )
    })

    it('should remove item from cookie when quantity is 0', async () => {
      vi.mocked(getServerSession).mockResolvedValue(null)

      const existingCart = [
        { productId: 'prod-123', quantity: 2 },
        { productId: 'prod-456', quantity: 1 },
      ]
      const mockCookieStore = {
        get: vi.fn().mockReturnValue({ value: JSON.stringify(existingCart) }),
        set: vi.fn(),
      }
      vi.mocked(cookies).mockReturnValue(mockCookieStore as any)

      const result = await updateCartItem('prod-123', 0)

      expect(result.success).toBe(true)
      expect(mockCookieStore.set).toHaveBeenCalledWith(
        'nova-cart',
        JSON.stringify([{ productId: 'prod-456', quantity: 1 }]),
        expect.any(Object)
      )
    })
  })

  describe('removeFromCart', () => {
    it('should delegate to updateCartItem with quantity 0', async () => {
      vi.mocked(getServerSession).mockResolvedValue({
        user: mockUser,
      } as any)

      vi.mocked(prisma.cart.findUnique).mockResolvedValue(mockCart as any)
      vi.mocked(prisma.cartItem.delete).mockResolvedValue({ id: 'item-1' } as any)

      const result = await removeFromCart('prod-123')

      expect(result.success).toBe(true)
    })
  })

  describe('getCartItems', () => {
    it('should return items from database cart for authenticated user', async () => {
      vi.mocked(getServerSession).mockResolvedValue({
        user: mockUser,
      } as any)

      vi.mocked(prisma.cart.findUnique).mockResolvedValue(mockCart as any)

      const result = await getCartItems()

      expect(result).toHaveLength(1)
      expect(result[0].id).toBe('prod-123')
      expect(result[0].name).toBe('Test Produkt')
      expect(result[0].price).toBe(99.99)
      expect(result[0].quantity).toBe(2)
    })

    it('should return items from cookie cart for guest', async () => {
      vi.mocked(getServerSession).mockResolvedValue(null)

      const cookieCart = [{ productId: 'prod-123', quantity: 2 }]
      const mockCookieStore = {
        get: vi.fn().mockReturnValue({ value: JSON.stringify(cookieCart) }),
      }
      vi.mocked(cookies).mockReturnValue(mockCookieStore as any)

      vi.mocked(prisma.product.findMany).mockResolvedValue([mockProduct] as any)

      const result = await getCartItems()

      expect(result).toHaveLength(1)
      expect(result[0].id).toBe('prod-123')
      expect(result[0].quantity).toBe(2)
    })

    it('should return empty array for empty cookie cart', async () => {
      vi.mocked(getServerSession).mockResolvedValue(null)

      const mockCookieStore = {
        get: vi.fn().mockReturnValue(null),
      }
      vi.mocked(cookies).mockReturnValue(mockCookieStore as any)

      const result = await getCartItems()

      expect(result).toEqual([])
    })

    it('should return empty array on error', async () => {
      vi.mocked(getServerSession).mockRejectedValue(new Error('Session Error'))

      const result = await getCartItems()

      expect(result).toEqual([])
    })
  })

  describe('clearCart', () => {
    it('should clear database cart for authenticated user', async () => {
      vi.mocked(getServerSession).mockResolvedValue({
        user: mockUser,
      } as any)

      vi.mocked(prisma.cart.findUnique).mockResolvedValue(mockCart as any)
      vi.mocked(prisma.cartItem.deleteMany).mockResolvedValue({ count: 1 } as any)

      const mockCookieStore = {
        delete: vi.fn(),
      }
      vi.mocked(cookies).mockReturnValue(mockCookieStore as any)

      const result = await clearCart()

      expect(result.success).toBe(true)
      expect(prisma.cartItem.deleteMany).toHaveBeenCalledWith({
        where: { cartId: 'cart-123' },
      })
      expect(mockCookieStore.delete).toHaveBeenCalledWith('nova-cart')
    })

    it('should clear cookie cart for guest', async () => {
      vi.mocked(getServerSession).mockResolvedValue(null)

      const mockCookieStore = {
        get: vi.fn().mockReturnValue({ value: '[]' }),
        delete: vi.fn(),
      }
      vi.mocked(cookies).mockReturnValue(mockCookieStore as any)

      const result = await clearCart()

      expect(result.success).toBe(true)
      expect(mockCookieStore.delete).toHaveBeenCalledWith('nova-cart')
    })

    it('should handle errors', async () => {
      vi.mocked(getServerSession).mockRejectedValue(new Error('Session Error'))

      const result = await clearCart()

      expect(result.success).toBe(false)
      expect(result.error).toBe('Failed to clear cart')
    })
  })

  describe('mergeGuestCartOnLogin', () => {
    it('should merge guest cart items with user cart', async () => {
      vi.mocked(getServerSession).mockResolvedValue({
        user: mockUser,
      } as any)

      const guestCart = [
        { productId: 'prod-123', quantity: 2 },
        { productId: 'prod-456', quantity: 1 },
      ]
      const mockCookieStore = {
        get: vi.fn().mockReturnValue({ value: JSON.stringify(guestCart) }),
        delete: vi.fn(),
      }
      vi.mocked(cookies).mockReturnValue(mockCookieStore as any)

      vi.mocked(prisma.cart.findUnique).mockResolvedValue({
        id: 'cart-123',
        userId: 'user-123',
        items: [
          { id: 'item-1', productId: 'prod-123', quantity: 1 },
        ],
      } as any)

      vi.mocked(prisma.cartItem.update).mockResolvedValue({} as any)
      vi.mocked(prisma.cartItem.create).mockResolvedValue({} as any)

      await mergeGuestCartOnLogin()

      // prod-123 exists, should update quantity
      expect(prisma.cartItem.update).toHaveBeenCalledWith({
        where: { id: 'item-1' },
        data: { quantity: 3 },
      })

      // prod-456 is new, should create
      expect(prisma.cartItem.create).toHaveBeenCalledWith({
        data: {
          cartId: 'cart-123',
          productId: 'prod-456',
          quantity: 1,
        },
      })

      expect(mockCookieStore.delete).toHaveBeenCalledWith('nova-cart')
    })

    it('should create new cart if user has no cart', async () => {
      vi.mocked(getServerSession).mockResolvedValue({
        user: mockUser,
      } as any)

      const guestCart = [{ productId: 'prod-123', quantity: 2 }]
      const mockCookieStore = {
        get: vi.fn().mockReturnValue({ value: JSON.stringify(guestCart) }),
        delete: vi.fn(),
      }
      vi.mocked(cookies).mockReturnValue(mockCookieStore as any)

      vi.mocked(prisma.cart.findUnique).mockResolvedValue(null)
      vi.mocked(prisma.cart.create).mockResolvedValue({
        id: 'cart-new',
        userId: 'user-123',
        items: [],
      } as any)
      vi.mocked(prisma.cartItem.create).mockResolvedValue({} as any)

      await mergeGuestCartOnLogin()

      expect(prisma.cart.create).toHaveBeenCalledWith({
        data: { userId: 'user-123' },
        include: { items: true },
      })
    })

    it('should do nothing if no session', async () => {
      vi.mocked(getServerSession).mockResolvedValue(null)

      await mergeGuestCartOnLogin()

      expect(prisma.cart.findUnique).not.toHaveBeenCalled()
    })

    it('should do nothing if no guest cart', async () => {
      vi.mocked(getServerSession).mockResolvedValue({
        user: mockUser,
      } as any)

      const mockCookieStore = {
        get: vi.fn().mockReturnValue(null),
      }
      vi.mocked(cookies).mockReturnValue(mockCookieStore as any)

      await mergeGuestCartOnLogin()

      expect(prisma.cart.findUnique).not.toHaveBeenCalled()
    })

    it('should do nothing if guest cart is empty', async () => {
      vi.mocked(getServerSession).mockResolvedValue({
        user: mockUser,
      } as any)

      const mockCookieStore = {
        get: vi.fn().mockReturnValue({ value: '[]' }),
      }
      vi.mocked(cookies).mockReturnValue(mockCookieStore as any)

      await mergeGuestCartOnLogin()

      expect(prisma.cart.findUnique).not.toHaveBeenCalled()
    })
  })
})
