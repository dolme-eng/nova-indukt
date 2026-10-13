# Liste de contrôle par marque

281 fiches actives, 41 marques. Voici ce qu'on sait de chacune, et ce qu'il
resterait à faire pour aller plus loin.

## Méthode

Rien de tout ce qui suit n'a été produit par un rapprochement automatique.
Sept moteurs par nom ont été écrits et sept fois ils ont produit des
faux positifs — un EAN sur une casserole placée sur une pince, une veilleuse
d'un Cobb sur un couvercle. Ce qui suit vient de trois sources fiables :

- **la page fabricant qui porte le code**, quand on a un EAN
- **le catalogue en ligne du fabricant**, interrogeable en JSON chez Shopify
- **le sitemap officiel**, qui liste ce que le fabricant publie encore

Quand une de ces trois sources dit quelque chose, c'est retenu. Quand elle ne
dit rien, la case est marquée « à vérifier » — pas « absent ».

## Les marques à traiter en premier

### WMF — 63 fiches, 8 EAN, 59 visuels

C'est la plus grosse marque du catalogue et la moins documentée.

- `wmf.com` est une boutique **Salesforce Commerce Cloud** : aucune API
  publique, pas de JSON de catalogue. Seules les pages HTML répondent, et
  seulement sur les pages de collection — les pages produits coupent la
  connexion depuis ce poste.
- Le **sitemap est exploitable** : 2073 URL produits, dont nous n'avions au
  départ que 1013 en cache. Le cache est désormais complet (1318 pages, 378
  avec EAN).
- **Aucune archive** : ni `sitemap_de_archive.xml`, ni répertoire d'archive.
  Ce qui est sorti de l'offre n'est plus nulle part sur wmf.com.

Ce qu'on sait avec certitude sur les séries :

| Gamme | État vérifié |
|---|---|
| Function 4 | vivante, 11 pages au sitemap |
| Profi Plus | vivante, 62 pages |
| Diadem Plus | **sortie de l'offre** — 3 pages résiduelles seulement |
| Monde / Mondo | **inexistante** — absente de la page des collections |
| Küchenmaxx | **inexistante** — idem |

**À faire** : 55 fiches sans EAN. La piste série par série, en commençant par
les 12 Function 4 qui ont déjà 8 EAN confirmés.

### Zwilling — 38 fiches, 2 EAN, 38 visuels

- Le sitemap `sitemap_0-product.xml` liste **1986 URL en purs numéros
  d'article** (`1023054.html`). C'est la meilleure clé technique du catalogue :
  le numéro est la référence fabricant.
- Chaque page contient l'EAN en JSON-LD. Méthode vérifiée.
- **Problème** : l'éditeur publie aussi Ballarini et Staub sous la même
  boutique. Nos fiches ne doivent pas être rapprochées de ces pages.
- **Échec documenté** : le rapprochement par nom a produit 3 faux EAN, révoqués
  depuis (Enfinigy pour Now S, Twin Specials pour Plus, Pro pour Spirit).

**À faire** : 36 fiches. Séquence sûre : ouvrir la page du numéro d'article,
lire l'EAN, vérifier que la série et le type concordent.

### Fissler — 37 fiches, 13 EAN, 37 visuels

- **Seule boutique Shopify du catalogue** : `fissler.com/products.json` donne
  **385 produits, 293 EAN**, sans blocage ni quota.
- Deux clés techniques disponibles : le **handle** (égal au slug, ou son
  préfixe) et le **sku** de variante qui est la référence article
  `600-460-03-000`.
- **Résultat sur les 24 fiches sans EAN : 0 présente au catalogue.**

Ce n'est pas un échec de rapprochement. Le catalogue Fissler actuel :

- ne contient **aucun produit OPC** (nos 5 lids et nos 2 sauteuses)
- ne contient **aucun utensile Pure Collection** (nos 7) — la série ne
  subsiste qu'en topsets et lids
- ne contient **aucun Cenit isolé** — seulement un set Catania
- a renommé les topsets Intensa en `intensa-4-tlg-topfset`
- ne propose qu'**un seul** Adamant Comfort, qui ne correspond à aucune de nos
  fiches

**À faire** : décision commerciale. Ces 24 produits sont sortis de l'offre
Fissler mais se revendent sur le marché de l'occasion. Les garder suppose de
les sourcer autrement ; les retirer suppose d'accepter de perdre la gamme.

### Tefal — 20 fiches, 2 EAN, 20 visuels

- Pas d'API. La série **Masterclass n'existe pas** — un contactgrill et un
  waffeleisen portent ce nom dans notre catalogue sans qu'il corresponde à une
  gamme Tefal.
- À vérifier : Talent Pro (référence E44006 annoncée, stock et prix
  incohérents), Jamie Oliver, Natural On.

### Demeyere — 13 fiches, 2 EAN, 13 visuels

- **Boutique Shopify** (`demeyere.be`) — endpoint accessible après refroidissement.
- Séries Atlantis 7, Essential 5, Industry 5, Proline 7 : toutes vivantes.
- 11 fiches sans EAN, récupérables par la méthode handle.

### Staub — 8 fiches, 0 EAN, 8 visuels

- **Boutique Shopify** (`staub.com`). Non encore exploitée : le serveur a
  répondu 502 après quelques requêtes.
- Séries Cocotte, Fondue : à confirmer.

## Les marques secondaires — 111 fiches au total

Toutes à 0 ou 1 fiche, donc faible rendement. Relevé :

| Marque | Fiches | Accès manufacturer | Difficulté |
|---|---|---|---|
| Le Creuset | 12 | Shopify (endpoint bloqué) | signature, quelques articles disponibles |
| Rösle | 10 | site classique | aucun sitemap exploité |
| Silit | 6 | site classique | variante couleur non traitée |
| Miyabi | 6 | non Shopify | sitemap à explorer |
| Victorinox | 6 | non Shopify | sitemap à explorer |
| Siemens, Bosch, Neff, AEG, Miele | 9 | électroménager | série probablement discontinuée |
| IKEA | 4 | non Shopify | produits à vérifier |
| Petromax, Lodge, Chasseur, de Buyer | 11 | sites classiques | sitemap disponible |
| Bob Kramer, Matfer, Kuhn Rikon, Woll | 11 | sites classiques | sitemap disponible |
| Weber, TFA, Soehnle, Dr. Beckmann, Ceraclen | 14 | sites classiques | sitemap disponible |
| Rosenstein & Söhne, AMZCHEF, Dietrix, SKK, Simmerring, Berndes, Stelton, Ballarini, Bora | 16 | longue traîne | un ou deux articles chacun |

## Ce qui ne se fera pas sans intervention

**Les 289 fiches sans EAN.** Le rapprochement par nom est mort — sept échecs
consécutifs, toujours pour la même raison : `plus`, `pro`, `collection` et
`mit Deckel` ne désignent aucune lignée de produit.

Il faut une **saisie manuelle**, ou une source que je n'ai pas :

- un export de grossiste ou d'ERP
- un compte revendeur qui expose les références
- un catalogue papier des marques

## Ordre de priorité recommandé

1. **Zwilling** — la meilleure clé technique du catalogue, 36 fiches
2. **Demeyere et Staub** — Shopify, ~19 fiches, effort faible une fois le
   serveur reposé
3. **Fissler** — décision commerciale avant tout travail technique
4. **WMF** — 55 fiches, mais par séries, Function 4 en premier
5. **Le reste** — 111 fiches en longue traîne, rendement faible

## Deux gestes qui débloquent tout

1. **Révoquer le mot de passe de base de données** exposé en clair dans une
   conversation. Il est dans l'historique.
2. **Une source d'identifiants** — un export de grossiste changerait la nature
   du problème : 289 EAN saisis à la main ne sont pas un travail d'agent.