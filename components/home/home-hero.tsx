'use client'

import { useState, useEffect, memo } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, Eye } from 'lucide-react'
import { MagneticButton } from '@/components/magnetic-button'

const heroImages = [
  '/images/hero/Die-Zukunft-der-Induktion.webp',
  '/images/hero/Professionelle-Topfsets.webp',
  '/images/hero/Smarte-Küchentechnologie.webp',
]

const blurPlaceholder =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1920 1080'%3E%3Crect fill='%230C211E' width='1920' height='1080'/%3E%3C/svg%3E"

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
      delayChildren: 0.2,
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    filter: 'blur(10px)',
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  },
}

const heroItemVariants = {
  hidden: { opacity: 0, y: 20, filter: 'blur(5px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  },
}

export const HomeHero = memo(function HomeHero() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const slides = ['slide1', 'slide2', 'slide3'] as const

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 6000)
    return () => clearInterval(timer)
  }, [slides.length])

  return (
    <section className="relative h-[45vh] sm:h-[55vh] md:h-[65vh] min-h-[350px] overflow-hidden group bg-gray-900">
      {/* Fond de secours */}
      <div className="absolute inset-0 bg-gradient-to-br from-nova-900 via-gray-900 to-black" />

      <AnimatePresence mode="sync">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
          className="absolute inset-0"
        >
          <Image
            src={heroImages[currentSlide]}
            alt="Die Zukunft der Induktion"
            fill
            className="object-cover object-center"
            priority={currentSlide === 0}
            fetchPriority={currentSlide === 0 ? 'high' : 'auto'}
            loading={currentSlide === 0 ? 'eager' : 'lazy'}
            sizes="100vw"
            placeholder="blur"
            blurDataURL={blurPlaceholder}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/30 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/70" />
        </motion.div>
      </AnimatePresence>

      <div className="relative z-10 container mx-auto px-4 h-full flex flex-col justify-center">
        <div className="max-w-xl mt-4 sm:mt-0">
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
                className="inline-flex items-center gap-1.5 mb-3 px-3 py-1 bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-full text-[10px] font-bold tracking-widest uppercase shadow-2xl"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-nova-400 animate-pulse" />
                Neuheiten 2026
              </motion.div>

              <motion.h1
                variants={heroItemVariants}
                className="text-lg sm:text-xl font-black text-white mb-2 font-heading leading-tight tracking-tight uppercase"
              >
                Die Zukunft der Induktion
              </motion.h1>

              <motion.p
                variants={heroItemVariants}
                className="text-xs sm:text-sm text-gray-200 mb-4 max-w-xs font-medium leading-relaxed"
              >
                Premium-Küchenzubehör für maximale Performance
              </motion.p>

              <motion.div
                variants={heroItemVariants}
                className="flex gap-2 items-center"
              >
                <Link href="/produkte">
                  <div className="px-4 py-2 bg-nova-400 hover:bg-nova-500 text-white text-[10px] sm:text-xs font-black rounded-lg flex items-center justify-center gap-1.5 transition-all shadow-lg hover:scale-105 active:scale-95 group/btn">
                    Jetzt entdecken
                    <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
                  </div>
                </Link>

                <Link href="/produkte">
                  <div className="px-4 py-2 bg-white/10 backdrop-blur-md hover:bg-white/20 border border-white/20 text-white text-[10px] sm:text-xs font-black rounded-lg flex items-center justify-center gap-1.5 transition-all hover:scale-105 active:scale-95">
                    <Eye className="w-3.5 h-3.5 opacity-70" />
                    Katalog
                  </div>
                </Link>
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Slide dots */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-20">
        {heroImages.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentSlide(i)}
            aria-label={`Slide ${i + 1}`}
            className={`h-1.5 rounded-full transition-all duration-500 ${
              i === currentSlide ? 'w-8 bg-nova-400' : 'w-1.5 bg-white/40'
            }`}
          />
        ))}
      </div>
    </section>
  )
})
