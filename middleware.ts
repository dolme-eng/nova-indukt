import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { auth } from '@/lib/auth'

/**
 * Middleware de protection des routes admin.
 * Vérifie côté serveur (Edge) que l'utilisateur est ADMIN avant d'accéder à /admin/*.
 * Redirige vers /anmelden si non authentifié, vers / si rôle insuffisant.
 */
export default auth((req: NextRequest & { auth: any }) => {
  const { pathname } = req.nextUrl

  // Protection des routes admin
  if (pathname.startsWith('/admin')) {
    const session = req.auth

    // Non authentifié → redirection vers login
    if (!session?.user) {
      const loginUrl = new URL('/anmelden', req.url)
      loginUrl.searchParams.set('redirect', pathname)
      return NextResponse.redirect(loginUrl)
    }

    // Authentifié mais pas ADMIN → redirection vers accueil
    if (session.user.role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/', req.url))
    }
  }

  return NextResponse.next()
})

export const config = {
  // Appliquer le middleware sur toutes les routes admin
  // Exclure les fichiers statiques et _next
  matcher: ['/admin/:path*'],
}
