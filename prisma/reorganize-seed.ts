import { PrismaClient, Prisma } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database reorganization...')

  // 1. Définir la nouvelle structure de catégories
  const categoryStructure = [
    {
      slug: 'kochen-braten',
      nameDe: 'Kochen & Braten',
      nameEn: 'Cooking & Roasting',
      image: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?fm=jpg&q=80&w=900',
      description: 'Hochwertige Töpfe, Pfannen und Bräter für Induktion.',
      sortOrder: 1
    },
    {
      slug: 'messer-vorbereitung',
      nameDe: 'Messer & Vorbereitung',
      nameEn: 'Knives & Preparation',
      image: 'https://images.unsplash.com/photo-1556911220-bff31c812dba?fm=jpg&q=80&w=900',
      description: 'Präzisionsmesser und Werkzeuge für die perfekte Vorbereitung.',
      sortOrder: 2
    },
    {
      slug: 'backen-patisserie',
      nameDe: 'Backen & Patisserie',
      nameEn: 'Baking & Pastry',
      image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?fm=jpg&q=80&w=900',
      description: 'Profi-Backformen und Zubehör für Ihre Backstube.',
      sortOrder: 3
    },
    {
      slug: 'kuechenhelfer-zubehoer',
      nameDe: 'Küchenhelfer & Zubehör',
      nameEn: 'Kitchen Helpers & Accessories',
      image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?fm=jpg&q=80&w=900',
      description: 'Nützliche Helfer für den täglichen Einsatz in der Küche.',
      sortOrder: 4
    },
    {
      slug: 'tisch-servieren',
      nameDe: 'Tisch & Servieren',
      nameEn: 'Table & Serving',
      image: 'https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?fm=jpg&q=80&w=900',
      description: 'Elegantes Geschirr und Accessoires für eine schöne Tafel.',
      sortOrder: 5
    }
  ]

  console.log('\n🏷️  Reorganizing categories...')
  const categoryMap = new Map<string, string>()

  for (const cat of categoryStructure) {
    const category = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {
        nameDe: cat.nameDe,
        nameEn: cat.nameEn,
        description: cat.description,
        image: cat.image,
        sortOrder: cat.sortOrder,
        isActive: true,
      },
      create: {
        slug: cat.slug,
        nameDe: cat.nameDe,
        nameEn: cat.nameEn,
        description: cat.description,
        image: cat.image,
        sortOrder: cat.sortOrder,
        isActive: true,
      },
    })
    categoryMap.set(cat.slug, category.id)
    console.log(`  ✓ Category: ${cat.nameDe}`)
  }

  // 2. Définir les produits avec la nouvelle organisation
  const productsToSeed = [
    // Kochen & Braten
    {
      slug: 'premium-induktions-topfset-5-teilig',
      nameDe: 'Premium Induktions-Topfset 5-teilig – Edelstahl 18/10',
      price: 249.90,
      oldPrice: 329.00,
      categorySlug: 'kochen-braten',
      descriptionDe: 'Unser Flaggschiff-Set für anspruchsvolle Köche. Gefertigt aus hochwertigem Edelstahl 18/10 mit einem spezialisierten 3-Schicht-Kapselboden für optimale Wärmeverteilung auf Induktionskochfeldern.',
      shortDescription: '5-teiliges Profi-Set aus Edelstahl 18/10.',
      stock: 45,
      badges: ['premium', 'bestseller'],
      material: 'Edelstahl 18/10',
      dimensions: '16cm, 20cm, 24cm',
      dishwasherSafe: true,
      inductionSafe: true,
      brand: 'NOVA Pro',
      images: [
        '/images/products/Premium-Topfset-5-teilig/premium-topfset1.jpg',
        '/images/products/Premium-Topfset-5-teilig/premium-topfset2.jpg'
      ]
    },
    {
      slug: 'profi-gusseisen-braeter-28cm',
      nameDe: 'Profi Gusseisen-Bräter 28cm – Emailliert',
      price: 129.00,
      oldPrice: 159.00,
      categorySlug: 'kochen-braten',
      descriptionDe: 'Der Klassiker für Schmorgerichte. Exzellente Hitzespeicherung und gleichmäßige Wärmeabgabe. Die hochwertige Emaillierung macht ihn besonders pflegeleicht.',
      shortDescription: 'Schwerer Gusseisen-Bräter für perfekte Schmorgerichte.',
      stock: 20,
      badges: ['premium'],
      material: 'Gusseisen emailliert',
      dimensions: '28cm Durchmesser',
      dishwasherSafe: false,
      inductionSafe: true,
      brand: 'NOVA Iron',
      images: [
        'https://images.unsplash.com/photo-1594759842811-999a1e80c5d5?fm=jpg&q=80&w=900'
      ]
    },
    {
      slug: 'induktions-bratpfanne-28cm-keramik',
      nameDe: 'Induktions-Bratpfanne 28 cm – Keramikbeschichtung',
      price: 59.90,
      oldPrice: 79.90,
      categorySlug: 'kochen-braten',
      descriptionDe: 'Extrem kratzfeste Keramikbeschichtung für fettarmes Braten. Die Pfanne ist frei von PFOA und PTFE et offre une excellente conductivité thermique.',
      shortDescription: 'Keramikbeschichtete Pfanne für gesundes Kochen.',
      stock: 60,
      badges: ['new'],
      material: 'Aluminium mit Keramikbeschichtung',
      dimensions: '28cm Durchmesser',
      dishwasherSafe: true,
      inductionSafe: true,
      brand: 'NOVA Ceramic',
      images: [
        'https://images.unsplash.com/photo-1566197777482-11dd0306282c?fm=jpg&q=80&w=900'
      ]
    },
    // Messer & Vorbereitung
    {
      slug: 'damast-kochmesser-20cm-pro',
      nameDe: 'Damast-Kochmesser 20cm – 67 Lagen Profi-Stahl',
      price: 149.00,
      oldPrice: 199.00,
      categorySlug: 'messer-vorbereitung',
      descriptionDe: 'Ein Meisterwerk der Schmiedekunst. 67 Lagen Damaststahl sorgen für extreme Schärfe und Schnitthaltigkeit. Der ergonomische Griff aus Pakkaholz liegt perfekt in der Hand.',
      shortDescription: 'Hochpräzises Damastmesser für Profis.',
      stock: 15,
      badges: ['premium', 'bestseller'],
      material: 'Damaststahl VG-10',
      dimensions: '20cm Klinge',
      dishwasherSafe: false,
      inductionSafe: false,
      brand: 'NOVA Sharp',
      images: [
        'https://images.unsplash.com/photo-1593618998160-e34014e67546?fm=jpg&q=80&w=900'
      ]
    },
    {
      slug: 'profi-schneidebrett-akazie-xl',
      nameDe: 'Profi-Schneidebrett Akazie XL – Stirnholz',
      price: 79.00,
      categorySlug: 'messer-vorbereitung',
      descriptionDe: 'Messerschonend und extrem robust. Dieses Stirnholz-Schneidebrett aus Akazie ist ein echter Blickfang in jeder Küche et bietet eine stabile Arbeitsfläche.',
      shortDescription: 'Massives Stirnholz-Brett aus nachhaltiger Akazie.',
      stock: 25,
      badges: ['new'],
      material: 'Akazienholz',
      dimensions: '45cm x 30cm x 4cm',
      dishwasherSafe: false,
      inductionSafe: false,
      brand: 'NOVA Wood',
      images: [
        'https://images.unsplash.com/photo-1614354226998-ef22a08f5127?fm=jpg&q=80&w=900'
      ]
    },
    // Backen & Patisserie
    {
      slug: 'profi-pizza-set-4-teilig',
      nameDe: 'Profi-Pizza Set 4-teilig – Stein & Zubehör',
      price: 69.90,
      oldPrice: 89.90,
      categorySlug: 'backen-patisserie',
      descriptionDe: 'Alles was Sie für die perfekte Pizza benötigen. Der Pizzastein aus Cordierit speichert die Hitze optimal für einen knusprigen Boden wie beim Italiener.',
      shortDescription: 'Komplettset für authentische Pizza zu Hause.',
      stock: 35,
      badges: ['bestseller'],
      material: 'Cordierit, Edelstahl, Holz',
      dimensions: 'Stein 38cm x 30cm',
      dishwasherSafe: false,
      inductionSafe: false,
      brand: 'NOVA Bake',
      images: [
        'https://images.unsplash.com/photo-1574071318508-1cdbad80ad50?fm=jpg&q=80&w=900'
      ]
    },
    // Küchenhelfer & Zubehör
    {
      slug: 'silikon-kuechenhelfer-set-10-teilig',
      nameDe: 'Silikon-Küchenhelfer Set 10-teilig – Hitzebeständig',
      price: 45.00,
      categorySlug: 'kuechenhelfer-zubehoer',
      descriptionDe: 'Schont Ihr hochwertiges Kochgeschirr. Hitzebeständig bis 230°C et lebensmittelecht. Der Kern aus Edelstahl sorgt für die nötige Stabilität.',
      shortDescription: 'Umfangreiches Set für alle Kochvorgänge.',
      stock: 80,
      badges: ['new'],
      material: 'Silikon, Edelstahlkern',
      dimensions: 'Diverse Längen',
      dishwasherSafe: true,
      inductionSafe: false,
      brand: 'NOVA Helper',
      images: [
        'https://images.unsplash.com/photo-1591261730799-ee4e6c2d16d7?fm=jpg&q=80&w=900'
      ]
    },
    // Messer Premium - Global
    {
      slug: 'global-g-2-kochmesser-20cm',
      nameDe: 'Global G-2 Kochmesser 20 cm',
      price: 189.00,
      oldPrice: 229.00,
      categorySlug: 'messer-vorbereitung',
      descriptionDe: 'Das legendäre Global G-2 Kochmesser mit 20 cm Klinge. Aus einem Stück Chrom-Molybdän-Vanadium-Stahl geschmiedet. Der ikonische Griff mit Kullenschliff sorgt für perfekte Balance und ergonomisches Halten.',
      shortDescription: 'Das legendäre japanische Kochmesser mit 20 cm Klinge.',
      stock: 15,
      badges: ['premium', 'bestseller'],
      material: 'Chrom-Molybdän-Vanadium-Stahl',
      dimensions: '20 cm Klinge',
      dishwasherSafe: false,
      inductionSafe: false,
      brand: 'Global',
      images: [
        '/images/products/Global G-2 Kochmesser 20 cm/global-g2-1.jpg'
      ]
    },
    // Rösle Küchenhelfer
    {
      slug: 'roesle-silicone-kuechenhelfer-set-5-teilig',
      nameDe: 'Rösle Silicone Küchenhelfer Set 5-teilig',
      price: 79.90,
      oldPrice: 99.90,
      categorySlug: 'kuechenhelfer-zubehoer',
      descriptionDe: 'Premium Küchenhelfer von Rösle aus hochwertigem Silikon. Hitzebeständig bis 230°C, lebensmittelecht und spülmaschinengeeignet. Das 5-teilige Set enthält alle wichtigen Utensilien für den täglichen Gebrauch.',
      shortDescription: 'Premium Silikon-Küchenhelfer Set von Rösle.',
      stock: 30,
      badges: ['premium', 'new'],
      material: 'Silikon, Edelstahlkern',
      dimensions: 'Diverse Längen',
      dishwasherSafe: true,
      inductionSafe: false,
      brand: 'Rösle',
      images: [
        '/images/products/Rösle Silicone Küchenhelfer Set 5-teilig/roesle-set-1.jpg'
      ]
    }
  ]

  console.log('\n🛍️  Creating reorganized products...')
  let successCount = 0

  for (const p of productsToSeed) {
    try {
      const categoryId = categoryMap.get(p.categorySlug)
      if (!categoryId) continue

      const product = await prisma.product.upsert({
        where: { slug: p.slug },
        update: {
          nameDe: p.nameDe,
          price: new Prisma.Decimal(p.price),
          oldPrice: p.oldPrice ? new Prisma.Decimal(p.oldPrice) : null,
          descriptionDe: p.descriptionDe,
          shortDescription: p.shortDescription,
          stock: p.stock,
          badges: p.badges,
          material: p.material,
          dimensions: p.dimensions,
          dishwasherSafe: p.dishwasherSafe,
          inductionSafe: p.inductionSafe,
          brand: p.brand,
          categoryId,
          isActive: true,
        },
        create: {
          slug: p.slug,
          nameDe: p.nameDe,
          price: new Prisma.Decimal(p.price),
          oldPrice: p.oldPrice ? new Prisma.Decimal(p.oldPrice) : null,
          descriptionDe: p.descriptionDe,
          shortDescription: p.shortDescription,
          stock: p.stock,
          badges: p.badges,
          material: p.material,
          dimensions: p.dimensions,
          dishwasherSafe: p.dishwasherSafe,
          inductionSafe: p.inductionSafe,
          brand: p.brand,
          categoryId,
          isActive: true,
          images: {
            create: p.images.map((url, i) => ({
              url,
              alt: `${p.nameDe} - Image ${i + 1}`,
              sortOrder: i,
              isMain: i === 0
            }))
          }
        }
      })

      // Sync images for existing products
      await prisma.productImage.deleteMany({ where: { productId: product.id } })
      await prisma.productImage.createMany({
        data: p.images.map((url, i) => ({
          productId: product.id,
          url,
          alt: `${p.nameDe} - Image ${i + 1}`,
          sortOrder: i,
          isMain: i === 0
        }))
      })

      successCount++
      console.log(`  ✓ Product: ${p.nameDe}`)
    } catch (error) {
      console.error(`  ✗ Error with ${p.nameDe}:`, error)
    }
  }

  console.log(`\n✅ Done! ${successCount} products reorganized.`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
