import { LucideIcon } from 'lucide-react'

export interface Product {
  id: string
  slug: string
  name: {
    de: string
  }
  category: 'kochen' | 'vorbereitung' | 'art-de-vivre' | 'zubehoer'
  price: number
  oldPrice?: number
  images: string[]
  rating: number
  reviewCount: number
  stock: number
  badges?: ('premium' | 'bestseller' | 'new')[]
  description: {
    de: string
  }
  shortDescription: {
    de: string
  }
  specs: {
    material: string
    dimensions: string
    weight: string
    dishwasher: boolean
    induction: boolean
  }
}

export interface Category {
  id: string
  name: {
    de: string
  }
  image: string
  count: number
}

export interface TrustItem {
  icon: LucideIcon
  key: string
}

export interface TechFeature {
  icon: LucideIcon
  title: string
  description: string
}

export interface BlogPost {
  id: string
  slug: string
  title: {
    de: string
  }
  excerpt: {
    de: string
  }
  image: string
  date: string
  readTime: string
  category: string
  author: string
}

export const products: Product[] = [
  {
    id: 'nova-ps-500',
    slug: 'premium-topfset-induktion',
    name: {
      de: 'Premium-Topfset für Induktion – 5-teilig'
    },
    category: 'kochen',
    price: 520,
    oldPrice: 580,
    images: [
      'https://images.unsplash.com/photo-1556911220-bff31c812dba?w=800&q=80',
      'https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=800&q=80'
    ],
    rating: 4.8,
    reviewCount: 12,
    stock: 5,
    badges: ['premium', 'bestseller'],
    description: {
      de: 'Hochwertiges 5-teiliges Topfset aus 18/10 Edelstahl, speziell entwickelt für Induktionskochfelder. Optimale Wärmeverteilung, ergonomische Griffe, backofengeeignet bis 250°C.'
    },
    shortDescription: {
      de: 'Professionelles Kochset für höchste Ansprüche'
    },
    specs: {
      material: '18/10 Edelstahl',
      dimensions: '16-28cm',
      weight: '4.5kg',
      dishwasher: true,
      induction: true
    }
  },
  {
    id: 'nova-do-450',
    slug: 'dutch-oven-gusseisen',
    name: {
      de: 'Cocotte Fonte Émaillée Dutch Oven'
    },
    category: 'kochen',
    price: 480,
    images: [
      'https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=800&q=80'
    ],
    rating: 4.9,
    reviewCount: 28,
    stock: 8,
    badges: ['premium', 'bestseller'],
    description: {
      de: 'Robuste gusseiserne Cocotte mit hochwertiger Emaillierung. Perfekt für Schmorgerichte, Brot backen und vieles mehr. Gleichmäßige Wärmeverteilung garantiert.'
    },
    shortDescription: {
      de: 'Vielseitiger Küchenhelfer für alle Herdarten'
    },
    specs: {
      material: 'Gusseisen emailliert',
      dimensions: '26cm Ø',
      weight: '6.2kg',
      dishwasher: false,
      induction: true
    }
  },
  {
    id: 'nova-ks-550',
    slug: 'chef-messerset-premium',
    name: {
      de: 'Set Couteaux Chef Haut de Gamme'
    },
    category: 'vorbereitung',
    price: 550,
    images: [
      'https://images.unsplash.com/photo-1593618998160-e34014e67546?w=800&q=80'
    ],
    rating: 4.7,
    reviewCount: 15,
    stock: 12,
    badges: ['premium'],
    description: {
      de: 'Professionelles Messerset aus japanischem Edelstahl. Scharf, langlebig und perfekt ausbalanciert für präzises Arbeiten.'
    },
    shortDescription: {
      de: 'Japanische Qualität für die moderne Küche'
    },
    specs: {
      material: 'Japanischer Edelstahl',
      dimensions: '8-20cm Klingen',
      weight: '1.2kg',
      dishwasher: false,
      induction: false
    }
  },
  {
    id: 'nova-bl-420',
    slug: 'hochleistungs-blender',
    name: {
      de: 'Blender Haute Puissance 2000W'
    },
    category: 'vorbereitung',
    price: 420,
    images: [
      'https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=800&q=80'
    ],
    rating: 4.6,
    reviewCount: 22,
    stock: 7,
    badges: ['new'],
    description: {
      de: 'Kraftvoller 2000W Motor für perfekte Smoothies, Suppen und mehr. Mit automatischen Programmen und Selbstreinigungsfunktion.'
    },
    shortDescription: {
      de: 'Professionelle Power für cremige Ergebnisse'
    },
    specs: {
      material: 'Edelstahl & BPA-freier Kunststoff',
      dimensions: '45 x 20 x 20cm',
      weight: '4.8kg',
      dishwasher: true,
      induction: false
    }
  },
  {
    id: 'nova-gp-450',
    slug: 'grill-pfanne-xxl',
    name: {
      de: 'Poêle Grill Induction XXL'
    },
    category: 'kochen',
    price: 450,
    images: [
      'https://images.unsplash.com/photo-1556911220-bff31c812dba?w=800&q=80'
    ],
    rating: 4.5,
    reviewCount: 18,
    stock: 6,
    badges: ['bestseller'],
    description: {
      de: 'Große Grillpfanne aus Carbonstahl mit optimaler Wärmeverteilung. Perfekt für Steaks, Gemüse und mehr.'
    },
    shortDescription: {
      de: 'Authentisches Grillerlebnis auf dem Herd'
    },
    specs: {
      material: 'Carbonstahl',
      dimensions: '28 x 28cm',
      weight: '2.1kg',
      dishwasher: false,
      induction: true
    }
  },
  {
    id: 'nova-us-380',
    slug: 'ustensiles-inox-pro',
    name: {
      de: 'Set Ustensiles Inox Professionnel'
    },
    category: 'zubehoer',
    price: 380,
    images: [
      'https://images.unsplash.com/photo-1556911220-bff31c812dba?w=800&q=80'
    ],
    rating: 4.7,
    reviewCount: 31,
    stock: 15,
    badges: ['bestseller'],
    description: {
      de: 'Komplettes Set professioneller Küchenutensilien aus rostfreiem Edelstahl. Langlebig und spülmaschinenfest.'
    },
    shortDescription: {
      de: 'Alles was der Profikoch braucht'
    },
    specs: {
      material: 'Edelstahl 18/10',
      dimensions: 'Verschiedene Größen',
      weight: '1.5kg',
      dishwasher: true,
      induction: false
    }
  },
  {
    id: 'nova-sp-490',
    slug: 'dampfgarer-multilevel',
    name: {
      de: 'Marmite Vapeur Multi-niveaux'
    },
    category: 'kochen',
    price: 490,
    images: [
      'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&q=80',
    ],
    rating: 4.6,
    reviewCount: 9,
    stock: 4,
    badges: ['new'],
    description: {
      de: 'Innovativer Dampfgarer mit mehreren Ebenen für gesundes Kochen. Perfekt für Gemüse, Fisch und Dim Sum.'
    },
    shortDescription: {
      de: 'Gesund kochen auf mehreren Ebenen'
    },
    specs: {
      material: 'Edelstahl',
      dimensions: '24cm Ø, 3 Ebenen',
      weight: '3.2kg',
      dishwasher: true,
      induction: true
    }
  },
  {
    id: 'nova-rm-580',
    slug: 'robot-multifonction',
    name: {
      de: 'Robot Multifonction Premium'
    },
    category: 'vorbereitung',
    price: 580,
    images: [
      'https://images.unsplash.com/photo-1556911220-bff31c812dba?w=800&q=80'
    ],
    rating: 4.8,
    reviewCount: 24,
    stock: 9,
    badges: ['premium', 'bestseller'],
    description: {
      de: 'Vielseitiger Küchenhelfer mit 12 Funktionen. Von Teig kneten bis Gemüse schneiden - alles in einem Gerät.'
    },
    shortDescription: {
      de: 'Die Allzweckwaffe in der Küche'
    },
    specs: {
      material: 'Edelstahl & Kunststoff',
      dimensions: '38 x 25 x 35cm',
      weight: '5.5kg',
      dishwasher: true,
      induction: false
    }
  }
]

export const categories: Category[] = [
  {
    id: 'kochen',
    name: {
      de: 'Kochen'
    },
    image: 'https://images.unsplash.com/photo-1556911220-bff31c812dba?w=600&q=80',
    count: 24
  },
  {
    id: 'vorbereitung',
    name: {
      de: 'Vorbereitung'
    },
    image: 'https://images.unsplash.com/photo-1593618998160-e34014e67546?w=600&q=80',
    count: 18
  },
  {
    id: 'art-de-vivre',
    name: {
      de: 'Art de Vivre'
    },
    image: 'https://images.unsplash.com/photo-1556911220-bff31c812dba?w=600&q=80',
    count: 12
  },
  {
    id: 'zubehoer',
    name: {
      de: 'Zubehör'
    },
    image: 'https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=600&q=80',
    count: 36
  }
]

export const blogPosts: BlogPost[] = [
  {
    id: 'blog-1',
    slug: 'pfanne-kaufratgeber',
    title: {
      de: 'Die richtige Pfanne für Induktion: Ein Kaufratgeber'
    },
    excerpt: {
      de: 'Worauf Sie beim Kauf einer Induktionspfanne unbedingt achten sollten. Materialien, Bodenaufbau und Pflege im Überblick.'
    },
    image: 'https://images.unsplash.com/photo-1556911220-bff31c812dba?w=800&q=80',
    date: '2026-03-13',
    readTime: '8 Min.',
    category: 'Kaufberatung',
    author: 'NOVA INDUKT Team'
  },
  {
    id: 'blog-2',
    slug: 'induktion-vs-gas',
    title: {
      de: 'Induktion vs. Gas: Der Energievergleich 2024'
    },
    excerpt: {
      de: 'Wie effizient ist Induktion wirklich? Wir vergleichen Verbrauch, Kosten und Umweltauswirkungen.'
    },
    image: 'https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=800&q=80',
    date: '2026-03-10',
    readTime: '6 Min.',
    category: 'Technik',
    author: 'NOVA INDUKT Team'
  },
  {
    id: 'blog-3',
    slug: 'kochfeld-pflege',
    title: {
      de: 'Pflege & Reinigung: So hältst du dein Kochfeld lange'
    },
    excerpt: {
      de: 'Die besten Tipps für die tägliche und gründliche Reinigung deines Induktionskochfelds ohne Kratzer.'
    },
    image: 'https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=800&q=80',
    date: '2026-03-05',
    readTime: '5 Min.',
    category: 'Pflege',
    author: 'NOVA INDUKT Team'
  }
]
