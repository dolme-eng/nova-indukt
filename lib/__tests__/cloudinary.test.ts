import { describe, it, expect, beforeAll } from 'vitest'
import { getOptimizedUrl, getPlaceholderUrl } from '@/lib/cloudinary'

beforeAll(() => {
  process.env.CLOUDINARY_CLOUD_NAME = 'test-cloud'
  process.env.CLOUDINARY_API_KEY = 'test-key'
  process.env.CLOUDINARY_API_SECRET = 'test-secret'
})

describe('getOptimizedUrl', () => {
  it('returns a valid URL string', () => {
    const url = getOptimizedUrl('nova-indukt/products/test-image')
    expect(typeof url).toBe('string')
    expect(url).toMatch(/^https?:\/\//)
  })

  it('includes auto format and quality', () => {
    const url = getOptimizedUrl('nova-indukt/products/test-image')
    expect(url).toContain('f_auto')
    expect(url).toContain('q_auto')
  })

  it('includes width when provided', () => {
    const url = getOptimizedUrl('nova-indukt/products/test-image', 400)
    expect(url).toContain('w_400')
  })

  it('includes height when provided', () => {
    const url = getOptimizedUrl('nova-indukt/products/test-image', undefined, 300)
    expect(url).toContain('h_300')
  })

  it('includes crop mode when dimensions are provided', () => {
    const url = getOptimizedUrl('nova-indukt/products/test-image', 400, 300)
    expect(url).toContain('c_fill')
  })

  it('allows custom crop mode', () => {
    const url = getOptimizedUrl('nova-indukt/products/test-image', 400, 300, 'fit')
    expect(url).toContain('c_fit')
  })

  it('does not include crop when no dimensions specified', () => {
    const url = getOptimizedUrl('nova-indukt/products/test-image')
    expect(url).not.toContain('c_')
  })

  it('uses secure URLs', () => {
    const url = getOptimizedUrl('nova-indukt/products/test-image')
    expect(url).toMatch(/^https:\/\//)
  })
})

describe('getPlaceholderUrl', () => {
  it('returns a valid URL string', () => {
    const url = getPlaceholderUrl('nova-indukt/products/test-image')
    expect(typeof url).toBe('string')
    expect(url).toMatch(/^https?:\/\//)
  })

  it('uses secure URLs', () => {
    const url = getPlaceholderUrl('nova-indukt/products/test-image')
    expect(url).toMatch(/^https:\/\//)
  })

  it('includes placeholder transformations (scale, low quality)', () => {
    const url = getPlaceholderUrl('nova-indukt/products/test-image')
    expect(url).toContain('c_scale')
    expect(url).toContain('w_50')
    expect(url).toContain('q_1')
  })
})
