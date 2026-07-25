/**
 * NOVA INDUKT — Seed Testimonials
 * Inserts the 5 original homepage testimonials as published Review records.
 */
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const testimonials = [
  {
    productSlug: 'fissler-adamant-plus-bratpfanne-24cm',
    rating: 5,
    title: 'Absolut erstklassig!',
    content: 'Die Induktionspfanne ist absolut erstklassig! Das Essen wird gleichmäßig erhitzt und die Reinigung ist ein Kinderspiel. Kann ich nur empfehlen.',
    userName: 'Maria Schmidt',
    isVerified: true,
  },
  {
    productSlug: 'fissler-original-profi-collection-topfset-5tlg',
    rating: 5,
    title: 'Hervorragende Qualität!',
    content: 'Habe das Topfset für meine neue Küche gekauft. Die Qualität ist hervorragend und sie sehen auch noch toll aus. Schnelle Lieferung!',
    userName: 'Hans Weber',
    isVerified: true,
  },
  {
    productSlug: null as string | null,
    rating: 4,
    title: 'Gute Produkte, fairer Preis',
    content: 'Gute Produkte zu einem fairen Preis. Der Kundenservice war sehr hilfsbereit bei meinen Fragen zur Induktionstechnologie.',
    userName: 'Klaus Müller',
    isVerified: true,
  },
  {
    productSlug: 'petromax-dutch-oven-dt6-oval',
    rating: 5,
    title: 'Mein Lieblingsteil in der Küche',
    content: 'Mein Dutch Oven ist jetzt mein Lieblingsteil in der Küche. Perfekt für Schmorgerichte und Brotbacken.',
    userName: 'Anna Bauer',
    isVerified: true,
  },
  {
    productSlug: 'zwilling-pro-s-messerset-3-teilig',
    rating: 5,
    title: 'Endlich wie ein Profi schneiden!',
    content: 'Die Messer sind scharf und gut ausbalanciert. Endlich kann ich wie ein Profi schneiden!',
    userName: 'Thomas Klein',
    isVerified: true,
  },
]

async function main() {
  console.log('🌱 NOVA INDUKT — Seed Testimonials (5 avis)')

  // Find or create a system user for anonymous reviews
  let systemUser = await prisma.user.findFirst({ where: { email: 'system@nova-indukt.de' } })
  if (!systemUser) {
    systemUser = await prisma.user.create({
      data: {
        email: 'system@nova-indukt.de',
        name: 'NOVA INDUKT Kunde',
        role: 'USER',
      },
    })
    console.log('  ✓ System-Benutzer erstellt')
  }

  let created = 0
  for (const t of testimonials) {
    // Find product by slug
    let productId: string | null = null
    if (t.productSlug) {
      const product = await prisma.product.findUnique({ where: { slug: t.productSlug } })
      if (!product) {
        console.log(`  ⚠ Produkt "${t.productSlug}" nicht gefunden — überspringe`)
        continue
      }
      productId = product.id
    } else {
      // Klaus Müller had no product — pick a random one for DB integrity
      const anyProduct = await prisma.product.findFirst()
      if (anyProduct) productId = anyProduct.id
    }

    if (!productId) {
      console.log(`  ⚠ Kein Produkt gefunden für "${t.userName}" — überspringe`)
      continue
    }

    // Check if already exists (idempotent)
    const existing = await prisma.review.findFirst({
      where: { productId, content: t.content },
    })
    if (existing) {
      console.log(`  → "${t.userName}" existiert bereits — überspringe`)
      continue
    }

    await prisma.review.create({
      data: {
        productId,
        userId: systemUser.id,
        rating: t.rating,
        title: t.title,
        content: t.content,
        isVerified: t.isVerified,
        isPublished: true,
      },
    })

    // Update product reviewCount
    const publishedCount = await prisma.review.count({
      where: { productId, isPublished: true },
    })
    const avgRating = await prisma.review.aggregate({
      where: { productId, isPublished: true },
      _avg: { rating: true },
    })
    await prisma.product.update({
      where: { id: productId },
      data: {
        reviewCount: publishedCount,
        rating: avgRating._avg.rating ?? 0,
      },
    })

    created++
    console.log(`  ✓ "${t.userName}" (${t.rating}★) → ${productId}`)
  }

  console.log(`\n🎉 ${created} Testimonials erfolgreich eingefügt!`)
}

main()
  .catch((e) => {
    console.error('❌ Fehler beim Seed der Testimonials:', e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
