import { describe, it, expect, vi, beforeEach } from 'vitest'
import { verifyRecaptcha } from '../recaptcha'

/* eslint-disable @typescript-eslint/no-explicit-any */
function mockRequest(headers: Record<string, string> = {}): any {
  return {
    headers: {
      get: (key: string) => headers[key] ?? null,
    },
  } as any
}
/* eslint-enable @typescript-eslint/no-explicit-any */

describe('verifyRecaptcha', () => {
  const ORIGINAL_ENV = { ...process.env }

  beforeEach(() => {
    vi.restoreAllMocks()
    process.env = { ...ORIGINAL_ENV }
    delete process.env.RECAPTCHA_SECRET_KEY
  })

  it('returns null (skip) when RECAPTCHA_SECRET_KEY is not set', async () => {
    const result = await verifyRecaptcha(mockRequest(), 'checkout')
    expect(result).toBeNull()
  })

  it('returns 403 when token header is missing', async () => {
    process.env.RECAPTCHA_SECRET_KEY = 'test-secret'
    const result = await verifyRecaptcha(mockRequest(), 'checkout')
    expect(result).not.toBeNull()
    expect(result!.status).toBe(403)
    const body = await result!.json()
    expect(body.error).toBe('reCAPTCHA-Token fehlt')
  })

  it('returns null (success) when verification passes with high score', async () => {
    process.env.RECAPTCHA_SECRET_KEY = 'test-secret'

    vi.spyOn(global, 'fetch').mockResolvedValueOnce(
      new Response(JSON.stringify({ success: true, score: 0.9, action: 'checkout' }))
    )

    const result = await verifyRecaptcha(
      mockRequest({ 'x-recaptcha-token': 'valid-token' }),
      'checkout'
    )
    expect(result).toBeNull()
  })

  it('returns 403 when score is below threshold', async () => {
    process.env.RECAPTCHA_SECRET_KEY = 'test-secret'

    vi.spyOn(global, 'fetch').mockResolvedValueOnce(
      new Response(JSON.stringify({ success: true, score: 0.2, action: 'checkout' }))
    )

    const result = await verifyRecaptcha(
      mockRequest({ 'x-recaptcha-token': 'bot-token' }),
      'checkout'
    )
    expect(result).not.toBeNull()
    expect(result!.status).toBe(403)
    const body = await result!.json()
    expect(body.error).toBe('Verdächtige Aktivität erkannt')
  })

  it('returns 403 when action mismatches', async () => {
    process.env.RECAPTCHA_SECRET_KEY = 'test-secret'

    vi.spyOn(global, 'fetch').mockResolvedValueOnce(
      new Response(JSON.stringify({ success: true, score: 0.9, action: 'wrong_action' }))
    )

    const result = await verifyRecaptcha(
      mockRequest({ 'x-recaptcha-token': 'valid-token' }),
      'checkout'
    )
    expect(result).not.toBeNull()
    expect(result!.status).toBe(403)
    const body = await result!.json()
    expect(body.error).toBe('reCAPTCHA-Aktion ungültig')
  })

  it('returns 403 when Google returns success: false', async () => {
    process.env.RECAPTCHA_SECRET_KEY = 'test-secret'

    vi.spyOn(global, 'fetch').mockResolvedValueOnce(
      new Response(JSON.stringify({ success: false, 'error-codes': ['invalid-input-response'] }))
    )

    const result = await verifyRecaptcha(
      mockRequest({ 'x-recaptcha-token': 'invalid-token' }),
      'checkout'
    )
    expect(result).not.toBeNull()
    expect(result!.status).toBe(403)
    const body = await result!.json()
    expect(body.error).toBe('reCAPTCHA-Verifizierung fehlgeschlagen')
  })

  it('fails open when fetch throws (Google API unreachable) in dev', async () => {
    process.env.RECAPTCHA_SECRET_KEY = 'test-secret'
    Object.defineProperty(process.env, 'NODE_ENV', { value: 'test', writable: true })

    vi.spyOn(global, 'fetch').mockRejectedValueOnce(new Error('Network error'))

    const result = await verifyRecaptcha(
      mockRequest({ 'x-recaptcha-token': 'valid-token' }),
      'checkout'
    )
    expect(result).toBeNull()
  })

  it('fails closed when fetch throws in production', async () => {
    process.env.RECAPTCHA_SECRET_KEY = 'test-secret'
    Object.defineProperty(process.env, 'NODE_ENV', { value: 'production', writable: true })

    vi.spyOn(global, 'fetch').mockRejectedValueOnce(new Error('Network error'))

    const result = await verifyRecaptcha(
      mockRequest({ 'x-recaptcha-token': 'valid-token' }),
      'checkout'
    )
    expect(result).not.toBeNull()
    expect(result!.status).toBe(403)

    Object.defineProperty(process.env, 'NODE_ENV', { value: 'test', writable: true })
  })

  it('sends remoteip when x-forwarded-for is present', async () => {
    process.env.RECAPTCHA_SECRET_KEY = 'test-secret'

    const fetchSpy = vi
      .spyOn(global, 'fetch')
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ success: true, score: 0.9, action: 'contact' }))
      )

    const req = {
      headers: {
        get: (key: string) => {
          if (key === 'x-recaptcha-token') return 'token'
          if (key === 'x-forwarded-for') return '1.2.3.4, 5.6.7.8'
          return null
        },
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any

    const result = await verifyRecaptcha(req, 'contact')
    expect(result).toBeNull()

    const call = fetchSpy.mock.calls[0]
    const body = (call?.[1] as { body?: URLSearchParams })?.body as URLSearchParams
    expect(body.get('remoteip')).toBe('1.2.3.4')
  })
})
