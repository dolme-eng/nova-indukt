import { PrismaClient } from "@prisma/client"

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

function createPrismaClient() {
  try {
    return new PrismaClient()
  } catch {
    // DATABASE_URL not set (build time) — return no-op proxy
    console.warn('[prisma] DATABASE_URL not set — using no-op fallback')
    return new Proxy({} as PrismaClient, {
      get(_, prop) {
        if (prop === '$connect' || prop === '$disconnect') return () => Promise.resolve()
        if (prop === '$transaction') return (fns: any[]) => Promise.all(fns.map((fn: any) => fn?.()))
        if (prop === '$extends') return () => createPrismaClient()
        if (prop === Symbol.toStringTag) return 'PrismaClient'
        // Model accessor: prisma.product, prisma.category, etc.
        return new Proxy({} as any, {
          get(_m, method) {
            if (typeof method === 'symbol') return undefined
            return (..._args: any[]) => {
              if (method === 'count') return Promise.resolve(0)
              if (method === 'findFirst' || method === 'findUnique' || method === 'findUniqueOrThrow') return Promise.resolve(null)
              if (method === 'create' || method === 'update' || method === 'upsert' || method === 'delete') return Promise.resolve(null)
              return Promise.resolve([]) // findMany, etc.
            }
          }
        })
      }
    })
  }
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma
