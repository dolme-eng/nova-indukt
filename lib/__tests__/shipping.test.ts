import { describe, it, expect } from 'vitest'
import { calculateShipping, SHIPPING_COST, FREE_SHIPPING_THRESHOLD } from '@/lib/constants/shop'

describe('calculateShipping', () => {
  it('charges shipping below threshold', () => {
    expect(calculateShipping(0)).toBe(SHIPPING_COST)
    expect(calculateShipping(100)).toBe(SHIPPING_COST)
    expect(calculateShipping(499.99)).toBe(SHIPPING_COST)
  })

  it('gives free shipping at threshold', () => {
    expect(calculateShipping(500)).toBe(0)
    expect(calculateShipping(500.01)).toBe(0)
    expect(calculateShipping(1000)).toBe(0)
  })

  it('charges shipping for negative values', () => {
    expect(calculateShipping(-10)).toBe(SHIPPING_COST)
  })
})

describe('shipping constants', () => {
  it('has valid shipping cost', () => {
    expect(SHIPPING_COST).toBeGreaterThan(0)
  })

  it('has valid free shipping threshold', () => {
    expect(FREE_SHIPPING_THRESHOLD).toBeGreaterThan(SHIPPING_COST)
  })
})
