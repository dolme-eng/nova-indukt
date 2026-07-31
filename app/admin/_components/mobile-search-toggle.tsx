'use client'

import { useState, useRef, useEffect } from 'react'
import { Search, X } from 'lucide-react'

export function MobileSearchToggle() {
  const [open, setOpen] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (open) inputRef.current?.focus()
  }, [open])

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded-xl p-2.5 text-nova-600 transition-all hover:bg-nova-50 lg:hidden"
        aria-label="Suche öffnen"
      >
        <Search size={20} />
      </button>
    )
  }

  return (
    <form
      action="/suche"
      method="GET"
      className="fixed inset-x-0 top-0 z-50 flex items-center gap-2 border-b border-nova-100 bg-white p-3 shadow-lg lg:hidden"
    >
      <Search className="flex-shrink-0 text-nova-400" size={18} />
      <input
        ref={inputRef}
        type="text"
        name="q"
        placeholder="Produkte suchen..."
        className="flex-1 text-sm font-medium outline-none placeholder:text-nova-300"
      />
      <button
        type="button"
        onClick={() => setOpen(false)}
        className="rounded-lg p-1.5 text-nova-400 transition-colors hover:bg-nova-50 hover:text-nova-600"
        aria-label="Suche schließen"
      >
        <X size={18} />
      </button>
    </form>
  )
}
