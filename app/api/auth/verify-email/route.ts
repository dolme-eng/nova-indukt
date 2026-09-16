import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { rateLimit, getIP, createRateLimitKey } from "@/lib/rate-limit"
import { logError } from "@/lib/logger"

/**
 * GET: Validate token and render a safe confirmation page (no state change).
 * POST: Perform the actual verification (state change).
 * Email links use GET → user clicks button → POST confirms.
 */
export async function GET(request: NextRequest) {
  const ip = getIP(request)
  const { success } = await rateLimit(createRateLimitKey(ip, "auth:verify-email"), { windowMs: 3_600_000, maxRequests: 10 })
  if (!success) return NextResponse.json({ error: "Zu viele Anfragen" }, { status: 429 })

  try {
    const { searchParams } = new URL(request.url)
    const token = searchParams.get("token")

    if (!token) {
      return NextResponse.redirect(new URL("/anmelden?error=invalid-token", request.url))
    }

    const user = await prisma.user.findFirst({
      where: {
        verificationToken: token,
        verificationTokenExpiry: { gt: new Date() }
      },
      select: { id: true }
    })

    if (!user) {
      return NextResponse.redirect(new URL("/anmelden?error=invalid-or-expired-token", request.url))
    }

    // Safe: render confirmation page — no state change
    return new NextResponse(`<!DOCTYPE html>
<html lang="de">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>E-Mail verifizieren – NOVA INDUKT</title>
<style>body{font-family:system-ui,-apple-system,sans-serif;display:flex;justify-content:center;align-items:center;min-height:100vh;margin:0;background:#f5f5f5}
.card{background:#fff;padding:2rem;border-radius:12px;box-shadow:0 2px 8px rgba(0,0,0,.1);text-align:center;max-width:400px}
h1{font-size:1.5rem;margin-bottom:.5rem}
p{color:#666;margin-bottom:1.5rem}
button{background:#111;color:#fff;border:none;padding:.75rem 2rem;border-radius:8px;font-size:1rem;cursor:pointer}
button:hover{background:#333}</style></head>
<body>
<div class="card">
<h1>E-Mail-Adresse bestätigen</h1>
<p>Klicken Sie auf den Button, um Ihre E-Mail-Adresse bei NOVA INDUKT zu verifizieren.</p>
<form method="POST" action="/api/auth/verify-email">
<input type="hidden" name="token" value="${token.replace(/"/g, '&quot;')}">
<button type="submit">E-Mail verifizieren</button>
</form>
</div>
</body></html>`, { headers: { "Content-Type": "text/html; charset=utf-8" } })
  } catch (error) {
    logError("Email verification error:", error)
    return NextResponse.redirect(new URL("/anmelden?error=verification-failed", request.url))
  }
}

export async function POST(request: NextRequest) {
  const ip = getIP(request)
  const { success } = await rateLimit(createRateLimitKey(ip, "auth:verify-email"), { windowMs: 3_600_000, maxRequests: 10 })
  if (!success) return NextResponse.json({ error: "Zu viele Anfragen" }, { status: 429 })

  try {
    const body = await request.formData()
    const token = body.get("token") as string | null

    if (!token) {
      return NextResponse.redirect(new URL("/anmelden?error=invalid-token", request.url))
    }

    const user = await prisma.user.findFirst({
      where: {
        verificationToken: token,
        verificationTokenExpiry: { gt: new Date() }
      }
    })

    if (!user) {
      return NextResponse.redirect(new URL("/anmelden?error=invalid-or-expired-token", request.url))
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerified: new Date(),
        verificationToken: null,
        verificationTokenExpiry: null,
      }
    })

    return NextResponse.redirect(new URL("/anmelden?verified=true", request.url))
  } catch (error) {
    logError("Email verification error:", error)
    return NextResponse.redirect(new URL("/anmelden?error=verification-failed", request.url))
  }
}
