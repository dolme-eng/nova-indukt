# 🚀 Guide Déploiement Netlify - NOVA INDUKT

## ÉTAPE 1 : Installer Netlify CLI

```powershell
npm install -g netlify-cli
```

## ÉTAPE 2 : Se connecter à Netlify

```powershell
netlify login
```
→ Ça ouvre ton navigateur, clique "Authorize"

## ÉTAPE 3 : Initialiser le projet

Dans le dossier `nova-indukt` :

```powershell
netlify init
```

Choisis :
- ✅ "Create & configure a new site"
- Ton équipe (ton compte)
- Nom du site : `nova-indukt-shop` (ou ce que tu veux)

## ÉTAPE 4 : Configurer les variables d'environnement

Dans le dashboard Netlify :
1. Va sur ton site → **Site settings** → **Environment variables**
2. Clique **Add variables** → **Import from .env file**
3. Copie-colle le contenu de `NETLIFY_ENV.md` (section OBLIGATOIRES)

**IMPORTANT** : Génère ta clé AUTH_SECRET :
```powershell
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## ÉTAPE 5 : Déployer

```powershell
netlify deploy --prod --build
```

Ou en deux étapes :
```powershell
# Build local d'abord
npm run build

# Puis deploy
netlify deploy --prod
```

## ÉTAPE 6 : Vérifier le déploiement

1. Attends la fin du build (~3-5 minutes)
2. Va sur l'URL affichée (ex: `https://nova-indukt-shop.netlify.app`)
3. Teste :
   - La page d'accueil charge
   - Les produits s'affichent
   - Le panier fonctionne

## 🔧 Si ça ne marche pas

### Problème : "Database connection error"
→ Vérifie que `DATABASE_URL` est bien copiée dans Netlify

### Problème : "NextAuth error"
→ Vérifie `AUTH_SECRET`, `NEXTAUTH_SECRET`, et `NEXTAUTH_URL`

### Problème : Build échoue
```powershell
# Nettoyer et rebuild
rm -rf .next
npm run build
```

### Voir les logs en temps réel
```powershell
netlify deploy --prod --build --debug
```

## 📁 Fichiers déjà configurés

- ✅ `netlify.toml` → Mis à jour pour Next.js
- ✅ `lib/auth/auth.config.ts` → `trustHost: true` ajouté
- ✅ Prisma schema → Compatible Neon

## 🌐 URLs après déploiement

- Site : `https://[ton-nom].netlify.app`
- Admin : `https://[ton-nom].netlify.app/admin`
- API : `https://[ton-nom].netlify.app/api/...`

---

**Besoin d'aide ?** Vérifie les logs dans le Netlify Dashboard → Deploys → [ton deploy] → Deploy log
