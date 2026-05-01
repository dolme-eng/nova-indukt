import type { Metadata } from "next"
import { ShopSettingsClient } from "./shop-settings-client"

export const metadata: Metadata = {
  title: "Shop Einstellungen",
  robots: { index: false, follow: false },
}

export default function AdminShopSettingsPage() {
  return <ShopSettingsClient />
}

