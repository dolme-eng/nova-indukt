'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { 
  Search, ShoppingCart, User, Heart, Menu, X, Globe, Home, 
  ChevronRight, Package, Phone
} from 'lucide-react'
import { Link, usePathname } from '@/navigation'
import { useCart } from '@/lib/store/cart'
import { motion, AnimatePresence } from 'framer-motion'

interface HeaderProps {
  locale: string
}

const languages = [
  { code: 'de', label: 'DE', flag: '🇩🇪' },
  { code: 'en', label: 'EN', flag: '🇬🇧' },
  { code: 'fr', label: 'FR', flag: '🇫🇷' },
]

const navItems = [
  { label: 'Home', href: '/', icon: Home, mobileLabel: 'Startseite' },
  { label: 'Produkte', href: '/produkte', icon: Package, mobileLabel: 'Produkte' },
  { label: 'Über uns', href: '/uber-uns', icon: User, mobileLabel: 'Über uns' },
  { label: 'Kontakt', href: '/kontakt', icon: Phone, mobileLabel: 'Kontakt' },
]

export function Header({ locale }: HeaderProps) {
  const pathname = usePathname()
  const { totalItems } = useCart()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [wishlistCount, setWishlistCount] = useState(0)
  const [langMenuOpen, setLangMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const updateWishlistCount = () => {
      const saved = localStorage.getItem('nova-wishlist')
      if (saved) {
        setWishlistCount(JSON.parse(saved).length)
      }
    }
    updateWishlistCount()
    window.addEventListener('storage', updateWishlistCount)

    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    
    return () => {
      window.removeEventListener('storage', updateWishlistCount)
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false)
  }, [pathname])

  // Lock body scroll when menu open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [mobileMenuOpen])

  const switchLocale = (newLocale: string) => {
    const newPath = pathname.replace(`/${locale}`, `/${newLocale}`)
    window.location.href = newPath || `/${newLocale}`
  }

  return (
    <>
      <header 
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled ? 'bg-white/95 backdrop-blur-md shadow-md' : 'bg-white shadow-sm'
        }`}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16 lg:h-18">
            
            {/* Left Section - Logo */}
            <div className="flex items-center flex-shrink-0">
              <Link href="/" className="flex items-center">
                <Image 
                  src="/logo0.png" 
                  alt="Nova Indukt" 
                  width={140} 
                  height={45} 
                  className="h-8 sm:h-10 w-auto"
                  priority
                />
              </Link>
            </div>

            {/* Center Section - Desktop Navigation */}
            <nav className="hidden lg:flex items-center justify-center flex-1 max-w-2xl">
              <div className="flex items-center gap-1 bg-gray-100/80 rounded-full px-2 py-1">
                {navItems.map((item) => {
                  const Icon = item.icon
                  const isActive = pathname === item.href || pathname === `${item.href}/`
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                        isActive 
                          ? 'bg-[#4ECCA3] text-white shadow-md' 
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200/50'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </Link>
                  )
                })}
              </div>
            </nav>

            {/* Right Section - Actions */}
            <div className="flex items-center gap-1 sm:gap-2">
              {/* Desktop Search */}
              <div className="hidden xl:flex items-center">
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Suchen..."
                    className="w-44 pl-10 pr-4 py-2 bg-gray-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-[#4ECCA3] transition-all"
                  />
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                </div>
              </div>

              {/* Mobile Search Button */}
              <Link
                href="/suche"
                className="xl:hidden flex items-center justify-center p-2 text-gray-600 hover:text-[#4ECCA3] hover:bg-gray-100 rounded-full transition-colors"
              >
                <Search className="w-5 h-5" />
              </Link>

              {/* Language Switcher - Desktop */}
              <div className="hidden sm:relative">
                <button
                  onClick={() => setLangMenuOpen(!langMenuOpen)}
                  className="hidden sm:flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-gray-600 hover:text-[#4ECCA3] hover:bg-gray-100 rounded-full transition-colors"
                >
                  <Globe className="w-4 h-4" />
                  <span className="uppercase">{locale}</span>
                </button>
              </div>

              {/* Wishlist */}
              <Link 
                href="/wunschliste" 
                className="relative flex items-center justify-center p-2 text-gray-600 hover:text-[#4ECCA3] hover:bg-gray-100 rounded-full transition-colors"
              >
                <Heart className="w-5 h-5" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              {/* Cart */}
              <Link 
                href="/warenkorb" 
                className="relative flex items-center justify-center p-2 text-gray-600 hover:text-[#4ECCA3] hover:bg-gray-100 rounded-full transition-colors"
              >
                <ShoppingCart className="w-5 h-5" />
                {totalItems > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-[#4ECCA3] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </Link>

              {/* Account - Desktop */}
              <Link 
                href="/mein-konto" 
                className="hidden md:flex items-center justify-center p-2 text-gray-600 hover:text-[#4ECCA3] hover:bg-gray-100 rounded-full transition-colors"
              >
                <User className="w-5 h-5" />
              </Link>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden flex items-center justify-center p-2 text-gray-600 hover:text-[#4ECCA3] hover:bg-gray-100 rounded-full transition-colors"
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
                      <X className="w-6 h-6" />
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
      </header>

      {/* Modern Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 lg:hidden"
            />
            
            {/* Sidebar Menu */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-[85vw] max-w-sm bg-white z-50 lg:hidden shadow-2xl"
            >
              {/* Menu Header */}
              <div className="flex items-center justify-between p-4 border-b">
                <span className="font-bold text-lg text-gray-900">Menü</span>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Navigation Links */}
              <nav className="p-4 space-y-2">
                {navItems.map((item, index) => {
                  const Icon = item.icon
                  const isActive = pathname === item.href || pathname === `${item.href}/`
                  return (
                    <motion.div
                      key={item.href}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Link
                        href={item.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`flex items-center justify-between p-4 rounded-xl transition-all ${
                          isActive 
                            ? 'bg-[#4ECCA3] text-white shadow-lg' 
                            : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${isActive ? 'bg-white/20' : 'bg-white'}`}>
                            <Icon className="w-5 h-5" />
                          </div>
                          <span className="font-medium">{item.mobileLabel}</span>
                        </div>
                        <ChevronRight className={`w-5 h-5 ${isActive ? 'opacity-100' : 'opacity-40'}`} />
                      </Link>
                    </motion.div>
                  )
                })}
              </nav>

              {/* Language Selector in Menu */}
              <div className="px-4 py-4 border-t">
                <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-3">Sprache</p>
                <div className="flex gap-2">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        switchLocale(lang.code)
                        setMobileMenuOpen(false)
                      }}
                      className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                        locale === lang.code 
                          ? 'bg-[#4ECCA3] text-white shadow-md' 
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      <span className="text-lg">{lang.flag}</span>
                      {lang.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* User Actions in Menu */}
              <div className="px-4 py-4 border-t">
                <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-3">Mein Konto</p>
                <Link
                  href="/mein-konto"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  <div className="p-2 bg-white rounded-lg shadow-sm">
                    <User className="w-5 h-5" />
                  </div>
                  <span className="font-medium">Anmelden / Registrieren</span>
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Language Dropdown (Desktop) */}
      <AnimatePresence>
        {langMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setLangMenuOpen(false)}
              className="fixed inset-0 z-40 hidden sm:block"
            />
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              className="fixed top-20 right-4 lg:right-8 w-48 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50 hidden sm:block overflow-hidden"
            >
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => {
                    switchLocale(lang.code)
                    setLangMenuOpen(false)
                  }}
                  className={`w-full px-4 py-3 text-left text-sm hover:bg-gray-50 flex items-center gap-3 transition-colors ${
                    locale === lang.code ? 'text-[#4ECCA3] bg-[#4ECCA3]/5 font-medium' : 'text-gray-600'
                  }`}
                >
                  <span className="text-xl">{lang.flag}</span>
                  <span>{lang.label}</span>
                  {locale === lang.code && (
                    <div className="ml-auto w-2 h-2 rounded-full bg-[#4ECCA3]" />
                  )}
                </button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
