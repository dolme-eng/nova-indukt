import { prisma } from './prisma'
import { DiscountType } from '@prisma/client'
import { unstable_cache } from 'next/cache'

export interface AppliedPromotion {
  id: string
  name: string
  discountType: DiscountType
  discountValue: number
  badge: string | null
  bannerText: string | null
  highlightColor: string | null
}

export interface ProductWithDiscount {
  originalPrice: number
  discountedPrice: number
  discountAmount: number
  discountPercentage: number
  promotion: AppliedPromotion | null
}

/**
 * Calculate the discounted price for a product
 */
export function calculateDiscountedPrice(
  price: number,
  discountType: DiscountType,
  discountValue: number,
  maxDiscount?: number | null
): { discountedPrice: number; discountAmount: number } {
  // A negative discount is a configuration mistake (the admin schemas only
  // bound the upper bound). Left unhandled it made the customer pay MORE than
  // the list price, e.g. -50% on 110 € produced 165 €.
  const safePrice = Math.max(0, price)
  const safeValue = Math.max(0, discountValue)

  let discountAmount = 0

  if (discountType === 'PERCENTAGE') {
    discountAmount = (safePrice * Math.min(100, safeValue)) / 100
    if (maxDiscount && maxDiscount > 0 && discountAmount > maxDiscount) {
      discountAmount = maxDiscount
    }
  } else {
    discountAmount = safeValue
  }

  // Ensure discount doesn't exceed price
  if (discountAmount > safePrice) {
    discountAmount = safePrice
  }

  const discountedPrice = Math.max(0, safePrice - discountAmount)

  return {
    discountedPrice: Math.round(discountedPrice * 100) / 100,
    discountAmount: Math.round(discountAmount * 100) / 100,
  }
}

/** Minimal shape needed to rank candidate promotions. */
type RankablePromotion = {
  id: string
  discountType: DiscountType
  discountValue: unknown
  maxDiscount?: unknown
}

/**
 * Pick the promotion that actually saves the customer the most money for a
 * given price.
 *
 * Sorting by `discountValue` (as the query does) is wrong: it compares a
 * percentage against a fixed amount as if they were the same unit. A
 * FIXED_AMOUNT 50 lost against a PERCENTAGE 20 on a 500 € product (100 € off),
 * so the customer was shown a worse deal than the one on their own cart.
 */
export function pickBestPromotion<T extends RankablePromotion>(
  candidates: T[],
  price: number
): { best: T; discountedPrice: number; discountAmount: number } | null {
  let best: { best: T; discountedPrice: number; discountAmount: number } | null = null

  for (const promo of candidates) {
    const { discountedPrice, discountAmount } = calculateDiscountedPrice(
      price,
      promo.discountType,
      Number(promo.discountValue),
      promo.maxDiscount != null ? Number(promo.maxDiscount) : null
    )

    // Strict `>` keeps the first candidate on a tie, so the result stays stable
    // relative to the query order.
    if (!best || discountAmount > best.discountAmount) {
      best = { best: promo, discountedPrice, discountAmount }
    }
  }

  return best
}

/**
 * Récupère toutes les promotions actives valides (cached 60s)
 */
export const getActivePromotions = unstable_cache(
  async () => {
    const now = new Date()

    const promotions = await prisma.promotion.findMany({
      where: {
        isActive: true,
        startDate: { lte: now },
        endDate: { gte: now },
      },
      orderBy: {
        discountValue: 'desc',
      },
    })

    return promotions.filter((p) => p.usageLimit === null || p.usageCount < p.usageLimit)
  },
  ['active-promotions'],
  { revalidate: 60, tags: ['promotions'] }
)

/**
 * Apply the best available promotion to a product
 */
export async function applyBestPromotion(
  productId: string,
  categoryId: string,
  price: number
): Promise<ProductWithDiscount> {
  const promotions = await getActivePromotions()

  // Find applicable promotions for this product
  const applicablePromotions = promotions.filter((promo) => {
    // Global promotion applies to all
    if (promo.isGlobal) return true

    // Check if product is directly included
    if (promo.productIds.includes(productId)) return true

    // Check if category is included
    if (promo.categoryIds.includes(categoryId)) return true

    return false
  })

  if (applicablePromotions.length === 0) {
    return {
      originalPrice: price,
      discountedPrice: price,
      discountAmount: 0,
      discountPercentage: 0,
      promotion: null,
    }
  }

  // Rank by the money actually saved, not by the raw `discountValue` column.
  const winner = pickBestPromotion(applicablePromotions, price)
  /* istanbul ignore next — guarded by the early return above */
  if (!winner) throw new Error('unreachable: applicablePromotions is non-empty')

  const bestPromotion = winner.best
  const { discountedPrice, discountAmount } = winner

  const discountPercentage = price > 0 ? Math.round((discountAmount / price) * 100) : 0

  return {
    originalPrice: price,
    discountedPrice,
    discountAmount,
    discountPercentage,
    promotion: {
      id: bestPromotion.id,
      name: bestPromotion.name,
      discountType: bestPromotion.discountType,
      discountValue: Number(bestPromotion.discountValue),
      badge: bestPromotion.badge,
      bannerText: bestPromotion.bannerText,
      highlightColor: bestPromotion.highlightColor,
    },
  }
}

/**
 * Apply promotions to a list of products
 */
export async function applyPromotionsToProducts(
  products: Array<{ id: string; categoryId: string; price: number }>
): Promise<Map<string, ProductWithDiscount>> {
  const promotions = await getActivePromotions()
  const results = new Map<string, ProductWithDiscount>()

  for (const product of products) {
    // Find applicable promotions
    const applicablePromotions = promotions.filter((promo) => {
      if (promo.isGlobal) return true
      if (promo.productIds.includes(product.id)) return true
      if (promo.categoryIds.includes(product.categoryId)) return true
      return false
    })

    if (applicablePromotions.length === 0) {
      results.set(product.id, {
        originalPrice: product.price,
        discountedPrice: product.price,
        discountAmount: 0,
        discountPercentage: 0,
        promotion: null,
      })
      continue
    }

    // Rank by the money actually saved for THIS product price: a fixed amount
    // and a percentage are not comparable as raw numbers.
    const winner = pickBestPromotion(applicablePromotions, product.price)
    /* istanbul ignore next — guarded by the early return above */
    if (!winner) continue

    const bestPromotion = winner.best
    const { discountedPrice, discountAmount } = winner

    results.set(product.id, {
      originalPrice: product.price,
      discountedPrice,
      discountAmount,
      discountPercentage: Math.round((discountAmount / product.price) * 100),
      promotion: {
        id: bestPromotion.id,
        name: bestPromotion.name,
        discountType: bestPromotion.discountType,
        discountValue: Number(bestPromotion.discountValue),
        badge: bestPromotion.badge,
        bannerText: bestPromotion.bannerText,
        highlightColor: bestPromotion.highlightColor,
      },
    })
  }

  return results
}

/**
 * Incrémente le compteur d'utilisation d'une promotion.
 * Single statement (atomic): the read-then-write race that could exceed
 * usageLimit is impossible — the limit is enforced in the WHERE clause.
 * Returns false when the promotion is missing or its limit is reached.
 */
export async function incrementPromotionUsage(promotionId: string): Promise<boolean> {
  const result = await prisma.$executeRaw`
    UPDATE "Promotion"
    SET "usageCount" = "usageCount" + 1, "updatedAt" = NOW()
    WHERE "id" = ${promotionId}
      AND ("usageLimit" IS NULL OR "usageCount" < "usageLimit")
  `
  return Number(result) === 1
}

/**
 * Valide un coupon de réduction
 */
export async function validateCoupon(
  code: string,
  cartTotal: number,
  cartItems?: Array<{ productId: string; categoryId?: string }>
): Promise<{
  isValid: boolean
  discountAmount: number
  error?: string
  promotionId?: string
  name?: string
}> {
  const now = new Date()

  const promotion = await prisma.promotion.findFirst({
    where: {
      code: { equals: code, mode: 'insensitive' },
      isActive: true,
      isCoupon: true,
      startDate: { lte: now },
      endDate: { gte: now },
    },
  })

  if (!promotion) {
    return {
      isValid: false,
      discountAmount: 0,
      error: 'Ungültiger oder abgelaufener Gutscheincode',
    }
  }

  // Check usage limit
  if (promotion.usageLimit !== null && promotion.usageCount >= promotion.usageLimit) {
    return {
      isValid: false,
      discountAmount: 0,
      error: 'Dieser Gutschein wurde bereits zu oft verwendet',
    }
  }

  // Check min order amount
  if (promotion.minOrderAmount && cartTotal < Number(promotion.minOrderAmount)) {
    return {
      isValid: false,
      discountAmount: 0,
      error: `Mindestbestellwert für diesen Gutschein ist ${Number(promotion.minOrderAmount).toFixed(2)} €`,
    }
  }

  // Check product restrictions
  if (cartItems && promotion.productIds.length > 0) {
    const hasMatchingProduct = cartItems.some((item) => promotion.productIds.includes(item.productId))
    if (!hasMatchingProduct) {
      return {
        isValid: false,
        discountAmount: 0,
        error: 'Dieser Gutschein gilt nur für bestimmte Produkte',
      }
    }
  }

  // Check category restrictions
  if (cartItems && promotion.categoryIds.length > 0) {
    const hasMatchingCategory = cartItems.some(
      (item) => item.categoryId && promotion.categoryIds.includes(item.categoryId)
    )
    if (!hasMatchingCategory) {
      return {
        isValid: false,
        discountAmount: 0,
        error: 'Dieser Gutschein gilt nur für bestimmte Kategorien',
      }
    }
  }

  // Calculate discount
  const { discountAmount } = calculateDiscountedPrice(
    cartTotal,
    promotion.discountType,
    Number(promotion.discountValue),
    promotion.maxDiscount ? Number(promotion.maxDiscount) : null
  )

  return {
    isValid: true,
    discountAmount,
    promotionId: promotion.id,
    name: promotion.name,
  }
}
