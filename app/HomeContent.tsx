'use client'

import { useState, useEffect, useRef, useMemo } from 'react'
import Image from 'next/image'
import { Link } from '@/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ArrowRight, Truck, RotateCcw, Shield, Headphones, 
  Zap, Leaf, Award, ChevronRight, Star,
  ShoppingCart, Heart, Eye, Flame, Clock, ChevronLeft,
  Sparkles, CheckCircle, BadgePercent
} from 'lucide-react'
import { useCart } from '@/lib/store/cart'
import { useWishlist } from '@/lib/store/wishlist'
import { products, categories, blogPosts } from '@/lib/data/products'
import { TiltCard } from '@/components/animations'
import { MagneticButton } from '@/components/magnetic-button'
import { TestimonialsSection } from '@/components/testimonials-section'
import { useDeTranslations } from '@/lib/i18n/useDeTranslations'
import { formatPriceDe } from '@/lib/utils/vat'

// Flash deals - deterministic discount based on product id
const flashDeals = products.slice(0, 4).map(p => ({...p, discount: ((p.id.charCodeAt(0) + p.id.charCodeAt(p.id.length - 1)) % 25) + 15}))

export function HomeContent() {
  const t = useDeTranslations()
  const [currentSlide, setCurrentSlide] = useState(0)
  const [email, setEmail] = useState('')
  const [newsletterStatus, setNewsletterStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [timeLeft, setTimeLeft] = useState({ hours: 5, minutes: 42, seconds: 18 })
  const slides = ['slide1', 'slide2', 'slide3'] as const
  const sliderContainerRef = useRef<HTMLDivElement>(null)
  
  const productCardVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }
    }
  }

  const sliderProducts = useMemo(() => {
    const list: typeof products = [];
    const catGroups = new Map<string, number>();
    for (const p of products) {
      if (!catGroups.has(p.category)) catGroups.set(p.category, 0);
      const count = catGroups.get(p.category)!;
      if (count < 2) {
        list.push(p);
        catGroups.set(p.category, count + 1);
      }
      if (list.length >= 16) break;
    }
    return list;
  }, []);

  useEffect(() => {
    const autoScroll = setInterval(() => {
      if (sliderContainerRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = sliderContainerRef.current;
        if (scrollLeft + clientWidth >= scrollWidth - 10) {
          sliderContainerRef.current.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          sliderContainerRef.current.scrollBy({ left: window.innerWidth > 640 ? 344 : 276, behavior: 'smooth' });
        }
      }
    }, 4500);
    return () => clearInterval(autoScroll);
  }, []);

  // Flash deals countdown
  useEffect(() => {
    const countdown = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 }
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 }
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 }
        return { hours: 23, minutes: 59, seconds: 59 } // Loop back
      })
    }, 1000)
    return () => clearInterval(countdown)
  }, [])

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 6000)
    return () => clearInterval(timer)
  }, [slides.length])

  const getLocalizedName = (item: { name: { de: string } }) => {
    return item.name.de
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.22, 1, 0.36, 1] as [number, number, number, number]
      }
    }
  }

  const heroContentVariants = {
    hidden: { opacity: 0, y: 30, filter: 'blur(10px)' },
    visible: { 
      opacity: 1, 
      y: 0, 
      filter: 'blur(0px)',
      transition: { 
        duration: 1, 
        ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
        staggerChildren: 0.15,
        delayChildren: 0.2
      }
    },
    exit: { 
      opacity: 0, 
      y: -20, 
      filter: 'blur(10px)',
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }
    }
  }

  const heroItemVariants = {
    hidden: { opacity: 0, y: 20, filter: 'blur(5px)' },
    visible: { 
      opacity: 1, 
      y: 0, 
      filter: 'blur(0px)',
      transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }
    }
  }

  const heroImages = [
    '/images/hero/Die-Zukunft-der-Induktion.webp',
    '/images/hero/Professionelle-Topfsets.webp',
    '/images/hero/Smarte-Küchentechnologie.webp'
  ]

  return (
    <div className="min-h-screen bg-gray-50/50 selection:bg-[#4ECCA3]/30">
      {/* Announcement Bar */}
      <motion.div 
        initial={{ y: -40 }}
        animate={{ y: 0 }}
        className="bg-nova-900 border-b border-nova-800 text-nova-100 py-2.5 text-center text-xs sm:text-sm font-medium tracking-wide relative overflow-hidden flex justify-center items-center"
      >
        <div className="absolute inset-0 bg-[url(&quot;data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E&quot;)] opacity-[0.15] mix-blend-overlay"></div>
        <span className="inline-flex items-center gap-3 relative z-10">
          <Sparkles className="w-4 h-4 text-nova-400" />
          <span>{t('trust.shipping')} <span className="text-nova-600 px-2">•</span> {t('trust.returns')} <span className="text-nova-600 px-2">•</span> {t('trust.warranty')}</span>
          <Sparkles className="w-4 h-4 text-nova-400" />
        </span>
      </motion.div>

      {/* Hero Carousel */}
      <section className="relative h-[70vh] sm:h-[75vh] md:h-[80vh] min-h-[550px] md:min-h-[650px] overflow-hidden group">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, scale: 1.1, filter: 'blur(10px)' }}
            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, scale: 0.95, filter: 'blur(10px)' }}
            transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
            className="absolute inset-0"
          >
            <Image
              src={heroImages[currentSlide]}
              alt={t(`hero.${slides[currentSlide]}.title`)}
              fill
              className="object-cover object-center"
              priority
              fetchPriority="high"
              sizes="100vw"
            />
            {/* Elegant gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/30 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/70" />
          </motion.div>
        </AnimatePresence>

        <div className="relative z-10 container mx-auto px-4 sm:px-6 h-full flex flex-col justify-center">
          <div className="max-w-2xl mt-12 sm:mt-0">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide}
                variants={heroContentVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <motion.div
                  variants={heroItemVariants}
                  className="inline-flex items-center gap-2 mb-6 px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-full text-xs sm:text-sm font-semibold tracking-wider uppercase shadow-2xl"
                >
                  <span className="w-2 h-2 rounded-full bg-nova-400 animate-pulse" />
                  {t(`hero.${slides[currentSlide]}.tag`)}
                </motion.div>
                
                <motion.h1 
                  variants={heroItemVariants}
                  className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 font-heading leading-[1.1] tracking-tight drop-shadow-sm"
                >
                  {t(`hero.${slides[currentSlide]}.title`)}
                </motion.h1>
                
                <motion.p 
                  variants={heroItemVariants}
                  className="text-lg sm:text-xl text-gray-200 mb-8 max-w-xl font-light leading-relaxed drop-shadow-sm"
                >
                  {t(`hero.${slides[currentSlide]}.subtitle`)}
                </motion.p>
                
                <motion.div 
                  variants={heroItemVariants}
                  className="flex flex-col sm:flex-row gap-4 items-center sm:items-start"
                >
                  <Link href="/produkte" className="w-full sm:w-auto">
                    <MagneticButton strength={0.2} className="w-full sm:w-auto">
                      <button
                        className="w-full sm:w-auto px-8 py-4 bg-nova-400 hover:bg-nova-500 text-white font-semibold rounded-2xl flex items-center justify-center gap-3 transition-all shadow-[0_8px_30px_rgb(78,204,163,0.3)] hover:shadow-[0_8px_30px_rgb(78,204,163,0.5)] group/btn"
                      >
                        {t(`hero.${slides[currentSlide]}.cta`)}
                        <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
                      </button>
                    </MagneticButton>
                  </Link>
                  
                  <Link href="/produkte" className="w-full sm:w-auto">
                    <MagneticButton strength={0.15} className="w-full sm:w-auto">
                      <button
                        className="w-full sm:w-auto px-8 py-4 bg-white/10 backdrop-blur-md hover:bg-white/20 border border-white/20 text-white font-semibold rounded-2xl flex items-center justify-center gap-3 transition-all"
                      >
                        <Eye className="w-5 h-5 opacity-70" />
                        {t('hero.catalog')}
                      </button>
                    </MagneticButton>
                  </Link>
                </motion.div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Simplified Slide Navigation */}
        <div className="absolute bottom-10 inset-x-0 z-20 flex justify-center items-center gap-2.5">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`relative overflow-hidden h-1 rounded-full transition-all duration-500 ease-out cursor-pointer ${
                index === currentSlide ? 'w-8 bg-white/20' : 'w-2 bg-white/50 hover:bg-white/80'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            >
              {index === currentSlide && (
                <motion.div 
                  initial={{ x: '-100%' }}
                  animate={{ x: '0%' }}
                  transition={{ duration: 6, ease: 'linear' }}
                  className="absolute inset-0 bg-[#4ECCA3] rounded-full"
                />
              )}
            </button>
          ))}
        </div>
      </section>

      {/* Trust Bar - Elevated overlapping to Hero */}
      <section className="relative z-20 -mt-10 sm:-mt-14 max-w-[1400px] mx-auto px-4 sm:px-6">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={containerVariants}
          className="bg-white/80 backdrop-blur-xl border border-white shadow-xl rounded-2xl p-6 sm:p-8"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 divide-x divide-gray-100/0 md:divide-gray-200">
            {[
              { icon: Truck, titleKey: 'trust.freeShipping', descKey: 'trust.freeShippingDesc' },
              { icon: RotateCcw, titleKey: 'trust.returns', descKey: 'trust.returnsDesc' },
              { icon: Shield, titleKey: 'trust.warranty', descKey: 'trust.warrantyDesc' },
              { icon: Headphones, titleKey: 'trust.support', descKey: 'trust.supportDesc' },
            ].map((item, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-4 md:pl-8 first:pl-0"
              >
                <div className="w-12 h-12 rounded-2xl bg-nova-50 flex items-center justify-center flex-shrink-0 text-nova-500 shadow-sm border border-nova-100">
                  <item.icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-sm">{t(item.titleKey)}</h3>
                  <p className="text-gray-500 text-xs mt-1 leading-relaxed">{t(item.descKey)}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Recommended space */}
      <div className="h-6 sm:h-12"></div>

      {/* Highlights Lateral Slider (Semi-Auto) */}
      <section className="py-4 pb-12 sm:py-8 bg-transparent overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 mb-8">
          <div className="flex items-end justify-between">
            <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <span className="text-nova-500 font-semibold tracking-wider text-sm uppercase mb-2 block">Vorschau</span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 font-heading">
                Top-Produkte pro Kategorie
              </h2>
            </motion.div>
            <div className="hidden sm:flex items-center gap-2">
              <button onClick={() => sliderContainerRef.current?.scrollBy({ left: -344, behavior: 'smooth' })} className="w-12 h-12 rounded-[1rem] bg-white border border-gray-100 flex items-center justify-center hover:bg-gray-50 hover:scale-105 active:scale-95 transition-all shadow-sm cursor-pointer z-10">
                <ChevronLeft className="w-5 h-5 text-gray-600" />
              </button>
              <button onClick={() => sliderContainerRef.current?.scrollBy({ left: 344, behavior: 'smooth' })} className="w-12 h-12 rounded-[1rem] bg-white border border-gray-100 flex items-center justify-center hover:bg-gray-50 hover:scale-105 active:scale-95 transition-all shadow-sm cursor-pointer z-10">
                <ChevronRight className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>
        </div>

        {/* Swipeable & Auto-scroll track */}
        <div className="relative">
          <motion.div 
            ref={sliderContainerRef}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={{
              visible: {
                transition: {
                  staggerChildren: 0.05
                }
              }
            }}
            className="flex flex-nowrap overflow-x-auto snap-x snap-mandatory gap-3 sm:gap-4 px-4 sm:px-6 pb-4 pt-2 scrollbar-hide items-stretch"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {sliderProducts.map((product, index) => (
              <motion.div 
                key={`highlights-${product.id}`} 
                variants={productCardVariants}
                className="w-[260px] sm:w-[320px] flex-shrink-0 snap-center sm:snap-start h-auto group/product"
              >
                <ProductCard product={product} index={index} t={t} />
              </motion.div>
            ))}
            {/* Safe zone at end */}
            <div className="w-2 sm:w-6 flex-shrink-0" />
          </motion.div>
        </div>
      </section>

      {/* Categories Modern Grid */}
      <section className="py-8 sm:py-14 bg-gray-50/50">
        <div className="container mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col sm:flex-row items-end justify-between mb-6 gap-3"
          >
            <div>
              <span className="text-nova-500 font-semibold tracking-wider text-sm uppercase mb-2 block">{t('categories.tag')}</span>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 font-heading">{t('categories.popular')}</h2>
            </div>
            <Link href="/produkte" className="group text-gray-600 hover:text-nova-500 font-medium flex items-center gap-2 transition-colors pb-1 border-b-2 border-transparent hover:border-nova-500">
              {t('categories.viewAll')} 
              <span className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center group-hover:bg-nova-50 transition-colors">
                <ArrowRight className="w-4 h-4 ml-0.5" />
              </span>
            </Link>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
            {categories.map((category, index) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group h-full"
              >
                <Link href={`/produkte?kategorie=${category.id}`} className="block h-full cursor-pointer">
                  <div className="relative aspect-[4/5] rounded-3xl overflow-hidden shadow-md group-hover:shadow-2xl transition-all duration-500 border border-gray-100">
                    <Image
                      src={category.image}
                      alt={getLocalizedName(category)}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent transition-opacity duration-500" />
                      <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                      <h3 className="text-2xl font-bold text-white mb-3 tracking-tight">{getLocalizedName(category)}</h3>
                      
                      <div className="flex items-center text-white/90 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-150">
                        Entdecken <ChevronRight className="w-4 h-4 ml-1" />
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Flash Deals with Gradient Background */}
      <section className="py-10 sm:py-16 relative overflow-hidden">
        {/* Background elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#FFF5F0] via-white to-[#F0FFF9]" />
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-red-100/40 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-nova-100/40 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/4" />
        
        <div className="container relative z-10 mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="flex flex-col md:flex-row items-center justify-between bg-white/60 backdrop-blur-xl border border-white/80 p-4 sm:p-6 rounded-3xl shadow-lg mb-8 gap-4"
          >
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-orange-500 rounded-2xl flex items-center justify-center shadow-red-500/20 shadow-xl">
                <Flame className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 font-heading flex items-center gap-2">
                  {t('deals.title')} <span className="px-2 py-1 bg-red-100 text-red-600 text-xs font-bold rounded-lg uppercase tracking-wider">Nur Heute</span>
                </h2>
                <p className="text-gray-500 text-sm mt-1">{t('deals.subtitle')}</p>
              </div>
            </div>
            
            {/* Functional Countdown */}
            <div className="flex gap-3 text-center shrink-0">
              {[ 
                { l: 'Stunden', v: timeLeft.hours.toString().padStart(2, '0') }, 
                { l: 'Minuten', v: timeLeft.minutes.toString().padStart(2, '0') }, 
                { l: 'Sekunden', v: timeLeft.seconds.toString().padStart(2, '0') } 
              ].map((time, i) => (
                <div key={i} className="flex flex-col w-[60px]">
                  <span className="w-14 h-14 mx-auto bg-white shadow-sm border border-gray-100 rounded-xl flex items-center justify-center text-xl font-bold text-gray-900 font-mono">
                    {time.v}
                  </span>
                  <span className="text-[9px] sm:text-[10px] uppercase text-gray-500 font-semibold mt-2">{time.l}</span>
                </div>
              ))}
            </div>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {flashDeals.map((product, index) => (
              <FlashDealCard 
                key={product.id} 
                product={product} 
                index={index} 
                t={t} 
              />
            ))}
          </div>
        </div>
      </section>

      {/* Bestsellers Premium View */}
      <section className="py-10 sm:py-16 bg-white relative">
        <div className="container mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-2xl mx-auto mb-16"
          >
            <div className="inline-flex items-center justify-center p-2 bg-nova-50 rounded-2xl mb-4">
              <Award className="w-6 h-6 text-nova-500" />
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 font-heading mb-4 tracking-tight">
              {t('bestsellers.title')}
            </h2>
            <p className="text-gray-500 text-lg leading-relaxed">
              {t('bestsellers.subtitle')}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {products.slice(0, 8).map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} t={t} />
            ))}
          </div>

          <div className="mt-16 text-center">
            <Link href="/produkte">
              <MagneticButton>
                <div className="px-8 py-4 bg-gray-900 text-white font-semibold rounded-2xl hover:bg-gray-800 transition-colors shadow-xl shadow-gray-900/20 inline-flex items-center gap-2 cursor-pointer">
                  Alle Bestseller ansehen <ArrowRight className="w-5 h-5" />
                </div>
              </MagneticButton>
            </Link>
          </div>
        </div>
      </section>

      {/* Technology Features */}
      <section className="py-12 sm:py-20 bg-gray-900 border-t border-gray-800 relative overflow-hidden">
        {/* Abstract shapes */}
        <div className="absolute inset-0 bg-[url(&quot;data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E&quot;)] opacity-[0.04] mix-blend-overlay"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-nova-500/10 rounded-full blur-[150px] pointer-events-none" />
        
        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16 sm:mb-20 max-w-3xl mx-auto"
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 text-nova-400 text-sm font-semibold rounded-full mb-6 tracking-wide">
              <Sparkles className="w-4 h-4" />
              {t('tech.tag')}
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6 font-heading leading-tight">
              {t('tech.title')}
            </h2>
            <p className="text-gray-400 text-lg">
              {t('tech.subtitle')}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto">
            <TechFeatureCard
              icon={Zap}
              title={t('tech.smartHeat')}
              description={t('tech.smartHeatDesc')}
              color="bg-amber-500 text-amber-500 border-amber-500/20"
              index={0}
            />
            <TechFeatureCard
              icon={Leaf}
              title={t('tech.ecoPower')}
              description={t('tech.ecoPowerDesc')}
              color="bg-nova-500 text-nova-500 border-nova-500/20"
              index={1}
            />
            <TechFeatureCard
              icon={Shield}
              title={t('tech.safety')}
              description={t('tech.safetyDesc')}
              color="bg-blue-500 text-blue-500 border-blue-500/20"
              index={2}
            />
          </div>
        </div>
      </section>

      {/* Blog Preview Section */}
      <section className="py-12 sm:py-18 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col sm:flex-row items-end justify-between mb-12 gap-4"
          >
            <div>
              <span className="text-nova-600 font-semibold tracking-wider text-sm uppercase mb-2 block">Journal</span>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 font-heading tracking-tight">{t('blog.title')}</h2>
            </div>
            <Link href="/blog" className="px-6 py-3 bg-white border border-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all flex items-center gap-2 shadow-sm">
              {t('blog.viewAll')} <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.map((post, index) => (
              <motion.article
                key={post.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col h-full"
              >
                <Link href={`/blog/${post.slug}`} className="block flex-1">
                  <div className="relative aspect-[16/10] overflow-hidden bg-gray-100">
                    <Image
                      src={post.image}
                      alt={post.title.de}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-700 ease-in-out"
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1.5 bg-white/90 backdrop-blur-sm text-gray-900 text-xs font-bold rounded-lg shadow-sm">
                        {post.category}
                      </span>
                    </div>
                  </div>
                  <div className="p-6 sm:p-8 flex-1 flex flex-col">
                    <div className="flex items-center gap-3 text-xs font-semibold text-gray-500 mb-4 uppercase tracking-wider">
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" />
                        {post.readTime}
                      </span>
                      <span className="w-1 h-1 rounded-full bg-gray-300" />
                      <span>{post.date}</span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3 leading-snug group-hover:text-nova-500 transition-colors">
                      {post.title.de}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed mb-6 flex-1 line-clamp-3">
                      {post.excerpt.de}
                    </p>
                    <div className="text-nova-600 font-bold text-sm flex items-center gap-2 group-hover:gap-3 transition-all mt-auto border-t border-gray-100 pt-5">
                      {t('blog.readMore')} <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </Link>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <TestimonialsSection />

      {/* Modern Newsletter */}
      <section className="py-12 sm:py-20 bg-white relative overflow-hidden">
        {/* Decorative background vectors */}
        <div className="absolute right-0 top-0 w-1/3 aspect-square bg-nova-50 rounded-bl-[100px] -z-10" />
        <div className="absolute left-0 bottom-0 w-1/4 aspect-square bg-gray-50 rounded-tr-[100px] -z-10" />
        
        <div className="container mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.98, y: 20 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gray-900 rounded-[2.5rem] p-8 sm:p-14 lg:p-20 shadow-2xl relative overflow-hidden text-center max-w-5xl mx-auto border border-gray-800"
          >
            {/* Inner background glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-nova-500/20 blur-[120px] rounded-full pointer-events-none" />
            
            <div className="relative z-10 max-w-2xl mx-auto">
              <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center mx-auto mb-8 border border-white/20 shadow-xl">
                <Sparkles className="w-8 h-8 text-nova-400" />
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6 font-heading leading-tight">
                {t('newsletter.title')}
              </h2>
              <p className="text-gray-300 mb-10 text-lg sm:text-xl font-light">
                Erhalten Sie 10% Rabatt auf Ihre erste Bestellung plus exklusive Angebote und Rezepte.
              </p>
              
              {newsletterStatus === 'success' ? (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-nova-500/20 border border-nova-500/30 text-nova-300 font-medium py-4 px-6 rounded-2xl inline-flex items-center gap-3 text-lg"
                >
                  <CheckCircle className="w-6 h-6" />
                  {t('newsletter.success') || 'Vielen Dank für Ihre Anmeldung!'}
                </motion.div>
              ) : (
                <form 
                  onSubmit={(e) => {
                    e.preventDefault()
                    if (email && email.includes('@')) {
                      setNewsletterStatus('success')
                      setEmail('')
                      setTimeout(() => setNewsletterStatus('idle'), 5000)
                    }
                  }}
                  className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto"
                >
                  <div className="relative flex-1">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder={t('newsletter.placeholder')}
                      required
                      className="w-full px-6 py-4 sm:py-5 bg-white/5 border border-white/20 rounded-2xl text-white placeholder:text-gray-400 focus:outline-none focus:border-nova-400 focus:bg-white/10 transition-all font-medium backdrop-blur-sm"
                    />
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    className="px-8 py-4 sm:py-5 bg-nova-400 text-white font-bold rounded-2xl hover:bg-nova-500 transition-colors whitespace-nowrap shadow-lg shadow-nova-500/20 text-lg flex items-center justify-center gap-2"
                  >
                    Anmelden <ArrowRight className="w-5 h-5" />
                  </motion.button>
                </form>
              )}
              <p className="text-xs text-gray-500 mt-6">
                Durch die Anmeldung akzeptieren Sie unsere Datenschutzbestimmungen. Abmeldung jederzeit möglich.
              </p>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

// Polished Product Card
function ProductCard({ product, index, t }: { product: typeof products[0]; index: number; t: any }) {
  const { addItem } = useCart()
  const { isInWishlist, toggleItem } = useWishlist()
  
  const inWishlist = isInWishlist(product.id)
  
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    addItem(product, 1)
  }
  
  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    toggleItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0],
      slug: product.slug
    })
  }
  
  return (
    <Link href={`/produkt/${product.slug}`} className="block group h-full">
      <TiltCard 
        className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col h-full"
        tiltAmount={5}
        glowColor="rgba(78, 204, 163, 0.15)"
      >
        <div className="relative aspect-[4/3] sm:aspect-square overflow-hidden bg-gray-50 p-2 sm:p-3">
          <div className="absolute inset-0 bg-white" />
          <Image
            src={product.images[0]}
            alt={product.name.de}
            fill
            className={`object-contain p-3 sm:p-4 transition-all duration-700 mix-blend-multiply ${product.images[1] ? 'group-hover:opacity-0 group-hover:scale-95' : 'group-hover:scale-110'}`}
          />
          {product.images[1] && (
            <Image
              src={product.images[1]}
              alt={`${product.name.de} Lifestyle`}
              fill
              className="object-cover absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-700 z-0"
            />
          )}
          
          {/* Badges */}
          <div className="absolute top-2 left-2 sm:top-3 sm:left-3 flex flex-col gap-1.5 z-10">
            {product.badges?.includes('premium') && (
              <span className="px-3 py-1 bg-nova-500 text-white text-xs font-bold rounded-lg shadow-sm border border-nova-400">
                {t('badges.premium')}
              </span>
            )}
            {product.badges?.includes('bestseller') && (
              <span className="px-3 py-1 bg-gray-900 text-white text-xs font-bold rounded-lg shadow-sm">
                {t('badges.bestseller')}
              </span>
            )}
            {product.badges?.includes('new') && (
              <span className="px-3 py-1 bg-amber-400 text-amber-950 text-xs font-bold rounded-lg shadow-sm">
                {t('badges.new')}
              </span>
            )}
          </div>

          {/* Quick Actions overlay */}
          <div className="absolute top-4 right-4 flex flex-col gap-3 z-10 translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300">
            <MagneticButton 
              onClick={handleToggleWishlist}
              className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-lg transition-colors border ${
                inWishlist ? 'bg-red-50 border-red-100' : 'bg-white border-gray-100 hover:bg-gray-50'
              }`}
            >
              <Heart className={`w-5 h-5 transition-colors ${inWishlist ? 'fill-red-500 text-red-500' : 'text-gray-400 hover:text-red-500'}`} />
            </MagneticButton>
          </div>
        </div>

        <div className="p-2.5 sm:p-3 flex-1 flex flex-col">
          <div className="flex items-center gap-1.5 mb-1">
            <div className="flex text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-3.5 h-3.5 ${i < Math.floor(product.rating) ? 'fill-amber-400' : 'fill-gray-200 text-gray-200'}`}
                />
              ))}
            </div>
            <span className="text-xs font-semibold text-gray-400">({product.reviewCount})</span>
          </div>
          
          <h3 className="font-bold text-gray-900 text-[13px] sm:text-sm mb-1 line-clamp-2 group-hover:text-nova-500 transition-colors leading-snug flex-1">
            {product.name.de}
          </h3>
          
          <div className="mt-auto pt-1.5 sm:pt-2 relative border-t border-gray-50">
            <div className="flex items-end gap-1.5 sm:gap-2 mb-0.5">
              <span className="text-sm sm:text-base font-black text-emerald-600 tabular-nums whitespace-nowrap">{formatPriceDe(product.price)}</span>
              {product.oldPrice && (
                <span className="text-[11px] sm:text-xs font-semibold text-gray-400 line-through decoration-gray-300 pb-[2px] tabular-nums whitespace-nowrap">{formatPriceDe(product.oldPrice)}</span>
              )}
            </div>
            <p className="text-[9px] sm:text-[10px] text-gray-400 block mb-1.5 sm:mb-2 font-medium leading-[1.1]">inkl. MwSt.<br className="sm:hidden" /> zzgl. <span className="underline decoration-dotted cursor-help">Versand</span></p>
            
            <button
              onClick={handleAddToCart}
              className="w-full py-1.5 sm:py-2 bg-gray-50 border border-gray-200 text-gray-800 text-[13px] sm:text-sm font-bold rounded-lg sm:rounded-xl group-hover:bg-[#0C211E] group-hover:text-white group-hover:border-[#0C211E] transition-all duration-300 flex items-center justify-center gap-2 shadow-sm"
            >
              <ShoppingCart className="w-4 h-4 sm:w-[18px] sm:h-[18px]" />
              <span className="hidden sm:inline">In den Warenkorb</span>
            </button>
          </div>
        </div>
      </TiltCard>
    </Link>
  )
}

// Elevated Tech Feature Card
function TechFeatureCard({ icon: Icon, title, description, color, index }: { 
  icon: typeof Zap; 
  title: string; 
  description: string; 
  color: string;
  index: number;
}) {
  return (
    <Link href="/technologie" className="block h-full group">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: index * 0.15 }}
        className="bg-gray-800/50 backdrop-blur-md rounded-[2rem] p-8 border border-gray-700/50 hover:bg-gray-800 transition-colors h-full flex flex-col relative overflow-hidden"
      >
        <div className={`absolute top-0 right-0 w-32 h-32 opacity-10 blur-3xl rounded-full ${color.split(' ')[0]}`} />
        
        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 bg-gray-900 border ${color}`}>
          <Icon className="w-8 h-8 opacity-90" />
        </div>
        
        <h3 className="text-xl font-bold text-white mb-3 tracking-wide">{title}</h3>
        <p className="text-gray-400 text-sm leading-relaxed flex-1">{description}</p>
        
        <div className="mt-8 pt-6 border-t border-gray-700/50 flex items-center text-white/70 font-medium text-sm group-hover:text-white transition-colors">
          Technologie ansehen <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
        </div>
      </motion.div>
    </Link>
  )
}

// Flash Deal Card redefined
function FlashDealCard({ product, index, t }: { product: typeof flashDeals[0]; index: number; t: any }) {
  const { isInWishlist, toggleItem } = useWishlist()
  const { addItem } = useCart()
  const inWishlist = isInWishlist(product.id)
  
  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    toggleItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0],
      slug: product.slug
    })
  }

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    addItem(product, 1)
  }
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className="group bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-2xl transition-all duration-300 flex flex-col"
    >
      <Link href={`/produkt/${product.slug}`} className="block relative aspect-square bg-gray-50 overflow-hidden">
        <div className="absolute inset-0 bg-white" />
        <Image
          src={product.images[0]}
          alt={product.name.de}
          fill
          className="object-contain p-8 group-hover:scale-110 transition-transform duration-700 mix-blend-multiply"
        />
        
        {/* Discount Badge */}
        <div className="absolute top-4 left-4">
          <span className="px-3 py-1.5 bg-gradient-to-r from-red-600 to-red-500 text-white text-xs font-black rounded-lg shadow-lg shadow-red-500/30 flex items-center gap-1">
            <BadgePercent className="w-3.5 h-3.5" />
            -{product.discount}%
          </span>
        </div>

        <div className="absolute top-4 right-4 z-10">
          <button 
            onClick={handleToggleWishlist}
            className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-lg transition-colors border ${
              inWishlist ? 'bg-red-50 border-red-100' : 'bg-white border-gray-100 hover:bg-gray-50'
            }`}
          >
            <Heart className={`w-5 h-5 transition-colors ${inWishlist ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} />
          </button>
        </div>
      </Link>
      
      <div className="p-6 flex-1 flex flex-col border-t border-gray-50">
        <Link href={`/produkt/${product.slug}`} className="block group-hover:text-nova-500 transition-colors">
          <h3 className="font-bold text-gray-900 text-base mb-3 line-clamp-2 leading-snug">{product.name.de}</h3>
        </Link>
        
        <div className="mt-auto">
          <div className="flex items-end gap-1.5 sm:gap-2 mb-1">
            <span className="text-base sm:text-xl font-black text-emerald-600 tabular-nums whitespace-nowrap">{formatPriceDe(product.price)}</span>
            {product.oldPrice && (
              <span className="text-[11px] sm:text-sm font-semibold text-gray-400 line-through decoration-gray-300 pb-[3px] tabular-nums whitespace-nowrap">{formatPriceDe(product.oldPrice)}</span>
            )}
          </div>
          <p className="text-[9px] sm:text-[10px] text-gray-400 block mb-4 leading-[1.1]">inkl. MwSt.<br className="sm:hidden" /> zzgl. Versand</p>
          
          <div className="mb-4">
            <div className="flex justify-between text-xs font-bold mb-1.5">
              <span className="text-red-600">Fast Ausverkauft</span>
              <span className="text-gray-500">Noch {product.stock} Stück</span>
            </div>
            <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                whileInView={{ width: '85%' }}
                transition={{ duration: 1, ease: 'easeOut' }}
                className="bg-gradient-to-r from-red-500 to-orange-400 h-full rounded-full relative"
              >
                <div className="absolute inset-0 bg-white/20 w-full h-full animate-[shimmer_2s_infinite]" style={{ backgroundImage: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent)' }} />
              </motion.div>
            </div>
          </div>
          
          <button
            onClick={handleAddToCart}
            className="w-full py-2.5 sm:py-3 bg-red-50 text-red-600 hover:bg-red-600 hover:text-white border border-red-100 text-[13px] sm:text-sm font-bold rounded-[0.85rem] sm:rounded-xl transition-colors duration-300 flex items-center justify-center gap-2"
          >
            <ShoppingCart className="w-4 h-4 sm:w-[18px] sm:h-[18px]" />
            <span className="hidden sm:inline">In den Warenkorb</span>
          </button>
        </div>
      </div>
    </motion.div>
  )
}
