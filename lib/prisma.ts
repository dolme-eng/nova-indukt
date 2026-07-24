import { PrismaClient } from "@prisma/client"

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// No-op proxy used when DATABASE_URL is not set (build time)
const noopProxy = new Proxy({} as PrismaClient, {
  get(_, prop) {
    if (prop === '$connect' || prop === '$disconnect') return () => Promise.resolve()
    if (prop === '$transaction') return (fns: any[]) => Promise.all(fns.map((fn: any) => fn?.()))
    if (prop === '$extends') return () => noopProxy
    if (prop === Symbol.toStringTag) return 'PrismaClient'
    return new Proxy({} as any, {
      get(_m, method) {
        if (typeof method === 'symbol') return undefined
        return (..._args: any[]) => {
          if (method === 'count') return Promise.resolve(0)
          if (method === 'findFirst' || method === 'findUnique' || method === 'findUniqueOrThrow') return Promise.resolve(null)
          if (method === 'create' || method === 'update' || method === 'upsert' || method === 'delete') return Promise.resolve(null)
          return Promise.resolve([])
        }
      }
    })
  }
})

function createPrismaClient() {
  // If DATABASE_URL is not set, return no-op proxy immediately.
  // PrismaClient does NOT throw at construction — it throws at first query.
  if (!process.env.DATABASE_URL) {
    console.warn('[prisma] DATABASE_URL not set — using no-op fallback (build time)')
    return noopProxy
  }
  return new PrismaClient()
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma
