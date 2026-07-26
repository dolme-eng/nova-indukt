import Link from 'next/link'
import Image from 'next/image'
import {
  Truck,
  ShieldCheck,
  RotateCcw,
  Mail,
  MapPin,
  ChevronRight,
  Lock,
  Flag,
  CheckCircle,
  Shield,
} from 'lucide-react'
import { COMPANY } from '@/lib/constants/company'

export function Footer() {
  const currentYear = new Date().getFullYear()

  const footerLinks = {
    company: [
      { label: 'Über uns', href: '/uber-uns' },
      { label: 'Blog', href: '/blog' },
      { label: 'Technologie', href: '/technologie' },
      { label: 'Karriere', href: '/karriere' },
    ],
    support: [
      { label: 'Kontakt', href: '/kontakt' },
      { label: 'FAQ', href: '/faq' },
      { label: 'Bestellung verfolgen', href: '/bestellung-verfolgen' },
      { label: 'Lieferung & Versand', href: '/lieferung' },
      { label: 'Rückgabe & Umtausch', href: '/rueckgabe' },
      { label: 'Zahlungsinformationen', href: '/informationen-zur-zahlung' },
    ],
    legal: [
      { label: 'Impressum', href: '/impressum' },
      { label: 'AGB', href: '/agb' },
      { label: 'Datenschutz', href: '/datenschutz' },
      { label: 'Widerrufsrecht', href: '/widerruf' },
    ],
  }

  const features = [
    { icon: Truck, title: 'Kostenfreier Versand', desc: 'Ab 500 € innerhalb Deutschlands' },
    { icon: ShieldCheck, title: 'Sichere Zahlung', desc: 'SSL-Verschlüsselung & Käuferschutz' },
    { icon: RotateCcw, title: '30 Tage Rückgaberecht', desc: 'Stressfreier Rückversand' },
    { icon: ShieldCheck, title: 'Flexible Zahlung', desc: 'Sichere Banküberweisung' },
  ]

  return (
    <footer
      data-testid="site-footer"
      className="relative overflow-hidden border-t border-[#17423C] bg-[#0C211E] text-white"
    >
      {/* Abstract Background Elements */}
      <div className="pointer-events-none absolute right-0 top-0 h-[600px] w-[600px] -translate-y-1/2 translate-x-1/2 rounded-full bg-[#4ECCA3]/5 blur-[100px]" />
      <div className="pointer-events-none absolute bottom-0 left-0 h-[800px] w-[800px] -translate-x-1/4 translate-y-1/2 rounded-full bg-[#17423C]/50 blur-[120px]" />

      {/* Features Bar - Ultra Compact */}
      <div className="relative z-10 border-b border-[#236456]/50 bg-black/20 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-2.5 sm:px-6">
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {features.map((feature, index) => (
              <div key={index} className="group flex items-center gap-2">
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg border border-[#236456] bg-[#17423C]">
                  <feature.icon className="h-3.5 w-3.5 text-nova-400" />
                </div>
                <div className="flex min-w-0 flex-col justify-center">
                  <h3 className="truncate text-[11px] font-black uppercase tracking-tight text-white sm:text-xs">
                    {feature.title}
                  </h3>
                  <p className="truncate text-[10px] font-medium leading-tight text-[#9FE1CD] sm:text-[11px]">
                    {feature.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="container relative z-10 mx-auto px-4 py-8 sm:px-6 sm:py-10">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-12 lg:gap-6">
          {/* Brand & Contact Column */}
          <div className="lg:col-span-4">
            <Link href="/" className="mb-4 inline-block">
              <Image
                src="/logo0.png"
                alt="Nova Indukt"
                width={120}
                height={36}
                className="h-8 w-auto opacity-80 brightness-0 invert transition-opacity hover:opacity-100"
                style={{ width: 'auto', height: 'auto' }}
                unoptimized
              />
            </Link>
            <p className="mb-6 pe-4 text-sm font-medium leading-relaxed text-[#9FE1CD]">
              Premium-Küchenzubehör & Elektrogeräte für Induktion – entwickelt in Deutschland für
              maximale Performance.
            </p>

            <div className="mb-6 space-y-2">
              <a
                href={COMPANY.whatsapp.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-3 text-[11px] font-black uppercase tracking-tighter text-[#9FE1CD] transition-all hover:text-white"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#25D366]/20 bg-[#25D366]/10">
                  <svg viewBox="0 0 24 24" className="h-4 w-4 fill-[#25D366]">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                  </svg>
                </div>
                WhatsApp
              </a>
              <div className="group flex items-center gap-3 text-[11px] font-black uppercase tracking-tighter text-[#9FE1CD]">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#17423C]">
                  <Mail className="h-3.5 w-3.5" />
                </div>
                <a
                  href={`mailto:${COMPANY.email.info}`}
                  className="transition-colors hover:text-white"
                >
                  {COMPANY.email.info}
                </a>
              </div>
              <div className="group flex items-center gap-3 text-[11px] font-black uppercase tracking-tighter text-[#9FE1CD]">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#17423C]">
                  <MapPin className="h-3.5 w-3.5" />
                </div>
                <span>
                  {COMPANY.city}, {COMPANY.countryShort}
                </span>
              </div>
            </div>

            <div className="flex gap-4">
              <a
                href={COMPANY.social.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-transparent bg-white/10 text-gray-500 transition-colors hover:bg-[#4ECCA3] hover:text-white"
                aria-label="Facebook"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    fillRule="evenodd"
                    d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
              <a
                href={COMPANY.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-transparent bg-white/10 text-gray-500 transition-colors hover:bg-[#4ECCA3] hover:text-white"
                aria-label="Instagram"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    fillRule="evenodd"
                    d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
            </div>
          </div>

          {/* Links Columns */}
          <div data-testid="footer-links" className="lg:col-span-2 lg:col-start-6">
            <h3 className="mb-6 text-sm font-bold uppercase tracking-widest text-white">
              Unternehmen
            </h3>
            <ul className="space-y-4">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="group flex items-center gap-2 text-sm font-medium text-[#9FE1CD] transition-colors hover:text-[#4ECCA3]"
                  >
                    <ChevronRight className="h-3 w-3 -translate-x-2 font-bold opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100" />
                    <span className="-ml-3 transition-all group-hover:ml-0">{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h3 className="mb-6 text-sm font-bold uppercase tracking-widest text-white">Support</h3>
            <ul className="space-y-4">
              {footerLinks.support.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="group flex items-center gap-2 text-sm font-medium text-[#9FE1CD] transition-colors hover:text-[#4ECCA3]"
                  >
                    <ChevronRight className="h-3 w-3 -translate-x-2 font-bold opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100" />
                    <span className="-ml-3 transition-all group-hover:ml-0">{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h3 className="mb-6 text-sm font-bold uppercase tracking-widest text-white">
              Rechtliches
            </h3>
            <ul className="space-y-4">
              {footerLinks.legal.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="group flex items-center gap-2 text-sm font-medium text-[#9FE1CD] transition-colors hover:text-[#4ECCA3]"
                  >
                    <ChevronRight className="h-3 w-3 -translate-x-2 font-bold opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100" />
                    <span className="-ml-3 transition-all group-hover:ml-0">{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Payment & Shipping */}
        <div className="mt-10 border-t border-[#236456]/50 pt-8">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
            <div>
              <p className="mb-4 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-white">
                <ShieldCheck className="h-4 w-4 text-[#4ECCA3]" /> Sichere Zahlungsarten
              </p>
              <div className="flex flex-wrap items-center gap-3">
                {['Banküberweisung'].map((m) => (
                  <span
                    key={m}
                    className="cursor-default rounded-lg border border-[#236456]/50 bg-[#17423C] px-4 py-2 text-xs font-bold text-white transition-colors hover:border-[#4ECCA3]/50"
                  >
                    {m}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <p className="mb-4 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-white">
                <Truck className="h-4 w-4 text-[#4ECCA3]" /> Zuverlässige Versandpartner
              </p>
              <div className="flex flex-wrap items-center gap-3">
                {[
                  { name: 'DHL', accent: true },
                  { name: 'DPD', accent: false },
                  { name: 'UPS', accent: false },
                  { name: 'GLS', accent: false },
                  { name: 'Hermes', accent: false },
                ].map((s) => (
                  <span
                    key={s.name}
                    className={`rounded-lg border px-4 py-2 text-xs font-bold ${s.accent ? 'border-[#4ECCA3]/40 bg-[#4ECCA3]/20 text-[#4ECCA3]' : 'border-[#236456]/50 bg-[#17423C] text-white transition-colors hover:border-[#4ECCA3]/50'} cursor-default`}
                  >
                    {s.name}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="mt-4 border-t border-[#236456]/50 pt-4">
          <div className="flex flex-wrap items-center justify-center gap-6 gap-y-2">
            {[
              { icon: <Lock className="h-3 w-3 text-[#4ECCA3]" />, label: 'SSL-Verschlüsselt' },
              { icon: <Flag className="h-3 w-3 text-[#4ECCA3]" />, label: 'Premium Qualität' },
              {
                icon: <CheckCircle className="h-3 w-3 text-[#4ECCA3]" />,
                label: '2 Jahre Garantie',
              },
              { icon: <Shield className="h-3 w-3 text-[#4ECCA3]" />, label: 'Sichere Zahlung' },
            ].map((badge) => (
              <div
                key={badge.label}
                className="flex items-center gap-2 text-[11px] font-bold text-[#9FE1CD]"
              >
                <span className="flex h-6 w-6 items-center justify-center rounded-full border border-white/5 bg-white/5">
                  {badge.icon}
                </span>
                <span>{badge.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-[#236456]/50 pt-8 text-center md:flex-row md:text-left">
          <p className="text-sm font-medium text-[#6FD2B4]">
            © {currentYear} {COMPANY.name}. Alle Rechte vorbehalten.
          </p>
          <div className="flex items-center gap-4 text-sm font-medium text-[#6FD2B4]">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4" /> SSL-secured
            </span>
            <span>
              Alle Preise inkl. gesetzl. MwSt. zzgl.{' '}
              <Link
                href="/lieferung"
                className="underline decoration-dotted transition-colors hover:text-white"
              >
                Versandkosten
              </Link>
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}
