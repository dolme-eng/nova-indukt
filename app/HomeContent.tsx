'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Link } from '@/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ArrowRight, Truck, RotateCcw, Shield, Headphones, 
  Zap, Leaf, Award, ChevronRight, Star,
  ShoppingCart, Heart, Eye, Flame, Clock, ChevronLeft,
  Sparkles, CheckCircle
} from 'lucide-react'
import { useCart } from '@/lib/store/cart'
import { useWishlist } from '@/lib/store/wishlist'
import { products, categories, blogPosts } from '@/lib/data/products'
import { TiltCard } from '@/components/animations'
import { MagneticButton } from '@/components/magnetic-button'
import { TestimonialsSection } from '@/components/testimonials-section'
import { useDeTranslations } from '@/lib/i18n/useDeTranslations'

// Flash deals - deterministic discount based on product id to avoid hydration mismatch
const flashDeals = products.slice(0, 4).map(p => ({...p, discount: ((p.id.charCodeAt(0) + p.id.charCodeAt(p.id.length - 1)) % 25) + 15}))

export function HomeContent() {
  const t = useDeTranslations()
  const [currentSlide, setCurrentSlide] = useState(0)
  const [email, setEmail] = useState('')
  const [newsletterStatus, setNewsletterStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const slides = ['slide1', 'slide2', 'slide3'] as const

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [slides.length])

  const getLocalizedName = (item: { name: { de: string } }) => {
    return item.name.de
  }

  const heroImages = [
    'https://images.unsplash.com/photo-1556911220-bff31c812dba?w=1920&q=80',
    'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1920&q=80',
    'https://images.unsplash.com/photo-1556911220-bff31c812dba?w=1920&q=80'
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Announcement Bar */}
      <motion.div 
        initial={{ y: -40 }}
        animate={{ y: 0 }}
        className="bg-[#4ECCA3] text-white py-2 text-center text-sm font-medium"
      >
        <span className="inline-flex items-center gap-2">
          <Sparkles className="w-4 h-4" />
          {t('trust.shipping')} • {t('trust.returns')} • {t('trust.warranty')}
          <Sparkles className="w-4 h-4" />
        </span>
      </motion.div>

      {/* Hero Carousel */}
      <section className="relative h-[60vh] sm:h-[65vh] md:h-[70vh] lg:h-[75vh] min-h-[500px] sm:min-h-[550px] md:min-h-[600px] overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0"
          >
            <Image
              src={heroImages[currentSlide]}
              alt={t(`hero.${slides[currentSlide]}.title`)}
              fill
              className="object-cover"
              priority
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/30" />
          </motion.div>
        </AnimatePresence>

        <div className="relative z-10 container mx-auto px-4 h-full flex items-center justify-center md:justify-start">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="w-full max-w-2xl text-center md:text-left"
            >
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="inline-block px-3 py-1.5 sm:px-4 sm:py-2 bg-[#4ECCA3] text-white text-xs sm:text-sm font-bold rounded-full mb-4 sm:mb-6"
              >
                {t(`hero.${slides[currentSlide]}.tag`)}
              </motion.span>
              
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 sm:mb-6 font-heading leading-tight">
                {t(`hero.${slides[currentSlide]}.title`)}
              </h1>
              
              <p className="text-base sm:text-lg md:text-xl text-white/90 mb-6 sm:mb-8 max-w-lg mx-auto md:mx-0">
                {t(`hero.${slides[currentSlide]}.subtitle`)}
              </p>
              
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center md:justify-start">
                <Link href="/produkte" className="w-full sm:w-auto">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-[#4ECCA3] text-white font-semibold rounded-xl flex items-center justify-center gap-2 text-sm sm:text-base"
                  >
                    {t(`hero.${slides[currentSlide]}.cta`)}
                    <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                  </motion.button>
                </Link>
                
                <Link href="/produkte" className="w-full sm:w-auto">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-white text-gray-900 font-semibold rounded-xl flex items-center justify-center gap-2 text-sm sm:text-base"
                  >
                    <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
                    {t('hero.catalog')}
                  </motion.button>
                </Link>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Slide Navigation */}
        <div className="absolute bottom-4 sm:bottom-6 md:bottom-8 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 sm:gap-4">
          <button
            onClick={() => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)}
            className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/30 transition-colors"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
          
          <div className="flex items-center gap-1.5 sm:gap-2">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`h-1.5 sm:h-2 rounded-full transition-all ${
                  index === currentSlide ? 'w-6 sm:w-10 bg-[#4ECCA3]' : 'w-1.5 sm:w-2 bg-white/50'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
          
          <button
            onClick={() => setCurrentSlide((prev) => (prev + 1) % slides.length)}
            className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/30 transition-colors"
            aria-label="Next slide"
          >
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>
      </section>

      {/* Trust Bar */}
      <section className="py-6 sm:py-8 bg-white border-b border-gray-200">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {[
              { icon: Truck, titleKey: 'trust.freeShipping', descKey: 'trust.freeShippingDesc' },
              { icon: RotateCcw, titleKey: 'trust.returns', descKey: 'trust.returnsDesc' },
              { icon: Shield, titleKey: 'trust.warranty', descKey: 'trust.warrantyDesc' },
              { icon: Headphones, titleKey: 'trust.support', descKey: 'trust.supportDesc' },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center gap-3 sm:gap-4 justify-center sm:justify-start"
              >
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-[#4ECCA3]/10 flex items-center justify-center flex-shrink-0">
                  <item.icon className="w-5 h-5 sm:w-6 sm:h-6 text-[#4ECCA3]" />
                </div>
                <div className="text-center sm:text-left">
                  <h3 className="font-semibold text-gray-900 text-xs sm:text-sm">{t(item.titleKey)}</h3>
                  <p className="text-gray-500 text-xs">{t(item.descKey)}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-12 sm:py-16 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 sm:mb-8 gap-3"
          >
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 font-heading">{t('categories.popular')}</h2>
            <Link href="/produkte" className="text-[#4ECCA3] font-medium flex items-center gap-1 hover:underline text-sm sm:text-base">
              {t('categories.viewAll')} <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {categories.map((category, index) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -4 }}
              >
                <Link href={`/produkte?kategorie=${category.id}`} className="group block">
                  <div className="relative aspect-[16/10] sm:aspect-[4/3] rounded-2xl overflow-hidden shadow-md">
                    <Image
                      src={category.image}
                      alt={getLocalizedName(category)}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                    <div className="absolute bottom-3 left-3 right-3">
                      <h3 className="text-base sm:text-lg font-bold text-white">{getLocalizedName(category)}</h3>
                      <p className="text-white/80 text-xs sm:text-sm">{category.count} {t('products.title')}</p>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Flash Deals */}
      <section className="py-12 sm:py-16 bg-gradient-to-b from-orange-50 to-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 mb-6 sm:mb-8"
          >
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center flex-shrink-0">
              <Flame className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 font-heading">{t('deals.title')}</h2>
              <p className="text-gray-500 text-sm sm:text-base">{t('deals.subtitle')}</p>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
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

      {/* Bestsellers */}
      <section className="py-12 sm:py-16 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 sm:mb-8 gap-3"
          >
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 font-heading">{t('bestsellers.title')}</h2>
              <p className="text-gray-500 text-sm sm:text-base">{t('bestsellers.subtitle')}</p>
            </div>
            <Link href="/produkte" className="text-[#4ECCA3] font-medium flex items-center gap-1 hover:underline text-sm sm:text-base">
              {t('categories.viewAll')} <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {products.slice(0, 8).map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} t={t} />
            ))}
          </div>
        </div>
      </section>

      {/* Technology Features */}
      <section className="py-12 sm:py-16 bg-gray-100">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-8 sm:mb-12"
          >
            <span className="inline-block px-3 py-1.5 sm:px-4 sm:py-2 bg-[#4ECCA3]/10 text-[#4ECCA3] text-xs sm:text-sm font-semibold rounded-full mb-3 sm:mb-4">
              {t('tech.tag')}
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 sm:mb-4 font-heading">
              {t('tech.title')}
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-sm sm:text-base px-4">
              {t('tech.subtitle')}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            <TechFeatureCard
              icon={Zap}
              title={t('tech.smartHeat')}
              description={t('tech.smartHeatDesc')}
              color="bg-gradient-to-br from-amber-500 to-orange-500"
              index={0}
            />
            <TechFeatureCard
              icon={Leaf}
              title={t('tech.ecoPower')}
              description={t('tech.ecoPowerDesc')}
              color="bg-gradient-to-br from-[#4ECCA3] to-emerald-500"
              index={1}
            />
            <TechFeatureCard
              icon={Shield}
              title={t('tech.safety')}
              description={t('tech.safetyDesc')}
              color="bg-gradient-to-br from-blue-500 to-cyan-500"
              index={2}
            />
          </div>
        </div>
      </section>

      {/* Blog Preview */}
      <section className="py-12 sm:py-16 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 sm:mb-8 gap-3"
          >
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 font-heading">{t('blog.title')}</h2>
              <p className="text-gray-500 text-sm sm:text-base">{t('blog.subtitle')}</p>
            </div>
            <Link href="/blog" className="text-[#4ECCA3] font-medium flex items-center gap-1 hover:underline text-sm sm:text-base">
              {t('blog.viewAll')} <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {blogPosts.map((post, index) => (
              <motion.article
                key={post.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -4 }}
                className="group bg-gray-50 rounded-2xl overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="relative aspect-video overflow-hidden">
                  <Image
                    src={post.image}
                    alt={post.title.de}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                  <div className="absolute top-3 left-3 sm:top-4 sm:left-4">
                    <span className="px-2 py-1 sm:px-3 bg-[#4ECCA3] text-white text-xs font-bold rounded-full">
                      {post.category}
                    </span>
                  </div>
                </div>
                <div className="p-4 sm:p-6">
                  <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-500 mb-2 sm:mb-3">
                    <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    {post.readTime} · {post.date}
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-[#4ECCA3] transition-colors">
                    {post.title.de}
                  </h3>
                  <p className="text-gray-600 text-sm line-clamp-2 mb-3 sm:mb-4">
                    {post.excerpt.de}
                  </p>
                  <Link href={`/blog/${post.slug}`} className="text-[#4ECCA3] font-medium text-sm flex items-center gap-1 hover:gap-2 transition-all">
                    {t('blog.readMore')} <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <TestimonialsSection />

      {/* Newsletter */}
      <section className="py-12 sm:py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-12 shadow-sm"
          >
            <div className="max-w-2xl mx-auto text-center">
              <span className="inline-block px-3 py-1.5 sm:px-4 sm:py-2 bg-[#4ECCA3]/10 text-[#4ECCA3] text-xs sm:text-sm font-semibold rounded-full mb-3 sm:mb-4">
                {t('newsletter.tag')}
              </span>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-3 sm:mb-4 font-heading">
                {t('newsletter.title')}
              </h2>
              <p className="text-gray-600 mb-4 sm:mb-6 text-sm sm:text-base px-2 sm:px-0">
                {t('newsletter.subtitle')}
              </p>
              {newsletterStatus === 'success' ? (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center justify-center gap-2 text-[#4ECCA3] font-medium py-2 sm:py-3 text-sm sm:text-base"
                >
                  <CheckCircle className="w-5 h-5" />
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
                  className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
                >
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t('newsletter.placeholder')}
                    required
                    className="flex-1 px-4 sm:px-5 py-2.5 sm:py-3 bg-gray-100 border border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#4ECCA3] transition-colors text-sm sm:text-base"
                  />
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    className="px-5 sm:px-6 py-2.5 sm:py-3 bg-[#4ECCA3] text-white font-semibold rounded-xl hover:bg-[#3BA88A] transition-colors text-sm sm:text-base whitespace-nowrap"
                  >
                    {t('newsletter.submit')}
                  </motion.button>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

// Product Card
function ProductCard({ product, index, t }: { product: typeof products[0]; index: number; t: any }) {
  const { addItem } = useCart()
  const [isInWishlist, setIsInWishlist] = useState(false)
  
  useEffect(() => {
    const saved = localStorage.getItem('nova-wishlist')
    if (saved) {
      const wishlist = JSON.parse(saved)
      setIsInWishlist(wishlist.some((item: any) => item.productId === product.id))
    }
  }, [product.id])
  
  const handleAddToCart = () => {
    addItem(product, 1)
  }
  
  const toggleWishlist = () => {
    const saved = localStorage.getItem('nova-wishlist')
    let wishlist = saved ? JSON.parse(saved) : []
    
    if (isInWishlist) {
      wishlist = wishlist.filter((item: any) => item.productId !== product.id)
    } else {
      wishlist.push({
        productId: product.id,
        addedAt: new Date().toISOString(),
        notifyOnRestock: false
      })
    }
    
    localStorage.setItem('nova-wishlist', JSON.stringify(wishlist))
    window.dispatchEvent(new StorageEvent('storage', { key: 'nova-wishlist' }))
    setIsInWishlist(!isInWishlist)
  }
  
  return (
    <TiltCard 
      className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow border border-gray-100"
      tiltAmount={8}
      glowColor="rgba(78, 204, 163, 0.15)"
    >
      <div className="relative aspect-square overflow-hidden bg-gray-100">
        <Image
          src={product.images[0]}
          alt={product.name.de}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {product.badges?.includes('premium') && (
            <span className="px-2 py-1 bg-[#4ECCA3] text-white text-xs font-bold rounded-full">
              {t('badges.premium')}
            </span>
          )}
          {product.badges?.includes('bestseller') && (
            <span className="px-2 py-1 bg-gray-900 text-white text-xs font-bold rounded-full">
              {t('badges.bestseller')}
            </span>
          )}
          {product.badges?.includes('new') && (
            <span className="px-2 py-1 bg-amber-400 text-gray-900 text-xs font-bold rounded-full">
              {t('badges.new')}
            </span>
          )}
        </div>

        {/* Quick Actions */}
        <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all">
          <MagneticButton 
            strength={0.4}
            onClick={toggleWishlist}
            className={`w-9 h-9 rounded-full flex items-center justify-center shadow-lg transition-colors ${
              isInWishlist ? 'bg-red-500 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Heart className={`w-4 h-4 ${isInWishlist ? 'fill-white' : ''}`} />
          </MagneticButton>
          <Link 
            href={`/produkt/${product.slug}`}
            className="w-9 h-9 bg-white rounded-full flex items-center justify-center shadow-lg hover:bg-gray-50 transition-colors cursor-pointer"
          >
            <Eye className="w-4 h-4 text-gray-600" />
          </Link>
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-center gap-1 mb-2">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`w-3.5 h-3.5 ${i < Math.floor(product.rating) ? 'text-amber-400 fill-amber-400' : 'text-gray-300'}`}
            />
          ))}
          <span className="text-xs text-gray-500 ml-1">({product.reviewCount})</span>
        </div>
        
        <h3 className="font-medium text-gray-900 text-sm mb-2 line-clamp-2 group-hover:text-[#4ECCA3] transition-colors">
          {product.name.de}
        </h3>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-[#4ECCA3]">{product.price} €</span>
            {product.oldPrice && (
              <span className="text-sm text-red-500 line-through decoration-black">{product.oldPrice} €</span>
            )}
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleAddToCart}
            className="flex items-center gap-2 px-3 py-2 bg-[#4ECCA3] text-white text-sm font-medium rounded-xl hover:bg-[#3BA88A] transition-colors"
          >
            <ShoppingCart className="w-4 h-4" />
            <span className="hidden sm:inline">{t('cart.addToCart')}</span>
          </motion.button>
        </div>
      </div>
    </TiltCard>
  )
}

// Tech Feature Card
function TechFeatureCard({ icon: Icon, title, description, color, index }: { 
  icon: typeof Zap; 
  title: string; 
  description: string; 
  color: string;
  index: number;
}) {
  return (
    <Link href="/uber-uns">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: index * 0.2 }}
        whileHover={{ y: -4 }}
        className="group bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer h-full"
      >
        <div className={`w-14 h-14 rounded-xl ${color} flex items-center justify-center mb-4`}>
          <Icon className="w-7 h-7 text-white" />
        </div>
        
        <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600 text-sm">{description}</p>
        
        <div className="mt-4 flex items-center gap-1 text-[#4ECCA3] font-medium text-sm">
          Mehr erfahren <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </div>
      </motion.div>
    </Link>
  )
}

// Flash Deal Card with wishlist functionality
function FlashDealCard({ product, index, t }: { product: typeof flashDeals[0]; index: number; t: any }) {
  const { isInWishlist, toggleItem } = useWishlist()
  const inWishlist = isInWishlist(product.id)
  
  const toggleWishlist = (e: React.MouseEvent) => {
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
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -4 }}
      className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow"
    >
      <div className="relative aspect-square">
        <Image
          src={product.images[0]}
          alt={product.name.de}
          fill
          className="object-cover"
        />
        <div className="absolute top-3 left-3">
          <span className="px-3 py-1 bg-red-500 text-white text-xs font-bold rounded-full">
            -{product.discount}%
          </span>
        </div>
        <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button 
            onClick={toggleWishlist}
            className={`w-9 h-9 rounded-full flex items-center justify-center shadow-lg transition-colors ${
              inWishlist ? 'bg-red-500 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Heart className={`w-4 h-4 ${inWishlist ? 'fill-white' : ''}`} />
          </button>
        </div>
      </div>
        <div className="p-4">
          <h3 className="font-medium text-gray-900 text-sm mb-2 line-clamp-2">{product.name.de}</h3>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-lg font-bold text-red-500">{product.price} €</span>
            {product.oldPrice && (
              <span className="text-sm text-gray-400 line-through decoration-black">{product.oldPrice} €</span>
            )}
          </div>
        <div className="w-full bg-gray-200 h-1.5 rounded-full overflow-hidden">
          <div className="bg-gradient-to-r from-orange-500 to-red-500 h-full rounded-full" style={{width: '75%'}} />
        </div>
        <p className="text-xs text-gray-500 mt-1">{t('deals.stock', { count: product.stock })}</p>
      </div>
    </motion.div>
  )
}
