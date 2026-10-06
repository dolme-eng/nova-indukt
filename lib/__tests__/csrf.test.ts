import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { validateCsrfToken } from '@/lib/csrf'

/**
 * The real double-submit implementation. Until now every route suite mocked
 * `validateCsrfToken` AND `vitest.config.ts` set CSRF_DISABLED=true, so this
 * file shipped without a single test executing it.
 */
function makeRequest(headers: Record<string, string>, cookies: Record<string, string>) {
  return {
    headers: { get: (k: string) => headers[k.toLowerCase()] ?? null },
    cookies: { get: (k: string) => (cookies[k] !== undefined ? { name: k, value: cookies[k] } : undefined) },
  } as never
}

describe('validateCsrfToken', () => {
  const ORIGINAL_ENV = { ...process.env }

  beforeEach(() => {
    vi.restoreAllMocks()
    process.env = { ...ORIGINAL_ENV }
    delete process.env.CSRF_DISABLED
    Object.defineProperty(process.env, 'NODE_ENV', { value: 'test', writable: true })
  })

  afterEach(() => {
    process.env = { ...ORIGINAL_ENV }
  })

  it('accepts a request where header and cookie match', () => {
    const req = makeRequest({ 'x-csrf-token': 'abc123' }, { 'csrf-token': 'abc123' })
    expect(validateCsrfToken(req)).toBeNull()
  })

  it('rejects a missing header', () => {
    const req = makeRequest({}, { 'csrf-token': 'abc123' })
    const res = validateCsrfToken(req)
    expect(res).not.toBeNull()
    expect(res!.status).toBe(403)
  })

  it('rejects a missing cookie', () => {
    const req = makeRequest({ 'x-csrf-token': 'abc123' }, {})
    const res = validateCsrfToken(req)
    expect(res).not.toBeNull()
    expect(res!.status).toBe(403)
  })

  it('rejects both missing', () => {
    const res = validateCsrfToken(makeRequest({}, {}))
    expect(res!.status).toBe(403)
  })

  it('rejects a mismatching token', async () => {
    const req = makeRequest({ 'x-csrf-token': 'aaa' }, { 'csrf-token': 'bbb' })
    const res = validateCsrfToken(req)
    expect(res).not.toBeNull()
    expect(res!.status).toBe(403)
    const body = await res!.json()
    expect(body.error).toBe('CSRF-Token ungültig')
  })

  // timingSafeEqual throws when the buffers have different lengths; that must
  // surface as a 403, never as a 500 and never as a pass.
  it('rejects tokens of different lengths without throwing', async () => {
    const req = makeRequest({ 'x-csrf-token': 'short' }, { 'csrf-token': 'much-longer-token' })
    const res = validateCsrfToken(req)
    expect(res).not.toBeNull()
    expect(res!.status).toBe(403)
    const body = await res!.json()
    expect(body.error).toBe('CSRF-Token ungültig')
  })

  it('rejects an empty-string header even when the cookie is empty', () => {
    const req = makeRequest({ 'x-csrf-token': '' }, { 'csrf-token': '' })
    expect(validateCsrfToken(req)).not.toBeNull()
  })

  describe('kill switch', () => {
    it('is bypassed when CSRF_DISABLED=true outside production', () => {
      process.env.CSRF_DISABLED = 'true'
      const req = makeRequest({}, {})
      expect(validateCsrfToken(req)).toBeNull()
    })

    it('CANNOT be bypassed in production', () => {
      process.env.CSRF_DISABLED = 'true'
      Object.defineProperty(process.env, 'NODE_ENV', { value: 'production', writable: true })
      const req = makeRequest({}, {})
      const res = validateCsrfToken(req)
      expect(res).not.toBeNull()
      expect(res!.status).toBe(403)
    })
  })
})
