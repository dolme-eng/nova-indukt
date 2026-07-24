import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface Testimonial {
  id: string
  name: string
  email: string
  rating: number
  comment: string
  productName?: string
  createdAt: string
  isVerified: boolean
}

interface TestimonialsState {
  testimonials: Testimonial[]
  isHydrated: boolean
  
  // Actions
  addTestimonial: (testimonial: Omit<Testimonial, 'id' | 'createdAt'>) => void
  removeTestimonial: (id: string) => void
  getAverageRating: () => number
  getTestimonialsByRating: (rating: number) => Testimonial[]
  setHydrated: () => void
}

// Initial testimonials loaded from DB via API — no hardcoded fake data
const initialTestimonials: Testimonial[] = []

export const useTestimonialsStore = create<TestimonialsState>()(
  persist(
    (set, get) => ({
      testimonials: initialTestimonials,
      isHydrated: false,
      
      addTestimonial: (testimonialData) => {
        const newTestimonial: Testimonial = {
          ...testimonialData,
          id: Date.now().toString(),
          createdAt: new Date().toISOString(),
          isVerified: false
        }
        
        set((state) => ({
          testimonials: [newTestimonial, ...state.testimonials]
        }))
      },
      removeTestimonial: (id) => {
        set({
          testimonials: get().testimonials.filter(t => t.id !== id)
        })
      },
      getAverageRating: () => {
        const { testimonials } = get()
        if (testimonials.length === 0) return 0
        const sum = testimonials.reduce((acc, t) => acc + t.rating, 0)
        return Math.round((sum / testimonials.length) * 10) / 10
      },
      getTestimonialsByRating: (rating) => {
        return get().testimonials.filter(t => t.rating === rating)
      },
      setHydrated: () => set({ isHydrated: true })
    }),
    {
      name: 'nova-testimonials-storage',
      onRehydrateStorage: (state) => {
        return () => state?.setHydrated()
      }
    }
  )
)

export function useTestimonials() {
  const store = useTestimonialsStore()
  return store
}
