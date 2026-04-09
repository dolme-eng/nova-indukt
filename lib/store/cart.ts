import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Product } from '@/lib/data/products'

export interface CartItem {
  product: Product
  quantity: number
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
        const existingItem = items.find(item => item.product.id === product.id)
        
        if (existingItem) {
          // Update quantity if item already exists
          set({
            items: items.map(item =>
              item.product.id === product.id
                ? { ...item, quantity: item.quantity + quantity }
                : item
            )
          })
        } else {
          // Add new item
          set({ items: [...items, { product, quantity }] })
        }
      },
      
      removeItem: (productId) => {
        set({
          items: get().items.filter(item => item.product.id !== productId)
        })
      },
      
      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId)
          return
        }
        
        set({
          items: get().items.map(item =>
            item.product.id === productId
              ? { ...item, quantity }
              : item
          )
        })
      },
      
      clearCart: () => {
        set({ items: [] })
      },
      
      setHydrated: () => {
        set({ isHydrated: true })
      },
      
      totalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0)
      },
      
      totalPrice: () => {
        return get().items.reduce(
          (total, item) => total + item.product.price * item.quantity,
          0
        )
      }
    }),
    {
      name: 'nova-cart-storage',
      onRehydrateStorage: (state) => {
        return () => state?.setHydrated()
      }
    }
  )
)

// Hook pour accéder au panier
export function useCart() {
  const store = useCartStore()
  
  return {
    ...store,
    totalItems: store.totalItems(),
    totalPrice: store.totalPrice()
  }
}
