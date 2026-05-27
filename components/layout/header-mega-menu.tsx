'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Flame, Sparkles, ChefHat, ArrowRight, Shield, Heart } from 'lucide-react'

export const megaMenuDepartments = [
  {
    title: 'Induktionspfannen',
    icon: <Flame className="w-5 h-5 text-[#4ECCA3]" />,
    links: [
      { label: 'Alle Pfannen', href: '/produkte?kategorie=induktionspfannen' },
      { label: 'Bratpfannen', href: '/produkte?kategorie=induktionspfannen' },
      { label: 'Schmorpfannen', href: '/produkte?kategorie=induktionspfannen' },
      { label: 'Woks & Servierpfannen', href: '/produkte?kategorie=induktionspfannen' },
    ],
  },
  {
    title: 'Induktionstöpfe',
    icon: <ChefHat className="w-5 h-5 text-[#4ECCA3]" />,
    links: [
      { label: 'Alle Töpfe', href: '/produkte?kategorie=induktionstoepfe' },
      { label: 'Kochtöpfe', href: '/produkte?kategorie=induktionstoepfe' },
      { label: 'Stieltöpfe', href: '/produkte?kategorie=induktionstoepfe' },
      { label: 'Bräter & Kasserollen', href: '/produkte?kategorie=induktionstoepfe' },
    ],
  },
  {
    title: 'Topf- & Pfannensets',
    icon: <Sparkles className="w-5 h-5 text-[#4ECCA3]" />,
    links: [
      { label: 'Alle Sets', href: '/produkte?kategorie=induktions-sets' },
      { label: 'Topfsets', href: '/produkte?kategorie=induktions-sets' },
      { label: 'Pfannensets', href: '/produkte?kategorie=induktions-sets' },
      { label: 'Kombisets', href: '/produkte?kategorie=induktions-sets' },
    ],
  },
  {
    title: 'Induktions-Zubehör',
    icon: <Shield className="w-5 h-5 text-[#4ECCA3]" />,
    links: [
      { label: 'Alle Zubehörteile', href: '/produkte?kategorie=induktions-zubehoer' },
      { label: 'Pflegemittel', href: '/produkte?kategorie=induktions-zubehoer' },
      { label: 'Kratzschutzmatten', href: '/produkte?kategorie=induktions-zubehoer' },
      { label: 'Adapterplatten', href: '/produkte?kategorie=induktions-zubehoer' },
    ],
  },
]

interface MegaMenuProps {
  onClose: () => void
  onMouseEnter: () => void
  onMouseLeave: () => void
}

export function MegaMenu({ onClose, onMouseEnter, onMouseLeave }: MegaMenuProps) {
  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="fixed inset-0 top-[120px] bg-black/10 backdrop-blur-[2px] z-40"
        onMouseEnter={onClose}
      />

      {/* Panel */}
      <motion.div
        initial={{ opacity: 0, y: -10, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -10, scale: 0.98 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        data-testid="mega-menu-dropdown"
        className="absolute left-0 right-0 top-full bg-white/95 backdrop-blur-2xl border-t border-gray-100 shadow-[0_20px_40px_rgba(0,0,0,0.08)] z-50 origin-top overflow-hidden"
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-gray-50/50 to-transparent pointer-events-none" />
        <div className="container mx-auto px-4 py-10 relative">
          <div className="grid grid-cols-12 gap-10">

            {/* Left: Categories */}
            <div className="col-span-9 grid grid-cols-4 gap-x-6 gap-y-10">
              {megaMenuDepartments.map((dept, idx) => (
                <motion.div
                  key={dept.title}
                  data-testid="mega-menu-category"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 * idx }}
                >
                  <h3 className="font-bold text-gray-900 border-b border-gray-100 pb-3 mb-5 flex items-center gap-2.5">
                    <span className="w-8 h-8 rounded-lg bg-[#4ECCA3]/10 flex items-center justify-center">
                      {dept.icon}
                    </span>
                    {dept.title}
                  </h3>
                  <ul className="space-y-3.5">
                    {dept.links.map((link) => (
                      <li key={link.label}>
                        <Link
                          href={link.href}
                          data-testid="mega-menu-subcategory"
                          onClick={onClose}
                          className="text-sm font-semibold text-gray-500 hover:text-[#4ECCA3] hover:translate-x-1.5 transition-all inline-block hover:bg-[#4ECCA3]/5 px-2 py-1 -ml-2 rounded-md"
                        >
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>

            {/* Right: Featured Promo */}
            <div className="col-span-3 pl-10 border-l border-gray-100">
              <div className="bg-[#0C211E] rounded-3xl p-6 relative overflow-hidden group h-full flex flex-col justify-end min-h-[200px]">
                <Image
                  src="/images/Die Premium/Die Premium.jpeg"
                  alt="Die Premium Serie"
                  fill
                  className="object-cover opacity-60 group-hover:opacity-70 group-hover:scale-105 transition-all duration-700"
                  sizes="(max-width: 768px) 100vw, 300px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-10" />
                <div className="relative z-20">
                  <span className="inline-block px-3 py-1 bg-[#4ECCA3]/20 backdrop-blur-md rounded-lg text-[#4ECCA3] text-xs font-bold mb-3 border border-[#4ECCA3]/30 uppercase tracking-wider">
                    Neu Eingetroffen
                  </span>
                  <h4 className="text-xl font-bold text-white mb-2 leading-tight">Die Premium Serie &apos;Nova Core&apos;</h4>
                  <Link
                    href="/produkte"
                    onClick={onClose}
                    className="inline-flex items-center gap-2 text-sm font-bold text-white hover:text-[#4ECCA3] transition-colors group/link mt-2"
                  >
                    Jetzt entdecken <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-10 pt-6 border-t border-gray-100 flex items-center justify-between">
            <Link
              href="/produkte"
              onClick={onClose}
              className="flex items-center gap-2 text-sm font-bold text-gray-900 hover:text-[#4ECCA3] transition-colors group"
            >
              Alle Produkte ansehen
              <div className="w-6 h-6 rounded-full bg-gray-100 group-hover:bg-[#4ECCA3]/10 flex items-center justify-center transition-colors">
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </Link>
            <div className="flex items-center gap-8 text-xs font-bold text-gray-400 uppercase tracking-widest">
              <span className="flex items-center gap-1.5"><Sparkles className="w-3.5 h-3.5 text-[#4ECCA3]" /> Made in Germany</span>
              <span className="flex items-center gap-1.5"><Shield className="w-3.5 h-3.5 text-[#4ECCA3]" /> TÜV Geprüft</span>
              <span className="flex items-center gap-1.5"><Heart className="w-3.5 h-3.5 text-[#4ECCA3]" /> Trusted Shops</span>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  )
}
