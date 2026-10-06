import { describe, it, expect } from 'vitest'
import { buildPageItems, buildQueryUrl, parsePageParam } from '@/lib/utils/pagination'

/**
 * `Math.max(1, parseInt(x))` returns NaN for `?page=abc`, and Prisma turns
 * `skip: NaN` into a 500. These helpers are the replacement used by every
 * admin list.
 */
describe('parsePageParam', () => {
  it('defaults to 1', () => {
    expect(parsePageParam(undefined)).toBe(1)
    expect(parsePageParam('')).toBe(1)
  })

  it.each(['abc', 'NaN', '1.5.2', ' ', '--', 'e10'])(
    'falls back to 1 for the non-numeric value %o',
    (value) => {
      expect(parsePageParam(value)).toBe(1)
    }
  )

  it.each(['0', '-3', '-999'])('clamps %o to 1', (value) => {
    expect(parsePageParam(value)).toBe(1)
  })

  it('parses a valid page', () => {
    expect(parsePageParam('7')).toBe(7)
    expect(parsePageParam('1')).toBe(1)
  })

  it('caps at totalPages when provided', () => {
    expect(parsePageParam('50', 3)).toBe(3)
    expect(parsePageParam('2', 3)).toBe(2)
  })

  it('does not cap to 0 pages', () => {
    expect(parsePageParam('9', 0)).toBe(9)
  })
})

describe('buildQueryUrl', () => {
  it('builds a bare path when there are no params', () => {
    expect(buildQueryUrl('/admin/x', {})).toBe('/admin/x')
  })

  it('preserves current params', () => {
    expect(buildQueryUrl('/admin/x', { q: 'pfanne', status: 'PAID' })).toBe(
      '/admin/x?q=pfanne&status=PAID'
    )
  })

  it('overrides a param', () => {
    expect(buildQueryUrl('/admin/x', { page: '3' }, { page: 5 })).toBe('/admin/x?page=5')
  })

  it('drops a param set to null or empty', () => {
    expect(buildQueryUrl('/admin/x', { q: 'abc' }, { q: null })).toBe('/admin/x')
    expect(buildQueryUrl('/admin/x', { q: 'abc' }, { q: '' })).toBe('/admin/x')
  })

  it('drops the page when resetPage is set (filter changed)', () => {
    const url = buildQueryUrl('/admin/x', { page: '4', q: 'a' }, { q: 'b' }, { resetPage: true })
    expect(url).toBe('/admin/x?q=b')
  })

  // The admin orders list used string interpolation, so a search containing
  // `&`, `#` or `+` produced a broken URL.
  it.each(['a&b', 'a#b', 'a+b', 'a b', 'Müller & Söhne', 'q=1&x=2'])(
    'encodes %o safely',
    (value) => {
      const url = buildQueryUrl('/admin/orders', { q: value })
      expect(url.startsWith('/admin/orders?')).toBe(true)
      const params = new URLSearchParams(url.slice(url.indexOf('?') + 1))
      expect(params.get('q')).toBe(value)
    }
  )

  it('handles array params', () => {
    expect(buildQueryUrl('/x', { tag: ['a', 'b'] })).toBe('/x?tag=a&tag=b')
  })

  it('ignores undefined and empty current values', () => {
    expect(buildQueryUrl('/x', { a: undefined, b: '', c: 'c' })).toBe('/x?c=c')
  })
})

describe('buildPageItems', () => {
  it('returns a single page when there is only one', () => {
    expect(buildPageItems(1, 1)).toEqual([1])
  })

  it('lists everything for a small range', () => {
    expect(buildPageItems(1, 5)).toEqual([1, 2, 3, 4, 5])
  })

  it('inserts ellipses near the start', () => {
    expect(buildPageItems(2, 20)).toEqual([1, 2, 3, '…', 20])
  })

  it('inserts ellipses near the end', () => {
    expect(buildPageItems(19, 20)).toEqual([1, '…', 18, 19, 20])
  })

  it('inserts ellipses in the middle', () => {
    expect(buildPageItems(10, 20)).toEqual([1, '…', 9, 10, 11, '…', 20])
  })

  it('always includes first and last', () => {
    const items = buildPageItems(50, 100)
    expect(items[0]).toBe(1)
    expect(items[items.length - 1]).toBe(100)
  })

  it('produces no duplicate pages', () => {
    for (let p = 1; p <= 30; p++) {
      const numeric = buildPageItems(p, 30).filter((i) => typeof i === 'number')
      expect(new Set(numeric).size).toBe(numeric.length)
    }
  })
})
