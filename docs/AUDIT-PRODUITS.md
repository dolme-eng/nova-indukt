# Audit produits — méthodologie et fiche n°1

Objectif : pour chaque produit du catalogue, vérifier qu'il correspond à un
article réel, que son prix est compétitif, et que ses images montrent bien
l'article vendu.

## Pourquoi les corrections vivent hors du seed

Le site lit PostgreSQL. Modifier `prisma/seed-*.ts` ne change rien au site
tant que la base n'est pas mise à jour, et un `db:seed:all` réécrit 317
produits. Les corrections d'audit sont donc écrites comme **scripts
d'apply idempotents** dans `prisma/fixups/`, avec leur équivalent SQL brut à
côté pour un rollback ou un `psql`.

```
prisma/fixups/
  NNN-<marque>-<produit>.sql   # transactionnel, garde-fous, rapport de contrôle
  NNN-<marque>-<produit>.ts    # même correction, idempotente, auditée
```

Le seed est aligné **en plus**, pour qu'une réinitialisation de la base ne
réintroduise pas les valeurs erronées.

## Les 3 vérifications

### 1. Le produit est-il réel ?

Chercher la référence fabricant, croiser au moins deux sources indépendantes.

Les pièges les plus fréquents dans ce catalogue :

- **Variantes fusionnées.** Une même marque vend des articles quasi identiques
  qui ne diffèrent que par un mot (« hoch », « mit Glasdeckel » ). Notre
  fiche n°1 annonçait « hoch » (9,1 L) avec une contenance de 6,3 L.
- **Hauteur et contenance inventées.** Souvent copiées d'un autre article.
- **EAN absent.** Le champ `ean @unique` existe et sert de clé de
  rapprochement. Un produit sans EAN ne peut pas être audité automatiquement.
- **Texte dans une autre langue.** Plusieurs descriptions se terminent par une
  phrase en français dans un site allemand.

Règle : l'EAN doit venir du fabricant ou d'un revendeur identifié, jamais
d'une déduction.

### 2. Le prix est-il compétitif ?

Relever le prix **fabricant** et **4 revendeurs** au minimum, puis comparer au
prix UVP. Un prix UVP n'est pas un prix de vente.

| Repère | Usage |
|---|---|
| Prix fabricant | Plancher de crédibilité |
| Offre la plus basse | Pour être « en dessous de la concurrence » |
| Médiane du marché | Cible razonable |
| Prix UVP | Ancien `oldPrice` — ne doit jamais être le `price` |

⚠ Toujours vérifier la marge avant d'appliquer. Un produit sans `costPrice`
ne peut pas être recalé en sécurité.

### 3. Les images montrent-elles le bon article ?

**Regarder chaque image une par une**, ne pas se fier au nom du dossier : les
dossiers d'images sont nommés d'après le libellé de la fiche, donc ils
portent la même erreur que la fiche.

Sur 317 produits, laFAI de vérification manuelle est le point le plus costly.
Candidats à contrôler en priorité : les fiches dont le nom contient « hoch »,
« klein », « groß », « Set », ou une contenance — et toutes celles dont
plusieurs images viennent du même fichier source.

### Sources d'images — arbitrage à poser une fois pour toutes

Les visuels existants sont des photos fabricant authentiques : quelqu'un les a
obtenues par une voie légitime. Les remplacer suppose de choisir :

| Source | Légalité | Qualité |
|---|---|---|
| Portail presse fabricant | ✅ Libre pour les revendeurs | Productive |
| Catalogue PDF fabricant | ✅ Libre | Moyenne (basse définition) |
| Photos d'un concurrent | ❌ Vol de propriété intellectuelle | Haute, mais risque juridique |
| Openverse / Wikimedia | ✅ Libre, attribution | Rare pour du matériel de cuisine |

**Recommandation :求得 un accès revendeur Fissler/WMF/Zwilling.** Ce qui
donne aussi accès au fichier tarifaire officiel, donc à une vérification des
prix fiable. Tant que ce n'est pas en place, ne pas scraper les concurrents.

## Fiche n°1 — Fissler Original Profi Collection Kochtopf 24 cm

`prisma/fixups/001-fissler-opc-kochtopf-24cm.{ts,sql}`

### Produit réel

Fissler vend deux articles distincts de Ø 24 cm. La fiche fusionnait les deux.

| Variante | EAN | Contenance | Hauteur |
|---|---|---|---|
| Kochtopf 24 cm | `4009209379937` | 6,3 L | 18 cm |
| **hoher** Kochtopf 24 cm | `4009209379890` | 9,1 L | 21,5 cm |

**Retenu : variante 6,3 L Metalldeckel (EAN 4009209379937)** — cohérente avec
l'essentiel du texte (Kondensat-Plus, 230 °C) et avec les dimensions.

> Si la variante 9,1 L était la bonne, inverser. Le libellé commercial
> «Original Profi Collection Kochtopf» seul ne suffit pas à trancher.

### Prix

| Source | Prix |
|---|---|
| Fissler (fabricant, Metalldeckel) | 149,00 € |
| koestner-shop | 149,70 € |
| moebel.de / Idealo (Amazon) | 141,57 € |
| testbericht (4 offres) | 131,99 / 138,98 / 138,99 / 149,58 € |
| **Avant** | **199,00 €** (= UVP) |
| **Après** | **129,00 €** |

⚠ Cette fiche n'a pas de `costPrice`. **Vérifier la marge avant d'appliquer.**

### Images — 4 sur 4 à remplacer

| Fichier | Contenu | Verdict |
|---|---|---|
| `1.jpg` | kochtopf 24 cm, **couvercle verre** | ❌ mauvais variante (verre ≠ métal) |
| `2.jpg` | casserolle à long manche gravé « GERMANY » | ❌ autre produit |
| `3.jpg` | Schmortopf à couvercle « GESCHIRRT » | ❌ autre produit |
| `4.jpg` | gros plan du même type de manche que la casserolle | ❌ autre produit |

Aucune image ne montre le kochtopf 24 cm / 6,3 L avec couvercle métal.

### Application

```bash
npx tsx prisma/fixups/001-fissler-opc-kochtopf-24cm.ts --dry-run   # rapport
npx tsx prisma/fixups/001-fissler-opc-kochtopf-24cm.ts             # écriture
```

## Reste à faire sur le catalogue

- [ ] **Inventaire des EAN manquants.** 41 fichiers de seed sur 41 ne
      renseignent pas `ean`, alors que le champ existe et est unique. Sans lui,
      l'audit automatisé est impossible.
- [ ] **Détecter les variantes fusionnées** par similarité de libellé
      (`scripts/tmp-dupes.ts` fait déjà de la détection Levenshtein).
- [ ] **Contrôle automatique des images** : comparer le hash des fichiers
      d'images entre produits pour repérer les doublons.
- [ ] **Rechercher les textes non allemands** résiduels.
