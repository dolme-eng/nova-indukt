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
// NOTE: no FROM_EMAIL/FROM_NAME here — single source is lib/email/resend.ts
// (env-driven). Use those imports instead.

/**
 * Returns the shipping cost based on the subtotal.
 *
 * Business rule: pass the DISCOUNTED subtotal (after coupon/promo).
 * Free shipping from 500 € net of discounts — no stacking of coupon
 * discount with a threshold computed on the gross amount.
 */
export function calculateShipping(subtotal: number): number {
  return subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST
}
