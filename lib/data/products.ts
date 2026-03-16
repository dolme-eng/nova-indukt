import { LucideIcon } from 'lucide-react'

export interface Product {
  id: string
  slug: string
  name: {
    de: string
    en: string
    fr: string
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
    en: string
    fr: string
  }
  shortDescription: {
    de: string
    en: string
    fr: string
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
    en: string
    fr: string
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
    en: string
    fr: string
  }
  excerpt: {
    de: string
    en: string
    fr: string
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
      de: 'Premium-Topfset für Induktion – 5-teilig',
      en: 'Premium Pot Set for Induction – 5-piece',
      fr: 'Set de casseroles premium pour induction – 5 pièces'
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
      de: 'Hochwertiges 5-teiliges Topfset aus 18/10 Edelstahl, speziell entwickelt für Induktionskochfelder. Optimale Wärmeverteilung, ergonomische Griffe, backofengeeignet bis 250°C.',
      en: 'High-quality 5-piece pot set made of 18/10 stainless steel, specially designed for induction cooktops. Optimal heat distribution, ergonomic handles, oven-safe up to 250°C.',
      fr: 'Set de casseroles 5 pièces en acier inoxydable 18/10, spécialement conçu pour plaques à induction. Distribution optimale de la chaleur, poignées ergonomiques, compatible four jusqu\'à 250°C.'
    },
    shortDescription: {
      de: 'Professionelles Kochset für höchste Ansprüche',
      en: 'Professional cooking set for highest demands',
      fr: 'Set de cuisson professionnel pour les plus hautes exigences'
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
      de: 'Cocotte Fonte Émaillée Dutch Oven',
      en: 'Enameled Cast Iron Dutch Oven',
      fr: 'Cocotte en fonte émaillée'
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
      de: 'Robuste gusseiserne Cocotte mit hochwertiger Emaillierung. Perfekt für Schmorgerichte, Brot backen und vieles mehr. Gleichmäßige Wärmeverteilung garantiert.',
      en: 'Robust cast iron cocotte with high-quality enamel coating. Perfect for braising, bread baking and much more. Guaranteed even heat distribution.',
      fr: 'Cocotte robuste en fonte avec émaillage de haute qualité. Parfaite pour les braisés, la cuisson du pain et bien plus. Distribution uniforme de la chaleur garantie.'
    },
    shortDescription: {
      de: 'Vielseitiger Küchenhelfer für alle Herdarten',
      en: 'Versatile kitchen helper for all stovetops',
      fr: 'Assistant de cuisine polyvalent pour tous les types de plaques'
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
      de: 'Set Couteaux Chef Haut de Gamme',
      en: 'Premium Chef Knife Set',
      fr: 'Set de couteaux de chef haut de gamme'
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
      de: 'Professionelles Messerset aus japanischem Edelstahl. Scharf, langlebig und perfekt ausbalanciert für präzises Arbeiten.',
      en: 'Professional knife set made from Japanese stainless steel. Sharp, durable and perfectly balanced for precise work.',
      fr: 'Set de couteaux professionnel en acier inoxydable japonais. Tranchant, durable et parfaitement équilibré pour un travail précis.'
    },
    shortDescription: {
      de: 'Japanische Qualität für die moderne Küche',
      en: 'Japanese quality for the modern kitchen',
      fr: 'Qualité japonaise pour la cuisine moderne'
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
      de: 'Blender Haute Puissance 2000W',
      en: 'High Performance Blender 2000W',
      fr: 'Blender haute puissance 2000W'
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
      de: 'Kraftvoller 2000W Motor für perfekte Smoothies, Suppen und mehr. Mit automatischen Programmen und Selbstreinigungsfunktion.',
      en: 'Powerful 2000W motor for perfect smoothies, soups and more. With automatic programs and self-cleaning function.',
      fr: 'Moteur puissant de 2000W pour des smoothies parfaits, soupes et plus. Avec programmes automatiques et fonction autonettoyante.'
    },
    shortDescription: {
      de: 'Professionelle Power für cremige Ergebnisse',
      en: 'Professional power for creamy results',
      fr: 'Puissance professionnelle pour des résultats crémeux'
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
      de: 'Poêle Grill Induction XXL',
      en: 'XXL Induction Grill Pan',
      fr: 'Poêle grill induction XXL'
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
      de: 'Große Grillpfanne aus Carbonstahl mit optimaler Wärmeverteilung. Perfekt für Steaks, Gemüse und mehr.',
      en: 'Large grill pan made of carbon steel with optimal heat distribution. Perfect for steaks, vegetables and more.',
      fr: 'Grande poêle grill en acier au carbone avec distribution optimale de la chaleur. Parfaite pour les steaks, légumes et plus.'
    },
    shortDescription: {
      de: 'Authentisches Grillerlebnis auf dem Herd',
      en: 'Authentic grilling experience on the stove',
      fr: 'Expérience de grill authentique sur la cuisinière'
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
      de: 'Set Ustensiles Inox Professionnel',
      en: 'Professional Stainless Steel Utensil Set',
      fr: "Set d'ustensiles inox professionnel"
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
      de: 'Komplettes Set professioneller Küchenutensilien aus rostfreiem Edelstahl. Langlebig und spülmaschinenfest.',
      en: 'Complete set of professional kitchen utensils made of stainless steel. Durable and dishwasher safe.',
      fr: "Set complet d'ustensiles de cuisine professionnels en acier inoxydable. Durable et lavable au lave-vaisselle."
    },
    shortDescription: {
      de: 'Alles was der Profikoch braucht',
      en: 'Everything the professional chef needs',
      fr: "Tout ce dont le chef professionnel a besoin"
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
      de: 'Marmite Vapeur Multi-niveaux',
      en: 'Multi-level Steam Pot',
      fr: 'Marmite vapeur multi-niveaux'
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
      de: 'Innovativer Dampfgarer mit mehreren Ebenen für gesundes Kochen. Perfekt für Gemüse, Fisch und Dim Sum.',
      en: 'Innovative multi-level steamer for healthy cooking. Perfect for vegetables, fish and dim sum.',
      fr: 'Cuiseur vapeur innovant à plusieurs niveaux pour une cuisson saine. Parfait pour les légumes, poissons et dim sum.'
    },
    shortDescription: {
      de: 'Gesund kochen auf mehreren Ebenen',
      en: 'Healthy cooking on multiple levels',
      fr: 'Cuisine saine sur plusieurs niveaux'
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
      de: 'Robot Multifonction Premium',
      en: 'Premium Food Processor',
      fr: 'Robot multifonction premium'
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
      de: 'Vielseitiger Küchenhelfer mit 12 Funktionen. Von Teig kneten bis Gemüse schneiden - alles in einem Gerät.',
      en: 'Versatile kitchen helper with 12 functions. From kneading dough to cutting vegetables - everything in one device.',
      fr: "Assistant de cuisine polyvalent avec 12 fonctions. Du pétrissage de pâte à la découpe de légumes - tout en un appareil."
    },
    shortDescription: {
      de: 'Die Allzweckwaffe in der Küche',
      en: 'The all-purpose weapon in the kitchen',
      fr: "L'arme polyvalente dans la cuisine"
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
      de: 'Kochen',
      en: 'Cooking',
      fr: 'Cuisson'
    },
    image: 'https://images.unsplash.com/photo-1556911220-bff31c812dba?w=600&q=80',
    count: 24
  },
  {
    id: 'vorbereitung',
    name: {
      de: 'Vorbereitung',
      en: 'Preparation',
      fr: 'Préparation'
    },
    image: 'https://images.unsplash.com/photo-1593618998160-e34014e67546?w=600&q=80',
    count: 18
  },
  {
    id: 'art-de-vivre',
    name: {
      de: 'Art de Vivre',
      en: 'Art de Vivre',
      fr: 'Art de Vivre'
    },
    image: 'https://images.unsplash.com/photo-1556911220-bff31c812dba?w=600&q=80',
    count: 12
  },
  {
    id: 'zubehoer',
    name: {
      de: 'Zubehör',
      en: 'Accessories',
      fr: 'Accessoires'
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
      de: 'Die richtige Pfanne für Induktion: Ein Kaufratgeber',
      en: 'The Right Pan for Induction: A Buying Guide',
      fr: 'La bonne poêle pour induction : Un guide d\'achat'
    },
    excerpt: {
      de: 'Worauf Sie beim Kauf einer Induktionspfanne unbedingt achten sollten. Materialien, Bodenaufbau und Pflege im Überblick.',
      en: 'What to look for when buying an induction pan. Materials, base construction and care overview.',
      fr: 'Ce qu\'il faut regarder lors de l\'achat d\'une poêle à induction. Matériaux, structure du fond et entretien.'
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
      de: 'Induktion vs. Gas: Der Energievergleich 2024',
      en: 'Induction vs. Gas: The Energy Comparison 2024',
      fr: 'Induction vs Gaz : La comparaison énergétique 2024'
    },
    excerpt: {
      de: 'Wie effizient ist Induktion wirklich? Wir vergleichen Verbrauch, Kosten und Umweltauswirkungen.',
      en: 'How efficient is induction really? We compare consumption, costs and environmental impact.',
      fr: 'Quelle est l\'efficacité réelle de l\'induction ? Nous comparons consommation, coûts et impact environnemental.'
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
      de: 'Pflege & Reinigung: So hältst du dein Kochfeld lange',
      en: 'Care & Cleaning: How to Make Your Cooktop Last',
      fr: 'Entretien et nettoyage : Comment faire durer votre plaque'
    },
    excerpt: {
      de: 'Die besten Tipps für die tägliche und gründliche Reinigung deines Induktionskochfelds ohne Kratzer.',
      en: 'The best tips for daily and thorough cleaning of your induction cooktop without scratches.',
      fr: 'Les meilleurs conseils pour le nettoyage quotidien et en profondeur de votre plaque à induction sans rayures.'
    },
    image: 'https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=800&q=80',
    date: '2026-03-05',
    readTime: '5 Min.',
    category: 'Pflege',
    author: 'NOVA INDUKT Team'
  }
]
