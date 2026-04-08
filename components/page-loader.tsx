'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export function PageLoader() {
  const [isLoading, setIsLoading] = useState(true)
  const [showExtendedLoader, setShowExtendedLoader] = useState(false)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    // Détecter si le chargement prend plus de 5s
    const extendedTimer = setTimeout(() => {
      setShowExtendedLoader(true)
    }, 5000)

    // Simulation de progression
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 90) return prev
        return prev + Math.random() * 15
      })
    }, 300)

    // Cacher le loader quand la page est prête
    const handleLoad = () => {
      setProgress(100)
      setTimeout(() => {
        setIsLoading(false)
        clearTimeout(extendedTimer)
        clearInterval(progressInterval)
      }, 300)
    }

    if (document.readyState === 'complete') {
      handleLoad()
    } else {
      window.addEventListener('load', handleLoad)
    }

    return () => {
      window.removeEventListener('load', handleLoad)
      clearTimeout(extendedTimer)
      clearInterval(progressInterval)
    }
  }, [])

  if (!isLoading) return null

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[9999] bg-[#0C211E] flex flex-col items-center justify-center"
        >
          {/* Logo animé */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="mb-8"
          >
            <div className="relative">
              {/* Cercle pulsant */}
              <motion.div
                animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.1, 0.3] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="absolute inset-0 bg-[#4ECCA3] rounded-full blur-xl"
              />
              
              {/* Logo texte */}
              <div className="relative px-8 py-4">
                <span className="text-4xl sm:text-5xl font-bold text-white tracking-tight">
                  NOVA<span className="text-[#4ECCA3]">.</span>
                </span>
              </div>
            </div>
          </motion.div>

          {/* Barre de progression */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="w-64 sm:w-80"
          >
            <div className="h-1 bg-white/10 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-[#4ECCA3] to-[#3DBB94] rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(progress, 100)}%` }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              />
            </div>
            
            {/* Pourcentage */}
            <div className="mt-3 text-center">
              <span className="text-white/60 text-sm font-medium">
                {Math.round(progress)}%
              </span>
            </div>
          </motion.div>

          {/* Message étendu après 5s */}
          <AnimatePresence>
            {showExtendedLoader && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.5 }}
                className="mt-8 text-center"
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="w-10 h-10 border-2 border-white/20 border-t-[#4ECCA3] rounded-full mx-auto mb-4"
                />
                <p className="text-white/80 text-sm sm:text-base">
                  Fast fertig...
                </p>
                <p className="text-white/50 text-xs mt-2">
                  Die Produkte werden vorbereitet
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Tips rotatifs */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.5 }}
            className="absolute bottom-8 left-0 right-0 text-center"
          >
            <p className="text-white/40 text-xs sm:text-sm">
              Premium Küchenausstattung für Profis
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
