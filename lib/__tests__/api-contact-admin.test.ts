import { describe, it, expect, vi, beforeEach } from 'vitest'

const mockSession = vi.hoisted(() => ({ user: { id: 'admin1', role: 'ADMIN', name: 'Admin' } }))
const mockRequireAdmin = vi.hoisted(() => vi.fn())

vi.mock('@/lib/admin/require-admin', () => ({
  requireAdmin: mockRequireAdmin,
}))

vi.mock('@/lib/prisma', () => ({
  prisma: {
    contactMessage: {
      findUnique: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
  },
}))

vi.mock('@/lib/admin/audit', () => ({
  auditLog: vi.fn().mockResolvedValue(undefined),
}))

vi.mock('@/lib/logger', () => ({
  logError: vi.fn(),
}))

import { PATCH, DELETE } from '@/app/api/admin/contact/[id]/route'
import { prisma } from '@/lib/prisma'
import { NextRequest } from 'next/server'

const existingMessage = {
  id: 'msg1',
  name: 'Max Mustermann',
  email: 'max@example.de',
  subject: 'Frage zum Produkt',
  message: 'Ich habe eine Frage.',
  status: 'NEW',
  createdAt: new Date('2026-01-15'),
}

function makeRequest(method: string, body?: unknown) {
  return new NextRequest(
    new Request('https://example.com/api/admin/contact/msg1', {
      method,
      headers: { 'Content-Type': 'application/json' },
      ...(body ? { body: JSON.stringify(body) } : {}),
    })
  )
}

describe('PATCH /api/admin/contact/[id]', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockRequireAdmin.mockResolvedValue({ ok: true, status: 200, session: mockSession })
    ;(prisma.contactMessage.findUnique as ReturnType<typeof vi.fn>).mockResolvedValue(
      existingMessage
    )
    ;(prisma.contactMessage.update as ReturnType<typeof vi.fn>).mockResolvedValue({
      ...existingMessage,
      status: 'IN_PROGRESS',
    })
  })

  it('updates message status (200)', async () => {
    const req = makeRequest('PATCH', { status: 'IN_PROGRESS' })
    const res = await PATCH(req, { params: Promise.resolve({ id: 'msg1' }) })
    const data = await res.json()

    expect(res.status).toBe(200)
    expect(data.data.status).toBe('IN_PROGRESS')
    expect(prisma.contactMessage.update).toHaveBeenCalledWith({
      where: { id: 'msg1' },
      data: { status: 'IN_PROGRESS' },
    })
  })

  it('rejects invalid status (400)', async () => {
    const req = makeRequest('PATCH', { status: 'INVALID' })
    const res = await PATCH(req, { params: Promise.resolve({ id: 'msg1' }) })

    expect(res.status).toBe(400)
  })

  it('returns 404 for non-existent message', async () => {
    ;(prisma.contactMessage.findUnique as ReturnType<typeof vi.fn>).mockResolvedValue(null)
    const req = makeRequest('PATCH', { status: 'RESOLVED' })
    const res = await PATCH(req, { params: Promise.resolve({ id: 'nonexistent' }) })

    expect(res.status).toBe(404)
  })

  it('rejects non-admin users (403)', async () => {
    mockRequireAdmin.mockResolvedValue({
      ok: false,
      status: 403,
      session: { user: { role: 'KUNDE' } },
    })
    const req = makeRequest('PATCH', { status: 'RESOLVED' })
    const res = await PATCH(req, { params: Promise.resolve({ id: 'msg1' }) })

    expect(res.status).toBe(403)
  })

  it('rejects unauthenticated users (401)', async () => {
    mockRequireAdmin.mockResolvedValue({ ok: false, status: 401, session: null })
    const req = makeRequest('PATCH', { status: 'RESOLVED' })
    const res = await PATCH(req, { params: Promise.resolve({ id: 'msg1' }) })

    expect(res.status).toBe(401)
  })

  it('returns 500 on database error', async () => {
    ;(prisma.contactMessage.findUnique as ReturnType<typeof vi.fn>).mockRejectedValue(
      new Error('DB error')
    )
    const req = makeRequest('PATCH', { status: 'RESOLVED' })
    const res = await PATCH(req, { params: Promise.resolve({ id: 'msg1' }) })

    expect(res.status).toBe(500)
  })

  it('accepts all valid statuses', async () => {
    for (const status of ['NEW', 'IN_PROGRESS', 'RESOLVED', 'SPAM']) {
      mockRequireAdmin.mockResolvedValue({ ok: true, status: 200, session: mockSession })
      ;(prisma.contactMessage.findUnique as ReturnType<typeof vi.fn>).mockResolvedValue(
        existingMessage
      )
      ;(prisma.contactMessage.update as ReturnType<typeof vi.fn>).mockResolvedValue({
        ...existingMessage,
        status,
      })
      const req = makeRequest('PATCH', { status })
      const res = await PATCH(req, { params: Promise.resolve({ id: 'msg1' }) })
      expect(res.status).toBe(200)
    }
  })
})

describe('DELETE /api/admin/contact/[id]', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockRequireAdmin.mockResolvedValue({ ok: true, status: 200, session: mockSession })
    ;(prisma.contactMessage.findUnique as ReturnType<typeof vi.fn>).mockResolvedValue(
      existingMessage
    )
    ;(prisma.contactMessage.delete as ReturnType<typeof vi.fn>).mockResolvedValue(existingMessage)
  })

  it('deletes a message (200)', async () => {
    const req = makeRequest('DELETE')
    const res = await DELETE(req, { params: Promise.resolve({ id: 'msg1' }) })
    const data = await res.json()

    expect(res.status).toBe(200)
    expect(data.success).toBe(true)
    expect(prisma.contactMessage.delete).toHaveBeenCalledWith({ where: { id: 'msg1' } })
  })

  it('returns 404 for non-existent message', async () => {
    ;(prisma.contactMessage.findUnique as ReturnType<typeof vi.fn>).mockResolvedValue(null)
    const req = makeRequest('DELETE')
    const res = await DELETE(req, { params: Promise.resolve({ id: 'nonexistent' }) })

    expect(res.status).toBe(404)
  })

  it('rejects non-admin users (403)', async () => {
    mockRequireAdmin.mockResolvedValue({
      ok: false,
      status: 403,
      session: { user: { role: 'KUNDE' } },
    })
    const req = makeRequest('DELETE')
    const res = await DELETE(req, { params: Promise.resolve({ id: 'msg1' }) })

    expect(res.status).toBe(403)
  })

  it('returns 500 on database error', async () => {
    ;(prisma.contactMessage.findUnique as ReturnType<typeof vi.fn>).mockRejectedValue(
      new Error('DB error')
    )
    const req = makeRequest('DELETE')
    const res = await DELETE(req, { params: Promise.resolve({ id: 'msg1' }) })

    expect(res.status).toBe(500)
  })
})
