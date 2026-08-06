/**
 * Shop configuration constants.
 * Centralized values for shipping, taxes, and other business rules.
 */

import { COMPANY } from './company'

export const SHIPPING_COST = 9.99
export const FREE_SHIPPING_THRESHOLD = 500

export const SHOP_NAME = COMPANY.nameShort
/** Canonical domain without trailing slash, used in schema.org, metadata and emails. */
export const SHOP_DOMAIN = COMPANY.website

// ─── Contact emails (centralized in COMPANY) ──────────────────────────────────
export const SUPPORT_EMAIL    = COMPANY.email.support
export const INFO_EMAIL       = COMPANY.email.info
export const DATENSCHUTZ_EMAIL = COMPANY.email.datenschutz
export const WIDERRUF_EMAIL   = COMPANY.email.widerruf
export const NEWSLETTER_EMAIL = COMPANY.email.newsletter
export const FROM_EMAIL       = COMPANY.email.noreply
export const FROM_NAME        = COMPANY.nameShort

/**
 * Returns the shipping cost based on the subtotal.
 */
export function calculateShipping(subtotal: number): number {
  return subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST
}
