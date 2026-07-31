import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

vi.mock('@upstash/redis', () => ({
  Redis: vi.fn(() => null),
}))

import {
  isLockedOut,
  recordFailedLogin,
  recordSuccessfulLogin,
  getLoginLockoutInfo,
} from '@/lib/auth/login-lockout'

beforeEach(() => {
  vi.useFakeTimers()
})

afterEach(() => {
  vi.useRealTimers()
})

describe('login-lockout (in-memory fallback)', () => {
  it('is not locked out initially', async () => {
    const locked = await isLockedOut('test@example.com')
    expect(locked).toBe(false)
  })

  it('is not locked out after fewer than MAX_ATTEMPTS', async () => {
    for (let i = 0; i < 4; i++) {
      await recordFailedLogin('user@example.com')
    }
    const locked = await isLockedOut('user@example.com')
    expect(locked).toBe(false)
  })

  it('locks out after MAX_ATTEMPTS (5) failed logins', async () => {
    for (let i = 0; i < 5; i++) {
      await recordFailedLogin('lock@example.com')
    }
    const locked = await isLockedOut('lock@example.com')
    expect(locked).toBe(true)
  })

  it('returns remaining lockout time', async () => {
    for (let i = 0; i < 5; i++) {
      await recordFailedLogin('info@example.com')
    }
    const info = await getLoginLockoutInfo('info@example.com')
    expect(info).not.toBeNull()
    expect(info!.remainingMs).toBeGreaterThan(0)
    expect(info!.remainingMs).toBeLessThanOrEqual(30 * 60 * 1000)
  })

  it('unlocks after successful login', async () => {
    for (let i = 0; i < 5; i++) {
      await recordFailedLogin('unlock@example.com')
    }
    expect(await isLockedOut('unlock@example.com')).toBe(true)

    await recordSuccessfulLogin('unlock@example.com')
    expect(await isLockedOut('unlock@example.com')).toBe(false)
  })

  it('returns null lockout info when not locked', async () => {
    const info = await getLoginLockoutInfo('clean@example.com')
    expect(info).toBeNull()
  })

  it('resets window after WINDOW_MS expires', async () => {
    await recordFailedLogin('expire@example.com')
    await recordFailedLogin('expire@example.com')

    // Advance time past the 15-minute window
    vi.advanceTimersByTime(16 * 60 * 1000)

    // Should not be locked (window expired, counter reset)
    await recordFailedLogin('expire@example.com')
    const locked = await isLockedOut('expire@example.com')
    expect(locked).toBe(false)
  })

  it('tracks different emails independently', async () => {
    for (let i = 0; i < 5; i++) {
      await recordFailedLogin('a@example.com')
    }
    expect(await isLockedOut('a@example.com')).toBe(true)
    expect(await isLockedOut('b@example.com')).toBe(false)
  })
})
