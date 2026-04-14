import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { auth } from "@/lib/auth"

// Protected routes that require authentication
const protectedRoutes = [
  "/mein-konto",
  "/kasse",
  "/api/orders"
]

// Auth routes that redirect to account if already logged in
const authRoutes = [
  "/anmelden",
  "/registrieren"
]

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Check if route is protected
  const isProtected = protectedRoutes.some(route => 
    pathname === route || pathname.startsWith(`${route}/`)
  )
  
  // Check if route is auth route
  const isAuthRoute = authRoutes.some(route => pathname === route)
  
  if (isProtected || isAuthRoute) {
    const session = await auth()
    
    // Redirect to login if accessing protected route without auth
    if (isProtected && !session?.user) {
      const loginUrl = new URL("/anmelden", request.url)
      loginUrl.searchParams.set("redirect", pathname)
      return NextResponse.redirect(loginUrl)
    }
    
    // Redirect to account if accessing auth route while logged in
    if (isAuthRoute && session?.user) {
      return NextResponse.redirect(new URL("/mein-konto", request.url))
    }
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: [
    "/mein-konto/:path*",
    "/kasse/:path*",
    "/anmelden",
    "/registrieren",
    "/api/orders/:path*"
  ]
}
