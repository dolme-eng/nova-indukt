import { describe, it, expect } from 'vitest'
import { createPromotionAdminSchema, updatePromotionAdminSchema } from '@/lib/validations/admin'

describe('tmp promotion admin schemas', () => {
  it('create accepts valid payload', () => {
    const start = new Date().toISOString()
    const end = new Date(Date.now() + 86400000).toISOString()
    const r = createPromotionAdminSchema.safeParse({
      name: 'x', discountType: 'PERCENTAGE', discountValue: 10, startDate: start, endDate: end,
    })
    expect(r.success).toBe(true)
  })

  it('partial accepts sparse PATCH payload', () => {
    expect(updatePromotionAdminSchema.safeParse({ discountValue: 50 }).success).toBe(true)
  })

  it('partial still rejects 150% percentage', () => {
    const r = updatePromotionAdminSchema.safeParse({ discountType: 'PERCENTAGE', discountValue: 150 })
    expect(r.success).toBe(false)
  })

  it('partial rejects endDate before startDate when both present', () => {
    const now = new Date().toISOString()
    const past = new Date(Date.now() - 86400000).toISOString()
    const r = updatePromotionAdminSchema.safeParse({ startDate: now, endDate: past })
    expect(r.success).toBe(false)
  })
})
