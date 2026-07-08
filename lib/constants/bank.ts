import { BANK_DETAILS } from './shop'
import { COMPANY } from './company'

export const BANK_TRANSFER = {
  iban: BANK_DETAILS.iban,
  bic: BANK_DETAILS.bic,
  holder: BANK_DETAILS.holder,
  bankName: BANK_DETAILS.bankName,
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
