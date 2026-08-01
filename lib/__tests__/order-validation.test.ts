import { describe, it, expect } from 'vitest'
import { createOrderSchema, shippingDataSchema, orderItemSchema } from '@/lib/validations/order'

describe('orderItemSchema', () => {
  it('accepts valid order item', () => {
    const result = orderItemSchema.safeParse({
      id: 'clx1234567890abcdefg',
      quantity: 2,
      price: 29.99,
      name: 'Test Product',
      slug: 'test-product',
    })
    expect(result.success).toBe(true)
  })

  it('accepts item without slug', () => {
    const result = orderItemSchema.safeParse({
      id: 'clx1234567890abcdefg',
      quantity: 1,
      price: 19.99,
      name: 'Test Product',
    })
    expect(result.success).toBe(true)
  })

  it('rejects quantity of 0', () => {
    const result = orderItemSchema.safeParse({
      id: 'clx1234567890abcdefg',
      quantity: 0,
      price: 29.99,
      name: 'Test Product',
    })
    expect(result.success).toBe(false)
  })

  it('rejects negative quantity', () => {
    const result = orderItemSchema.safeParse({
      id: 'clx1234567890abcdefg',
      quantity: -1,
      price: 29.99,
      name: 'Test Product',
    })
    expect(result.success).toBe(false)
  })

  it('rejects negative price', () => {
    const result = orderItemSchema.safeParse({
      id: 'clx1234567890abcdefg',
      quantity: 1,
      price: -5,
      name: 'Test Product',
    })
    expect(result.success).toBe(false)
  })

  it('rejects empty name', () => {
    const result = orderItemSchema.safeParse({
      id: 'clx1234567890abcdefg',
      quantity: 1,
      price: 10,
      name: '',
    })
    expect(result.success).toBe(false)
  })

  it('rejects invalid cuid', () => {
    const result = orderItemSchema.safeParse({
      id: 'not-a-cuid',
      quantity: 1,
      price: 10,
      name: 'Test',
    })
    expect(result.success).toBe(false)
  })
})

describe('shippingDataSchema', () => {
  const validShipping = {
    email: 'max@example.de',
    firstName: 'Max',
    lastName: 'Mustermann',
    address: 'Musterstraße 1',
    zipCode: '10115',
    city: 'Berlin',
    country: 'Deutschland',
  }

  it('accepts valid German shipping data', () => {
    const result = shippingDataSchema.safeParse(validShipping)
    expect(result.success).toBe(true)
  })

  it('accepts optional phone', () => {
    const result = shippingDataSchema.safeParse({
      ...validShipping,
      phone: '+49 123 456789',
    })
    expect(result.success).toBe(true)
  })

  it('accepts empty phone', () => {
    const result = shippingDataSchema.safeParse({
      ...validShipping,
      phone: '',
    })
    expect(result.success).toBe(true)
  })

  it('accepts Austrian 4-digit ZIP', () => {
    const result = shippingDataSchema.safeParse({
      ...validShipping,
      zipCode: '1010',
      city: 'Wien',
      country: 'Österreich',
    })
    expect(result.success).toBe(true)
  })

  it('accepts Swiss 4-digit ZIP', () => {
    const result = shippingDataSchema.safeParse({
      ...validShipping,
      zipCode: '8001',
      city: 'Zürich',
      country: 'Schweiz',
    })
    expect(result.success).toBe(true)
  })

  it('rejects 3-digit ZIP', () => {
    const result = shippingDataSchema.safeParse({
      ...validShipping,
      zipCode: '123',
    })
    expect(result.success).toBe(false)
  })

  it('rejects 6-digit ZIP', () => {
    const result = shippingDataSchema.safeParse({
      ...validShipping,
      zipCode: '123456',
    })
    expect(result.success).toBe(false)
  })

  it('rejects non-numeric ZIP', () => {
    const result = shippingDataSchema.safeParse({
      ...validShipping,
      zipCode: 'ABCDE',
    })
    expect(result.success).toBe(false)
  })

  it('rejects invalid email', () => {
    const result = shippingDataSchema.safeParse({
      ...validShipping,
      email: 'not-an-email',
    })
    expect(result.success).toBe(false)
  })

  it('rejects missing firstName', () => {
    const result = shippingDataSchema.safeParse({
      ...validShipping,
      firstName: '',
    })
    expect(result.success).toBe(false)
  })

  it('rejects missing city', () => {
    const result = shippingDataSchema.safeParse({
      ...validShipping,
      city: '',
    })
    expect(result.success).toBe(false)
  })
})

describe('createOrderSchema', () => {
  const validOrder = {
    items: [
      {
        id: 'clx1234567890abcdefg',
        quantity: 2,
        price: 99.99,
        name: 'Induktionskochfeld',
      },
    ],
    shippingData: {
      email: 'max@example.de',
      firstName: 'Max',
      lastName: 'Mustermann',
      address: 'Musterstraße 1',
      zipCode: '10115',
      city: 'Berlin',
      country: 'Deutschland',
    },
    paymentMethod: 'BANK_TRANSFER' as const,
    subtotal: 199.98,
    shipping: 9.99,
    total: 209.97,
  }

  it('accepts valid order', () => {
    const result = createOrderSchema.safeParse(validOrder)
    expect(result.success).toBe(true)
  })

  it('rejects empty items', () => {
    const result = createOrderSchema.safeParse({
      ...validOrder,
      items: [],
    })
    expect(result.success).toBe(false)
  })

  it('rejects invalid payment method', () => {
    const result = createOrderSchema.safeParse({
      ...validOrder,
      paymentMethod: 'PAYPAL',
    })
    expect(result.success).toBe(false)
  })

  it('rejects mismatched total (too low)', () => {
    const result = createOrderSchema.safeParse({
      ...validOrder,
      total: 100.0,
    })
    expect(result.success).toBe(false)
  })

  it('rejects mismatched total (too high)', () => {
    const result = createOrderSchema.safeParse({
      ...validOrder,
      total: 300.0,
    })
    expect(result.success).toBe(false)
  })

  it('accepts order with discount', () => {
    const result = createOrderSchema.safeParse({
      ...validOrder,
      discountAmount: 20,
      appliedPromoCode: 'SUMMER20',
      total: 189.97,
    })
    expect(result.success).toBe(true)
  })

  it('rejects negative subtotal', () => {
    const result = createOrderSchema.safeParse({
      ...validOrder,
      subtotal: -10,
      total: -0.01,
    })
    expect(result.success).toBe(false)
  })

  it('rejects negative shipping', () => {
    const result = createOrderSchema.safeParse({
      ...validOrder,
      shipping: -5,
      total: 194.98,
    })
    expect(result.success).toBe(false)
  })

  it('rejects negative total', () => {
    const result = createOrderSchema.safeParse({
      ...validOrder,
      total: -50,
    })
    expect(result.success).toBe(false)
  })

  it('defaults discountAmount to 0', () => {
    const result = createOrderSchema.safeParse({
      ...validOrder,
      discountAmount: undefined,
    })
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.discountAmount).toBe(0)
    }
  })
})
