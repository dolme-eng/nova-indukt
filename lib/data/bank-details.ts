import { prisma } from '@/lib/prisma'
import { COMPANY } from '@/lib/constants/company'

export interface BankDetails {
  holder: string
  iban: string
  bic: string
  bankName: string
}

const ENV_DEFAULTS: BankDetails = {
  holder:   process.env.NEXT_PUBLIC_BANK_HOLDER  ?? COMPANY.name,
  iban:     process.env.NEXT_PUBLIC_BANK_IBAN    ?? 'DE00 0000 0000 0000 0000 00',
  bic:      process.env.NEXT_PUBLIC_BANK_BIC     ?? 'XXXXXXXXXXXXXXX',
  bankName: process.env.NEXT_PUBLIC_BANK_NAME    ?? 'Bank nicht konfiguriert',
}

/**
 * Reads bank details from AppConfig (key="site", sub-key "payment").
 * Falls back to environment variables when no admin overrides exist.
 * Server-side only — for client access use /api/bank-details.
 */
export async function getBankDetails(): Promise<BankDetails> {
  try {
    const cfg = await prisma.appConfig.findUnique({ where: { key: 'site' } })
    const data = (cfg?.data as Record<string, unknown>) ?? {}
    const payment = (data.payment ?? {}) as Record<string, string>

    return {
      holder:   payment.holder   || ENV_DEFAULTS.holder,
      iban:     payment.iban     || ENV_DEFAULTS.iban,
      bic:      payment.bic      || ENV_DEFAULTS.bic,
      bankName: payment.bankName || ENV_DEFAULTS.bankName,
    }
  } catch {
    return ENV_DEFAULTS
  }
}

/**
 * Synchronous bank details for contexts that cannot be async (e.g. email templates).
 * Uses env vars only — safe for import-time evaluation.
 */
export function getBankDetailsSync(): BankDetails {
  return ENV_DEFAULTS
}
