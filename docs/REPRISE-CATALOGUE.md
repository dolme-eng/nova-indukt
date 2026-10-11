# Reprise du catalogue — état et suite

Date du relevé : 2026-10-09. Base : 316 produits, 291 actifs.

## Ce qui est fait

| Chantier | Réalisé |
|---|---|
| Prix de marché appliqués | **45** fiches, règle « plancher − 3 % » |
| Visuels fabricant | **268 / 291** |
| EAN fabricant rattachés | **32** |
| Produits retirés du catalogue | **24** (18 hors catalogue, 5 produits fantômes, 1 doublon) |
| Renommages de nomenclature | **17** |
| Commits | 26, tous sur `origin/main` |

Chaque écriture porte sa source et son URL dans `AuditLog` :
`PRIX_MARCHE`, `IMAGES_OFFICIELLES`, `EAN_CACHE`, `NOMENCLATURE`,
`DESACTIVE_DOUBLON`, `DESACTIVER_PRODUIT_OBSOLETE`.

## Les cinq règles appliquées

Elles viennent toutes d'erreurs réellement commises pendant ce travail.

1. **Un EAN erroné est pire qu'un EAN absent.** Il contamine les comparateurs.
   Recherche par code-barres uniquement dès qu'un EAN existe ; par nom sinon.
2. **Type et taille font partie de l'identité.** Un set de 6 ustensiles ne
   coûte pas deux fois moins cher qu'un set de 3 par pièce. Deux lids de
   cotes différentes ne partagent pas une photo.
3. **Un refus est un drapeau, pas un commentaire.** Écrire « NON APPLIQUÉ »
   dans le texte d'une ligne ne l'empêche pas d'être écrite : le runner
   l'appliquait quand même. `appliquer: false` est désormais dans la donnée.
4. **Identité non déterminée ≠ produit inexistant.** On retire une fiche quand
   le fabricant ne publie rien sous aucune forme. Un mauvais nom de série se
   corrige, il ne se supprime pas.
5. **Prix barré, record et code promo ne sont pas des planchers.** Seule
   l'offre réellement disponible compte.

## Ce qui reste, et pourquoi

**Prix — ~246 fiches**
- ~90 vaisselle indexée : faisable, ~1 prix pour 3 relevés au quota actuel
- ~190 accessoires : **aucune donnée de marché.** Les comparateurs allemands
  n'indexent pas lids, couverts et produits d'entretien, et il n'y a pas de
  grille de prix d'achat. Sans l'une des deux, aucun prix ne peut être calculé
  honnêtement.
- ~20 produits retirés du catalogue : à confirmer par EAN avant suppression

**Visuels — 23 fiches**
Une part ne sera jamais récupérable : wmf.com ne publie plus aucun article
Diadem Plus ni Mondo, et le Schärfmesser 18 cm n'existe pas chez Zwilling.

## Noms de gamme que les fabricants n'utilisent pas

« Adamant Plus » (Fissler), « Masterclass » (Tefal), « Summit Plus »
(Zwilling), « Küchenmaxx » (WMF). Quatre marques, quatre séries
inexistantes — cause racine de la majorité des refus. `scripts/fix-nomenclature.ts`
et `scripts/nomenclature-audit.ts` automatisent la correction.

## Reprendre

```bash
npx tsx scripts/ean-depuis-cache.ts --brand Fissler --apply   # EAN d'abord
npx tsx scripts/prices-wmf.ts --apply                        # prix idempotents
npx tsx scripts/prices-zwilling.ts --apply
npx tsx scripts/prices-fissler.ts --apply
npx tsx scripts/fix-images.ts --brand Fissler --apply        # visuels
```

Les quatre scripts de prix sont **idempotents** : relancer n'écrit rien.
`scripts/audit-sitemap.ts` ne doit servir à rien d'autre qu'à examiner —
son verdict « absent » confond une divergence de vocabulaire avec une absence.