import { auth } from "@/lib/auth"

export async function requireAdmin() {
  const session = await auth()
  if (!session?.user) {
    return { ok: false as const, status: 401, session: null }
  }
  if (session.user.role !== "ADMIN") {
    return { ok: false as const, status: 403, session }
  }
  return { ok: true as const, status: 200, session }
}

