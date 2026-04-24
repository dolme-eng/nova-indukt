'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Facebook, Instagram, Youtube, CreditCard, Truck, ShieldCheck, RotateCcw, Mail, MapPin, Phone, Clock, ArrowRight, ChevronRight, Lock, Flag, Star, CheckCircle, Leaf, Shield } from 'lucide-react'

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
    { icon: CreditCard, title: 'Flexible Zahlung', desc: 'PayPal, Kreditkarte, Klarna, Sofort' },
  ]

  return (
    <footer className="bg-[#0C211E] text-white overflow-hidden relative border-t border-[#17423C]">
      {/* Abstract Background Elements */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#4ECCA3]/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-[#17423C]/50 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/4 pointer-events-none" />

      {/* Features Bar - Ultra Premium */}
      <div className="relative border-b border-[#236456]/50 bg-black/20 backdrop-blur-sm z-10">
        <div className="container mx-auto px-4 sm:px-6 py-6">
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
      <div className="container mx-auto px-4 sm:px-6 py-10 sm:py-14 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8">
          
          {/* Brand & Contact Column */}
          <div className="lg:col-span-4">
            <Link href="/" className="inline-block mb-8">
              <Image src="/logo0.png" alt="Nova Indukt" width={160} height={48} className="h-12 w-auto brightness-0 invert opacity-90 hover:opacity-100 transition-opacity" style={{ width: 'auto', height: 'auto' }} />
            </Link>
            <p className="text-[#9FE1CD] text-base mb-8 leading-relaxed font-medium pe-4">
              Premium-Küchenzubehör & Elektrogeräte für Induktion – entwickelt in Deutschland für maximale Performance und höchste Langlebigkeit in Ihrer Küche.
            </p>
            
            <div className="space-y-4 mb-8">
              <div className="flex items-center gap-3 group">
                <div className="w-10 h-10 rounded-xl bg-[#17423C] flex items-center justify-center text-[#9FE1CD] group-hover:bg-[#4ECCA3] group-hover:text-[#0C211E] transition-all duration-300">
                  <Phone className="w-5 h-5" />
                </div>
                <a href="tel:+498912345678" className="text-[#9FE1CD] hover:text-[#4ECCA3] transition-colors">+49 89 12345678</a>
              </div>
              <div className="flex items-center gap-3 group">
                <div className="w-10 h-10 rounded-xl bg-[#17423C] flex items-center justify-center text-[#9FE1CD] group-hover:bg-[#4ECCA3] group-hover:text-[#0C211E] transition-all duration-300">
                  <Mail className="w-5 h-5" />
                </div>
                <a href="mailto:info@nova-indukt.de" className="text-[#9FE1CD] hover:text-[#4ECCA3] transition-colors">info@nova-indukt.de</a>
              </div>
              <div className="flex items-center gap-3 group">
                <div className="w-10 h-10 rounded-xl bg-[#17423C] flex items-center justify-center text-[#9FE1CD] group-hover:bg-[#4ECCA3] group-hover:text-[#0C211E] transition-all duration-300">
                  <MapPin className="w-5 h-5" />
                </div>
                <span className="text-[#9FE1CD]">Musterstraße 42, 10115 Berlin</span>
              </div>
            </div>

            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-white/10 border border-transparent flex items-center justify-center text-gray-500 hover:bg-[#4ECCA3] hover:text-white transition-colors cursor-pointer">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                </svg>
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/10 border border-transparent flex items-center justify-center text-gray-500 hover:bg-[#4ECCA3] hover:text-white transition-colors cursor-pointer">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                </svg>
              </a>
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
        <div className="border-t border-[#236456]/50 mt-10 pt-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <div>
              <p className="text-xs text-white uppercase tracking-widest mb-4 font-bold flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-[#4ECCA3]" /> Sichere Zahlungsarten
              </p>
              <div className="flex flex-wrap items-center gap-3">
                {['Visa', 'Mastercard', 'PayPal', 'Apple Pay', 'Google Pay', 'Vorkasse'].map(m => (
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
        <div className="border-t border-[#236456]/50 mt-6 pt-6">
          <div className="flex flex-wrap items-center justify-center gap-8 gap-y-4">
            {[
              { icon: <Lock className="w-4 h-4 text-[#4ECCA3]" />, label: 'SSL-Verschlüsselt' },
              { icon: <Flag className="w-4 h-4 text-[#4ECCA3]" />, label: 'Premium Qualität' },
              { icon: <CheckCircle className="w-4 h-4 text-[#4ECCA3]" />, label: '2 Jahre Garantie' },
              { icon: <Leaf className="w-4 h-4 text-[#4ECCA3]" />, label: 'Energieeffizient' },
              { icon: <Shield className="w-4 h-4 text-[#4ECCA3]" />, label: 'Sichere Zahlung' },
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
