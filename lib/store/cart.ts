import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { useShallow } from 'zustand/react/shallow'
import { Product } from '@/lib/data/products'
import {
  addToCart,
  updateCartItem as updateServerCartItem,
  removeFromCart as removeFromServerCart,
  clearCart as clearServerCart,
  getDbCartIds,
} from '@/app/actions/cart'
import { getProductsForHydration, type HydratedProduct } from '@/app/actions/cart-hydration'
import { logError } from '@/lib/logger'

const MAX_QTY = 99

function toStoreItem(fresh: HydratedProduct, quantity: number): CartItem {
  return {
    product: {
      id: fresh.id,
      slug: fresh.slug,
      name: { de: fresh.nameDe },
      category: '',
      price: fresh.price,
      images: fresh.imageUrl ? [fresh.imageUrl] : ['/placeholder.svg'],
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
    quantity: Math.min(MAX_QTY, Math.max(1, quantity)),
  }
}

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
  /** Replace store with server DB cart (post-login truth). No-op for guests. */
  syncFromServer: () => Promise<void>

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
        const previousItems = items
        const existingItem = items.find((item) => item.product.id === product.id)

        if (existingItem) {
          set({
            items: items.map((item) =>
              item.product.id === product.id
                ? { ...item, quantity: Math.min(MAX_QTY, item.quantity + quantity) }
                : item
            ),
          })
        } else {
          set({ items: [...items, { product, quantity: Math.min(MAX_QTY, quantity) }] })
        }

        addToCart(product.id, quantity).catch((err) => {
          logError('Failed to sync cart item addition:', err)
          set({ items: previousItems })
        })
      },

      removeItem: (productId) => {
        const previousItems = get().items
        set({
          items: previousItems.filter((item) => item.product.id !== productId),
        })

        removeFromServerCart(productId).catch((err) => {
          logError('Failed to sync cart item removal:', err)
          set({ items: previousItems })
        })
      },

      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId)
          return
        }

        const previousItems = get().items
        const clamped = Math.min(MAX_QTY, quantity)
        set({
          items: previousItems.map((item) =>
            item.product.id === productId ? { ...item, quantity: clamped } : item
          ),
        })

        updateServerCartItem(productId, clamped).catch((err) => {
          logError('Failed to sync cart item update:', err)
          set({ items: previousItems })
        })
      },

      syncFromServer: async () => {
        try {
          const ids = await getDbCartIds()
          if (ids.length === 0) return
          const products = await getProductsForHydration(ids.map((i) => i.productId))
          const productMap = new Map(products.map((p) => [p.id, p]))
          const serverItems: CartItem[] = []
          for (const item of ids) {
            const fresh = productMap.get(item.productId)
            if (!fresh) continue
            serverItems.push(toStoreItem(fresh, item.quantity))
          }
          // DB is truth post-merge: replace local items (drops stale/inactive)
          set({ items: serverItems })
        } catch (err) {
          logError('Failed to sync cart from server:', err)
        }
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
            // Validate shape: localStorage is user-controlled, never trust it blindly
            const candidates: unknown = raw?.state?.items ?? []
            const persistedItems: CartPersistedItem[] = (Array.isArray(candidates) ? candidates : [])
              .filter(
                (item): item is CartPersistedItem =>
                  typeof item === 'object' &&
                  item !== null &&
                  typeof (item as CartPersistedItem).id === 'string' &&
                  (item as CartPersistedItem).id.length > 0 &&
                  Number.isInteger((item as CartPersistedItem).quantity)
              )
              .map((item) => ({
                id: item.id,
                quantity: Math.min(MAX_QTY, Math.max(1, item.quantity)),
              }))
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
      onRehydrateStorage: () => {
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
