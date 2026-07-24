/**
 * Active NOVA INDUKT categories configuration
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
  {
    id: 'cat-messer',
    slug: 'messer',
    nameDe: 'Kochmesser & Messerblocks',
    descriptionDe: 'Hochwertige Küchenmesser, Messerblöcke und Schärfwerkzeuge von Top-Marken',
    image: '/images/Kategorien/messer.svg',
    sortOrder: 6,
    isActive: true,
  },
  {
    id: 'cat-ustensiles',
    slug: 'ustensiles',
    nameDe: 'Küchenutensilien',
    descriptionDe: 'Kochlöffel, Schöpfkellen, Zangen undurtheres Kochbesteck für die Induktionsküche',
    image: '/images/Kategorien/ustensiles.svg',
    sortOrder: 7,
    isActive: true,
  },
  {
    id: 'cat-sauteusen',
    slug: 'sauteusen',
    nameDe: 'Sauteusen',
    descriptionDe: 'High-End Sauteusen aus Edelstahl und Gusseisen für professionelles Garen auf Induktion',
    image: '/images/Kategorien/sauteusen.svg',
    sortOrder: 8,
    isActive: true,
  },
  {
    id: 'cat-crepe-pfannen',
    slug: 'crepe-pfannen',
    nameDe: 'Crêpe-Pfannen',
    descriptionDe: 'Professionelle Crêpe- und Pfannkuchenpfannen für perfekte Crêpes auf Induktion',
    image: '/images/Kategorien/crepe-pfannen.svg',
    sortOrder: 9,
    isActive: true,
  },
  {
    id: 'cat-schnellkochtopfe',
    slug: 'schnellkochtopfe',
    nameDe: 'Schnellkochtöpfe',
    descriptionDe: 'Druckkochtöpfe und Schnellkochtopf-Systeme für schnelles, energieeffizientes Kochen',
    image: '/images/Kategorien/schnellkochtopfe.svg',
    sortOrder: 10,
    isActive: true,
  },
  {
    id: 'cat-formes-de-cuisson',
    slug: 'formes-de-cuisson',
    nameDe: 'Backformen & Auflaufformen',
    descriptionDe: 'Hochwertige Backformen, Auflaufformen und Bräter aus Gusseisen und Edelstahl',
    image: '/images/Kategorien/formes-de-cuisson.svg',
    sortOrder: 11,
    isActive: true,
  },
  {
    id: 'cat-fondues-raclette',
    slug: 'fondues-raclette',
    nameDe: 'Fondues & Raclette',
    descriptionDe: 'Fonduesets, Raclette-Pfannen und Zubehör für gemütliche Abende zu Hause',
    image: '/images/Kategorien/fondues-raclette.svg',
    sortOrder: 12,
    isActive: true,
  },
  {
    id: 'cat-deckel-griffe',
    slug: 'deckel-griffe',
    nameDe: 'Ersatzdeckel & Griffe',
    descriptionDe: 'Passende Ersatzdeckel und Griffe für Kochgeschirr-Serien von WMF, Fissler und Zwilling',
    image: '/images/Kategorien/deckel-griffe.svg',
    sortOrder: 13,
    isActive: true,
  },
  {
    id: 'cat-pfannenschoner-topfregale',
    slug: 'pfannenschoner-topfregale',
    nameDe: 'Pfannenschoner & Topfregale',
    descriptionDe: 'Schutzfolien, Stapelhilfen und Organizer für Ihre Kochgeschirrsammlung',
    image: '/images/Kategorien/pfannenschoner-topfregale.svg',
    sortOrder: 14,
    isActive: true,
  },
  {
    id: 'cat-elektrogeraete',
    slug: 'elektrogeraete',
    nameDe: 'Elektro-Küchengeräte',
    descriptionDe: 'Handmixer, Standmixer, Stabmixer und weitere Elektro-Küchengeräte für moderne Küchen',
    image: '/images/Kategorien/elektrogeraete.svg',
    sortOrder: 15,
    isActive: true,
  },
  {
    id: 'cat-bestecke',
    slug: 'bestecke',
    nameDe: 'Bestecke & Messerbestecke',
    descriptionDe: 'Elegante Bestecksets, Messerbestecke und Einzelteile aus Edelstahl',
    image: '/images/Kategorien/bestecke.svg',
    sortOrder: 16,
    isActive: true,
  },
  {
    id: 'cat-reinigung-pflege',
    slug: 'reinigung-pflege',
    nameDe: 'Reinigung & Pflege',
    descriptionDe: 'Reinigungsmittel, Pflegeöle und Zubehör für Kochgeschirr und Küchengeräte',
    image: '/images/Kategorien/reinigung-pflege.svg',
    sortOrder: 17,
    isActive: true,
  },
]

// Map pour accès rapide par slug
export const categoriesBySlug = new Map(categoriesConfig.map(c => [c.slug, c]))

// Ordre d'affichage
export const categorySlugs = categoriesConfig.map(c => c.slug)
