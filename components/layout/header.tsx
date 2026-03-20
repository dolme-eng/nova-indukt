'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  Search, ShoppingCart, User, Heart, Menu, X, ChevronRight, 
  Phone, ChevronDown, Flame, Sparkles, Tag, Truck
} from 'lucide-react'
import { useCart } from '@/lib/store/cart'
import { useWishlist } from '@/lib/store/wishlist'
import { motion, AnimatePresence } from 'framer-motion'

const categories = [
  { label: 'Kochen & Braten', href: '/produkte?kategorie=kochen', desc: 'Töpfe, Pfannen, Bräter' },
  { label: 'Vorbereitung', href: '/produkte?kategorie=vorbereitung', desc: 'Messer, Schneidbretter, Zubehör' },
  { label: 'Tisch & Servier', href: '/produkte?kategorie=tischaccessoires', desc: 'Serviergeschirr, Platten' },
  { label: 'Küchenzubehör', href: '/produkte?kategorie=zubehoer', desc: 'Utensilien, Helfer, Gadgets' },
]

export function Header() {
  const pathname = usePathname()
  const { totalItems } = useCart()
  const { count: wishlistCount } = useWishlist()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [megaMenuOpen, setMegaMenuOpen] = useState(false)
  const megaRef = useRef<HTMLDivElement>(null)

  const navItems = [
    { label: 'Produkte', href: '/produkte', hasMega: true },
    { label: 'Technologie', href: '/technologie', hasMega: false },
    { label: 'Über uns', href: '/uber-uns', hasMega: false },
    { label: 'Blog', href: '/blog', hasMega: false },
    { label: 'Kontakt', href: '/kontakt', hasMega: false },
  ]

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? 'hidden' : 'unset'
    return () => { document.body.style.overflow = 'unset' }
  }, [mobileMenuOpen])

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (megaRef.current && !megaRef.current.contains(e.target as Node)) {
        setMegaMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/')

  return (
    <>
      {/* Top Bar */}
      <div className="bg-gray-900 text-white text-xs py-2 hidden md:block">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center gap-6 text-gray-300">
            <span className="flex items-center gap-1.5"><Truck className="w-3.5 h-3.5 text-[#4ECCA3]" />Kostenlose Lieferung ab 500 €</span>
            <span className="flex items-center gap-1.5"><Sparkles className="w-3.5 h-3.5 text-[#4ECCA3]" />2 Jahre Garantie auf alle Produkte</span>
            <span className="flex items-center gap-1.5"><Tag className="w-3.5 h-3.5 text-[#4ECCA3]" />Alle Preise inkl. 19% MwSt.</span>
          </div>
          <div className="flex items-center gap-4 text-gray-300">
            <a href="tel:+4930123456789" className="flex items-center gap-1.5 hover:text-white transition-colors">
              <Phone className="w-3.5 h-3.5" />+49 (0) 30 123 456 789
            </a>
            <span className="text-gray-600">|</span>
            <span>Mo–Fr 9–18 Uhr</span>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className={`sticky top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/95 backdrop-blur-md shadow-md' : 'bg-white border-b border-gray-100'}`}>
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16 sm:h-20" ref={megaRef}>
            <Link href="/" className="flex-shrink-0 group">
              <Image src="/logo0.png" alt="NOVA INDUKT" width={160} height={48} className="h-9 sm:h-11 w-auto transition-opacity group-hover:opacity-80" priority />
            </Link>

            <nav className="hidden lg:flex items-center gap-1">
              {navItems.map((item) => (
                <div key={item.href} className="relative">
                  {item.hasMega ? (
                    <button
                      onMouseEnter={() => setMegaMenuOpen(true)}
                      className={`flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${isActive(item.href) ? 'text-[#4ECCA3] bg-[#4ECCA3]/5' : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'}`}
                    >
                      {item.label}<ChevronDown className={`w-3.5 h-3.5 transition-transform ${megaMenuOpen ? 'rotate-180' : ''}`} />
                    </button>
                  ) : (
                    <Link href={item.href} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors block ${isActive(item.href) ? 'text-[#4ECCA3] bg-[#4ECCA3]/5' : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'}`}>
                      {item.label}
                    </Link>
                  )}
                </div>
              ))}
            </nav>

            <div className="flex items-center gap-0.5 sm:gap-1">
              <Link href="/suche" className="p-2.5 text-gray-500 hover:text-gray-900 transition-colors rounded-full hover:bg-gray-100" aria-label="Suchen">
                <Search className="w-5 h-5" />
              </Link>
              <Link href="/wunschliste" className="p-2.5 text-gray-500 hover:text-gray-900 transition-colors relative rounded-full hover:bg-gray-100" aria-label="Wunschliste">
                <Heart className="w-5 h-5" />
                {wishlistCount > 0 && <span className="absolute top-1 right-1 w-[18px] h-[18px] bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">{wishlistCount > 99 ? '99+' : wishlistCount}</span>}
              </Link>
              <Link href="/mein-konto" className="hidden md:flex p-2.5 text-gray-500 hover:text-gray-900 transition-colors rounded-full hover:bg-gray-100" aria-label="Mein Konto">
                <User className="w-5 h-5" />
              </Link>
              <Link href="/warenkorb" className="p-2.5 text-gray-500 hover:text-gray-900 transition-colors relative rounded-full hover:bg-gray-100" aria-label="Warenkorb">
                <ShoppingCart className="w-5 h-5" />
                {totalItems > 0 && <span className="absolute top-1 right-1 w-[18px] h-[18px] bg-[#4ECCA3] text-white text-[10px] font-bold rounded-full flex items-center justify-center">{totalItems > 99 ? '99+' : totalItems}</span>}
              </Link>
              <Link href="/produkte" className="hidden lg:flex ml-2 items-center gap-2 px-4 py-2 bg-gray-900 text-white text-sm font-semibold rounded-xl hover:bg-gray-800 transition-colors">
                <Flame className="w-4 h-4 text-[#4ECCA3]" />Angebote
              </Link>
              <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="lg:hidden p-2.5 text-gray-500 hover:text-gray-900 transition-colors rounded-full hover:bg-gray-100 ml-1" aria-label="Menü">
                <AnimatePresence mode="wait">
                  {mobileMenuOpen
                    ? <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}><X className="w-5 h-5" /></motion.div>
                    : <motion.div key="menu" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }}><Menu className="w-5 h-5" /></motion.div>
                  }
                </AnimatePresence>
              </button>
            </div>
          </div>
        </div>

        {/* Mega Menu */}
        <AnimatePresence>
          {megaMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
              className="absolute left-0 right-0 bg-white border-t border-gray-100 shadow-xl z-50"
              onMouseEnter={() => setMegaMenuOpen(true)} onMouseLeave={() => setMegaMenuOpen(false)}
            >
              <div className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-4 gap-6">
                  {categories.map((cat) => (
                    <Link key={cat.href} href={cat.href} onClick={() => setMegaMenuOpen(false)}
                      className="group p-4 rounded-xl hover:bg-[#4ECCA3]/5 border border-transparent hover:border-[#4ECCA3]/20 transition-all"
                    >
                      <h3 className="font-semibold text-gray-900 group-hover:text-[#4ECCA3] transition-colors mb-1 flex items-center gap-2">
                        {cat.label}<ChevronRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </h3>
                      <p className="text-sm text-gray-500">{cat.desc}</p>
                    </Link>
                  ))}
                </div>
                <div className="mt-6 pt-6 border-t border-gray-100 flex items-center justify-between">
                  <Link href="/produkte" onClick={() => setMegaMenuOpen(false)} className="flex items-center gap-2 text-sm font-semibold text-[#4ECCA3] hover:underline">
                    Alle Produkte ansehen <ChevronRight className="w-4 h-4" />
                  </Link>
                  <div className="flex items-center gap-6 text-xs text-gray-400">
                    <span>🇩🇪 Made in Germany</span><span>✓ TÜV Geprüft</span><span>⭐ Trusted Shops</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-40 lg:hidden">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)} />
            <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="absolute top-0 right-0 bottom-0 w-full max-w-sm bg-white shadow-2xl flex flex-col"
            >
              <div className="flex items-center justify-between p-5 border-b">
                <Image src="/logo0.png" alt="NOVA INDUKT" width={120} height={36} className="h-8 w-auto" />
                <button onClick={() => setMobileMenuOpen(false)} className="p-2 text-gray-500 hover:text-gray-900 rounded-full hover:bg-gray-100"><X className="w-5 h-5" /></button>
              </div>
              <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-4 mb-3">Navigation</p>
                {navItems.map((item, index) => (
                  <motion.div key={item.href} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.07 }}>
                    <Link href={item.href} onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center justify-between py-3 px-4 rounded-xl text-base font-medium transition-colors ${isActive(item.href) ? 'text-[#4ECCA3] bg-[#4ECCA3]/10' : 'text-gray-700 hover:bg-gray-50'}`}
                    >
                      {item.label}<ChevronRight className="w-4 h-4 text-gray-400" />
                    </Link>
                  </motion.div>
                ))}
                <div className="pt-4 mt-4 border-t border-gray-100">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-4 mb-3">Kategorien</p>
                  {categories.map((cat, i) => (
                    <motion.div key={cat.href} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.35 + i * 0.07 }}>
                      <Link href={cat.href} onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center justify-between py-2.5 px-4 rounded-xl text-sm text-gray-600 hover:bg-gray-50 transition-colors"
                      >
                        <div><span className="font-medium">{cat.label}</span><span className="text-xs text-gray-400 block">{cat.desc}</span></div>
                        <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </nav>
              <div className="border-t p-4 space-y-2">
                <Link href="/mein-konto" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 py-3 px-4 text-gray-600 hover:bg-gray-50 rounded-xl transition-colors">
                  <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0"><User className="w-4 h-4" /></div>
                  <span className="font-medium">Mein Konto</span>
                </Link>
                <a href="tel:+4930123456789" className="flex items-center gap-3 py-3 px-4 text-gray-600 hover:bg-gray-50 rounded-xl transition-colors">
                  <div className="w-9 h-9 rounded-full bg-[#4ECCA3]/10 flex items-center justify-center flex-shrink-0"><Phone className="w-4 h-4 text-[#4ECCA3]" /></div>
                  <div><span className="font-medium text-sm block">+49 (0) 30 123 456 789</span><span className="text-xs text-gray-400">Mo–Fr 9–18 Uhr</span></div>
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
