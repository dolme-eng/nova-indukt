import { z } from 'zod'

// Schéma pour l'inscription à la newsletter
export const newsletterSubscribeSchema = z.object({
  email: z.string().email('Invalid email address'),
  firstName: z.string().max(100).optional().nullable(),
  lastName: z.string().max(100).optional().nullable(),
  source: z.string().max(50).optional().default('website'),
})

// Schéma pour la désinscription
export const newsletterUnsubscribeSchema = z.object({
  email: z.string().email('Invalid email address'),
})

export type NewsletterSubscribeInput = z.infer<typeof newsletterSubscribeSchema>
export type NewsletterUnsubscribeInput = z.infer<typeof newsletterUnsubscribeSchema>
