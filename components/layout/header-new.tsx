'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Search, ShoppingCart, User, Heart, Menu, X } from 'lucide-react'
import { Link, usePathname } from '@/navigation'
import { useCart } from '@/lib/store/cart'

interface HeaderProps {
  locale: string
}

const navItems = [
  { label: 'Produkte', href: '/produkte' },
  { label: 'Über uns', href: '/uber-uns' },
  { label: 'Kontakt', href: '/kontakt' },
]

const languages = [
  { code: 'de', label: 'DE' },
  { code: 'en', label: 'EN' },
  { code: 'fr', label: 'FR' },
]

export function Header({ locale }: HeaderProps) {
  const pathname = usePathname()
  const { totalItems } = useCart()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [wishlistCount, setWishlistCount] = useState(0)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const saved = localStorage.getItem('nova-wishlist')
    if (saved) setWishlistCount(JSON.parse(saved).length)
  }, [])

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => { document.body.style.overflow = 'unset' }
  }, [mobileMenuOpen])

  const switchLocale = (newLocale: string) => {
    const newPath = pathname.replace(`/${locale}`, `/${newLocale}`)
    window.location.href = newPath || `/${newLocale}`
  }

  const isActive = (href: string) => pathname === href || pathname === `${href}/`

  return (
    <>
      <header 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? 'bg-white/95 backdrop-blur-md shadow-sm' : 'bg-white'
        }`}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-14">
            
            {/* Logo */}
            <Link href="/" className="flex-shrink-0">
              <Image 
                src="/logo0.png" 
                alt="NOVA INDUKT" 
                width={120} 
                height={36} 
                className="h-7 w-auto"
                priority
              />
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-8">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`text-sm font-medium transition-colors ${
                    isActive(item.href) 
                      ? 'text-[#4ECCA3]' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-1">
              {/* Search */}
              <Link
                href="/suche"
                className="p-2 text-gray-500 hover:text-gray-900 transition-colors"
              >
                <Search className="w-5 h-5" />
              </Link>

              {/* Language - Desktop */}
              <div className="hidden md:flex items-center gap-1 ml-2">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => switchLocale(lang.code)}
                    className={`px-2 py-1 text-xs font-medium rounded transition-colors ${
                      locale === lang.code 
                        ? 'text-[#4ECCA3] bg-[#4ECCA3]/10' 
                        : 'text-gray-400 hover:text-gray-600'
                    }`}
                  >
                    {lang.label}
                  </button>
                ))}
              </div>

              {/* Wishlist */}
              <Link 
                href="/wunschliste" 
                className="p-2 text-gray-500 hover:text-gray-900 transition-colors relative"
              >
                <Heart className="w-5 h-5" />
                {wishlistCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-medium rounded-full flex items-center justify-center">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              {/* Cart */}
              <Link 
                href="/warenkorb" 
                className="p-2 text-gray-500 hover:text-gray-900 transition-colors relative"
              >
                <ShoppingCart className="w-5 h-5" />
                {totalItems > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-[#4ECCA3] text-white text-[10px] font-medium rounded-full flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </Link>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 text-gray-500 hover:text-gray-900 transition-colors"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div 
            className="absolute inset-0 bg-black/20"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="absolute top-14 left-0 right-0 bg-white shadow-lg border-t">
            <nav className="container mx-auto px-4 py-4 space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block py-3 px-4 rounded-lg text-sm font-medium transition-colors ${
                    isActive(item.href) 
                      ? 'text-[#4ECCA3] bg-[#4ECCA3]/10' 
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
              <div className="border-t pt-4 mt-4">
                <p className="text-xs text-gray-400 uppercase tracking-wider mb-2 px-4">Sprache</p>
                <div className="flex gap-2 px-4">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        switchLocale(lang.code)
                        setMobileMenuOpen(false)
                      }}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        locale === lang.code 
                          ? 'bg-[#4ECCA3] text-white' 
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {lang.label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="border-t pt-4 mt-4">
                <Link
                  href="/mein-konto"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 py-3 px-4 text-sm text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <User className="w-4 h-4" />
                  Mein Konto
                </Link>
              </div>
            </nav>
          </div>
        </div>
      )}

      <div className="h-14" />
    </>
  )
}
