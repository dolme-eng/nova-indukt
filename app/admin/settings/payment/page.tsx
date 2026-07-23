import type { Metadata } from "next"
import { PaymentSettingsClient } from "./payment-settings-client"

export const metadata: Metadata = {
  title: "Zahlungseinstellungen",
  robots: { index: false, follow: false },
}

export default function AdminPaymentSettingsPage() {
  return <PaymentSettingsClient />
}
