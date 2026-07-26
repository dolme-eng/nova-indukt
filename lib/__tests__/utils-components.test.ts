import { describe, it, expect } from 'vitest'
import { cn, formatDate } from '@/lib/utils'

describe('cn', () => {
  it('merges class names', () => {
    expect(cn('foo', 'bar')).toBe('foo bar')
  })

  it('handles conditional classes', () => {
    expect(cn('foo', false && 'bar', 'baz')).toBe('foo baz')
  })

  it('resolves tailwind conflicts', () => {
    expect(cn('px-4 px-8')).toBe('px-8')
  })

  it('handles undefined and null', () => {
    expect(cn('foo', undefined, null)).toBe('foo')
  })

  it('handles empty input', () => {
    expect(cn()).toBe('')
  })
})

describe('formatDate', () => {
  it('formats date in German locale', () => {
    const result = formatDate('2024-06-15')
    expect(result).toContain('15.')
    expect(result).toContain('Juni')
    expect(result).toContain('2024')
  })

  it('handles different date strings', () => {
    const result = formatDate('2023-12-25')
    expect(result).toContain('25.')
    expect(result).toContain('Dezember')
    expect(result).toContain('2023')
  })
})
