'use client'

import { motion, useMotionValue, useSpring, useReducedMotion } from 'framer-motion'
import { useEffect, useState } from 'react'

export function CustomCursor() {
  const prefersReducedMotion = useReducedMotion()
  const [isHovering, setIsHovering] = useState(false)
  const [isClicking, setIsClicking] = useState(false)
  const [cursorText, setCursorText] = useState('')
  const [isVisible, setIsVisible] = useState(false)

  const cursorX = useMotionValue(-100)
  const cursorY = useMotionValue(-100)

  const springConfig = { damping: 25, stiffness: 400 }
  const cursorXSpring = useSpring(cursorX, springConfig)
  const cursorYSpring = useSpring(cursorY, springConfig)

  useEffect(() => {
    if (prefersReducedMotion) {
      setIsVisible(false)
      return
    }

    // Only show custom cursor on desktop with mouse
    const isTouch = window.matchMedia('(pointer: coarse)').matches
    const isMobile = window.innerWidth < 1024
    if (isTouch || isMobile) {
      setIsVisible(false)
      return
    }

    setIsVisible(true)

    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX)
      cursorY.set(e.clientY)
    }

    const handleMouseDown = () => setIsClicking(true)
    const handleMouseUp = () => setIsClicking(false)

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement

      if (target.closest('a, button, [role="button"], .cursor-pointer')) {
        setIsHovering(true)

        // Check for custom cursor text
        const cursorElement = target.closest('[data-cursor]')
        if (cursorElement) {
          setCursorText(cursorElement.getAttribute('data-cursor') || '')
        }
      }
    }

    const handleMouseOut = () => {
      setIsHovering(false)
      setCursorText('')
    }

    window.addEventListener('mousemove', moveCursor)
    window.addEventListener('mousedown', handleMouseDown)
    window.addEventListener('mouseup', handleMouseUp)
    document.addEventListener('mouseover', handleMouseOver)
    document.addEventListener('mouseout', handleMouseOut)

    return () => {
      window.removeEventListener('mousemove', moveCursor)
      window.removeEventListener('mousedown', handleMouseDown)
      window.removeEventListener('mouseup', handleMouseUp)
      document.removeEventListener('mouseover', handleMouseOver)
      document.removeEventListener('mouseout', handleMouseOut)
    }
  }, [cursorX, cursorY, prefersReducedMotion])

  if (!isVisible) return null

  return (
    <>
      {/* Main cursor dot - solid green */}
      <motion.div
        className="pointer-events-none fixed left-0 top-0 z-[9999] h-3 w-3 rounded-full bg-[#4ECCA3]"
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
          translateX: '-50%',
          translateY: '-50%',
        }}
        animate={{
          scale: isClicking ? 0.5 : isHovering ? 0.8 : 1,
        }}
        transition={{ duration: 0.15 }}
      />

      {/* Cursor ring - solid green border */}
      <motion.div
        className="pointer-events-none fixed left-0 top-0 z-[9998] h-10 w-10 rounded-full border-2 border-[#4ECCA3]"
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
          translateX: '-50%',
          translateY: '-50%',
        }}
        animate={{
          scale: isHovering ? 1.8 : 1,
          opacity: isHovering ? 1 : 0.8,
          borderWidth: isHovering ? 3 : 2,
        }}
        transition={{ duration: 0.2 }}
      />

      {/* Cursor text label */}
      {cursorText && (
        <motion.div
          className="pointer-events-none fixed left-0 top-0 z-[9997] rounded-full bg-[#4ECCA3] px-3 py-1 text-xs font-medium text-white"
          style={{
            x: cursorXSpring,
            y: cursorYSpring,
            translateX: '-50%',
            translateY: '-150%',
          }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
        >
          {cursorText}
        </motion.div>
      )}
    </>
  )
}
