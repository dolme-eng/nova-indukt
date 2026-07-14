import { describe, it, expect } from 'vitest'
import { cn, formatPriceDe, formatDate } from '../utils'

describe('cn', () => {
  it('merges class names', () => {
    const result = cn('text-red-500', 'text-blue-500')
    expect(result).toBe('text-blue-500')
  })

  it('handles conditional classes', () => {
    const result = cn('base', false && 'hidden', 'extra')
    expect(result).toContain('base')
    expect(result).toContain('extra')
    expect(result).not.toContain('hidden')
  })

  it('returns empty string for no args', () => {
    expect(cn()).toBe('')
  })
})

describe('formatPriceDe', () => {
  it('formats 1250.99 in de-DE locale', () => {
    const result = formatPriceDe(1250.99)
    expect(result).toContain('1.250,99')
    expect(result).toContain('€')
  })

  it('formats 0', () => {
    expect(formatPriceDe(0)).toContain('0,00')
  })

  it('formats 49', () => {
    expect(formatPriceDe(49)).toContain('49,00')
  })
})

describe('formatDate', () => {
  it('formats a date string in de-DE', () => {
    const result = formatDate('2024-01-15')
    expect(result).toContain('15')
    expect(result).toContain('2024')
  })

  it('formats ISO datetime', () => {
    const result = formatDate('2024-12-25T10:30:00Z')
    expect(result).toContain('25')
    expect(result).toContain('2024')
  })
})
