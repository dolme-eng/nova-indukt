/**
 * Configuration des 13 catégories NOVA INDUKT
 * Basée sur les images présentes dans /public/images/Kategorien/
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

// Les 13 catégories basées sur les images existantes
export const categoriesConfig: CategoryConfig[] = [
  {
    id: 'cat-kochen-braten',
    slug: 'kochen-braten',
    nameDe: 'Kochen & Braten',
    nameEn: 'Cooking & Frying',
    descriptionDe: 'Premium Töpfe, Pfannen und Kochgeschirr für Induktion',
    image: '/images/Kategorien/kochen-braten.webp',
    sortOrder: 1,
    isActive: true,
  },
  {
    id: 'cat-vorbereitung',
    slug: 'vorbereitung',
    nameDe: 'Vorbereitung',
    nameEn: 'Preparation',
    descriptionDe: 'Schneidebretter, Messer und Küchenhelfer für die Zubereitung',
    image: '/images/Kategorien/vorbereitung.webp',
    sortOrder: 2,
    isActive: true,
  },
  {
    id: 'cat-kuechenzubehoer',
    slug: 'kuechenzubehoer',
    nameDe: 'Küchenzubehör',
    nameEn: 'Kitchen Accessories',
    descriptionDe: 'Praktisches Zubehör für die moderne Küche',
    image: '/images/Kategorien/kuechenzubehoer.webp',
    sortOrder: 3,
    isActive: true,
  },
  {
    id: 'cat-tisch-servier',
    slug: 'tisch-servier',
    nameDe: 'Tisch & Servier',
    nameEn: 'Table & Serving',
    descriptionDe: 'Elegantes Geschirr und Servieraccessoires',
    image: '/images/Kategorien/tisch-servier.webp',
    sortOrder: 4,
    isActive: true,
  },
  {
    id: 'cat-spezial',
    slug: 'spezial',
    nameDe: 'Spezial',
    nameEn: 'Special',
    descriptionDe: 'Besondere Produkte und Spezialartikel',
    image: '/images/Kategorien/spezial.jpg',
    sortOrder: 5,
    isActive: true,
  },
  {
    id: 'cat-sets',
    slug: 'sets',
    nameDe: 'Sets',
    nameEn: 'Sets',
    descriptionDe: 'Vorteilhafte Produktsets und Kombinationen',
    image: '/images/Kategorien/sets.jpg',
    sortOrder: 6,
    isActive: true,
  },
  {
    id: 'cat-herde',
    slug: 'herde',
    nameDe: 'Herde',
    nameEn: 'Stoves & Ovens',
    descriptionDe: 'Hochwertige Herde und Kochfelder',
    image: '/images/Kategorien/herde.jpg',
    sortOrder: 7,
    isActive: true,
  },
  {
    id: 'cat-kuehlschraenke',
    slug: 'kuehlschraenke',
    nameDe: 'Kühlschränke',
    nameEn: 'Refrigerators',
    descriptionDe: 'Kühl- und Gefriergeräte für die Küche',
    image: '/images/Kategorien/kuehlschraenke.jpg',
    sortOrder: 8,
    isActive: true,
  },
  {
    id: 'cat-geschirrspueler',
    slug: 'geschirrspueler',
    nameDe: 'Geschirrspüler',
    nameEn: 'Dishwashers',
    descriptionDe: 'Effiziente Geschirrspülmaschinen',
    image: '/images/Kategorien/geschirrspueler.jpg',
    sortOrder: 9,
    isActive: true,
  },
  {
    id: 'cat-kuechenmaschinen',
    slug: 'kuechenmaschinen',
    nameDe: 'Küchenmaschinen',
    nameEn: 'Kitchen Machines',
    descriptionDe: 'Küchenmaschinen und Food Processor',
    image: '/images/Kategorien/kuechenmaschinen.jpg',
    sortOrder: 10,
    isActive: true,
  },
  {
    id: 'cat-waschmaschinen',
    slug: 'waschmaschinen',
    nameDe: 'Waschmaschinen',
    nameEn: 'Washing Machines',
    descriptionDe: 'Hochwertige Waschmaschinen',
    image: '/images/Kategorien/waschmaschinen.jpg',
    sortOrder: 11,
    isActive: true,
  },
  {
    id: 'cat-trockner',
    slug: 'trockner',
    nameDe: 'Trockner',
    nameEn: 'Dryers',
    descriptionDe: 'Wäschetrockner für effizientes Trocknen',
    image: '/images/Kategorien/trockner.jpg',
    sortOrder: 12,
    isActive: true,
  },
  {
    id: 'cat-staubsauger',
    slug: 'staubsauger',
    nameDe: 'Staubsauger',
    nameEn: 'Vacuum Cleaners',
    descriptionDe: 'Leistungsstarke Staubsauger',
    image: '/images/Kategorien/staubsauger.jpg',
    sortOrder: 13,
    isActive: true,
  },
]

// Map pour accès rapide par slug
export const categoriesBySlug = new Map(categoriesConfig.map(c => [c.slug, c]))

// Ordre d'affichage
export const categorySlugs = categoriesConfig.map(c => c.slug)
