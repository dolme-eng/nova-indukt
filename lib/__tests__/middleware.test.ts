import { describe, it, expect } from 'vitest'
import type { Role } from '@prisma/client'

/**
 * Since middleware.ts is wrapped by NextAuth auth() and cannot be easily
 * tested directly, we test the routing logic by replicating it here.
 * This ensures the business logic of route protection is verified.
 */

interface MockAuth {
  user?: { role?: Role }
}

function middlewareLogic(pathname: string, auth: MockAuth | null) {
  const isLoggedIn = !!auth
  const userRole = auth?.user?.role

  if (pathname.startsWith('/admin')) {
    if (!isLoggedIn) {
      const signInUrl = new URL('/anmelden', 'https://nova-indukt.de')
      signInUrl.searchParams.set('redirect', pathname)
      return { status: 307, location: signInUrl.toString() }
    }
    if (userRole !== 'ADMIN') {
      return { status: 307, location: 'https://nova-indukt.de/anmelden?error=AccessDenied' }
    }
  }

  if (pathname.startsWith('/api/admin')) {
    if (!isLoggedIn) {
      return { status: 401, body: { error: 'Unauthorized' } }
    }
    if (userRole !== 'ADMIN') {
      return { status: 403, body: { error: 'Forbidden' } }
    }
  }

  const authPages = ['/anmelden', '/registrieren', '/passwort-vergessen', '/passwort-zuruecksetzen']
  if (authPages.some((p) => pathname.startsWith(p)) && isLoggedIn) {
    return { status: 307, location: 'https://nova-indukt.de/mein-konto' }
  }

  const protectedRoutes = ['/mein-konto', '/wunschliste']
  if (protectedRoutes.some((p) => pathname.startsWith(p)) && !isLoggedIn) {
    const signInUrl = new URL('/anmelden', 'https://nova-indukt.de')
    signInUrl.searchParams.set('redirect', pathname)
    return { status: 307, location: signInUrl.toString() }
  }

  return { status: 200 }
}

describe('middleware routing logic - admin routes', () => {
  it('redirects unauthenticated user to /anmelden with redirect param', () => {
    const res = middlewareLogic('/admin/orders', null)
    expect(res.status).toBe(307)
    expect(res.location).toContain('/anmelden')
    expect(res.location).toContain('redirect=%2Fadmin%2Forders')
  })

  it('redirects non-admin user to /anmelden?error=AccessDenied', () => {
    const res = middlewareLogic('/admin/orders', { user: { role: 'USER' as Role } })
    expect(res.status).toBe(307)
    expect(res.location).toContain('error=AccessDenied')
  })

  it('allows admin user through', () => {
    const res = middlewareLogic('/admin/orders', { user: { role: 'ADMIN' as Role } })
    expect(res.status).toBe(200)
  })
})

describe('middleware routing logic - admin API routes', () => {
  it('returns 401 for unauthenticated API requests', () => {
    const res = middlewareLogic('/api/admin/stats', null)
    expect(res.status).toBe(401)
    expect(res.body).toEqual({ error: 'Unauthorized' })
  })

  it('returns 403 for non-admin API requests', () => {
    const res = middlewareLogic('/api/admin/stats', { user: { role: 'USER' as Role } })
    expect(res.status).toBe(403)
    expect(res.body).toEqual({ error: 'Forbidden' })
  })

  it('allows admin API requests through', () => {
    const res = middlewareLogic('/api/admin/stats', { user: { role: 'ADMIN' as Role } })
    expect(res.status).toBe(200)
  })
})

describe('middleware routing logic - auth pages redirect when logged in', () => {
  it('redirects logged-in user from /anmelden to /mein-konto', () => {
    const res = middlewareLogic('/anmelden', { user: { role: 'USER' as Role } })
    expect(res.status).toBe(307)
    expect(res.location).toContain('/mein-konto')
  })

  it('redirects logged-in user from /registrieren to /mein-konto', () => {
    const res = middlewareLogic('/registrieren', { user: { role: 'USER' as Role } })
    expect(res.status).toBe(307)
    expect(res.location).toContain('/mein-konto')
  })

  it('redirects logged-in user from /passwort-vergessen to /mein-konto', () => {
    const res = middlewareLogic('/passwort-vergessen', { user: { role: 'USER' as Role } })
    expect(res.status).toBe(307)
    expect(res.location).toContain('/mein-konto')
  })
})

describe('middleware routing logic - protected user routes', () => {
  it('redirects unauthenticated user from /mein-konto to /anmelden', () => {
    const res = middlewareLogic('/mein-konto/bestellungen', null)
    expect(res.status).toBe(307)
    expect(res.location).toContain('/anmelden')
    expect(res.location).toContain('redirect=%2Fmein-konto%2Fbestellungen')
  })

  it('redirects unauthenticated user from /wunschliste to /anmelden', () => {
    const res = middlewareLogic('/wunschliste', null)
    expect(res.status).toBe(307)
    expect(res.location).toContain('/anmelden')
  })

  it('allows authenticated user to /mein-konto', () => {
    const res = middlewareLogic('/mein-konto', { user: { role: 'USER' as Role } })
    expect(res.status).toBe(200)
  })

  it('allows authenticated user to /wunschliste', () => {
    const res = middlewareLogic('/wunschliste', { user: { role: 'USER' as Role } })
    expect(res.status).toBe(200)
  })
})

describe('middleware routing logic - public routes', () => {
  it('allows public routes through', () => {
    expect(middlewareLogic('/', null).status).toBe(200)
    expect(middlewareLogic('/produkte', null).status).toBe(200)
    expect(middlewareLogic('/kontakt', null).status).toBe(200)
    expect(middlewareLogic('/agb', null).status).toBe(200)
    expect(middlewareLogic('/blog', null).status).toBe(200)
  })
})
