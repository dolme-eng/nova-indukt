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
    content:
      'Die Induktionspfanne ist absolut erstklassig! Das Essen wird gleichmäßig erhitzt und die Reinigung ist ein Kinderspiel. Kann ich nur empfehlen.',
    userName: 'Maria Schmidt',
    isVerified: true,
    createdAt: new Date('2026-06-12T09:30:00Z'),
  },
  {
    productSlug: 'fissler-original-profi-collection-topfset-5tlg',
    rating: 5,
    title: 'Hervorragende Qualität!',
    content:
      'Habe das Topfset für meine neue Küche gekauft. Die Qualität ist hervorragend und sie sehen auch noch toll aus. Schnelle Lieferung!',
    userName: 'Hans Weber',
    isVerified: true,
    createdAt: new Date('2026-04-03T14:15:00Z'),
  },
  {
    productSlug: null as string | null,
    rating: 4,
    title: 'Gute Produkte, fairer Preis',
    content:
      'Gute Produkte zu einem fairen Preis. Der Kundenservice war sehr hilfsbereit bei meinen Fragen zur Induktionstechnologie.',
    userName: 'Klaus Müller',
    isVerified: true,
    createdAt: new Date('2026-07-21T11:45:00Z'),
  },
  {
    productSlug: 'petromax-dutch-oven-dt6-oval',
    rating: 5,
    title: 'Mein Lieblingsteil in der Küche',
    content:
      'Mein Dutch Oven ist jetzt mein Lieblingsteil in der Küche. Perfekt für Schmorgerichte und Brotbacken.',
    userName: 'Anna Bauer',
    isVerified: true,
    createdAt: new Date('2025-12-08T16:00:00Z'),
  },
  {
    productSlug: 'zwilling-pro-s-messerset-3-teilig',
    rating: 5,
    title: 'Endlich wie ein Profi schneiden!',
    content:
      'Die Messer sind scharf und gut ausbalanciert. Endlich kann ich wie ein Profi schneiden!',
    userName: 'Thomas Klein',
    isVerified: true,
    createdAt: new Date('2026-02-17T08:20:00Z'),
  },
]

async function main() {
  console.log('🌱 NOVA INDUKT — Seed Testimonials (5 avis)')

  // Create or find a user for each testimonial (so names differ on homepage)
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
      // Update createdAt if it exists but has wrong date
      if (existing.createdAt.getTime() !== t.createdAt.getTime()) {
        await prisma.review.update({
          where: { id: existing.id },
          data: { createdAt: t.createdAt },
        })
        console.log(`  ↻ "${t.userName}" — Datum aktualisiert → ${t.createdAt.toISOString().slice(0, 10)}`)
      } else {
        console.log(`  → "${t.userName}" existiert bereits — überspringe`)
      }
      continue
    }

    // Find or create a user with the testimonial's name
    const slugName = t.userName.toLowerCase().replace(/\s+/g, '-')
    const userEmail = `${slugName}@nova-testimonials.de`
    let user = await prisma.user.findUnique({ where: { email: userEmail } })
    if (!user) {
      user = await prisma.user.create({
        data: {
          email: userEmail,
          name: t.userName,
          role: 'USER',
        },
      })
    }

    await prisma.review.create({
      data: {
        productId,
        userId: user.id,
        rating: t.rating,
        title: t.title,
        content: t.content,
        isVerified: t.isVerified,
        isPublished: true,
        createdAt: t.createdAt,
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
