import { describe, it, expect, vi, beforeEach } from 'vitest'

const { mockCreate } = vi.hoisted(() => ({
  mockCreate: vi.fn().mockResolvedValue({ id: 'log1' }),
}))

vi.mock('@/lib/prisma', () => ({
  prisma: {
    auditLog: {
      create: mockCreate,
    },
  },
}))

import { auditLog } from '@/lib/admin/audit'

beforeEach(() => {
  mockCreate.mockClear()
  mockCreate.mockResolvedValue({ id: 'log1' })
})

describe('auditLog', () => {
  it('does not throw on success', async () => {
    await expect(
      auditLog({
        action: 'CREATE',
        entityType: 'Product',
        entityId: 'p1',
      })
    ).resolves.toBeUndefined()
    expect(mockCreate).toHaveBeenCalledTimes(1)
  })

  it('passes all provided fields to prisma', async () => {
    await auditLog({
      action: 'UPDATE',
      entityType: 'Order',
      entityId: 'o1',
      userId: 'u1',
      oldValues: { total: 100 },
      newValues: { total: 200 },
      ipAddress: '1.2.3.4',
      userAgent: 'Mozilla/5.0',
    })
    expect(mockCreate).toHaveBeenCalledWith({
      data: {
        action: 'UPDATE',
        entityType: 'Order',
        entityId: 'o1',
        userId: 'u1',
        oldValues: { total: 100 },
        newValues: { total: 200 },
        ipAddress: '1.2.3.4',
        userAgent: 'Mozilla/5.0',
      },
    })
  })

  it('handles missing optional fields gracefully', async () => {
    await auditLog({
      action: 'DELETE',
      entityType: 'User',
      entityId: 'u2',
    })
    expect(mockCreate).toHaveBeenCalledWith({
      data: {
        action: 'DELETE',
        entityType: 'User',
        entityId: 'u2',
        userId: null,
        oldValues: undefined,
        newValues: undefined,
        ipAddress: null,
        userAgent: null,
      },
    })
  })

  it('does not throw when prisma throws (audit must not break business)', async () => {
    mockCreate.mockRejectedValueOnce(new Error('DB down'))
    await expect(
      auditLog({
        action: 'CREATE',
        entityType: 'Product',
        entityId: 'p1',
      })
    ).resolves.toBeUndefined()
  })

  it('converts null optional fields to null for prisma', async () => {
    await auditLog({
      action: 'LOGIN',
      entityType: 'Session',
      entityId: 's1',
      userId: null,
      ipAddress: null,
      userAgent: null,
    })
    const callData = mockCreate.mock.calls[0][0] as any
    expect(callData.data.userId).toBeNull()
    expect(callData.data.ipAddress).toBeNull()
    expect(callData.data.userAgent).toBeNull()
  })
})
