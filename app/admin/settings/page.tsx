import type { Metadata } from "next"
import Link from "next/link"
import { Settings, ShieldCheck, Database, Bell, FileText, Users, Image as ImageIcon, ScrollText, CreditCard } from "lucide-react"

export const metadata: Metadata = {
  title: "Admin Einstellungen",
  robots: {
    index: false,
    follow: false,
  },
}

export default function AdminSettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <Settings className="w-6 h-6 text-slate-600" />
          Konfiguration
        </h1>
        <p className="text-slate-600 mt-1">
          Zentrale Einstellungsseite fuer Shop, Sicherheit und Benachrichtigungen.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Link href="/admin/settings/shop" className="rounded-xl border border-slate-200 bg-white p-5 hover:border-slate-300 transition-colors">
          <div className="flex items-center gap-2 font-semibold text-slate-800">
            <Database className="w-4 h-4" />
            Shop (Steuer/Versand)
          </div>
          <p className="text-sm text-slate-600 mt-2">
            MwSt, Versandkosten, Schwellen, Basis-URL.
          </p>
        </Link>

        <Link href="/admin/settings/payment" className="rounded-xl border border-slate-200 bg-white p-5 hover:border-slate-300 transition-colors">
          <div className="flex items-center gap-2 font-semibold text-slate-800">
            <CreditCard className="w-4 h-4" />
            Zahlungsdaten
          </div>
          <p className="text-sm text-slate-600 mt-2">
            IBAN, BIC, Kontoinhaber für Banküberweisungen.
          </p>
        </Link>

        <Link href="/admin/settings/emails" className="rounded-xl border border-slate-200 bg-white p-5 hover:border-slate-300 transition-colors">
          <div className="flex items-center gap-2 font-semibold text-slate-800">
            <Bell className="w-4 h-4" />
            E-Mails & Benachrichtigungen
          </div>
          <p className="text-sm text-slate-600 mt-2">
            Absender, Admin-E-Mail, Versand-Trigger.
          </p>
        </Link>

        <Link href="/admin/settings/seo" className="rounded-xl border border-slate-200 bg-white p-5 hover:border-slate-300 transition-colors">
          <div className="flex items-center gap-2 font-semibold text-slate-800">
            <ScrollText className="w-4 h-4" />
            SEO
          </div>
          <p className="text-sm text-slate-600 mt-2">
            Titel, Description, OpenGraph Defaults.
          </p>
        </Link>

        <Link href="/admin/settings/content" className="rounded-xl border border-slate-200 bg-white p-5 hover:border-slate-300 transition-colors">
          <div className="flex items-center gap-2 font-semibold text-slate-800">
            <FileText className="w-4 h-4" />
            Inhalte (FAQ / Seiten)
          </div>
          <p className="text-sm text-slate-600 mt-2">
            FAQ und Seiteninhalte zentral verwalten.
          </p>
        </Link>

        <Link href="/admin/settings/users" className="rounded-xl border border-slate-200 bg-white p-5 hover:border-slate-300 transition-colors">
          <div className="flex items-center gap-2 font-semibold text-slate-800">
            <Users className="w-4 h-4" />
            Benutzer & Rollen
          </div>
          <p className="text-sm text-slate-600 mt-2">
            Admins verwalten, Rollen setzen, Audit ansehen.
          </p>
        </Link>

        <Link href="/admin/settings/media" className="rounded-xl border border-slate-200 bg-white p-5 hover:border-slate-300 transition-colors">
          <div className="flex items-center gap-2 font-semibold text-slate-800">
            <ImageIcon className="w-4 h-4" />
            Medien (Cloudinary)
          </div>
          <p className="text-sm text-slate-600 mt-2">
            Uploads + Bibliothek + Löschen.
          </p>
        </Link>

        <Link href="/admin/settings/logs" className="rounded-xl border border-slate-200 bg-white p-5 hover:border-slate-300 transition-colors md:col-span-3">
          <div className="flex items-center gap-2 font-semibold text-slate-800">
            <ShieldCheck className="w-4 h-4" />
            Logs & Audit Trail
          </div>
          <p className="text-sm text-slate-600 mt-2">
            Exploitables Änderungsprotokoll (wer/was/wann).
          </p>
        </Link>
      </div>
    </div>
  )
}
