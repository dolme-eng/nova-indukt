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
 * - `discount` = coupon/promo reduction (TTC) — reduces taxable base
 * - `tax`      = TVA extraite du NET TTC (subtotal + shipping − discount)
 * - `total`    = subtotal + shipping − discount (TVA already included)
 */
export function calculateOrderTotals(
  items: PricingItem[],
  shippingCost: number | string = 0,
  overrideTotal?: number | string | null,
  overrideSubtotal?: number | string | null,
  discount?: number | string | null
) {
  const calculatedSubtotal = items.reduce(
    (sum, item) => sum + (Number(item.price) * item.quantity),
    0
  )

  const subtotal = overrideSubtotal ? Number(overrideSubtotal) : calculatedSubtotal
  const shipping = Number(shippingCost) || 0
  const discountAmount = Math.max(0, Number(discount) || 0)

  const netBase = Math.max(0, subtotal + shipping - discountAmount)

  // TVA extraite du montant TTC NET (subtotal + shipping − discount)
  const tax = vatFromGross(netBase, VAT_RATE_PERCENT)

  // Le total est subtotal + shipping − discount
  const total = overrideTotal ? Number(overrideTotal) : netBase

  return {
    subtotal,
    shipping,
    discount: discountAmount,
    tax,
    total
  }
}
