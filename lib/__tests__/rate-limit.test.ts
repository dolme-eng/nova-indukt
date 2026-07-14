import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('@upstash/ratelimit', () => ({
  Ratelimit: {
    slidingWindow: vi.fn(),
  },
}))

vi.mock('@upstash/redis', () => ({
  Redis: vi.fn(),
}))

import { rateLimit, createRateLimitKey, getIP } from '@/lib/rate-limit'

beforeEach(() => {
  vi.unstubAllGlobals()
  delete process.env.UPSTASH_REDIS_REST_URL
  delete process.env.UPSTASH_REDIS_REST_TOKEN
})

describe('rateLimit (in-memory fallback)', () => {
  it('returns success: true on first call', async () => {
    const result = await rateLimit('test:key', { windowMs: 60_000, maxRequests: 3 })
    expect(result.success).toBe(true)
    expect(result.remaining).toBe(2)
    expect(result.limit).toBe(3)
  })

  it('returns success: false after exceeding limit', async () => {
    const key = 'exhaust:key'
    await rateLimit(key, { windowMs: 60_000, maxRequests: 2 })
    await rateLimit(key, { windowMs: 60_000, maxRequests: 2 })
    const third = await rateLimit(key, { windowMs: 60_000, maxRequests: 2 })
    expect(third.success).toBe(false)
    expect(third.remaining).toBe(0)
  })

  it('resets after window expires', async () => {
    const key = 'expire:key'
    await rateLimit(key, { windowMs: 1, maxRequests: 1 })
    // Wait for window to expire
    await new Promise(r => setTimeout(r, 10))
    const result = await rateLimit(key, { windowMs: 1, maxRequests: 1 })
    expect(result.success).toBe(true)
  })
})

describe('createRateLimitKey', () => {
  it('generates consistent keys', () => {
    expect(createRateLimitKey('1.2.3.4', 'contact')).toBe('1.2.3.4:contact')
    expect(createRateLimitKey('10.0.0.1', '/api/orders')).toBe('10.0.0.1:/api/orders')
  })

  it('handles empty strings', () => {
    expect(createRateLimitKey('', '')).toBe(':')
  })
})

describe('getIP', () => {
  it('extracts first IP from x-forwarded-for', () => {
    const req = new Request('http://localhost', {
      headers: { 'x-forwarded-for': '1.2.3.4, 5.6.7.8' },
    })
    expect(getIP(req)).toBe('1.2.3.4')
  })

  it('falls back to x-real-ip', () => {
    const req = new Request('http://localhost', {
      headers: { 'x-real-ip': '9.8.7.6' },
    })
    expect(getIP(req)).toBe('9.8.7.6')
  })

  it('returns "unknown" when no IP headers present', () => {
    const req = new Request('http://localhost')
    expect(getIP(req)).toBe('unknown')
  })

  it('trims whitespace from forwarded IP', () => {
    const req = new Request('http://localhost', {
      headers: { 'x-forwarded-for': '  1.2.3.4  , 5.6.7.8' },
    })
    expect(getIP(req)).toBe('1.2.3.4')
  })
})
