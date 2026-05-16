/**
 * Shop configuration constants.
 * Centralized values for shipping, taxes, and other business rules.
 */

export const SHIPPING_COST = 9.99
export const FREE_SHIPPING_THRESHOLD = 500

export const SHOP_NAME = 'NOVA INDUKT'
export const SHOP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://nova-indukt.de'
export const SUPPORT_EMAIL = 'support@nova-indukt.de'

export const BANK_DETAILS = {
  holder: process.env.NEXT_PUBLIC_BANK_HOLDER || "NOVA INDUKT GmbH",
  iban: process.env.NEXT_PUBLIC_BANK_IBAN || "DE00 1234 5678 9012 3456 78",
  bic: process.env.NEXT_PUBLIC_BANK_BIC || "GENO DE FF XXX",
  bankName: process.env.NEXT_PUBLIC_BANK_NAME || "Berliner Volksbank",
}

/**
 * Returns the shipping cost based on the subtotal.
 */
export function calculateShipping(subtotal: number): number {
  return subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST
}
