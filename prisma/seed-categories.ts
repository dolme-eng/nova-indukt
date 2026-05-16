/**
 * Script de seed des 5 catégories NOVA INDUKT
 * Exécuter avec: npx tsx prisma/seed-categories.ts
 */

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Les 5 catégories principales
const categories = [
  {
    slug: 'kochen-braten',
    nameDe: 'Kochen & Braten',
    descriptionDe: 'Premium Töpfe, Pfannen, Bräter und Kochgeschirr für Induktion',
    image: '/images/Kategorien/kochen-braten.webp',
    sortOrder: 1,
  },
  {
    slug: 'messer-vorbereitung',
    nameDe: 'Messer & Vorbereitung',
    descriptionDe: 'Präzisionsmesser, Schneidebretter und Werkzeuge für die perfekte Zubereitung',
    image: '/images/Kategorien/vorbereitung.webp',
    sortOrder: 2,
  },
  {
    slug: 'kuechenhelfer-zubehoer',
    nameDe: 'Küchenhelfer & Zubehör',
    descriptionDe: 'Nützliche Helfer, Küchengeräte und praktisches Zubehör für die Küche',
    image: '/images/Kategorien/kuechenzubehoer.webp',
    sortOrder: 3,
  },
]

async function main() {
  console.log('🌱 Migration vers 5 catégories NOVA INDUKT...')
  console.log('')

  // Récupérer les anciennes catégories pour mapping
  const oldCategories = await prisma.category.findMany()
  console.log(`📊 ${oldCategories.length} catégories existantes trouvées`)

  // Mapping des anciennes catégories vers les 5 nouvelles catégories
  const categoryMapping: Record<string, string> = {
    'kochen': 'kochen-braten',
    'kochen-braten': 'kochen-braten',
    'zubehoer': 'kuechenhelfer-zubehoer',
    'kuechenzubehoer': 'kuechenhelfer-zubehoer',
    'vorbereitung': 'messer-vorbereitung',
    'messer-vorbereitung': 'messer-vorbereitung',
    'tischaccessoires': 'tisch-servieren',
    'tisch-servier': 'tisch-servieren',
    'tisch-servieren': 'tisch-servieren',
    'spezial': 'kuechenhelfer-zubehoer',
    'sets': 'kochen-braten',
    'herde': 'kochen-braten',
    'kuehlschraenke': 'kuechenhelfer-zubehoer',
    'geschirrspueler': 'kuechenhelfer-zubehoer',
    'kuechenmaschinen': 'backen-patisserie',
    'waschmaschinen': 'kuechenhelfer-zubehoer',
    'trockner': 'kuechenhelfer-zubehoer',
    'staubsauger': 'kuechenhelfer-zubehoer',
    'backen': 'backen-patisserie',
    'backen-patisserie': 'backen-patisserie',
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
  
  const obsoleteSlugs = ['zubehoer', 'tischaccessoires', 'kochen', 'vorbereitung', 'kuechenzubehoer', 
    'tisch-servier', 'spezial', 'sets', 'herde', 'kuehlschraenke', 'geschirrspueler', 
    'kuechenmaschinen', 'waschmaschinen', 'trockner', 'staubsauger']
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
