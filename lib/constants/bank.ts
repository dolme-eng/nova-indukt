import { getBankDetailsSync } from '@/lib/data/bank-details'
import { COMPANY } from '@/lib/constants/company'

const bank = getBankDetailsSync()

export const BANK_TRANSFER = {
  iban: bank.iban,
  bic: bank.bic,
  holder: bank.holder,
  bankName: bank.bankName,
  transferType: 'ÜBERWEISUNG',
  instructions: [
    'Bitte überweisen Sie den Gesamtbetrag auf das folgende Konto.',
    'Geben Sie unbedingt Ihre Bestellnummer als Verwendungszweck an.',
    `Senden Sie uns einen Zahlungsnachweis (Screenshot oder Foto) per E-Mail an ${COMPANY.email.support}.`,
    'Wir bearbeiten Ihre Bestellung nach Eingang und Prüfung der Zahlung.',
  ],
  email: COMPANY.email.support,
  phone: COMPANY.phone.number,
} as const
