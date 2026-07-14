import { describe, it, expect } from 'vitest'
import { generateInvoicePDF } from '@/lib/utils/invoice'

describe('generateInvoicePDF', () => {
  const validInvoiceData = {
    orderNumber: 'ORD-20240101-001',
    items: [
      { name: 'Induktionskochfeld Test', quantity: 1, price: 299.99 },
      { name: 'Montageset', quantity: 2, price: 19.99 },
    ],
    subtotal: 339.97,
    shipping: 0,
    total: 339.97,
    createdAt: new Date('2024-01-15'),
  }

  it('returns a jsPDF instance (Buffer-like object)', () => {
    const doc = generateInvoicePDF(validInvoiceData)
    expect(doc).toBeDefined()
    expect(typeof doc.output).toBe('function')
  })

  it('does not throw for valid invoice data', () => {
    expect(() => generateInvoicePDF(validInvoiceData)).not.toThrow()
  })

  it('handles invoice with shipping cost', () => {
    const data = { ...validInvoiceData, shipping: 9.99, total: 349.96 }
    expect(() => generateInvoicePDF(data)).not.toThrow()
  })

  it('handles invoice with a single item', () => {
    const data = {
      ...validInvoiceData,
      items: [{ name: 'Einfaches Produkt', quantity: 1, price: 49.99 }],
      subtotal: 49.99,
      total: 59.98,
    }
    expect(() => generateInvoicePDF(data)).not.toThrow()
  })

  it('handles invoice with many items', () => {
    const items = Array.from({ length: 20 }, (_, i) => ({
      name: `Produkt ${i + 1}`,
      quantity: i + 1,
      price: 10 + i,
    }))
    const data = {
      ...validInvoiceData,
      items,
      subtotal: 2000,
      total: 2000,
    }
    expect(() => generateInvoicePDF(data)).not.toThrow()
  })

  it('generates a PDF that can be serialized', () => {
    const doc = generateInvoicePDF(validInvoiceData)
    const output = doc.output('arraybuffer')
    expect(output).toBeInstanceOf(ArrayBuffer)
    expect(output.byteLength).toBeGreaterThan(0)
  })
})
