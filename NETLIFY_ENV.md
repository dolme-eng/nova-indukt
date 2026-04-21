# Variables d'Environnement Netlify - NOVA INDUKT

Copie-colle ces variables dans ton dashboard Netlify :
Site Settings → Environment Variables

## 🔴 OBLIGATOIRES (Minimum pour fonctionner)

```
DATABASE_URL=postgresql://neondb_owner:npg_Hksl9PheA8JB@ep-lively-meadow-alasjsfk-pooler.c-3.eu-central-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require

# Génère une clé avec : node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
AUTH_SECRET=REPLACE_WITH_64_CHAR_KEY
NEXTAUTH_SECRET=REPLACE_WITH_SAME_64_CHAR_KEY
NEXTAUTH_URL=https://novaindukt.netlify.app
NEXT_PUBLIC_SITE_URL=https://novaindukt.netlify.app
```

## 🟡 RECOMMANDÉES (Pour toutes les fonctionnalités)

```
# Email (Resend - https://resend.com)
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxx
FROM_EMAIL=noreply@nova-indukt.de
FROM_NAME=NOVA INDUKT

# Images (Cloudinary - https://cloudinary.com)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=ton-cloud-name
CLOUDINARY_CLOUD_NAME=ton-cloud-name
CLOUDINARY_API_KEY=ton-api-key
CLOUDINARY_API_SECRET=ton-api-secret

# Analytics (Google Analytics)
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

## 🟢 PAIEMENTS (Si tu veux tester les commandes)

```
# Stripe (Test mode)
STRIPE_PUBLIC_KEY=pk_test_xxxxxxxx
STRIPE_SECRET_KEY=sk_test_xxxxxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxx
```

---

## ⚡ Commande pour générer AUTH_SECRET

Dans PowerShell ou CMD :

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Copie le résultat (64 caractères) dans AUTH_SECRET et NEXTAUTH_SECRET.
