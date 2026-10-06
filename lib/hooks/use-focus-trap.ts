'use client'

import { useEffect, useRef } from 'react'

interface UseFocusTrapOptions<T extends HTMLElement = HTMLElement> {
  isOpen: boolean
  onClose?: () => void
  initialFocusRef?: React.RefObject<T | null>
  restoreFocus?: boolean
  /**
   * Attach to the dialog element instead of using the returned ref. Needed
   * when the hook's default `HTMLElement` ref is not assignable to the concrete
   * element type (e.g. a `HTMLDivElement` ref on a `motion.div`).
   */
  containerRef?: React.RefObject<HTMLElement | null>
}

export function useFocusTrap<T extends HTMLElement = HTMLElement>({
  isOpen,
  onClose,
  initialFocusRef,
  containerRef: externalContainerRef,
  restoreFocus = true,
}: UseFocusTrapOptions<T>) {
  const localContainerRef = useRef<T>(null)
  const previousFocusRef = useRef<HTMLElement | null>(null)
  const containerRef = externalContainerRef ?? localContainerRef

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
    // containerRef is a ref object: stable, safe to omit.
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    // containerRef is a ref object (stable identity), safe to omit.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, onClose])

  useEffect(() => {
    if (!isOpen) return
    const release = lockBodyScroll()
    return () => {
      release()
      if (restoreFocus) {
        previousFocusRef.current?.focus()
      }
    }
  }, [isOpen, restoreFocus])

  return { containerRef: localContainerRef }
}

// ── Body scroll lock ─────────────────────────────────────────────────────────
//
// Reference-counted, and it restores the value it found rather than forcing
// ''. Modals overlap in this app (drawer + cookie banner + cart drawer), and
// the previous per-component `overflow = ''` reset let the page scroll while a
// dialog was still open.
let scrollLockCount = 0
let previousOverflow = ''

export function lockBodyScroll(): () => void {
  if (scrollLockCount === 0) {
    previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
  }
  scrollLockCount++

  let released = false
  return () => {
    if (released) return
    released = true
    scrollLockCount = Math.max(0, scrollLockCount - 1)
    if (scrollLockCount === 0) {
      document.body.style.overflow = previousOverflow
    }
  }
}
