/**
 * Script de migration des 13 catégories harmonisées
 * Exécuter avec: npx tsx prisma/seed-categories.ts
 */

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Les 13 catégories harmonisées avec leurs images
const categories = [
  {
    slug: 'kochen-braten',
    nameDe: 'Kochen & Braten',
    nameEn: 'Cooking & Frying',
    descriptionDe: 'Premium Töpfe, Pfannen und Kochgeschirr für Induktion',
    image: '/images/Kategorien/kochen-braten.webp',
    sortOrder: 1,
  },
  {
    slug: 'vorbereitung',
    nameDe: 'Vorbereitung',
    nameEn: 'Preparation',
    descriptionDe: 'Schneidebretter, Messer und Küchenhelfer für die Zubereitung',
    image: '/images/Kategorien/vorbereitung.webp',
    sortOrder: 2,
  },
  {
    slug: 'kuechenzubehoer',
    nameDe: 'Küchenzubehör',
    nameEn: 'Kitchen Accessories',
    descriptionDe: 'Praktisches Zubehör für die moderne Küche',
    image: '/images/Kategorien/kuechenzubehoer.webp',
    sortOrder: 3,
  },
  {
    slug: 'tisch-servier',
    nameDe: 'Tisch & Servier',
    nameEn: 'Table & Serving',
    descriptionDe: 'Elegantes Geschirr und Servieraccessoires',
    image: '/images/Kategorien/tisch-servier.webp',
    sortOrder: 4,
  },
  {
    slug: 'spezial',
    nameDe: 'Spezial',
    nameEn: 'Special',
    descriptionDe: 'Besondere Produkte und Spezialartikel',
    image: '/images/Kategorien/spezial.jpg',
    sortOrder: 5,
  },
  {
    slug: 'sets',
    nameDe: 'Sets',
    nameEn: 'Sets',
    descriptionDe: 'Vorteilhafte Produktsets und Kombinationen',
    image: '/images/Kategorien/sets.jpg',
    sortOrder: 6,
  },
  {
    slug: 'herde',
    nameDe: 'Herde',
    nameEn: 'Stoves & Ovens',
    descriptionDe: 'Hochwertige Herde und Kochfelder',
    image: '/images/Kategorien/herde.jpg',
    sortOrder: 7,
  },
  {
    slug: 'kuehlschraenke',
    nameDe: 'Kühlschränke',
    nameEn: 'Refrigerators',
    descriptionDe: 'Kühl- und Gefriergeräte für die Küche',
    image: '/images/Kategorien/kuehlschraenke.jpg',
    sortOrder: 8,
  },
  {
    slug: 'geschirrspueler',
    nameDe: 'Geschirrspüler',
    nameEn: 'Dishwashers',
    descriptionDe: 'Effiziente Geschirrspülmaschinen',
    image: '/images/Kategorien/geschirrspueler.jpg',
    sortOrder: 9,
  },
  {
    slug: 'kuechenmaschinen',
    nameDe: 'Küchenmaschinen',
    nameEn: 'Kitchen Machines',
    descriptionDe: 'Küchenmaschinen und Food Processor',
    image: '/images/Kategorien/kuechenmaschinen.jpg',
    sortOrder: 10,
  },
  {
    slug: 'waschmaschinen',
    nameDe: 'Waschmaschinen',
    nameEn: 'Washing Machines',
    descriptionDe: 'Hochwertige Waschmaschinen',
    image: '/images/Kategorien/waschmaschinen.jpg',
    sortOrder: 11,
  },
  {
    slug: 'trockner',
    nameDe: 'Trockner',
    nameEn: 'Dryers',
    descriptionDe: 'Wäschetrockner für effizientes Trocknen',
    image: '/images/Kategorien/trockner.jpg',
    sortOrder: 12,
  },
  {
    slug: 'staubsauger',
    nameDe: 'Staubsauger',
    nameEn: 'Vacuum Cleaners',
    descriptionDe: 'Leistungsstarke Staubsauger',
    image: '/images/Kategorien/staubsauger.jpg',
    sortOrder: 13,
  },
]

async function main() {
  console.log('🌱 Migration des 13 catégories...')
  console.log('')

  // Récupérer les anciennes catégories pour mapping
  const oldCategories = await prisma.category.findMany()
  console.log(`📊 ${oldCategories.length} catégories existantes trouvées`)

  // Mapping des anciennes catégories vers les nouvelles
  const categoryMapping: Record<string, string> = {
    'kochen': 'kochen-braten',
    'zubehoer': 'kuechenzubehoer',
    'vorbereitung': 'vorbereitung',
    'tischaccessoires': 'tisch-servier',
    'spezial': 'spezial',
    'sets': 'sets',
  }

  // Mettre à jour les produits avec les nouvelles catégories
  for (const oldCat of oldCategories) {
    const newSlug = categoryMapping[oldCat.slug]
    if (newSlug && newSlug !== oldCat.slug) {
      // Trouver la nouvelle catégorie
      const newCat = categories.find(c => c.slug === newSlug)
      if (newCat) {
        // Créer la nouvelle catégorie si elle n'existe pas
        const existing = await prisma.category.findUnique({
          where: { slug: newSlug }
        })
        
        if (!existing) {
          const created = await prisma.category.create({
            data: {
              slug: newCat.slug,
              nameDe: newCat.nameDe,
              nameEn: newCat.nameEn,
              description: newCat.descriptionDe,
              image: newCat.image,
              sortOrder: newCat.sortOrder,
              isActive: true,
            }
          })
          console.log(`✅ Catégorie créée: ${created.nameDe}`)
        }

        // Mettre à jour les produits
        const updated = await prisma.product.updateMany({
          where: { categoryId: oldCat.id },
          data: { 
            categoryId: existing?.id || (await prisma.category.findUnique({ where: { slug: newSlug } }))?.id 
          }
        })
        console.log(`   🔄 ${updated.count} produits migrés de ${oldCat.slug} → ${newSlug}`)
      }
    }
  }

  // Créer les nouvelles catégories qui n'existent pas encore
  console.log('')
  console.log('📁 Création des nouvelles catégories...')
  
  for (const cat of categories) {
    const existing = await prisma.category.findUnique({
      where: { slug: cat.slug }
    })

    if (!existing) {
      const created = await prisma.category.create({
        data: {
          slug: cat.slug,
          nameDe: cat.nameDe,
          nameEn: cat.nameEn,
          description: cat.descriptionDe,
          image: cat.image,
          sortOrder: cat.sortOrder,
          isActive: true,
        }
      })
      console.log(`✅ ${created.nameDe} (ordre: ${created.sortOrder})`)
    } else {
      // Mettre à jour les informations
      const updated = await prisma.category.update({
        where: { slug: cat.slug },
        data: {
          nameDe: cat.nameDe,
          nameEn: cat.nameEn,
          description: cat.descriptionDe,
          image: cat.image,
          sortOrder: cat.sortOrder,
          isActive: true,
        }
      })
      console.log(`🔄 ${updated.nameDe} mise à jour`)
    }
  }

  // Désactiver les anciennes catégories obsolètes
  console.log('')
  console.log('🗑️  Désactivation des anciennes catégories obsolètes...')
  
  const obsoleteSlugs = ['zubehoer', 'tischaccessoires', 'kochen']
  for (const slug of obsoleteSlugs) {
    const cat = await prisma.category.findUnique({ where: { slug } })
    if (cat) {
      // Vérifier s'il reste des produits
      const productCount = await prisma.product.count({
        where: { categoryId: cat.id }
      })
      
      if (productCount === 0) {
        await prisma.category.delete({ where: { slug } })
        console.log(`🗑️  ${slug} supprimée (aucun produit)`)
      } else {
        await prisma.category.update({
          where: { slug },
          data: { isActive: false }
        })
        console.log(`⚠️  ${slug} désactivée (${productCount} produits encore associés)`)
      }
    }
  }

  console.log('')
  console.log('🎉 Migration terminée !')
  
  // Afficher le résumé
  const finalCategories = await prisma.category.findMany({
    orderBy: { sortOrder: 'asc' }
  })
  console.log('')
  console.log(`📊 ${finalCategories.length} catégories dans la base:`)
  for (const cat of finalCategories) {
    const productCount = await prisma.product.count({
      where: { categoryId: cat.id }
    })
    const status = cat.isActive ? '✅' : '⚠️'
    console.log(`   ${status} ${cat.nameDe} (${cat.slug}) - ${productCount} produits`)
  }
}

main()
  .catch((e) => {
    console.error('❌ Erreur:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
