# Phase 3 + Phase 4 — Catalog Expansion: +119 Products (13 Categories)

## Context
NOVA INDUKT currently has **60 products** (Phase 1). Phase 2 (+29) seed files exist but haven't been run yet. This plan covers **Phase 3 (+54)** and **Phase 4 (+65)**, adding 13 new categories and 119 products. Final catalog: **~208 products** across 18 categories.

---

## Global Pre-requisites

1. **Run Phase 2 seeds first** (if not done):
   ```bash
   npx tsx prisma/seed-products-kasserollen.ts
   npx tsx prisma/seed-products-schmortoepfe.ts
   npx tsx prisma/seed-products-grillpfannen.ts
   npx tsx prisma/seed-products-dampfgarer.ts
   ```
2. Verify product count reaches ~89 before starting Phase 3

---

## New Categories Summary

| Phase | # | slug | nameDe | Products | sortOrder |
|-------|---|------|--------|----------|-----------|
| 3 | 6 | `messer` | Kochmesser & Messerblocks | 15 | 6 |
| 3 | 7 | `ustensiles` | Küchenutensilien | 20 | 7 |
| 3 | 8 | `sauteusen` | Sauteusen | 6 | 8 |
| 3 | 9 | `crepe-pfannen` | Crêpe-Pfannen | 4 | 9 |
| 3 | 10 | `schnellkochtopfe` | Schnellkochtöpfe | 5 | 10 |
| 3 | — | *(merged)* | Thermometer | 4 | *(→ Zubehör)* |
| 4 | 11 | `formes-de-cuisson` | Backformen & Auflaufformen | 10 | 11 |
| 4 | 12 | `fondues-raclette` | Fondues & Raclette | 6 | 12 |
| 4 | 13 | `deckel-griffe` | Ersatzdeckel & Griffe | 15 | 13 |
| 4 | 14 | `pfannenschoner-topfregale` | Pfannenschoner & Topfregale | 10 | 14 |
| 4 | 15 | `elektrogeraete` | Elektro-Küchengeräte | 8 | 15 |
| 4 | 16 | `bestecke` | Bestecke & Messerbestecke | 10 | 16 |
| 4 | 17 | `reinigung-pflege` | Reinigung & Pflege | 6 | 17 |

**Total: 13 new categories, 119 products**

---

## Phase 3 — Seed Files to Create (6 files)

### `prisma/seed-products-messer.ts` — 15 Kochmesser

| # | slug | brand | product | price | oldPrice |
|---|------|-------|---------|-------|----------|
| 1 | zwilling-pro-s-chefmesser-20cm | Zwilling | Pro S Kochmesser 20 cm | 99.99 | 129.99 |
| 2 | zwilling-pro-s-chefmesser-26cm | Zwilling | Pro S Kochmesser 26 cm | 139.99 | 179.99 |
| 3 | zwilling-pro-s-utility-messer-16cm | Zwilling | Pro S Utility-Messer 16 cm | 69.99 | 89.99 |
| 4 | zwilling-pro-s-schaerfmesser-18cm | Zwilling | Pro S Schärfmesser 18 cm | 59.99 | 79.99 |
| 5 | miyabi-5000mcd-gyuto-20cm | Miyabi | 5000MCD Gyuto 20 cm | 199.99 | 249.99 |
| 6 | miyabi-5000mcd-santoku-18cm | Miyabi | 5000MCD Santoku 18 cm | 179.99 | 219.99 |
| 7 | miyabi-birchwood-santoku-18cm | Miyabi | Birchwood Santoku 18 cm | 169.99 | 199.99 |
| 8 | bob-kramer-meiji-chefmesser-20cm | Bob Kramer | Meiji Kochmesser 20 cm | 349.99 | 399.99 |
| 9 | bob-kramer-meiji-santoku-18cm | Bob Kramer | Meiji Santoku 18 cm | 299.99 | 349.99 |
| 10 | victorinox-swiss-classic-kochmesser-20cm | Victorinox | Swiss Classic Kochmesser 20 cm | 29.99 | 39.99 |
| 11 | victorinox-swiss-classic-brotmesser-26cm | Victorinox | Swiss Classic Brotmesser 26 cm | 34.99 | 44.99 |
| 12 | victorinox-fibrox-pro-chefmesser-20cm | Victorinox | Fibrox Pro Kochmesser 20 cm | 39.99 | 49.99 |
| 13 | zwilling-spirit-messerset-3-teilig | Zwilling | Spirit Messerset 3-teilig | 149.99 | 199.99 |
| 14 | miyabi-5000mcd-messerblock-7-teilig | Miyabi | 5000MCD Messerblock 7-teilig | 499.99 | 599.99 |
| 15 | zwilling-magnetic-messerschiene | Zwilling | Magnetic Messerschiene | 79.99 | 99.99 |

**categorySlug:** `'messer'`

---

### `prisma/seed-products-ustensiles.ts` — 20 Küchenutensilien

| # | slug | brand | product | price | oldPrice |
|---|------|-------|---------|-------|----------|
| 1 | wmf-profi-plus-schoepfkellen-set-3tlg | WMF | Profi Plus Schöpfkellen-Set 3-teilig | 24.99 | 29.99 |
| 2 | wmf-profi-plus-kochloeffel | WMF | Profi Plus Kochlöffel | 9.99 | 12.99 |
| 3 | wmf-profi-plus-saucenheber | WMF | Profi Plus Saucenheber | 12.99 | 16.99 |
| 4 | wmf-profi-plus-schaumkelle | WMF | Profi Plus Schaumkelle | 9.99 | 12.99 |
| 5 | wmf-profi-plus-grillzange | WMF | Profi Plus Grillzange | 14.99 | 19.99 |
| 6 | fissler-pure-collection-kochloeffel | Fissler | Pure Collection Kochlöffel | 12.99 | 16.99 |
| 7 | fissler-pure-collection-schoepfkelle | Fissler | Pure Collection Schöpfkelle | 12.99 | 16.99 |
| 8 | fissler-pure-collection-saucenheber | Fissler | Pure Collection Saucenheber | 12.99 | 16.99 |
| 9 | fissler-pure-collection-nudelkelle | Fissler | Pure Collection Nudelkelle | 14.99 | 19.99 |
| 10 | roesle-silicone-backpinsel | Rösle | Silicone Basting Brush | 12.99 | 16.99 |
| 11 | roesle-silicone-spatula | Rösle | Silicone Spatula | 11.99 | 14.99 |
| 12 | roesle-silicone-kochloeffel | Rösle | Silicone Cooking Spoon | 11.99 | 14.99 |
| 13 | roesle-silicone-kelle | Rösle | Silicone Ladle | 12.99 | 16.99 |
| 14 | roesle-edelstahl-wender | Rösle | Stainless Steel Turner | 14.99 | 19.99 |
| 15 | zwilling-now-s-kuechenzange | Zwilling | Now S Küchenzange | 12.99 | 16.99 |
| 16 | zwilling-now-s-schaumkelle | Zwilling | Now S Schaumkelle | 9.99 | 12.99 |
| 17 | zwilling-now-s-kochloeffel | Zwilling | Now S Kochlöffel | 9.99 | 12.99 |
| 18 | zwilling-now-s-schneebesen | Zwilling | Now S Schneebesen | 11.99 | 14.99 |
| 19 | wmf-profi-plus-siebloeffel | WMF | Profi Plus Sieblöffel | 14.99 | 19.99 |
| 20 | fissler-pure-collection-kartoffelstock | Fissler | Pure Collection Kartoffelstößel | 14.99 | 19.99 |

**categorySlug:** `'ustensiles'`

---

### `prisma/seed-products-sauteusen.ts` — 6 Sauteusen

| # | slug | brand | product | price | oldPrice |
|---|------|-------|---------|-------|----------|
| 1 | fissler-opc-sauteuse-24cm | Fissler | OPC Sauteuse 24 cm | 139.99 | 179.99 |
| 2 | fissler-opc-sauteuse-28cm | Fissler | OPC Sauteuse 28 cm | 159.99 | 199.99 |
| 3 | wmf-function-4-sauteuse-24cm | WMF | Function 4 Sauteuse 24 cm | 119.99 | 149.99 |
| 4 | wmf-function-4-sauteuse-28cm | WMF | Function 4 Sauteuse 28 cm | 139.99 | 179.99 |
| 5 | demeyere-industry-5-sauteuse-24cm | Demeyere | Industry 5 Sauteuse 24 cm | 149.99 | 189.99 |
| 6 | demeyere-industry-5-sauteuse-28cm | Demeyere | Industry 5 Sauteuse 28 cm | 169.99 | 219.99 |

**categorySlug:** `'sauteusen'`

---

### `prisma/seed-products-crepe-pfannen.ts` — 4 Crêpe-Pfannen

| # | slug | brand | product | price | oldPrice |
|---|------|-------|---------|-------|----------|
| 1 | de-buyer-mineral-b-crepe-pfanne-24cm | de Buyer | Mineral B Crêpe-Pfanne 24 cm | 49.99 | 64.99 |
| 2 | de-buyer-mineral-b-crepe-pfanne-28cm | de Buyer | Mineral B Crêpe-Pfanne 28 cm | 59.99 | 79.99 |
| 3 | matfer-copper-steel-crepe-pfanne-24cm | Matfer | Copper Steel Crêpe-Pfanne 24 cm | 79.99 | 99.99 |
| 4 | tefal-preference-crepe-pfanne-25cm | Tefal | Préférence Crêpe-Pfanne 25 cm | 29.99 | 39.99 |

**categorySlug:** `'crepe-pfannen'`

---

### `prisma/seed-products-schnellkochtopfe.ts` — 5 Schnellkochtöpfe

| # | slug | brand | product | price | oldPrice |
|---|------|-------|---------|-------|----------|
| 1 | fissler-vitavit-edition-45l | Fissler | vitavit edition 4,5 L | 99.99 | 129.99 |
| 2 | fissler-vitavit-edition-65l | Fissler | vitavit edition 6,5 L | 119.99 | 149.99 |
| 3 | wmf-perfect-plus-45l | WMF | Perfect Plus 4,5 L | 89.99 | 119.99 |
| 4 | wmf-perfect-plus-65l | WMF | Perfect Plus 6,5 L | 109.99 | 139.99 |
| 5 | kuhn-rikon-duromatic-50l | Kuhn Rikon | Duromatic Top 5,0 L | 89.99 | 119.99 |

**categorySlug:** `'schnellkochtopfe'`

---

### `prisma/seed-products-thermometers.ts` — 4 Thermometer

| # | slug | brand | product | price | oldPrice |
|---|------|-------|---------|-------|----------|
| 1 | tfa-air-control-digital | TFA | Air Control Digital-Thermometer | 19.99 | 24.99 |
| 2 | tfa-pipet-kuhlschrank | TFA | Pipet Kühlschrankthermometer | 12.99 | 16.99 |
| 3 | soehnle-digital-kuechen therm | Soehnle | Digital-Küchenthermometer | 14.99 | 19.99 |
| 4 | tfa-digoo-dual | TFA | Digoo Dual-Thermometer | 24.99 | 29.99 |

**categorySlug:** `'induktions-zubehoer'` (no new top-level category)

---

## Phase 4 — Seed Files to Create (7 files)

### `prisma/seed-products-formes-de-cuisson.ts` — 10 Backformen

| # | slug | brand | product | price | oldPrice |
|---|------|-------|---------|-------|----------|
| 1 | fissler-cenit-auflaufform-26x18cm | Fissler | Cenit Auflaufform 26×18 cm | 39.99 | 49.99 |
| 2 | fissler-cenit-auflaufform-33x23cm | Fissler | Cenit Auflaufform 33×23 cm | 49.99 | 64.99 |
| 3 | wmf-professional-s-plus-backform-set | WMF | Profi Plus Backform-Set 3-teilig | 29.99 | 39.99 |
| 4 | wmf-professional-s-plus-kastenform | WMF | Profi Plus Kastenform 26 cm | 19.99 | 24.99 |
| 5 | wmf-professional-s-plus-tarte-form | WMF | Profi Plus Tarte-Form 28 cm | 17.99 | 22.99 |
| 6 | stash-cocotte-oval-31x21cm | Staub | Cocotte Oval 31×21 cm | 219.99 | 269.99 |
| 7 | le-creuset-signature-kastenform | Le Creuset | Signature Kastenform 23 cm | 34.99 | 44.99 |
| 8 | le-creuset-signature-tarte-form | Le Creuset | Signature Tarte-Form 28 cm | 39.99 | 49.99 |
| 9 | petromax-dutch-oven-dt6-oval | Petromax | Dutch Oven DT6 Oval | 169.99 | 219.99 |
| 10 | stash-cocotte-ronde-20cm | Staub | Cocotte Ronde 20 cm | 149.99 | 189.99 |

**categorySlug:** `'formes-de-cuisson'`

---

### `prisma/seed-products-fondues-raclette.ts` — 6 Fondues & Raclette

| # | slug | brand | product | price | oldPrice |
|---|------|-------|---------|-------|----------|
| 1 | stelton-Emma-fondue-set | Stelton | Emma Fondue-Set 1,5 L | 179.99 | 219.99 |
| 2 | tefal-apicio-fondue-set | Tefal | Apicio Fondue-Set 1,2 L | 49.99 | 64.99 |
| 3 | tefal-preference-raclette-pfanne | Tefal | Préférence Raclette-Pfanne 8-teilig | 59.99 | 74.99 |
| 4 | bugatti-fondue-set-15l | Bugatti | Fondue-Set 1,5 L | 129.99 | 159.99 |
| 5 | zwilling-fondue-set-20l | Zwilling | Spirit Fondue-Set 2,0 L | 89.99 | 119.99 |
| 6 | de-buyer-raclette-pfanne-8-teilig | de Buyer | Raclette-Pfanne 8-teilig | 69.99 | 89.99 |

**categorySlug:** `'fondues-raclette'`

---

### `prisma/seed-products-deckel-griffe.ts` — 15 Ersatzdeckel & Griffe

| # | slug | brand | product | price | oldPrice |
|---|------|-------|---------|-------|----------|
| 1 | fissler-opc-deckel-20cm | Fissler | OPC Glasdeckel 20 cm | 29.99 | 34.99 |
| 2 | fissler-opc-deckel-24cm | Fissler | OPC Glasdeckel 24 cm | 34.99 | 39.99 |
| 3 | fissler-opc-deckel-28cm | Fissler | OPC Glasdeckel 28 cm | 39.99 | 49.99 |
| 4 | fissler-opc-deckel-32cm | Fissler | OPC Glasdeckel 32 cm | 44.99 | 54.99 |
| 5 | wmf-diadem-plus-deckel-16cm | WMF | Diadem Plus Glasdeckel 16 cm | 24.99 | 29.99 |
| 6 | wmf-diadem-plus-deckel-20cm | WMF | Diadem Plus Glasdeckel 20 cm | 29.99 | 34.99 |
| 7 | wmf-diadem-plus-deckel-24cm | WMF | Diadem Plus Glasdeckel 24 cm | 34.99 | 39.99 |
| 8 | wmf-diadem-plus-deckel-28cm | WMF | Diadem Plus Glasdeckel 28 cm | 39.99 | 49.99 |
| 9 | demeyere-atlantis-7-deckel-24cm | Demeyere | Atlantis 7 Glasdeckel 24 cm | 44.99 | 54.99 |
| 10 | demeyere-atlantis-7-deckel-28cm | Demeyere | Atlantis 7 Glasdeckel 28 cm | 49.99 | 59.99 |
| 11 | zwilling-plus-deckel-16cm | Zwilling | Plus Glasdeckel 16 cm | 22.99 | 27.99 |
| 12 | zwilling-plus-deckel-20cm | Zwilling | Plus Glasdeckel 20 cm | 27.99 | 32.99 |
| 13 | zwilling-plus-deckel-24cm | Zwilling | Plus Glasdeckel 24 cm | 32.99 | 39.99 |
| 14 | fissler-replacement-griff-set | Fissler | Ersatzgriff-Set OPC | 19.99 | 24.99 |
| 15 | wmf-replacement-griff-set | WMF | Ersatzgriff-Set Profi Plus | 17.99 | 22.99 |

**categorySlug:** `'deckel-griffe'`

---

### `prisma/seed-products-pfannenschoner-topfregale.ts` — 10 Pfannenschoner & Topfregale

| # | slug | brand | product | price | oldPrice |
|---|------|-------|---------|-------|----------|
| 1 | tefal-pfannenschoner-26cm | Tefal | Pfannenschoner 26 cm | 9.99 | 12.99 |
| 2 | tefal-pfannenschoner-28cm | Tefal | Pfannenschoner 28 cm | 10.99 | 14.99 |
| 3 | wmf-pfannenschoner-26cm | WMF | Pfannenschoner 26 cm | 12.99 | 16.99 |
| 4 | wmf-pfannenschoner-28cm | WMF | Pfannenschoner 28 cm | 14.99 | 19.99 |
| 5 | fissler-pfannenschoner-26cm | Fissler | Pfannenschoner 26 cm | 14.99 | 19.99 |
| 6 | fissler-pfannenschoner-28cm | Fissler | Pfannenschoner 28 cm | 16.99 | 21.99 |
| 7 | rivsalt-topfregal-klein | Rivsalt | Topfregal Klein (3 Stufen) | 39.99 | 49.99 |
| 8 | rivsalt-topfregal-gross | Rivsalt | Topfregal Groß (4 Stufen) | 59.99 | 69.99 |
| 9 | wmf-topfregal-edelstahl | WMF | Topfregal Edelstahl 4-fach | 44.99 | 54.99 |
| 10 | ikea-variera-topfregal | IKEA | VARIERA Topfregal | 14.99 | 19.99 |

**categorySlug:** `'pfannenschoner-topfregale'`

---

### `prisma/seed-products-elektrogeraete.ts` — 8 Elektro-Küchengeräte

| # | slug | brand | product | price | oldPrice |
|---|------|-------|---------|-------|----------|
| 1 | wm-zeppelin-handmixer | WMF | Zeppelin Handmixer | 29.99 | 39.99 |
| 2 | wm-kitchenline-standmixer | WMF | KitchenLine Standmixer 1,6 L | 79.99 | 99.99 |
| 3 | wm-zeppelin-stabmixer | WMF | Zeppelin Stabmixer | 34.99 | 44.99 |
| 4 | wm-kitchenline-wasserkocher | WMF | KitchenLine Wasserkocher 1,7 L | 39.99 | 49.99 |
| 5 | fissler-heat-memory-wasserkocher | Fissler | Heat Memory Wasserkocher 1,5 L | 44.99 | 54.99 |
| 6 | tefal-masterclass-waffeleisen | Tefal | Masterclass Waffeleisen | 39.99 | 49.99 |
| 7 | tefal-masterclass-contactgrill | Tefal | Masterclass Contactgrill | 69.99 | 89.99 |
| 8 | tefal-pizzaofen-ondine | Tefal | Ondine Pizzaofen | 129.99 | 159.99 |

**categorySlug:** `'elektrogeraete'`

---

### `prisma/seed-products-bestecke.ts` — 10 Bestecke

| # | slug | brand | product | price | oldPrice |
|---|------|-------|---------|-------|----------|
| 1 | wmf-monde-bestechenset-68-teilig | WMF | Monde Bestechenset 68-teilig | 179.99 | 219.99 |
| 2 | wmf-monde-bestechenset-30-teilig | WMF | Monde Bestechenset 30-teilig (6 Pers.) | 89.99 | 109.99 |
| 3 | wmf-function-4-bestechenset-68-teilig | WMF | Function 4 Bestechenset 68-teilig | 129.99 | 159.99 |
| 4 | wmf-function-4-bestechenset-30-teilig | WMF | Function 4 Bestechenset 30-teilig (6 Pers.) | 69.99 | 89.99 |
| 5 | zwilling-spirit-bestechenset-68-teilig | Zwilling | Spirit Bestechenset 68-teilig | 149.99 | 189.99 |
| 6 | zwilling-spirit-bestechenset-30-teilig | Zwilling | Spirit Bestechenset 30-teilig (6 Pers.) | 79.99 | 99.99 |
| 7 | zwilling-now-s-bestechenset-68-teilig | Zwilling | Now S Bestechenset 68-teilig | 99.99 | 129.99 |
| 8 | zwilling-now-s-bestechenset-30-teilig | Zwilling | Now S Bestechenset 30-teilig (6 Pers.) | 49.99 | 64.99 |
| 9 | wmf-monde-messerset-3-teilig | WMF | Monde Messerset 3-teilig | 59.99 | 74.99 |
| 10 | zwilling-pro-s-messerset-3-teilig | Zwilling | Pro S Messerset 3-teilig | 49.99 | 64.99 |

**categorySlug:** `'bestecke'`

---

### `prisma/seed-products-reinigung-pflege.ts` — 6 Reinigung & Pflege

| # | slug | brand | product | price | oldPrice |
|---|------|-------|---------|-------|----------|
| 1 | weber-reiniger-grill-reiniger | Weber | Premium Grillreiniger 500 ml | 12.99 | 16.99 |
| 2 | weber-reiniger-holzschutz | Weber | Holzschutzöl 250 ml | 14.99 | 19.99 |
| 3 | wmf-antihaft-reiniger | WMF | Antihaft-Reiniger 250 ml | 9.99 | 12.99 |
| 4 | fissler-edelstahl-reiniger | Fissler | Edelstahl-Reiniger 250 ml | 8.99 | 11.99 |
| 5 | ballarini-pflege-ol | Ballarini | Pflegeöl 250 ml | 7.99 | 9.99 |
| 6 | le-creuset-emaille-reiniger | Le Creuset | Emaille-Reiniger 250 ml | 12.99 | 16.99 |

**categorySlug:** `'reinigung-pflege'`

---

## Execution Order

### Step 0: Run Phase 2 seeds
```bash
npx tsx prisma/seed-products-kasserollen.ts
npx tsx prisma/seed-products-schmortoepfe.ts
npx tsx prisma/seed-products-grillpfannen.ts
npx tsx prisma/seed-products-dampfgarer.ts
```

### Step 1: Add 13 new categories to `lib/data/categories.ts`

### Step 2: Create all 13 seed files (Phase 3: 6, Phase 4: 7)

### Step 3: Download product images
- ~54 products × 3 images = ~162 images for Phase 3
- ~65 products × 3 images = ~195 images for Phase 4
- **Total: ~357 images**

### Step 4: Run all 13 seed scripts
```bash
# Phase 3
npx tsx prisma/seed-products-messer.ts
npx tsx prisma/seed-products-ustensiles.ts
npx tsx prisma/seed-products-sauteusen.ts
npx tsx prisma/seed-products-crepe-pfannen.ts
npx tsx prisma/seed-products-schnellkochtopfe.ts
npx tsx prisma/seed-products-thermometers.ts

# Phase 4
npx tsx prisma/seed-products-formes-de-cuisson.ts
npx tsx prisma/seed-products-fondues-raclette.ts
npx tsx prisma/seed-products-deckel-griffe.ts
npx tsx prisma/seed-products-pfannenschoner-topfregale.ts
npx tsx prisma/seed-products-elektrogeraete.ts
npx tsx prisma/seed-products-bestecke.ts
npx tsx prisma/seed-products-reinigung-pflege.ts
```

### Step 5: Verify product counts per category
### Step 6: Git commit & push

---

## Final Verification
- [ ] Product count: ~208 (60 + 29 Phase 2 + 54 Phase 3 + 65 Phase 4)
- [ ] All 18 categories visible in frontend
- [ ] No TypeScript errors
- [ ] No duplicate slugs
- [ ] All products have images
- [ ] Prices UVP-compliant (oldPrice ≤ 30% above price)
- [ ] All products have `weightKg`, `inductionSafe`, `dishwasherSafe`
- [ ] Git status clean
