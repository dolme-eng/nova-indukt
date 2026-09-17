import { z } from 'zod'

// ── Blog ────────────────────────────────────────────────────────────────────

export const createBlogPostSchema = z.object({
  titleDe: z.string().min(1, 'Titel ist erforderlich').max(200),
  slug: z.string().min(1, 'Slug ist erforderlich').max(200).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug muss gültig sein'),
  excerptDe: z.string().max(500).optional().nullable(),
  contentDe: z.string().min(1, 'Inhalt ist erforderlich').max(100000, 'Inhalt ist zu lang'),
  image: z.string().url().optional().nullable(),
  category: z.string().max(100).optional().nullable(),
  author: z.string().max(100).optional().nullable(),
  readTime: z.string().max(20).optional().nullable(),
  isPublished: z.boolean().default(false),
})

export const updateBlogPostSchema = createBlogPostSchema.partial()

// ── Promotions ──────────────────────────────────────────────────────────────

// Base object WITHOUT refinements (Zod v4 throws on .partial() of refined schemas)
const promotionAdminBaseSchema = z.object({
  name: z.string().min(1, 'Name ist erforderlich').max(200),
  description: z.string().max(1000).optional().nullable(),
  code: z.string().min(1, 'Code ist erforderlich').max(50).optional().nullable(),
  isCoupon: z.boolean().default(false),
  discountType: z.enum(['PERCENTAGE', 'FIXED_AMOUNT']),
  discountValue: z.number().positive('Rabattwert muss positiv sein').max(999999.99, 'Rabattwert ist zu hoch'),
  isGlobal: z.boolean().default(false),
  productIds: z.array(z.string().cuid()).max(100).default([]),
  categoryIds: z.array(z.string().cuid()).max(50).default([]),
  startDate: z.string().datetime().or(z.date()),
  endDate: z.string().datetime().or(z.date()),
  minOrderAmount: z.number().nonnegative().max(999999.99).optional().nullable(),
  maxDiscount: z.number().positive().max(999999.99).optional().nullable(),
  usageLimit: z.number().int().positive().max(1000000).optional().nullable(),
  badge: z.string().max(50).optional().nullable(),
  bannerText: z.string().max(200).optional().nullable(),
  highlightColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Invalid hex color').optional().nullable(),
  isActive: z.boolean().default(true),
})

export const createPromotionAdminSchema = promotionAdminBaseSchema.refine(data => {
  if (data.discountType === 'PERCENTAGE' && data.discountValue > 100) return false
  return true
}, { message: 'Percentage discount cannot exceed 100%', path: ['discountValue'] }).refine(data => {
  return new Date(data.endDate) > new Date(data.startDate)
}, { message: 'End date must be after start date', path: ['endDate'] })

// Partial variant: same rules, but each refine only applies when the fields
// it checks are actually present in the PATCH payload.
export const updatePromotionAdminSchema = promotionAdminBaseSchema.partial().refine(data => {
  if (data.discountType === 'PERCENTAGE' && data.discountValue !== undefined && data.discountValue > 100) return false
  return true
}, { message: 'Percentage discount cannot exceed 100%', path: ['discountValue'] }).refine(data => {
  if (data.endDate === undefined || data.startDate === undefined) return true
  return new Date(data.endDate) > new Date(data.startDate)
}, { message: 'End date must be after start date', path: ['endDate'] })

export const autoGeneratePromotionSchema = z.object({
  type: z.enum(['flash', 'weekend', 'clearance', 'new-arrival']),
  discountPercent: z.number().int().min(1, 'Mindestens 1%').max(90, 'Maximal 90%'),
  durationDays: z.number().int().min(1, 'Mindestens 1 Tag').max(30, 'Maximal 30 Tage'),
  categoryIds: z.array(z.string().cuid()).max(50).optional().default([]),
  productCount: z.number().int().min(1).max(100).optional().default(10),
})

// ── Products (PATCH) ────────────────────────────────────────────────────────

export const updateProductSchema = z.object({
  nameDe: z.string().min(1, 'Name ist erforderlich').max(200),
  slug: z.string().min(1, 'Slug ist erforderlich').max(200).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  ean: z.string().max(20).optional().nullable(),
  descriptionDe: z.string().max(5000, 'Beschreibung ist zu lang').optional().nullable(),
  shortDescription: z.string().max(500).optional().nullable(),
  price: z.number().positive('Preis muss positiv sein').max(99999.99, 'Preis darf 99.999,99 € nicht überschreiten'),
  oldPrice: z.number().positive().max(99999.99).optional().nullable(),
  costPrice: z.number().nonnegative().max(99999.99).optional().nullable(),
  categoryId: z.string().cuid('Invalid category ID'),
  isActive: z.boolean().default(true),
  weightKg: z.number().nonnegative().optional().nullable(),
  brand: z.string().max(100).optional().nullable(),
  material: z.string().max(100).optional().nullable(),
  dimensions: z.string().max(100).optional().nullable(),
  dishwasherSafe: z.boolean().optional().nullable(),
  inductionSafe: z.boolean().optional().nullable(),
  images: z.array(z.object({
    url: z.string().url(),
    alt: z.string().max(200).optional(),
  })).max(20).optional(),
})

// ── Orders (Shipping) ──────────────────────────────────────────────────────

export const updateOrderShippingSchema = z.object({
  status: z.enum(['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'REFUNDED']).optional(),
  trackingNumber: z.string().max(100).optional().nullable(),
  carrier: z.string().max(50).optional(),
  trackingUrl: z.string().url().optional().nullable(),
  sendEmail: z.boolean().default(false),
})

// ── Marketing Reviews ──────────────────────────────────────────────────────

export const toggleReviewPublishSchema = z.object({
  id: z.string().min(1, 'Review ID ist erforderlich'),
  action: z.literal('toggle-publish'),
  isPublished: z.boolean(),
})

export const toggleReviewVerifySchema = z.object({
  id: z.string().min(1, 'Review ID ist erforderlich'),
  action: z.literal('toggle-verify'),
  isVerified: z.boolean(),
})

export const marketingReviewSchema = z.discriminatedUnion('action', [
  toggleReviewPublishSchema,
  toggleReviewVerifySchema,
])

// ── Static Pages ───────────────────────────────────────────────────────────

export const createStaticPageSchema = z.object({
  slug: z.string().min(1, 'Slug ist erforderlich').max(200).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  title: z.string().min(1, 'Titel ist erforderlich').max(200),
  content: z.string().min(1, 'Inhalt ist erforderlich').max(100000, 'Inhalt ist zu lang'),
  isActive: z.boolean().default(true),
})

export const updateStaticPageSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  content: z.string().min(1).max(100000).optional(),
  isActive: z.boolean().optional(),
})

// ── FAQ ─────────────────────────────────────────────────────────────────────

export const createFaqSchema = z.object({
  question: z.string().min(1, 'Frage ist erforderlich').max(500),
  answer: z.string().min(1, 'Antwort ist erforderlich').max(5000),
  category: z.string().max(100).default('support'),
  sortOrder: z.number().int().default(0),
  isActive: z.boolean().default(true),
})

export const updateFaqSchema = z.object({
  question: z.string().min(1).max(500).optional(),
  answer: z.string().min(1).max(5000).optional(),
  category: z.string().max(100).optional(),
  sortOrder: z.number().int().optional(),
  isActive: z.boolean().optional(),
})

// ── Settings ───────────────────────────────────────────────────────────────

export const updateSettingsSchema = z.record(z.string(), z.unknown())
