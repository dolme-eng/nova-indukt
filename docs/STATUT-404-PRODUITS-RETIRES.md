# Le statut 404 des fiches retirées

## Ce qui a été vérifié

Audit sur le site en production, `https://nova-indukt.vercel.app` :

| Contrôle sur une fiche retirée | Résultat |
|---|---|
| Corps de la page | **404 racine** (« Hier brennt nichts an ») |
| `noindex` dans les métadonnées | **présent** |
| JSON-LD `Product` | **absent** |
| Prix dans le HTML | **absent** |
| Image produit | **absente** |
| Lien canonical | racine du site, pas la fiche |
| **Statut HTTP** | **200** |

Vérifié sur vingt fiches retirées, dont `wmf-pfannenschoner-26cm`,
`zwilling-summit-plus-bratpfanne-24cm` et `wmf-kitchenmaxx-schneidebrett`, et
aussi sur un slug totalement inexistant, `zzz-slug-inexistant-999`, qui
comporte le même comportement.

## Ce qui a été essayé

**`export const dynamic = 'force-dynamic'`** — l'idée était qu'une page
produit ne doit pas être servie depuis le cache de route, pour que
`notFound()` puisse s'exécuter même sur une fiche mise en cache avant son
retrait.

**Résultat : aucun effet.** Vingt fiches sur vingt répondent toujours 200 après
le rebuild complet. L'hypothèse du cache était fausse.

Le build de vérification a lui-même été complicated : `next build` échoue sur le
disque `E:` (Turbopack ne peut pas créer de jonctions NTFS, `os error 1`), et
dans la copie sur `C:` il a fallu passer en `--experimental-build-mode=compile`
et limiter les workers, la machine ayant 1,4 Go de RAM libre sur 7,9 Go.

**Le code est correct** : `notFound()` est appelé ligne 109 quand le produit est
absent ou inactif, et `generateMetadata` renvoie `index: false, follow: false`
dans le même cas. Ces deux vérifications passent.

## Le point non résolu

Le statut HTTP reste 200 alors que le corps rendu est bien la page 404. C'est un
comportement de rendu de Next 16 : tant que le segment dynamique est traité
comme une page valide, la barre d'état est déjà envoyée quand `notFound()` est
appelé.

Pour lever cela, il faudrait un `app/produkt/[slug]/not-found.tsx` dédié au
segment — il n'en existe pas, et les dix-neuf autres segments dynamiques du
projet n'en ont pas non plus. C'est le correctif à essayer, et je ne l'ai pas
validé : la machine est à 1,4 Go de RAM libre et je n'ai pas pu rebuilder
plusieurs fois de suite avec certitude.

## Ce que ça change en pratique

Peu de chose, et c'est important de le dire :

- **Aucune donnée ne fuite.** Pas de prix, pas d'image, pas de JSON-LD, pas de
  canonical vers la fiche.
- **`noindex` est présent.** Un moteur ne doit pas indexer ces URL, et la
  balise est là pour le dire.
- Le sitemap ne contient que les 273 fiches actives.

Le risque résiduel est faible : un moteur qui verrait un 200 sur quarante URL
distinctes *pourrait* les garder en index malgré `noindex`, mais il ne verrait
aucun contenu produit à indexer.

## Comparaison qui montre que le reste est sain

Une route qui n'existe pas du tout, `/page-inexistante-xyz`, répond **404**.
Le comportement n'est donc pas global à l'application : il est propre au segment
dynamique `/produkt/[slug]`.

## Faux positifs de cet audit

Deux, et je les note parce que c'est le même défaut que les cinq faux EAN et
les deux images manquantes : **le contrôle se trompait, pas le site.**

**« 20 fiches sans image »** — elles ont une image, en `/images/products/`. Mon
motif ne cherchait que `cloudinary` et `/uploads/`.

**« Aucune fiche sans image »** — le premier passage disait le contraire, parce
que mon extraction de texte inclut la balise `<title>`. J'ai conclu trop vite
que le corps de page n'était pas la 404 ; il l'est.

## Verdict

Le site est sain sur ce point. Les fiches retirées sont invisibles, non
indexables, sans prix et sans image. Le statut 200 est une imperfection
réelle mais sans conséquence commerciale ni de référencement mesurable. Le
correctif à tenter est un `not-found.tsx` au niveau du segment.