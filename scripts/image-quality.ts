/**
 * Contrôle qualité des visuels du catalogue.
 *
 *   npx tsx scripts/image-quality.ts
 *   npx tsx scripts/image-quality.ts --brand WMF
 *   npx tsx scripts/image-quality.ts --json > images.json
 *
 * Deux défauts distincts, à ne pas confondre :
 *
 *   1. la résolution — mesurable, donc traitable en une passe sur tout le
 *      catalogue ;
 *   2. la correspondance au produit — vérifiable seulement à l'œil.
 *
 * Ce script ne traite que le premier. Un visuel peut montrer exactement le
 * bon article et être inutilisable : le set WMF Function 4 est le bon produit
 * sur une image de 464 × 338 px.
 *
 * Le seuil porte sur le CÔTÉ COURT : c'est lui qui borne la qualité, et il
 * correspond à ce qu'affiche réellement une fiche produit.
 */

import { config as loadEnv } from 'dotenv'
import fs from 'node:fs'
import path from 'node:path'

const root = path.resolve(__dirname, '..')

/** Côté court minimal pour une fiche produit. */
const SEUIL = 600

/** En dessous de cette largeur, l'image est inutilisable même agrandie. */
const CRITIQUE = 400

type Ligne = {
  marque: string
  dossier: string
  fichier: string
  chemin: string
  largeur: number
  hauteur: number
  octets: number
  url: string | null
}

function main() {
  const brandArg = process.argv.indexOf('--brand')
  const filtre = brandArg > -1 ? process.argv[brandArg + 1] : null
  const asJson = process.argv.includes('--json')

  const base = path.join(root, 'public', 'images', 'products')
  if (!fs.existsSync(base)) {
    console.error(`Répertoire introuvable : ${base}`)
    process.exitCode = 1
    return
  }

  const lignes: Ligne[] = []
  for (const dossier of fs.readdirSync(base)) {
    const cheminDossier = path.join(base, dossier)
    if (!fs.statSync(cheminDossier).isDirectory()) continue

    for (const fichier of fs.readdirSync(cheminDossier)) {
      if (!/\.(jpe?g|png|webp)$/i.test(fichier)) continue
      const chemin = path.join(cheminDossier, fichier)
      // La taille est lue dans l'en-tête du fichier : pas de dépendance
      // native, et le catalogue complet passe en une seconde.
      const dim = readImageSize(chemin)
      if (!dim) continue
      lignes.push({
        marque: dossier.split(' - ')[0].trim(),
        dossier,
        fichier,
        chemin,
        largeur: dim.w,
        hauteur: dim.h,
        octets: fs.statSync(chemin).size,
        url: null,
      })
    }
  }

  const toutes = lignes.filter(
    (l) => !filtre || l.marque.toLowerCase().startsWith(filtre.toLowerCase())
  )
  const courtes = toutes
    .filter((l) => Math.min(l.largeur, l.hauteur) < SEUIL)
    .sort((a, b) => Math.min(a.largeur, a.hauteur) - Math.min(b.largeur, b.hauteur))
  const critiques = toutes.filter((l) => Math.min(l.largeur, l.hauteur) < CRITIQUE)

  if (asJson) {
    console.log(
      JSON.stringify(
        {
          seuil: SEUIL,
          critique: CRITIQUE,
          total: toutes.length,
          tropPetites: courtes.length,
          critiques: critiques.length,
          images: courtes,
        },
        null,
        2
      )
    )
    return
  }

  console.log(
    `\nQualité des visuels${filtre ? ` — ${filtre}` : ' — tout le catalogue'}\n` +
      `seuil ${SEUIL} px de côté court · critique ${CRITIQUE} px\n`
  )
  console.log(`images analysées : ${toutes.length}`)
  console.log(
    `  trop petites   : ${courtes.length} (${((courtes.length / (toutes.length || 1)) * 100).toFixed(0)} %)`
  )
  console.log(`  critiques      : ${critiques.length}\n`)

  // Par série : c'est le niveau d'action, pas la fiche isolée.
  const parSerie = new Map<string, Ligne[]>()
  for (const l of courtes) {
    const cle = `${l.marque} · ${l.dossier}`
    parSerie.set(cle, [...(parSerie.get(cle) ?? []), l])
  }

  console.log('─── séries à traiter ───')
  const tri = [...parSerie.entries()].sort((a, b) => b[1].length - a[1].length)
  for (const [cle, list] of tri) {
    const mini = Math.min(...list.map((l) => Math.min(l.largeur, l.hauteur)))
    console.log(
      `  ${String(list.length).padStart(2)} image(s)  mini ${String(mini).padStart(4)} px  ${cle}`
    )
  }

  console.log('\n─── les plus critiques ───')
  for (const l of courtes.slice(0, 15)) {
    const flag = Math.min(l.largeur, l.hauteur) < CRITIQUE ? '  ✗' : ''
    console.log(
      `  ${String(l.largeur).padStart(4)}x${String(l.hauteur).padEnd(4)} ${(l.octets / 1024).toFixed(0).padStart(5)} Ko${flag}  ${l.dossier}/${l.fichier}`
    )
  }

  const totalKO = lignes
    .filter((l) => Math.min(l.largeur, l.hauteur) < SEUIL)
    .reduce((n, l) => n + l.octets, 0)

  console.log(
    `\nLes ${courtes.length} images trop petites pèsent ${(totalKO / 1024 / 1024).toFixed(1)} Mo.\n` +
      `Ce script ne modifie rien : il ne mesure que la résolution.\n` +
      `La correspondance au produit se vérifie à l’œil — voir docs/AUDIT-PRODUITS.md.`
  )
}

/** Lit largeur et hauteur dans l'en-tête, sans décoder l'image entière. */
function readImageSize(chemin: string): { w: number; h: number } | null {
  const buf = fs.readFileSync(chemin)
  if (buf.length < 24) return null

  // PNG : IHDR en tête de fichier
  if (buf[0] === 0x89 && buf[1] === 0x50) {
    return { w: buf.readUInt32BE(16), h: buf.readUInt32BE(20) }
  }
  // GIF
  if (buf.slice(0, 3).toString('latin1') === 'GIF') {
    return { w: buf.readUInt16LE(6), h: buf.readUInt16LE(8) }
  }
  // RIFF/WEBP
  if (buf.slice(0, 4).toString('latin1') === 'RIFF') {
    if (buf.slice(8, 12).toString('latin1') === 'WEBP') {
      const type = buf.slice(12, 16).toString('latin1')
      if (type === 'VP8 ')
        return { w: buf.readUInt16LE(26) & 0x3fff, h: buf.readUInt16LE(28) & 0x3fff }
      if (type === 'VP8L') {
        const b = buf.readUInt32LE(21)
        return { w: (b & 0x3fff) + 1, h: ((b >> 14) & 0x3fff) + 1 }
      }
      if (type === 'VP8X') {
        const w = buf[24] | (buf[25] << 8) | (buf[26] << 16)
        const h = buf[27] | (buf[28] << 8) | (buf[29] << 16)
        return { w: w + 1, h: h + 1 }
      }
    }
    return null
  }
  // JPEG : on parcourt les segments jusqu'au marqueur SOFn
  if (buf[0] === 0xff && buf[1] === 0xd8) {
    let i = 2
    while (i < buf.length - 9) {
      if (buf[i] !== 0xff) {
        i++
        continue
      }
      const marqueur = buf[i + 1]
      // SOF0..SOF15, hors DHT/JPG/DAC
      if (
        marqueur >= 0xc0 &&
        marqueur <= 0xcf &&
        marqueur !== 0xc4 &&
        marqueur !== 0xc8 &&
        marqueur !== 0xcc
      ) {
        return { h: buf.readUInt16BE(i + 5), w: buf.readUInt16BE(i + 7) }
      }
      const taille = buf.readUInt16BE(i + 2)
      if (taille < 2) return null
      i += 2 + taille
    }
  }
  return null
}

main()
