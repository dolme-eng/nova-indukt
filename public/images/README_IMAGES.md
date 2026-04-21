# 📸 Guide des Images - NOVA INDUKT

## Dossiers créés avec noms simples (ASCII)

### 1. Produit Premium
**Dossier** : `public/images/products/Premium-Topfset-5-teilig/`

**Fichiers attendus** :
- `premium-topfset1.jpg` (image principale hero)
- `premium-topfset2.jpg` (image secondaire)

**Slug produit** : `premium-induktions-topfset-5-teilig`

---

### 2. Produits avec problèmes d'images (à vérifier)

| Produit | Dossier | Statut |
|---------|---------|--------|
| Global G-2 Kochmesser 20 cm | `Global G-2 Kochmesser 20 cm/` | ⚠️ VIDE - Ajouter images |
| Rösle Silicone Küchenhelfer Set 5-teilig | `Rösle Silicone Küchenhelfer Set 5-teilig/` | ⚠️ VIDE - Ajouter images |

---

### 3. Blog
**Dossier simplifié** : `public/images/blog-simple/`

**Fichiers attendus** (renommés sans caractères spéciaux) :
- `pfanne-induktion-kaufratgeber.jpg` (ex: "Die richtige Pfanne...")
- `edelstahlpfannen-reinigen.jpg" (ex: "Edelstahlpfannen richtig...")
- `induktion-gas-vergleich.jpg" (ex: "Induktion vs. Gas...")

---

## 🔧 Renommage rapide des fichiers existants

### Option A : PowerShell (recommandé)
```powershell
# Blog
Rename-Item "blog/Die richtige Pfanne für Induktion Der ultimative Kaufratgeber 2026.jpg" "blog-simple/pfanne-induktion-kaufratgeber.jpg"
Rename-Item "blog/Edelstahlpfannen richtig reinigen & pflegen – ohne Kratzer und Flecken.jpg" "blog-simple/edelstahlpfannen-reinigen.jpg"
Rename-Item "blog/Induktion vs. Gas Der große Energiekostenvergleich 2026.jpg" "blog-simple/induktion-gas-vergleich.jpg"

# Produit Premium
Copy-Item "blog/pfanne-induktion-kaufratgeber.jpg" "products/Premium-Topfset-5-teilig/premium-topfset1.jpg"
Copy-Item "blog/edelstahlpfannen-reinigen.jpg" "products/Premium-Topfset-5-teilig/premium-topfset2.jpg"
```

### Option B : Manuellement
1. Copier les images source
2. Renommer avec des noms simples (pas d'accents, pas d'espaces, pas de &)
3. Coller dans les dossiers correspondants

---

## ✅ Après ajout des images

1. **Redémarrer le serveur** : `npm run dev`
2. **Vider le cache navigateur** (Ctrl+F5)
3. **Vérifier** la page produit : `/produkt/premium-induktions-topfset-5-teilig`

---

## 📝 Notes

- Formats acceptés : `.jpg`, `.jpeg`, `.png`, `.webp`
- Taille recommandée : 900px de large minimum
- Poids max : 500KB par image
