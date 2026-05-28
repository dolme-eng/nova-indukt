'use client'

import { useState, useEffect, memo } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, Eye, ShieldCheck, Zap, Sparkles } from 'lucide-react'
import { MagneticButton } from '@/components/magnetic-button'

const heroSlides = [
  {
    image: '/images/hero/Die-Zukunft-der-Induktion.webp',
    tag: 'Innovation 2026',
    title: 'Präzision in jeder Facette',
    subtitle: 'Entdecken Sie die neue Generation des Induktionskochens. Deutsche Ingenieurskunst trifft auf zeitloses Design.',
    primaryBtn: 'Kollektion ansehen',
    secondaryBtn: 'Technologie',
    color: 'from-nova-500/20'
  },
  {
    image: '/images/hero/Professionelle-Topfsets.webp',
    tag: 'Premium Serie',
    title: 'Meisterstücke für Ihre Küche',
    subtitle: 'Vom Profi-Set bis zum Einzelstück – Kochgeschirr, das Maßstäbe in Wärmeleitfähigkeit und Langlebigkeit setzt.',
    primaryBtn: 'Topfsets entdecken',
    secondaryBtn: 'Pfannen',
    color: 'from-amber-500/10'
  },
  {
    image: '/images/hero/Smarte-Küchentechnologie.webp',
    tag: 'Smarte Küche',
    title: 'Intelligenz, die man schmeckt',
    subtitle: 'Gleichmäßige Hitzeverteilung und reaktionsschnelle Temperaturkontrolle für perfekte Ergebnisse, jedes Mal.',
    primaryBtn: 'Smart Kochen',
    secondaryBtn: 'Zubehör',
    color: 'from-blue-500/10'
  }
]

const blurPlaceholder =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1920 1080'%3E%3Crect fill='%230C211E' width='1920' height='1080'/%3E%3C/svg%3E"

export const HomeHero = memo(function HomeHero() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const duration = 6000
    const interval = 100
    const step = (interval / duration) * 100

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          setCurrentSlide((s) => (s + 1) % heroSlides.length)
          return 0
        }
        return prev + step
      })
    }, interval)

    return () => clearInterval(timer)
  }, [])

  return (
    <section className="relative h-[65vh] sm:h-[75vh] lg:h-[85vh] min-h-[500px] overflow-hidden bg-[#050A09] selection:bg-nova-400/30">
      {/* Background Slides */}
      <AnimatePresence mode="sync">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0 z-0"
        >
          <Image
            src={heroSlides[currentSlide].image}
            alt={heroSlides[currentSlide].title}
            fill
            className="object-cover object-center scale-[1.05] animate-ken-burns"
            priority
            sizes="100vw"
            placeholder="blur"
            blurDataURL={blurPlaceholder}
          />
          {/* Advanced Overlays */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/40 to-transparent z-10" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/80 z-10" />
          <div className={`absolute inset-0 bg-gradient-to-tr ${heroSlides[currentSlide].color} to-transparent mix-blend-overlay z-10`} />
        </motion.div>
      </AnimatePresence>

      {/* Floating Decorative Elements */}
      <div className="absolute top-20 right-[10%] z-20 hidden lg:block">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 1 }}
          className="p-6 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl space-y-4 max-w-[240px]"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-nova-400/20 flex items-center justify-center border border-nova-400/30">
              <ShieldCheck className="w-5 h-5 text-nova-400" />
            </div>
            <div>
              <p className="text-white font-bold text-sm tracking-tight">German Quality</p>
              <p className="text-nova-300/60 text-[10px] uppercase font-black tracking-widest">Zertifiziert</p>
            </div>
          </div>
          <div className="h-px bg-white/10 w-full" />
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-400/20 flex items-center justify-center border border-blue-400/30">
              <Zap className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <p className="text-white font-bold text-sm tracking-tight">Eco Energy</p>
              <p className="text-blue-300/60 text-[10px] uppercase font-black tracking-widest">-30% Power</p>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="relative z-30 container mx-auto px-6 h-full flex flex-col justify-center">
        <div className="max-w-3xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            >
              {/* Tag */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 bg-nova-400/10 backdrop-blur-md border border-nova-400/30 text-nova-400 rounded-full text-[10px] sm:text-xs font-black tracking-[0.2em] uppercase"
              >
                <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                {heroSlides[currentSlide].tag}
              </motion.div>

              {/* Title */}
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-4xl sm:text-6xl lg:text-7xl font-black text-white mb-6 font-heading leading-[1.05] tracking-tighter"
              >
                {heroSlides[currentSlide].title.split(' ').map((word, i) => (
                  <span key={i} className="inline-block mr-[0.2em]">
                    {word === 'Präzision' || word === 'Intelligenz' ? (
                      <span className="text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-nova-400/50">
                        {word}
                      </span>
                    ) : word}
                  </span>
                ))}
              </motion.h1>

              {/* Subtitle */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-sm sm:text-lg text-gray-300/90 mb-10 max-w-xl font-medium leading-relaxed"
              >
                {heroSlides[currentSlide].subtitle}
              </motion.p>

              {/* Actions */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="flex flex-wrap gap-4 items-center"
              >
                <Link href="/produkte">
                  <MagneticButton>
                    <div className="px-8 py-4 bg-[#0C211E] hover:bg-[#17423C] text-white text-xs sm:text-sm font-black rounded-xl flex items-center justify-center gap-2.5 transition-all shadow-xl shadow-[#0C211E]/20 group/btn">
                      {heroSlides[currentSlide].primaryBtn}
                      <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                    </div>
                  </MagneticButton>
                </Link>

                <Link href="/technologie">
                  <div className="px-8 py-4 bg-white/5 backdrop-blur-xl hover:bg-white/10 border border-white/10 text-white text-xs sm:text-sm font-black rounded-xl flex items-center justify-center gap-2.5 transition-all group/btn2">
                    <Eye className="w-4 h-4 opacity-50 group-hover/btn2:opacity-100 transition-opacity" />
                    {heroSlides[currentSlide].secondaryBtn}
                  </div>
                </Link>
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Progress Line Navigation */}
      <div className="absolute bottom-10 left-6 right-6 lg:left-12 lg:right-auto lg:w-[400px] z-40">
        <div className="grid grid-cols-3 gap-4">
          {heroSlides.map((slide, i) => (
            <button
              key={i}
              onClick={() => {
                setCurrentSlide(i)
                setProgress(0)
              }}
              className="group relative pt-4 text-left"
            >
              <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-nova-400"
                  initial={{ width: 0 }}
                  animate={{ 
                    width: i === currentSlide ? `${progress}%` : i < currentSlide ? '100%' : '0%' 
                  }}
                  transition={{ duration: 0.1 }}
                />
              </div>
              <div className="mt-2 flex flex-col">
                <span className={`text-[10px] font-black tracking-widest uppercase transition-colors ${i === currentSlide ? 'text-nova-400' : 'text-white/40'}`}>
                  0{i + 1}
                </span>
                <span className={`text-[10px] font-bold truncate transition-colors hidden sm:block ${i === currentSlide ? 'text-white' : 'text-white/20'}`}>
                  {slide.tag}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Side Aesthetics */}
      <div className="absolute top-0 right-0 h-full w-px bg-gradient-to-b from-transparent via-white/10 to-transparent hidden lg:block" />
      <div className="absolute top-1/4 -right-20 w-40 h-40 bg-nova-400/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 -left-20 w-40 h-40 bg-blue-400/10 rounded-full blur-[100px] pointer-events-none" />

      <style jsx global>{`
        @keyframes ken-burns {
          0% { transform: scale(1.05); }
          100% { transform: scale(1.15); }
        }
        .animate-ken-burns {
          animation: ken-burns 20s linear infinite alternate;
        }
      `}</style>
    </section>
  )
})
