import { describe, it, expect, vi, beforeEach } from 'vitest'

const { mockAuthFn, mockPrismaUser } = vi.hoisted(() => ({
  mockAuthFn: vi.fn(),
  mockPrismaUser: { findUnique: vi.fn() },
}))

vi.mock('next-auth', () => ({
  default: vi.fn(() => ({
    handlers: {},
    auth: mockAuthFn,
    signOut: vi.fn(),
    signIn: vi.fn(),
  })),
}))

vi.mock('next-auth/providers/credentials', () => ({
  default: vi.fn(() => ({})),
}))

vi.mock('@/lib/auth/auth.config', () => ({
  authConfig: {},
  verifyPassword: vi.fn(),
}))

vi.mock('@/lib/auth/login-lockout', () => ({
  isLockedOut: vi.fn(() => false),
  recordFailedLogin: vi.fn(),
  recordSuccessfulLogin: vi.fn(),
}))

vi.mock('@/lib/prisma', () => ({
  prisma: {
    user: mockPrismaUser,
  },
}))

import { prisma } from '@/lib/prisma'

async function requireAuth() {
  const session = await mockAuthFn()
  if (!session?.user) {
    throw new Error('Unauthorized')
  }
  return session
}

async function getCurrentUser() {
  const session = await mockAuthFn()
  if (!session?.user?.id) {
    return null
  }
  return prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      addresses: true,
      wishlist: { include: { product: true } },
    },
  })
}

beforeEach(() => {
  vi.clearAllMocks()
})

describe('requireAuth', () => {
  it('throws Unauthorized when no session exists', async () => {
    mockAuthFn.mockResolvedValue(null)
    await expect(requireAuth()).rejects.toThrow('Unauthorized')
  })

  it('throws Unauthorized when session has no user', async () => {
    mockAuthFn.mockResolvedValue({ user: undefined })
    await expect(requireAuth()).rejects.toThrow('Unauthorized')
  })

  it('returns session when user exists', async () => {
    const session = { user: { id: 'u1', email: 'a@b.com', role: 'USER' } }
    mockAuthFn.mockResolvedValue(session)
    const result = await requireAuth()
    expect(result).toEqual(session)
  })
})

describe('getCurrentUser', () => {
  it('returns null when no session', async () => {
    mockAuthFn.mockResolvedValue(null)
    const result = await getCurrentUser()
    expect(result).toBeNull()
  })

  it('returns null when session has no user id', async () => {
    mockAuthFn.mockResolvedValue({ user: {} })
    const result = await getCurrentUser()
    expect(result).toBeNull()
  })

  it('fetches full user from db when session exists', async () => {
    mockAuthFn.mockResolvedValue({ user: { id: 'u1' } })
    const fakeUser = { id: 'u1', name: 'Test', addresses: [], wishlist: [] }
    mockPrismaUser.findUnique.mockResolvedValue(fakeUser)

    const result = await getCurrentUser()
    expect(mockPrismaUser.findUnique).toHaveBeenCalledWith({
      where: { id: 'u1' },
      include: { addresses: true, wishlist: { include: { product: true } } },
    })
    expect(result).toEqual(fakeUser)
  })
})
