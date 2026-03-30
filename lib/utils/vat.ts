/** B2C-Standard: Endpreis inkl. deutscher Umsatzsteuer (typisch 19 %). */

export const DEFAULT_DE_VAT_PERCENT = 19

export function netFromGross(gross: number, vatPercent: number = DEFAULT_DE_VAT_PERCENT): number {
  if (vatPercent <= 0) return gross
  return gross / (1 + vatPercent / 100)
}

export function grossFromNet(net: number, vatPercent: number = DEFAULT_DE_VAT_PERCENT): number {
  if (vatPercent <= 0) return net
  return net * (1 + vatPercent / 100)
}

export function formatDeEuro(value: number): string {
  return `${value.toFixed(2).replace('.', ',')}\u00A0€`
}

/** Anzeige-Preis: schmales Leerzeichen vor € verhindert Zeilenumbruch zwischen Betrag und Währung. */
export function formatPriceDe(value: number): string {
  return `${value.toFixed(2).replace('.', ',')}\u00A0€`
}
