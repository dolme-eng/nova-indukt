'use client'

import { useState, useEffect, useCallback } from 'react'

export interface WishlistItem {
  id: string
  name: { de: string }
  price: number
  image: string
  slug: string
}

const STORAGE_KEY = 'nova-wishlist'

export function useWishlist() {
  const [items, setItems] = useState<WishlistItem[]>([])
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        // Migration: convert old format (array of strings or objects with productId) to new format
        if (Array.isArray(parsed)) {
          const migrated = parsed.filter((item: any) => {
            // Keep only valid new format items
            return item && typeof item === 'object' && item.id && item.name && item.price
          })
          setItems(migrated)
        }
      } catch {
        setItems([])
      }
    }
  }, [])

  useEffect(() => {
    if (mounted) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
      // Dispatch storage event for cross-tab synchronization
      window.dispatchEvent(new StorageEvent('storage', { key: STORAGE_KEY }))
    }
  }, [items, mounted])

  const addItem = useCallback((item: WishlistItem) => {
    setItems((prev) => {
      if (prev.find((i) => i.id === item.id)) return prev
      return [...prev, item]
    })
    return true
  }, [])

  const removeItem = useCallback((id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id))
  }, [])

  const isInWishlist = useCallback((id: string) => {
    return items.some((i) => i.id === id)
  }, [items])

  const toggleItem = useCallback((item: WishlistItem) => {
    if (isInWishlist(item.id)) {
      removeItem(item.id)
      return false
    } else {
      addItem(item)
      return true
    }
  }, [addItem, removeItem, isInWishlist])

  return {
    items,
    count: items.length,
    addItem,
    removeItem,
    isInWishlist,
    toggleItem,
    mounted,
  }
}
