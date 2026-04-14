# Tests - NOVA INDUKT Backend

Ce dossier contient tous les tests pour le backend de NOVA INDUKT.

## 📁 Structure des Tests

```
tests/
├── setup.ts                 # Configuration et mocks globaux
├── README.md               # Documentation
├── api/                    # Tests des API Routes
│   ├── auth.test.ts       # Tests auth (register/login)
│   ├── products.test.ts   # Tests products (list/detail)
│   ├── categories.test.ts # Tests categories
│   └── orders.test.ts     # Tests orders (CRUD)
├── actions/               # Tests des Server Actions
│   └── cart.test.ts      # Tests cart (add/update/remove)
└── lib/                   # Tests des utilitaires
    └── auth.test.ts      # Tests auth config & helpers
```

## 🚀 Commandes de Test

```bash
# Lancer tous les tests en mode watch
npm test

# Lancer les tests avec interface UI
npm run test:ui

# Lancer les tests avec couverture de code
npm run coverage

# Lancer les tests une seule fois
npx vitest run
```

## 📊 Couverture des Tests

### API Routes

| Route | Tests |
|-------|-------|
| `POST /api/auth/register` | ✅ Validation, création, erreurs doublons |
| `GET /api/products` | ✅ Liste, filtres, tri, pagination |
| `GET /api/products/[slug]` | ✅ Détail, 404, erreurs |
| `GET /api/categories` | ✅ Liste avec compteur |
| `GET /api/orders` | ✅ Liste, authentification requise |
| `POST /api/orders` | ✅ Création, validation, erreurs |
| `GET /api/orders/[id]` | ✅ Détail, autorisation, 404 |

### Server Actions

| Action | Tests |
|--------|-------|
| `addToCart()` | ✅ DB user, cookie guest, update qty, erreurs |
| `updateCartItem()` | ✅ Update qty, remove (qty=0), cookie |
| `removeFromCart()` | ✅ Delete item |
| `getCartItems()` | ✅ DB cart, cookie cart, empty |
| `clearCart()` | ✅ Clear DB, clear cookie, erreurs |
| `mergeGuestCartOnLogin()` | ✅ Fusion, création cart, edge cases |

### Librairie

| Fonction | Tests |
|----------|-------|
| `authConfig` | ✅ Pages, session strategy, callbacks |
| `authorize()` | ✅ Login success, invalid creds, errors |
| `jwt callback` | ✅ Token enrichment |
| `session callback` | ✅ Session enrichment |
| `auth()` | ✅ getServerSession wrapper |
| `getCurrentUser()` | ✅ User with relations, null cases |
| `requireAuth()` | ✅ Auth check, throw error |

## 🛠️ Mocks Disponibles

### Global (setup.ts)

- `next/headers` - cookies(), headers()
- `next-auth` - getServerSession()
- `next-auth/react` - signIn(), signOut(), useSession()
- `bcryptjs` - hash(), compare()
- `@/lib/prisma` - All Prisma models

### Données de Test

```typescript
import { mockUser, mockProduct, mockCategory, mockOrder } from '@/tests/setup'
```

## 📝 Exemple de Test

```typescript
import { describe, it, expect, vi } from 'vitest'
import { prisma } from '@/lib/prisma'

describe('Ma Feature', () => {
  it('should do something', async () => {
    // Arrange
    vi.mocked(prisma.model.findMany).mockResolvedValue([mockData])
    
    // Act
    const result = await myFunction()
    
    // Assert
    expect(result).toEqual(expectedValue)
    expect(prisma.model.findMany).toHaveBeenCalledWith(expect.any(Object))
  })
})
```

## 🔧 Configuration

### vitest.config.ts
- Environment: `jsdom`
- Globals: activés
- Coverage: v8 provider
- Alias: `@/` → root

### Couverture Exclue
- `node_modules/`
- `tests/`
- `*.config.*`
- `prisma/`

## 💡 Bonnes Pratiques

1. **Utiliser les mocks** - Toujours mocker Prisma et les dépendances externes
2. **Isoler les tests** - Chaque test doit être indépendant (beforeEach)
3. **Nommer clairement** - `should [expected behavior] when [condition]`
4. **Tester les erreurs** - Ne pas oublier les cas d'erreur (400, 401, 404, 500)
5. **Utiliser les données de test** - mockUser, mockProduct, etc.

## 🐛 Debug

```bash
# Lancer un test spécifique
npx vitest run tests/api/auth.test.ts

# Lancer avec verbose
npx vitest --reporter=verbose

# Debug avec console.log (visible dans output)
console.log('Debug:', result)
```
