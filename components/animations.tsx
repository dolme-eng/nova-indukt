'use client'

import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { ReactNode, useRef } from 'react'

interface TiltCardProps {
  children: ReactNode
  className?: string
  tiltAmount?: number
  glowColor?: string
}

export function TiltCard({ 
  children, 
  className = '',
  tiltAmount = 10,
  glowColor = 'rgba(78, 204, 163, 0.3)'
}: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null)

  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const springConfig = { damping: 20, stiffness: 300 }
  const xSpring = useSpring(x, springConfig)
  const ySpring = useSpring(y, springConfig)

  const rotateX = useTransform(ySpring, [-0.5, 0.5], [tiltAmount, -tiltAmount])
  const rotateY = useTransform(xSpring, [-0.5, 0.5], [-tiltAmount, tiltAmount])

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return

    const rect = ref.current.getBoundingClientRect()
    const width = rect.width
    const height = rect.height
    const mouseX = e.clientX - rect.left
    const mouseY = e.clientY - rect.top
    
    const xPct = mouseX / width - 0.5
    const yPct = mouseY / height - 0.5
    
    x.set(xPct)
    y.set(yPct)
  }

  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: 'preserve-3d',
      }}
      whileHover={{ 
        boxShadow: `0 25px 50px -12px ${glowColor}`,
        y: -8,
        scale: 1.02
      }}
      transition={{
        type: 'spring',
        stiffness: 400,
        damping: 20
      }}
      className={`${className}`}
    >
      {children}
    </motion.div>
  )
}

// Floating animation wrapper
interface FloatingProps {
  children: ReactNode
  className?: string
  delay?: number
  duration?: number
  distance?: number
}

export function Floating({
  children,
  className = '',
  delay = 0,
  duration = 3,
  distance = 10
}: FloatingProps) {
  return (
    <motion.div
      className={className}
      animate={{
        y: [0, -distance, 0],
      }}
      transition={{
        duration,
        repeat: Infinity,
        ease: 'easeInOut',
        delay,
      }}
    >
      {children}
    </motion.div>
  )
}

// Pulse animation for badges/notifications
interface PulseProps {
  children: ReactNode
  className?: string
  color?: string
}

export function Pulse({ children, className = '', color = '#4ECCA3' }: PulseProps) {
  return (
    <div className={`relative ${className}`}>
      {children}
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{ backgroundColor: color }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.5, 0, 0.5],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
    </div>
  )
}

// Shimmer loading effect
interface ShimmerProps {
  className?: string
}

export function Shimmer({ className = '' }: ShimmerProps) {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
        animate={{
          x: ['-100%', '100%'],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: 'linear',
        }}
      />
    </div>
  )
}
