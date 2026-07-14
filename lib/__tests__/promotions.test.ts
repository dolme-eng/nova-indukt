import { describe, it, expect } from 'vitest'
import { calculateDiscountedPrice } from '../promotions'
import type { DiscountType } from '@prisma/client'

describe('calculateDiscountedPrice', () => {
  describe('PERCENTAGE discount', () => {
    it('applies 10% discount on 100 → 90', () => {
      const result = calculateDiscountedPrice(100, 'PERCENTAGE', 10)
      expect(result.discountedPrice).toBe(90)
      expect(result.discountAmount).toBe(10)
    })

    it('applies 20% discount on 119 → 95.20', () => {
      const result = calculateDiscountedPrice(119, 'PERCENTAGE', 20)
      expect(result.discountedPrice).toBe(95.20)
      expect(result.discountAmount).toBe(23.80)
    })

    it('applies 50% discount on 200 → 100', () => {
      const result = calculateDiscountedPrice(200, 'PERCENTAGE', 50)
      expect(result.discountedPrice).toBe(100)
      expect(result.discountAmount).toBe(100)
    })

    it('caps discount at maxDiscount', () => {
      const result = calculateDiscountedPrice(200, 'PERCENTAGE', 50, 50)
      expect(result.discountAmount).toBe(50)
      expect(result.discountedPrice).toBe(150)
    })

    it('does not exceed price', () => {
      const result = calculateDiscountedPrice(50, 'PERCENTAGE', 200)
      expect(result.discountAmount).toBe(50)
      expect(result.discountedPrice).toBe(0)
    })
  })

  describe('FIXED_AMOUNT discount', () => {
    it('subtracts fixed 10 from 100 → 90', () => {
      const result = calculateDiscountedPrice(100, 'FIXED_AMOUNT', 10)
      expect(result.discountedPrice).toBe(90)
      expect(result.discountAmount).toBe(10)
    })

    it('subtracts fixed 25 from 119 → 94', () => {
      const result = calculateDiscountedPrice(119, 'FIXED_AMOUNT', 25)
      expect(result.discountedPrice).toBe(94)
      expect(result.discountAmount).toBe(25)
    })

    it('does not exceed price', () => {
      const result = calculateDiscountedPrice(30, 'FIXED_AMOUNT', 50)
      expect(result.discountAmount).toBe(30)
      expect(result.discountedPrice).toBe(0)
    })
  })

  describe('edge cases', () => {
    it('handles zero price', () => {
      const result = calculateDiscountedPrice(0, 'PERCENTAGE', 10)
      expect(result.discountedPrice).toBe(0)
      expect(result.discountAmount).toBe(0)
    })

    it('handles zero discount', () => {
      const result = calculateDiscountedPrice(100, 'PERCENTAGE', 0)
      expect(result.discountedPrice).toBe(100)
      expect(result.discountAmount).toBe(0)
    })

    it('rounds results correctly', () => {
      const result = calculateDiscountedPrice(99.99, 'PERCENTAGE', 15)
      expect(result.discountedPrice).toBe(84.99)
      expect(result.discountAmount).toBe(15)
    })
  })
})
