'use client'

import { useState, useEffect, useCallback } from 'react'
import { useSession } from 'next-auth/react'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface WishlistItem {
  id: string
  name: { de: string }
  price: number
  image: string
  slug: string
}

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

interface WishlistStore {
  items: WishlistItem[]
  setItems: (items: WishlistItem[]) => void
  addItemState: (item: WishlistItem) => void
  removeItemState: (id: string) => void
  clearState: () => void
}

const useWishlistStore = create<WishlistStore>()(
  persist(
    (set) => ({
      items: [],
      setItems: (items) => set({ items }),
      addItemState: (item) => set((state) => {
        if (state.items.find((i) => i.id === item.id)) return state
        return { items: [...state.items, item] }
      }),
      removeItemState: (id) => set((state) => ({ items: state.items.filter((i) => i.id !== id) })),
      clearState: () => set({ items: [] }),
    }),
    {
      name: 'nova-wishlist',
    }
  )
)

export function useWishlist() {
  const [mounted, setMounted] = useState(false)
  const [isSyncing, setIsSyncing] = useState(false)
  
  const { items, setItems, addItemState, removeItemState, clearState } = useWishlistStore()
  const { status } = useSession()
  const isAuthenticated = status === 'authenticated'

  // Sync on login & hydration
  useEffect(() => {
    setMounted(true)
    
    if (isAuthenticated) {
      syncOnLogin()
      fetchWishlistFromApi()
    }
  }, [isAuthenticated])

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
    if (items.length === 0) return

    try {
      setIsSyncing(true)

      const response = await fetch('/api/wishlist/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ localItems: items }),
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
    addItemState(item)
    if (isAuthenticated) {
      await addItemToApi(item)
    }
    return true
  }, [isAuthenticated, addItemState])

  const removeItem = useCallback(async (id: string) => {
    removeItemState(id)
    if (isAuthenticated) {
      await removeItemFromApi(id)
    }
  }, [isAuthenticated, removeItemState])

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
    clearState()
    if (isAuthenticated) {
      try {
        await fetch('/api/wishlist', { method: 'DELETE' })
      } catch (error) {
        console.error('Error clearing wishlist:', error)
      }
    }
  }, [isAuthenticated, clearState])

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
