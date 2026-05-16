/**
 * Pricing utilities — uses the unified VAT module for all tax calculations.
 *
 * Convention : tous les prix sont TTC (B2C allemand).
 */

import { vatFromGross, VAT_RATE_PERCENT } from '../utils/vat'

export interface PricingItem {
  price: number | string
  quantity: number
}

/**
 * Calculate order totals from a list of TTC-priced items.
 *
 * - `subtotal` = sum of (unitPrice × quantity) — already TTC
 * - `tax`      = TVA extraite du subtotal TTC (correct: subtotal − subtotal/1.19)
 * - `total`    = subtotal + shipping (TVA is already included in subtotal)
 */
export function calculateOrderTotals(
  items: PricingItem[], 
  shippingCost: number | string = 0,
  overrideTotal?: number | string | null,
  overrideSubtotal?: number | string | null
) {
  const calculatedSubtotal = items.reduce(
    (sum, item) => sum + (Number(item.price) * item.quantity), 
    0
  )
  
  const subtotal = overrideSubtotal ? Number(overrideSubtotal) : calculatedSubtotal
  const shipping = Number(shippingCost) || 0

  // TVA extraite du montant TTC TOTAL (subtotal + shipping)
  const tax = vatFromGross(subtotal + shipping, VAT_RATE_PERCENT)

  // Le total est subtotal + shipping
  const total = overrideTotal ? Number(overrideTotal) : subtotal + shipping

  return {
    subtotal,
    shipping,
    tax,
    total
  }
}
