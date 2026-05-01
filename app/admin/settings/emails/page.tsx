import type { Metadata } from "next"
import { EmailSettingsClient } from "./email-settings-client"

export const metadata: Metadata = {
  title: "E-Mail Einstellungen",
  robots: { index: false, follow: false },
}

export default function AdminEmailSettingsPage() {
  return <EmailSettingsClient />
}

