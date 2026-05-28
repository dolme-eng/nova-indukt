'use client'

import { useState, useEffect, useRef } from 'react'
import { useDebounce } from '@/lib/hooks/use-debounce'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Search, ShoppingCart, User, Menu,
  ChevronDown, Truck, Sparkles, Tag,
} from 'lucide-react'
import { useCart } from '@/lib/store/cart'
import { motion, AnimatePresence } from 'framer-motion'
import { MegaMenu } from './header-mega-menu'
import { SearchOverlay } from './header-search-overlay'
import { CartDrawer } from './header-cart-drawer'
import { MobileMenu } from './header-mobile-menu'

// ─── Types ────────────────────────────────────────────────────────────────────

interface SearchResult {
  id: string
  nameDe: string
  slug: string
  price: number
  images: { url: string }[]
}

// ─── Nav items ───────────────────────────────────────────────────────────────

const navItems = [
  { label: 'Produkte', href: '/produkte', hasMega: true, alsoActiveFor: ['/produkt'] },
  { label: 'Technologie', href: '/technologie', hasMega: false },
  { label: 'Über uns', href: '/uber-uns', hasMega: false },
  { label: 'Blog', href: '/blog', hasMega: false },
  { label: 'Kontakt', href: '/kontakt', hasMega: false },
]

// ─── WhatsApp helper ─────────────────────────────────────────────────────────

const WHATSAPP_URL =
  'https://wa.me/493012345678?text=Hallo%20NOVA%20INDUKT%20Team%2C%20ich%20habe%20eine%20Frage%20zu%20einem%20Produkt.'

const WhatsAppIcon = () => (
  <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-[#25D366]">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
  </svg>
)

// ─── Main component ───────────────────────────────────────────────────────────

export function Header() {
  const pathname = usePathname()
  const { totalItems, items, removeItem, updateQuantity, totalPrice, isHydrated: isCartHydrated } = useCart()

  // UI state
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [megaMenuOpen, setMegaMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false)

  // Search state
  const [searchQuery, setSearchQuery] = useState('')
  const debouncedSearch = useDebounce(searchQuery, 300)
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const searchInputRef = useRef<HTMLInputElement>(null)

  // Mega menu click-outside ref
  const megaRef = useRef<HTMLDivElement>(null)

  // ── Effects ─────────────────────────────────────────────────────────────────

  // Live search
  useEffect(() => {
    const controller = new AbortController()
    if (debouncedSearch.trim().length >= 2) {
      setIsSearching(true)
      fetch(`/api/products/search?q=${encodeURIComponent(debouncedSearch)}`, { signal: controller.signal })
        .then(res => res.ok ? res.json() : [])
        .then(data => setSearchResults(data))
        .catch(err => { if (err?.name !== 'AbortError') console.error('Search error:', err) })
        .finally(() => setIsSearching(false))
    } else {
      setSearchResults([])
    }
    return () => controller.abort()
  }, [debouncedSearch])

  // Auto-focus search input
  useEffect(() => {
    if (searchOpen && searchInputRef.current) {
      setTimeout(() => searchInputRef.current?.focus(), 100)
    } else {
      setSearchQuery('')
    }
  }, [searchOpen])

  // Scroll detection
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? 'hidden' : 'unset'
    return () => { document.body.style.overflow = 'unset' }
  }, [mobileMenuOpen])

  // Close mega menu on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (megaRef.current && !megaRef.current.contains(e.target as Node)) {
        setMegaMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  // ── Helpers ─────────────────────────────────────────────────────────────────

  const isActive = (href: string, alsoActiveFor?: string[]) => {
    if (pathname === href || pathname.startsWith(href + '/')) return true
    return alsoActiveFor?.some(prefix => pathname === prefix || pathname.startsWith(prefix + '/')) ?? false
  }

  // ── Render ───────────────────────────────────────────────────────────────────

  return (
    <>
      {/* ── Top Bar ─────────────────────────────────────────────────────────── */}
      <div className="bg-[#0C211E] text-white text-[9px] sm:text-2xs py-1.5 hidden md:block border-b border-[#17423C]">
        <div className="container mx-auto px-4 sm:px-6 flex items-center justify-between font-bold tracking-wider uppercase">
          <div className="flex items-center gap-8 text-[#9FE1CD]">
            <span className="flex items-center gap-2 hover:text-white transition-colors cursor-default">
              <Truck className="w-3.5 h-3.5 text-[#4ECCA3]" />Kostenlose Lieferung ab 500 €
            </span>
            <span className="flex items-center gap-2 hover:text-white transition-colors cursor-default">
              <Sparkles className="w-3.5 h-3.5 text-[#4ECCA3]" />2 Jahre Garantie
            </span>
            <span className="flex items-center gap-2 hover:text-white transition-colors cursor-default">
              <Tag className="w-3.5 h-3.5 text-[#4ECCA3]" />Inkl. 19% MwSt.
            </span>
          </div>
          <div className="flex items-center gap-5 text-[#9FE1CD]">
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 hover:text-white transition-colors"
            >
              <WhatsAppIcon />
              Kundenservice
            </a>
            <span className="w-px h-3 bg-[#236456]" />
            <span className="text-[#6FD2B4]">Mo–Fr 9–18 Uhr</span>
          </div>
        </div>
      </div>

      {/* ── Main Header ─────────────────────────────────────────────────────── */}
      <header
        data-testid="site-header"
        className={`sticky top-0 left-0 right-0 z-50 transition-all duration-700 ease-[0.22,1,0.36,1] ${
          scrolled
            ? 'bg-white/80 backdrop-blur-md shadow-[0_4px_20px_rgba(0,0,0,0.03)] border-b border-gray-100/50 py-1'
            : 'bg-white border-b border-gray-50 py-1.5 sm:py-2.5'
        }`}
      >
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between relative" ref={megaRef}>

            {/* Logo */}
            <Link href="/" data-testid="site-logo" className="flex-shrink-0 group relative z-10">
              <Image
                src="/logo0.png"
                alt="NOVA INDUKT"
                width={150}
                height={45}
                className={`w-auto transition-all duration-500 ease-out ${scrolled ? 'h-7 sm:h-8' : 'h-8 sm:h-9'} group-hover:scale-105`}
                priority
                fetchPriority="high"
              />
            </Link>

            {/* Desktop Navigation */}
            <nav
              data-testid="main-navigation"
              className="hidden lg:flex items-center justify-center absolute inset-0 pointer-events-none"
            >
              <div className="flex items-center gap-1.5 pointer-events-auto">
                {navItems.map((item) => (
                  <div key={item.href} className="relative z-10">
                    {item.hasMega ? (
                      <button
                        onMouseEnter={() => setMegaMenuOpen(true)}
                        className={`group flex items-center gap-1 px-4 py-2 text-xs font-black transition-all duration-500 ease-[0.22,1,0.36,1] uppercase tracking-tight ${
                          isActive(item.href, item.alsoActiveFor) || megaMenuOpen
                            ? 'text-[#0C211E]'
                            : 'text-gray-600 hover:text-gray-900'
                        }`}
                      >
                        {item.label}
                        <ChevronDown
                          className={`w-3 h-3 transition-transform duration-500 ease-[0.22,1,0.36,1] ${
                            megaMenuOpen
                              ? 'rotate-180 text-[#0C211E]'
                              : 'text-gray-400 group-hover:text-gray-600'
                          }`}
                        />
                      </button>
                    ) : (
                      <Link
                        href={item.href}
                        className={`block px-4 py-2 text-xs font-black transition-all duration-500 ease-[0.22,1,0.36,1] uppercase tracking-tight ${
                          isActive(item.href, item.alsoActiveFor)
                            ? 'text-[#0C211E]'
                            : 'text-gray-500 hover:text-gray-900'
                        }`}
                      >
                        {item.label}
                      </Link>
                    )}

                    {/* Active underline indicator */}
                    {isActive(item.href, item.alsoActiveFor) && (
                      <motion.div
                        layoutId="nav-underline"
                        className="absolute bottom-0 left-5 right-5 h-0.5 bg-[#4ECCA3]"
                        transition={{ duration: 0.3 }}
                      />
                    )}
                  </div>
                ))}
              </div>
            </nav>

            {/* Action buttons */}
            <div className="flex items-center gap-2 relative z-10">
              <button
                onClick={() => setSearchOpen(true)}
                data-testid="search-button"
                className="p-2 text-gray-600 hover:text-[#0C211E] transition-all relative group"
                aria-label="Suchen"
              >
                <Search className="w-5 h-5 transition-transform group-hover:scale-110" />
              </button>

              <Link
                href="/mein-konto"
                className="hidden md:flex p-2 text-gray-600 hover:text-[#0C211E] transition-all group"
                aria-label="Mein Konto"
              >
                <User className="w-5 h-5 transition-transform group-hover:scale-110" />
              </Link>

              <button
                onClick={() => setCartDrawerOpen(true)}
                data-testid="cart-button"
                className="p-2 text-gray-600 hover:text-[#0C211E] transition-all relative group"
                aria-label="Warenkorb"
              >
                <ShoppingCart className="w-5 h-5 transition-transform group-hover:scale-110" />
                <AnimatePresence>
                  {isCartHydrated && totalItems > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      data-testid="cart-count"
                      className="absolute -top-1 -right-1 w-5 h-5 bg-[#4ECCA3] text-gray-900 text-[10px] font-black tracking-tighter rounded-full flex items-center justify-center shadow-sm shadow-[#4ECCA3]/40 border-2 border-white"
                    >
                      {totalItems > 99 ? '99+' : totalItems}
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>

              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                data-testid="mobile-menu-button"
                className="lg:hidden p-2 text-gray-600 hover:text-[#0C211E] transition-all group"
                aria-label="Menü"
              >
                <AnimatePresence mode="wait">
                  {mobileMenuOpen ? (
                    <motion.div
                      key="close"
                      initial={{ rotate: -90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      {/* X icon inline to avoid importing it separately */}
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="menu"
                      initial={{ rotate: 90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: -90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Menu className="w-6 h-6" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>
            </div>
          </div>
        </div>

        {/* ── Mega Menu ─────────────────────────────────────────────────────── */}
        <AnimatePresence>
          {megaMenuOpen && (
            <MegaMenu
              onClose={() => setMegaMenuOpen(false)}
              onMouseEnter={() => setMegaMenuOpen(true)}
              onMouseLeave={() => setMegaMenuOpen(false)}
            />
          )}
        </AnimatePresence>
      </header>

      {/* ── Search Overlay ─────────────────────────────────────────────────── */}
      <AnimatePresence>
        {searchOpen && (
          <SearchOverlay
            searchQuery={searchQuery}
            onQueryChange={setSearchQuery}
            onClose={() => setSearchOpen(false)}
            searchResults={searchResults}
            isSearching={isSearching}
            inputRef={searchInputRef}
          />
        )}
      </AnimatePresence>

      {/* ── Cart Drawer ─────────────────────────────────────────────────────── */}
      <CartDrawer
        isOpen={cartDrawerOpen}
        onClose={() => setCartDrawerOpen(false)}
        items={items}
        totalItems={totalItems}
        totalPrice={totalPrice}
        removeItem={removeItem}
        updateQuantity={updateQuantity}
      />

      {/* ── Mobile Menu ─────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <MobileMenu
            isOpen={mobileMenuOpen}
            onClose={() => setMobileMenuOpen(false)}
            navItems={navItems}
            isActive={isActive}
          />
        )}
      </AnimatePresence>
    </>
  )
}
