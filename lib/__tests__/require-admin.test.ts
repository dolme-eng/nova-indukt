import { describe, it, expect, vi, beforeEach } from 'vitest'

const mockAuth = vi.hoisted(() => vi.fn())

vi.mock('@/lib/auth', () => ({ auth: mockAuth }))

const { requireAdmin } = await import('@/lib/admin/require-admin')

/**
 * requireAdmin is the single gate for every /api/admin/** handler. It was
 * mocked in all four admin suites, so the actual `role !== 'ADMIN'` → 403
 * branch had never been executed by a test.
 */
describe('requireAdmin', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns 401 when there is no session', async () => {
    mockAuth.mockResolvedValue(null)
    const result = await requireAdmin()
    expect(result).toEqual({ ok: false, status: 401, session: null })
  })

  it('returns 401 when the session has no user', async () => {
    mockAuth.mockResolvedValue({ user: undefined })
    const result = await requireAdmin()
    expect(result.ok).toBe(false)
    expect(result.status).toBe(401)
  })

  it('returns 403 for a logged-in non-admin user', async () => {
    const session = { user: { id: 'u1', role: 'USER' } }
    mockAuth.mockResolvedValue(session)
    const result = await requireAdmin()
    expect(result.ok).toBe(false)
    expect(result.status).toBe(403)
    // The session is returned so handlers can log who attempted the action.
    expect(result.session).toEqual(session)
  })

  it('returns 403 when the role is missing entirely', async () => {
    // A revoked token yields a truthy session whose user fields are undefined.
    mockAuth.mockResolvedValue({ user: { id: 'u1' } })
    const result = await requireAdmin()
    expect(result.ok).toBe(false)
    expect(result.status).toBe(403)
  })

  it('returns 403 for an unexpected role value', async () => {
    mockAuth.mockResolvedValue({ user: { id: 'u1', role: 'SUPERADMIN' } })
    const result = await requireAdmin()
    expect(result.ok).toBe(false)
    expect(result.status).toBe(403)
  })

  it('grants access to an ADMIN', async () => {
    const session = { user: { id: 'admin1', role: 'ADMIN' } }
    mockAuth.mockResolvedValue(session)
    const result = await requireAdmin()
    expect(result).toEqual({ ok: true, status: 200, session })
  })

  it('never returns a 200 for a non-admin, whatever the case ordering', async () => {
    mockAuth.mockResolvedValue({ user: { id: 'u1', role: 'USER' } })
    const result = await requireAdmin()
    expect(result.status).not.toBe(200)
  })

  it('propagates an auth() failure instead of swallowing it', async () => {
    mockAuth.mockRejectedValue(new Error('session store down'))
    await expect(requireAdmin()).rejects.toThrow('session store down')
  })
})
