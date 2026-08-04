import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { useShallow } from 'zustand/react/shallow'
import { Product } from '@/lib/data/products'
import {
  addToCart,
  updateCartItem as updateServerCartItem,
  removeFromCart as removeFromServerCart,
  clearCart as clearServerCart,
} from '@/app/actions/cart'
import { getProductsForHydration, type HydratedProduct } from '@/app/actions/cart-hydration'
import { logError } from '@/lib/logger'

export interface CartItem {
  product: Product
  quantity: number
}

/** Lightweight persisted entry — only ID + quantity (no product payload). */
interface CartPersistedItem {
  id: string
  quantity: number
}

/** Shape of data in localStorage. */
interface CartStorage {
  state: {
    items: CartPersistedItem[]
  }
}

interface CartState {
  items: CartItem[]
  isHydrated: boolean

  // Actions
  addItem: (product: Product, quantity?: number) => void
  removeItem: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  setHydrated: () => void

  // Computed
  totalItems: () => number
  totalPrice: () => number
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isHydrated: false,

      addItem: (product, quantity = 1) => {
        const { items } = get()
        const existingItem = items.find((item) => item.product.id === product.id)

        if (existingItem) {
          set({
            items: items.map((item) =>
              item.product.id === product.id
                ? { ...item, quantity: item.quantity + quantity }
                : item
            ),
          })
        } else {
          set({ items: [...items, { product, quantity }] })
        }

        addToCart(product.id, quantity).catch((err) =>
          logError('Failed to sync cart item addition:', err)
        )
      },

      removeItem: (productId) => {
        set({
          items: get().items.filter((item) => item.product.id !== productId),
        })

        removeFromServerCart(productId).catch((err) =>
          logError('Failed to sync cart item removal:', err)
        )
      },

      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId)
          return
        }

        set({
          items: get().items.map((item) =>
            item.product.id === productId ? { ...item, quantity } : item
          ),
        })

        updateServerCartItem(productId, quantity).catch((err) =>
          logError('Failed to sync cart item update:', err)
        )
      },

      clearCart: () => {
        set({ items: [] })

        clearServerCart().catch((err) => logError('Failed to sync cart clearing:', err))
      },

      setHydrated: () => {
        set({ isHydrated: true })
      },

      totalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0)
      },

      totalPrice: () => {
        const total = get().items.reduce((total, item) => total + item.product.price * item.quantity, 0)
        return Math.round(total * 100) / 100
      },
    }),
    {
      name: 'nova-cart-storage',
      storage: {
        getItem: (name) => {
          if (typeof window === 'undefined') return null
          const str = localStorage.getItem(name)
          if (!str) return null

          try {
            const raw = JSON.parse(str) as CartStorage
            const persistedItems: CartPersistedItem[] = raw?.state?.items ?? []
            return {
              ...raw,
              state: {
                ...raw.state,
                items: persistedItems.map((item: CartPersistedItem) => ({
                  product: {
                    id: item.id,
                    slug: '',
                    name: { de: '' },
                    category: '',
                    price: 0,
                    images: [],
                    rating: 0,
                    reviewCount: 0,
                    description: { de: '' },
                    shortDescription: { de: '' },
                    specs: {
                      material: '',
                      dimensions: '',
                      weight: '',
                      dishwasher: false,
                      induction: false,
                    },
                  } as Product,
                  quantity: item.quantity,
                })),
              },
            }
          } catch {
            return null
          }
        },
        setItem: (name, value) => {
          if (typeof window === 'undefined') return
          const lightweight: CartStorage = {
            ...value,
            state: {
              ...value.state,
              items: value.state.items.map((item: CartItem) => ({
                id: item.product.id,
                quantity: item.quantity,
              })),
            },
          }
          localStorage.setItem(name, JSON.stringify(lightweight))
        },
        removeItem: (name) => {
          if (typeof window === 'undefined') return
          localStorage.removeItem(name)
        },
      },
      onRehydrateStorage: (state) => {
        return () => {
          // After localStorage hydration, fetch fresh product data from DB
          const cartState = useCartStore.getState()
          const persistedIds = cartState.items.map((item) => item.product.id).filter((id) => id)

          if (persistedIds.length === 0) {
            cartState.setHydrated()
            return
          }

          getProductsForHydration(persistedIds)
            .then((products) => {
              const productMap = new Map(products.map((p) => [p.id, p]))
              const hydratedItems: CartItem[] = cartState.items
                .map((item) => {
                  const fresh = productMap.get(item.product.id)
                  if (!fresh) return null
                  return {
                    product: {
                      ...item.product,
                      name: { de: fresh.nameDe },
                      slug: fresh.slug,
                      price: fresh.price,
                      images: fresh.imageUrl ? [fresh.imageUrl] : item.product.images,
                    },
                    quantity: item.quantity,
                  }
                })
                .filter((item): item is CartItem => item !== null)

              useCartStore.setState({ items: hydratedItems, isHydrated: true })
            })
            .catch((err) => {
              logError('Failed to hydrate cart products:', err)
              cartState.setHydrated()
            })
        }
      },
    }
  )
)

// Hook pour accéder au panier — useShallow to prevent unnecessary re-renders
export function useCart() {
  const { items, isHydrated, addItem, removeItem, updateQuantity, clearCart, setHydrated } =
    useCartStore(
      useShallow((s) => ({
        items: s.items,
        isHydrated: s.isHydrated,
        addItem: s.addItem,
        removeItem: s.removeItem,
        updateQuantity: s.updateQuantity,
        clearCart: s.clearCart,
        setHydrated: s.setHydrated,
      }))
    )

  const totalItems = items.reduce((total, item) => total + item.quantity, 0)
  const totalPrice = Math.round(items.reduce((total, item) => total + item.product.price * item.quantity, 0) * 100) / 100

  return {
    items,
    isHydrated,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    setHydrated,
    totalItems,
    totalPrice,
  }
}
