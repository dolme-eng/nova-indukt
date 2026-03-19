'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { Search, ShoppingCart, User, Heart, Menu, X, ChevronRight } from 'lucide-react'
import { Link, usePathname } from '@/navigation'
import { useCart } from '@/lib/store/cart'
import { useWishlist } from '@/lib/store/wishlist'
import { motion, AnimatePresence } from 'framer-motion'

export function Header() {
  const pathname = usePathname()
  const t = useTranslations()
  const { totalItems } = useCart()
  const { count: wishlistCount } = useWishlist()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  const navItems = [
    { label: t('nav.products'), href: '/produkte' },
    { label: t('nav.about'), href: '/uber-uns' },
    { label: t('nav.contact'), href: '/kontakt' },
  ]

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => { document.body.style.overflow = 'unset' }
  }, [mobileMenuOpen])

  const isActive = (href: string) => pathname === href || pathname === `${href}/`

  return (
    <>
      <header 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? 'bg-white/95 backdrop-blur-md shadow-sm' : 'bg-white'
        }`}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16 sm:h-20 lg:h-20">
            
            {/* Logo */}
            <Link href="/" className="flex-shrink-0">
              <Image 
                src="/logo0.png" 
                alt="NOVA INDUKT" 
                width={140} 
                height={42} 
                className="h-8 sm:h-9 w-auto"
                priority
              />
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-8">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`text-sm font-medium transition-colors relative py-2 ${
                    isActive(item.href) 
                      ? 'text-[#4ECCA3]' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {item.label}
                  {isActive(item.href) && (
                    <motion.div
                      layoutId="activeNav"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#4ECCA3] rounded-full"
                    />
                  )}
                </Link>
              ))}
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-0.5 sm:gap-1">
              {/* Search */}
              <Link
                href="/suche"
                className="p-2.5 sm:p-2 text-gray-500 hover:text-gray-900 transition-colors rounded-full hover:bg-gray-100"
                aria-label={t('search.placeholder')}
              >
                <Search className="w-5 h-5 sm:w-5 sm:h-5" />
              </Link>

              {/* Wishlist */}
              <Link 
                href="/wunschliste" 
                className="p-2.5 sm:p-2 text-gray-500 hover:text-gray-900 transition-colors relative rounded-full hover:bg-gray-100"
                aria-label={t('wishlist.title')}
              >
                <Heart className="w-5 h-5 sm:w-5 sm:h-5" />
                {wishlistCount > 0 && (
                  <span className="absolute top-1 right-1 w-[18px] h-[18px] sm:w-5 sm:h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center min-w-[18px]">
                    {wishlistCount > 99 ? '99+' : wishlistCount}
                  </span>
                )}
              </Link>

              {/* Account - Desktop */}
              <Link 
                href="/mein-konto" 
                className="hidden md:flex p-2.5 sm:p-2 text-gray-500 hover:text-gray-900 transition-colors rounded-full hover:bg-gray-100"
                aria-label={t('nav.account')}
              >
                <User className="w-5 h-5 sm:w-5 sm:h-5" />
              </Link>

              {/* Cart */}
              <Link 
                href="/warenkorb" 
                className="p-2.5 sm:p-2 text-gray-500 hover:text-gray-900 transition-colors relative rounded-full hover:bg-gray-100"
                aria-label={t('cart.title')}
              >
                <ShoppingCart className="w-5 h-5 sm:w-5 sm:h-5" />
                {totalItems > 0 && (
                  <span className="absolute top-1 right-1 w-[18px] h-[18px] sm:w-5 sm:h-5 bg-[#4ECCA3] text-white text-[10px] font-bold rounded-full flex items-center justify-center min-w-[18px]">
                    {totalItems > 99 ? '99+' : totalItems}
                  </span>
                )}
              </Link>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2.5 sm:p-2 text-gray-500 hover:text-gray-900 transition-colors rounded-full hover:bg-gray-100 ml-1"
                aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
              >
                <AnimatePresence mode="wait">
                  {mobileMenuOpen ? (
                    <motion.div
                      key="close"
                      initial={{ rotate: -90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 90, opacity: 0 }}
                      transition={{ duration: 0.15 }}
                    >
                      <X className="w-5 h-5 sm:w-5 sm:h-5" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="menu"
                      initial={{ rotate: 90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: -90, opacity: 0 }}
                      transition={{ duration: 0.15 }}
                    >
                      <Menu className="w-5 h-5 sm:w-5 sm:h-5" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 lg:hidden"
          >
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              onClick={() => setMobileMenuOpen(false)}
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="absolute top-0 right-0 bottom-0 w-full max-w-sm bg-white shadow-2xl"
            >
              <div className="flex items-center justify-between p-4 border-b">
                <span className="font-semibold text-gray-900">{t('nav.menu') || 'Menu'}</span>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 text-gray-500 hover:text-gray-900 transition-colors rounded-full hover:bg-gray-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <nav className="p-4 space-y-1">
                {navItems.map((item, index) => (
                  <motion.div
                    key={item.href}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Link
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center justify-between py-3 px-4 rounded-xl text-base font-medium transition-colors ${
                        isActive(item.href) 
                          ? 'text-[#4ECCA3] bg-[#4ECCA3]/10' 
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      {item.label}
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                    </Link>
                  </motion.div>
                ))}
              </nav>
              
              <div className="border-t p-4">
                <Link
                  href="/mein-konto"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 py-3 px-4 text-gray-600 hover:bg-gray-50 rounded-xl transition-colors"
                >
                  <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                    <User className="w-5 h-5" />
                  </div>
                  <span className="font-medium">{t('nav.account')}</span>
                </Link>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="h-16 sm:h-20" />
    </>
  )
}
