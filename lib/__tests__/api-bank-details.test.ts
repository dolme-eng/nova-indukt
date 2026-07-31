import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('@/lib/rate-limit', () => ({
  rateLimit: vi.fn().mockResolvedValue({ success: true }),
  getIP: vi.fn().mockReturnValue('127.0.0.1'),
  createRateLimitKey: vi.fn().mockReturnValue('test:key'),
}))

const mockGetBankDetails = vi.fn()
vi.mock('@/lib/data/bank-details', () => ({
  getBankDetails: (...args: unknown[]) => mockGetBankDetails(...args),
}))

import { GET } from '@/app/api/bank-details/route'
import { NextRequest } from 'next/server'

function makeRequest(url: string) {
  return new NextRequest(new Request(url))
}

describe('GET /api/bank-details', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns bank details', async () => {
    mockGetBankDetails.mockResolvedValue({
      holder: 'NOVA INDUKT GmbH',
      iban: 'DE89 3704 0044 0532 0130 00',
      bic: 'COBADEFFXXX',
      bankName: 'Commerzbank',
    })

    const req = makeRequest('https://example.com/api/bank-details')
    const res = await GET(req)
    const data = await res.json()

    expect(res.status).toBe(200)
    expect(data.holder).toBe('NOVA INDUKT GmbH')
    expect(data.iban).toBe('DE89 3704 0044 0532 0130 00')
    expect(data.bic).toBe('COBADEFFXXX')
    expect(data.bankName).toBe('Commerzbank')
  })

  it('returns 500 when getBankDetails throws', async () => {
    mockGetBankDetails.mockRejectedValue(new Error('DB error'))

    const req = makeRequest('https://example.com/api/bank-details')
    const res = await GET(req)

    expect(res.status).toBe(500)
  })
})
