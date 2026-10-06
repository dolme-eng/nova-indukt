import jsPDF from 'jspdf'
import { COMPANY } from '@/lib/constants/company'
import { getBankDetailsSync, type BankDetails } from '@/lib/data/bank-details'
import { formatPriceDe } from '@/lib/utils/vat'

interface InvoiceItem {
  name: string
  quantity: number
  price: number
}

interface InvoiceData {
  orderNumber: string
  items: InvoiceItem[]
  subtotal: number
  shipping: number
  total: number
  createdAt: Date
  discount?: number
  tax?: number
  customerName?: string
}

/**
 * `bank` is injected rather than imported: the PDF is emailed to the customer
 * and must show the SAME account as the website, i.e. the admin overrides read
 * from AppConfig — not the env-only snapshot from `getBankDetailsSync()`.
 */
export function generateInvoicePDF(data: InvoiceData, bank: BankDetails = getBankDetailsSync()): jsPDF {
  const doc = new jsPDF()

  // Header
  doc.setFontSize(24)
  doc.setFont('helvetica', 'bold')
  doc.text('RECHNUNG', 20, 30)

  // Company info
  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  doc.text(COMPANY.name, 20, 45)
  doc.text(COMPANY.street, 20, 52)
  doc.text(`${COMPANY.zip} ${COMPANY.city}`, 20, 59)
  doc.text(`E-Mail: ${COMPANY.email.info}`, 20, 66)

  // Invoice details
  doc.setFontSize(10)
  doc.setFont('helvetica', 'bold')
  doc.text('Rechnungsnummer:', 20, 85)
  doc.text('Datum:', 20, 92)
  doc.text('Zahlungsmethode:', 20, 99)

  doc.setFont('helvetica', 'normal')
  doc.text(data.orderNumber, 80, 85)
  doc.text(data.createdAt.toLocaleDateString('de-DE'), 80, 92)
  doc.text('Banküberweisung', 80, 99)
  if (data.customerName) {
    doc.setFont('helvetica', 'bold')
    doc.text('Kunde:', 20, 106)
    doc.setFont('helvetica', 'normal')
    doc.text(data.customerName, 80, 106)
  }

  // Table header
  const tableTop = 120
  doc.setFont('helvetica', 'bold')
  doc.text('Beschreibung', 20, tableTop)
  doc.text('Menge', 120, tableTop)
  doc.text('Einzelpreis', 140, tableTop)
  doc.text('Gesamt', 170, tableTop)

  // Table rows
  let currentY = tableTop + 10
  doc.setFont('helvetica', 'normal')

  const pageHeight = 297
  const margin = 30

  data.items.forEach((item) => {
    if (currentY > pageHeight - margin) {
      doc.addPage()
      currentY = 20
    }
    doc.text(item.name, 20, currentY)
    doc.text(item.quantity.toString(), 125, currentY)
    doc.text(formatPriceDe(item.price), 140, currentY)
    doc.text(formatPriceDe(item.price * item.quantity), 170, currentY)
    currentY += 10
  })

  // Summary
  currentY += 10
  if (currentY > pageHeight - 80) {
    doc.addPage()
    currentY = 20
  }
  doc.setFont('helvetica', 'normal')
  doc.text('Zwischensumme:', 120, currentY)
  doc.text(formatPriceDe(data.subtotal), 170, currentY)

  currentY += 10
  doc.text('Versand:', 120, currentY)
  doc.text(data.shipping === 0 ? 'Kostenlos' : formatPriceDe(data.shipping), 170, currentY)

  if (data.discount && data.discount > 0) {
    currentY += 10
    doc.text('Rabatt:', 120, currentY)
    doc.text(`-${formatPriceDe(data.discount)}`, 170, currentY)
  }

  if (data.tax !== undefined) {
    currentY += 10
    doc.setFontSize(9)
    doc.text('inkl. MwSt. (19 %):', 120, currentY)
    doc.text(formatPriceDe(data.tax), 170, currentY)
    doc.setFontSize(10)
  }

  currentY += 10
  doc.setFont('helvetica', 'bold')
  doc.text('Gesamtbetrag:', 120, currentY)
  doc.text(formatPriceDe(data.total), 170, currentY)

  // Bank details
  currentY += 30
  if (currentY > pageHeight - 60) {
    doc.addPage()
    currentY = 20
  }
  doc.setFont('helvetica', 'bold')
  doc.text('Zahlungsinformationen', 20, currentY)
  doc.setFont('helvetica', 'normal')
  doc.text(`Kontoinhaber: ${bank.holder}`, 20, currentY + 10)
  doc.text(`IBAN: ${bank.iban}`, 20, currentY + 20)
  doc.text(`BIC: ${bank.bic}`, 20, currentY + 30)
  doc.text(`Bank: ${bank.bankName}`, 20, currentY + 40)
  doc.text(`Verwendungszweck: ${data.orderNumber}`, 20, currentY + 50)

  // Footer on last page
  doc.setFontSize(8)
  doc.setFont('helvetica', 'normal')
  const footerY = pageHeight - 15
  doc.text('Vielen Dank für Ihre Bestellung!', 20, footerY)
  doc.text(`${COMPANY.name} | ${COMPANY.street} | ${COMPANY.zip} ${COMPANY.city}`, 20, footerY + 5)

  return doc
}
