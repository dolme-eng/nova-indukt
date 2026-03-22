'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  Search, ShoppingCart, User, Heart, Menu, X, ChevronRight, 
  Phone, ChevronDown, Flame, Sparkles, Tag, Truck, ArrowRight, Shield,
  ChefHat, Utensils, UtensilsCrossed, Trash2, Plus, Minus, Lock, Check, Zap, Leaf
} from 'lucide-react'
import { useCart } from '@/lib/store/cart'
import { useWishlist } from '@/lib/store/wishlist'
import { motion, AnimatePresence } from 'framer-motion'
import { categories as dataCategories, products } from '@/lib/data/products'

const megaMenuDepartments = [
  {
    title: 'Kochen & Vorbereiten',
    icon: <Flame className="w-5 h-5 text-[#4ECCA3]" />,
    links: [
      { label: 'Kochen & Braten', href: '/produkte?kategorie=kochen' },
      { label: 'Premium Messer (Damast)', href: '/produkte?kategorie=messer_premium' },
      { label: 'Schneiden & Vorbereiten', href: '/produkte?kategorie=vorbereitung' },
      { label: 'Wok & Asiatisch', href: '/produkte?kategorie=wok' },
      { label: 'Indoor Grill & Teppanyaki', href: '/produkte?kategorie=grillen' },
      { label: 'Backen & Pâtisserie', href: '/produkte?kategorie=backen' },
    ]
  },
  {
    title: 'Specialty & Tech',
    icon: <Zap className="w-5 h-5 text-[#4ECCA3]" />,
    links: [
      { label: 'Smart Kitchen', href: '/produkte?kategorie=smart_kitchen' },
      { label: 'Elektrokleingeräte', href: '/produkte?kategorie=elektrokleingeraete' },
      { label: 'Sous-Vide & Vakuum', href: '/produkte?kategorie=sous_vide' },
      { label: 'Kaffee & Tee Bar', href: '/produkte?kategorie=kaffee_tee' },
      { label: 'Wein & Bar', href: '/produkte?kategorie=weinzubehoer' },
      { label: 'Fermentation', href: '/produkte?kategorie=fermentation' },
    ]
  },
  {
    title: 'Table & Lifestyle',
    icon: <Leaf className="w-5 h-5 text-[#4ECCA3]" />,
    links: [
      { label: 'Tisch & Servier', href: '/produkte?kategorie=tischaccessoires' },
      { label: 'Küchenzubehör', href: '/produkte?kategorie=zubehoer' },
      { label: 'Eco & Nachhaltigkeit', href: '/produkte?kategorie=nachhaltigkeit' },
      { label: 'Premium Aufbewahrung', href: '/produkte?kategorie=aufbewahrung' },
      { label: 'Spezial-Pflege', href: '/produkte?kategorie=pflege' },
    ]
  }
]

export function Header() {
  const pathname = usePathname()
  const { totalItems, items, removeItem, updateQuantity, totalPrice } = useCart()
  const { count: wishlistCount } = useWishlist()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [megaMenuOpen, setMegaMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const megaRef = useRef<HTMLDivElement>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)

  const searchResults = searchQuery.trim().length > 0 
    ? products.filter(p => p.name.de.toLowerCase().includes(searchQuery.toLowerCase()) || p.category.toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 4)
    : []

  useEffect(() => {
    if (searchOpen && searchInputRef.current) {
      setTimeout(() => searchInputRef.current?.focus(), 100)
    } else {
      setSearchQuery('')
    }
  }, [searchOpen])

  const navItems = [
    { label: 'Produkte', href: '/produkte', hasMega: true },
    { label: 'Technologie', href: '/technologie', hasMega: false },
    { label: 'Über uns', href: '/uber-uns', hasMega: false },
    { label: 'Blog', href: '/blog', hasMega: false },
    { label: 'Kontakt', href: '/kontakt', hasMega: false },
  ]

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll, { passive: true })
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
      {/* Top Bar - Ultra Premium */}
      <div className="bg-[#0C211E] text-white text-[11px] sm:text-xs py-2.5 hidden md:block border-b border-[#17423C]">
        <div className="container mx-auto px-4 sm:px-6 flex items-center justify-between font-medium tracking-wide">
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
            <a href="tel:+4930123456789" className="flex items-center gap-2 hover:text-white transition-colors">
              <Phone className="w-3.5 h-3.5" />+49 (0) 30 123 456 789
            </a>
            <span className="w-px h-3 bg-[#236456]" />
            <span className="text-[#6FD2B4]">Mo–Fr 9–18 Uhr</span>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header 
        className={`sticky top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled 
            ? 'bg-white/80 backdrop-blur-xl shadow-[0_4px_30px_rgba(0,0,0,0.03)] border-b border-white/20 py-2' 
            : 'bg-white border-b border-gray-100 py-4'
        }`}
      >
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between relative" ref={megaRef}>
            {/* Logo */}
            <Link href="/" className="flex-shrink-0 group relative z-10">
              <Image 
                src="/logo0.png" 
                alt="NOVA INDUKT" 
                width={180} 
                height={54} 
                className={`w-auto transition-all duration-500 ease-out ${scrolled ? 'h-7 sm:h-10' : 'h-8 sm:h-12'} group-hover:scale-105`} 
                priority 
              />
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center justify-center absolute inset-0 pointer-events-none">
              <div className="flex items-center gap-2 pointer-events-auto bg-gray-50/50 rounded-2xl p-1.5 border border-gray-100/80 backdrop-blur-sm">
                {navItems.map((item) => (
                  <div key={item.href} className="relative z-10">
                    {item.hasMega ? (
                      <button
                        onMouseEnter={() => setMegaMenuOpen(true)}
                        className={`group flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${
                          isActive(item.href) || megaMenuOpen
                            ? 'text-white bg-[#0C211E] shadow-md shadow-[#0C211E]/10' 
                            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100/80'
                        }`}
                      >
                        {item.label}
                        <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${megaMenuOpen ? 'rotate-180 text-white' : 'text-gray-400 group-hover:text-gray-600'}`} />
                      </button>
                    ) : (
                      <Link 
                        href={item.href} 
                        className={`block px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${
                          isActive(item.href) 
                            ? 'text-white bg-[#0C211E] shadow-md shadow-[#0C211E]/10' 
                            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100/80'
                        }`}
                      >
                        {item.label}
                      </Link>
                    )}
                  </div>
                ))}
              </div>
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-0.5 sm:gap-2 relative z-10 bg-white/50 backdrop-blur-md rounded-2xl p-1 sm:p-1.5 border border-gray-100">
              <button 
                onClick={() => setSearchOpen(true)} 
                className="p-2 sm:p-2.5 md:p-3 text-gray-400 hover:text-[#0C211E] hover:bg-gray-100 transition-all rounded-xl relative group" 
                aria-label="Suchen"
              >
                <Search className="w-5 h-5 transition-transform group-hover:scale-110" />
              </button>
              
              <Link href="/wunschliste" className="p-2 sm:p-2.5 md:p-3 text-gray-400 hover:text-[#0C211E] hover:bg-gray-100 transition-all rounded-xl relative group" aria-label="Wunschliste">
                <Heart className="w-5 h-5 transition-transform group-hover:scale-110" />
                <AnimatePresence>
                  {wishlistCount > 0 && (
                    <motion.span 
                      initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
                      className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] font-black tracking-tighter rounded-full flex items-center justify-center shadow-sm shadow-red-500/20 border-2 border-white"
                    >
                      {wishlistCount > 99 ? '99+' : wishlistCount}
                    </motion.span>
                  )}
                </AnimatePresence>
              </Link>
              
              <Link href="/mein-konto" className="hidden md:flex p-2.5 md:p-3 text-gray-400 hover:text-[#0C211E] hover:bg-gray-100 transition-all rounded-xl group" aria-label="Mein Konto">
                <User className="w-5 h-5 transition-transform group-hover:scale-110" />
              </Link>
              
              <button onClick={() => setCartDrawerOpen(true)} className="p-2 sm:p-2.5 md:p-3 text-gray-400 hover:text-[#0C211E] hover:bg-gray-100 transition-all rounded-xl relative group" aria-label="Warenkorb">
                <ShoppingCart className="w-5 h-5 transition-transform group-hover:scale-110" />
                <AnimatePresence>
                  {totalItems > 0 && (
                    <motion.span 
                      initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
                      className="absolute -top-1 -right-1 w-5 h-5 bg-[#4ECCA3] text-gray-900 text-[10px] font-black tracking-tighter rounded-full flex items-center justify-center shadow-sm shadow-[#4ECCA3]/40 border-2 border-white"
                    >
                      {totalItems > 99 ? '99+' : totalItems}
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>

              <button 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
                className="lg:hidden p-2 sm:p-2.5 md:p-3 text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-all rounded-xl" 
                aria-label="Menü"
              >
                <AnimatePresence mode="wait">
                  {mobileMenuOpen
                    ? <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}><X className="w-6 h-6" /></motion.div>
                    : <motion.div key="menu" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}><Menu className="w-6 h-6" /></motion.div>
                  }
                </AnimatePresence>
              </button>
            </div>
            
          </div>
        </div>

        {/* Mega Menu Dropdown */}
        <AnimatePresence>
          {megaMenuOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="fixed inset-0 top-[120px] bg-black/10 backdrop-blur-[2px] z-40"
                onMouseEnter={() => setMegaMenuOpen(false)}
              />
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.98 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                className="absolute left-0 right-0 top-full bg-white/95 backdrop-blur-2xl border-t border-gray-100 shadow-[0_20px_40px_rgba(0,0,0,0.08)] z-50 origin-top overflow-hidden"
                onMouseEnter={() => setMegaMenuOpen(true)} 
                onMouseLeave={() => setMegaMenuOpen(false)}
              >
                <div className="absolute inset-0 bg-gradient-to-b from-gray-50/50 to-transparent pointer-events-none" />
                <div className="container mx-auto px-4 py-10 relative">
                  <div className="grid grid-cols-12 gap-10">
                    
                    {/* Left side: Categories List */}
                    <div className="col-span-9 grid grid-cols-3 gap-x-8 gap-y-10">
                      {megaMenuDepartments.map((dept, idx) => (
                        <motion.div 
                          key={dept.title}
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
                            {dept.links.map(link => (
                               <li key={link.href}>
                                 <Link href={link.href} onClick={() => setMegaMenuOpen(false)} className="text-sm font-semibold text-gray-500 hover:text-[#4ECCA3] hover:translate-x-1.5 transition-all inline-block hover:bg-[#4ECCA3]/5 px-2 py-1 -ml-2 rounded-md">
                                   {link.label}
                                 </Link>
                               </li>
                            ))}
                          </ul>
                        </motion.div>
                      ))}
                    </div>

                    {/* Right side: Featured Promo */}
                    <div className="col-span-3 pl-10 border-l border-gray-100">
                      <div className="bg-[#0C211E] rounded-3xl p-6 relative overflow-hidden group h-full flex flex-col justify-end min-h-[200px]">
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10" />
                        
                        {dataCategories[0] && (
                          <Image 
                            src={dataCategories[0].image} 
                            alt="Featured" 
                            fill 
                            className="object-cover group-hover:scale-110 transition-transform duration-700 opacity-60 mix-blend-luminosity" 
                          />
                        )}
                        
                        <div className="relative z-20">
                          <span className="inline-block px-3 py-1 bg-[#4ECCA3]/20 backdrop-blur-md rounded-lg text-[#4ECCA3] text-xs font-bold mb-3 border border-[#4ECCA3]/30 uppercase tracking-wider">
                            Neu Eingetroffen
                          </span>
                          <h4 className="text-xl font-bold text-white mb-2 leading-tight">Die Premium Serie 'Nova Core'</h4>
                          <Link href="/produkte" onClick={() => setMegaMenuOpen(false)} className="inline-flex items-center gap-2 text-sm font-bold text-white hover:text-[#4ECCA3] transition-colors group/link mt-2">
                            Jetzt entdecken <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Footer of Mega Menu */}
                  <div className="mt-10 pt-6 border-t border-gray-100 flex items-center justify-between">
                    <Link href="/produkte" onClick={() => setMegaMenuOpen(false)} className="flex items-center gap-2 text-sm font-bold text-gray-900 hover:text-[#4ECCA3] transition-colors group">
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
          )}
        </AnimatePresence>

        {/* Mega Search Overlay */}
        <AnimatePresence>
          {searchOpen && (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[110] bg-white/95 backdrop-blur-2xl flex flex-col"
            >
              <div className="container mx-auto px-4 py-6 border-b border-gray-100 flex items-center justify-between">
                <div className="flex-1 max-w-4xl mx-auto relative flex items-center">
                  <Search className="w-6 h-6 text-gray-400 absolute left-4" />
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Wonach suchen Sie? (z.B. Pfanne, Messer)..."
                    className="w-full bg-gray-50/50 hover:bg-gray-50 text-gray-900 placeholder:text-gray-400 px-14 py-5 rounded-2xl text-xl md:text-2xl font-bold font-heading outline-none border border-transparent focus:border-[#4ECCA3] focus:ring-4 focus:ring-[#4ECCA3]/10 transition-all"
                  />
                  {searchQuery && (
                    <button onClick={() => setSearchQuery('')} className="absolute right-4 p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-200 rounded-full transition-colors">
                      <X className="w-5 h-5" />
                    </button>
                  )}
                </div>
                <button onClick={() => setSearchOpen(false)} className="ml-4 p-3 hover:bg-gray-100 rounded-full text-gray-500 hover:text-gray-900 transition-all">
                  <span className="sr-only">Schließen</span>
                  <X className="w-8 h-8" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto container mx-auto px-4 py-8">
                <div className="max-w-4xl mx-auto">
                  {!searchQuery ? (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 opacity-70">
                      <div className="col-span-full mb-4">
                        <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Beliebte Suchen</p>
                      </div>
                      {['Induktionstopf', 'Bratpfanne', 'Messer aus Japan', 'Dampfgarer'].map((term) => (
                        <button key={term} onClick={() => setSearchQuery(term)} className="px-5 py-3 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-xl font-bold text-sm text-left transition-colors border border-gray-100 flex items-center gap-2">
                          <Search className="w-3.5 h-3.5 text-gray-400" /> {term}
                        </button>
                      ))}
                    </div>
                  ) : searchResults.length > 0 ? (
                    <div>
                      <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-6">Produkte ({searchResults.length})</p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {searchResults.map((product) => (
                          <Link href={`/produkt/${product.slug}`} key={product.id} onClick={() => setSearchOpen(false)} className="group bg-white rounded-2xl border border-gray-100 hover:border-[#4ECCA3] shadow-sm hover:shadow-xl transition-all overflow-hidden flex flex-col">
                            <div className="aspect-square relative bg-gray-50 p-4">
                              <Image src={product.images[0]} alt={product.name.de} fill className="object-contain p-6 mix-blend-multiply group-hover:scale-110 transition-transform duration-500" />
                            </div>
                            <div className="p-4 flex flex-col flex-1 border-t border-gray-50">
                              <h3 className="font-bold text-gray-900 text-sm mb-2 line-clamp-2 group-hover:text-[#4ECCA3] transition-colors">{product.name.de}</h3>
                              <div className="mt-auto pt-2 flex items-baseline gap-2">
                                <span className="font-black text-[#0C211E]">{product.price.toFixed(2).replace('.', ',')} €</span>
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>
                      <Link href={`/produkte`} onClick={() => setSearchOpen(false)} className="mt-8 inline-flex items-center gap-2 font-bold text-[#0C211E] hover:text-[#4ECCA3] transition-colors">
                        Alle Ergebnisse für "{searchQuery}" ansehen <ArrowRight className="w-5 h-5" />
                      </Link>
                    </div>
                  ) : (
                    <div className="text-center py-20">
                      <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Search className="w-8 h-8 text-gray-300" />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-2 font-heading">Keine Ergebnisse gefunden</h3>
                      <p className="text-gray-500">Wir konnten leider nichts für "{searchQuery}" finden. Bitte versuchen Sie einen anderen Suchbegriff.</p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Cart Drawer */}
        <AnimatePresence>
          {cartDrawerOpen && (
            <>
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                exit={{ opacity: 0 }} 
                onClick={() => setCartDrawerOpen(false)}
                className="fixed inset-0 z-[110] bg-black/40 backdrop-blur-sm"
              />
              <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 28, stiffness: 200 }}
                className="fixed top-0 right-0 bottom-0 w-full sm:w-[420px] md:w-[480px] bg-white z-[120] shadow-2xl flex flex-col"
              >
                <div className="flex items-center justify-between p-6 border-b border-gray-100">
                  <h2 className="text-xl font-bold font-heading flex items-center gap-2 text-[#0C211E]">
                    <ShoppingCart className="w-6 h-6 text-[#4ECCA3]" /> Warenkorb ({totalItems})
                  </h2>
                  <button onClick={() => setCartDrawerOpen(false)} className="p-2 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-900 transition-all">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 bg-white">
                  {items.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                      <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center">
                        <ShoppingCart className="w-8 h-8 text-gray-300" />
                      </div>
                      <h3 className="text-2xl font-bold font-heading text-[#0C211E]">Ihr Warenkorb ist leer</h3>
                      <p className="text-gray-500 max-w-[280px]">Entdecken Sie unsere Premium-Kollektionen und lassen Sie sich inspirieren.</p>
                      <Link href="/produkte" onClick={() => setCartDrawerOpen(false)} className="px-8 py-4 bg-[#0C211E] text-white rounded-xl font-bold hover:bg-[#17423C] shadow-lg shadow-[#0C211E]/20 transition-all mt-4">
                        Zum Shop
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <AnimatePresence>
                        {items.map((item) => (
                          <motion.div layout initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.2 }} key={item.product.id} className="flex gap-4 bg-white">
                            <Link href={`/produkt/${item.product.slug}`} onClick={() => setCartDrawerOpen(false)} className="w-24 h-24 bg-gray-50 rounded-2xl relative flex-shrink-0 border border-gray-50 hover:border-[#4ECCA3] transition-colors group p-2">
                              <Image src={item.product.images[0]} alt={item.product.name.de} fill className="object-contain p-2 mix-blend-multiply group-hover:scale-110 transition-transform" />
                            </Link>
                            <div className="flex-1 flex flex-col justify-between py-1">
                              <div className="flex justify-between gap-2">
                                <div>
                                  <h4 className="font-bold text-[#0C211E] text-sm line-clamp-2 leading-snug"><Link href={`/produkt/${item.product.slug}`} onClick={() => setCartDrawerOpen(false)} className="hover:text-[#4ECCA3] transition-colors">{item.product.name.de}</Link></h4>
                                  <p className="text-[#0C211E] font-black text-sm mt-1">{item.product.price.toFixed(2).replace('.', ',')} €</p>
                                </div>
                                <button onClick={() => removeItem(item.product.id)} className="text-gray-400 hover:text-red-500 transition-colors p-1 self-start">
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                              <div className="flex items-center gap-3">
                                <div className="flex items-center bg-gray-50 rounded-xl p-1 border border-gray-100">
                                  <button onClick={() => updateQuantity(item.product.id, Math.max(1, item.quantity - 1))} className="w-7 h-7 flex items-center justify-center text-gray-500 hover:bg-white rounded-lg shadow-sm transition-colors">
                                    <Minus className="w-3 h-3" />
                                  </button>
                                  <span className="w-8 text-center text-sm font-bold text-gray-900">{item.quantity}</span>
                                  <button onClick={() => updateQuantity(item.product.id, item.quantity + 1)} disabled={item.quantity >= item.product.stock} className="w-7 h-7 flex items-center justify-center text-gray-500 hover:bg-white rounded-lg shadow-sm transition-colors disabled:opacity-50">
                                    <Plus className="w-3 h-3" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </AnimatePresence>

                      {/* Free Shipping Progress bar */}
                      <div className="mt-8 pt-6 border-t border-gray-100">
                        {totalPrice < 500 ? (
                          <div className="bg-[#4ECCA3]/10 border border-[#4ECCA3]/20 rounded-2xl p-4">
                            <p className="text-sm font-bold text-[#0C211E] mb-3 flex items-center gap-2">
                              <Truck className="w-4 h-4 text-[#4ECCA3]" /> Nur noch {(500 - totalPrice).toFixed(2).replace('.', ',')} € bis zum <span className="text-[#4ECCA3]">Gratisversand</span>!
                            </p>
                            <div className="h-2.5 bg-white rounded-full overflow-hidden border border-gray-50">
                              <motion.div initial={{ width: 0 }} animate={{ width: `${(totalPrice / 500) * 100}%` }} transition={{ duration: 0.5, ease: 'easeOut' }} className="h-full bg-[#4ECCA3]" />
                            </div>
                          </div>
                        ) : (
                          <div className="bg-[#4ECCA3]/10 border border-[#4ECCA3]/20 rounded-2xl p-4 flex items-center gap-3 text-sm font-bold text-[#0C211E]">
                            <div className="w-8 h-8 rounded-full bg-[#4ECCA3] text-gray-900 flex items-center justify-center flex-shrink-0">
                              <Check className="w-4 h-4" />
                            </div>
                            Wir schenken Ihnen die Versandkosten!
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {items.length > 0 && (
                  <div className="p-6 border-t border-gray-100 bg-gray-50/80 pb-safe shadow-[0_-10px_30px_rgba(0,0,0,0.03)] z-10">
                    <div className="space-y-3 mb-6">
                      <div className="flex justify-between text-sm text-gray-500 font-medium">
                        <span>Zwischensumme</span>
                        <span className="font-semibold text-gray-900">{totalPrice.toFixed(2).replace('.', ',')} €</span>
                      </div>
                      <div className="flex justify-between text-sm text-gray-500 font-medium">
                        <span>Versand</span>
                        <span className="font-semibold text-[#4ECCA3]">{totalPrice >= 500 ? 'Kostenlos' : 'Berechnet im Checkout'}</span>
                      </div>
                      <div className="flex justify-between text-lg font-bold pt-4 border-t border-gray-200 mt-2">
                        <span>Gesamtsumme <span className="text-xs font-semibold text-gray-500 block uppercase tracking-wider mt-1">inkl. MwSt.</span></span>
                        <span className="text-[#0C211E] text-2xl">{totalPrice.toFixed(2).replace('.', ',')} €</span>
                      </div>
                    </div>
                    
                    <div className="flex flex-col gap-3">
                      <Link href="/kasse" onClick={() => setCartDrawerOpen(false)} className="w-full py-4 text-center bg-[#0C211E] text-white font-bold rounded-2xl hover:bg-[#17423C] shadow-xl shadow-[#0C211E]/20 transition-all flex items-center justify-center gap-2">
                        <Lock className="w-4 h-4 text-[#4ECCA3]" /> Sicher zur Kasse
                      </Link>
                      <Link href="/warenkorb" onClick={() => setCartDrawerOpen(false)} className="w-full py-4 text-center bg-white border border-gray-200 text-[#0C211E] font-bold rounded-2xl hover:bg-gray-50 hover:border-gray-300 transition-colors">
                        Warenkorb ansehen
                      </Link>
                      
                      <div className="flex justify-center gap-4 mt-4 opacity-60">
                         {/* Icons for trusting like PayPal / Apple Pay abstract visual representation */}
                         <div className="text-xs font-bold text-gray-400 flex items-center gap-1.5"><Shield className="w-3.5 h-3.5"/> ssl-secure</div>
                         <div className="text-xs font-bold text-gray-400 flex items-center gap-1.5"><Truck className="w-3.5 h-3.5"/> express</div>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </header>

      {/* Mobile Menu - Ultra Smooth */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] lg:hidden">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0, transition: { delay: 0.1 } }} 
              className="absolute inset-0 bg-[#0C211E]/40 backdrop-blur-sm" 
              onClick={() => setMobileMenuOpen(false)} 
            />
            <motion.div 
              initial={{ x: '100%' }} 
              animate={{ x: 0 }} 
              exit={{ x: '100%' }} 
              transition={{ type: 'spring', damping: 28, stiffness: 200 }}
              className="absolute top-0 right-0 bottom-0 w-[90%] max-w-sm bg-white shadow-[auto] flex flex-col rounded-l-3xl overflow-hidden"
            >
              <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gray-50/50 text-black">
                <Image src="/logo0.png" alt="NOVA INDUKT" width={140} height={42} className="h-9 w-auto" />
                <button onClick={() => setMobileMenuOpen(false)} className="p-2.5 text-gray-400 hover:text-gray-900 bg-white shadow-sm border border-gray-100 rounded-full hover:bg-gray-50 transition-all">
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto bg-white text-black">
                <nav className="p-6 space-y-2">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4 ml-2">Menü</p>
                  {navItems.map((item, index) => (
                    <motion.div key={item.href} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.05 + 0.1 }}>
                      <Link href={item.href} onClick={() => setMobileMenuOpen(false)}
                        className={`flex items-center justify-between py-4 px-5 rounded-2xl text-lg font-bold transition-all ${isActive(item.href) ? 'text-white bg-[#0C211E] shadow-xl shadow-[#0C211E]/20' : 'text-gray-800 hover:bg-gray-50'}`}
                      >
                        {item.label}
                        <ChevronRight className={`w-5 h-5 ${isActive(item.href) ? 'text-[#4ECCA3]' : 'text-gray-300'}`} />
                      </Link>
                    </motion.div>
                  ))}
                  
                  <div className="pt-8 mt-6 border-t border-gray-100">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4 ml-2">Sortiment</p>
                    <div className="grid grid-cols-1 gap-3">
                      {megaMenuDepartments.map((dept, i) => (
                        <motion.div key={dept.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + i * 0.05 }}>
                          <details className="group p-4 rounded-2xl bg-gray-50 border border-gray-100 hover:border-[#4ECCA3]/30 transition-all mb-1 cursor-pointer">
                            <summary className="font-bold text-gray-800 text-sm list-none flex items-center justify-between outline-none">
                              <span className="flex items-center gap-3">
                                <span className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center">{dept.icon}</span> 
                                {dept.title}
                              </span>
                              <ChevronDown className="w-5 h-5 group-open:rotate-180 transition-transform text-gray-400" />
                            </summary>
                            <div className="pt-4 mt-4 border-t border-gray-100/60 flex flex-col gap-1.5 ml-2">
                              {dept.links.map(link => (
                                <Link key={link.href} href={link.href} onClick={() => setMobileMenuOpen(false)} className="py-2.5 px-3 text-sm text-gray-500 font-semibold hover:bg-[#4ECCA3]/10 hover:text-[#4ECCA3] rounded-lg transition-colors">
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
              
              <div className="bg-gray-50 p-6 pb-[env(safe-area-inset-bottom,1.5rem)] border-t border-gray-100 text-black">
                <Link href="/mein-konto" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-4 py-3 px-4 text-gray-800 hover:bg-white border border-transparent hover:border-gray-200 rounded-2xl transition-all mb-3 font-bold group">
                  <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center flex-shrink-0 group-hover:text-[#4ECCA3] transition-colors border border-gray-100">
                    <User className="w-5 h-5" />
                  </div>
                  Mein Konto
                </Link>
                <a href="tel:+4930123456789" className="flex items-center justify-between py-4 px-5 bg-[#0C211E] text-white rounded-2xl shadow-xl shadow-[#0C211E]/20">
                  <div>
                    <span className="font-bold text-sm block mb-1">Kundenservice</span>
                    <span className="text-[#9FE1CD] font-medium">+49 (0) 30 123 456 789</span>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-[#4ECCA3]/20 flex items-center justify-center border border-[#4ECCA3]/30">
                    <Phone className="w-4 h-4 text-[#4ECCA3]" />
                  </div>
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
