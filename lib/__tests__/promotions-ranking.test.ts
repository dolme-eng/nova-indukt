import { describe, it, expect } from 'vitest'
import { calculateDiscountedPrice, pickBestPromotion } from '@/lib/promotions'

/**
 * `calculateDiscountedPrice` used to let a negative discountValue *increase* the
 * price (-50% on 110 € produced 165 €). The admin schemas only bound the upper
 * value, so a mis-typed promotion charged customers more than the list price.
 */
describe('calculateDiscountedPrice — negative and oversized values', () => {
  it('treats a negative percentage as no discount', () => {
    const result = calculateDiscountedPrice(110, 'PERCENTAGE', -50)
    expect(result.discountAmount).toBe(0)
    expect(result.discountedPrice).toBe(110)
  })

  it('treats a negative fixed amount as no discount', () => {
    const result = calculateDiscountedPrice(110, 'FIXED_AMOUNT', -50)
    expect(result.discountAmount).toBe(0)
    expect(result.discountedPrice).toBe(110)
  })

  it('caps a percentage above 100', () => {
    const result = calculateDiscountedPrice(200, 'PERCENTAGE', 150)
    expect(result.discountAmount).toBe(200)
    expect(result.discountedPrice).toBe(0)
  })

  it('never returns a negative price for a huge fixed amount', () => {
    const result = calculateDiscountedPrice(50, 'FIXED_AMOUNT', 5000)
    expect(result.discountedPrice).toBe(0)
    expect(result.discountAmount).toBe(50)
  })

  it('ignores a negative maxDiscount cap', () => {
    // A null/0 cap means "no cap"; a negative one must not zero the discount.
    const result = calculateDiscountedPrice(100, 'PERCENTAGE', 20, -10)
    expect(result.discountAmount).toBe(20)
  })

  it('handles a negative price defensively', () => {
    const result = calculateDiscountedPrice(-100, 'PERCENTAGE', 10)
    expect(result.discountedPrice).toBe(0)
    expect(result.discountAmount).toBe(0)
  })

  it('still applies a legitimate maxDiscount', () => {
    const result = calculateDiscountedPrice(500, 'PERCENTAGE', 50, 100)
    expect(result.discountAmount).toBe(100)
    expect(result.discountedPrice).toBe(400)
  })
})

/**
 * The "best promotion" was picked by query order (`discountValue desc`), which
 * compares a percentage against a fixed amount as if they shared a unit. A
 * FIXED_AMOUNT 50 lost to a PERCENTAGE 20 on a 500 € product, i.e. the customer
 * was shown the worse deal.
 */
describe('pickBestPromotion', () => {
  const fixed = { id: 'fixed', discountType: 'FIXED_AMOUNT' as const, discountValue: 50 }
  const percent = { id: 'percent', discountType: 'PERCENTAGE' as const, discountValue: 20 }

  it('returns null for an empty candidate list', () => {
    expect(pickBestPromotion([], 100)).toBeNull()
  })

  it('prefers the larger effective discount regardless of type', () => {
    // 20% of 500 = 100 € > 50 € fixed, even though 50 > 20 as raw values.
    const winner = pickBestPromotion([percent, fixed], 500)
    expect(winner?.best.id).toBe('percent')
    expect(winner?.discountAmount).toBe(100)
  })

  it('prefers the fixed amount when it genuinely saves more', () => {
    // 10% of 100 = 10 € < 50 € fixed.
    const winner = pickBestPromotion([percent, fixed], 100)
    expect(winner?.best.id).toBe('fixed')
    expect(winner?.discountAmount).toBe(50)
  })

  it('is independent of the input order', () => {
    const a = pickBestPromotion([percent, fixed], 500)
    const b = pickBestPromotion([fixed, percent], 500)
    expect(a?.best.id).toBe(b?.best.id)
  })

  it('respects a maxDiscount cap when ranking', () => {
    const capped = {
      id: 'capped',
      discountType: 'PERCENTAGE' as const,
      discountValue: 50,
      maxDiscount: 20,
    }
    const winner = pickBestPromotion([capped, fixed], 1000)
    // capped: 20 € (capped) vs fixed 50 € → fixed wins
    expect(winner?.best.id).toBe('fixed')
  })

  it('keeps the first candidate on a tie (stable)', () => {
    const a = { id: 'a', discountType: 'PERCENTAGE' as const, discountValue: 10 }
    const b = { id: 'b', discountType: 'PERCENTAGE' as const, discountValue: 10 }
    expect(pickBestPromotion([a, b], 100)?.best.id).toBe('a')
  })

  it('ignores a negative-discount candidate', () => {
    const broken = { id: 'broken', discountType: 'FIXED_AMOUNT' as const, discountValue: -80 }
    const winner = pickBestPromotion([broken, percent], 200)
    expect(winner?.best.id).toBe('percent')
  })

  it('accepts Decimal-like values', () => {
    const decimal = { id: 'dec', discountType: 'PERCENTAGE' as const, discountValue: '25' }
    const winner = pickBestPromotion([decimal, fixed], 400)
    // 25% of 400 = 100 € > 50 €
    expect(winner?.best.id).toBe('dec')
  })

  it('returns a zero-discount result when every candidate is inert', () => {
    const winner = pickBestPromotion(
      [{ id: 'zero', discountType: 'PERCENTAGE' as const, discountValue: 0 }],
      100
    )
    expect(winner?.discountAmount).toBe(0)
    expect(winner?.discountedPrice).toBe(100)
  })
})
