import { z } from 'zod'

export const contactFormSchema = z.object({
  name: z.string().min(2, 'Name muss mindestens 2 Zeichen haben').max(100),
  email: z.string().email('Ungültige E-Mail-Adresse'),
  subject: z.string().min(3, 'Betreff muss mindestens 3 Zeichen haben').max(200),
  message: z.string().min(10, 'Nachricht muss mindestens 10 Zeichen haben').max(5000),
})

export type ContactFormInput = z.infer<typeof contactFormSchema>
