'use client'

import { useState, useEffect, useCallback } from 'react'
import { useSession } from 'next-auth/react'

export interface WishlistItem {
  id: string
  name: { de: string }
  price: number
  image: string
  slug: string
}

const STORAGE_KEY = 'nova-wishlist'

interface ApiWishlistItem {
  id: string
  name: { de: string; en: string }
  price: number
  oldPrice: number | null
  image: string
  slug: string
  category?: string
  stock: number
  addedAt: string
}

export function useWishlist() {
  const [items, setItems] = useState<WishlistItem[]>([])
  const [mounted, setMounted] = useState(false)
  const [isSyncing, setIsSyncing] = useState(false)
  const { data: session, status } = useSession()
  const isAuthenticated = status === 'authenticated'

  // Load wishlist on mount
  useEffect(() => {
    setMounted(true)
    
    if (isAuthenticated) {
      // Load from API when authenticated
      fetchWishlistFromApi()
    } else {
      // Load from localStorage for guests
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        try {
          const parsed = JSON.parse(saved)
          if (Array.isArray(parsed)) {
            const migrated = parsed.filter((item: any) => {
              return item && typeof item === 'object' && item.id && item.name && item.price
            })
            setItems(migrated)
          }
        } catch {
          setItems([])
        }
      }
    }
  }, [isAuthenticated])

  // Sync localStorage when items change (only for guests)
  useEffect(() => {
    if (mounted && !isAuthenticated) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
      window.dispatchEvent(new StorageEvent('storage', { key: STORAGE_KEY }))
    }
  }, [items, mounted, isAuthenticated])

  // Sync wishlist on login
  useEffect(() => {
    if (isAuthenticated && mounted) {
      syncOnLogin()
    }
  }, [isAuthenticated, mounted])

  const fetchWishlistFromApi = async () => {
    try {
      const response = await fetch('/api/wishlist')
      if (response.ok) {
        const data: ApiWishlistItem[] = await response.json()
        setItems(data.map(item => ({
          id: item.id,
          name: { de: item.name.de },
          price: item.price,
          image: item.image,
          slug: item.slug,
        })))
      }
    } catch (error) {
      console.error('Error fetching wishlist:', error)
    }
  }

  const syncOnLogin = async () => {
    const localItems = localStorage.getItem(STORAGE_KEY)
    if (!localItems) return

    try {
      setIsSyncing(true)
      const parsed = JSON.parse(localItems)
      if (!Array.isArray(parsed) || parsed.length === 0) return

      const response = await fetch('/api/wishlist/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ localItems: parsed }),
      })

      if (response.ok) {
        const data = await response.json()
        if (data.wishlist) {
          setItems(data.wishlist.map((item: ApiWishlistItem) => ({
            id: item.id,
            name: { de: item.name.de },
            price: item.price,
            image: item.image,
            slug: item.slug,
          })))
        }
        // Clear localStorage after successful sync
        localStorage.removeItem(STORAGE_KEY)
      }
    } catch (error) {
      console.error('Error syncing wishlist:', error)
    } finally {
      setIsSyncing(false)
    }
  }

  const addItemToApi = async (item: WishlistItem) => {
    try {
      const response = await fetch('/api/wishlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: item.id }),
      })
      return response.ok
    } catch (error) {
      console.error('Error adding to wishlist API:', error)
      return false
    }
  }

  const removeItemFromApi = async (id: string) => {
    try {
      const response = await fetch(`/api/wishlist?productId=${id}`, {
        method: 'DELETE',
      })
      return response.ok
    } catch (error) {
      console.error('Error removing from wishlist API:', error)
      return false
    }
  }

  const addItem = useCallback(async (item: WishlistItem) => {
    setItems((prev) => {
      if (prev.find((i) => i.id === item.id)) return prev
      return [...prev, item]
    })

    if (isAuthenticated) {
      await addItemToApi(item)
    }
    return true
  }, [isAuthenticated])

  const removeItem = useCallback(async (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id))

    if (isAuthenticated) {
      await removeItemFromApi(id)
    }
  }, [isAuthenticated])

  const isInWishlist = useCallback((id: string) => {
    return items.some((i) => i.id === id)
  }, [items])

  const toggleItem = useCallback(async (item: WishlistItem) => {
    if (isInWishlist(item.id)) {
      await removeItem(item.id)
      return false
    } else {
      await addItem(item)
      return true
    }
  }, [addItem, removeItem, isInWishlist])

  const clearWishlist = useCallback(async () => {
    setItems([])
    
    if (isAuthenticated) {
      try {
        await fetch('/api/wishlist', { method: 'DELETE' })
      } catch (error) {
        console.error('Error clearing wishlist:', error)
      }
    } else {
      localStorage.removeItem(STORAGE_KEY)
    }
  }, [isAuthenticated])

  return {
    items,
    count: items.length,
    addItem,
    removeItem,
    isInWishlist,
    toggleItem,
    clearWishlist,
    mounted,
    isSyncing,
    isAuthenticated,
  }
}
