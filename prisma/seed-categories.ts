const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

const newCategories = [
  { slug: 'messer', nameDe: 'Kochmesser & Messerblocks', description: 'Hochwertige Küchenmesser, Messerblöcke und Schärfwerkzeuge von Top-Marken', image: '/images/Kategorien/messer.png', sortOrder: 6 },
  { slug: 'ustensiles', nameDe: 'Küchenutensilien', description: 'Kochlöffel, Schöpfkellen, Zangen und weiteres Kochbesteck für die Induktionsküche', image: '/images/Kategorien/ustensiles.png', sortOrder: 7 },
  { slug: 'sauteusen', nameDe: 'Sauteusen', description: 'High-End Sauteusen aus Edelstahl und Gusseisen für professionelles Garen auf Induktion', image: '/images/Kategorien/sauteusen.png', sortOrder: 8 },
  { slug: 'crepe-pfannen', nameDe: 'Crêpe-Pfannen', description: 'Professionelle Crêpe- und Pfannkuchenpfannen für perfekte Crêpes auf Induktion', image: '/images/Kategorien/crepe-pfannen.png', sortOrder: 9 },
  { slug: 'schnellkochtopfe', nameDe: 'Schnellkochtöpfe', description: 'Druckkochtöpfe und Schnellkochtopf-Systeme für schnelles, energieeffizientes Kochen', image: '/images/Kategorien/schnellkochtopfe.png', sortOrder: 10 },
  { slug: 'formes-de-cuisson', nameDe: 'Backformen & Auflaufformen', description: 'Hochwertige Backformen, Auflaufformen und Bräter aus Gusseisen und Edelstahl', image: '/images/Kategorien/formes-de-cuisson.png', sortOrder: 11 },
  { slug: 'fondues-raclette', nameDe: 'Fondues & Raclette', description: 'Fonduesets, Raclette-Pfannen und Zubehör für gemütliche Abende zu Hause', image: '/images/Kategorien/fondues-raclette.png', sortOrder: 12 },
  { slug: 'deckel-griffe', nameDe: 'Ersatzdeckel & Griffe', description: 'Passende Ersatzdeckel und Griffe für Kochgeschirr-Serien von WMF, Fissler und Zwilling', image: '/images/Kategorien/deckel-griffe.png', sortOrder: 13 },
  { slug: 'pfannenschoner-topfregale', nameDe: 'Pfannenschoner & Topfregale', description: 'Schutzfolien, Stapelhilfen und Organizer für Ihre Kochgeschirrsammlung', image: '/images/Kategorien/pfannenschoner-topfregale.png', sortOrder: 14 },
  { slug: 'elektrogeraete', nameDe: 'Elektro-Küchengeräte', description: 'Handmixer, Standmixer, Stabmixer und weitere Elektro-Küchengeräte für moderne Küchen', image: '/images/Kategorien/elektrogeraete.png', sortOrder: 15 },
  { slug: 'bestecke', nameDe: 'Bestecke & Messerbestecke', description: 'Elegante Bestecksets, Messerbestecke und Einzelteile aus Edelstahl', image: '/images/Kategorien/bestecke.png', sortOrder: 16 },
  { slug: 'reinigung-pflege', nameDe: 'Reinigung & Pflege', description: 'Reinigungsmittel, Pflegeöle und Zubehör für Kochgeschirr und Küchengeräte', image: '/images/Kategorien/reinigung-pflege.png', sortOrder: 17 },
]

async function main() {
  let created = 0
  let skipped = 0
  for (const cat of newCategories) {
    const existing = await prisma.category.findUnique({ where: { slug: cat.slug } })
    if (existing) {
      console.log(`  ↻ Déjà existant : ${cat.slug}`)
      skipped++
      continue
    }
    await prisma.category.create({ data: cat })
    created++
    console.log(`  ✓ Créé : ${cat.slug} (${cat.nameDe})`)
  }
  console.log(`\n📊 ${created} créées, ${skipped} déjà existantes`)
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
