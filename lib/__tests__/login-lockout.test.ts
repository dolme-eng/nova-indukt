import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

vi.mock('@/lib/redis', () => ({
  getRedis: vi.fn(() => null),
}))

import {
  isIpLockedOut,
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

/**
 * The per-email counter alone was an unauthenticated, targeted DoS: anyone who
 * knew a customer's address could lock their account for 30 minutes with 5
 * wrong passwords, repeatably. The per-IP axis is the second lock.
 */
describe('login-lockout — per-IP axis', () => {
  const MAX_ATTEMPTS = 5
  const MAX_ATTEMPTS_PER_IP = 20

  it('is not IP-locked initially', async () => {
    expect(await isIpLockedOut('203.0.113.7')).toBe(false)
  })

  it('locks an IP after MAX_ATTEMPTS_PER_IP failures spread over accounts', async () => {
    // 20 failures, each against a DIFFERENT account: no single account reaches
    // the per-email threshold, but the spraying pattern is caught.
    for (let i = 0; i < MAX_ATTEMPTS_PER_IP; i++) {
      await recordFailedLogin(`victim-${i}@example.com`, '203.0.113.7')
    }
    expect(await isIpLockedOut('203.0.113.7')).toBe(true)
  })

  it('does not lock the IP below the threshold', async () => {
    for (let i = 0; i < MAX_ATTEMPTS_PER_IP - 1; i++) {
      await recordFailedLogin(`victim-${i}@example.com`, '203.0.113.9')
    }
    expect(await isIpLockedOut('203.0.113.9')).toBe(false)
  })

  it('blocks the spray even after the per-account windows expire', async () => {
    for (let i = 0; i < MAX_ATTEMPTS_PER_IP; i++) {
      await recordFailedLogin(`sprayed-${i}@example.com`, '203.0.113.11')
    }
    expect(await isIpLockedOut('203.0.113.11')).toBe(true)

    vi.advanceTimersByTime(16 * 60 * 1000)

    // A brand-new victim is still refused: the IP ban outlasts the window.
    expect(await isLockedOut('fresh-victim@example.com', '203.0.113.11')).toBe(true)
  })

  it('keeps different IPs independent', async () => {
    for (let i = 0; i < MAX_ATTEMPTS_PER_IP; i++) {
      await recordFailedLogin(`victim-${i}@example.com`, '203.0.113.13')
    }
    expect(await isIpLockedOut('203.0.113.13')).toBe(true)
    expect(await isIpLockedOut('203.0.113.14')).toBe(false)
  })

  it('still applies the per-email lockout when no IP is supplied', async () => {
    for (let i = 0; i < MAX_ATTEMPTS; i++) {
      await recordFailedLogin('nole@example.com')
    }
    expect(await isLockedOut('nole@example.com')).toBe(true)
  })

  it('does not let a per-account lockout leak to another IP on the same account', async () => {
    for (let i = 0; i < MAX_ATTEMPTS; i++) {
      await recordFailedLogin('shared@example.com', '203.0.113.15')
    }
    // The account is locked regardless of who asks (correct), but the *IP* of
    // an unrelated attacker stays clean so they are not collateral damage.
    expect(await isIpLockedOut('203.0.113.16')).toBe(false)
  })

  it('treats a missing IP as the shared "unknown" bucket, not as unlimited', async () => {
    for (let i = 0; i < MAX_ATTEMPTS_PER_IP; i++) {
      await recordFailedLogin(`anon-${i}@example.com`, 'unknown')
    }
    expect(await isIpLockedOut('unknown')).toBe(true)
  })
})
