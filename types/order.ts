/**
 * Type de l'adresse de livraison stockée en JSON dans Order.shippingAddress
 * Correspond aux clés écrites par app/api/orders/route.ts
 */
export interface ShippingAddress {
  firstName: string
  lastName: string
  name: string
  street: string
  postalCode: string
  city: string
  country: string
}
