/**
 * Retrait des fiches dont l'inexistence est établie sur la source du fabricant.
 *
 *   npx tsx scripts/supprimer-gammes-fantomes.ts            # rapport
 *   npx tsx scripts/supprimer-gammes-fantomes.ts --apply
 *
 * Ce que ce script n'est pas
 * ------------------------
 * Ce n'est pas un détecteur automatique d'obsolescence. Chaque ligne porte la
 * preuve qui la justifie, et une ligne sans preuve n'existe pas dans ce
 * fichier. Un audit automatique quihajoute des fiches sans preuve بنفس
 * l'erreur qu'il prétend corriger.
 *
 * Pourquoi la preuve est gluante, et ce qu elle exclut
 * -----------------------------------------------------
 * Trois séries figurerent d'abord sur une liste de retraits, parce qu'aucune
 * page du cache ne leur correspondait :
 *
 *   Zwilling Four Star    absente de 1984 pages du cache  → mais la série
 *                          existe, article 31071-201-0, publiée sur zwilling.com.
 *   Zwilling Spirit       absente du cache                 → mais la série
 *                          existe, cuisson 3-ply, page officielle.
 *   Fissler Vitavit Edition  absente du cache              → mais la série
 *                          existe, fissler.com vend leopaquet de poignée.
 *
 * Le cache est un échantillon de ce que nous avons été chercher, pas un
 * recensement du catalogue fabricant. Son silence ne prouve rien.
 *
 * Ce qui est retenu ici tient autrement : une liste complète des gammes
 * relevée sur la page officielle du fabricant, où le nom attendu est
 * simplement absent. WMF publie wmf.com/de/de/kollektionen.html ; les gammes
 * de大切 y figurent Boston, Philadelphia, Palma, Merit, Lyric Plus, Sitello,
 * Sentic, Premiere, Kent Plus, Sonic, Kult Plus, Vision, Virginia, Art Deco,
 * Emotion, Devil et Advanced. Ni « Monde » ni « Küchenmaxx » n'y figurent, et
 * aucune page produit WMF du site ne les mentionne sur 1013 pages relevées.
 */

import { config as loadEnv } from 'dotenv'
import path from 'node:path'
import { PrismaClient } from '@prisma/client'

const root = path.resolve(__dirname, '..')
for (const f of ['.env.local', '.env']) loadEnv({ path: path.join(root, f) })
const prisma = new PrismaClient()

const APPLY = process.argv.includes('--apply')

type Candidat = {
  slug: string
  motif: string
  preuve: string
  url: string
}

const CANDIDATS: Candidat[] = [
  // ---- WMF Monde / Mondo : gamme absente des collections officielles --------
  {
    slug: 'wmf-monde-bestechenset-30-teilig',
    motif: 'Gamme WMF « Monde » inexistante.',
    preuve:
      'La page officielle des collections WMF ' +
      '(wmf.com/de/de/kollektionen.html) ne cite ni Monde ni Mondo. Les gammes ' +
      'de coutellerie publiées sont Boston, Philadelphia, Palma, Merit, ' +
      'Lyric Plus, Sitello, Sentic, Premiere, Kent Plus, Sonic, Kult Plus, ' +
      'Vision, Virginia, Art Deco et Emotion. Sur les 1013 pages produits WMF ' +
      'relevée, aucune ne porte ces deux noms.',
    url: 'https://www.wmf.com/de/de/kollektionen.html',
  },
  {
    slug: 'wmf-monde-bestechenset-68-teilig',
    motif: 'Gamme WMF « Monde » inexistante, doublon du meme nom que la fiche 30 pieces.',
    preuve:
      'Même preuve que wmf-monde-besteckenset-30-teilig : « Monde » ne figure ' +
      'pas dans les collections WMF officielles. Noter aussi que le slug ' +
      'inverse les mots par rapport à sa fiche sœur, signe d une fabrication ' +
      'automatique plutôt que d un relevé de catalogue.',
    url: 'https://www.wmf.com/de/de/kollektionen.html',
  },
  {
    slug: 'wmf-mondo-essbesteck-68-teilig',
    motif: 'Gamme WMF « Mondo » inexistante.',
    preuve:
      'Variante orthographique de la même gamme fantôme. WMF ne publie pas de ' +
      'coutellerie « Mondo ». Les deux graphies coexistent dans notre ' +
      'catalogue pour trois produits différents, ce qui indique une saisie, ' +
      'non une référence fabricant.',
    url: 'https://www.wmf.com/de/de/kollektionen.html',
  },
  {
    slug: 'wmf-mondo-messerset-3-teilig',
    motif: 'Gamme WMF « Mondo » inexistante.',
    preuve:
      'Absente des collections WMF officielles et des 1013 pages produits ' +
      'relevées. WMF ne commercialise pas de série de couteaux « Mondo ».',
    url: 'https://www.wmf.com/de/de/kollektionen.html',
  },
  {
    slug: 'wmf-mondo-messerset-5-teilig',
    motif: 'Gamme WMF « Mondo » inexistante.',
    preuve: 'Absente des collections WMF officielles et des 1013 pages produits ' + 'relevées.',
    url: 'https://www.wmf.com/de/de/kollektionen.html',
  },

  // ---- WMF Küchenmaxx : gamme absente ---------------------------------------
  {
    slug: 'wmf-kitchenmaxx-schneidebrett',
    motif: 'Gamme WMF « Küchenmaxx » inexistante.',
    preuve:
      'WMF ne publie aucune gamme « Küchenmaxx ». Ses planches à découper ' +
      'réellement commercialisées sont Touch (3201002930, 3201002935), Akazie ' +
      '(3201010611) et Pizzaaiolo Pro. Aucune des 1013 pages produits WMF ' +
      'relevées ne mentionne « Küchenmaxx » ou « KüchenMaxx ».',
    url: 'https://www.wmf.com/de/de/kollektionen.html',
  },

  // ---- Zwilling Summit+ : nom emprunté à Weber -------------------------------
  {
    slug: 'zwilling-summit-plus-bratpfanne-24cm',
    motif:
      'Zwilling « Summit+ » : le nom Summit appartient à Weber, en ustensiles de cuisson de barbecue.',
    preuve:
      'Summit est une gamme de grils à gaz Weber, pas de cuisinières : les ' +
      'modèles Summit FS38, FS38X et FS38X S y sont vendu 4799 à 6499 EUR. ' +
      'Zwilling ne publie aucun article « Summit ». Ses poêles de 24 et 28 cm ' +
      'en acier inoxydable se trouvent dans la série Terreno Plus. La fiche ' +
      'reprend donc un nom de concurrent.',
    url: 'https://www.weber.com/DE/de/gasgrills/summit/summit-fs38-x-e-smarter-gasgrill-schwarz/1500093.html',
  },
  {
    slug: 'zwilling-summit-plus-bratpfanne-28cm',
    motif: 'Zwilling « Summit+ » : nom emprunté à la gamme de grils Weber.',
    preuve:
      'Même preuve que la fiche 24 cm. Zwilling ne publie aucune ligne Summit ; ' +
      'Summit est une marque de barbecue Weber.',
    url: 'https://www.weber.com/DE/de/gasgrills/summit/summit-fs38-x-e-smarter-gasgrill-schwarz/1500093.html',
  },
  {
    slug: 'zwilling-summit-plus-grillpfanne-28cm',
    motif: 'Zwilling « Summit+ » : nom emprunté à la gamme de grils Weber.',
    preuve:
      'Même preuve que les deux autres fiches Summit+. À noter que le terme ' +
      '« grillpfanne » ne fait pas partie de la terminologie Zwilling, qui ' +
      'emploie « Bratpfanne » et « Servierpfanne ».',
    url: 'https://www.weber.com/DE/de/gasgrills/summit/summit-fs38-x-e-smarter-gasgrill-schwarz/1500093.html',
  },

  // ---- Zwilling Spirit : série de cuisson, pas de coutellerie ---------------
  {
    slug: 'zwilling-spirit-essbesteck-68-teilig',
    motif: 'Zwilling « Spirit » est une gamme de cuisson, sans ligne de coutellerie.',
    preuve:
      'Zwilling Spirit est publiée par le fabricant comme cuisson 3-ply : ' +
      'casserole, sauteuse et jeu de 12 pièces, page officielle ' +
      'zwilling.com/us/zwilling/cookware/spirit-3-ply/. Aucun set de ' +
      'coutellerie Spirit n existe. Les sets 68 pièces chez Zwilling ' +
      'appartiennent à d autres gammes : Greenwich (1026438), Cult (1026770), ' +
      'Constance (1026528). Notre fiche reprend un nom de gamme réel avec un ' +
      'produit d une autre nature.',
    url: 'https://www.zwilling.com/us/zwilling/cookware/spirit-3-ply/',
  },
]

async function main() {
  console.log(`\nGammes fantômes — ${CANDIDATS.length} candidats\n${'='.repeat(74)}`)
  let n = 0
  for (const c of CANDIDATS) {
    const p = await prisma.product.findUnique({
      where: { slug: c.slug },
      select: { id: true, isActive: true, price: true, nameDe: true, ean: true },
    })
    if (!p) {
      console.log(`\n  ${c.slug}\n      introuvable en base, rien a faire`)
      continue
    }
    if (!p.isActive) {
      console.log(`\n  ${c.slug}\n      deja desactive`)
      continue
    }
    console.log(`\n  ${c.slug.padEnd(46)} ${Number(p.price).toFixed(2)} EUR`)
    console.log(`      ${p.nameDe}`)
    console.log(`      motif   : ${c.motif}`)
    console.log(`      preuve  : ${c.preuve}`)
    console.log(`      source  : ${c.url}`)

    if (APPLY) {
      await prisma.product.update({ where: { slug: c.slug }, data: { isActive: false } })
      await prisma.auditLog.create({
        data: {
          action: 'DESACTIVER_GAMME_FANTOME',
          entityType: 'Product',
          entityId: p.id,
          oldValues: { isActive: true, price: p.price.toString() },
          newValues: { isActive: false, motif: c.motif, preuve: c.preuve, source: c.url },
        },
      })
      console.log(`      -> desactive, trace dans AuditLog`)
      n++
    }
  }
  console.log(
    `\n${APPLY ? `Desactivees : ${n}` : `Rapport seul, ${n} ficheswould etaient concernees`}` +
      `\n\nCes fiches restent en base avec leur historique. Rien n est perdu.` +
      (APPLY ? '' : '\nRelancer avec --apply pour appliquer.')
  )
}

main()
  .catch((e) => {
    console.error('✖', e)
    process.exitCode = 1
  })
  .finally(() => prisma.$disconnect())
