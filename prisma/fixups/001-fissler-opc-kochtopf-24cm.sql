-- NOVA INDUKT — Audit produit n°1
-- Fissler Original Profi Collection hoher Kochtopf 24 cm
--
-- Contexte
--   La fiche fusionnait deux articles Fissler distincts, tous deux Ø 24 cm :
--     · "hoher Kochtopf" 24 cm  →  9,1 L, 21,5 cm, 3,54 kg, EAN 4009209379890
--     · "Kochtopf"       24 cm  →  6,3 L, 18 cm,   3,17 kg, EAN 4009209379937
--   Le nom annonçait "hoch" (donc la variante 9,1 L) alors que la description
--   et les dimensions annonçaient 6,3 L. Aucun EAN n'était enregistré.
--
-- Décision, réexaminée après accès au catalogue officiel
--   La boutique fissler.com expose un JSON-LD et un tableau `variants` dont les
--   images portent l'EAN dans leur nom de fichier :
--     4009209379890-…  = hoher Kochtopf 24 cm  → tarif fabricant 239,00 €
--     4009209379937-…  = Kochtopf 24 cm        → tarif fabricant 149,00 €
--   Un premier passage avait retenu la variante 6,3 L, sur la foi d'un prix de
--   marché relevé pour elle. C'était l'erreur : les deux articles font 24 cm
--   de diamètre, seule la contenance les distingue, et la fiche s'appelle
--   "hoch". La variante haute est retenue.
--
-- Prix
--   Prix fabricant relevé sur le site officiel      239,00 €
--   Prix NOVA INDUKT conservé                      199,00 €  (-17 %)
--   Le 129,00 € initialement retenu venait du marché de la variante 6,3 L ;
--   l'appliquer ici aurait été une remise de 46 % sur un article plus grand.
--
-- ⚠ VÉRIFIER LA MARGE AVANT EXÉCUTION : cette fiche n'a pas de costPrice.
--   Aucun des 316 produits du catalogue n'en a un.
--
-- Idempotent : peut être rejoué sans effet de bord.
-- Les images ne sont pas traitées ici : elles l'ont été par
-- `scripts/fissler-sync.ts import --apply`, qui pousse le visuel officiel du
-- fabricant sur Cloudinary.

BEGIN;

-- 0. Garde-fou : le EAN est unique en base. Si un autre produit le porte déjà,
--    l'UPDATE échouera sur la contrainte — c'est le comportement voulu.
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM "Product" WHERE "ean" = '4009209379890' AND "slug" <> 'fissler-original-profi-collection-kochtopf-24cm') THEN
        RAISE EXCEPTION 'EAN 4009209379890 déjà attribué à un autre produit — vérifier manuellement';
    END IF;
END
$$;

-- 1. Rectification de la fiche
UPDATE "Product"
SET
    "ean"          = '4009209379890',
    "nameDe"       = 'Fissler Original Profi Collection hoher Kochtopf 24 cm',
    "dimensions"   = 'Ø 24 cm, Höhe 21,5 cm, 9,1 Liter',
    "weightKg"     = 3.54,
    "price"        = 199.00,
    "oldPrice"     = 239.00,
    "metaDescription" = 'Fissler Original Profi Collection hoher Kochtopf 24 cm (9,1 L, Metalldeckel). Inox 18/10, CookStar-Boden, induktionsgeeignet. Hergestellt in Deutschland.',
    "shortDescription" = 'Hoher Profikochtopf aus massivem Edelstahl mit CookStar® Allherdboden - 9,1 L',
    "updatedAt"    = NOW()
WHERE "slug" = 'fissler-original-profi-collection-kochtopf-24cm';

-- 2. Rapport de contrôle
SELECT
    "slug",
    "ean",
    "nameDe",
    "dimensions",
    "weightKg",
    "price",
    "oldPrice",
    (SELECT COUNT(*) FROM "ProductImage" pi WHERE pi."productId" = p."id") AS nb_images
FROM "Product" p
WHERE "slug" = 'fissler-original-profi-collection-kochtopf-24cm';

-- ⚠ RÉSULTAT ATTENDU : nb_images = 1, image officielle Cloudinary.
--   Les 4 images d'origine étaient toutes incorrectes :
--     1.jpg = kochtopf 24 cm mais COUVERCLE EN VERRE
--     2.jpg = casserolle à long manche gravé "GERMANY"
--     3.jpg = Schmortopf à couvercle "GESCHIRRT"
--     4.jpg = gros plan du même type de manche que la casserolle

COMMIT;