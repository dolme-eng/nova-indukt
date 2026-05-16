import { z } from 'zod'

// Schéma pour un item de commande
export const orderItemSchema = z.object({
  id: z.string().cuid('Invalid product ID'),
  quantity: z.number().int().positive('Quantity must be at least 1'),
  price: z.number().positive('Price must be positive'),
  name: z.string().min(1, 'Product name is required'),
  slug: z.string().optional(),
})

// Schéma pour l'adresse de livraison
export const shippingDataSchema = z.object({
  email: z.string().email('Invalid email address'),
  firstName: z.string().min(1, 'First name is required').max(100),
  lastName: z.string().min(1, 'Last name is required').max(100),
  phone: z.string().max(50).optional().or(z.literal('')),
  address: z.string().min(1, 'Address is required').max(200),
  // ZIP codes: DE = 5 digits, AT/CH = 4 digits
  zipCode: z.string().regex(/^\d{4,5}$/, 'Ungültige Postleitzahl (DE: 5-stellig, AT/CH: 4-stellig)'),
  city: z.string().min(1, 'City is required').max(100),
  country: z.string().min(1, 'Country is required').max(100),
})

// Schéma pour la création d'une commande
export const createOrderSchema = z.object({
  items: z.array(orderItemSchema).min(1, 'At least one item is required'),
  shippingData: shippingDataSchema,
  paymentMethod: z.enum(['PAYPAL', 'BANK_TRANSFER']),
  subtotal: z.number().positive('Subtotal must be positive'),
  shipping: z.number().nonnegative('Shipping cannot be negative'),
  discountAmount: z.number().nonnegative().optional().default(0),
  appliedPromoCode: z.string().optional().nullable(),
  total: z.number().positive('Total must be positive'),
}).refine((data) => {
  // Vérification que le total est cohérent
  const calculatedTotal = data.subtotal + data.shipping - (data.discountAmount || 0)
  // Tolérance de 0.01 pour les erreurs de précision décimale
  return Math.abs(calculatedTotal - data.total) < 0.01
}, {
  message: 'Total amount does not match subtotal + shipping - discount',
  path: ['total']
})

export type CreateOrderInput = z.infer<typeof createOrderSchema>
export type OrderItemInput = z.infer<typeof orderItemSchema>
export type ShippingDataInput = z.infer<typeof shippingDataSchema>
