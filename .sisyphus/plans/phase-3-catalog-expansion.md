# Phase 3 — Catalog Expansion: +54 Products (6 Categories)

## Context
NOVA INDUKT currently has **114 products** (60 Phase 1 + 29 Phase 2, pending seed execution). Phase 3 adds **54 products** across 6 new categories, requiring new category definitions in `categories.ts`, 6 seed scripts, and category images. Brands are sourced from real German retailers (Idealo, Amazon.de, manufacturer sites).

---

## Step 0: Pre-requisites
- Execute Phase 2 seeds if not yet run: `kasserollen`, `schmortoepfe`, `grillpfannen`, `dampfgarer`
- Verify product count reaches ~114 before starting Phase 3

---

## Step 1: Add 6 New Categories to `lib/data/categories.ts`

| # | slug | nameDe | sortOrder | parent? |
|---|------|--------|-----------|---------|
| 6 | `messer` | Kochmesser & Messerblocks | 6 | Top-level |
| 7 | `ustensiles` | Küchenutensilien | 7 | Top-level |
| 8 | `sauteusen` | Sauteusen | 8 | Top-level |
| 9 | `crepe-pfannen` | Crêpe-Pfannen | 9 | Top-level |
| 10 | `schnellkochtopfe` | Schnellkochtöpfe | 10 | Top-level |
| 11 | `thermometers` | Thermometer | 11 | Top-level |

Add `id`, `slug`, `nameDe`, `descriptionDe`, `image` (placeholder), `sortOrder: N+1`, `isActive: true` to the `categoriesConfig` array.

Also create category images at `public/images/Kategorien/` (or use placeholder Unsplash URLs).

---

## Step 2: Create 6 Seed Files

Each file follows the established pattern from `seed-products-batch1.ts`:
- `imgs()` helper for image URLs
- `products[]` array with all required fields
- `main()` function with category lookup, upsert-by-slug logic, error handling
- `PrismaClient` import and disconnect

### 2a. `prisma/seed-products-messer.ts` — 15 Kochmesser

| # | slug | brand | product | price | oldPrice |
|---|------|-------|---------|-------|----------|
| 1 | zwilling-profe-s-chefmesser-20cm | Zwilling | Pro S Kochmesser 20 cm | 99.99 | 129.99 |
| 2 | zwilling-profe-s-chefmesser-26cm | Zwilling | Pro S Kochmesser 26 cm | 139.99 | 179.99 |
| 3 | zwilling-profe-s-utility-messer-16cm | Zwilling | Pro S Utility-Messer 16 cm | 69.99 | 89.99 |
| 4 | zwilling-profe-s-pariermesser-18cm | Zwilling | Pro S Schärfmesser 18 cm | 59.99 | 79.99 |
| 5 | miyabi-5000mcd-chefmesser-20cm | Miyabi | 5000MCD Gyutoh 20 cm | 199.99 | 249.99 |
| 6 | miyabi-5000mcd-santoku-18cm | Miyabi | 5000MCD Santoku 18 cm | 179.99 | 219.99 |
| 7 | miyabi-birchwood-santoku-18cm | Miyabi | Birchwood Santoku 18 cm | 169.99 | 199.99 |
| 8 | bob-kramer-meiji-chefmesser-20cm | Bob Kramer | Meiji Kochmesser 20 cm | 349.99 | 399.99 |
| 9 | bob-kramer-meiji-santoku-18cm | Bob Kramer | Meiji Santoku 18 cm | 299.99 | 349.99 |
| 10 | victorinox-swiss-classic-kochmesser-20cm | Victorinox | Swiss Classic Kochmesser 20 cm | 29.99 | 39.99 |
| 11 | victorinox-swiss-classic-brotpfanne-26cm | Victorinox | Swiss Classic Brotmesser 26 cm | 34.99 | 44.99 |
| 12 | victorinox-fibrox-pro-chefmesser-20cm | Victorinox | Fibrox Pro Kochmesser 20 cm | 39.99 | 49.99 |
| 13 | zwilling-knife-set-3-teilig | Zwilling | ZWILLING Spirit Messerset 3-teilig | 149.99 | 199.99 |
| 14 | miyabi-5000mcd-messerblock-7-teilig | Miyabi | 5000MCD Messerblock 7-teilig | 499.99 | 599.99 |
| 15 | zwilling-magnetic-magnetic-magnetic-magnetic | Zwilling | ZWILLING Magnetic Messerschiene | 79.99 | 99.99 |

**categorySlug:** `'messer'`

### 2b. `prisma/seed-products-ustensiles.ts` — 20 Küchenutensilien

| # | slug | brand | product | price | oldPrice |
|---|------|-------|---------|-------|----------|
| 1 | wmf-professional-s-plus-kellen-set | WMF | Profi Plus Schöpfkellen-Set 3-teilig | 24.99 | 29.99 |
| 2 | wmf-professional-s-plus-kochen-und-schaufen | WMF | Profi Plus Kochlöffel | 9.99 | 12.99 |
| 3 | wmf-professional-s-plus-weckheber | WMF | Profi Plus Saucenheber | 12.99 | 16.99 |
| 4 | wmf-professional-s-plus-schaumkelle | WMF | Profi Plus Schaumkelle | 9.99 | 12.99 |
| 5 | wmf-professional-s-plus-kuechenzange | WMF | Profi Plus Grillzange | 14.99 | 19.99 |
| 6 | fissler-pure-collection-kochloeffel | Fissler | Pure Collection Kochlöffel | 12.99 | 16.99 |
| 7 | fissler-pure-collection-schaufel | Fissler | Pure Collection Schöpfkelle | 12.99 | 16.99 |
| 8 | fissler-pure-collection-weckheber | Fissler | Pure Collection Saucenheber | 12.99 | 16.99 |
| 9 | fissler-pure-collection-kuchenreche | Fissler | Pure Collection Nudelkelle | 14.99 | 19.99 |
| 10 | roesle-silicone-backpinsel | Rösle | Silicone Basting Brush | 12.99 | 16.99 |
| 11 | roesle-silicone-schaufel | Rösle | Silicone Spatula | 11.99 | 14.99 |
| 12 | roesle-silicone-kochloeffel | Rösle | Silicone Cooking Spoon | 11.99 | 14.99 |
| 13 | roesle-silicone-kelle | Rösle | Silicone Ladle | 12.99 | 16.99 |
| 14 | roesle-edelstahl-schaufel | Rösle | Stainless Steel Turner | 14.99 | 19.99 |
| 15 | zwilling-now-s-kuechenzange | Zwilling | Now S Küchenzange | 12.99 | 16.99 |
| 16 | zwilling-now-s-schaumkelle | Zwilling | Now S Schaumkelle | 9.99 | 12.99 |
| 17 | zwilling-now-s-kochloeffel | Zwilling | Now S Kochlöffel | 9.99 | 12.99 |
| 18 | zwilling-now-s-schneebesen | Zwilling | Now S Schneebesen | 11.99 | 14.99 |
| 19 | wmf-professional-s-plus-siebloeffel | WMF | Profi Plus Sieblöffel | 14.99 | 19.99 |
| 20 | fissler-pure-collection-essen-mit-stil | Fissler | Pure Collection Kartoffelstock | 14.99 | 19.99 |

**categorySlug:** `'ustensiles'`

### 2c. `prisma/seed-products-sauteusen.ts` — 6 Sauteusen

| # | slug | brand | product | price | oldPrice |
|---|------|-------|---------|-------|----------|
| 1 | fissler-original-profi-collection-sauteuse-24cm | Fissler | OPC Sauteuse 24 cm | 139.99 | 179.99 |
| 2 | fissler-original-profi-collection-sauteuse-28cm | Fissler | OPC Sauteuse 28 cm | 159.99 | 199.99 |
| 3 | wmf-function-4-sauteuse-24cm | WMF | Function 4 Sauteuse 24 cm | 119.99 | 149.99 |
| 4 | wmf-function-4-sauteuse-28cm | WMF | Function 4 Sauteuse 28 cm | 139.99 | 179.99 |
| 5 | demeyere-industry-5-sauteuse-24cm | Demeyere | Industry 5 Sauteuse 24 cm | 149.99 | 189.99 |
| 6 | demeyere-industry-5-sauteuse-28cm | Demeyere | Industry 5 Sauteuse 28 cm | 169.99 | 219.99 |

**categorySlug:** `'sauteusen'`

### 2d. `prisma/seed-products-crepe-pfannen.ts` — 4 Crêpe-Pfannen

| # | slug | brand | product | price | oldPrice |
|---|------|-------|---------|-------|----------|
| 1 | de-buyer-mineral-b-crepe-pfanne-24cm | de Buyer | Mineral B Crêpe-Pfanne 24 cm | 49.99 | 64.99 |
| 2 | de-buyer-mineral-b-crepe-pfanne-28cm | de Buyer | Mineral B Crêpe-Pfanne 28 cm | 59.99 | 79.99 |
| 3 | matfer-copper-steel-crepe-pfanne-24cm | Matfer | Copper Steel Crêpe-Pfanne 24 cm | 79.99 | 99.99 |
| 4 | tefal-preference-crepe-pfanne-25cm | Tefal | Préférence Crêpe-Pfanne 25 cm | 29.99 | 39.99 |

**categorySlug:** `'crepe-pfannen'`

### 2e. `prisma/seed-products-schnellkochtopfe.ts` — 5 Schnellkochtöpfe

| # | slug | brand | product | price | oldPrice |
|---|------|-------|---------|-------|----------|
| 1 | fissler-vitavit-edition-schnellkochtopf-45l | Fissler | vitavit edition 4,5 L | 99.99 | 129.99 |
| 2 | fissler-vitavit-edition-schnellkochtopf-65l | Fissler | vitavit edition 6,5 L | 119.99 | 149.99 |
| 3 | wmf-perfect-plus-schnellkochtopf-45l | WMF | Perfect Plus 4,5 L | 89.99 | 119.99 |
| 4 | wmf-perfect-plus-schnellkochtopf-65l | WMF | Perfect Plus 6,5 L | 109.99 | 139.99 |
| 5 | kuhn-rikon-pressure-cooker-50l | Kuhn Rikon | Duromatic Top 5,0 L | 89.99 | 119.99 |

**categorySlug:** `'schnellkochtopfe'`

### 2f. `prisma/seed-products-thermometers.ts` — 4 Thermometer

| # | slug | brand | product | price | oldPrice |
|---|------|-------|---------|-------|----------|
| 1 | tfa-air-control-digital-thermometer | TFA | Air Control Digital-Thermometer | 19.99 | 24.99 |
| 2 | tfa-pipet-kuhlschrank-thermometer | TFA | Pipet Kühlschrankthermometer | 12.99 | 16.99 |
| 3 | soehnle-kuechen-thermometer | Soehnle | Digital-Küchenthermometer | 14.99 | 19.99 |
| 4 | tfa-digoo-dual-thermometer | TFA | Digoo Dual-Thermometer | 24.99 | 29.99 |

**categorySlug:** `'induktions-zubehoer'` (Thermometer → Zubehör subcategory, no new top-level needed)

---

## Step 3: Download Product Images

For each of the 54 new products, download 3–4 images to:
`public/images/products/<Brand> <Serie> — <Produkt> X cm/1.png, 2.png, 3.png, 4.png`

Use Unsplash source URLs via `curl` or similar. Approximate:
- Messer: 15 products × 4 images = 60 images
- Ustensiles: 20 products × 3 images = 60 images
- Sauteusen: 6 products × 3 images = 18 images
- Crêpe-Pfannen: 4 products × 3 images = 12 images
- Schnellkochtöpfe: 5 products × 3 images = 15 images
- Thermometer: 4 products × 3 images = 12 images
- **Total: ~177 images**

---

## Step 4: Run All Seed Scripts

```bash
npx tsx prisma/seed-products-messer.ts
npx tsx prisma/seed-products-ustensiles.ts
npx tsx prisma/seed-products-sauteusen.ts
npx tsx prisma/seed-products-crepe-pfannen.ts
npx tsx prisma/seed-products-schnellkochtopfe.ts
npx tsx prisma/seed-products-thermometers.ts
```

Verify with: `npx prisma studio` → count products per category.

---

## Step 5: Verify Categories in Admin UI

- Check `/admin/categories` or similar for 11 active categories
- Verify product counts match expected values
- Check product cards render correctly on category pages

---

## Step 6: Git Commit & Push

```bash
git add lib/data/categories.ts prisma/seed-products-messer.ts prisma/seed-products-ustensiles.ts prisma/seed-products-sauteusen.ts prisma/seed-products-crepe-pfannen.ts prisma/seed-products-schnellkochtopfe.ts prisma/seed-products-thermometers.ts public/images/products/
git commit -m "feat: Phase 3 catalog expansion — +54 products (Messer, Ustensiles, Sauteusen, Crêpe, Schnellkoch, Thermometer)"
git push origin main
```

---

## Final Verification
- [ ] Product count: ~168 (114 existing + 54 new)
- [ ] All 11 categories visible in frontend
- [ ] No TypeScript errors
- [ ] No duplicate slugs
- [ ] All products have images
- [ ] Prices UVP-compliant (oldPrice ≤ 30% above price)
- [ ] All products have `weightKg`, `inductionSafe`, `dishwasherSafe`
- [ ] Git status clean, all committed and pushed
