// VAT (MwSt) Constants for Germany
export const VAT_RATE = 0.19 // 19%
export const VAT_RATE_PERCENT = 19

export function calculateVAT(amount: number): number {
  return Math.round(amount * VAT_RATE * 100) / 100
}

export function calculatePriceWithVAT(amount: number): number {
  return Math.round(amount * (1 + VAT_RATE) * 100) / 100
}

export function calculatePriceWithoutVAT(amount: number): number {
  return Math.round((amount / (1 + VAT_RATE)) * 100) / 100
}
