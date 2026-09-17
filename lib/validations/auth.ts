import { z } from 'zod'

export const registerSchema = z.object({
  name: z.string().min(2, 'Name muss mindestens 2 Zeichen lang sein').max(100, 'Name ist zu lang'),
  email: z.string().max(254, 'E-Mail-Adresse ist zu lang').email('Ungültige E-Mail-Adresse'),
  password: z
    .string()
    .min(8, 'Passwort muss mindestens 8 Zeichen lang sein')
    .max(100, 'Passwort ist zu lang')
    .regex(/[A-Z]/, 'Passwort muss mindestens einen Großbuchstaben enthalten')
    .regex(/[a-z]/, 'Passwort muss mindestens einen Kleinbuchstaben enthalten')
    .regex(/[0-9]/, 'Passwort muss mindestens eine Ziffer enthalten')
    .regex(/[!@#$%^&*(),.?":{}|<>]/, 'Passwort muss mindestens ein Sonderzeichen enthalten'),
})

export const loginSchema = z.object({
  email: z.string().max(254, 'E-Mail-Adresse ist zu lang').email('Ungültige E-Mail-Adresse'),
  // max 100: bcrypt truncates at 72 bytes — cap input to bound CPU per attempt
  password: z.string().min(1, 'Passwort ist erforderlich').max(100, 'Passwort ist zu lang'),
})

export const forgotPasswordSchema = z.object({
  email: z.string().max(254, 'E-Mail-Adresse ist zu lang').email('Ungültige E-Mail-Adresse'),
})

export const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Token ist erforderlich').max(256, 'Token ist ungültig'),
  password: z
    .string()
    .min(8, 'Passwort muss mindestens 8 Zeichen lang sein')
    .max(100)
    .regex(/[A-Z]/, 'Passwort muss mindestens einen Großbuchstaben enthalten')
    .regex(/[a-z]/, 'Passwort muss mindestens einen Kleinbuchstaben enthalten')
    .regex(/[0-9]/, 'Passwort muss mindestens eine Ziffer enthalten')
    .regex(/[!@#$%^&*(),.?":{}|<>]/, 'Passwort muss mindestens ein Sonderzeichen enthalten'),
})

export type RegisterInput = z.infer<typeof registerSchema>
export type LoginInput = z.infer<typeof loginSchema>
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>
