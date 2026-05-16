'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  Search, ShoppingCart, User, Heart, Menu, X, ChevronRight, 
  Phone, ChevronDown, Flame, Sparkles, Tag, Truck, ArrowRight, Shield,
  ChefHat, Trash2, Plus, Minus, Lock, Check,
  Loader2
} from 'lucide-react'
import { useCart } from '@/lib/store/cart'
import { motion, AnimatePresence } from 'framer-motion'
import { formatPriceDe } from '@/lib/utils/vat'

const megaMenuDepartments = [
  {
    title: 'Kochen & Braten',
    icon: <Flame className="w-5 h-5 text-[#4ECCA3]" />,
    links: [
      { label: 'Alle Produkte', href: '/produkte?kategorie=kochen-braten' },
      { label: 'Topfsets', href: '/produkte?kategorie=kochen-braten' },
      { label: 'Bratpfannen', href: '/produkte?kategorie=kochen-braten' },
      { label: 'Gusseisen & Bräter', href: '/produkte?kategorie=kochen-braten' },
    ]
  },
  {
    title: 'Messer & Vorbereitung',
    icon: <ChefHat className="w-5 h-5 text-[#4ECCA3]" />,
    links: [
      { label: 'Alle Messer', href: '/produkte?kategorie=messer-vorbereitung' },
      { label: 'Damastmesser', href: '/produkte?kategorie=messer-vorbereitung' },
      { label: 'Schneidebretter', href: '/produkte?kategorie=messer-vorbereitung' },
    ]
  },
  {
    title: 'Küchenhelfer & Zubehör',
    icon: <Sparkles className="w-5 h-5 text-[#4ECCA3]" />,
    links: [
      { label: 'Alle Küchenhelfer', href: '/produkte?kategorie=kuechenhelfer-zubehoer' },
      { label: 'Küchengeräte', href: '/produkte?kategorie=kuechenhelfer-zubehoer' },
      { label: 'Praktisches Zubehör', href: '/produkte?kategorie=kuechenhelfer-zubehoer' },
    ]
  },
  // NOTE: Backen & Patisserie et Tisch & Servieren sont masqués car 0 produits
  // À réactiver quand des produits seront ajoutés
  // {
  //   title: 'Backen & Patisserie',
  //   icon: <UtensilsCrossed className="w-5 h-5 text-[#4ECCA3]" />,
  //   links: [
  //     { label: 'Alle Backartikel', href: '/produkte?kategorie=backen-patisserie' },
  //     { label: 'Backformen', href: '/produkte?kategorie=backen-patisserie' },
  //     { label: 'Pizza & Brot', href: '/produkte?kategorie=backen-patisserie' },
  //   ]
  // },
  // {
  //   title: 'Tisch & Servieren',
  //   icon: <Utensils className="w-5 h-5 text-[#4ECCA3]" />,
  //   links: [
  //     { label: 'Alles für den Tisch', href: '/produkte?kategorie=tisch-servieren' },
  //     { label: 'Besteck & Gläser', href: '/produkte?kategorie=tisch-servieren' },
  //   ]
  // }
]

export function Header() {
  const pathname = usePathname()
  const { totalItems, items, removeItem, updateQuantity, totalPrice, isHydrated: isCartHydrated } = useCart()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [megaMenuOpen, setMegaMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const megaRef = useRef<HTMLDivElement>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)

  const [searchResults, setSearchResults] = useState<{id: string, nameDe: string, slug: string, price: number, images: {url: string}[]}[]>([])
  const [isSearching, setIsSearching] = useState(false)

  useEffect(() => {
    const controller = new AbortController()
    const delayDebounceFn = setTimeout(async () => {
      if (searchQuery.trim().length >= 2) {
        setIsSearching(true)
        try {
          const response = await fetch(
            `/api/products/search?q=${encodeURIComponent(searchQuery)}`,
            { signal: controller.signal }
          )
          if (response.ok) {
            const data = await response.json()
            setSearchResults(data)
          }
        } catch (error) {
          if (error instanceof Error && error.name === 'AbortError') return
          console.error("Search error:", error)
        } finally {
          setIsSearching(false)
        }
      } else {
        setSearchResults([])
      }
    }, 300)

    return () => {
      clearTimeout(delayDebounceFn)
      controller.abort()
    }
  }, [searchQuery])

  useEffect(() => {
    if (searchOpen && searchInputRef.current) {
      setTimeout(() => searchInputRef.current?.focus(), 100)
    } else {
      setSearchQuery('')
    }
  }, [searchOpen])

  const navItems = [
    { label: 'Produkte', href: '/produkte', hasMega: true, alsoActiveFor: ['/produkt'] },
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

  const isActive = (href: string, alsoActiveFor?: string[]) => {
    if (pathname === href || pathname.startsWith(href + '/')) return true
    return alsoActiveFor?.some(prefix => pathname === prefix || pathname.startsWith(prefix + '/')) ?? false
  }

  return (
    <>
      {/* Top Bar - Ultra Premium */}
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
              href="https://wa.me/493012345678?text=Hallo%20NOVA%20INDUKT%20Team%2C%20ich%20habe%20eine%20Frage%20zu%20einem%20Produkt." 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 hover:text-white transition-colors"
            >
              <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-[#25D366]"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
              Kundenservice
            </a>
            <span className="w-px h-3 bg-[#236456]" />
            <span className="text-[#6FD2B4]">Mo–Fr 9–18 Uhr</span>
          </div>
        </div>
      </div>

      {/* Main Header */}
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
                className={`w-auto transition-all duration-500 ease-out ${scrolled ? 'h-5 sm:h-7' : 'h-6 sm:h-9'} group-hover:scale-105`} 
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
                        <ChevronDown className={`w-3 h-3 transition-transform duration-500 ease-[0.22,1,0.36,1] ${megaMenuOpen ? 'rotate-180 text-[#0C211E]' : 'text-gray-400 group-hover:text-gray-600'}`} />
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
                    {/* Indicateur de ligne pour l'élément actif */}
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

            {/* Actions */}
            <div className="flex items-center gap-2 relative z-10">
              <button 
                onClick={() => setSearchOpen(true)} 
                data-testid="search-button"
                className="p-2 text-gray-600 hover:text-[#0C211E] transition-all relative group" 
                aria-label="Suchen"
              >
                <Search className="w-5 h-5 transition-transform group-hover:scale-110" />
              </button>
              
              <Link href="/mein-konto" className="hidden md:flex p-2 text-gray-600 hover:text-[#0C211E] transition-all group" aria-label="Mein Konto">
                <User className="w-5 h-5 transition-transform group-hover:scale-110" />
              </Link>
              
              <button onClick={() => setCartDrawerOpen(true)} data-testid="cart-button" className="p-2 text-gray-600 hover:text-[#0C211E] transition-all relative group" aria-label="Warenkorb">
                <ShoppingCart className="w-5 h-5 transition-transform group-hover:scale-110" />
                <AnimatePresence>
                  {isCartHydrated && totalItems > 0 && (
                    <motion.span 
                      initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
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
                data-testid="mega-menu-dropdown"
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
                                 <Link href={link.href} data-testid="mega-menu-subcategory" onClick={() => setMegaMenuOpen(false)} className="text-sm font-semibold text-gray-500 hover:text-[#4ECCA3] hover:translate-x-1.5 transition-all inline-block hover:bg-[#4ECCA3]/5 px-2 py-1 -ml-2 rounded-md">
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
                    data-testid="search-input"
                    ref={searchInputRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Wonach suchen Sie? (z.B. Pfanne, Messer)..."
                    className="w-full bg-gray-50/50 hover:bg-gray-50 text-gray-900 placeholder:text-gray-400 px-14 py-5 rounded-2xl text-xl md:text-2xl font-bold font-heading outline-none border border-transparent focus:border-[#4ECCA3] focus:ring-4 focus:ring-[#4ECCA3]/10 transition-all"
                  />
                  <div className="absolute right-4 flex items-center gap-2">
                    {isSearching && (
                      <Loader2 className="w-5 h-5 text-[#4ECCA3] animate-spin" />
                    )}
                    {searchQuery && (
                      <button onClick={() => setSearchQuery('')} aria-label="Suche löschen" className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-200 rounded-full transition-colors">
                        <X className="w-5 h-5" />
                      </button>
                    )}
                  </div>
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
                    <div data-testid="search-suggestions">
                      <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-6">Produkte ({searchResults.length})</p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {searchResults.map((product) => (
                          <Link 
                            href={`/produkt/${product.slug}`} 
                            key={product.id} 
                            data-testid="search-suggestion-item"
                            onClick={() => setSearchOpen(false)} 
                            className="group bg-white rounded-2xl border border-gray-100 hover:border-[#4ECCA3] shadow-sm hover:shadow-xl transition-all overflow-hidden flex flex-col"
                          >
                            <div className="aspect-square relative bg-gray-50 p-4">
                              <Image src={product.images[0].url} alt={product.nameDe} fill className="object-contain p-6 mix-blend-multiply group-hover:scale-110 transition-transform duration-500" sizes="(max-width: 640px) 100vw, 256px" />
                            </div>
                            <div className="p-4 flex flex-col flex-1 border-t border-gray-50">
                              <h3 className="font-bold text-gray-900 text-sm mb-2 line-clamp-2 group-hover:text-[#4ECCA3] transition-colors">{product.nameDe}</h3>
                              <div className="mt-auto pt-2 flex items-baseline gap-2">
                                <span className="font-black text-[#0C211E] tabular-nums whitespace-nowrap">{formatPriceDe(product.price)}</span>
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
                data-testid="cart-drawer"
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
                  <button onClick={() => setCartDrawerOpen(false)} aria-label="Warenkorb schließen" className="p-2 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-900 transition-all">
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
                          <motion.div data-testid="cart-item" layout initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.2 }} key={item.product.id} className="flex gap-4 bg-white">
                            <Link href={`/produkt/${item.product.slug}`} onClick={() => setCartDrawerOpen(false)} className="w-24 h-24 bg-gray-50 rounded-2xl relative flex-shrink-0 border border-gray-50 hover:border-[#4ECCA3] transition-colors group p-2">
                              <Image src={item.product.images[0]} alt={item.product.name.de} fill className="object-contain p-2 mix-blend-multiply group-hover:scale-110 transition-transform" />
                            </Link>
                            <div className="flex-1 flex flex-col justify-between py-1">
                              <div className="flex justify-between gap-2">
                                <div>
                                  <h4 className="font-bold text-[#0C211E] text-sm line-clamp-2 leading-snug"><Link href={`/produkt/${item.product.slug}`} onClick={() => setCartDrawerOpen(false)} className="hover:text-[#4ECCA3] transition-colors">{item.product.name.de}</Link></h4>
                                  <p data-testid="cart-item-price" className="text-[#0C211E] font-black text-sm mt-1 tabular-nums whitespace-nowrap">{formatPriceDe(item.product.price)}</p>
                                </div>
                                <button onClick={() => removeItem(item.product.id)} aria-label={`${item.product.name.de} entfernen`} className="text-gray-400 hover:text-red-500 transition-colors p-1 self-start">
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                              <div className="flex items-center gap-3">
                                <div className="flex items-center bg-gray-50 rounded-xl p-1 border border-gray-100">
                                  <button onClick={() => updateQuantity(item.product.id, Math.max(1, item.quantity - 1))} aria-label="Menge verringern" className="w-7 h-7 flex items-center justify-center text-gray-500 hover:bg-white rounded-lg shadow-sm transition-colors">
                                    <Minus className="w-3 h-3" />
                                  </button>
                                  <input
                                    data-testid="cart-quantity-input"
                                    type="text"
                                    readOnly
                                    value={item.quantity}
                                    aria-label={`Anzahl: ${item.quantity}`}
                                    className="w-8 text-center bg-transparent text-sm font-bold text-gray-900 outline-none"
                                  />
                                  <button onClick={() => updateQuantity(item.product.id, item.quantity + 1)} disabled={item.quantity >= item.product.stock} aria-label="Menge erhöhen" className="w-7 h-7 flex items-center justify-center text-gray-500 hover:bg-white rounded-lg shadow-sm transition-colors disabled:opacity-50">
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
                              <Truck className="w-4 h-4 text-[#4ECCA3]" /> Nur noch {formatPriceDe(500 - totalPrice)} bis zum <span className="text-[#4ECCA3]">Gratisversand</span>!
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
                  <div className="p-4 border-t border-gray-100 bg-gray-50/80 pb-safe shadow-[0_-10px_30px_rgba(0,0,0,0.03)] z-10">
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between text-xs text-gray-400 font-bold uppercase tracking-tight">
                        <span>Netto</span>
                        <span data-testid="cart-subtotal" className="text-gray-900 tabular-nums">{formatPriceDe(totalPrice)}</span>
                      </div>
                      <div className="flex justify-between text-xs text-gray-400 font-bold uppercase tracking-tight">
                        <span>Versand</span>
                        <span className={totalPrice >= 500 ? 'text-green-600' : 'text-gray-900'}>{totalPrice >= 500 ? 'GRATIS' : 'Berechnet'}</span>
                      </div>
                      <div className="flex justify-between items-end pt-3 border-t border-gray-200 mt-2">
                        <span className="font-black text-[#0C211E] text-[10px] uppercase tracking-tighter">Gesamt (Brutto)</span>
                        <span className="text-nova-900 text-xl font-black tabular-nums">{formatPriceDe(totalPrice)}</span>
                      </div>
                    </div>
                    
                    <div className="flex flex-col gap-2">
                      <Link 
                        href="/kasse" 
                        data-testid="checkout-button"
                        onClick={() => setCartDrawerOpen(false)} 
                        className="w-full py-3.5 text-center bg-[#0C211E] text-white font-black rounded-xl hover:bg-black shadow-xl shadow-gray-900/10 transition-all flex items-center justify-center gap-2 text-xs uppercase tracking-widest"
                      >
                        <Lock className="w-3.5 h-3.5" /> Sicher zur Kasse
                      </Link>
                      <Link href="/warenkorb" onClick={() => setCartDrawerOpen(false)} className="w-full py-3 text-center bg-white border border-gray-200 text-[#0C211E] font-black rounded-xl hover:bg-gray-50 transition-colors text-[10px] uppercase tracking-widest">
                        Warenkorb ansehen
                      </Link>
                      
                      <div className="flex justify-center gap-4 mt-4 opacity-60">
                         {/* Trust indicators for payment and delivery */}
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
              data-testid="mobile-menu"
              className="absolute top-0 right-0 bottom-0 w-[90%] max-w-sm bg-white shadow-[auto] flex flex-col rounded-l-3xl overflow-hidden"
            >
              <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gray-50/50 text-black">
                <Image src="/logo0.png" alt="NOVA INDUKT" width={140} height={42} className="h-9 w-auto" />
                <button onClick={() => setMobileMenuOpen(false)} data-testid="mobile-menu-close-button" aria-label="Menü schließen" className="p-2.5 text-gray-400 hover:text-gray-900 bg-white shadow-sm border border-gray-100 rounded-full hover:bg-gray-50 transition-all">
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto bg-white text-black">
                <nav className="p-4 space-y-1">
                  <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-3 ml-2">Menü</p>
                  {navItems.map((item, index) => (
                    <motion.div key={item.href} initial={{ opacity: 0, x: 15 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.05 + 0.1 }}>
                      <Link href={item.href} onClick={() => setMobileMenuOpen(false)}
                        className={`flex items-center justify-between py-3 px-4 rounded-xl text-sm font-black transition-all uppercase tracking-tight ${isActive(item.href) ? 'text-white bg-[#0C211E] shadow-lg shadow-black/10' : 'text-gray-800 hover:bg-gray-50'}`}
                      >
                        {item.label}
                        <ChevronRight className={`w-4 h-4 ${isActive(item.href) ? 'text-nova-400' : 'text-gray-300'}`} />
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
                              {dept.links.map((link) => (
                                <Link key={link.label} href={link.href} onClick={() => setMobileMenuOpen(false)} className="py-2.5 px-3 text-sm text-gray-500 font-semibold hover:bg-[#4ECCA3]/10 hover:text-[#4ECCA3] rounded-lg transition-colors">
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
                <div className="flex items-center justify-between py-4 px-5 bg-[#0C211E] text-white rounded-2xl shadow-xl shadow-black/20">
                  <div>
                    <span className="font-bold text-sm block mb-1">Kundenservice</span>
                    <a 
                      href="https://wa.me/493012345678?text=Hallo%20NOVA%20INDUKT%20Team%2C%20ich%20habe%20eine%20Frage%20zu%20einem%20Produkt." 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-nova-200 hover:underline font-bold text-sm"
                    >
                      Jetzt Kontaktieren
                    </a>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-[#25D366]/20 flex items-center justify-center border border-green-500/30">
                    <a 
                      href="https://wa.me/493012345678?text=Hallo%20NOVA%20INDUKT%20Team%2C%20ich%20habe%20eine%20Frage%20zu%20einem%20Produkt." 
                      target="_blank" 
                      rel="noopener noreferrer"
                      aria-label="Kontakt via WhatsApp"
                      className="flex items-center justify-center w-full h-full"
                    >
                      <svg viewBox="0 0 24 24" className="w-5 h-5 fill-[#25D366]"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
