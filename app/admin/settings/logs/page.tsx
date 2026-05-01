import type { Metadata } from "next"
import { LogsAdminClient } from "./logs-admin-client"

export const metadata: Metadata = {
  title: "Audit Logs",
  robots: { index: false, follow: false },
}

export default function AdminLogsSettingsPage() {
  return <LogsAdminClient />
}

