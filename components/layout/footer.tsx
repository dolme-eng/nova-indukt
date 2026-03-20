'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Facebook, Instagram, Youtube, CreditCard, Truck, ShieldCheck, RotateCcw, Mail, MapPin, Phone, Clock } from 'lucide-react'

export function Footer() {
  const currentYear = new Date().getFullYear()

  const footerLinks = {
    company: [
      { label: 'Über uns', href: '/uber-uns' },
      { label: 'Blog', href: '/blog' },
      { label: 'Karriere', href: '/uber-uns' },
      { label: 'Presse', href: '/uber-uns' },
    ],
    support: [
      { label: 'Kontakt', href: '/kontakt' },
      { label: 'FAQ', href: '/faq' },
      { label: 'Lieferung & Versand', href: '/lieferung' },
      { label: 'Rückgabe & Umtausch', href: '/rueckgabe' },
    ],
    legal: [
      { label: 'Impressum', href: '/impressum' },
      { label: 'AGB', href: '/agb' },
      { label: 'Datenschutz', href: '/datenschutz' },
      { label: 'Widerrufsrecht', href: '/widerruf' },
    ],
  }

  const features = [
    { icon: Truck, title: 'Kostenlose Lieferung ab 500 €', desc: 'DHL & DPD Express verfügbar' },
    { icon: ShieldCheck, title: 'SSL-Verschlüsselt', desc: 'Sichere Zahlung garantiert' },
    { icon: RotateCcw, title: '30 Tage Rückgabe', desc: 'Geld-zurück-Garantie' },
    { icon: CreditCard, title: 'Flexible Zahlung', desc: 'Klarna, PayPal, Kreditkarte' },
  ]

  return (
    <footer className="bg-gray-950 text-white">
      {/* Features Bar */}
      <div className="border-b border-white/8 bg-gray-900">
        <div className="container mx-auto px-4 py-6 sm:py-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="w-11 h-11 bg-[#4ECCA3]/15 rounded-xl flex items-center justify-center flex-shrink-0">
                  <feature.icon className="w-5 h-5 text-[#4ECCA3]" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm text-white">{feature.title}</h3>
                  <p className="text-xs text-gray-400 mt-0.5">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Image src="/logo0.png" alt="Nova Indukt" width={130} height={40} className="h-10 w-auto brightness-0 invert mb-4" />
            <p className="text-gray-400 text-sm mb-5 leading-relaxed max-w-xs">
              Premium-Küchenzubehör für Induktion – entwickelt in Deutschland für maximale Performance und Langlebigkeit.
            </p>
            <div className="space-y-2 mb-6">
              <div className="flex items-center gap-2.5 text-sm text-gray-400">
                <MapPin className="w-4 h-4 text-[#4ECCA3] flex-shrink-0" />
                <span>Musterstraße 42, 10115 Berlin</span>
              </div>
              <div className="flex items-center gap-2.5 text-sm text-gray-400">
                <Phone className="w-4 h-4 text-[#4ECCA3] flex-shrink-0" />
                <a href="tel:+4930123456789" className="hover:text-white transition-colors">+49 (0) 30 123 456 789</a>
              </div>
              <div className="flex items-center gap-2.5 text-sm text-gray-400">
                <Mail className="w-4 h-4 text-[#4ECCA3] flex-shrink-0" />
                <a href="mailto:info@nova-indukt.de" className="hover:text-white transition-colors">info@nova-indukt.de</a>
              </div>
              <div className="flex items-center gap-2.5 text-sm text-gray-400">
                <Clock className="w-4 h-4 text-[#4ECCA3] flex-shrink-0" />
                <span>Mo–Fr 9:00–18:00 Uhr</span>
              </div>
            </div>
            <div className="flex gap-3">
              {[Facebook, Instagram, Youtube].map((Icon, index) => (
                <span key={index} className="w-9 h-9 bg-white/10 rounded-lg flex items-center justify-center opacity-60 cursor-not-allowed hover:opacity-80 transition-opacity" title="Demnächst verfügbar">
                  <Icon className="w-4 h-4" />
                </span>
              ))}
            </div>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">Unternehmen</h3>
            <ul className="space-y-2.5">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-gray-400 hover:text-[#4ECCA3] text-sm transition-colors">{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">Support</h3>
            <ul className="space-y-2.5">
              {footerLinks.support.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-gray-400 hover:text-[#4ECCA3] text-sm transition-colors">{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">Rechtliches</h3>
            <ul className="space-y-2.5">
              {footerLinks.legal.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-gray-400 hover:text-[#4ECCA3] text-sm transition-colors">{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Payment & Shipping */}
        <div className="border-t border-white/8 mt-10 pt-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-3 font-semibold">Zahlungsarten</p>
              <div className="flex flex-wrap items-center gap-2">
                {['Visa', 'Mastercard', 'PayPal', 'Klarna', 'Apple Pay', 'Google Pay', 'Sofort', 'Rechnung'].map(m => (
                  <span key={m} className="px-2.5 py-1 bg-white/8 rounded-lg text-xs font-medium text-gray-300 border border-white/10">{m}</span>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-3 font-semibold">Versandpartner</p>
              <div className="flex flex-wrap items-center gap-2">
                {[{name:'DHL',accent:true},{name:'DPD',accent:false},{name:'UPS',accent:false},{name:'GLS',accent:false},{name:'Hermes',accent:false}].map(s => (
                  <span key={s.name} className={`px-2.5 py-1 rounded-lg text-xs font-medium border ${s.accent ? 'bg-[#4ECCA3]/15 text-[#4ECCA3] border-[#4ECCA3]/30' : 'bg-white/8 text-gray-300 border-white/10'}`}>{s.name}</span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="border-t border-white/8 mt-6 pt-6">
          <div className="flex flex-wrap items-center justify-center gap-6">
            {[
              { icon: '🔒', label: 'SSL-Verschlüsselt' },
              { icon: '🇩🇪', label: 'Made in Germany' },
              { icon: '⭐', label: 'Trusted Shops' },
              { icon: '✓', label: 'TÜV Geprüft' },
              { icon: '🌱', label: 'Nachhaltig' },
              { icon: '🛡️', label: 'Käuferschutz' },
            ].map((badge) => (
              <div key={badge.label} className="flex items-center gap-2 text-xs text-gray-400">
                <span className="text-base">{badge.icon}</span>
                <span>{badge.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-8 pt-6 border-t border-white/8 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <p className="text-sm text-gray-500">© {currentYear} NOVA INDUKT GmbH. Alle Rechte vorbehalten.</p>
          <p className="text-sm text-gray-500">Alle Preise inkl. 19% MwSt. · Lieferung innerhalb Deutschlands</p>
        </div>
      </div>
    </footer>
  )
}
