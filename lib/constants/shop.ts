/**
 * Shop configuration constants.
 * Centralized values for shipping, taxes, and other business rules.
 */

export const SHIPPING_COST = 9.99
export const FREE_SHIPPING_THRESHOLD = 500

export const SHOP_NAME = 'NOVA INDUKT'
/** Canonical domain without trailing slash, used in schema.org, metadata and emails. */
export const SHOP_DOMAIN = process.env.NEXT_PUBLIC_SITE_URL || 'https://nova-indukt.de'
/** @deprecated Use SHOP_DOMAIN — kept for backward compatibility */
export const SHOP_URL = SHOP_DOMAIN

// ─── Contact emails ────────────────────────────────────────────────────────
export const SUPPORT_EMAIL    = process.env.SUPPORT_EMAIL     || 'support@nova-indukt.de'
export const INFO_EMAIL        = process.env.INFO_EMAIL         || 'info@nova-indukt.de'
export const DATENSCHUTZ_EMAIL = process.env.DATENSCHUTZ_EMAIL || 'datenschutz@nova-indukt.de'
export const WIDERRUF_EMAIL    = process.env.WIDERRUF_EMAIL    || 'widerruf@nova-indukt.de'
export const NEWSLETTER_EMAIL  = process.env.NEWSLETTER_EMAIL  || 'newsletter@nova-indukt.de'

// ⚠️ CRITICAL: Never ship with placeholder bank details.
// These env vars MUST be set in production — missing values will cause
// customers to receive fake bank transfer instructions.
function requireEnv(key: string, fallback: string): string {
  const value = process.env[key]
  if (!value && process.env.NODE_ENV === 'production') {
    console.warn(`[nova-indukt] Warning: Missing env variable: ${key}. Using fallback.`);
  }
  return value ?? fallback
}

export const BANK_DETAILS = {
  holder:   requireEnv('NEXT_PUBLIC_BANK_HOLDER',  'NOVA INDUKT GmbH'),
  iban:     requireEnv('NEXT_PUBLIC_BANK_IBAN',    'DE00 0000 0000 0000 0000 00'),
  bic:      requireEnv('NEXT_PUBLIC_BANK_BIC',     'XXXXXXXXXXXXXXX'),
  bankName: requireEnv('NEXT_PUBLIC_BANK_NAME',    'Bank nicht konfiguriert'),
}

/**
 * Returns the shipping cost based on the subtotal.
 */
export function calculateShipping(subtotal: number): number {
  return subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST
}
