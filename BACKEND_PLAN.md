# Documentation Technique - NOVA INDUKT

## Vue d'ensemble du Projet

**NOVA INDUKT** est une boutique e-commerce allemande spécialisée dans la vente d'ustensiles de cuisine premium pour plaques à induction. Le projet est construit avec Next.js 16 (App Router), TypeScript, Prisma, PostgreSQL, et NextAuth.js v5.

---

## Stack Technique

| Composant | Technologie | Version | Rôle |
| --------- | ----------- | ------- | ---- |
| **Framework** | Next.js | 16.2.1 | App Router, SSR/SSG, API Routes, Server Actions |
| **Langage** | TypeScript | 5.x | Type safety |
| **Base de données** | PostgreSQL | - | Données relationnelles (via Neon/Supabase) |
| **ORM** | Prisma | 5.22.0 | Modélisation, migrations, requêtes type-safe |
| **Authentification** | NextAuth.js (Auth.js) | 5.0.0-beta.30 | Sessions JWT, Credentials provider |
| **Styling** | Tailwind CSS | 3.4.3 | Utility-first CSS |
| **UI Components** | Radix UI + Framer Motion | - | Headless components + animations |
| **State Management** | Zustand | 4.5.7 | Stores avec persist middleware |
| **Paiement** | Stripe | 22.0.1 | Paiements sécurisés |
| **Emails** | Resend + React Email | 6.10.0 | Emails transactionnels |
| **Images** | Cloudinary | 2.9.0 | Stockage, CDN, transformations |
| **Tests** | Vitest | 1.6.0 | Tests unitaires avec jsdom |

---

## Architecture des Dossiers

```text
nova-indukt/
├── app/                          # Next.js App Router
│   ├── page.tsx                  # Page d'accueil (Server Component)
│   ├── layout.tsx                # Root layout avec fonts, metadata, providers
│   ├── globals.css               # Tailwind + CSS variables
│   ├── HomeContent.tsx           # Client Component contenu homepage (~48KB)
│   ├── actions/                  # Server Actions
│   │   ├── cart.ts               # addToCart, updateCartItem, mergeGuestCartOnLogin
│   │   └── auth.ts               # register avec hash SHA-256
│   ├── api/                      # API Routes
│   │   ├── auth/
│   │   │   └── register/route.ts # POST /api/auth/register
│   │   ├── products/route.ts     # GET avec filtres/pagination
│   │   ├── wishlist/             # CRUD wishlist (GET, POST, DELETE, sync)
│   │   ├── orders/               # Commandes (POST, GET)
│   │   ├── addresses/route.ts    # Gestion adresses
│   │   ├── categories/route.ts   # Liste catégories
│   │   ├── contact/route.ts      # Formulaire contact
│   │   ├── newsletter/           # Subscribe/unsubscribe
│   │   ├── reviews/route.ts      # Avis clients
│   │   └── upload/route.ts       # Upload Cloudinary
│   ├── (pages)/                  # Pages du site
│   │   ├── produkte/             # Liste produits
│   │   ├── produkt/[slug]/       # Détail produit
│   │   ├── warenkorb/            # Panier
│   │   ├── kasse/                # Checkout
│   │   ├── mein-konto/           # Compte client
│   │   ├── anmelden/             # Login
│   │   ├── registrieren/         # Register
│   │   ├── wunschliste/          # Wishlist
│   │   ├── blog/                 # Blog
│   │   ├── faq/                  # FAQ
│   │   ├── kontakt/              # Contact
│   │   └── (legal)/              # Pages légales (AGB, Datenschutz, Impressum...)
│   └── sitemap.ts                # Sitemap dynamique
│
├── components/                   # React Components
│   ├── layout/
│   │   ├── header.tsx            # Header navigation (~40KB)
│   │   └── footer.tsx            # Footer (~12KB)
│   ├── ui/
│   │   ├── button.tsx            # Button component
│   │   ├── card.tsx              # Card component
│   │   └── skeleton.tsx          # Skeleton loaders
│   ├── cookie-consent.tsx        # Banner RGPD
│   ├── custom-cursor.tsx         # Curseur personnalisé
│   ├── page-transition.tsx       # Animations de page
│   ├── smooth-scroll.tsx         # Smooth scroll provider
│   ├── product-reviews.tsx       # Reviews produit
│   ├── quick-view-modal.tsx      # Modal quick view
│   └── ...
│
├── lib/                          # Logic & Utilities
│   ├── auth/
│   │   ├── auth.config.ts        # Configuration NextAuth (Credentials)
│   │   ├── auth.ts               # auth(), getCurrentUser(), requireAuth()
│   │   └── index.ts              # Exports
│   ├── store/                    # Zustand stores
│   │   ├── auth.ts               # Auth UI state + useAuthSync hook
│   │   ├── cart.ts               # Panier localStorage (CartItem[])
│   │   ├── wishlist.ts           # Wishlist hybride (localStorage/API)
│   │   └── testimonials.ts       # Témoignages
│   ├── data/
│   │   ├── products.ts           # 115+ produits statiques (~197KB)
│   │   └── product-media.ts      # Images associées
│   ├── email/
│   │   ├── resend.ts             # Config client Resend
│   │   ├── send.ts               # Fonctions d'envoi
│   │   └── templates/
│   │       ├── order-confirmation.tsx
│   │       └── shipping-notification.tsx
│   ├── hooks/
│   │   └── use-cloudinary-image.ts
│   ├── utils/
│   │   └── vat.ts                # Calculs TVA (DE 19%)
│   ├── prisma.ts                 # Singleton PrismaClient
│   ├── cloudinary.ts             # Upload, delete, optimizations
│   ├── rate-limit.ts             # Rate limiting
│   └── utils.ts                  # cn(), formatPrice, formatDate
│
├── prisma/
│   ├── schema.prisma             # Schéma complet (454 lignes, 10+ modèles)
│   └── seed.ts                   # Script de seeding
│
├── types/
│   └── next-auth.d.ts            # Extensions types NextAuth
│
├── tests/                        # Tests Vitest
│   ├── setup.ts                  # Configuration tests
│   ├── actions/
│   ├── api/
│   └── lib/
│
├── middleware.ts                 # Protection routes auth (/mein-konto, /kasse)
├── next.config.js                # Config Next.js (images, turbopack)
├── tailwind.config.ts            # Config Tailwind (colors, fonts)
├── tsconfig.json                 # Config TypeScript
└── vitest.config.ts              # Config Vitest
```

---

## Schéma de Base de Données (Prisma)

### Modèles Implémentés

#### 1. Authentification (NextAuth.js v5)

```prisma
model User {
  id            String    @id @default(cuid())
  name          String?
  email         String    @unique
  emailVerified DateTime?
  image         String?
  password      String?   // Hash SHA-256 avec salt
  role          Role      @default(USER)  // USER | ADMIN
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  accounts      Account[]
  sessions      Session[]
  orders        Order[]
  addresses     Address[]
  reviews       Review[]
  wishlist      WishlistItem[]
  cart          Cart?     // One-to-one pour panier persisté
}

model Account { /* OAuth accounts */ }
model Session { /* Sessions actives */ }
model VerificationToken { /* Tokens vérification */ }
```

#### 2. Catalogue Produits

```prisma
model Category {
  id          String    @id @default(cuid())
  slug        String    @unique
  nameDe      String
  nameEn      String?
  description String?
  image       String?
  sortOrder   Int       @default(0)
  isActive    Boolean   @default(true)
  products    Product[]
}

model Product {
  id               String  @id @default(cuid())
  slug             String  @unique
  supplierSku      String? @unique
  ean              String? @unique
  nameDe           String
  nameEn           String?
  descriptionDe    String? @db.Text
  descriptionEn    String? @db.Text
  shortDescription String?
  price            Decimal @db.Decimal(10, 2)
  oldPrice         Decimal? @db.Decimal(10, 2)
  costPrice        Decimal? @db.Decimal(10, 2)
  vatRatePercent   Int     @default(19)
  priceIncludesVat Boolean @default(true)
  stock            Int     @default(0)
  stockAlertAt     Int     @default(5)
  weightKg         Decimal? @db.Decimal(8, 3)
  images           ProductImage[]
  brand            String?
  material         String?
  dimensions       String?
  dishwasherSafe   Boolean?
  inductionSafe    Boolean?
  metaTitle        String?
  metaDescription  String?
  badges           String[]
  rating           Float   @default(0)
  reviewCount      Int     @default(0)
  categoryId       String
  category         Category @relation(fields: [categoryId], references: [id])
  isActive         Boolean @default(true)
  createdAt        DateTime @default(now())
  updatedAt        DateTime @updatedAt
  
  orderItems    OrderItem[]
  reviews       Review[]
  wishlistItems WishlistItem[]
  cartItems     CartItem[]
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
```

#### 3. Commandes & Paiement

```prisma
model Order {
  id              String      @id @default(cuid())
  orderNumber     String      @unique  // Format: NO-2024-000001
  userId          String?
  user            User?       @relation(fields: [userId], references: [id])
  customerEmail   String
  customerName    String
  customerPhone   String?
  shippingAddress Json
  billingAddress  Json?
  subtotal        Decimal     @db.Decimal(10, 2)
  shippingCost    Decimal     @db.Decimal(10, 2)
  vatAmount       Decimal     @db.Decimal(10, 2)
  total           Decimal     @db.Decimal(10, 2)
  paymentMethod   PaymentMethod @default(STRIPE)
  paymentStatus   PaymentStatus @default(PENDING)
  paymentIntentId String?
  paidAt          DateTime?
  status          OrderStatus @default(PENDING)
  items           OrderItem[]
  trackingNumber  String?
  shippedAt       DateTime?
  deliveredAt     DateTime?
  customerNote    String? @db.Text
  internalNote    String? @db.Text
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
}

model OrderItem {
  id          String  @id @default(cuid())
  orderId     String
  order       Order   @relation(fields: [orderId], references: [id], onDelete: Cascade)
  productId   String
  product     Product @relation(fields: [productId], references: [id])
  productName String
  productSlug String
  unitPrice   Decimal @db.Decimal(10, 2)
  quantity    Int
  vatRate     Int
}

enum OrderStatus {
  PENDING
  PROCESSING
  SHIPPED
  DELIVERED
  CANCELLED
  REFUNDED
}

enum PaymentStatus {
  PENDING
  AUTHORIZED
  PAID
  FAILED
  REFUNDED
  PARTIALLY_REFUNDED
}

enum PaymentMethod {
  STRIPE
  PAYPAL
  BANK_TRANSFER
  CASH_ON_DELIVERY
}
```

#### 4. Panier Persisté

```prisma
model Cart {
  id        String     @id @default(cuid())
  userId    String?    @unique
  sessionId String?    @unique
  items     CartItem[]
  createdAt DateTime   @default(now())
  updatedAt DateTime   @updatedAt
}

model CartItem {
  id        String  @id @default(cuid())
  cartId    String
  cart      Cart    @relation(fields: [cartId], references: [id], onDelete: Cascade)
  productId String
  product   Product @relation(fields: [productId], references: [id])
  quantity  Int
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@unique([cartId, productId])
}
```

#### 5. Adresses Utilisateur

```prisma
model Address {
  id        String      @id @default(cuid())
  userId    String
  user      User        @relation(fields: [userId], references: [id], onDelete: Cascade)
  type      AddressType // SHIPPING | BILLING | BOTH
  firstName String
  lastName  String
  company   String?
  street    String
  street2   String?
  zipCode   String
  city      String
  country   String      @default("DE")
  phone     String?
  isDefault Boolean     @default(false)
  createdAt DateTime    @default(now())
}
```

#### 6. Wishlist

```prisma
model WishlistItem {
  id        String   @id @default(cuid())
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  productId String
  product   Product  @relation(fields: [productId], references: [id], onDelete: Cascade)
  createdAt DateTime @default(now())

  @@unique([userId, productId])
}
```

#### 7. Reviews & Avis

```prisma
model Review {
  id          String   @id @default(cuid())
  productId   String
  product     Product  @relation(fields: [productId], references: [id], onDelete: Cascade)
  userId      String?
  user        User?    @relation(fields: [userId], references: [id], onDelete: SetNull)
  rating      Int      // 1-5
  title       String?
  content     String   @db.Text
  isVerified  Boolean  @default(false)
  isPublished Boolean  @default(false)
  createdAt   DateTime @default(now())
}
```

#### 8. Newsletter & Contact

```prisma
model NewsletterSubscriber {
  id             String    @id @default(cuid())
  email          String    @unique
  firstName      String?
  isActive       Boolean   @default(true)
  source         String?   // 'homepage', 'checkout', 'popup'
  confirmedAt    DateTime?
  unsubscribedAt DateTime?
  createdAt      DateTime  @default(now())
}

model ContactMessage {
  id        String        @id @default(cuid())
  name      String
  email     String
  subject   String
  message   String        @db.Text
  status    ContactStatus @default(NEW)
  userId    String?
  createdAt DateTime      @default(now())
  updatedAt DateTime      @updatedAt
}

enum ContactStatus {
  NEW
  IN_PROGRESS
  RESOLVED
  SPAM
}
```

#### 9. Audit & Logs

```prisma
model AuditLog {
  id          String   @id @default(cuid())
  action      String
  entityType  String
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

## Authentification

### Configuration NextAuth (`lib/auth/auth.config.ts`)

**Provider Credentials:**

- Email/password avec hash SHA-256 + salt (WebCrypto API - compatible Edge Runtime)
- Timing-safe comparison pour la vérification

**Callbacks:**

- `jwt`: Injecte `role` et `id` dans le token
- `session`: Expose `user.id` et `user.role` dans la session

**Configuration:**

- JWT strategy avec 30 jours de durée
- Pages custom: `/anmelden`, `/registrieren`

### Middleware (`middleware.ts`)

Protection des routes:

- **Protected routes:** `/mein-konto`, `/kasse`, `/api/orders/*`
- **Auth routes (redirect si déjà logué):** `/anmelden`, `/registrieren`
- Redirection avec paramètre `?redirect=` pour retour après login

### Stores Zustand (`lib/store/auth.ts`)

- `useAuth`: UI state auth + méthodes `login()`, `register()`, `logout()`
- `useAuthSync`: Hook qui synchronise la session NextAuth avec le store Zustand

---

## Panier - Architecture Hybride

### Server Actions (`app/actions/cart.ts`)

```typescript
// Logique hybride:
// - Utilisateurs connectés: Database (Prisma Cart/CartItem)
// - Visiteurs (guests): Cookies httpOnly (30 jours)

export async function addToCart(productId: string, quantity: number)
export async function updateCartItem(productId: string, quantity: number)
export async function removeFromCart(productId: string)
export async function getCartItems(): Promise<CartItemWithProduct[]>
export async function clearCart()
export async function mergeGuestCartOnLogin() // Fusion au login
```

### Flow du Panier

```text
Guest User:
  1. Add to cart → Cookie httpOnly "nova-cart" (30 jours)
  2. Cart page → Lit le cookie, fetch product details depuis DB

Authenticated User:
  1. Add to cart → Crée/maj ligne dans CartItem (DB)
  2. Cart page → Query Prisma avec relations product

Login:
  1. mergeGuestCartOnLogin() appelée
  2. Cookie → DB (fusion des quantités si même produit)
  3. Cookie supprimé
```

---

## Wishlist - Synchronisation Hybride

### Hook `useWishlist` (`lib/store/wishlist.ts`)

```typescript
// Comportement:
// - Non authentifié: localStorage (clé "nova-wishlist")
// - Authentifié: API `/api/wishlist` + sync au login

const { items, addItem, removeItem, isInWishlist, toggleItem } = useWishlist()
```

### Sync au Login

```text
1. useEffect détecte isAuthenticated = true
2. Récupère localStorage
3. POST /api/wishlist/sync avec les items locaux
4. Backend fusionne (unique constraint userId+productId)
5. localStorage.clear()
6. Refetch GET /api/wishlist
```

---

## API Routes Implémentées

### Routes d'Authentification

| Route | Méthode | Description |
|-------|---------|-------------|
|`/api/auth/[...nextauth]`|GET/POST|NextAuth.js handlers|
|`/api/auth/register`|POST|Création compte (hash SHA-256)|

### Produits

| Route | Méthode | Paramètres | Description |
|-------|---------|------------|-------------|
| `/api/products` | GET | `category`, `search`, `minPrice`, `maxPrice`, `sortBy`, `page`, `limit` | Liste paginée |
| `/api/products/[slug]` | GET | - | Détail produit |
| `/api/categories` | GET | - | Toutes les catégories |

### Wishlist

| Route | Méthode | Description |
|-------|---------|-------------|
| `/api/wishlist` | GET | Récupérer la wishlist |
| `/api/wishlist` | POST | Ajouter un produit |
| `/api/wishlist` | DELETE | Supprimer un produit (query: productId) |
| `/api/wishlist/sync` | POST | Fusion localStorage → DB au login |

### Commandes

| Route | Méthode | Auth | Description |
|-------|---------|------|-------------|
| `/api/orders` | POST | Oui | Créer commande |
| `/api/orders` | GET | Oui | Liste commandes user |
| `/api/orders/[id]` | GET | Oui | Détail commande |

### Adresses

| Route | Méthode | Auth | Description |
|-------|---------|------|-------------|
| `/api/addresses` | GET | Oui | Liste adresses |
| `/api/addresses` | POST | Oui | Créer adresse |
| `/api/addresses/[id]` | PUT | Oui | Modifier adresse |
| `/api/addresses/[id]` | DELETE | Oui | Supprimer adresse |

### Autres

| Route | Méthode | Description |
|-------|---------|-------------|
| `/api/contact` | POST | Envoyer message contact |
| `/api/newsletter/subscribe` | POST | Inscription newsletter |
| `/api/newsletter/unsubscribe` | POST | Désinscription |
| `/api/upload` | POST | Upload image Cloudinary |
| `/api/reviews` | GET/POST | Reviews produits |

---

## Intégrations Externes

### 1. Cloudinary (`lib/cloudinary.ts`)

```typescript
// Fonctions disponibles:
export async function uploadImage(file, folder, options)
export async function deleteImage(publicId)
export function getOptimizedUrl(publicId, width, height, crop)
export function getPlaceholderUrl(publicId) // Pour blur placeholder

// Configuration:
// - Cloud name, API key, API secret via env vars
// - Transformations auto: f_auto, q_auto
// - Max file size: 10MB
// - Formats: jpg, jpeg, png, webp, gif
```

### 2. Resend Emails (`lib/email/`)

**Templates React Email:**
- `order-confirmation.tsx`: Confirmation commande
- `shipping-notification.tsx`: Notification expédition

**Configuration:**
```env
RESEND_API_KEY=re_...
EMAIL_FROM=support@nova-indukt.de
```

### 3. Stripe (Préparation)

```env
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

**Routes à créer:**
- `/api/stripe/create-payment-intent`
- `/api/stripe/webhook`

---

## Design System

### Couleurs (Tailwind Config)

```typescript
colors: {
  nova: {
    DEFAULT: "#4ECCA3",
    dark: "#3BA88A",
    light: "#7DDEC3",
    50: "#E6F9F3",
    100: "#CFF0E6",
    // ... 900
  },
  anthracite: "#2D3436",
  steel: "#636E72",
  success: "#00B894",
  warning: "#FDCB6E",
  error: "#E17055",
}
```

### Typography

- **Body:** Inter (`--font-inter`)
- **Headings:** Space Grotesk (`--font-space-grotesk`)
- **Subheadings:** Sora (`--font-sora`)
- **Mono:** JetBrains Mono (`--font-jetbrains-mono`)

---

## Sécurité

### Hashing Passwords

```typescript
// WebCrypto API (Edge Runtime compatible)
async function sha256(message: string): Promise<string>
function generateSalt(): string
async function hashPassword(password: string): Promise<string> // salt:hash format
async function verifyPassword(password: string, hashedPassword: string): Promise<boolean>
```

### Rate Limiting (`lib/rate-limit.ts`)

- Rate limiting configuré pour auth et API sensibles
- Limites: 10 req/min par IP pour auth

### Middleware Protection

- CSRF protection native Next.js
- HttpOnly cookies pour panier guest
- Secure flag en production

---

## Performance

### Images

```javascript
// next.config.js
images: {
  formats: ['image/webp', 'image/avif'],
  deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
  remotePatterns: [
    { hostname: 'images.unsplash.com' },
    { hostname: 'res.cloudinary.com' }
  ]
}
```

### Rendering Strategy

- **Server Components:** Par défaut pour pages statiques
- **Client Components:** Uniquement pour interactivité (panier, wishlist, forms)
- **Suspense:** Pour lazy loading contenu dynamique

---

## Variables d'Environnement

```env
# Database
DATABASE_URL="postgresql://user:pass@host/db?sslmode=require"
DIRECT_URL="postgresql://user:pass@host/db?sslmode=require"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-min-32-chars-long"

# OAuth (optionnel)
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

# Redis (optionnel)
UPSTASH_REDIS_REST_URL="..."
UPSTASH_REDIS_REST_TOKEN="..."
```

---

## Scripts Package.json

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "test": "vitest",
    "test:ui": "vitest --ui",
    "coverage": "vitest run --coverage",
    "db:generate": "prisma generate",
    "db:migrate": "prisma migrate dev",
    "db:push": "prisma db push",
    "db:studio": "prisma studio",
    "db:seed": "tsx prisma/seed.ts"
  }
}
```

---

## Roadmap Actuelle

### ✅ Implémenté
- [x] Setup Next.js 16 + TypeScript
- [x] Prisma schema complet (10+ modèles)
- [x] NextAuth.js v5 avec Credentials provider
- [x] Hash passwords SHA-256 (Edge compatible)
- [x] Middleware protection routes
- [x] Server Actions panier (hybride DB/cookie)
- [x] API wishlist avec sync
- [x] API products avec filtres
- [x] Cloudinary integration
- [x] Templates emails Resend
- [x] Vitest setup

### 🚧 En Cours / À Compléter
- [ ] Migration 115 produits CSV → DB
- [ ] Upload batch images vers Cloudinary
- [ ] Intégration Stripe (payment intents, webhooks)
- [ ] Checkout complet avec paiement
- [ ] Gestion adresses utilisateur (UI)
- [ ] Historique commandes (page compte)
- [ ] Reviews produits (modération)
- [ ] Newsletter fonctionnelle
- [ ] Contact form avec envoi email

### 📋 À Venir
- [ ] Rate limiting production-ready
- [ ] Monitoring Sentry
- [ ] Tests E2E Playwright
- [ ] i18n multilingue (DE/EN)

---

## Notes de Développement

### Points d'attention

1. **Panier hybride:** La logique dans `app/actions/cart.ts` gère les deux cas (auth/guest). Toujours utiliser `getCart()` helper qui détecte automatiquement.

2. **Wishlist sync:** Le hook `useWishlist` gère automatiquement la sync au login. Ne pas oublier d'appeler l'API `/api/wishlist/sync`.

3. **Images:** Actuellement les 115 produits ont des images locales dans `/public/images/products/`. Prévoir la migration vers Cloudinary pour CDN.

4. **Password hashing:** Utilise WebCrypto API pour compatibilité Edge Runtime. Pas besoin de bcrypt qui nécessite des bindings natifs.

5. **TVA:** Les prix sont stockés TTC (B2C). Utilitaire `lib/utils/vat.ts` pour conversions net/brut avec taux allemand 19%.

