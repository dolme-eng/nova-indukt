import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextRequest } from 'next/server'

const { mockPrisma, mockRateLimit, mockSendEmail, mockHashPassword } = vi.hoisted(() => ({
  mockPrisma: {
    user: {
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
    },
  },
  mockRateLimit: vi.fn(),
  mockSendEmail: vi.fn(),
  mockHashPassword: vi.fn(),
}))

vi.mock('@/lib/prisma', () => ({ prisma: mockPrisma }))
vi.mock('@/lib/rate-limit', () => ({
  rateLimit: mockRateLimit,
  getIP: () => '127.0.0.1',
  createRateLimitKey: (ip: string, route: string) => `${ip}:${route}`,
}))
vi.mock('@/lib/email/send', () => ({
  sendEmailWithRetry: mockSendEmail,
  sendPasswordResetEmail: mockSendEmail,
  FROM_EMAIL: 'test@nova.de',
  FROM_NAME: 'NOVA',
}))
vi.mock('@/lib/auth/auth.config', () => ({
  hashPassword: mockHashPassword,
}))
vi.mock('crypto', () => ({
  default: {
    randomBytes: (n: number) => ({
      toString: () => 'a'.repeat(n * 2),
    }),
  },
}))
vi.mock('@react-email/render', () => ({
  render: vi.fn(async () => '<html>email</html>'),
}))
vi.mock('@/lib/email/templates/email-verification', () => ({
  default: () => ({}),
}))
vi.mock('@/lib/logger', () => ({
  logError: vi.fn(),
}))

const { POST: registerPOST } = await import('@/app/api/auth/register/route')
const { POST: forgotPOST } = await import('@/app/api/auth/forgot-password/route')

function makeRequest(body: unknown) {
  return new NextRequest('http://localhost/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
}

describe('POST /api/auth/register', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockRateLimit.mockResolvedValue({ success: true })
    mockHashPassword.mockResolvedValue('hashed_password')
    mockPrisma.user.findUnique.mockResolvedValue(null)
    mockPrisma.user.create.mockResolvedValue({})
    mockSendEmail.mockResolvedValue({ data: {} })
  })

  it('registers a new user successfully', async () => {
    const res = await registerPOST(
      makeRequest({ name: 'Max Mustermann', email: 'max@test.de', password: 'Test1234!' })
    )
    const json = await res.json()
    expect(res.status).toBe(200)
    expect(json.success).toBe(true)
    expect(mockPrisma.user.create).toHaveBeenCalled()
    expect(mockSendEmail).toHaveBeenCalled()
  })

  it('returns 400 for invalid email', async () => {
    const res = await registerPOST(
      makeRequest({ name: 'Max', email: 'invalid', password: 'Test1234!' })
    )
    const json = await res.json()
    expect(res.status).toBe(400)
    expect(json.success).toBe(false)
    expect(json.error).toBeDefined()
  })

  it('returns 400 for short name', async () => {
    const res = await registerPOST(
      makeRequest({ name: 'A', email: 'max@test.de', password: 'Test1234!' })
    )
    const json = await res.json()
    expect(res.status).toBe(400)
    expect(json.success).toBe(false)
  })

  it('returns 400 for weak password (no uppercase)', async () => {
    const res = await registerPOST(
      makeRequest({ name: 'Max Mustermann', email: 'max@test.de', password: 'test1234!' })
    )
    const json = await res.json()
    expect(res.status).toBe(400)
    expect(json.success).toBe(false)
  })

  it('returns 400 for weak password (no number)', async () => {
    const res = await registerPOST(
      makeRequest({ name: 'Max Mustermann', email: 'max@test.de', password: 'TestTest!' })
    )
    const json = await res.json()
    expect(res.status).toBe(400)
    expect(json.success).toBe(false)
  })

  it('returns 400 for weak password (no special char)', async () => {
    const res = await registerPOST(
      makeRequest({ name: 'Max Mustermann', email: 'max@test.de', password: 'TestTest1234' })
    )
    const json = await res.json()
    expect(res.status).toBe(400)
    expect(json.success).toBe(false)
  })

  it('returns success even if user already exists (email enumeration protection)', async () => {
    mockPrisma.user.findUnique.mockResolvedValue({ id: 'existing' })
    const res = await registerPOST(
      makeRequest({ name: 'Max Mustermann', email: 'existing@test.de', password: 'Test1234!' })
    )
    const json = await res.json()
    expect(res.status).toBe(200)
    expect(json.success).toBe(true)
    expect(mockPrisma.user.create).not.toHaveBeenCalled()
  })

  it('returns 429 when rate limited', async () => {
    mockRateLimit.mockResolvedValue({ success: false })
    const res = await registerPOST(
      makeRequest({ name: 'Max Mustermann', email: 'max@test.de', password: 'Test1234!' })
    )
    const json = await res.json()
    expect(res.status).toBe(429)
    expect(json.success).toBe(false)
  })

  it('returns 500 on server error', async () => {
    mockPrisma.user.create.mockRejectedValue(new Error('DB error'))
    const res = await registerPOST(
      makeRequest({ name: 'Max Mustermann', email: 'max@test.de', password: 'Test1234!' })
    )
    const json = await res.json()
    expect(res.status).toBe(500)
    expect(json.success).toBe(false)
  })

  it('lowercases email before storing', async () => {
    await registerPOST(
      makeRequest({ name: 'Max Mustermann', email: 'MAX@TEST.DE', password: 'Test1234!' })
    )
    expect(mockPrisma.user.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ email: 'max@test.de' }),
      })
    )
  })

  it('returns 400 for empty body', async () => {
    const res = await registerPOST(makeRequest({}))
    const json = await res.json()
    expect(res.status).toBe(400)
    expect(json.success).toBe(false)
  })

  it('hashes the password', async () => {
    await registerPOST(
      makeRequest({ name: 'Max Mustermann', email: 'max@test.de', password: 'Test1234!' })
    )
    expect(mockHashPassword).toHaveBeenCalledWith('Test1234!')
  })
})

describe('POST /api/auth/forgot-password', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockRateLimit.mockResolvedValue({ success: true })
    mockPrisma.user.findUnique.mockResolvedValue(null)
    mockPrisma.user.update.mockResolvedValue({})
    mockSendEmail.mockResolvedValue({})
  })

  it('returns success for non-existent email (enumeration protection)', async () => {
    mockPrisma.user.findUnique.mockResolvedValue(null)
    const res = await forgotPOST(makeRequest({ email: 'unknown@test.de' }))
    const json = await res.json()
    expect(res.status).toBe(200)
    expect(json.success).toBe(true)
  })

  it('returns success for existing user', async () => {
    mockPrisma.user.findUnique.mockResolvedValue({ id: 'u1', email: 'max@test.de', name: 'Max' })
    const res = await forgotPOST(makeRequest({ email: 'max@test.de' }))
    const json = await res.json()
    expect(res.status).toBe(200)
    expect(json.success).toBe(true)
    expect(mockPrisma.user.update).toHaveBeenCalled()
  })

  it('returns 400 for invalid email', async () => {
    const res = await forgotPOST(makeRequest({ email: 'not-an-email' }))
    const json = await res.json()
    expect(res.status).toBe(400)
    expect(json.error).toBeDefined()
  })

  it('returns 429 when rate limited', async () => {
    mockRateLimit.mockResolvedValue({ success: false })
    const res = await forgotPOST(makeRequest({ email: 'max@test.de' }))
    await res.json()
    expect(res.status).toBe(429)
  })

  it('returns 500 on server error', async () => {
    mockPrisma.user.findUnique.mockRejectedValue(new Error('DB error'))
    const res = await forgotPOST(makeRequest({ email: 'max@test.de' }))
    await res.json()
    expect(res.status).toBe(500)
  })

  it('still returns success even if email sending fails', async () => {
    mockPrisma.user.findUnique.mockResolvedValue({ id: 'u1', email: 'max@test.de', name: 'Max' })
    mockSendEmail.mockRejectedValue(new Error('Email error'))
    const res = await forgotPOST(makeRequest({ email: 'max@test.de' }))
    const json = await res.json()
    expect(res.status).toBe(200)
    expect(json.success).toBe(true)
  })

  it('updates user with reset token', async () => {
    mockPrisma.user.findUnique.mockResolvedValue({ id: 'u1', email: 'max@test.de', name: 'Max' })
    await forgotPOST(makeRequest({ email: 'max@test.de' }))
    expect(mockPrisma.user.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: 'u1' },
        data: expect.objectContaining({ resetToken: expect.any(String) }),
      })
    )
  })
})
