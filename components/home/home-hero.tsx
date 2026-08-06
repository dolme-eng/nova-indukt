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
    subtitle:
      'Entdecken Sie die neue Generation des Induktionskochens. Deutsche Ingenieurskunst trifft auf zeitloses Design.',
    primaryBtn: 'Kollektion ansehen',
    secondaryBtn: 'Technologie',
    color: 'from-nova-500/20',
  },
  {
    image: '/images/hero/Professionelle-Topfsets.webp',
    tag: 'Premium Serie',
    title: 'Meisterstücke für Ihre Küche',
    subtitle:
      'Vom Profi-Set bis zum Einzelstück – Kochgeschirr, das Maßstäbe in Wärmeleitfähigkeit und Langlebigkeit setzt.',
    primaryBtn: 'Topfsets entdecken',
    secondaryBtn: 'Pfannen',
    color: 'from-amber-500/10',
  },
  {
    image: '/images/hero/Smarte-Küchentechnologie.webp',
    tag: 'Smarte Küche',
    title: 'Intelligenz, die man schmeckt',
    subtitle:
      'Gleichmäßige Hitzeverteilung und reaktionsschnelle Temperaturkontrolle für perfekte Ergebnisse, jedes Mal.',
    primaryBtn: 'Smart Kochen',
    secondaryBtn: 'Zubehör',
    color: 'from-blue-500/10',
  },
]

const blurPlaceholder =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1920 1080'%3E%3Crect fill='%230C211E' width='1920' height='1080'/%3E%3C/svg%3E"

export const HomeHero = memo(function HomeHero() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [progress, setProgress] = useState(0)
  const [isPaused, setIsPaused] = useState(false)

  useEffect(() => {
    if (isPaused) return
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
  }, [isPaused])

  return (
    <section aria-label="Willkommen bei NOVA INDUKT" className="relative h-[65vh] min-h-[500px] overflow-hidden bg-[#050A09] selection:bg-nova-400/30 sm:h-[75vh] lg:h-[85vh]">
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
            className="animate-ken-burns scale-[1.05] object-cover object-center"
            priority
            sizes="100vw"
            placeholder="blur"
            blurDataURL={blurPlaceholder}
          />
          {/* Advanced Overlays */}
          <div className="absolute inset-0 z-10 bg-gradient-to-r from-black/90 via-black/40 to-transparent" />
          <div className="absolute inset-0 z-10 bg-gradient-to-b from-black/30 via-transparent to-black/80" />
          <div
            className={`absolute inset-0 bg-gradient-to-tr ${heroSlides[currentSlide].color} z-10 to-transparent mix-blend-overlay`}
          />
        </motion.div>
      </AnimatePresence>

      {/* Floating Decorative Elements */}
      <div className="absolute right-[10%] top-20 z-20 hidden lg:block">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 1 }}
          className="max-w-[240px] space-y-4 rounded-2xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur-xl"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full border border-nova-400/30 bg-nova-400/20">
              <ShieldCheck className="h-5 w-5 text-nova-400" />
            </div>
            <div>
              <p className="text-sm font-bold tracking-tight text-white">Deutsche Qualität</p>
              <p className="text-[10px] font-black uppercase tracking-widest text-nova-300/60">
                Zertifiziert
              </p>
            </div>
          </div>
          <div className="h-px w-full bg-white/10" />
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full border border-blue-400/30 bg-blue-400/20">
              <Zap className="h-5 w-5 text-blue-400" />
            </div>
            <div>
              <p className="text-sm font-bold tracking-tight text-white">Umweltfreundlich</p>
              <p className="text-[10px] font-black uppercase tracking-widest text-blue-300/60">
                -30% Power
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="container relative z-30 mx-auto flex h-full flex-col justify-center px-6">
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
                className="mb-6 inline-flex items-center gap-2 rounded-full border border-nova-400/30 bg-nova-400/10 px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-nova-400 backdrop-blur-md sm:text-xs"
              >
                <Sparkles className="h-3.5 w-3.5 animate-pulse" />
                {heroSlides[currentSlide].tag}
              </motion.div>

              {/* Title */}
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mb-6 font-heading text-4xl font-black leading-[1.05] tracking-tighter text-white sm:text-6xl lg:text-7xl"
              >
                {heroSlides[currentSlide].title.split(' ').map((word, i) => (
                  <span key={i} className="mr-[0.2em] inline-block">
                    {word === 'Präzision' || word === 'Intelligenz' ? (
                      <span className="bg-gradient-to-b from-white via-white to-nova-400/50 bg-clip-text text-transparent">
                        {word}
                      </span>
                    ) : (
                      word
                    )}
                  </span>
                ))}
              </motion.h1>

              {/* Subtitle */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="mb-10 max-w-xl text-sm font-medium leading-relaxed text-gray-300/90 sm:text-lg"
              >
                {heroSlides[currentSlide].subtitle}
              </motion.p>

              {/* Actions */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="flex flex-wrap items-center gap-4"
              >
                <Link href="/produkte">
                  <MagneticButton>
                    <div className="group/btn flex items-center justify-center gap-2.5 rounded-xl bg-[#4ECCA3] px-8 py-4 text-xs font-black text-[#0C211E] shadow-xl shadow-[#4ECCA3]/30 transition-all hover:bg-[#3BA88A] sm:text-sm">
                      {heroSlides[currentSlide].primaryBtn}
                      <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                    </div>
                  </MagneticButton>
                </Link>

                <Link href="/technologie">
                  <div className="group/btn2 flex items-center justify-center gap-2.5 rounded-xl border border-white/10 bg-white/5 px-8 py-4 text-xs font-black text-white backdrop-blur-xl transition-all hover:bg-white/10 sm:text-sm">
                    <Eye className="h-4 w-4 opacity-50 transition-opacity group-hover/btn2:opacity-100" />
                    {heroSlides[currentSlide].secondaryBtn}
                  </div>
                </Link>
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Progress Line Navigation */}
      <div className="absolute bottom-10 left-6 right-6 z-40 lg:left-12 lg:right-auto lg:w-[400px]">
        <div className="grid grid-cols-3 gap-4">
          {heroSlides.map((slide, i) => (
            <button
              key={i}
              onClick={() => {
                setCurrentSlide(i)
                setProgress(0)
              }}
              aria-label={`Folie ${i + 1}: ${slide.tag}`}
              aria-current={i === currentSlide ? 'true' : undefined}
              className="group relative pt-4 text-left"
            >
              <div className="h-1 w-full overflow-hidden rounded-full bg-white/10">
                <motion.div
                  className="h-full bg-nova-400"
                  initial={{ width: 0 }}
                  animate={{
                    width: i === currentSlide ? `${progress}%` : i < currentSlide ? '100%' : '0%',
                  }}
                  transition={{ duration: 0.1 }}
                />
              </div>
              <div className="mt-2 flex flex-col">
                <span
                  className={`text-[10px] font-black uppercase tracking-widest transition-colors ${i === currentSlide ? 'text-nova-400' : 'text-white/40'}`}
                >
                  0{i + 1}
                </span>
                <span
                  className={`hidden truncate text-[10px] font-bold transition-colors sm:block ${i === currentSlide ? 'text-white' : 'text-white/20'}`}
                >
                  {slide.tag}
                </span>
              </div>
            </button>
          ))}
        </div>
        <button
          onClick={() => setIsPaused((p) => !p)}
          aria-label={isPaused ? 'Animation fortsetzen' : 'Animation pausieren'}
          className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white/60 backdrop-blur-sm transition-colors hover:bg-white/20 hover:text-white lg:hidden"
        >
          {isPaused ? (
            <>
              <svg className="h-3 w-3" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5v14l11-7z" />
              </svg>
              Weiter
            </>
          ) : (
            <>
              <svg className="h-3 w-3" viewBox="0 0 24 24" fill="currentColor">
                <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
              </svg>
              Pause
            </>
          )}
        </button>
      </div>

      {/* Side Aesthetics */}
      <div className="absolute right-0 top-0 hidden h-full w-px bg-gradient-to-b from-transparent via-white/10 to-transparent lg:block" />
      <div className="pointer-events-none absolute -right-20 top-1/4 h-40 w-40 rounded-full bg-nova-400/10 blur-[100px]" />
      <div className="pointer-events-none absolute -left-20 bottom-1/4 h-40 w-40 rounded-full bg-blue-400/10 blur-[100px]" />

      <style jsx global>{`
        @keyframes ken-burns {
          0% {
            transform: scale(1.05);
          }
          100% {
            transform: scale(1.15);
          }
        }
        .animate-ken-burns {
          animation: ken-burns 20s linear infinite alternate;
        }
      `}</style>
    </section>
  )
})
