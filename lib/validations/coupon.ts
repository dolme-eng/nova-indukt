import { z } from 'zod'

// Schéma pour la validation d'un coupon
export const validateCouponSchema = z.object({
  code: z.string().min(1, 'Coupon code is required').max(50, 'Coupon code too long'),
  cartTotal: z.number().nonnegative('Cart total cannot be negative').optional(),
  productIds: z.array(z.string().cuid()).optional(),
  categoryIds: z.array(z.string().cuid()).optional(),
})

export type ValidateCouponInput = z.infer<typeof validateCouponSchema>
