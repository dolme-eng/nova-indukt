'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Flame, Sparkles, ChefHat, ArrowRight, Shield, Heart } from 'lucide-react'

export const megaMenuDepartments = [
  {
    title: 'Induktionspfannen',
    icon: <Flame className="h-5 w-5 text-[#4ECCA3]" />,
    href: '/produkte?kategorie=induktionspfannen',
    description: 'Bratpfannen, Schmorpfannen, Woks & mehr',
  },
  {
    title: 'Induktionstöpfe',
    icon: <ChefHat className="h-5 w-5 text-[#4ECCA3]" />,
    href: '/produkte?kategorie=induktionstoepfe',
    description: 'Kochtöpfe, Stieltöpfe, Bräter & Kasserollen',
  },
  {
    title: 'Topf- & Pfannensets',
    icon: <Sparkles className="h-5 w-5 text-[#4ECCA3]" />,
    href: '/produkte?kategorie=induktions-sets',
    description: 'Topfsets, Pfannensets, Kombisets',
  },
  {
    title: 'Induktions-Zubehör',
    icon: <Shield className="h-5 w-5 text-[#4ECCA3]" />,
    href: '/produkte?kategorie=induktions-zubehoer',
    description: 'Pflegemittel, Kratzschutzmatten, Adapterplatten',
  },
  {
    title: 'Kochfelder & Herde',
    icon: <Sparkles className="h-5 w-5 text-[#4ECCA3]" />,
    href: '/produkte?kategorie=induktionskochfelder-herde',
    description: 'Einbau-Kochfelder, Kochfelder mit Abzug, Mobile Induktionsplatten',
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
        className="fixed inset-0 top-[120px] z-40 bg-black/10 backdrop-blur-[2px]"
        onMouseEnter={onClose}
      />

      {/* Panel */}
      <motion.div
        initial={{ opacity: 0, y: -10, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -10, scale: 0.98 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        data-testid="mega-menu-dropdown"
        className="absolute left-0 right-0 top-full z-50 origin-top overflow-hidden border-t border-gray-100 bg-white/95 shadow-[0_20px_40px_rgba(0,0,0,0.08)] backdrop-blur-2xl"
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-gray-50/50 to-transparent" />
        <div className="container relative mx-auto px-4 py-10">
          <div className="grid grid-cols-12 gap-10">
            {/* Left: Categories */}
            <div className="col-span-9 grid grid-cols-3 gap-x-6 gap-y-10">
              {megaMenuDepartments.map((dept, idx) => (
                <motion.div
                  key={dept.title}
                  data-testid="mega-menu-category"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 * idx }}
                >
                  <Link href={dept.href} onClick={onClose} className="group block">
                    <h3 className="mb-5 flex items-center gap-2.5 border-b border-gray-100 pb-3 font-bold text-gray-900 transition-colors group-hover:text-[#4ECCA3]">
                      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#4ECCA3]/10 transition-colors group-hover:bg-[#4ECCA3]/20">
                        {dept.icon}
                      </span>
                      {dept.title}
                    </h3>
                    <p className="text-sm text-gray-500 transition-colors group-hover:text-gray-700">
                      {dept.description}
                    </p>
                  </Link>
                </motion.div>
              ))}
            </div>

            {/* Right: Featured Promo */}
            <div className="col-span-3 border-l border-gray-100 pl-10">
              <div className="group relative flex h-full min-h-[200px] flex-col justify-end overflow-hidden rounded-3xl bg-[#0C211E] p-6">
                <Image
                  src="/images/Die Premium/Die Premium.jpeg"
                  alt="Die Premium Serie"
                  fill
                  className="object-cover opacity-60 transition-all duration-700 group-hover:scale-105 group-hover:opacity-70"
                  sizes="(max-width: 768px) 100vw, 300px"
                />
                <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                <div className="relative z-20">
                  <span className="mb-3 inline-block rounded-lg border border-[#4ECCA3]/30 bg-[#4ECCA3]/20 px-3 py-1 text-xs font-bold uppercase tracking-wider text-[#4ECCA3] backdrop-blur-md">
                    Neu Eingetroffen
                  </span>
                  <h4 className="mb-2 text-xl font-bold leading-tight text-white">
                    Die Premium Serie &apos;Nova Core&apos;
                  </h4>
                  <Link
                    href="/produkte"
                    onClick={onClose}
                    className="group/link mt-2 inline-flex items-center gap-2 text-sm font-bold text-white transition-colors hover:text-[#4ECCA3]"
                  >
                    Jetzt entdecken{' '}
                    <ArrowRight className="h-4 w-4 transition-transform group-hover/link:translate-x-1" />
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-10 flex items-center justify-between border-t border-gray-100 pt-6">
            <Link
              href="/produkte"
              onClick={onClose}
              className="group flex items-center gap-2 text-sm font-bold text-gray-900 transition-colors hover:text-[#4ECCA3]"
            >
              Alle Produkte ansehen
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-100 transition-colors group-hover:bg-[#4ECCA3]/10">
                <ArrowRight className="h-3.5 w-3.5" />
              </div>
            </Link>
            <div className="flex items-center gap-8 text-xs font-bold uppercase tracking-widest text-gray-400">
              <span className="flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-[#4ECCA3]" /> Made in Germany
              </span>
              <span className="flex items-center gap-1.5">
                <Shield className="h-3.5 w-3.5 text-[#4ECCA3]" /> TÜV Geprüft
              </span>
              <span className="flex items-center gap-1.5">
                <Heart className="h-3.5 w-3.5 text-[#4ECCA3]" /> Trusted Shops
              </span>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  )
}
