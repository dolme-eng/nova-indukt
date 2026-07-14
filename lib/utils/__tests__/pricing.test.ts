import { describe, it, expect } from 'vitest'
import { calculateOrderTotals } from '../pricing'

describe('calculateOrderTotals', () => {
  it('calculates totals for single item, no shipping', () => {
    const result = calculateOrderTotals([{ price: 119, quantity: 1 }])
    expect(result.subtotal).toBe(119)
    expect(result.shipping).toBe(0)
    expect(result.tax).toBe(19)
    expect(result.total).toBe(119)
  })

  it('calculates totals for multiple items', () => {
    const result = calculateOrderTotals([
      { price: 119, quantity: 2 },
      { price: 59.50, quantity: 1 },
    ])
    expect(result.subtotal).toBe(297.50)
    expect(result.tax).toBe(47.50)
  })

  it('adds shipping to total', () => {
    const result = calculateOrderTotals(
      [{ price: 100, quantity: 1 }],
      9.99
    )
    expect(result.shipping).toBe(9.99)
    expect(result.total).toBe(109.99)
    // tax = vatFromGross(109.99) = 17.56 (TVA extracted from TTC total incl. shipping)
    expect(result.tax).toBe(17.56)
  })

  it('uses overrideTotal when provided', () => {
    const result = calculateOrderTotals(
      [{ price: 100, quantity: 1 }],
      0,
      95
    )
    expect(result.total).toBe(95)
  })

  it('uses overrideSubtotal when provided', () => {
    const result = calculateOrderTotals(
      [{ price: 100, quantity: 1 }],
      0,
      null,
      200
    )
    expect(result.subtotal).toBe(200)
    expect(result.total).toBe(200)
  })

  it('handles empty items', () => {
    const result = calculateOrderTotals([])
    expect(result.subtotal).toBe(0)
    expect(result.total).toBe(0)
    expect(result.tax).toBe(0)
  })

  it('handles string prices', () => {
    const result = calculateOrderTotals([{ price: "119", quantity: 1 }])
    expect(result.subtotal).toBe(119)
  })

  it('handles string shipping cost', () => {
    const result = calculateOrderTotals(
      [{ price: 100, quantity: 1 }],
      "9.99"
    )
    expect(result.shipping).toBe(9.99)
  })

  it('tax is correctly extracted from TTC total (subtotal + shipping)', () => {
    const result = calculateOrderTotals(
      [{ price: 100, quantity: 1 }],
      9.99
    )
    // tax = vatFromGross(109.99) = 109.99 - netFromGross(109.99)
    // netFromGross(109.99) = 109.99 / 1.19 = 92.43
    // tax = 109.99 - 92.43 = 17.56
    expect(result.tax).toBe(17.56)
  })
})
