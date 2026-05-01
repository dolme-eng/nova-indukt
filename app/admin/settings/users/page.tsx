import type { Metadata } from "next"
import { UsersAdminClient } from "./users-admin-client"

export const metadata: Metadata = {
  title: "Benutzer & Rollen",
  robots: { index: false, follow: false },
}

export default function AdminUsersSettingsPage() {
  return <UsersAdminClient />
}

