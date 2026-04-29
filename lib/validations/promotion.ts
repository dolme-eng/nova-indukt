import { z } from 'zod'
import { DiscountType } from '@prisma/client'

// Schéma de base sans refinements (pour permettre .partial())
const promotionBaseSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name too long'),
  code: z.string().min(3, 'Code must be at least 3 characters').max(20, 'Code too long').optional().nullable(),
  description: z.string().max(500, 'Description too long').optional().nullable(),
  discountType: z.nativeEnum(DiscountType),
  discountValue: z.number().positive('Discount value must be positive'),
  isGlobal: z.boolean().default(false),
  productIds: z.array(z.string().cuid()).default([]),
  categoryIds: z.array(z.string().cuid()).default([]),
  startDate: z.string().datetime().or(z.date()).transform(val => new Date(val)),
  endDate: z.string().datetime().or(z.date()).transform(val => new Date(val)),
  minOrderAmount: z.number().positive().optional().nullable(),
  maxDiscount: z.number().positive().optional().nullable(),
  usageLimit: z.number().int().positive().optional().nullable(),
  badge: z.string().max(50).optional().nullable(),
  bannerText: z.string().max(200).optional().nullable(),
  highlightColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Invalid hex color').optional().nullable(),
})

// Schéma de validation pour la création d'une promotion (avec refinements)
export const createPromotionSchema = promotionBaseSchema.refine(data => {
  // Si c'est un pourcentage, la valeur ne doit pas dépasser 100
  if (data.discountType === 'PERCENTAGE' && data.discountValue > 100) {
    return false
  }
  return true
}, {
  message: 'Percentage discount cannot exceed 100%',
  path: ['discountValue']
}).refine(data => {
  // La date de fin doit être après la date de début
  return data.endDate > data.startDate
}, {
  message: 'End date must be after start date',
  path: ['endDate']
})

export type CreatePromotionInput = z.infer<typeof createPromotionSchema>

// Schéma pour la mise à jour d'une promotion (sans refinements pour permettre partial)
export const updatePromotionSchema = promotionBaseSchema.partial().extend({
  id: z.string().cuid(),
})

export type UpdatePromotionInput = z.infer<typeof updatePromotionSchema>

// Schéma pour la validation des query params GET
export const getPromotionsQuerySchema = z.object({
  productId: z.string().cuid().optional(),
  categoryId: z.string().cuid().optional(),
  includeExpired: z.enum(['true', 'false']).optional().default('false'),
})

export type GetPromotionsQuery = z.infer<typeof getPromotionsQuerySchema>
