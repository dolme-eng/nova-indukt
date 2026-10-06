import { PrismaClient } from '@prisma/client'
import { logWarn, logError } from '@/lib/logger'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

/**
 * No-op proxy used when DATABASE_URL is not set.
 *
 * Purpose: `next build` must succeed without a live database (first Vercel
 * deploy, CI). PrismaClient does not throw at construction — only at first
 * query — so pages that read during prerender need something inert.
 *
 * Every branch below must mirror what the real method returns, because callers
 * destructure the result. Anything not listed falls through to `[]`, which is
 * silently wrong for `aggregate`, `groupBy`, `updateMany`, `deleteMany` and
 * `findFirstOrThrow` (which throws when the row is missing).
 */
const noopProxy = new Proxy({} as PrismaClient, {
  get(_, prop) {
    if (prop === '$connect' || prop === '$disconnect') return () => Promise.resolve()
    if (prop === '$transaction') return (fns: Array<() => Promise<unknown>>) => Promise.all(fns.map((fn) => fn?.()))
    if (prop === '$extends') return () => noopProxy
    if (prop === '$queryRaw' || prop === '$queryRawUnsafe') return () => Promise.resolve([])
    if (prop === '$queryRawUnsafe') return () => Promise.resolve([])
    // $executeRaw returns the affected row count, not rows.
    if (prop === '$executeRaw' || prop === '$executeRawUnsafe') return () => Promise.resolve(0)
    if (prop === Symbol.toStringTag) return 'PrismaClient'

    return new Proxy({} as object, {
      get(_m, method) {
        if (typeof method === 'symbol') return undefined
        return (..._args: unknown[]) => {
          void _args
          switch (method) {
            // Aggregates
            case 'count':
              return Promise.resolve(0)
            case 'aggregate':
              return Promise.resolve({ _count: 0, _sum: {}, _avg: {}, _min: {}, _max: {} })
            case 'groupBy':
              return Promise.resolve([])
            // Reads
            case 'findFirst':
            case 'findUnique':
            case 'findFirstOrThrow':
            case 'findUniqueOrThrow':
              // The *OrThrow variants must reject, otherwise a "not found"
              // silently reads as `null` and the caller keeps going.
              if (method.endsWith('OrThrow')) {
                return Promise.reject(
                  new Error(`[prisma] no-op fallback: ${String(method)} called without DATABASE_URL`)
                )
              }
              return Promise.resolve(null)
            // Writes
            case 'create':
            case 'update':
            case 'upsert':
            case 'delete':
              return Promise.resolve(null)
            case 'createMany':
            case 'updateMany':
            case 'deleteMany':
              return Promise.resolve({ count: 0 })
            default:
              return Promise.resolve([])
          }
        }
      },
    })
  },
})

function createPrismaClient() {
  if (process.env.DATABASE_URL) {
    return new PrismaClient()
  }

  // Production without a database is a misconfiguration, not a build step.
  // Silently serving an empty shop (or empty admin dashboard) hides a typo in
  // the variable name until a customer reports an empty catalogue.
  if (process.env.NODE_ENV === 'production') {
    logError(
      '[prisma] DATABASE_URL is not set in production. Refusing to serve empty ' +
        'data — check the environment variable name (DATABASE_URL vs database_url).'
    )
    throw new Error(
      'DATABASE_URL is required in production. Refusing to start with the no-op database fallback.'
    )
  }

  logWarn('[prisma] DATABASE_URL not set — using no-op fallback (build/dev only)')
  return noopProxy
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient()

// Keep the singleton in dev only: on serverless each cold start gets its own
// process, and a module-level cache would pin a stale connection pool.
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

/**
 * True when the no-op fallback is active. Callers that must not degrade
 * silently (checkout, auth) can assert on it instead of trusting an empty
 * result to mean "no data".
 */
export const isDatabaseStub = !process.env.DATABASE_URL
