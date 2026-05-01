import type { Metadata } from "next"
import { SeoSettingsClient } from "./seo-settings-client"

export const metadata: Metadata = {
  title: "SEO Einstellungen",
  robots: { index: false, follow: false },
}

export default function AdminSeoSettingsPage() {
  return <SeoSettingsClient />
}

