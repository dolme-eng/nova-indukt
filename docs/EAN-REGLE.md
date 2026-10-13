# EAN — ce qui marche, ce qui ne marche pas

## Règle

**Un EAN absent est sans gravité. Un EAN faux est pire que pas d'EAN du tout.**

Un EAN absent nous dit seulement qu'on ne sait pas. Un EAN faux désigne un
autre produit : il fausse les comparateurs, cale des prix sur la mauvaise
référence, et renvoie le visiteur vers un article qui n'est pas celui qu'il a
commandé. On ne le découvre pas tout seul — il faut aller le lire chez le
fabricant.

## Le test qui tranche

Pour chaque EAN posé sur une fiche, ouvrir **la page qui porte ce code** et lire
ce qu'elle annonce. Comparer à la fiche.

- le nom fabricant reprend la série, le type et la cote → l'EAN est bon
- le nom fabricant désigne un autre produit → l'EAN est à retirer

C'est une égalité, pas une ressemblance. C'est la seule vérification qui
marche, et elle ne coûte qu'une page à ouvrir.

## Cinq EAN révoqués sur cette base

| Fiche | Ce que le code annonce réellement |
|---|---|
| `wmf-diadem-plus-deckel-20cm` | un **Bratentopf** 20 cm — pas un couvercle |
| `wmf-diadem-plus-deckel-24cm` | un **Bratentopf** 24 cm — pas un couvercle |
| `wmf-kitchenline-wasserkocher` | gamme **Stelio** — pas KitchenLine |
| `zwilling-plus-kochtopf-hoch-24cm` | gamme **Pro** — pas Plus |
| `wmf-function-4-set-7-teilig` | **Fusiontec Function Pro**, 4 pièces — pas Function 4 en 7 |

Les cinq avaient passé le rapprochement par type, par cote, et même par série.
Ils ont été trouvés en confrontant les 32 EAN déjà connus au cache, c'est-à-dire
en vérifiant ce qu'on croyait savoir vrai.

## Pourquoi le rapprochement automatique échoue

Sept moteurs écrits, sept familles de faux positifs. Toutes les erreurs sont des
mots qui semblent identifier une lignée et n'en identifient aucune :

| Mot | Gammes qui le portent |
|---|---|
| `plus` | Diadem Plus, Gourmet Plus, Provence Plus, Perfect Plus, Profi Plus |
| `pro` / `premium` / `advanced` | Pro S, Pro Wood, Pure, Premium, Advanced |
| `collection` / `classic` / `line` | partout |
| `mit Deckel` | toute marmite a un couvercle — la vapeuruse n'est pas un couvercle |

Un accessoire n'a pas de nom propre : « Topfdeckel 24 cm » est le nom de
centaines de références différentes. Appeler un couvercle par son diamètre
revient à dire qu'il est interchangeable avec n'importe quel autre.

**Conclusion : on ne rapproche pas par le nom.** Seul l'EAN fait foi, et il faut
le vérifier sur la page qui le porte.

## L'état

- **27** fiches actives avec EAN, tous vérifiés sur la page fabricant
- **289** sans EAN
- Tout rapprochement automatique est abandonné : il produit des associations
  Silent ones, et le coût d'un faux positif dépasse le gain d'un vrai.