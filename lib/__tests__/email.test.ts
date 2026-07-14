import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('@/lib/email/resend', () => ({
  getResend: vi.fn(() => null),
  FROM_EMAIL: 'test@nova-indukt.de',
  FROM_NAME: 'NOVA INDUKT Test',
}))

vi.mock('@/lib/prisma', () => ({
  prisma: {
    order: { findUnique: vi.fn() },
  },
}))

vi.mock('@/lib/utils/pricing', () => ({
  calculateOrderTotals: vi.fn(() => ({
    subtotal: 100,
    shipping: 5,
    tax: 19,
    total: 124,
  })),
}))

vi.mock('@/lib/constants/shop', () => ({
  SHOP_DOMAIN: 'https://nova-indukt.de',
}))

vi.mock('@/lib/utils/invoice', () => ({
  generateInvoicePDF: vi.fn(() => ({
    output: vi.fn(() => new ArrayBuffer(10)),
  })),
}))

vi.mock('@react-email/render', () => ({
  render: vi.fn(async () => '<html>mock</html>'),
}))

vi.mock('@/lib/email/templates/order-confirmation', () => ({
  default: vi.fn(() => ({})),
}))

vi.mock('@/lib/email/templates/shipping-notification', () => ({
  default: vi.fn(() => ({})),
}))

vi.mock('@/lib/email/templates/order-cancellation', () => ({
  default: vi.fn(() => ({})),
}))

vi.mock('@/lib/email/templates/newsletter-confirmation', () => ({
  default: vi.fn(() => ({})),
}))

vi.mock('@/lib/email/templates/contact-notification', () => ({
  default: vi.fn(() => ({})),
}))

vi.mock('@/lib/email/templates/password-reset', () => ({
  default: vi.fn(() => ({})),
}))

import { sendEmailWithRetry, sendOrderConfirmation, sendNewsletterConfirmationEmail } from '@/lib/email/send'
import { getResend } from '@/lib/email/resend'

beforeEach(() => {
  vi.clearAllMocks()
  vi.mocked(getResend).mockReturnValue(null as any)
})

describe('sendEmailWithRetry', () => {
  it('returns data:null and error when Resend is not configured', async () => {
    const result = await sendEmailWithRetry({
      from: 'test@test.com',
      to: 'a@b.com',
      subject: 'Test',
      html: '<p>Hello</p>',
    })
    expect(result.data).toBeNull()
    expect(result.error).toBeDefined()
    expect(result.error!.name).toBe('missing_api_key')
  })

  it('warns when resend client is null', async () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
    await sendEmailWithRetry({
      from: 'test@test.com',
      to: 'a@b.com',
      subject: 'Test',
      html: '<p>Hello</p>',
    })
    expect(warnSpy).toHaveBeenCalled()
    warnSpy.mockRestore()
  })
})

describe('sendOrderConfirmation', () => {
  it('returns success:false with error when Resend not configured', async () => {
    const result = await sendOrderConfirmation({
      to: 'customer@test.com',
      customerName: 'Test User',
      orderNumber: 'ORD-001',
      items: [{ id: 'i1', name: 'Induktor', nameDe: 'Induktor', quantity: 1, price: 99 }],
      subtotal: 99,
      shipping: 5,
      tax: 18.81,
      total: 122.81,
      shippingAddress: {
        name: 'Test User',
        street: 'Musterstr 1',
        postalCode: '10115',
        city: 'Berlin',
        country: 'DE',
      },
      estimatedDelivery: 'Freitag, 18. Juli',
    })
    expect(result.success).toBe(false)
    expect(result.error).toBeDefined()
  })
})

describe('sendNewsletterConfirmationEmail', () => {
  it('returns success:false with error when Resend not configured', async () => {
    const result = await sendNewsletterConfirmationEmail('test@test.com', 'Jan')
    expect(result.success).toBe(false)
    expect(result.error).toBeDefined()
  })

  it('handles missing firstName gracefully', async () => {
    const result = await sendNewsletterConfirmationEmail('test@test.com')
    expect(result.success).toBe(false)
  })
})
