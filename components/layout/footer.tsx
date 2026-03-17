'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { Facebook, Instagram, Twitter, Youtube, CreditCard, Truck, ShieldCheck, RotateCcw } from 'lucide-react'

export function Footer() {
  const t = useTranslations()
  const currentYear = new Date().getFullYear()

  const footerLinks = {
    company: [
      { label: t('nav.about'), href: '/uber-uns' },
      { label: 'Blog', href: '/blog' },
    ],
    support: [
      { label: t('nav.contact'), href: '/kontakt' },
      { label: 'FAQ', href: '/faq' },
    ],
    legal: [
      { label: t('footer.imprint'), href: '/impressum' },
      { label: t('footer.terms'), href: '/agb' },
      { label: t('footer.privacy'), href: '/datenschutz' },
      { label: t('footer.withdrawal'), href: '/widerruf' },
    ],
  }

  const features = [
    { icon: Truck, title: t('trust.freeShipping'), desc: t('trust.freeShippingDesc') },
    { icon: ShieldCheck, title: t('footer.securePayment'), desc: t('footer.ssl') },
    { icon: RotateCcw, title: t('trust.returns'), desc: t('footer.moneyBack') },
    { icon: CreditCard, title: t('footer.flexiblePayment'), desc: t('footer.paymentOptions') },
  ]

  return (
    <footer className="bg-gray-900 text-white">
      {/* Features */}
      <div className="border-b border-white/10">
        <div className="container mx-auto px-4 py-6 sm:py-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center gap-3 justify-center sm:justify-start">
                <div className="w-10 h-10 bg-[#4ECCA3]/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <feature.icon className="w-5 h-5 text-[#4ECCA3]" />
                </div>
                <div className="text-center sm:text-left">
                  <h3 className="font-medium text-sm">{feature.title}</h3>
                  <p className="text-xs text-gray-400">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="container mx-auto px-4 py-8 sm:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-2 mb-4">
              <Image 
                src="/logo0.png" 
                alt="Nova Indukt" 
                width={100} 
                height={35} 
                className="h-8 w-auto brightness-0 invert"
              />
            </div>
            <p className="text-gray-400 text-sm mb-4">
              {t('footer.tagline')}
            </p>
            <div className="flex gap-3 justify-center sm:justify-start">
              {[Facebook, Instagram, Twitter, Youtube].map((Icon, index) => (
                <span
                  key={index}
                  className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center opacity-50 cursor-not-allowed"
                  title="Coming soon"
                >
                  <Icon className="w-4 h-4" />
                </span>
              ))}
            </div>
          </div>

          {/* Links */}
          <div className="text-center sm:text-left">
            <h3 className="font-semibold mb-4">{t('footer.company')}</h3>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-gray-400 hover:text-[#4ECCA3] text-sm transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="text-center sm:text-left">
            <h3 className="font-semibold mb-4">{t('footer.support')}</h3>
            <ul className="space-y-2">
              {footerLinks.support.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-gray-400 hover:text-[#4ECCA3] text-sm transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="text-center sm:text-left">
            <h3 className="font-semibold mb-4">{t('footer.legal')}</h3>
            <ul className="space-y-2">
              {footerLinks.legal.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-gray-400 hover:text-[#4ECCA3] text-sm transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Payment & Shipping Partners */}
        <div className="border-t border-white/10 py-4 sm:py-6 mt-6 sm:mt-8">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 sm:gap-6">
              {/* Payment Methods */}
              <div className="flex flex-col items-center md:items-start gap-2">
                <p className="text-xs text-gray-500 uppercase tracking-wider">{t('footer.paymentMethods')}</p>
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                  <span className="px-2 py-1 bg-white/10 rounded text-xs font-medium">Visa</span>
                  <span className="px-2 py-1 bg-white/10 rounded text-xs font-medium">Mastercard</span>
                  <span className="px-2 py-1 bg-white/10 rounded text-xs font-medium">PayPal</span>
                  <span className="px-2 py-1 bg-white/10 rounded text-xs font-medium">Klarna</span>
                  <span className="px-2 py-1 bg-white/10 rounded text-xs font-medium hidden sm:inline">Apple Pay</span>
                  <span className="px-2 py-1 bg-white/10 rounded text-xs font-medium hidden sm:inline">Google Pay</span>
                </div>
              </div>
              
              {/* Shipping Partners */}
              <div className="flex flex-col items-center md:items-end gap-2">
                <p className="text-xs text-gray-500 uppercase tracking-wider">{t('footer.shippingPartners')}</p>
                <div className="flex flex-wrap items-center justify-center md:justify-end gap-2">
                  <span className="px-2 py-1 bg-[#4ECCA3]/20 text-[#4ECCA3] rounded text-xs font-medium">DHL</span>
                  <span className="px-2 py-1 bg-white/10 rounded text-xs font-medium">DPD</span>
                  <span className="px-2 py-1 bg-white/10 rounded text-xs font-medium">UPS</span>
                  <span className="px-2 py-1 bg-white/10 rounded text-xs font-medium hidden sm:inline">GLS</span>
                </div>
              </div>
            </div>
            
            {/* Trust Badges Row */}
            <div className="flex flex-wrap justify-center gap-3 sm:gap-4 mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-white/10">
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <span className="text-[#4ECCA3]">🔒</span> {t('footer.sslEncryption')}
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <span className="text-[#4ECCA3]">🇩🇪</span> {t('trust.madeInGermany')}
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <span className="text-[#4ECCA3]">⭐</span> {t('footer.trustedShops')}
              </div>
              <div className="items-center gap-2 text-xs text-gray-400 hidden sm:flex">
                <span className="text-[#4ECCA3]">✓</span> {t('footer.tuvCertified')}
              </div>
              <div className="items-center gap-2 text-xs text-gray-400 hidden sm:flex">
                <span className="text-[#4ECCA3]">🌱</span> {t('footer.sustainable')}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 text-center sm:text-left">
          <p className="text-sm text-gray-400">
            © {currentYear} NOVA INDUKT. {t('footer.allRightsReserved')}
          </p>
          <p className="text-sm text-gray-400">
            {t('footer.pricesIncludeVat')}
          </p>
        </div>
      </div>
    </footer>
  )
}
