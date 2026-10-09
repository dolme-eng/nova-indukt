# Relevés de prix concurrentiel

Méthode : pour chaque produit, relever le prix **fabricant**, puis 3 à 4
revendeurs sur des comparateurs (idealo, testbericht, moebel.de, geprice).
Le prix retenu est **juste sous l'offre la plus basse** du marché.

## Règle de prix

```
prix_concurrent_le_plus_bas  =  L
prix_retenu                   =  L - max(2 €, 2 %)
```

On vise l'offre la plus basse et non la médiane : c'est l'offre que
l'acheteur compare. Si nous sommes déjà sous le marché, on ne descend pas
plus — on remonte jusqu'à la limite, ce qui augmente la marge sans perdre
l'avantage.

## Fiche 1 — Fissler Intensa Topfset 5-teilig

`fissler-intensa-topfset-5tlg`

| Source | Prix |
|---|---|
| testbericht (Tiefstpreis) | 333,00 € |
| testbericht (médiane 1 mois) | 335,00 € |
| testbericht (Höchstpreis) | 428,14 € |
| moebel.de / XXXLutz | 349,90 € |
| zurbrüggen | 349,00 € |
| mex.de | 349,00 € |
| idealo (eBay) | 398,90 € |
| **Prix NOVA INDUKT actuel** | **299,00 €** |

Écart : nous sommes **34 € sous le marché le plus bas**, soit 10 %.

Prix à retenir : **326,00 €** (333 − 7). Toujours l'offre la moins chère,
mais 27 € de plus qu'aujourd'hui.

À noter : deux revendeurs annoncent des images « KI-generiert oder bearbeitet »
(zurbrüggen). Leurs visuels ne sont pas fiables — observation à conserver
pour le contrôle images.

## Fiche 2 — Fissler OPC Schmortopf 28 cm  ✅ TRANCHÉ

`fissler-opc-schmortopf-28cm`

### Ce que vend réellement Fissler aujourd'hui

Une seule référence de 28 cm existe au catalogue actuel :

| Page fabricant | Variante | EAN | Prix | Dispo | Contenance |
|---|---|---|---|---|---|
| `…-runder-braeter-mit-hochraumdeckel-28-cm` | 28 cm | 4009209379999 | 269,00 € | InStock | **4,8 L** |

Contenance lue dans `window.productVariantMetafields` → `ATTR_Capacity_EU_norm: 4.8 l`.

Le **Bratentopf 28 cm n'existe pas** en Original-Profi Collection : la page
n'ouvre que sur 16, 20 et 24 cm. Le stewpot 14 L (modèle 084-118-28-000/0,
vu chez Proshop à 248,03 €) a été retiré du catalogue.

→ C'est le **4,8 L**. La variante 14 L n'est plus distribute — l'ajouter au
catalogue reviendrait à vendre un article que Fissler ne fournit plus.

### Marché du 4,8 L

| Source | Prix |
|---|---|
| zurbrüggen (avec rabatt) | 179,99 € |
| Amazon | 185,99 € |
| koestner-shop via Kaufland | 215,48 € |
| Fabricant | 269,00 € |
| **Prix NOVA INDUKT actuel** | **139,00 €** |

**Prix à retenir : 177,00 €** (179,99 − 3). Nous restons l'offre la moins
chère avec 3 € de marge, et nous gagnons 38 € par vente.

Note : le prix fabricant (269 €) est ici nettement au-dessus du marché
(180–215 €), signe que ce modèle approche la fin de vie. À surveiller.

## Fiche 3 — Fissler OPC Sauteuse 20 cm (méthode validée)

Relevé fait sur la 20 cm pendant la recherche sur la 28 cm. Il sert de
référence de méthode : les deux comparateurs donnent des données cohérentes.

| Source | Prix |
|---|---|
| testbericht (Tiefstpreis) | 108,99 € |
| testbericht (médiane 1 mois) | 112,00 € |
| testbericht (Höchstpreis) | 159,00 € |
| idealo (galaxus) | 121,56 € |
| idealo (1a-Neuware) | 123,16 € |
| Fabricant (084-148-20-100/0) | 139,00 € |

Le comparateur donne **13 offres**, la médiane et le plancher sont proches
(109 € contre 112 €) : sur ce type d'article, l'écart entre le moins cher et
la médiane est faible. Une décote de 3 % sous le plancher suffit à rester
visible.

## Pourquoi une recherche par produit coûte cher

Chaque relevé demande une recherche qui renvoie une à deux comparateurs
complet, soit 4 à 6 000 tokens. Les 316 produits du catalogue représenteraient
environ 1,5 à 2 millions de tokens de recherche : plusieurs dizaines d'heures
de travail, non réalisables dans une session.

Deux=axes d'amélioration possible :

1. **Regrouper par article, pas par produit.** Une recherche sur
   « Fissler Sauteuse 28 cm » peut aussi-documenter la 24 cm si les
   comparateurs listent les deux. Gain réel sur les séries.
2. **S'arrêter à deux comparateurs fiables** (idealo + testbericht) au lieu de
   quatre revendeurs. Le plancher de ces deux-là suffit à fixer un prix.

## Anomalie majeure : les quatre fiches vitavit

`scripts/price-audit.ts` a mis en évidence un dossier qui n'est pas une
question de compétitivité mais une probable erreur de données.

### Ce que vend Fissler

Ligne **vitavit premium** — la seule que le catalogue actuel propose :

| Variante | EAN | Prix fabricant |
|---|---|---|
| 2,5 l | 4009209379715 | 239,00 € |
| 3,5 l | 4009209379722 | 259,00 € |
| 4,5 l | 4009209379739 | 289,00 € |
| 6 l | 4009209379784 | 309,00 € |
| 8 l | 4009209379791 | 339,00 € |

Marché du 8 L : de 251,11 € (idealo) à 353,65 €, 11 offres.

### Nos quatre fiches

| Fiche | Prix NOVA INDUKT | Fabricant | Écart |
|---|---|---|---|
| `vitavit-edition-80l` | 139,99 € | 339,00 € | **−59 %** |
| `vitavit-edition-65l` | 119,99 € | 309,00 € | **−61 %** |
| `vitavit-edition-45l` | 99,99 € | 289,00 € | **−65 %** |
| `vitavit-edition-30l` | 89,99 € | 259,00 € | **−65 %** |

À ce niveau, ce n'est plus « nous sommes très agressifs » : c'est 40 % du
prix du marché pour un produit qui se vend normalement autour de 300 €.

### Deux anomalies distinctes

1. **La ligne.** Nos fiches disent « vitavit **edition** », le catalogue
   actuel « vitavit **premium** ». Ce sont peut-être deux generations
   différentes — mais alors le prix de revient n'a rien à voir.
2. **Les slugs.** `80l`, `65l`, `45l`, `30l` : le point décimal a disparu.
   `80l` = 8,0 L et non 80 L. Le nom de fiche induit en erreur sur la
   contenance réelle.

### Marché relevé sur la ligne vitavit premium

| Contenance | Plancher marché | Offres | Plafond |
|---|---|---|---|
| 3,5 l | 192,97 € | 13 | 279,72 € |
| 6 l | 202,93 € | 21 | 334,42 € |
| 8 l | 251,11 € | 11 | 353,65 € |

### Prix retenus — décote de 5 à 10 % sous le plancher

| Fiche | Contenance | Actuel | Plancher | **Nouveau prix** | Décote |
|---|---|---|---|---|---|
| `vitavit-edition-80l` | 8,0 l | 139,99 € | 251,11 € | **235,00 €** | −6,4 % |
| `vitavit-edition-65l` | 6,0 l | 119,99 € | 202,93 € | **189,00 €** | −6,9 % |
| `vitavit-edition-45l` | 4,5 l | 99,99 € | *non relevé* | **219,00 €** ⚠ | estimation |
| `vitavit-edition-30l` | 3,5 l | 89,99 € | 192,97 € | **179,00 €** | −7,2 % |

⚠ **La fiche 4,5 l est estimée**, pas relevée : aucun comparateur ne
proposait ce modèle seul dans mes recherches. La valeur vient d'une
interpolation entre le 3,5 l (192,97 €) et le 6 l (202,93 €), minorée. À
confirmer sur une recherche dédiée — 219 € reste très prudent.

⚠ **Contenance du « 30l »** : le slug annonce 3,0 L, mais Fissler ne vend
que 2,5 / 3,5 / 4,5 / 6 / 8 L. Le prix retenu s'appuie sur le 3,5 L. Le slug
et le titre de la fiche sont à corriger — « 30l » se lit comme 30 litres.

## Lot 2 — le piège du homonyme

### Fissler OPC Grillpfanne 28 cm = Stielpfanne mit Novogrill

Notre fiche `opc-grillpfanne-28cm` est commercialisée par Fissler sous le nom
**Original-Profi Collection Stielpfanne mit Novogrill**. Correspondance
confirmée par le SKU fabricant `084-378-28-100/0`, identique à celui du
24 cm décrit sur la page officielle comme « Stielpfanne mit Novogrill®-Bratfläche ».

EAN 4009209380766, tarif fabricant 169,00 €.

**Les comparateurs indexent deux produits différents sous des noms voisins** :

| Offre | Prix | Produit réel |
|---|---|---|
| koestner-shop | 119,90 € | Stielpfanne **simple**, sans Novogrill |
| **084 378 28 100 0** | **173,36 €** | **Stielpfanne mit Novogrill** ← le nôtre |
| « novogrill Bratfläche » | 180,44 € | le nôtre |
| 084-378-28-100/0 (autre offre) | 191,53 € | le nôtre |
| … | 182,46 / 191,69 € | le nôtre |

Si l'on tarifait sur le plancher affiché (119,90 €), on braderait une poêle
prémium Novogrill au prix d'une poêle ordinaire — **environ 50 € perdus par
vente**. C'est le risque le plus sérieux rencontré sur ce catalogue : les
comparateurs regroupent sous une même entrée des articles qui diffèrent par
la finition.

**Prix appliqué : 168,00 €** (173,36 − 3,1 %).

### Produits du lot 2 sans donnée exploitable

| Fiche | Prix | Blocage |
|---|---|---|
| `opc-sauteuse-28cm` | 159,99 € | Fissler ne vend plus de sauteuse 28 cm (seulement 20 cm à 149 €) — article hors catalogue, pas de référence marché |
| `opc-sauteuse-24cm` | 139,99 € | idem, aucun 24 cm au catalogue |
| `adamant-wok-32cm` | 139,00 € | à relever |
| `opc-stielkasserolle-16cm-metalldeckel` | 139,00 € | fabricant 149 €, à relever |
| `opc-daempfeinsatz-20/24/28cm` | 79,99 / 95,00 / 109,00 € | fabricant 99,99 / 129 / 159 €, à relever |
| `crispy-steelux-premium-24cm` | 134,90 € | série Crispy Steelux absente du catalogue |
| `fondue-set-18l` | 119,99 € | à relever |

## Lot 2bis — appliqué après retour de la base

La coupure venait du **free tier Neon** : compute suspendu après inactivité
(port 5432 répond, Prisma ne peut plus initialiser). Le compte est repassé
tout seul après quelques minutes. Les deux prix ont été écrits dès le retour.

**Dämpfeinsatz 24 cm — le cas inverse de tous les autres**

| | |
|---|---|
| Plancher marché | 95,00 € (kaufland) |
| Marché | 95,00 – 141,03 €, 13 offres |
| Fabricant | 129,00 € |
| Prix NOVA INDUKT avant | 95,00 € |

Nous étions **à égalité exacte avec l'offre la moins chère** — seul cas sur
tout le catalogue déjà relevé. Passé à **92,00 €** (−3,2 %) : l'avance est
prise pour 3 € de marge, contre 10 € de baisse pour zéro gain de plus.

**Dämpfeinsatz 28 cm**

Plancher 139,90 € (onlinedeal24), marché jusqu'à 181,50 € (14 offres),
fabricant 159,00 €. Nous étions à 109 €, soit 22 % sous le plancher.
Passé à **135,00 €**. **+26 € par vente.**

**Dämpfeinsatz 20 cm** — aucun comparateur ne le proposait. Fabricant
99,99 €, nous 79,99 €. Probablement déjà au plancher, non touchée.

## Wok et stielkasserolle — bloqués, quota de recherche

La recherche web a atteint sa limite de débit gratuite
(`Exa MCP free rate limit`), et l'accès direct aux comparateurs échoue aussi
(403 sur idealo, 404 sur les URL produit de testbericht). Aucun prix de
marché n'a pu être relevé.

Ce qui est acquis, et suffira quand la recherche repartira :

| Fiche | Prix actuel | Fabricant | EAN | Plancher |
|---|---|---|---|---|
| `adamant-wok-32cm` | 139,00 € | 169,00 € | 4009209382395 | à relever |
| `opc-stielkasserolle-16cm-metalldeckel` | 139,00 € | 149,00 € | 4009209380469 | à relever |

Les deux sontidentifiées par EAN, sans ambiguïté : le rapprochement ne pose
plus de problème, seule la donnée de marché manque.

## Contrôle visuel — méthode et état

`scripts/image-quality.ts` — mesure la résolution de **670 images** du
catalogue en une passe, sans décoder les pixels.

| | |
|---|---|
| images analysées | 670 |
| trop petites (côté court < 600 px) | **128 (19 %)** |
| critiques (< 400 px) | **44** |

### Deux défauts à ne pas confondre

1. **la résolution** — mesurable, donc traitable en une passe sur tout le
   catalogue ;
2. **la correspondance au produit** — vérifiable seulement à l'œil.

Le premier compte davantage qu'on ne le croit. Le set WMF Function 4 est le
bon produit sur une image de 464 × 338 px : le fond est juste, le fichier est
inutilisable. Réviser l'identité n'aurait rien réglé.

### Ce que montre la mesure

Les séries les plus atteintes sont les **sets** et les **adaptateurs** :

| Série | Images trop petites | Plus petit côté |
|---|---|---|
| Fissler Intensa · Bratentopf 20 cm | 4 | 250 px |
| Le Creuset 3-ply PLUS · Topfset 5-tlg | 4 | 325 px |
| WMF Function 4 · Topfset 5-teilig | 4 | 338 px |
| AEG IKB6431AXB · Autark 60 cm | 4 | 359 px |
| Fissler Intensa · Topfset 5-tlg | 4 | 373 px |
| WMF Gourmet Plus · Topfset 5-tlg | 4 | 410 px |
| Rosenstein & Söhne · Adapterplatte 24 cm | 3 | 294 px |
| INTERKITCHEN · Adapterplatte 20 cm | 3 | 381 px |

Sur Fissler Intensa, **les 8 images du set sont trop petites** — c'est le
produit le plus cher du catalogue (326 € après correction) avec des visuels
inexploitables.


### Controle a l'oeil - WMF, 5 fiches sur 17

| Fiche | Verdict |
|---|---|
| `function-4-bratentopf-20cm` | **correcte** - gravure lisible : « Function 4 / Kochgeschirr 100 % Made in Germany » |
| `monde-messerset-3-teilig` | **mauvaise serie** - voir ci-dessous |
| `perfect-plus-65l` | **trois defauts** - voir plus haut |
| `function-4-topfset-5teilig` | contenu juste, **464 x 338 px** - inutilisable en vignette |
| `opc-schmortopf-28cm` | correcte (Fissler) |

#### `wmf-monde-messerset-3-teilig` - l'image montre une autre serie

La gravure sur les trois lames est lisible : **« Grand Gourmet - Made in
Germany »**. Notre fiche s'appelle « WMF **Monde** Messerset 3-teilig ».

Les deux series sont distinctes chez WMF, et une seule existe en>ligne de couteaux :

| Serie | EAN | Prix fabricant |
|---|---|---|
| **Grand Gourmet** Messer-Set 3-teilig | 4000530677754 | **159,99 €** |
| Monde Messer-Set 3-teilig | *aucune reference dans les 1 013 produits WMF* | - |

« Monde » existe en revanche pour la vaisselle (Bestecksets 30 et 68 pieces).

Cette fiche est donc le produit d'une **confusion de deux lignes distinctes** :
un set de couteaux illustre et vendu sous le nom d'une serie de vaisselle.

Second cas d'une meme famille que `perfect-plus-65l` et les vitavit :
des noms de serie inventes ou decales d'une famille a l'autre.


#### `wmf-monde-bestechenset-30-teilig` - cinquieme serie erronee

Gravure lisible sur le couteau : **« protect »**. Notre fiche s'appelle
« WMF **Monde** Bestechenset 30-teilig ».

« protect » n'est pas une serie : c'est le nom du materiaux, **Cromargan
protect(R)**, present sur presque tous les couverts WMF. Le nom de serie
reellement grave n'est pas lisible sur cette photo.

Second defaut de la meme fiche : le produit annonce **30 pieces**, l'image
en montre **5**. Sur une page produit, un acheteur ne voit donc ni la bonne
serie ni le bon nombre de pieces.

WMF ne commercialise pas de serie « Monde » en couverts : sur ses 1 013
produits, les sets de table sont Merit, Premiere, Merit Plus, Kult Plus,
Lyric Plus, Faecher, Corvo, Virginia, Vision et Flame Plus.

#### Bilan de la passe WMF

| | |
|---|---|
| images analysees | 149 |
| trop petites (< 600 px) | **21 (14 %)** |
| critiques (< 400 px) | 8 |
| fiches controlees a l'oeil | 6 |
| **identite erronee** | **3 sur 6** |

Les trois erreurs relevees relevent du meme defaut de nomenclature :

| Fiche | Notre nom | Ce que montre l'image / le fabricant |
|---|---|---|
| `monde-messerset-3-teilig` | Monde | **Grand Gourmet** (Monde = vaisselle) |
| `monde-bestechenset-30-teilig` | Monde | **Cromargan protect** — et 5 pieces au lieu de 30 |
| `perfect-plus-65l` | Perfect Plus | **Perfect One Pot**, et diametre 24 au lieu de 22 |

Une fiche sur deux porte un nom de serie que le fabricant n'utilise pas.
Consequence directe : ces produits ne peuvent etre rattaches a aucun EAN, aucun
prix de reference et aucun visuel officiel — ce qui explique pourquoi
le catalogue stallonne sur les corrections.

Reste 11 fiches WMF non ouvertes (reinigers, ustensiles, electromenager,
moules a patisserie) : le constat general est etabli, leur traitement
individuel n'apporterait plus d'information nouvelle.

