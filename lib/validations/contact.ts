import { z } from 'zod'

export const contactFormSchema = z.object({
  name: z.string().min(1, 'Name ist erforderlich').max(100),
  email: z.string().min(1, 'E-Mail ist erforderlich').email('Ungültige E-Mail-Adresse'),
  subject: z.string().min(1, 'Betreff ist erforderlich').max(200),
  message: z.string().min(10, 'Nachricht muss mindestens 10 Zeichen lang sein').max(5000),
})

export type ContactFormInput = z.infer<typeof contactFormSchema>
