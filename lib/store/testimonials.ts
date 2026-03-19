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
  
  // Actions
  addTestimonial: (testimonial: Omit<Testimonial, 'id' | 'createdAt'>) => void
  removeTestimonial: (id: string) => void
  getAverageRating: () => number
  getTestimonialsByRating: (rating: number) => Testimonial[]
}

// Témoignages initiaux de démonstration
const initialTestimonials: Testimonial[] = [
  {
    id: '1',
    name: 'Maria Schmidt',
    email: 'maria.s@example.de',
    rating: 5,
    comment: 'Die Induktionspfanne ist absolut erstklassig! Das Essen wird gleichmäßig erhitzt und die Reinigung ist ein Kinderspiel. Kann ich nur empfehlen.',
    productName: 'Premium Induktionspfanne',
    createdAt: '2024-03-15T10:30:00Z',
    isVerified: true
  },
  {
    id: '2',
    name: 'Hans Weber',
    email: 'h.weber@example.de',
    rating: 5,
    comment: 'Habe das Topfset für meine neue Küche gekauft. Die Qualität ist hervorragend und sie sehen auch noch toll aus. Schnelle Lieferung!',
    productName: 'Premium Topfset',
    createdAt: '2024-03-10T14:20:00Z',
    isVerified: true
  },
  {
    id: '3',
    name: 'Klaus Müller',
    email: 'klaus.m@example.de',
    rating: 4,
    comment: 'Gute Produkte zu einem fairen Preis. Der Kundenservice war sehr hilfsbereit bei meinen Fragen zur Induktionstechnologie.',
    createdAt: '2024-02-28T09:15:00Z',
    isVerified: true
  },
  {
    id: '4',
    name: 'Anna Bauer',
    email: 'anna.b@example.de',
    rating: 5,
    comment: 'Mein Dutch Oven ist jetzt mein Lieblingsteil in der Küche. Perfekt für Schmorgerichte und Brotbacken.',
    productName: 'Dutch Oven Gusseisen',
    createdAt: '2024-02-20T16:45:00Z',
    isVerified: true
  },
  {
    id: '5',
    name: 'Thomas Klein',
    email: 'thomas.k@example.de',
    rating: 5,
    comment: 'Die Messer sind scharf und gut ausbalanciert. Endlich kann ich wie ein Profi schneiden!',
    productName: 'Chef Messerset',
    createdAt: '2024-02-15T11:30:00Z',
    isVerified: true
  }
]

export const useTestimonialsStore = create<TestimonialsState>()(
  persist(
    (set, get) => ({
      testimonials: initialTestimonials,
      
      addTestimonial: (testimonialData) => {
        const newTestimonial: Testimonial = {
          ...testimonialData,
          id: Date.now().toString(),
          createdAt: new Date().toISOString()
        }
        
        set({
          testimonials: [newTestimonial, ...get().testimonials]
        })
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
      }
    }),
    {
      name: 'nova-testimonials-storage',
      skipHydration: true
    }
  )
)

// Hook pour accéder aux témoignages (avec hydration côté client)
import { useEffect, useState } from 'react'

export function useTestimonials() {
  const store = useTestimonialsStore()
  const [isHydrated, setIsHydrated] = useState(false)
  
  useEffect(() => {
    setIsHydrated(true)
  }, [])
  
  return {
    ...store,
    isHydrated,
    averageRating: store.getAverageRating()
  }
}
