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

// ─── Bank details ─────────────────────────────────────────────────────────────
// Bank details are now managed via Admin → Einstellungen → Zahlungsdaten.
// The static BANK_DETAILS constant is kept for backward compatibility but
// consumers should prefer getBankDetails() / getBankDetailsSync() from
// lib/data/bank-details.ts which reads from AppConfig with env var fallback.
export const BANK_DETAILS = {
  holder:   process.env.NEXT_PUBLIC_BANK_HOLDER  ?? COMPANY.name,
  iban:     process.env.NEXT_PUBLIC_BANK_IBAN    ?? 'DE00 0000 0000 0000 0000 00',
  bic:      process.env.NEXT_PUBLIC_BANK_BIC     ?? 'XXXXXXXXXXXXXXX',
  bankName: process.env.NEXT_PUBLIC_BANK_NAME    ?? 'Bank nicht konfiguriert',
}

/**
 * Returns the shipping cost based on the subtotal.
 */
export function calculateShipping(subtotal: number): number {
  return subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST
}
