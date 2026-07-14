import { prisma } from "@/lib/prisma"
import type { Prisma } from "@prisma/client"

export async function auditLog(params: {
  action: string
  entityType: string
  entityId: string
  userId?: string | null
  oldValues?: unknown
  newValues?: unknown
  ipAddress?: string | null
  userAgent?: string | null
}) {
  try {
    await prisma.auditLog.create({
      data: {
        action: params.action,
        entityType: params.entityType,
        entityId: params.entityId,
        userId: params.userId || null,
        oldValues: (params.oldValues ?? undefined) as Prisma.InputJsonValue | undefined,
        newValues: (params.newValues ?? undefined) as Prisma.InputJsonValue | undefined,
        ipAddress: params.ipAddress || null,
        userAgent: params.userAgent || null,
      },
    })
  } catch {
    // audit must never break business actions
  }
}

