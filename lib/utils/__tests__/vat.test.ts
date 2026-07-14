import { describe, it, expect } from 'vitest'
import { 
  VAT_RATE_PERCENT, 
  VAT_RATE, 
  netFromGross, 
  grossFromNet, 
  vatFromGross, 
  vatFromNet, 
  formatPriceDe 
} from '../vat'

describe('VAT constants', () => {
  it('VAT_RATE_PERCENT is 19', () => {
    expect(VAT_RATE_PERCENT).toBe(19)
  })

  it('VAT_RATE is 0.19', () => {
    expect(VAT_RATE).toBe(0.19)
  })
})

describe('netFromGross', () => {
  it('extracts net from 119 → 100', () => {
    expect(netFromGross(119)).toBe(100)
  })

  it('extracts net from 59.50 → 50', () => {
    expect(netFromGross(59.50)).toBe(50)
  })

  it('returns gross when vatPercent is 0', () => {
    expect(netFromGross(100, 0)).toBe(100)
  })

  it('handles zero', () => {
    expect(netFromGross(0)).toBe(0)
  })

  it('rounds correctly', () => {
    expect(netFromGross(19.90)).toBe(16.72)
  })
})

describe('grossFromNet', () => {
  it('calculates gross from 100 → 119', () => {
    expect(grossFromNet(100)).toBe(119)
  })

  it('calculates gross from 50 → 59.50', () => {
    expect(grossFromNet(50)).toBe(59.50)
  })

  it('returns net when vatPercent is 0', () => {
    expect(grossFromNet(100, 0)).toBe(100)
  })

  it('rounds correctly', () => {
    expect(grossFromNet(33.33)).toBe(39.66)
  })
})

describe('vatFromGross', () => {
  it('extracts VAT from 119 → 19', () => {
    expect(vatFromGross(119)).toBe(19)
  })

  it('extracts VAT from 59.50 → 9.50', () => {
    expect(vatFromGross(59.50)).toBe(9.50)
  })

  it('returns 0 for zero', () => {
    expect(vatFromGross(0)).toBe(0)
  })

  it('is consistent: vatFromGross(X) === X - netFromGross(X)', () => {
    const gross = 238
    expect(vatFromGross(gross)).toBe(Math.round((gross - netFromGross(gross)) * 100) / 100)
  })
})

describe('vatFromNet', () => {
  it('calculates VAT from 100 → 19', () => {
    expect(vatFromNet(100)).toBe(19)
  })

  it('returns 0 for zero', () => {
    expect(vatFromNet(0)).toBe(0)
  })

  it('is consistent: vatFromNet(X) = grossFromNet(X) - X', () => {
    const net = 50
    expect(vatFromNet(net)).toBe(Math.round((grossFromNet(net) - net) * 100) / 100)
  })
})

describe('formatPriceDe', () => {
  it('formats 1250.99 as German EUR', () => {
    const result = formatPriceDe(1250.99)
    expect(result).toContain('1.250,99')
    expect(result).toContain('€')
  })

  it('formats 0', () => {
    const result = formatPriceDe(0)
    expect(result).toContain('0,00')
    expect(result).toContain('€')
  })

  it('formats whole numbers with ,00', () => {
    const result = formatPriceDe(49)
    expect(result).toContain('49,00')
  })
})

describe('roundtrip: grossFromNet ↔ netFromGross', () => {
  it('preserves value within rounding tolerance', () => {
    const originalNet = 100
    const gross = grossFromNet(originalNet)
    const backToNet = netFromGross(gross)
    expect(backToNet).toBe(originalNet)
  })

  it('preserves value for various amounts', () => {
    const amounts = [1, 10, 50, 100, 250, 999.99, 1234.56]
    for (const net of amounts) {
      const gross = grossFromNet(net)
      const roundTrip = netFromGross(gross)
      expect(roundTrip).toBe(net)
    }
  })
})
