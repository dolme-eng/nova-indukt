/**
 * Single source of truth for "what may leave the server".
 *
 * `Product.costPrice` (purchase cost) and `Product.supplierSku` (supplier
 * reference) are internal fields. They must never reach any client payload —
 * not in the catalogue routes, not in order responses, not in audit-friendly
 * shapes. Spreading a Prisma record (`...product`) is the dangerous default,
 * so every API response shape that embeds a product goes through here.
 */

type ProductLike = Record<string, unknown> & {
  price: unknown
  oldPrice?: unknown
}

export function toPublicProduct<T extends ProductLike>(product: T): Omit<T, 'costPrice' | 'supplierSku'> & {
  price: number
  oldPrice: number | null
} {
  const { costPrice, supplierSku, ...rest } = product
  void costPrice
  void supplierSku

  return {
    ...rest,
    price: Number(product.price),
    oldPrice: product.oldPrice != null ? Number(product.oldPrice) : null,
  }
}
