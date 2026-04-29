import { z } from 'zod'

// Schéma pour la création d'un avis
export const createReviewSchema = z.object({
  productId: z.string().cuid('Invalid product ID'),
  rating: z.number().int().min(1, 'Rating must be at least 1').max(5, 'Rating must be at most 5'),
  title: z.string().min(1, 'Title is required').max(200, 'Title too long'),
  content: z.string().min(10, 'Content must be at least 10 characters').max(5000, 'Content too long'),
  pros: z.string().max(500, 'Pros too long').optional().nullable(),
  cons: z.string().max(500, 'Cons too long').optional().nullable(),
  wouldRecommend: z.boolean().optional(),
})

// Schéma pour la mise à jour du statut d'un avis (admin)
export const updateReviewStatusSchema = z.object({
  id: z.string().cuid('Invalid review ID'),
  isApproved: z.boolean(),
  isFeatured: z.boolean().optional(),
})

export type CreateReviewInput = z.infer<typeof createReviewSchema>
export type UpdateReviewStatusInput = z.infer<typeof updateReviewStatusSchema>
