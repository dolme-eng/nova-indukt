/**
 * TVA (MwSt) — Source de vérité unique pour tout le projet.
 *
 * Convention B2C allemande : tous les prix sont TTC (inkl. MwSt).
 * La TVA est donc EXTRAITE du prix brut, jamais ajoutée.
 *
 * Usage:
 *   import { VAT_RATE_PERCENT, netFromGross, vatFromGross, formatPriceDe } from '@/lib/utils/vat'
 */

// ─── Constants ──────────────────────────────────────────────────────────────────

/** TVA allemande standard : 19 % */
export const VAT_RATE_PERCENT = 19

/** TVA en décimal (0.19) — à ne PAS utiliser pour multiplier un prix TTC ! */
export const VAT_RATE = VAT_RATE_PERCENT / 100

// ─── Calculs TTC ↔ HT ──────────────────────────────────────────────────────────

/**
 * Extraire le prix HT d'un prix TTC.
 * Ex : netFromGross(119) → 100
 */
export function netFromGross(gross: number, vatPercent: number = VAT_RATE_PERCENT): number {
  if (vatPercent <= 0) return gross
  return Math.round((gross / (1 + vatPercent / 100)) * 100) / 100
}

/**
 * Calculer le prix TTC à partir d'un prix HT.
 * Ex : grossFromNet(100) → 119
 */
export function grossFromNet(net: number, vatPercent: number = VAT_RATE_PERCENT): number {
  if (vatPercent <= 0) return net
  return Math.round(net * (1 + vatPercent / 100) * 100) / 100
}

/**
 * Extraire le montant de TVA contenu dans un prix TTC.
 * Ex : vatFromGross(119) → 19
 *
 * C'est la formule correcte pour du B2C : gross - (gross / 1.19)
 * Et NON gross * 0.19 (qui donnerait 22.61 — trop élevé).
 */
export function vatFromGross(gross: number, vatPercent: number = VAT_RATE_PERCENT): number {
  return Math.round((gross - netFromGross(gross, vatPercent)) * 100) / 100
}

/**
 * Calculer la TVA à ajouter à un montant HT.
 * Ex : vatFromNet(100) → 19
 *
 * ⚠️ À n'utiliser que si le montant est réellement HT !
 */
export function vatFromNet(net: number, vatPercent: number = VAT_RATE_PERCENT): number {
  return Math.round(net * (vatPercent / 100) * 100) / 100
}

// ─── Formatage ──────────────────────────────────────────────────────────────────

/**
 * Formater un montant en euros pour l'affichage allemand.
 * Ex : formatPriceDe(1250.99) → "1.250,99 €"
 *
 * Utilise Intl.NumberFormat pour gérer correctement les séparateurs de milliers
 * et un espace insécable (\u00A0) pour éviter un retour à la ligne avant le symbole €.
 */
export function formatPriceDe(value: number): string {
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
  }).format(value).replace(/\s/g, '\u00A0')
}

/** @deprecated Utiliser formatPriceDe à la place (identique). */
export const formatDeEuro = formatPriceDe

/** @deprecated Utiliser VAT_RATE_PERCENT à la place. */
export const DEFAULT_DE_VAT_PERCENT = VAT_RATE_PERCENT
