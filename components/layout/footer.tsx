'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Facebook, Instagram, Youtube, CreditCard, Truck, ShieldCheck, RotateCcw, Mail, MapPin, Phone, Clock, ArrowRight, Lock, Flag, Star, CheckCircle, Leaf, Shield } from 'lucide-react'

export function Footer() {
  const currentYear = new Date().getFullYear()

  const footerLinks = {
    company: [
      { label: 'Über uns', href: '/uber-uns' },
      { label: 'Blog', href: '/blog' },
      { label: 'Karriere', href: '/karriere' },
      { label: 'Presse', href: '/presse' },
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
    { icon: Truck, title: 'Kostenfreier Versand', desc: 'Ab 500 € innerhalb Deutschlands' },
    { icon: ShieldCheck, title: 'Sichere Zahlung', desc: 'SSL-Verschlüsselung & Käuferschutz' },
    { icon: RotateCcw, title: '30 Tage Rückgaberecht', desc: 'Stressfreier Rückversand' },
    { icon: CreditCard, title: 'Flexible Zahlung', desc: 'Klarna, PayPal, Kreditkarte, uvm.' },
  ]

  return (
    <footer className="bg-[#0C211E] text-white overflow-hidden relative border-t border-[#17423C]">
      {/* Abstract Background Elements */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#4ECCA3]/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-[#17423C]/50 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/4 pointer-events-none" />

      {/* Features Bar - Ultra Premium */}
      <div className="relative border-b border-[#236456]/50 bg-black/20 backdrop-blur-sm z-10">
        <div className="container mx-auto px-4 sm:px-6 py-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            {features.map((feature, index) => (
              <div key={index} className="flex gap-5 group">
                <div className="w-14 h-14 bg-[#17423C] rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:bg-[#4ECCA3] group-hover:shadow-[0_0_20px_rgba(78,204,163,0.3)] transition-all duration-300 border border-[#236456]">
                  <feature.icon className="w-6 h-6 text-[#4ECCA3] group-hover:text-white transition-colors" />
                </div>
                <div className="flex flex-col justify-center">
                  <h3 className="font-bold text-base text-white mb-1 tracking-wide">{feature.title}</h3>
                  <p className="text-sm text-[#9FE1CD] font-medium leading-relaxed">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="container mx-auto px-4 sm:px-6 py-16 sm:py-20 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8">
          
          {/* Brand & Contact Column */}
          <div className="lg:col-span-4">
            <Link href="/" className="inline-block mb-8">
              <Image src="/logo0.png" alt="Nova Indukt" width={160} height={48} className="h-12 w-auto brightness-0 invert opacity-90 hover:opacity-100 transition-opacity" style={{ width: 'auto', height: 'auto' }} />
            </Link>
            <p className="text-[#9FE1CD] text-base mb-8 leading-relaxed font-medium pe-4">
              Premium-Küchenzubehör für Induktion – entwickelt in Deutschland für maximale Performance und höchste Langlebigkeit in Ihrer Küche.
            </p>
            
            <div className="space-y-4 mb-8">
              <a href="https://maps.google.com" target="_blank" rel="noopener noreferrer" className="flex items-start gap-4 text-[#9FE1CD] hover:text-[#4ECCA3] transition-colors group">
                <div className="w-10 h-10 rounded-xl bg-[#17423C] flex items-center justify-center flex-shrink-0 group-hover:bg-[#236456] transition-colors">
                  <MapPin className="w-4 h-4" />
                </div>
                <div className="pt-2 text-sm font-medium">Musterstraße 42, 10115 Berlin,<br/>Deutschland</div>
              </a>
              <a href="tel:+4930123456789" className="flex items-center gap-4 text-[#9FE1CD] hover:text-[#4ECCA3] transition-colors group">
                <div className="w-10 h-10 rounded-xl bg-[#17423C] flex items-center justify-center flex-shrink-0 group-hover:bg-[#236456] transition-colors">
                  <Phone className="w-4 h-4" />
                </div>
                <span className="text-sm font-medium">+49 (0) 30 123 456 789</span>
              </a>
              <a href="mailto:info@nova-indukt.de" className="flex items-center gap-4 text-[#9FE1CD] hover:text-[#4ECCA3] transition-colors group">
                <div className="w-10 h-10 rounded-xl bg-[#17423C] flex items-center justify-center flex-shrink-0 group-hover:bg-[#236456] transition-colors">
                  <Mail className="w-4 h-4" />
                </div>
                <span className="text-sm font-medium">info@nova-indukt.de</span>
              </a>
            </div>

            <div className="flex gap-4">
              {[Facebook, Instagram, Youtube].map((Icon, index) => (
                <a key={index} href="#" className="w-12 h-12 bg-[#17423C] rounded-xl flex items-center justify-center text-[#9FE1CD] hover:bg-[#4ECCA3] hover:text-white transition-all duration-300 hover:-translate-y-1" title="Demnächst verfügbar">
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Links Columns */}
          <div className="lg:col-span-2 lg:col-start-6">
            <h3 className="font-bold text-white mb-6 text-sm uppercase tracking-widest">Unternehmen</h3>
            <ul className="space-y-4">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-[#9FE1CD] hover:text-[#4ECCA3] text-sm font-medium transition-colors flex items-center gap-2 group">
                    <ChevronRight className="w-3 h-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all font-bold" />
                    <span className="-ml-3 group-hover:ml-0 transition-all">{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h3 className="font-bold text-white mb-6 text-sm uppercase tracking-widest">Support</h3>
            <ul className="space-y-4">
              {footerLinks.support.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-[#9FE1CD] hover:text-[#4ECCA3] text-sm font-medium transition-colors flex items-center gap-2 group">
                    <ChevronRight className="w-3 h-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all font-bold" />
                    <span className="-ml-3 group-hover:ml-0 transition-all">{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h3 className="font-bold text-white mb-6 text-sm uppercase tracking-widest">Rechtliches</h3>
            <ul className="space-y-4">
              {footerLinks.legal.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-[#9FE1CD] hover:text-[#4ECCA3] text-sm font-medium transition-colors flex items-center gap-2 group">
                    <ChevronRight className="w-3 h-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all font-bold" />
                    <span className="-ml-3 group-hover:ml-0 transition-all">{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* Payment & Shipping */}
        <div className="border-t border-[#236456]/50 mt-16 pt-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <div>
              <p className="text-xs text-white uppercase tracking-widest mb-4 font-bold flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-[#4ECCA3]" /> Sichere Zahlungsarten
              </p>
              <div className="flex flex-wrap items-center gap-3">
                {['Visa', 'Mastercard', 'PayPal', 'Klarna', 'Apple Pay', 'Google Pay', 'Sofort', 'Rechnung'].map(m => (
                  <span key={m} className="px-4 py-2 bg-[#17423C] rounded-lg text-xs font-bold text-white border border-[#236456]/50 hover:border-[#4ECCA3]/50 transition-colors cursor-default">{m}</span>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs text-white uppercase tracking-widest mb-4 font-bold flex items-center gap-2">
                <Truck className="w-4 h-4 text-[#4ECCA3]" /> Zuverlässige Versandpartner
              </p>
              <div className="flex flex-wrap items-center gap-3">
                {[{name:'DHL',accent:true},{name:'DPD',accent:false},{name:'UPS',accent:false},{name:'GLS',accent:false},{name:'Hermes',accent:false}].map(s => (
                  <span key={s.name} className={`px-4 py-2 rounded-lg text-xs font-bold border ${s.accent ? 'bg-[#4ECCA3]/20 text-[#4ECCA3] border-[#4ECCA3]/40' : 'bg-[#17423C] text-white border-[#236456]/50 hover:border-[#4ECCA3]/50 transition-colors'} cursor-default`}>{s.name}</span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="border-t border-[#236456]/50 mt-10 pt-10">
          <div className="flex flex-wrap items-center justify-center gap-8 gap-y-4">
            {[
              { icon: <Lock className="w-4 h-4 text-[#4ECCA3]" />, label: 'SSL-Verschlüsselt' },
              { icon: <Flag className="w-4 h-4 text-[#4ECCA3]" />, label: 'Made in Germany' },
              { icon: <Star className="w-4 h-4 text-[#4ECCA3]" />, label: 'Trusted Shops' },
              { icon: <CheckCircle className="w-4 h-4 text-[#4ECCA3]" />, label: 'TÜV Geprüft' },
              { icon: <Leaf className="w-4 h-4 text-[#4ECCA3]" />, label: 'Klimaneutral' },
              { icon: <Shield className="w-4 h-4 text-[#4ECCA3]" />, label: 'Käuferschutz' },
            ].map((badge) => (
              <div key={badge.label} className="flex items-center gap-2.5 text-sm font-bold text-[#9FE1CD]">
                <span className="bg-white/5 w-8 h-8 rounded-full flex items-center justify-center border border-white/5 shadow-inner">{badge.icon}</span>
                <span>{badge.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-10 pt-8 border-t border-[#236456]/50 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <p className="text-sm font-medium text-[#6FD2B4]">© {currentYear} NOVA INDUKT GmbH. Alle Rechte vorbehalten.</p>
          <div className="text-sm font-medium text-[#6FD2B4] flex items-center gap-4">
            <span className="flex items-center gap-1.5"><ShieldCheck className="w-4 h-4"/> SSL-secured</span>
            <span>Alle Preise inkl. gesetzl. MwSt. zzgl. <Link href="/lieferung" className="underline decoration-dotted hover:text-white transition-colors">Versandkosten</Link></span>
          </div>
        </div>
      </div>
    </footer>
  )
}

function ChevronRight({ className }: { className?: string }) {
  return <ArrowRight className={className} />
}
