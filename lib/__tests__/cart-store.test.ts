import { describe, it, expect, vi, beforeEach } from 'vitest'
import { act } from 'react'

vi.mock('@/app/actions/cart', () => ({
  addToCart: vi.fn(async () => ({ success: true })),
  updateCartItem: vi.fn(async () => ({ success: true })),
  removeFromCart: vi.fn(async () => ({ success: true })),
  clearCart: vi.fn(async () => ({ success: true })),
}))

vi.mock('@/app/actions/cart-hydration', () => ({
  getProductsForHydration: vi.fn(async () => []),
}))

vi.mock('@/lib/logger', () => ({
  logError: vi.fn(),
}))

import { useCartStore } from '@/lib/store/cart'
import type { Product } from '@/lib/data/products'

const mockProduct: Product = {
  id: 'prod-1',
  slug: 'testprodukt',
  name: { de: 'Testprodukt' },
  category: 'cat-1',
  price: 299.99,
  images: [],
  rating: 4.5,
  reviewCount: 10,
  description: { de: 'Test' },
  shortDescription: { de: 'Kurz' },
  specs: {
    material: 'Edelstahl',
    dimensions: '20cm',
    weight: '2kg',
    dishwasher: true,
    induction: true,
  },
}

const mockProduct2: Product = {
  ...mockProduct,
  id: 'prod-2',
  slug: 'testprodukt-2',
  name: { de: 'Testprodukt 2' },
  price: 149.5,
}

beforeEach(() => {
  useCartStore.setState({ items: [], isHydrated: true })
})

describe('cart store', () => {
  it('starts with empty items', () => {
    const { items } = useCartStore.getState()
    expect(items).toEqual([])
  })

  it('adds a new item', () => {
    act(() => {
      useCartStore.getState().addItem(mockProduct)
    })
    const { items } = useCartStore.getState()
    expect(items).toHaveLength(1)
    expect(items[0].product.id).toBe('prod-1')
    expect(items[0].quantity).toBe(1)
  })

  it('increments quantity when adding existing item', () => {
    act(() => {
      useCartStore.getState().addItem(mockProduct)
      useCartStore.getState().addItem(mockProduct, 2)
    })
    const { items } = useCartStore.getState()
    expect(items).toHaveLength(1)
    expect(items[0].quantity).toBe(3)
  })

  it('removes an item', () => {
    act(() => {
      useCartStore.getState().addItem(mockProduct)
    })
    act(() => {
      useCartStore.getState().removeItem('prod-1')
    })
    expect(useCartStore.getState().items).toHaveLength(0)
  })

  it('updates quantity', () => {
    act(() => {
      useCartStore.getState().addItem(mockProduct)
    })
    act(() => {
      useCartStore.getState().updateQuantity('prod-1', 5)
    })
    expect(useCartStore.getState().items[0].quantity).toBe(5)
  })

  it('removes item when updating quantity to 0', () => {
    act(() => {
      useCartStore.getState().addItem(mockProduct)
    })
    act(() => {
      useCartStore.getState().updateQuantity('prod-1', 0)
    })
    expect(useCartStore.getState().items).toHaveLength(0)
  })

  it('clears all items', () => {
    act(() => {
      useCartStore.getState().addItem(mockProduct)
      useCartStore.getState().addItem(mockProduct2)
    })
    act(() => {
      useCartStore.getState().clearCart()
    })
    expect(useCartStore.getState().items).toHaveLength(0)
  })

  it('computes totalItems', () => {
    act(() => {
      useCartStore.getState().addItem(mockProduct, 2)
      useCartStore.getState().addItem(mockProduct2, 3)
    })
    expect(useCartStore.getState().totalItems()).toBe(5)
  })

  it('computes totalPrice', () => {
    act(() => {
      useCartStore.getState().addItem(mockProduct, 2)
      useCartStore.getState().addItem(mockProduct2, 1)
    })
    const expected = 299.99 * 2 + 149.5 * 1
    expect(useCartStore.getState().totalPrice()).toBeCloseTo(expected)
  })

  it('adds multiple different products independently', () => {
    act(() => {
      useCartStore.getState().addItem(mockProduct)
      useCartStore.getState().addItem(mockProduct2)
    })
    const { items } = useCartStore.getState()
    expect(items).toHaveLength(2)
    expect(items.find((i) => i.product.id === 'prod-1')).toBeDefined()
    expect(items.find((i) => i.product.id === 'prod-2')).toBeDefined()
  })
})
