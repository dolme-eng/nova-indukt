import type { Metadata } from 'next'
import Link from 'next/link'
import {
  Settings,
  ShieldCheck,
  Database,
  Bell,
  FileText,
  Users,
  Image as ImageIcon,
  ScrollText,
  CreditCard,
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'Admin Einstellungen',
  robots: {
    index: false,
    follow: false,
  },
}

export default function AdminSettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="flex items-center gap-2 text-2xl font-bold text-slate-900">
          <Settings className="h-6 w-6 text-slate-600" />
          Konfiguration
        </h1>
        <p className="mt-1 text-slate-600">
          Zentrale Einstellungsseite für Shop, Sicherheit und Benachrichtigungen.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Link
          href="/admin/settings/shop"
          className="rounded-xl border border-slate-200 bg-white p-5 transition-colors hover:border-slate-300"
        >
          <div className="flex items-center gap-2 font-semibold text-slate-800">
            <Database className="h-4 w-4" />
            Shop (Steuer/Versand)
          </div>
          <p className="mt-2 text-sm text-slate-600">MwSt, Versandkosten, Schwellen, Basis-URL.</p>
        </Link>

        <Link
          href="/admin/settings/payment"
          className="rounded-xl border border-slate-200 bg-white p-5 transition-colors hover:border-slate-300"
        >
          <div className="flex items-center gap-2 font-semibold text-slate-800">
            <CreditCard className="h-4 w-4" />
            Zahlungsdaten
          </div>
          <p className="mt-2 text-sm text-slate-600">
            IBAN, BIC, Kontoinhaber für Banküberweisungen.
          </p>
        </Link>

        <Link
          href="/admin/settings/emails"
          className="rounded-xl border border-slate-200 bg-white p-5 transition-colors hover:border-slate-300"
        >
          <div className="flex items-center gap-2 font-semibold text-slate-800">
            <Bell className="h-4 w-4" />
            E-Mails & Benachrichtigungen
          </div>
          <p className="mt-2 text-sm text-slate-600">Absender, Admin-E-Mail, Versand-Trigger.</p>
        </Link>

        <Link
          href="/admin/settings/seo"
          className="rounded-xl border border-slate-200 bg-white p-5 transition-colors hover:border-slate-300"
        >
          <div className="flex items-center gap-2 font-semibold text-slate-800">
            <ScrollText className="h-4 w-4" />
            SEO
          </div>
          <p className="mt-2 text-sm text-slate-600">Titel, Description, OpenGraph Defaults.</p>
        </Link>

        <Link
          href="/admin/settings/content"
          className="rounded-xl border border-slate-200 bg-white p-5 transition-colors hover:border-slate-300"
        >
          <div className="flex items-center gap-2 font-semibold text-slate-800">
            <FileText className="h-4 w-4" />
            Inhalte (FAQ / Seiten)
          </div>
          <p className="mt-2 text-sm text-slate-600">FAQ und Seiteninhalte zentral verwalten.</p>
        </Link>

        <Link
          href="/admin/settings/users"
          className="rounded-xl border border-slate-200 bg-white p-5 transition-colors hover:border-slate-300"
        >
          <div className="flex items-center gap-2 font-semibold text-slate-800">
            <Users className="h-4 w-4" />
            Benutzer & Rollen
          </div>
          <p className="mt-2 text-sm text-slate-600">
            Admins verwalten, Rollen setzen, Audit ansehen.
          </p>
        </Link>

        <Link
          href="/admin/settings/media"
          className="rounded-xl border border-slate-200 bg-white p-5 transition-colors hover:border-slate-300"
        >
          <div className="flex items-center gap-2 font-semibold text-slate-800">
            <ImageIcon className="h-4 w-4" />
            Medien (Cloudinary)
          </div>
          <p className="mt-2 text-sm text-slate-600">Uploads + Bibliothek + Löschen.</p>
        </Link>

        <Link
          href="/admin/settings/logs"
          className="rounded-xl border border-slate-200 bg-white p-5 transition-colors hover:border-slate-300 md:col-span-3"
        >
          <div className="flex items-center gap-2 font-semibold text-slate-800">
            <ShieldCheck className="h-4 w-4" />
            Logs & Audit Trail
          </div>
          <p className="mt-2 text-sm text-slate-600">
            Detailliertes Änderungsprotokoll (wer/was/wann).
          </p>
        </Link>
      </div>
    </div>
  )
}
