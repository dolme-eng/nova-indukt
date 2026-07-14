import { describe, it, expect } from 'vitest'
import { calculateShipping, SHIPPING_COST, FREE_SHIPPING_THRESHOLD } from '@/lib/constants/shop'
import { COMPANY } from '@/lib/constants/company'

describe('calculateShipping', () => {
  it('returns SHIPPING_COST when subtotal is below the free threshold', () => {
    expect(calculateShipping(0)).toBe(SHIPPING_COST)
    expect(calculateShipping(499.99)).toBe(SHIPPING_COST)
  })

  it('returns SHIPPING_COST when subtotal is just below the free threshold', () => {
    expect(calculateShipping(FREE_SHIPPING_THRESHOLD - 0.01)).toBe(SHIPPING_COST)
  })

  it('returns 0 when subtotal equals the free shipping threshold', () => {
    expect(calculateShipping(FREE_SHIPPING_THRESHOLD)).toBe(0)
  })

  it('returns 0 when subtotal is above the free shipping threshold', () => {
    expect(calculateShipping(500.01)).toBe(0)
    expect(calculateShipping(1000)).toBe(0)
    expect(calculateShipping(99999.99)).toBe(0)
  })

  it('returns SHIPPING_COST for negative subtotal', () => {
    expect(calculateShipping(-100)).toBe(SHIPPING_COST)
  })
})

describe('COMPANY exports', () => {
  it('exports name and nameShort', () => {
    expect(typeof COMPANY.name).toBe('string')
    expect(typeof COMPANY.nameShort).toBe('string')
    expect(COMPANY.name.length).toBeGreaterThan(0)
  })

  it('exports email addresses', () => {
    expect(COMPANY.email).toBeDefined()
    expect(typeof COMPANY.email.info).toBe('string')
    expect(typeof COMPANY.email.support).toBe('string')
    expect(typeof COMPANY.email.datenschutz).toBe('string')
    expect(typeof COMPANY.email.widerruf).toBe('string')
    expect(typeof COMPANY.email.newsletter).toBe('string')
    expect(typeof COMPANY.email.noreply).toBe('string')
  })

  it('exports phone numbers', () => {
    expect(typeof COMPANY.phone.number).toBe('string')
    expect(typeof COMPANY.phone.numberRaw).toBe('string')
  })

  it('exports website', () => {
    expect(typeof COMPANY.website).toBe('string')
    expect(COMPANY.website).toMatch(/^https?:\/\//)
  })

  it('exports address fields', () => {
    expect(typeof COMPANY.street).toBe('string')
    expect(typeof COMPANY.zip).toBe('string')
    expect(typeof COMPANY.city).toBe('string')
    expect(typeof COMPANY.country).toBe('string')
  })

  it('exports legal info', () => {
    expect(COMPANY.legal).toBeDefined()
    expect(typeof COMPANY.legal.ustIdNr).toBe('string')
    expect(typeof COMPANY.legal.registernummer).toBe('string')
  })

  it('exports hours', () => {
    expect(typeof COMPANY.hours.weekdays).toBe('string')
    expect(typeof COMPANY.hours.saturday).toBe('string')
    expect(typeof COMPANY.hours.combined).toBe('string')
  })

  it('exports a team array', () => {
    expect(Array.isArray(COMPANY.team)).toBe(true)
    expect(COMPANY.team.length).toBeGreaterThan(0)
    expect(COMPANY.team[0]).toHaveProperty('name')
    expect(COMPANY.team[0]).toHaveProperty('role')
  })
})
