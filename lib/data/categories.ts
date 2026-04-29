/**
 * Configuration des 3 catégories actives NOVA INDUKT
 * Simplifié pour une meilleure UX
 */

export interface CategoryConfig {
  id: string
  slug: string
  nameDe: string
  nameEn: string
  descriptionDe: string
  image: string
  sortOrder: number
  isActive: boolean
}

// Les 3 catégories avec des produits
export const categoriesConfig: CategoryConfig[] = [
  {
    id: 'cat-kochen-braten',
    slug: 'kochen-braten',
    nameDe: 'Kochen & Braten',
    nameEn: 'Cooking & Frying',
    descriptionDe: 'Premium Töpfe, Pfannen, Bräter und Kochgeschirr für Induktion',
    image: '/images/Kategorien/kochen-braten.webp',
    sortOrder: 1,
    isActive: true,
  },
  {
    id: 'cat-messer-vorbereitung',
    slug: 'messer-vorbereitung',
    nameDe: 'Messer & Vorbereitung',
    nameEn: 'Knives & Preparation',
    descriptionDe: 'Präzisionsmesser, Schneidebretter und Werkzeuge für die perfekte Zubereitung',
    image: '/images/Kategorien/vorbereitung.webp',
    sortOrder: 2,
    isActive: true,
  },
  {
    id: 'cat-kuechenhelfer-zubehoer',
    slug: 'kuechenhelfer-zubehoer',
    nameDe: 'Küchenhelfer & Zubehör',
    nameEn: 'Kitchen Helpers & Accessories',
    descriptionDe: 'Nützliche Helfer, Küchengeräte und praktisches Zubehör für die Küche',
    image: '/images/Kategorien/kuechenzubehoer.webp',
    sortOrder: 3,
    isActive: true,
  },
]

// Map pour accès rapide par slug
export const categoriesBySlug = new Map(categoriesConfig.map(c => [c.slug, c]))

// Ordre d'affichage
export const categorySlugs = categoriesConfig.map(c => c.slug)
