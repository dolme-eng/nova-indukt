import { z } from 'zod'

// Schema for a product image
export const productImageSchema = z.object({
  url: z.string().url('Invalid image URL').min(1, 'Image URL is required'),
  alt: z.string().max(200, 'Alt text too long').optional(),
})

// Schema for creating a product
export const createProductSchema = z.object({
  nameDe: z.string().min(1, 'German name is required').max(200, 'Name too long'),
  slug: z.string().min(1, 'Slug is required').max(100, 'Slug too long')
    .regex(/^[a-z0-9-]+$/, 'Slug must contain only lowercase letters, numbers, and hyphens'),
  ean: z.string().max(13, 'EAN must be 13 characters').optional().nullable(),
  descriptionDe: z.string().max(5000, 'Description too long').optional().nullable(),
  shortDescription: z.string().max(500, 'Short description too long').optional().nullable(),
  price: z.number().positive('Price must be positive'),
  oldPrice: z.number().positive('Old price must be positive').optional().nullable(),
  costPrice: z.number().nonnegative('Cost price cannot be negative').optional().nullable(),
  categoryId: z.string().cuid('Invalid category ID'),
  isActive: z.boolean().default(true),
  weightKg: z.number().nonnegative().optional().nullable(),
  brand: z.string().max(100, 'Brand name too long').optional().nullable(),
  material: z.string().max(200, 'Material too long').optional().nullable(),
  dimensions: z.string().max(100, 'Dimensions too long').optional().nullable(),
  dishwasherSafe: z.boolean().default(false),
  inductionSafe: z.boolean().default(false),
  images: z.array(productImageSchema).min(1, 'At least one image is required'),
})

export type CreateProductInput = z.infer<typeof createProductSchema>
export type ProductImageInput = z.infer<typeof productImageSchema>

// Schema for updating a product
export const updateProductSchema = createProductSchema.partial().extend({
  id: z.string().cuid('Invalid product ID'),
})

export type UpdateProductInput = z.infer<typeof updateProductSchema>
