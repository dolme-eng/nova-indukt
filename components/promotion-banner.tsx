'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Zap, Timer } from 'lucide-react'
import Link from 'next/link'

interface Promotion {
  id: string
  name: string
  badge: string
  bannerText: string
  highlightColor: string
  endDate: string
  discountType: string
  discountValue: number
  isGlobal: boolean
}

export function PromotionBanner() {
  const [promotion, setPromotion] = useState<Promotion | null>(null)
  const [isVisible, setIsVisible] = useState(true)
  const [timeLeft, setTimeLeft] = useState('')

  useEffect(() => {
    // Fetch active promotion
    async function fetchPromotion() {
      try {
        const response = await fetch('/api/promotions?limit=1')
        if (response.ok) {
          const promotions = await response.json()
          if (promotions.length > 0) {
            setPromotion(promotions[0])
          }
        }
      } catch (error) {
        console.error('Failed to fetch promotion:', error)
      }
    }

    fetchPromotion()
    
    // Check for new promotions every 5 minutes
    const interval = setInterval(fetchPromotion, 5 * 60 * 1000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (!promotion) return

    function updateTimer() {
      if (!promotion) return
      const end = new Date(promotion.endDate).getTime()
      const now = new Date().getTime()
      const diff = end - now

      if (diff <= 0) {
        setPromotion(null)
        return
      }

      const hours = Math.floor(diff / (1000 * 60 * 60))
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))

      if (hours > 24) {
        const days = Math.floor(hours / 24)
        setTimeLeft(`Noch ${days} Tage`)
      } else if (hours > 0) {
        setTimeLeft(`Noch ${hours}h ${minutes}m`)
      } else {
        setTimeLeft(`Noch ${minutes}m`)
      }
    }

    updateTimer()
    const timer = setInterval(updateTimer, 60000) // Update every minute
    return () => clearInterval(timer)
  }, [promotion])

  if (!promotion || !isVisible) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -100, opacity: 0 }}
        className="relative z-50"
        style={{ backgroundColor: promotion.highlightColor }}
      >
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-center gap-4">
            <Link 
              href="/produkte" 
              className="flex items-center gap-3 text-white hover:opacity-90 transition-opacity"
            >
              <Zap className="w-5 h-5" />
              <span className="font-bold text-sm sm:text-base">
                {promotion.name}
              </span>
              <span className="hidden sm:inline text-white/90">
                {promotion.bannerText}
              </span>
              <span className="bg-white text-gray-900 px-2 py-0.5 rounded text-sm font-bold">
                {promotion.badge}
              </span>
              <span className="flex items-center gap-1 text-white/90 text-sm">
                <Timer className="w-4 h-4" />
                {timeLeft}
              </span>
            </Link>
            
            <button
              onClick={() => setIsVisible(false)}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-white/70 hover:text-white transition-colors"
              aria-label="Schließen"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
