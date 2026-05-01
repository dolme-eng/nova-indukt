import type { Metadata } from "next"
import { ContentAdminClient } from "./content-admin-client"

export const metadata: Metadata = {
  title: "Content Verwaltung",
  robots: { index: false, follow: false },
}

export default function AdminContentSettingsPage() {
  return <ContentAdminClient />
}

