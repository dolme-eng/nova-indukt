import type { Metadata } from "next"
import { MediaAdminClient } from "./media-admin-client"

export const metadata: Metadata = {
  title: "Média Bibliothèque",
  robots: { index: false, follow: false },
}

export default function AdminMediaSettingsPage() {
  return <MediaAdminClient />
}

