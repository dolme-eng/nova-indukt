/**
 * Configuration des catégories actives NOVA INDUKT
 * Spécialisé 100% Induction
 */

export interface CategoryConfig {
  id: string
  slug: string
  nameDe: string
  descriptionDe: string
  image: string
  sortOrder: number
  isActive: boolean
}

// Les catégories spécialisées pour l'induction
export const categoriesConfig: CategoryConfig[] = [
  {
    id: 'cat-induktionspfannen',
    slug: 'induktionspfannen',
    nameDe: 'Induktionspfannen',
    descriptionDe: 'Premium Bratpfannen, Woks und Schmorpfannen für maximale Induktionsleistung',
    image: '/images/Kategorien/induktionspfannen.png',
    sortOrder: 1,
    isActive: true,
  },
  {
    id: 'cat-induktionstoepfe',
    slug: 'induktionstoepfe',
    nameDe: 'Induktionstöpfe',
    descriptionDe: 'Kochtöpfe und Kasserollen mit ferromagnetischem Boden für schnelle Hitze',
    image: '/images/Kategorien/induktionstoepfe.jpg',
    sortOrder: 2,
    isActive: true,
  },
  {
    id: 'cat-induktions-sets',
    slug: 'induktions-sets',
    nameDe: 'Topf- & Pfannensets',
    descriptionDe: 'Perfekt abgestimmte Kochgeschirr-Sets für Ihre Induktionsküche',
    image: '/images/Kategorien/induktions-sets.png',
    sortOrder: 3,
    isActive: true,
  },
  {
    id: 'cat-induktions-zubehoer',
    slug: 'induktions-zubehoer',
    nameDe: 'Induktions-Zubehör',
    descriptionDe: 'Adapterplatten, Kratzschutzmatten und Reiniger für Induktionsfelder',
    image: '/images/Kategorien/induktions-zubehoer.jpg',
    sortOrder: 4,
    isActive: true,
  },
  {
    id: 'cat-induktionskochfelder-herde',
    slug: 'induktionskochfelder-herde',
    nameDe: 'Induktionskochfelder & Herde',
    descriptionDe: 'Einbau-Kochfelder, autarke Induktionsplatten und Premium-Herde mit modernster Induktionstechnologie',
    image: '/images/Kategorien/induktionskochfelder-herde.png',
    sortOrder: 5,
    isActive: true,
  },
]

// Map pour accès rapide par slug
export const categoriesBySlug = new Map(categoriesConfig.map(c => [c.slug, c]))

// Ordre d'affichage
export const categorySlugs = categoriesConfig.map(c => c.slug)
