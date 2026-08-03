'use client'

import { useEffect, useRef } from 'react'

interface UseFocusTrapOptions<T extends HTMLElement = HTMLElement> {
  isOpen: boolean
  onClose?: () => void
  initialFocusRef?: React.RefObject<T>
  restoreFocus?: boolean
}

export function useFocusTrap<T extends HTMLElement = HTMLElement>({
  isOpen,
  onClose,
  initialFocusRef,
  restoreFocus = true,
}: UseFocusTrapOptions<T>) {
  const containerRef = useRef<T>(null)
  const previousFocusRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (!isOpen) return

    previousFocusRef.current = document.activeElement as HTMLElement

    const timer = setTimeout(() => {
      if (initialFocusRef?.current) {
        initialFocusRef.current.focus()
      } else {
        containerRef.current?.focus()
      }
    }, 50)

    return () => clearTimeout(timer)
  }, [isOpen, initialFocusRef])

  useEffect(() => {
    if (!isOpen || !onClose) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
        return
      }
      if (e.key === 'Tab' && containerRef.current) {
        const focusable = containerRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        )
        if (focusable.length === 0) return
        const first = focusable[0]
        const last = focusable[focusable.length - 1]
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault()
          last.focus()
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  useEffect(() => {
    if (!isOpen) return
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
      if (restoreFocus) {
        previousFocusRef.current?.focus()
      }
    }
  }, [isOpen, restoreFocus])

  return { containerRef }
}
