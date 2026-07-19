/**
 * NOVA INDUKT — Seed Batch : 15 Ersatzdeckel & Griffe
 * Exécuter avec : npx tsx prisma/seed-products-deckel-griffe.ts
 *
 * Catégories couvertes :
 *   - Deckel & Griffe (Prods 1–15)
 */

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Génère les images à partir du dossier public local */
function imgs(folder: string, files: string[]): { url: string; alt: string; sortOrder: number; isMain: boolean }[] {
  const base = `/images/products/${folder}`
  return files.map((file, i) => ({
    url: `${base}/${file}`,
    alt: folder,
    sortOrder: i,
    isMain: i === 0,
  }))
}

// ─── Données produits ─────────────────────────────────────────────────────────

const products = [
  // ══════════════════════════════════════════════════════════════
  // FISSLER OPC GLASDECKEL
  // ══════════════════════════════════════════════════════════════

  {
    slug: 'fissler-opc-deckel-20cm',
    supplierSku: 'FIS-OPC-D20',
    nameDe: 'Fissler OPC Glasdeckel 20 cm',
    shortDescription: 'Hochwertiger Glasdeckel für Fissler OPC Pfannen — Ø 20 cm',
    descriptionDe: `Der Fissler OPC Glasdeckel 20 cm ist der passende Ersatzdeckel für Fissler OPC Pfannen in der Größe 20 cm. Aus hochwertigem Glas mit Edelstahlrand gefertigt, ermöglicht er das Beobachten des Garvorgangs ohne Abheben des Deckels.

**Merkmale:**
- Hochwertiges Glas mit Edelstahlrand
- Passend für Fissler OPC Pfannen Ø 20 cm
- Dampfauslass für kontrolliertes Garen
- Spülmaschinengeeignet
- Robuste Verarbeitung
- Hergestellt in Deutschland

Der perfekte Ersatz oder Zusatz für Ihre Fissler OPC Sammlung.`,
    price: 29.99,
    oldPrice: 34.99,
    brand: 'Fissler',
    material: 'Glas + Edelstahl',
    dimensions: 'Ø 20 cm',
    dishwasherSafe: true,
    inductionSafe: true,
    vatRatePercent: 19,
    priceIncludesVat: true,
    weightKg: 0.5,
    badges: ['Passend für OPC 20cm'],
    rating: 4.5,
    reviewCount: 0,
    metaTitle: 'Fissler OPC Glasdeckel 20 cm — Ersatzdeckel | NOVA INDUKT',
    metaDescription: 'Fissler OPC Glasdeckel 20 cm — hochwertiger Ersatzdeckel für OPC Pfannen. Spülmaschinenfest, Made in Germany. Jetzt bei NOVA INDUKT.',
    categorySlug: 'deckel-griffe',
    folder: 'Fissler OPC Glasdeckel — 20 cm',
    imageFiles: ['1.png', '2.png', '3.png'],
  },

  {
    slug: 'fissler-opc-deckel-24cm',
    supplierSku: 'FIS-OPC-D24',
    nameDe: 'Fissler OPC Glasdeckel 24 cm',
    shortDescription: 'Hochwertiger Glasdeckel für Fissler OPC Pfannen — Ø 24 cm',
    descriptionDe: `Der Fissler OPC Glasdeckel 24 cm ist der passende Ersatzdeckel für Fissler OPC Pfannen in der Größe 24 cm. Aus hochwertigem Glas mit Edelstahlrand gefertigt, ermöglicht er das Beobachten des Garvorgangs ohne Abheben des Deckels.

**Merkmale:**
- Hochwertiges Glas mit Edelstahlrand
- Passend für Fissler OPC Pfannen Ø 24 cm
- Dampfauslass für kontrolliertes Garen
- Spülmaschinengeeignet
- Robuste Verarbeitung
- Hergestellt in Deutschland

Der perfekte Ersatz oder Zusatz für Ihre Fissler OPC Sammlung.`,
    price: 34.99,
    oldPrice: 39.99,
    brand: 'Fissler',
    material: 'Glas + Edelstahl',
    dimensions: 'Ø 24 cm',
    dishwasherSafe: true,
    inductionSafe: true,
    vatRatePercent: 19,
    priceIncludesVat: true,
    weightKg: 0.6,
    badges: ['Passend für OPC 24cm'],
    rating: 4.5,
    reviewCount: 0,
    metaTitle: 'Fissler OPC Glasdeckel 24 cm — Ersatzdeckel | NOVA INDUKT',
    metaDescription: 'Fissler OPC Glasdeckel 24 cm — hochwertiger Ersatzdeckel für OPC Pfannen. Spülmaschinenfest, Made in Germany. Jetzt bei NOVA INDUKT.',
    categorySlug: 'deckel-griffe',
    folder: 'Fissler OPC Glasdeckel — 24 cm',
    imageFiles: ['1.png', '2.png', '3.png'],
  },

  {
    slug: 'fissler-opc-deckel-28cm',
    supplierSku: 'FIS-OPC-D28',
    nameDe: 'Fissler OPC Glasdeckel 28 cm',
    shortDescription: 'Hochwertiger Glasdeckel für Fissler OPC Pfannen — Ø 28 cm',
    descriptionDe: `Der Fissler OPC Glasdeckel 28 cm ist der passende Ersatzdeckel für Fissler OPC Pfannen in der Größe 28 cm. Aus hochwertigem Glas mit Edelstahlrand gefertigt, ermöglicht er das Beobachten des Garvorgangs ohne Abheben des Deckels.

**Merkmale:**
- Hochwertiges Glas mit Edelstahlrand
- Passend für Fissler OPC Pfannen Ø 28 cm
- Dampfauslass für kontrolliertes Garen
- Spülmaschinengeeignet
- Robuste Verarbeitung
- Hergestellt in Deutschland

Der perfekte Ersatz oder Zusatz für Ihre Fissler OPC Sammlung.`,
    price: 39.99,
    oldPrice: 49.99,
    brand: 'Fissler',
    material: 'Glas + Edelstahl',
    dimensions: 'Ø 28 cm',
    dishwasherSafe: true,
    inductionSafe: true,
    vatRatePercent: 19,
    priceIncludesVat: true,
    weightKg: 0.7,
    badges: ['Passend für OPC 28cm'],
    rating: 4.5,
    reviewCount: 0,
    metaTitle: 'Fissler OPC Glasdeckel 28 cm — Ersatzdeckel | NOVA INDUKT',
    metaDescription: 'Fissler OPC Glasdeckel 28 cm — hochwertiger Ersatzdeckel für OPC Pfannen. Spülmaschinenfest, Made in Germany. Jetzt bei NOVA INDUKT.',
    categorySlug: 'deckel-griffe',
    folder: 'Fissler OPC Glasdeckel — 28 cm',
    imageFiles: ['1.png', '2.png', '3.png'],
  },

  {
    slug: 'fissler-opc-deckel-32cm',
    supplierSku: 'FIS-OPC-D32',
    nameDe: 'Fissler OPC Glasdeckel 32 cm',
    shortDescription: 'Hochwertiger Glasdeckel für Fissler OPC Pfannen — Ø 32 cm',
    descriptionDe: `Der Fissler OPC Glasdeckel 32 cm ist der passende Ersatzdeckel für Fissler OPC Pfannen in der Größe 32 cm. Aus hochwertigem Glas mit Edelstahlrand gefertigt, ermöglicht er das Beobachten des Garvorgangs ohne Abheben des Deckels.

**Merkmale:**
- Hochwertiges Glas mit Edelstahlrand
- Passend für Fissler OPC Pfannen Ø 32 cm
- Dampfauslass für kontrolliertes Garen
- Spülmaschinengeeignet
- Robuste Verarbeitung
- Hergestellt in Deutschland

Der perfekte Ersatz oder Zusatz für Ihre Fissler OPC Sammlung.`,
    price: 44.99,
    oldPrice: 54.99,
    brand: 'Fissler',
    material: 'Glas + Edelstahl',
    dimensions: 'Ø 32 cm',
    dishwasherSafe: true,
    inductionSafe: true,
    vatRatePercent: 19,
    priceIncludesVat: true,
    weightKg: 0.8,
    badges: ['Passend für OPC 32cm'],
    rating: 4.5,
    reviewCount: 0,
    metaTitle: 'Fissler OPC Glasdeckel 32 cm — Ersatzdeckel | NOVA INDUKT',
    metaDescription: 'Fissler OPC Glasdeckel 32 cm — hochwertiger Ersatzdeckel für OPC Pfannen. Spülmaschinenfest, Made in Germany. Jetzt bei NOVA INDUKT.',
    categorySlug: 'deckel-griffe',
    folder: 'Fissler OPC Glasdeckel — 32 cm',
    imageFiles: ['1.png', '2.png', '3.png'],
  },

  // ══════════════════════════════════════════════════════════════
  // WMF DIADEM PLUS GLASDECKEL
  // ══════════════════════════════════════════════════════════════

  {
    slug: 'wmf-diadem-plus-deckel-16cm',
    supplierSku: 'WMF-DP-D16',
    nameDe: 'WMF Diadem Plus Glasdeckel 16 cm',
    shortDescription: 'Hochwertiger Glasdeckel für WMF Diadem Plus — Ø 16 cm',
    descriptionDe: `Der WMF Diadem Plus Glasdeckel 16 cm ist der passende Ersatzdeckel für WMF Diadem Plus Pfannen und Töpfe in der Größe 16 cm. Aus hochwertigem Glas mit Edelstahlrand gefertigt, ermöglicht er das Beobachten des Garvorgangs.

**Merkmale:**
- Hochwertiges Glas mit Edelstahlrand
- Passend für WMF Diadem Plus Ø 16 cm
- Dampfauslass für kontrolliertes Garen
- Spülmaschinengeeignet
- Robuste Verarbeitung
- Hergestellt in Deutschland

Der perfekte Ersatz oder Zusatz für Ihre WMF Diadem Plus Sammlung.`,
    price: 24.99,
    oldPrice: 29.99,
    brand: 'WMF',
    material: 'Glas + Edelstahl',
    dimensions: 'Ø 16 cm',
    dishwasherSafe: true,
    inductionSafe: true,
    vatRatePercent: 19,
    priceIncludesVat: true,
    weightKg: 0.4,
    badges: ['Passend für Diadem Plus 16cm'],
    rating: 4.4,
    reviewCount: 0,
    metaTitle: 'WMF Diadem Plus Glasdeckel 16 cm — Ersatzdeckel | NOVA INDUKT',
    metaDescription: 'WMF Diadem Plus Glasdeckel 16 cm — hochwertiger Ersatzdeckel. Spülmaschinenfest, Made in Germany. Jetzt bei NOVA INDUKT.',
    categorySlug: 'deckel-griffe',
    folder: 'WMF Diadem Plus Glasdeckel — 16 cm',
    imageFiles: ['1.png', '2.png', '3.png'],
  },

  {
    slug: 'wmf-diadem-plus-deckel-20cm',
    supplierSku: 'WMF-DP-D20',
    nameDe: 'WMF Diadem Plus Glasdeckel 20 cm',
    shortDescription: 'Hochwertiger Glasdeckel für WMF Diadem Plus — Ø 20 cm',
    descriptionDe: `Der WMF Diadem Plus Glasdeckel 20 cm ist der passende Ersatzdeckel für WMF Diadem Plus Pfannen und Töpfe in der Größe 20 cm. Aus hochwertigem Glas mit Edelstahlrand gefertigt, ermöglicht er das Beobachten des Garvorgangs.

**Merkmale:**
- Hochwertiges Glas mit Edelstahlrand
- Passend für WMF Diadem Plus Ø 20 cm
- Dampfauslass für kontrolliertes Garen
- Spülmaschinengeeignet
- Robuste Verarbeitung
- Hergestellt in Deutschland

Der perfekte Ersatz oder Zusatz für Ihre WMF Diadem Plus Sammlung.`,
    price: 29.99,
    oldPrice: 34.99,
    brand: 'WMF',
    material: 'Glas + Edelstahl',
    dimensions: 'Ø 20 cm',
    dishwasherSafe: true,
    inductionSafe: true,
    vatRatePercent: 19,
    priceIncludesVat: true,
    weightKg: 0.5,
    badges: ['Passend für Diadem Plus 20cm'],
    rating: 4.4,
    reviewCount: 0,
    metaTitle: 'WMF Diadem Plus Glasdeckel 20 cm — Ersatzdeckel | NOVA INDUKT',
    metaDescription: 'WMF Diadem Plus Glasdeckel 20 cm — hochwertiger Ersatzdeckel. Spülmaschinenfest, Made in Germany. Jetzt bei NOVA INDUKT.',
    categorySlug: 'deckel-griffe',
    folder: 'WMF Diadem Plus Glasdeckel — 20 cm',
    imageFiles: ['1.png', '2.png', '3.png'],
  },

  {
    slug: 'wmf-diadem-plus-deckel-24cm',
    supplierSku: 'WMF-DP-D24',
    nameDe: 'WMF Diadem Plus Glasdeckel 24 cm',
    shortDescription: 'Hochwertiger Glasdeckel für WMF Diadem Plus — Ø 24 cm',
    descriptionDe: `Der WMF Diadem Plus Glasdeckel 24 cm ist der passende Ersatzdeckel für WMF Diadem Plus Pfannen und Töpfe in der Größe 24 cm. Aus hochwertigem Glas mit Edelstahlrand gefertigt, ermöglicht er das Beobachten des Garvorgangs.

**Merkmale:**
- Hochwertiges Glas mit Edelstahlrand
- Passend für WMF Diadem Plus Ø 24 cm
- Dampfauslass für kontrolliertes Garen
- Spülmaschinengeeignet
- Robuste Verarbeitung
- Hergestellt in Deutschland

Der perfekte Ersatz oder Zusatz für Ihre WMF Diadem Plus Sammlung.`,
    price: 34.99,
    oldPrice: 39.99,
    brand: 'WMF',
    material: 'Glas + Edelstahl',
    dimensions: 'Ø 24 cm',
    dishwasherSafe: true,
    inductionSafe: true,
    vatRatePercent: 19,
    priceIncludesVat: true,
    weightKg: 0.6,
    badges: ['Passend für Diadem Plus 24cm'],
    rating: 4.4,
    reviewCount: 0,
    metaTitle: 'WMF Diadem Plus Glasdeckel 24 cm — Ersatzdeckel | NOVA INDUKT',
    metaDescription: 'WMF Diadem Plus Glasdeckel 24 cm — hochwertiger Ersatzdeckel. Spülmaschinenfest, Made in Germany. Jetzt bei NOVA INDUKT.',
    categorySlug: 'deckel-griffe',
    folder: 'WMF Diadem Plus Glasdeckel — 24 cm',
    imageFiles: ['1.png', '2.png', '3.png'],
  },

  {
    slug: 'wmf-diadem-plus-deckel-28cm',
    supplierSku: 'WMF-DP-D28',
    nameDe: 'WMF Diadem Plus Glasdeckel 28 cm',
    shortDescription: 'Hochwertiger Glasdeckel für WMF Diadem Plus — Ø 28 cm',
    descriptionDe: `Der WMF Diadem Plus Glasdeckel 28 cm ist der passende Ersatzdeckel für WMF Diadem Plus Pfannen und Töpfe in der Größe 28 cm. Aus hochwertigem Glas mit Edelstahlrand gefertigt, ermöglicht er das Beobachten des Garvorgangs.

**Merkmale:**
- Hochwertiges Glas mit Edelstahlrand
- Passend für WMF Diadem Plus Ø 28 cm
- Dampfauslass für kontrolliertes Garen
- Spülmaschinengeeignet
- Robuste Verarbeitung
- Hergestellt in Deutschland

Der perfekte Ersatz oder Zusatz für Ihre WMF Diadem Plus Sammlung.`,
    price: 39.99,
    oldPrice: 49.99,
    brand: 'WMF',
    material: 'Glas + Edelstahl',
    dimensions: 'Ø 28 cm',
    dishwasherSafe: true,
    inductionSafe: true,
    vatRatePercent: 19,
    priceIncludesVat: true,
    weightKg: 0.7,
    badges: ['Passend für Diadem Plus 28cm'],
    rating: 4.4,
    reviewCount: 0,
    metaTitle: 'WMF Diadem Plus Glasdeckel 28 cm — Ersatzdeckel | NOVA INDUKT',
    metaDescription: 'WMF Diadem Plus Glasdeckel 28 cm — hochwertiger Ersatzdeckel. Spülmaschinenfest, Made in Germany. Jetzt bei NOVA INDUKT.',
    categorySlug: 'deckel-griffe',
    folder: 'WMF Diadem Plus Glasdeckel — 28 cm',
    imageFiles: ['1.png', '2.png', '3.png'],
  },

  // ══════════════════════════════════════════════════════════════
  // DEMEYERE ATLANTIS 7 GLASDECKEL
  // ══════════════════════════════════════════════════════════════

  {
    slug: 'demeyere-atlantis-7-deckel-24cm',
    supplierSku: 'DEM-ATL7-D24',
    nameDe: 'Demeyere Atlantis 7 Glasdeckel 24 cm',
    shortDescription: 'Premium-Glasdeckel für Demeyere Atlantis 7 — Ø 24 cm',
    descriptionDe: `Der Demeyere Atlantis 7 Glasdeckel 24 cm ist der passende Ersatzdeckel für Demeyere Atlantis 7 Pfannen und Töpfe in der Größe 24 cm. Aus hochwertigem Glas mit Edelstahlrand gefertigt und für höchste Ansprüche entwickelt.

**Merkmale:**
- Premium-Glas mit Edelstahlrand
- Passend für Demeyere Atlantis 7 Ø 24 cm
- Dampfauslass für kontrolliertes Garen
- Spülmaschinengeeignet
- Robuste Verarbeitung — made in Belgium
- Perfekte Passform

Der Premium-Ersatz für Ihre Demeyere Atlantis 7 Sammlung.`,
    price: 44.99,
    oldPrice: 54.99,
    brand: 'Demeyere',
    material: 'Glas + Edelstahl',
    dimensions: 'Ø 24 cm',
    dishwasherSafe: true,
    inductionSafe: true,
    vatRatePercent: 19,
    priceIncludesVat: true,
    weightKg: 0.6,
    badges: ['Passend für Atlantis 7 24cm'],
    rating: 4.6,
    reviewCount: 0,
    metaTitle: 'Demeyere Atlantis 7 Glasdeckel 24 cm — Premium | NOVA INDUKT',
    metaDescription: 'Demeyere Atlantis 7 Glasdeckel 24 cm — Premium-Ersatzdeckel. Spülmaschinenfest, made in Belgium. Jetzt bei NOVA INDUKT.',
    categorySlug: 'deckel-griffe',
    folder: 'Demeyere Atlantis 7 Glasdeckel — 24 cm',
    imageFiles: ['1.png', '2.png', '3.png'],
  },

  {
    slug: 'demeyere-atlantis-7-deckel-28cm',
    supplierSku: 'DEM-ATL7-D28',
    nameDe: 'Demeyere Atlantis 7 Glasdeckel 28 cm',
    shortDescription: 'Premium-Glasdeckel für Demeyere Atlantis 7 — Ø 28 cm',
    descriptionDe: `Der Demeyere Atlantis 7 Glasdeckel 28 cm ist der passende Ersatzdeckel für Demeyere Atlantis 7 Pfannen und Töpfe in der Größe 28 cm. Aus hochwertigem Glas mit Edelstahlrand gefertigt und für höchste Ansprüche entwickelt.

**Merkmale:**
- Premium-Glas mit Edelstahlrand
- Passend für Demeyere Atlantis 7 Ø 28 cm
- Dampfauslass für kontrolliertes Garen
- Spülmaschinengeeignet
- Robuste Verarbeitung — made in Belgium
- Perfekte Passform

Der Premium-Ersatz für Ihre Demeyere Atlantis 7 Sammlung.`,
    price: 49.99,
    oldPrice: 59.99,
    brand: 'Demeyere',
    material: 'Glas + Edelstahl',
    dimensions: 'Ø 28 cm',
    dishwasherSafe: true,
    inductionSafe: true,
    vatRatePercent: 19,
    priceIncludesVat: true,
    weightKg: 0.7,
    badges: ['Passend für Atlantis 7 28cm'],
    rating: 4.6,
    reviewCount: 0,
    metaTitle: 'Demeyere Atlantis 7 Glasdeckel 28 cm — Premium | NOVA INDUKT',
    metaDescription: 'Demeyere Atlantis 7 Glasdeckel 28 cm — Premium-Ersatzdeckel. Spülmaschinenfest, made in Belgium. Jetzt bei NOVA INDUKT.',
    categorySlug: 'deckel-griffe',
    folder: 'Demeyere Atlantis 7 Glasdeckel — 28 cm',
    imageFiles: ['1.png', '2.png', '3.png'],
  },

  // ══════════════════════════════════════════════════════════════
  // ZWILLING PLUS GLASDECKEL
  // ══════════════════════════════════════════════════════════════

  {
    slug: 'zwilling-plus-deckel-16cm',
    supplierSku: 'ZWI-P-D16',
    nameDe: 'Zwilling Plus Glasdeckel 16 cm',
    shortDescription: 'Hochwertiger Glasdeckel für Zwilling Plus — Ø 16 cm',
    descriptionDe: `Der Zwilling Plus Glasdeckel 16 cm ist der passende Ersatzdeckel für Zwilling Plus Pfannen und Töpfe in der Größe 16 cm. Aus hochwertigem Glas mit Edelstahlrand gefertigt, ermöglicht er das Beobachten des Garvorgangs.

**Merkmale:**
- Hochwertiges Glas mit Edelstahlrand
- Passend für Zwilling Plus Ø 16 cm
- Dampfauslass für kontrolliertes Garen
- Spülmaschinengeeignet
- Robuste Verarbeitung
- Hergestellt in Deutschland

Der perfekte Ersatz oder Zusatz für Ihre Zwilling Plus Sammlung.`,
    price: 22.99,
    oldPrice: 27.99,
    brand: 'Zwilling',
    material: 'Glas + Edelstahl',
    dimensions: 'Ø 16 cm',
    dishwasherSafe: true,
    inductionSafe: true,
    vatRatePercent: 19,
    priceIncludesVat: true,
    weightKg: 0.4,
    badges: ['Passend für Plus 16cm'],
    rating: 4.3,
    reviewCount: 0,
    metaTitle: 'Zwilling Plus Glasdeckel 16 cm — Ersatzdeckel | NOVA INDUKT',
    metaDescription: 'Zwilling Plus Glasdeckel 16 cm — hochwertiger Ersatzdeckel. Spülmaschinenfest, Made in Germany. Jetzt bei NOVA INDUKT.',
    categorySlug: 'deckel-griffe',
    folder: 'Zwilling Plus Glasdeckel — 16 cm',
    imageFiles: ['1.png', '2.png', '3.png'],
  },

  {
    slug: 'zwilling-plus-deckel-20cm',
    supplierSku: 'ZWI-P-D20',
    nameDe: 'Zwilling Plus Glasdeckel 20 cm',
    shortDescription: 'Hochwertiger Glasdeckel für Zwilling Plus — Ø 20 cm',
    descriptionDe: `Der Zwilling Plus Glasdeckel 20 cm ist der passende Ersatzdeckel für Zwilling Plus Pfannen und Töpfe in der Größe 20 cm. Aus hochwertigem Glas mit Edelstahlrand gefertigt, ermöglicht er das Beobachten des Garvorgangs.

**Merkmale:**
- Hochwertiges Glas mit Edelstahlrand
- Passend für Zwilling Plus Ø 20 cm
- Dampfauslass für kontrolliertes Garen
- Spülmaschinengeeignet
- Robuste Verarbeitung
- Hergestellt in Deutschland

Der perfekte Ersatz oder Zusatz für Ihre Zwilling Plus Sammlung.`,
    price: 27.99,
    oldPrice: 32.99,
    brand: 'Zwilling',
    material: 'Glas + Edelstahl',
    dimensions: 'Ø 20 cm',
    dishwasherSafe: true,
    inductionSafe: true,
    vatRatePercent: 19,
    priceIncludesVat: true,
    weightKg: 0.5,
    badges: ['Passend für Plus 20cm'],
    rating: 4.3,
    reviewCount: 0,
    metaTitle: 'Zwilling Plus Glasdeckel 20 cm — Ersatzdeckel | NOVA INDUKT',
    metaDescription: 'Zwilling Plus Glasdeckel 20 cm — hochwertiger Ersatzdeckel. Spülmaschinenfest, Made in Germany. Jetzt bei NOVA INDUKT.',
    categorySlug: 'deckel-griffe',
    folder: 'Zwilling Plus Glasdeckel — 20 cm',
    imageFiles: ['1.png', '2.png', '3.png'],
  },

  {
    slug: 'zwilling-plus-deckel-24cm',
    supplierSku: 'ZWI-P-D24',
    nameDe: 'Zwilling Plus Glasdeckel 24 cm',
    shortDescription: 'Hochwertiger Glasdeckel für Zwilling Plus — Ø 24 cm',
    descriptionDe: `Der Zwilling Plus Glasdeckel 24 cm ist der passende Ersatzdeckel für Zwilling Plus Pfannen und Töpfe in der Größe 24 cm. Aus hochwertigem Glas mit Edelstahlrand gefertigt, ermöglicht er das Beobachten des Garvorgangs.

**Merkmale:**
- Hochwertiges Glas mit Edelstahlrand
- Passend für Zwilling Plus Ø 24 cm
- Dampfauslass für kontrolliertes Garen
- Spülmaschinengeeignet
- Robuste Verarbeitung
- Hergestellt in Deutschland

Der perfekte Ersatz oder Zusatz für Ihre Zwilling Plus Sammlung.`,
    price: 32.99,
    oldPrice: 39.99,
    brand: 'Zwilling',
    material: 'Glas + Edelstahl',
    dimensions: 'Ø 24 cm',
    dishwasherSafe: true,
    inductionSafe: true,
    vatRatePercent: 19,
    priceIncludesVat: true,
    weightKg: 0.6,
    badges: ['Passend für Plus 24cm'],
    rating: 4.3,
    reviewCount: 0,
    metaTitle: 'Zwilling Plus Glasdeckel 24 cm — Ersatzdeckel | NOVA INDUKT',
    metaDescription: 'Zwilling Plus Glasdeckel 24 cm — hochwertiger Ersatzdeckel. Spülmaschinenfest, Made in Germany. Jetzt bei NOVA INDUKT.',
    categorySlug: 'deckel-griffe',
    folder: 'Zwilling Plus Glasdeckel — 24 cm',
    imageFiles: ['1.png', '2.png', '3.png'],
  },

  // ══════════════════════════════════════════════════════════════
  // ERSATZGRIFFE
  // ══════════════════════════════════════════════════════════════

  {
    slug: 'fissler-replacement-griff-set',
    supplierSku: 'FIS-OPC-GR',
    nameDe: 'Fissler Ersatzgriff-Set OPC',
    shortDescription: 'Original Fissler Ersatzgriffe — 2-teilig, Edelstahl',
    descriptionDe: `Das Fissler Ersatzgriff-Set OPC enthält zwei hochwertige Original-Griffe für Fissler OPC Pfannen. Aus robustem Edelstahl gefertigt, bieten sie sicheren Halt und lange Lebensdauer.

**Merkmale:**
- 2-teiliges Set — 2 Griffe
- Original Fissler Ersatzteile
- Hochwertiger Edelstahl — robust und langlebig
- Einfache Montage — werkzeuglos möglich
- Passend für diverse Fissler OPC Modelle
- Hergestellt in Deutschland

Die Original-Fissler-Ersatzgriffe — für sicheren Halt und lange Lebensdauer.`,
    price: 19.99,
    oldPrice: 24.99,
    brand: 'Fissler',
    material: 'Edelstahl',
    dimensions: '2-teilig',
    dishwasherSafe: true,
    inductionSafe: true,
    vatRatePercent: 19,
    priceIncludesVat: true,
    weightKg: 0.2,
    badges: ['Fissler Original'],
    rating: 4.2,
    reviewCount: 0,
    metaTitle: 'Fissler Ersatzgriff-Set OPC — Original Ersatzteile | NOVA INDUKT',
    metaDescription: 'Fissler Ersatzgriff-Set OPC — 2-teilig, Edelstahl, Made in Germany. Original Ersatzteile. Jetzt bei NOVA INDUKT.',
    categorySlug: 'deckel-griffe',
    folder: 'Fissler Ersatzgriff-Set OPC',
    imageFiles: ['1.png', '2.png'],
  },

  {
    slug: 'wmf-replacement-griff-set',
    supplierSku: 'WMF-PP-GR',
    nameDe: 'WMF Ersatzgriff-Set Profi Plus',
    shortDescription: 'Original WMF Ersatzgriffe — 2-teilig, Edelstahl',
    descriptionDe: `Das WMF Ersatzgriff-Set Profi Plus enthält zwei hochwertige Original-Griffe für WMF Profi Plus Pfannen. Aus robustem Edelstahl gefertigt, bieten sie sicheren Halt und lange Lebensdauer.

**Merkmale:**
- 2-teiliges Set — 2 Griffe
- Original WMF Ersatzteile
- Hochwertiger Edelstahl — robust und langlebig
- Einfache Montage
- Passend für diverse WMF Profi Plus Modelle
- Hergestellt in Deutschland

Die Original-WMF-Ersatzgriffe — für sicheren Halt und lange Lebensdauer.`,
    price: 17.99,
    oldPrice: 22.99,
    brand: 'WMF',
    material: 'Edelstahl',
    dimensions: '2-teilig',
    dishwasherSafe: true,
    inductionSafe: true,
    vatRatePercent: 19,
    priceIncludesVat: true,
    weightKg: 0.18,
    badges: ['WMF Original'],
    rating: 4.2,
    reviewCount: 0,
    metaTitle: 'WMF Ersatzgriff-Set Profi Plus — Original Ersatzteile | NOVA INDUKT',
    metaDescription: 'WMF Ersatzgriff-Set Profi Plus — 2-teilig, Edelstahl, Made in Germany. Original Ersatzteile. Jetzt bei NOVA INDUKT.',
    categorySlug: 'deckel-griffe',
    folder: 'WMF Ersatzgriff-Set Profi Plus',
    imageFiles: ['1.png', '2.png'],
  },
]

// ─── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  console.log('🌱 NOVA INDUKT — Seed Batch : Ersatzdeckel & Griffe (15 Produkte)')
  console.log('─'.repeat(60))

  // Récupérer les catégories existantes
  const categories = await prisma.category.findMany()
  const categoryMap = new Map(categories.map((c) => [c.slug, c.id]))

  console.log(`📁 Catégories disponibles : ${categories.map((c) => c.slug).join(', ')}\n`)

  let created = 0
  let updated = 0
  let errors = 0

  for (const p of products) {
    const categoryId = categoryMap.get(p.categorySlug)
    if (!categoryId) {
      console.error(`  ❌ Catégorie introuvable : ${p.categorySlug} pour ${p.nameDe}`)
      errors++
      continue
    }

    const imageData = imgs(p.folder, p.imageFiles)

    try {
      const existing = await prisma.product.findUnique({ where: { slug: p.slug } })

      if (existing) {
        // Mise à jour
        await prisma.product.update({
          where: { slug: p.slug },
          data: {
            nameDe: p.nameDe,
            shortDescription: p.shortDescription,
            descriptionDe: p.descriptionDe,
            price: p.price,
            oldPrice: p.oldPrice ?? null,
            brand: p.brand,
            material: p.material,
            dimensions: p.dimensions,
            weightKg: p.weightKg ?? null,
            dishwasherSafe: p.dishwasherSafe,
            inductionSafe: p.inductionSafe,
            badges: p.badges,
            rating: p.rating,
            metaTitle: p.metaTitle,
            metaDescription: p.metaDescription,
            categoryId,
            isActive: true,
          },
        })

        // Mettre à jour les images
        await prisma.productImage.deleteMany({ where: { productId: existing.id } })
        await prisma.productImage.createMany({
          data: imageData.map((img) => ({ ...img, productId: existing.id })),
        })

        updated++
        console.log(`  ↻  [${updated + created}/${products.length}] MIS À JOUR : ${p.nameDe.substring(0, 55)}`)
      } else {
        // Création
        await prisma.product.create({
          data: {
            slug: p.slug,
            supplierSku: p.supplierSku,
            nameDe: p.nameDe,
            shortDescription: p.shortDescription,
            descriptionDe: p.descriptionDe,
            price: p.price,
            oldPrice: p.oldPrice ?? null,
            brand: p.brand,
            material: p.material,
            dimensions: p.dimensions,
            weightKg: p.weightKg ?? null,
            dishwasherSafe: p.dishwasherSafe,
            inductionSafe: p.inductionSafe,
            vatRatePercent: p.vatRatePercent,
            priceIncludesVat: p.priceIncludesVat,
            badges: p.badges,
            rating: p.rating,
            reviewCount: p.reviewCount,
            metaTitle: p.metaTitle,
            metaDescription: p.metaDescription,
            categoryId,
            isActive: true,
            images: {
              create: imageData,
            },
          },
        })

        created++
        console.log(`  ✓  [${updated + created}/${products.length}] CRÉÉ : ${p.nameDe.substring(0, 55)}`)
      }
    } catch (err: unknown) {
      errors++
      const msg = err instanceof Error ? err.message : String(err)
      console.error(`  ✗  ERREUR : ${p.nameDe.substring(0, 40)} — ${msg}`)
    }
  }

  console.log('\n' + '═'.repeat(60))
  console.log('📊 RÉSUMÉ')
  console.log('═'.repeat(60))
  console.log(`  ✅ Créés    : ${created}`)
  console.log(`  ↻  Mis à jour : ${updated}`)
  console.log(`  ❌ Erreurs  : ${errors}`)
  console.log('═'.repeat(60))

  if (errors === 0) {
    console.log('\n🎉 Batch terminé avec succès !')
  } else {
    console.log(`\n⚠️  ${errors} erreur(s) — vérifiez les logs ci-dessus.`)
    process.exit(1)
  }
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
