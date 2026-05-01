import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { auth } from "@/lib/auth"

// Protected routes that require authentication
const protectedRoutes = [
  "/mein-konto",
  "/api/orders",
  "/admin",
]

// Admin specific routes
const adminRoutes = [
  "/admin",
  "/api/admin",
]

// Auth routes that redirect to account if already logged in
const authRoutes = [
  "/anmelden",
  "/registrieren",
]

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  const isProtected = protectedRoutes.some((route) =>
    pathname === route || pathname.startsWith(`${route}/`)
  )

  const isAdminRoute = adminRoutes.some((route) =>
    pathname === route || pathname.startsWith(`${route}/`)
  )

  const isAuthRoute = authRoutes.some((route) => pathname === route)

  if (isProtected || isAuthRoute || isAdminRoute) {
    const session = await auth()

    if ((isProtected || isAdminRoute) && !session?.user) {
      const loginUrl = new URL("/anmelden", request.url)
      loginUrl.searchParams.set("redirect", pathname)
      return NextResponse.redirect(loginUrl)
    }

    if (isAdminRoute && session?.user?.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/", request.url))
    }

    if (isAuthRoute && session?.user) {
      return NextResponse.redirect(new URL("/mein-konto", request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/mein-konto/:path*",
    "/anmelden",
    "/registrieren",
    "/api/orders/:path*",
    "/api/auth/:path*",
    "/admin/:path*",
    "/api/admin/:path*",
  ],
}

