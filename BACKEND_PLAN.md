# Plan Backend - NOVA INDUKT

## Vue d'ensemble

Ce document présente le plan complet pour la mise en place du backend de NOVA INDUKT, incluant l'architecture, les technologies, et la roadmap d'implementation.

---

## Architecture Technique Proposée

### Stack Backend

| Composant | Technologie | Justification |
|-----------|-------------|---------------|
| **Framework** | Next.js API Routes + Server Actions | Déjà en place, SSR/SSG natif |
| **Base de données** | PostgreSQL (Neon/Supabase) | Relationnelle, scalable, serverless-friendly |
| **ORM** | Prisma | Type-safe, migrations automatiques, excellent DX |
| **Authentification** | NextAuth.js v5 (Auth.js) | Intégration Next.js native, multiples providers |
| **Paiement** | Stripe (ou Mollie pour l'Europe) | SCA-ready, webhooks robustes |
| **Email** | Resend (ou SendGrid) | Simple, bonne délivrabilité, pricing compétitif |
| **Stockage images** | Cloudinary (ou AWS S3) | Optimisation auto, CDN, transformations |
| **Cache** | Redis (Upstash) | Sessions, paniers, rate limiting |
| **Monitoring** | Vercel Analytics + Sentry | Performance et erreurs |

---

## Structure de la Base de Données (Prisma Schema)

```prisma
// schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// Utilisateurs & Authentification (NextAuth)
model Account {
  id                String  @id @default(cuid())
  userId            String
  type              String
  provider          String
  providerAccountId String
  refresh_token     String? @db.Text
  access_token      String? @db.Text
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String? @db.Text
  session_state     String?

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([provider, providerAccountId])
}

model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model User {
  id            String    @id @default(cuid())
  name          String?
  email         String    @unique
  emailVerified DateTime?
  image         String?
  password      String?   // Pour credentials provider (hashé bcrypt)
  role          Role      @default(USER)
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  accounts      Account[]
  sessions      Session[]
  orders        Order[]
  addresses     Address[]
  reviews       Review[]
  wishlist      WishlistItem[]
}

model VerificationToken {
  identifier String
  token      String   @unique
  expires    DateTime

  @@unique([identifier, token])
}

enum Role {
  USER
  ADMIN
}

// Produits & Catalogue
model Category {
  id          String    @id @default(cuid())
  slug        String    @unique
  nameDe      String
  nameEn      String?
  description String?
  image       String?
  sortOrder   Int       @default(0)
  isActive    Boolean   @default(true)
  createdAt   DateTime  @default(now())
  
  products    Product[]
}

model Product {
  id                String   @id @default(cuid())
  slug              String   @unique
  supplierSku       String?  @unique
  ean               String?  @unique
  nameDe            String
  nameEn            String?
  descriptionDe     String?  @db.Text
  descriptionEn     String?  @db.Text
  shortDescription  String?
  price             Decimal  @db.Decimal(10, 2)
  oldPrice          Decimal? @db.Decimal(10, 2)
  costPrice         Decimal? @db.Decimal(10, 2) // Pour margin analysis
  vatRatePercent    Int      @default(19)
  priceIncludesVat  Boolean  @default(true)
  
  // Stock & Fulfilment
  stock             Int      @default(0)
  stockAlertAt      Int      @default(5)
  weightKg          Decimal? @db.Decimal(8, 3)
  
  // Média
  images            ProductImage[]
  
  // Attributs & Spécifications
  brand             String?
  material          String?
  dimensions        String?
  dishwasherSafe    Boolean?
  inductionSafe     Boolean?
  
  // SEO & Marketing
  metaTitle         String?
  metaDescription   String?
  badges            String[] // 'premium', 'bestseller', 'new'
  rating            Float    @default(0)
  reviewCount       Int      @default(0)
  
  // Relations
  categoryId        String
  category          Category @relation(fields: [categoryId], references: [id])
  
  // Timestamps
  isActive          Boolean  @default(true)
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt
  
  // Relations inverses
  orderItems        OrderItem[]
  reviews           Review[]
  wishlistItems     WishlistItem[]
  
  @@index([categoryId])
  @@index([slug])
  @@index([isActive])
}

model ProductImage {
  id        String  @id @default(cuid())
  productId String
  url       String
  alt       String?
  sortOrder Int     @default(0)
  isMain    Boolean @default(false)
  
  product   Product @relation(fields: [productId], references: [id], onDelete: Cascade)
}

// Commandes & Paiement
model Order {
  id              String      @id @default(cuid())
  orderNumber     String      @unique // Format: NO-2024-000001
  
  // Client
  userId          String?
  user            User?       @relation(fields: [userId], references: [id])
  
  // Informations client (pour guests et backup)
  customerEmail   String
  customerName    String
  customerPhone   String?
  
  // Adresses
  shippingAddress Json        // { firstName, lastName, street, zip, city, country }
  billingAddress  Json?
  
  // Totaux
  subtotal        Decimal     @db.Decimal(10, 2)
  shippingCost    Decimal     @db.Decimal(10, 2)
  vatAmount       Decimal     @db.Decimal(10, 2)
  total           Decimal     @db.Decimal(10, 2)
  
  // Paiement
  paymentMethod   String      // 'stripe', 'paypal', 'bank_transfer'
  paymentStatus   PaymentStatus @default(PENDING)
  paymentIntentId String?     // Stripe PaymentIntent ID
  paidAt          DateTime?
  
  // Statut commande
  status          OrderStatus @default(PENDING)
  
  // Items
  items           OrderItem[]
  
  // Tracking
  trackingNumber  String?
  shippedAt       DateTime?
  deliveredAt     DateTime?
  
  // Notes
  customerNote    String?     @db.Text
  internalNote    String?     @db.Text
  
  createdAt       DateTime    @default(now())
  updatedAt       DateTime    @updatedAt
  
  @@index([userId])
  @@index([orderNumber])
  @@index([status])
  @@index([paymentStatus])
}

model OrderItem {
  id          String  @id @default(cuid())
  orderId     String
  order       Order   @relation(fields: [orderId], references: [id], onDelete: Cascade)
  
  productId   String
  product     Product @relation(fields: [productId], references: [id])
  
  // Snapshot du produit au moment de l'achat
  productName String
  productSlug String
  unitPrice   Decimal @db.Decimal(10, 2)
  quantity    Int
  vatRate     Int
  
  @@index([orderId])
}

enum OrderStatus {
  PENDING         // En attente de paiement
  PROCESSING      // Paiement reçu, préparation
  SHIPPED         // Expédié
  DELIVERED       // Livré
  CANCELLED       // Annulé
  REFUNDED        // Remboursé
}

enum PaymentStatus {
  PENDING
  AUTHORIZED
  PAID
  FAILED
  REFUNDED
  PARTIALLY_REFUNDED
}

// Addresses utilisateur (pour checkout rapide)
model Address {
  id         String  @id @default(cuid())
  userId     String
  user       User    @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  type       AddressType
  firstName  String
  lastName   String
  company    String?
  street     String
  street2    String?
  zipCode    String
  city       String
  country    String  @default("DE")
  phone      String?
  isDefault  Boolean @default(false)
  
  createdAt  DateTime @default(now())
  
  @@index([userId])
}

enum AddressType {
  SHIPPING
  BILLING
  BOTH
}

// Wishlist (Panier favoris persisté)
model WishlistItem {
  id        String  @id @default(cuid())
  userId    String
  user      User    @relation(fields: [userId], references: [id], onDelete: Cascade)
  productId String
  product   Product @relation(fields: [productId], references: [id], onDelete: Cascade)
  
  createdAt DateTime @default(now())
  
  @@unique([userId, productId])
  @@index([userId])
}

// Reviews & Avis clients
model Review {
  id        String   @id @default(cuid())
  productId String
  product   Product  @relation(fields: [productId], references: [id], onDelete: Cascade)
  
  userId    String?
  user      User?    @relation(fields: [userId], references: [id], onDelete: SetNull)
  
  rating    Int      // 1-5
  title     String?
  content   String   @db.Text
  isVerified Boolean @default(false) // Achat vérifié
  isPublished Boolean @default(false) // Modération
  
  createdAt DateTime @default(now())
  
  @@index([productId])
  @@index([userId])
}

// Newsletter & Marketing
model NewsletterSubscriber {
  id        String   @id @default(cuid())
  email     String   @unique
  firstName String?
  isActive  Boolean  @default(true)
  source    String?  // 'homepage', 'checkout', 'popup'
  
  confirmedAt DateTime?
  unsubscribedAt DateTime?
  
  createdAt DateTime @default(now())
}

// Contact & Support
model ContactMessage {
  id        String   @id @default(cuid())
  name      String
  email     String
  subject   String
  message   String   @db.Text
  
  status    ContactStatus @default(NEW)
  
  // Si lié à un utilisateur
  userId    String?
  
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

enum ContactStatus {
  NEW
  IN_PROGRESS
  RESOLVED
  SPAM
}

// Audit & Logs
model AuditLog {
  id          String   @id @default(cuid())
  action      String   // 'ORDER_CREATED', 'PAYMENT_RECEIVED', etc.
  entityType  String   // 'Order', 'User', 'Product'
  entityId    String
  userId      String?
  oldValues   Json?
  newValues   Json?
  ipAddress   String?
  userAgent   String?
  createdAt   DateTime @default(now())
}
```

---

## API Routes à Implémenter

### Authentification (NextAuth.js)
```
app/api/auth/[...nextauth]/route.ts  → Gestion des sessions OAuth + Credentials
```

**Providers à configurer:**
- Credentials (email/password)
- Google OAuth
- Apple OAuth (optionnel)

### API Products
```
app/api/products/route.ts           → GET (liste avec filtres/pagination)
app/api/products/[slug]/route.ts    → GET (détail produit)
app/api/categories/route.ts         → GET (toutes les catégories)
```

### API Panier (Server Actions)
```
app/actions/cart.ts
  - addToCart(userId, productId, quantity)
  - updateCartItem(itemId, quantity)
  - removeFromCart(itemId)
  - getCart(userId)
  - mergeCartOnLogin(anonymousCartId, userId)
```

### API Commandes
```
app/api/orders/route.ts             → POST (créer commande)
app/api/orders/[id]/route.ts        → GET (détail commande)
app/api/orders/[id]/payment/route.ts → POST (initier paiement)
```

### API Paiement (Stripe)
```
app/api/stripe/create-payment-intent/route.ts
app/api/stripe/webhook/route.ts     → Gestion des événements Stripe
```

### API Wishlist
```
app/api/wishlist/route.ts           → GET, POST
app/api/wishlist/[productId]/route.ts → DELETE
```

### API Contact
```
app/api/contact/route.ts            → POST (envoyer message)
```

### API Newsletter
```
app/api/newsletter/subscribe/route.ts
app/api/newsletter/unsubscribe/route.ts
```

---

## Migration des Stores Zustand → Backend

### 1. Authentification (`lib/store/auth.ts`)

**Actuel:** Demo mode avec localStorage
```typescript
// AVANT
const useAuth = create(persist(...)) // localStorage only
```

**Migration:**
```typescript
// APRÈS
- Remplacer par NextAuth.js session
- Garder Zustand pour UI state uniquement (isLoading, errors)
- Server Action: login(credentials) → { user, session }
- Server Action: register(data) → { user, session }
```

### 2. Panier (`lib/store/cart.ts`)

**Actuel:** localStorage uniquement, perte lors du changement d'appareil
```typescript
// AVANT
const useCartStore = create(persist({ items: [] })) // localStorage
```

**Migration - Phase 1 (hybride):**
```typescript
// APRÈS - Approche hybride
- localStorage: Panier anonyme (avant connexion)
- Database: Panier persisté pour utilisateurs connectés
- Server Action: syncCartOnLogin(anonymousCart, userId)
- Real-time: Redis pour panier multi-onglets
```

**Migration - Phase 2 (full backend):**
```typescript
// APRÈS - Full backend
- Supprimer persist middleware
- API call: GET /api/cart → { items }
- Server Actions: addToCart, updateQuantity, removeItem
- Optimistic UI avec Zustand pour réactivité
```

### 3. Wishlist (`lib/store/wishlist.ts`)

**Actuel:** localStorage hook
```typescript
// AVANT
function useWishlist() { useState + localStorage }
```

**Migration:**
```typescript
// APRÈS
- Server Action: toggleWishlistItem(productId)
- Database: table WishlistItem (userId + productId)
- SWR/React Query pour fetching/fetching
```

---

## Intégrations Externes

### 1. Stripe (Paiement)

**Configuration requise:**
```env
STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

**Flow de paiement:**
1. Client crée commande (POST /api/orders)
2. Backend crée PaymentIntent Stripe
3. Client confirme paiement avec Stripe.js
4. Webhook Stripe confirme le paiement
5. Backend met à jour statut commande → PROCESSING

### 2. Resend (Emails)

**Emails transactionnels:**
- `order-confirmation` → Confirmation de commande
- `shipping-notification` → Expédition avec tracking
- `password-reset` → Réinitialisation mot de passe
- `welcome` → Inscription confirmation

**Configuration:**
```env
RESEND_API_KEY=re_...
EMAIL_FROM=support@nova-indukt.de
```

### 3. Cloudinary (Images)

**Migration images actuelles:**
- 115 produits × 3-4 images = ~400 images
- Upload batch vers Cloudinary
- Transformation: auto-resize, WebP conversion
- CDN delivery

---

## Roadmap d'Implémentation

### Phase 1: Fondations (Semaine 1-2)
- [ ] Setup PostgreSQL (Neon/Supabase)
- [ ] Configuration Prisma + schema initial
- [ ] Variables d'environnement (.env.local)
- [ ] Scripts de migration des 115 produits CSV → DB
- [ ] Upload images vers Cloudinary

### Phase 2: Authentification (Semaine 2-3)
- [ ] Installation NextAuth.js v5
- [ ] Configuration providers (Credentials + Google)
- [ ] Migration users table
- [ ] Middleware de protection routes
- [ ] Pages login/register refactoring

### Phase 3: Catalogue & Panier (Semaine 3-4)
- [ ] API routes products (GET avec filtres)
- [ ] Server Actions panier
- [ ] Migration wishlist vers DB
- [ ] Cache Redis pour produits fréquents

### Phase 4: Commandes & Paiement (Semaine 4-5)
- [ ] Integration Stripe
- [ ] Page checkout refactoring
- [ ] Webhook handlers
- [ ] Table orders + orderItems
- [ ] Email confirmations (Resend)

### Phase 5: Compte Client (Semaine 5-6)
- [ ] Dashboard compte (orders, addresses)
- [ ] Gestion adresses
- [ ] Historique commandes
- [ ] Reviews produits

### Phase 6: Admin & Outils (Semaine 6-7)
- [ ] Dashboard admin (stats, gestion commandes)
- [ ] CRUD produits
- [ ] Gestion stocks alertes
- [ ] Contact messages admin

### Phase 7: Optimisation (Semaine 7-8)
- [ ] Rate limiting
- [ ] Monitoring Sentry
- [ ] Tests E2E (Playwright)
- [ ] Documentation API

---

## Variables d'Environnement (.env.local)

```env
# Database
DATABASE_URL="postgresql://user:pass@host/db?sslmode=require"
DIRECT_URL="postgresql://user:pass@host/db?sslmode=require" # Pour migrations

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-min-32-chars-long"

# OAuth Providers
GOOGLE_CLIENT_ID="..."
GOOGLE_CLIENT_SECRET="..."

# Stripe
STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# Email
RESEND_API_KEY="re_..."
EMAIL_FROM="support@nova-indukt.de"

# Cloudinary
CLOUDINARY_CLOUD_NAME="..."
CLOUDINARY_API_KEY="..."
CLOUDINARY_API_SECRET="..."

# Redis (Upstash)
UPSTASH_REDIS_REST_URL="..."
UPSTASH_REDIS_REST_TOKEN="..."

# Monitoring
SENTRY_DSN="..."
```

---

## Points d'Attention

### Sécurité
- Tous les mots de passe hashés avec bcrypt (cost: 12)
- Rate limiting sur auth et paiement (10 req/min)
- CSRF protection native Next.js
- Validation input avec Zod sur toutes les APIs
- Row Level Security (RLS) si Supabase utilisé

### Performance
- Server Components par défaut
- Client Components uniquement pour interactivité
- Cache Prisma avec $extends
- Images optimisées (Next/Image + Cloudinary)
- Pagination API (20 items/page par défaut)

### SEO & Marketing
- Sitemap XML généré dynamiquement
- Schema.org JSON-LD pour produits
- Meta tags dynamiques par produit
- OG images auto-générées

### RGPD / Compliance
- Consentement cookies (CookieConsent déjà présent)
- Droit à l'effacement (endpoint DELETE /api/user)
- Export données personnelles
- Politique de confidentialité à jour

---

## Prochaines Étapes Immédiates

1. **Confirmer le choix des providers:**
   - Base de données: Neon vs Supabase vs Vercel Postgres?
   - Paiement: Stripe vs Mollie (préférence Europe)?
   - Hébergement: Vercel (déjà configuré)?

2. **Créer les comptes:**
   - Stripe/Mollie account
   - Resend/SendGrid account
   - Cloudinary account
   - Database provider

3. **Setup initial:**
   ```bash
   npm install @prisma/client @auth/prisma-adapter stripe resend
   npm install -D prisma
   npx prisma init
   ```

Souhaites-tu que je commence par l'implémentation de la Phase 1 (Setup base de données + migration produits) ?
