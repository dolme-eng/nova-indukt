import { z } from 'zod'
import { AddressType } from '@prisma/client'

// Schéma pour une adresse
export const addressSchema = z.object({
  type: z.nativeEnum(AddressType),
  firstName: z.string().min(1, 'First name is required').max(100),
  lastName: z.string().min(1, 'Last name is required').max(100),
  street: z.string().min(1, 'Street is required').max(200),
  zip: z.string().min(1, 'ZIP code is required').max(20),
  city: z.string().min(1, 'City is required').max(100),
  country: z.string().min(1, 'Country is required').max(100),
  phone: z.string().max(50).optional().nullable(),
  isDefault: z.boolean().default(false),
})

export type AddressInput = z.infer<typeof addressSchema>
