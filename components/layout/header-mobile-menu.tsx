'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { X, ChevronRight, ChevronDown, User } from 'lucide-react'
import { megaMenuDepartments } from './header-mega-menu'

const WhatsAppIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5 fill-[#25D366]">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
  </svg>
)

import { COMPANY } from '@/lib/constants/company'

const WHATSAPP_URL = `${COMPANY.whatsapp.url}?text=Hallo%20NOVA%20INDUKT%20Team%2C%20ich%20habe%20eine%20Frage%20zu%20einem%20Produkt.`

interface NavItem {
  label: string
  href: string
  hasMega?: boolean
  alsoActiveFor?: string[]
}

interface MobileMenuProps {
  isOpen: boolean
  onClose: () => void
  navItems: NavItem[]
  isActive: (href: string, alsoActiveFor?: string[]) => boolean
}

export function MobileMenu({ isOpen, onClose, navItems, isActive }: MobileMenuProps) {
  if (!isOpen) return null

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] lg:hidden"
    >
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0, transition: { delay: 0.1 } }}
        className="absolute inset-0 bg-[#0C211E]/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Drawer */}
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 28, stiffness: 200 }}
        data-testid="mobile-menu"
        className="absolute top-0 right-0 bottom-0 w-[90%] max-w-sm bg-white shadow-[auto] flex flex-col rounded-l-3xl overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gray-50/50 text-black">
          <Image src="/logo0.png" alt="NOVA INDUKT" width={140} height={42} className="h-9 w-auto" />
          <button
            onClick={onClose}
            data-testid="mobile-menu-close-button"
            aria-label="Menü schließen"
            className="p-2.5 text-gray-400 hover:text-gray-900 bg-white shadow-sm border border-gray-100 rounded-full hover:bg-gray-50 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Nav */}
        <div className="flex-1 overflow-y-auto bg-white text-black">
          <nav className="p-4 space-y-1">
            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-3 ml-2">Menü</p>
            {navItems.map((item, index) => (
              <motion.div
                key={item.href}
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 + 0.1 }}
              >
                <Link
                  href={item.href}
                  onClick={onClose}
                  className={`flex items-center justify-between py-3 px-4 rounded-xl text-sm font-black transition-all uppercase tracking-tight ${
                    isActive(item.href)
                      ? 'text-white bg-[#0C211E] shadow-lg shadow-black/10'
                      : 'text-gray-800 hover:bg-gray-50'
                  }`}
                >
                  {item.label}
                  <ChevronRight
                    className={`w-4 h-4 ${isActive(item.href) ? 'text-nova-400' : 'text-gray-300'}`}
                  />
                </Link>
              </motion.div>
            ))}

            {/* Sortiment */}
            <div className="pt-8 mt-6 border-t border-gray-100">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4 ml-2">Sortiment</p>
              <div className="grid grid-cols-1 gap-3">
                {megaMenuDepartments.map((dept, i) => (
                  <motion.div
                    key={dept.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + i * 0.05 }}
                  >
                    <details className="group p-4 rounded-2xl bg-gray-50 border border-gray-100 hover:border-[#4ECCA3]/30 transition-all mb-1 cursor-pointer">
                      <summary className="font-bold text-gray-800 text-sm list-none flex items-center justify-between outline-none">
                        <span className="flex items-center gap-3">
                          <span className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center">
                            {dept.icon}
                          </span>
                          {dept.title}
                        </span>
                        <ChevronDown className="w-5 h-5 group-open:rotate-180 transition-transform text-gray-400" />
                      </summary>
                      <div className="pt-4 mt-4 border-t border-gray-100/60 flex flex-col gap-1.5 ml-2">
                        {dept.links.map((link) => (
                          <Link
                            key={link.label}
                            href={link.href}
                            onClick={onClose}
                            className="py-2.5 px-3 text-sm text-gray-500 font-semibold hover:bg-[#4ECCA3]/10 hover:text-[#4ECCA3] rounded-lg transition-colors"
                          >
                            {link.label}
                          </Link>
                        ))}
                      </div>
                    </details>
                  </motion.div>
                ))}
              </div>
            </div>
          </nav>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 p-6 pb-[env(safe-area-inset-bottom,1.5rem)] border-t border-gray-100 text-black">
          <Link
            href="/mein-konto"
            onClick={onClose}
            className="flex items-center gap-4 py-3 px-4 text-gray-800 hover:bg-white border border-transparent hover:border-gray-200 rounded-2xl transition-all mb-3 font-bold group"
          >
            <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center flex-shrink-0 group-hover:text-[#4ECCA3] transition-colors border border-gray-100">
              <User className="w-5 h-5" />
            </div>
            Mein Konto
          </Link>

          <div className="flex items-center justify-between py-4 px-5 bg-[#0C211E] text-white rounded-2xl shadow-xl shadow-black/20">
            <div>
              <span className="font-bold text-sm block mb-1">Kundenservice</span>
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-nova-200 hover:underline font-bold text-sm"
              >
                Jetzt Kontaktieren
              </a>
            </div>
            <div className="w-10 h-10 rounded-full bg-[#25D366]/20 flex items-center justify-center border border-green-500/30">
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Kontakt via WhatsApp"
                className="flex items-center justify-center w-full h-full"
              >
                <WhatsAppIcon />
              </a>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
