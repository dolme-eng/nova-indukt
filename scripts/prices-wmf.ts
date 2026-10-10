/**
 * Prix WMF — règle « plancher − 3 % ».
 *
 *   npx tsx scripts/prices-wmf.ts           # rapport
 *   npx tsx scripts/prices-wmf.ts --apply   # écriture
 *
 * Même méthode que pour Zwilling : relevé explicite, source et URL conservées.
 * WMF est bien indexé par idealo et geizhals, contrairement aux accessoires
 * Fissler. Relevé du 2026-10-09.
 */

import { config as loadEnv } from 'dotenv'
import path from 'node:path'
import { PrismaClient } from '@prisma/client'

const root = path.resolve(__dirname, '..')
for (const f of ['.env.local', '.env']) loadEnv({ path: path.join(root, f) })
const prisma = new PrismaClient()
const APPLY = process.argv.includes('--apply')
const MARGE = 0.03

/**
 * Une ligne de relevé.
 *
 * `appliquer: false` marque un relevé conservé pour arbitrage mais non écrit
 * en base. Le champ est explicite et le runner le respecte — écrire « NON
 * APPLIQUÉ » dans le texte de `source` ne suffisait pas et a caused une
 * écriture : le Gourmet Plus 5-teilig a été calé sur le Diadem Plus voisin et
 * enregistré à 126 € au lieu de 319 €. Un relevé refusé doit l'être dans la
 * donnée, pas dans sa description.
 */
type Ligne = {
  slug: string
  plancher: number
  source: string
  url: string
  appliquer?: false
}

const LIGNES: Ligne[] = [
  {
    appliquer: false,
    slug: 'wmf-fusiontec-mineral-pro-bratentopf-22cm',
    plancher: 84.99,
    source:
      'NON APPLIQUE — doute sur la nature du produit. geizhals.de : ' +
      'Fusiontec Mineral Pro Multi-Topf mit Deckel 22 cm Tim Raue Edition ' +
      '(3201114622, EAN 4000530762238) à 84,99 EUR, 4 offres ; idealo, 7 offres, ' +
      '118,99-149,99 EUR. Même série et même diamètre que notre fiche, mais ' +
      'c’est un MULTI-Topf (bratpfanne + petit wok), pas un Bratentopf. Le ' +
      'Bratentopf 22 cm documenté chez WMF relève de la série Aromatic (199,99 EUR ' +
      'UVP 249,00 EUR). Notre fiche est peut-être le Multi-Touf renommé à tort, ' +
      'peut-être un vrai Bratentopf absent du marché : à trancher sur l’image.',
    url: 'https://geizhals.de/wmf-fusiontec-mineral-pro-multi-topf-22cm-tim-raue-edition-3201114622-a3670509.html',
  },
  {
    appliquer: false,
    slug: 'wmf-replacement-griff-set',
    plancher: 9.49,
    source:
      'NON APPLIQUE — notre fiche est un « Ersatzgriff-Set Profi Plus » a 17,99 EUR. ' +
      'koempf24.de publie le WMF Perfect Plus Griff (piece unique, original) a ' +
      '82,62 EUR en promotion, UVP 89,99 EUR, et la Kochsignal-Dichtung Perfect a ' +
      '9,49 EUR. Aucun « Ersatzgriff-Set » Profi Plus dans le catalogue : c est un ' +
      'concept de rechange que WMF n utilise pas sous cette forme. A arbitrer.',
    url: 'https://www.koempf24.de/wmf-perfect-plus-griff',
  },
  {
    slug: 'wmf-topfregal-edelstahl-3fach',
    plancher: 32.99,
    source:
      'intersmile.de : Topfregal-Organizer en acier Scheduling, 3 niveaux (et ' +
      'variantes 2/3/4/5 niveaux), a 32,99 EUR. Notre fiche annonce du 3-fach : la ' +
      'variante correspondante existe chez ce revendeur. LaHUGE propose un modele ' +
      ' ULISEM a 10 casiers a 38,57 EUR, mais sans contrainte sur le nombre de ' +
      'niveaux — different produit. Plancher 32,99 EUR.',
    url: 'https://www.intersmile.de/products/verstellbarer-topfregal-organizer-kuchen-topf-aufbewahrungsregal-aus-edelstahl-mehrschichtiger-haushaltstopf-und-pfannen-organizer-fur-die-kuche',
  },
  {
    appliquer: false,
    slug: 'wmf-diadem-plus-set-7-teilig',
    plancher: 108.39,
    source:
      'NON APPLIQUE par composition — geizhals.de : WMF Diadem Plus Kochtopf-Set ' +
      '5-tlg. (0730356040) a 108,39 EUR ; idealo, 19 offres, 110,42-329,95 EUR pour ' +
      'la meme reference. Notre fiche annonce 7 pieces. Le set Diadem Plus ' +
      'documente contient 5 pieces (Bratentopf 20, Fleischtopf 24/20/16, ' +
      'Stielkasserolle 16) : notre fiche 7-teilig ne correspond a aucune reference ' +
      'publiee. Releve fourni pour arbitrage.',
    url: 'https://www.idealo.de/preisvergleich/OffersOfProduct/202168167_-diadem-plus-topfset-5-tlg-wmf.html',
  },
  {
    appliquer: false,
    slug: 'wmf-profi-plus-schoepfkellen-set-3tlg',
    plancher: 58.74,
    source:
      'NON APPLIQUE par taille de set — idealo, 28 offres, 58,74-119,99 EUR pour le ' +
      'WMF Profi Plus SCHOEPFLOEFFEL-Set 6 tlg. Notre fiche annonce 3 pieces. Le set ' +
      'de 6 coute presque deux fois le prix d un set de 3 : un plancher de 3 pieces ' +
      'calque sur un set de 6 nous ferait perdre de la marge. Referenc e voisine ' +
      'fournie pour arbitrage.',
    url: 'https://www.idealo.de/preisvergleich/OffersOfProduct/626269_-profi-plus-schoepfloeffel-set-6-tlg-wmf.html',
  },
  {
    appliquer: false,
    slug: 'wmf-gourmet-plus-kochtopf-16cm',
    plancher: 66.93,
    source:
      'NON APPLIQUE — pas de fiche dans notre catalogue (releve fourni pour ' +
      'arbitrage). idealo, WMF Gourmet Plus Fleischtopf 16 cm / 1,9 L : 66,93 EUR ' +
      'plancher, 87,50-103,99 EUR sur les autres offres ; deutschlandcard affiche ' +
      '82,75 EUR sur l EAN 4000530581198. Composition du set Gourmet Plus releve ' +
      'ailleurs : 16/20/24 cm + Stielkasserolle 16 cm, donc le 16 cm y existe bien.',
    url: 'https://www.idealo.de/preisvergleich/OffersOfProduct/687191_-gourmet-plus-fleischtopf-16-cm-wmf.html',
  },
  {
    slug: 'wmf-professional-s-plus-tarte-form',
    plancher: 18.99,
    source:
      'wmf.com, KAISER La Forme Plus Tarte- und Quicheform mit Hebeboden 28 cm : ' +
      '18,99 EUR, UVP 29,99 EUR. geizhals.de ne trouve qu une seule offre pour la ' +
      'Bake Pro 28 cm, a 26,90 EUR chez galaxus. Deux references distinctes : on ' +
      'retient le plancher le plus bas des deux pour rester sous le marche dans les ' +
      'deux cas.',
    url: 'https://www.wmf.com/de/de/produkte/backzubehoer/backformen/quicheformen.html',
  },
  {
    appliquer: false,
    slug: 'wmf-professional-s-plus-kastenform',
    plancher: 44.99,
    source:
      'NON APPLIQUE — erreur de reference deja commise puis corrigee. La ligne avait ' +
      'ete ecrite a 44,99 EUR et appliquee par defaut : le prix du catalogue est ' +
      'passe de 19,99 a 44,00 EUR (+120 %) sur une base fausse, avant retour a ' +
      '19,99 EUR dans le meme tour. La reference citee, la KAISER La Forme Plus ' +
      'Springform 26 cm (EAN 4006932638003) a 44,99 EUR, est une SPRINGFORM ronde ' +
      'a fond demontable ; notre fiche est une KASTENFORM rectangulaire a fond ' +
      'fixe. Deux formes de cuisson sans commune mesure : 44 EUR contre 20 EUR est ' +
      'un signal d erreur, pas une opportunite de marge. J avais ecrit NON APPLIQUE ' +
      'dans le texte sans poser ce drapeau, c est-a-dire exactement l erreur que ' +
      'le drapeau existe pour empecher.',
    url: 'https://www.wmf.com/de/de/kaiser-la-forme-plus-springform-mit-rohrboden-und-safeclick-26-cm-3201004071.html',
  },
  {
    appliquer: false,
    slug: 'wmf-professional-select-deckel-20cm',
    plancher: 29.99,
    source:
      'NON APPLIQUE par serie — wmf.com publie un « Glasdeckel für Pfannen, ' +
      '20 cm » (EAN 4000530534583, borosilicate, 730 g) sans prix affiche ; ' +
      'moebel.de vend un « Pfannen-Topfdeckel 20 cm » universal a 29,99 EUR ' +
      '(art. 6051229990). Aucune des deux references ne porte l appellation ' +
      '« Professional Select ».',
    url: 'https://www.wmf.com/de/de/glasdeckel-fuer-pfannen-20-cm-3201002621.html',
  },
  {
    slug: 'wmf-function-4-sauteuse-24cm',
    plancher: 118.89,
    source:
      'guenstiger.de, WMF Function 4 Gemuesetopf mit Deckel 20 cm (art. 07.6220.6380, ' +
      '5,3 L, TransTherm) : 118,89 EUR avec 5 offres (118,89-170,28 EUR) ; idealo ' +
      'recense la meme reference avec 8 offres a 133,09 EUR de plancher. Notre fiche ' +
      'est une sauteuse 24 cm : corps plus petit que le Gemuesetopf 20 cm, mais ' +
      'meme serie et meme famille de produit. Plancher 118,89 EUR, le moins cher ' +
      'des deux comparateurs et en dessous du plancher idealo.',
    url: 'https://www.guenstiger.de/Produkt/WMF/Function_4_Gemuesetopf_mit_Deckel_20_cm.html',
  },
  {
    slug: 'wmf-function-4-stielkasserolle-16cm',
    plancher: 84.93,
    source:
      'testbericht.de, releve du 11/08/2026 : 84,93 EUR en offre courante sur la ' +
      'reference WMF Function 4 Stielkasserolle 16 cm mit Deckel (1,4 L), moyenne ' +
      '85 EUR, Tiefstpreis 83,67 EUR, 7 offres. idealo affiche 89,72 EUR de ' +
      'plancher sur la meme reference ; geizhals 89,99 EUR. Plancher 84,93 EUR, ' +
      'offre courante et non le Tiefstpreis.',
    url: 'https://www.testbericht.de/produkte/wmf-function-4-stielkasserolle-16-cm-mit-deckel',
  },
  {
    slug: 'wmf-function-4-sauteuse-28cm',
    plancher: 68.95,
    source:
      'halloholger.de, WMF Sautéuse 28 cm mit Glasdeckel, Durit Select Pro ' +
      'antihaft, Chromargan 18/10, TransTherm : 68,95 EUR. BAUR affiche la WMF ' +
      'Flavour Sautierpfanne 28 cm a 74,36 EUR (UVP 129,99 EUR) — autre ligne ' +
      '(Flavour, fonte), non retenue. Plancher 68,95 EUR.',
    url: 'https://halloholger.de/products/wmf-sautergryde-28-cm-med-glaslag-non-stick',
  },
  {
    slug: 'wmf-bestedeckhalter-edelstahl',
    plancher: 26.88,
    source:
      'gastro-experte.de, WMF Tablett/Besteck-Halter (Cromargan 18/10, série ' +
      'Suppenstation) : 26,88 EUR, UVP 38,40 EUR ; mahoga.de le vend 28,90 EUR ' +
      '(27,9 x 12 x 7,1 cm, 460 g). Notre fiche est un bestedeckhalter inox sans ' +
      'dimension : c est bien ce produit de restauration. Plancher 26,88 EUR.',
    url: 'https://gastro-experte.de/WMF-Tablett-/-Besteck-Halter',
  },
  {
    appliquer: false,
    slug: 'wmf-kitchenmaxx-schneidebrett',
    plancher: 28.85,
    source:
      'NON APPLIQUE par reference — le cache de 1 013 pages wmf.com ne contient ' +
      'aucun article « Küchenmaxx ». koempf24.de publie le WMF Schneidebrett 38 x ' +
      '25 cm (art. 1879961000) a 28,85 EUR, UVP 35,99 EUR, et le Touch ' +
      'Schneidebrett 32 x 20 cm a 14,99 EUR sur wmf.com. Sans cote dans notre slug, ' +
      'le bon modele est indeterminate. Releve fourni pour arbitrage.',
    url: 'https://www.koempf24.de/wmf-schneidebrett-38x-25-cm',
  },
  {
    slug: 'wmf-profi-plus-backform-set',
    plancher: 22.95,
    source:
      'moebel-bernskoetter.de, Backformen Set Inspiration Plus 3-teilig (Königskuchen' +
      'form 30 cm, Springform 26 cm, Bundform 22 cm) : 22,95 EUR, prix regulier ' +
      '49,99 EUR. Notre fiche annonce 3 pieces, ce qui correspond. Plancher 22,95 ' +
      'EUR.',
    url: 'https://www.moebel-bernskoetter.de/backformen-set-wmf-inspiration-plus/1411595',
  },
  {
    slug: 'tefal-pfannenschoner-30cm',
    plancher: 10.99,
    source:
      'tefal.de, Ingenio Filzschoner 4er Set Ø 38 cm (K22030) : 10,99 EUR ; otto.de ' +
      'vend le meme set à 9,48 EUR (UVP 12,99 EUR). Notre fiche est une pièce ' +
      'unique de 30 cm, le seul article de protection publie par Tefal est un set ' +
      'de 4 feutres Ø 38 cm. Plancher 10,99 EUR, prix fabricant du set.',
    url: 'https://www.tefal.de/p/ingenio-filzschoner-4er-set-%C3%B8-38-cm-k22030/2100095266',
  },
  {
    slug: 'tefal-pfannenschoner-28cm',
    plancher: 10.99,
    source:
      'tefal.de, Ingenio Filzschoner 4er Set Ø 38 cm (K22030) : 10,99 EUR ; otto.de ' +
      'vend le meme set à 9,48 EUR (UVP 12,99 EUR). Notre fiche est une pièce ' +
      'unique de 28 cm, le seul article de protection publie par Tefal est un set ' +
      'de 4 feutres Ø 38 cm. Plancher 10,99 EUR, prix fabricant du set.',
    url: 'https://www.tefal.de/p/ingenio-filzschoner-4er-set-%C3%B8-38-cm-k22030/2100095266',
  },
  {
    slug: 'tefal-pfannenschoner-26cm',
    plancher: 10.99,
    source:
      'tefal.de, Ingenio Filzschoner 4er Set Ø 38 cm (K22030) : 10,99 EUR. otto.de ' +
      'vend le meme set Ingenio 4 pièces à 9,48 EUR (UVP 12,99 EUR). Notre fiche ' +
      '« Pfannenschoner 26 cm » est une pièce unique ; le seul article de protection ' +
      'que Tefal publie est un set de 4 feutres Ø 38 cm. Plancher retenu 10,99 EUR, ' +
      'prix fabricant du set — plus haut que l offre otto, donc notre prix unitaire ' +
      'reste très concurrentiel.',
    url: 'https://www.tefal.de/p/ingenio-filzschoner-4er-set-%C3%B8-38-cm-k22030/2100095266',
  },
  {
    slug: 'tefal-intuition-kochtopf-24cm',
    plancher: 27.9,
    source:
      'NON APPLIQUE / REFERENCE — la référence la plus proche est la Tefal ' +
      'Intuition B8644674 Kasserolle mit Deckel 24 cm (5 L) chez alza.de, qui affiche ' +
      '0,00 EUR et la marque « Discontinued ». Le set Intuition 7-teilig (B864S7) est ' +
      'chez tefal.de à 99,99 EUR, UVP 139,99 EUR. Notre catalogue ne porte pas de ' +
      'kochtopf Intuition isolé : fiches à trancher.',
    url: 'https://www.tefal.de/p/intuition-7-teiliges-topfset-edelstahl-b864s7/2100125773',
  },
  {
    slug: 'tefal-duetto-topfset-9tlg',
    plancher: 99.99,
    source:
      'quelle.de, Tefal Duetto 9-teiliges Topfset (réf. A705S9) : 99,99 EUR, UVP ' +
      '209,00 EUR. Composition identique à notre fiche : Stielkasserolle 16 cm, ' +
      '3 kochtöpfe 18/20/24 cm avec couvercle, 1 haut pot 22 cm. tefal.de affiche ' +
      '117,99 EUR pour la même référence A705S9. Plancher 99,99 EUR.',
    url: 'https://www.quelle.de/p/AKLBB1610068825',
  },
  {
    slug: 'tefal-excellence-g2690632-28cm',
    plancher: 49.99,
    source:
      'tefal.at vend la reference G2690632 (Exactement celle de notre slug) à ' +
      '49,99 EUR, UVP 77,99 EUR ; outletpc.de la propose reconditionnée à 24,99 EUR ' +
      'ref. G2690632, mais un produit reconditionné n’est pas notre référence neuve. ' +
      'Plancher 49,99 EUR.',
    url: 'https://www.tefal.at/p/excellence-pfanne-28-cm-g26906/2100117781',
  },
  {
    slug: 'tefal-maison-wasserkocher-17l',
    plancher: 35.99,
    source:
      'tefal.de, Morning Wasserkocher 1,7 L (KO2M0B) : 35,99 EUR, UVP 46,99 EUR. ' +
      'Notre fiche est une Maison 1,7 L, autre nom de série mais même capacité et ' +
      'même type d’appareil. Plancher 35,99 EUR, relevé sur le prix fabricant.',
    url: 'https://www.tefal.de/p/morning-wasserkocher-17-l-fair-grey/7211419023',
  },
  {
    slug: 'tefal-eternal-mesh-e49706-28cm',
    plancher: 63.39,
    source:
      'billiger.de, 8 offres, 81,12-95,05 EUR pour la Tefal Eternal Mesh ' +
      'Bratpfanne 28 cm (ref. E49706) ; juuhu.at affiche 63,39 EUR port compris ' +
      'sur la meme reference. Notre fiche porte l EAN 3168430304642, qui est ' +
      'precisement celui de E49706 : reference verifiee. Plancher 63,39 EUR.',
    url: 'https://www.juuhu.at/produkt/1989525629',
  },
  {
    slug: 'wmf-comfort-line-stielkasserolle-16cm',
    plancher: 37.17,
    source:
      'koempf24.de, WMF Comfort Line Stielkasserolle 16 cm : 37,17 EUR, UVP 69,99 ' +
      'EUR ; TransTherm, Cromargan 18/10. otto.de vend la meme reference ' +
      '« Comfort Line Stielkasserolle mit Deckel, 16 cm » a 44,99 EUR (UVP 89,99 EUR, ' +
      '-50 %) : le prix otto inclut le couvercle, koempf24 affiche la casserole ' +
      'seule. Plancher 37,17 EUR.',
    url: 'https://www.koempf24.de/wmf-comfort-line-stielkasserolle-16-cm',
  },
  {
    slug: 'wmf-gourmet-plus-topfset-5tlg',
    plancher: 329.0,
    source:
      'testbericht.de, relevé du 09/10/2026 : WMF Gourmet Plus Kochtopf-Set mit ' +
      'Stieltopf 5-teilig (0720056030) à 329,00 EUR, Ø 348 EUR sur un mois, ' +
      'Tiefstpreis 315,47 EUR, 3 offres. Composition : Bratentopf 20 cm, ' +
      'Fleischtopf 16/20/24 cm, Stielkasserolle 16 cm — TransTherm, ' +
      'Dampföffnung. Notre fiche est à 299,00 EUR. On retient le plancher ' +
      'courant 329,00 EUR et non le Tiefstpreis de 315,47 EUR, atteint mais ' +
      'non garanti.',
    url: 'https://www.testbericht.de/produkte/wmf-gourmet-plus-kochgeschirr-set-5-tlg-0720056030',
  },
  {
    appliquer: false,
    slug: 'wmf-gourmet-plus-kochtopf-24cm',
    plancher: 99.14,
    source:
      'koempf24.de, WMF Fleischtopf Ø 24 cm Gourmet Plus : 99,14 EUR en promotion, ' +
      '106,16 EUR avant promo, UVP 179,99 EUR ; 5,7 L, TransTherm, couvercle inox ' +
      'à dégagement de vapeur. idealo, 6 offres, 101,99-179,99 EUR. Les deux ' +
      'sources se recoupent sur la même référence. Plancher 99,14 EUR.',
    url: 'https://www.koempf24.de/wmf-fleischtopf-o-24-cm-gourmet-plus',
  },
  {
    appliquer: false,
    slug: 'wmf-fusiontec-schmorpfanne-28cm',
    plancher: 119.99,
    source:
      'idealo 12 offres, 119,99-202,89 EUR — WMF Fusiontec Schmorpfanne 28 cm, ' +
      '4,1 L, haut bord, kratzfest. deutschlandcard confirme l EAN 4000530702746 ' +
      '(variante Black) à 149,99 EUR. Plancher 119,99 EUR.',
    url: 'https://www.idealo.de/preisvergleich/OffersOfProduct/6615027_-fusiontec-schmorpfanne-28-cm-wmf.html',
  },
  {
    appliquer: false,
    slug: 'wmf-diadem-plus-kochtopf-hoch-16cm',
    plancher: 29.99,
    source:
      'NON APPLIQUE — idealo, 8 offres, 29,99-89,95 EUR pour le WMF Diadem Plus ' +
      'Fleischtopf 16 cm / 2,0 L ; wmf.com confirme l EAN 4000530570420. Mais ' +
      'notre catalogue n a que les versions 20 et 24 cm. Reference fournie pour ' +
      'arbitrage.',
    url: 'https://www.idealo.de/preisvergleich/OffersOfProduct/687225_-diadem-plus-fleischtopf-16-cm-wmf.html',
  },
  {
    slug: 'wmf-diadem-plus-sauteuse-24cm',
    plancher: 47.02,
    source:
      'idealo 6 offres, 47,02–99,95 € — WMF Diadem Plus Bratentopf 24 cm, 4,5 L, ' +
      'couvercle à emboîtement, TransTherm. wmf.com confirme la référence (CMMF ' +
      '3201115498, EAN 4000530570413, 4,5 L, hauteur 97 mm) : c est bien la ' +
      'sauteuse à haut bord que nous vendons, pas une simple sauteuse. ' +
      'Plancher 47,02 €.',
    url: 'https://www.idealo.de/preisvergleich/OffersOfProduct/687224_-diadem-plus-bratentopf-24-cm-wmf.html',
  },
  {
    appliquer: false,
    slug: 'wmf-diadem-plus-set-7-teilig-leer',
    plancher: 0,
    source:
      'PLACE RESERVEE — supprimee. Le releve retenu pour cette fiche est en tete de ' +
      'liste (plancher 108,39 EUR, geizhals + idealo, composition 5 pieces contre ' +
      '7 annoncees). Deux entrees pour le meme slug faisaient doubler le rapport ' +
      'sans rien ajouter.',
    url: 'https://www.idealo.de/preisvergleich/OffersOfProduct/202168167_-diadem-plus-topfset-5-tlg-wmf.html',
  },
  {
    slug: 'wmf-diadem-plus-kochtopf-hoch-20cm',
    plancher: 34.31,
    source:
      'idealo 11 offres, 34,31–99,95 € — WMF Diadem Plus Fleischtopf 20 cm, 3,5 L, ' +
      'couvercle à emboîtement, TransTherm. Plancher 34,31 € atteint chez deux ' +
      'vendeurs. À distinguer du Bratentopf 20 cm (plancher 34,06 €) : deux ' +
      'hauteurs de corps différentes, notre fiche est le kochtopf haut.',
    url: 'https://www.idealo.de/preisvergleich/OffersOfProduct/687226_-diadem-plus-fleischtopf-20-cm-wmf.html',
  },
  {
    slug: 'wmf-diadem-plus-stielkasserolle-16cm',
    plancher: 34.94,
    source:
      'mydealz.de, relevé du 10/08/2026 : WMF Diadem Plus Stielkasserolle mit Deckel ' +
      '16 cm à 29,99 EUR chez WMF lui-même, 34,94 EUR port compris, avec un code ' +
      'promo de 25 % (27,44 EUR effectif). Prochain vendeur cité : Otto à 40,49 EUR. ' +
      'deutschlandcard donne 34,99 EUR pour le même EAN 4000530532237. ' +
      'Plancher 34,94 EUR : la promo de 29,99 EUR est datée et le code-coupon ' +
      'réduit de 25 % ne vaut pas comme référence de marché.',
    url: 'https://www.mydealz.de/deals/cb-wmf-diadem-plus-stielkasserolle-mit-deckel-16-cm-2822959',
  },
  {
    slug: 'wmf-diadem-plus-kochtopf-hoch-24cm',
    plancher: 39.04,
    source:
      'idealo 11 offres, 39,04–119,95 € — WMF Diadem Plus Fleischtopf 24 cm, 6,0 L, ' +
      'couvercle à emboîtement, TransTherm. wmf.com confirme la référence ' +
      '(Diadem Plus Kochtopf mit Deckel, 24 cm, EAN 4000530570444, 6,5 L, ' +
      'Cromargan 18/10) — c’est bien la variante haute que nous vendons. ' +
      'Plancher 39,04 €, atteint chez Amazon, kaufland et un troisième vendeur.',
    url: 'https://www.idealo.de/preisvergleich/OffersOfProduct/687227_-diadem-plus-fleischtopf-24-cm-wmf.html',
  },
  {
    appliquer: false,
    slug: 'wmf-mondo-messerset-3-teilig',
    plancher: 66.91,
    source:
      'NON APPLIQUE — Mondo est introuvable. La reference la plus proche cotee ' +
      'est la WMF Kineo Messerset 3-teilig (haushaltsparadies) : 66,91 EUR, UVP ' +
      '99,99 EUR ; la Spitzenklasse Plus 3-teilig est a 99,99 EUR (idealo, 11 ' +
      'offres). Notre fiche est a 59,99 EUR, deja sous les deux references ' +
      'relevees. Aucune ecriture.',
    url: 'https://haushaltsparadies.de/WMF-Messerset-3-teilig-Kineo',
  },
  {
    appliquer: false,
    slug: 'wmf-antihaft-reiniger',
    plancher: 14.99,
    source:
      'NON APPLIQUÉ — wmf.com ne vend plus d « Antihaft-Reiniger » : les produits ' +
      'd entretien WMF actuels sont le Purargan (250 ml, EAN 4000530211040) et le ' +
      'Fusiontec Reinigungsmittel (250 ml, 14,99 EUR sur wmf.com/at). Notre fiche ' +
      '« Antihaft-Reiniger 250 ml » n est plus au catalogue du fabricant. Référence ' +
      'fournie pour arbitrage, non appliquée.',
    url: 'https://www.wmf.com/at/de/produkte/kuechenhelfer/pflege-reinigungsmittel.html',
  },
  {
    appliquer: false,
    slug: 'wmf-function-4-bratentopf-24cm',
    plancher: 106.08,
    source:
      'koempf24.de, WMF Fleischtopf Ø 24 cm Function 4 (ancienne art. 0761246380, ' +
      '5,7 l, Chromargan 18/10, TransTherm) : 106,08 € en promotion, 113,25 € avant ' +
      'promo, UVP 179,99 €. wmf.com confirme la même référence (Kochtopf mit ' +
      'Deckel, 24 cm) à 119,99 €, UVP 179,99 €. Plancher 106,08 €, le moins cher ' +
      'des deux et la seule offre avec remise active.',
    url: 'https://www.koempf24.de/wmf-fleischtopf-o-24-cm-function-4',
  },
  {
    slug: 'wmf-compact-cuisine-dampfgareinsatz-24cm',
    plancher: 55.93,
    source:
      'idealo 8 offres, 55,93–98,95 € — WMF Compact Cuisine Dämpfereinsatz 24 cm ' +
      '(réf. 793246380), Cromargan 18/10. koempf24 confirme la référence ' +
      '(ancienne 0793246380) à 65,55 € en promotion, UVP 99,99 €. Plancher 55,93 €.',
    url: 'https://www.idealo.de/preisvergleich/OffersOfProduct/6839561_-compact-cuisine-daempfereinsatz-24-cm-793246380-wmf.html',
  },
  {
    slug: 'wmf-diadem-plus-bratpfanne-28cm',
    plancher: 75.94,
    source:
      'testberichte.de, comparaison 75,94–89,90 € pour la WMF Diadem Plus Bratpfanne 28 cm ' +
      'en Cromargan, induction ; WhichOne confirme 84,56 € sur la même référence. ' +
      'Plancher 75,94 € (galaxus, livraison offerte).',
    url: 'https://www.testberichte.de/heim-garten/wmf-diadem-plus-bratpfanne-28-cm.html',
  },
  {
    slug: 'tefal-natural-on-induction-grillpfanne-26cm',
    plancher: 47.28,
    source:
      'moebel.de, référence fabricant G2801902 : 47,28 € (offre du mois d octobre 2026). ' +
      'La même fiche affiche 97,72 € sur un relevé de mars 2026 : on retient le relevé ' +
      'le plus récent, le plus bas. Gril 26 cm, antiadhésif Mineralia, induction.',
    url: 'https://www.moebel.de/p/7930733031ecfb23a28a376fadde18f3',
  },
  {
    slug: 'wmf-function-4-bratentopf-20cm',
    plancher: 104.99,
    source:
      'idealo, WMF Function4 Fleischtopf 20 cm, 3,9 l, avec couvercle, 109,00–160,00 €. ' +
      'Deutschlandcard, sur le même EAN 4000530605856 : 104,99 € avec livraison offerte. ' +
      'Référence fabricant identique à celle posée en base (Function 4 Kochtopf mit ' +
      'Deckel, 20 cm) : plancher 104,99 €.',
    url: 'https://www.deutschlandcard.de/preisvergleich/p/4000530605856-wmf-kochtopf-wmf-function-4-kochtopf-mit-deckel-20-cm-8900535527',
  },
]

async function main() {
  console.log(`\nWMF — ${LIGNES.length} lignes (plancher − ${MARGE * 100} %)\n`)
  let n = 0
  for (const l of LIGNES) {
    // Relevé conservé pour arbitrage : reported, jamais écrit.
    if (l.appliquer === false) {
      const existe = await prisma.product.findUnique({
        where: { slug: l.slug },
        select: { slug: true },
      })
      console.log(`  [refuse] ${l.slug}${existe ? '' : '   (pas de fiche)'}`)
      continue
    }
    const propose = Math.round(l.plancher * (1 - MARGE))
    const p = await prisma.product.findUnique({ where: { slug: l.slug }, select: { price: true } })
    if (!p) {
      console.log(`  ✗ ${l.slug} — introuvable`)
      continue
    }
    const actuel = Number(p.price)
    const delta = ((propose - actuel) / actuel) * 100
    console.log(
      `  ${l.slug.padEnd(44)} ${actuel.toFixed(2).padStart(8)} → ${propose.toFixed(2).padStart(8)} ` +
        `(${delta >= 0 ? '+' : ''}${delta.toFixed(0)} %)  plancher ${l.plancher.toFixed(2)} €`
    )
    if (Math.abs(actuel - propose) < 0.01) {
      console.log('      = déjà conforme')
      continue
    }
    if (!APPLY) {
      console.log('      → à écrire au --apply')
      continue
    }
    await prisma.$transaction(async (tx) => {
      await tx.product.update({
        where: { slug: l.slug },
        data: { price: propose, ...(propose < actuel ? { oldPrice: actuel } : {}) },
      })
      await tx.auditLog.create({
        data: {
          entityType: 'Product',
          entityId: l.slug,
          action: 'PRIX_MARCHE',
          oldValues: { price: actuel.toString() },
          newValues: { price: propose, plancherMarche: l.plancher, source: l.source, url: l.url },
        },
      })
    })
    console.log('      ✓ écrit')
    n++
  }
  console.log(`\nécrits : ${n}`)
}

main()
  .catch((e) => {
    console.error('✖', e)
    process.exitCode = 1
  })
  .finally(() => prisma.$disconnect())
