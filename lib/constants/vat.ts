/**
 * @deprecated — Ce module est conservé pour compatibilité mais toute la logique
 * TVA est désormais centralisée dans `@/lib/utils/vat`.
 *
 * Préférez les imports suivants :
 *   import { VAT_RATE, VAT_RATE_PERCENT, vatFromGross, netFromGross } from '@/lib/utils/vat'
 */

// Re-export depuis la source de vérité unique
export { VAT_RATE, VAT_RATE_PERCENT, vatFromGross as calculateVAT, grossFromNet as calculatePriceWithVAT, netFromGross as calculatePriceWithoutVAT } from '@/lib/utils/vat'
