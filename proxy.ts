import NextAuth from "next-auth"
import { NextResponse } from "next/server"
import { authConfig } from "@/lib/auth/auth.config"
import type { Role } from "@prisma/client"

const { auth } = NextAuth(authConfig)

export const proxy = auth((req) => {
  const { pathname } = req.nextUrl
  const isLoggedIn = !!req.auth
  const userRole = (req.auth?.user as { role?: Role } | undefined)?.role

  // ── Admin routes: require ADMIN role ──────────────────────────────────────
  if (pathname.startsWith("/admin")) {
    if (!isLoggedIn) {
      const signInUrl = new URL("/anmelden", req.url)
      signInUrl.searchParams.set("redirect", pathname)
      return NextResponse.redirect(signInUrl)
    }
    if (userRole !== "ADMIN") {
      return NextResponse.redirect(new URL("/anmelden?error=AccessDenied", req.url))
    }
  }

  // ── Admin API routes: require ADMIN role ──────────────────────────────────
  if (pathname.startsWith("/api/admin")) {
    if (!isLoggedIn) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    if (userRole !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }
  }

  // ── Auth pages: redirect to account if already logged in ──────────────────
  const authPages = ["/anmelden", "/registrieren", "/passwort-vergessen", "/passwort-zuruecksetzen"]
  if (authPages.some((p) => pathname.startsWith(p)) && isLoggedIn) {
    return NextResponse.redirect(new URL("/mein-konto", req.url))
  }

  // ── Protected user routes: require login ──────────────────────────────────
  const protectedRoutes = ["/mein-konto", "/wunschliste"]
  if (protectedRoutes.some((p) => pathname.startsWith(p)) && !isLoggedIn) {
    const signInUrl = new URL("/anmelden", req.url)
    signInUrl.searchParams.set("redirect", pathname)
    return NextResponse.redirect(signInUrl)
  }
})

export const config = {
  matcher: [
    // Admin pages + API
    "/admin/:path*",
    "/api/admin/:path*",
    // Auth pages (for redirect-when-logged-in)
    "/anmelden",
    "/registrieren",
    "/passwort-vergessen",
    "/passwort-zuruecksetzen/:path*",
    // Protected user routes
    "/mein-konto/:path*",
    "/wunschliste/:path*",
  ],
}
