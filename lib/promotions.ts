import { prisma } from './prisma'
import { DiscountType } from '@prisma/client'

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
 * Calcule le prix avec promotion pour un produit
 */
export function calculateDiscountedPrice(
  price: number,
  discountType: DiscountType,
  discountValue: number,
  maxDiscount?: number | null
): { discountedPrice: number; discountAmount: number } {
  let discountAmount = 0

  if (discountType === 'PERCENTAGE') {
    discountAmount = (price * discountValue) / 100
    if (maxDiscount && discountAmount > maxDiscount) {
      discountAmount = maxDiscount
    }
  } else {
    discountAmount = discountValue
  }

  // Ensure discount doesn't exceed price
  if (discountAmount > price) {
    discountAmount = price
  }

  const discountedPrice = Math.max(0, price - discountAmount)

  return {
    discountedPrice: Math.round(discountedPrice * 100) / 100,
    discountAmount: Math.round(discountAmount * 100) / 100
  }
}

/**
 * Récupère toutes les promotions actives valides
 */
export async function getActivePromotions() {
  const now = new Date()

  // Prisma ne supporte pas la comparaison inter-colonnes dans un `where` standard.
  // On récupère toutes les promos actives par date, puis on filtre le quota côté JS.
  const promotions = await prisma.promotion.findMany({
    where: {
      isActive: true,
      startDate: { lte: now },
      endDate: { gte: now },
    },
    orderBy: {
      discountValue: 'desc' // Prioritize bigger discounts
    }
  })

  // Exclure les promotions dont le quota d'utilisation est atteint
  return promotions.filter(
    p => p.usageLimit === null || p.usageCount < p.usageLimit
  )
}

/**
 * Applique la meilleure promotion disponible à un produit
 */
export async function applyBestPromotion(
  productId: string,
  categoryId: string,
  price: number
): Promise<ProductWithDiscount> {
  const promotions = await getActivePromotions()

  // Find applicable promotions for this product
  const applicablePromotions = promotions.filter(promo => {
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
      promotion: null
    }
  }

  // Get the best promotion (highest discount percentage)
  const bestPromotion = applicablePromotions[0]
  const { discountedPrice, discountAmount } = calculateDiscountedPrice(
    price,
    bestPromotion.discountType,
    Number(bestPromotion.discountValue),
    bestPromotion.maxDiscount ? Number(bestPromotion.maxDiscount) : null
  )

  const discountPercentage = Math.round((discountAmount / price) * 100)

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
      highlightColor: bestPromotion.highlightColor
    }
  }
}

/**
 * Applique les promotions à une liste de produits
 */
export async function applyPromotionsToProducts(
  products: Array<{ id: string; categoryId: string; price: number }>
): Promise<Map<string, ProductWithDiscount>> {
  const promotions = await getActivePromotions()
  const results = new Map<string, ProductWithDiscount>()

  for (const product of products) {
    // Find applicable promotions
    const applicablePromotions = promotions.filter(promo => {
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
        promotion: null
      })
      continue
    }

    const bestPromotion = applicablePromotions[0]
    const { discountedPrice, discountAmount } = calculateDiscountedPrice(
      product.price,
      bestPromotion.discountType,
      Number(bestPromotion.discountValue),
      bestPromotion.maxDiscount ? Number(bestPromotion.maxDiscount) : null
    )

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
        highlightColor: bestPromotion.highlightColor
      }
    })
  }

  return results
}

/**
 * Incrémente le compteur d'utilisation d'une promotion
 */
export async function incrementPromotionUsage(promotionId: string): Promise<void> {
  await prisma.promotion.update({
    where: { id: promotionId },
    data: {
      usageCount: {
        increment: 1
      }
    }
  })
}

/**
 * Valide un coupon de réduction
 */
export async function validateCoupon(
  code: string,
  cartTotal: number
): Promise<{ 
  isValid: boolean; 
  discountAmount: number; 
  error?: string; 
  promotionId?: string;
  name?: string;
}> {
  const now = new Date()
  
  const promotion = await prisma.promotion.findFirst({
    where: {
      code: { equals: code, mode: 'insensitive' },
      isActive: true,
      isCoupon: true,
      startDate: { lte: now },
      endDate: { gte: now },
    }
  })

  if (!promotion) {
    return { isValid: false, discountAmount: 0, error: 'Ungültiger oder abgelaufener Gutscheincode' }
  }

  // Check usage limit
  if (promotion.usageLimit !== null && promotion.usageCount >= promotion.usageLimit) {
    return { isValid: false, discountAmount: 0, error: 'Dieser Gutschein wurde bereits zu oft verwendet' }
  }

  // Check min order amount
  if (promotion.minOrderAmount && cartTotal < Number(promotion.minOrderAmount)) {
    return { 
      isValid: false, 
      discountAmount: 0, 
      error: `Mindestbestellwert für diesen Gutschein ist ${Number(promotion.minOrderAmount).toFixed(2)} €` 
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
    name: promotion.name
  }
}
