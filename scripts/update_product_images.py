#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Script pour mettre a jour les images des produits dans products.ts
"""
import os
import re
import csv
from pathlib import Path

BASE_DIR = Path(r"C:\Users\Paul\Documents\Développement web\NOVA_INDUKT\nova-indukt")
PRODUCTS_FILE = BASE_DIR / "lib" / "data" / "products.ts"
CSV_FILE = BASE_DIR / "scripts" / "products-with-images.csv"

def sanitize_for_regex(text):
    """Échappe les caractères spéciaux pour les regex"""
    return re.escape(text)

def create_image_array(images_str, slug, category, product_name):
    """Crée le bloc d'images au format p()"""
    images = [img.strip() for img in images_str.split(',')]
    lines = []
    for img in images:
        lines.append(f"      p('{slug}', '{img}', '{category}', '{product_name}')")
    return ',\n'.join(lines)

def main():
    print("=" * 80)
    print("MISE A JOUR DES IMAGES DE PRODUITS")
    print("=" * 80)
    
    # 1. Lire le CSV
    print("\n1. Lecture du CSV...")
    updates = []
    with open(CSV_FILE, 'r', encoding='utf-8-sig') as f:
        reader = csv.DictReader(f)
        for row in reader:
            updates.append(row)
    print(f"   {len(updates)} produits a mettre a jour")
    
    # 2. Lire le fichier products.ts
    print("\n2. Lecture de products.ts...")
    with open(PRODUCTS_FILE, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # 3. Appliquer les mises a jour
    print("\n3. Application des mises a jour...")
    updated_count = 0
    errors = []
    
    for update in updates:
        num = update['num']
        slug = update['slug']
        name = update['name']
        category = update['category']
        images_str = update['available_images']
        folder = update['folder']
        
        # Créer le nouveau bloc d'images
        new_images_block = create_image_array(images_str, slug, category, name)
        
        # Pattern pour trouver le produit
        # Recherche flexible du bloc images pour ce produit
        product_pattern = rf"(//\s*{num}\s*[—-]\s*[^\n]+\n\s*\{{[^}}]*?id:\s*['\"]{re.escape(update['id'])}['\"][^}}]*?images:\s*\[)([^\]]+)(\])"
        
        match = re.search(product_pattern, content, re.DOTALL)
        
        if match:
            old_images = match.group(2).strip()
            
            # Vérifier si c'est déja a jour (pas de main.jpg/detail.jpg)
            if 'main.jpg' not in old_images and 'detail.jpg' not in old_images:
                print(f"   #{num}: Déja a jour (ignoré)")
                continue
            
            # Remplacer
            new_content = content[:match.start(2)] + '\n' + new_images_block + '\n    ' + content[match.end(2):]
            content = new_content
            updated_count += 1
            print(f"   #{num}: [OK] Mis a jour ({len(images_str.split(','))} images)")
        else:
            # Essayer une approche alternative avec le slug
            alt_pattern = rf"(//\s*{num}\s*[—-][^\n]+\n\s*\{{[^}}]*?slug:\s*['\"]{re.escape(slug)}['\"][^}}]*?images:\s*\[)([^\]]+)(\])"
            match = re.search(alt_pattern, content, re.DOTALL)
            
            if match:
                old_images = match.group(2).strip()
                
                if 'main.jpg' not in old_images and 'detail.jpg' not in old_images:
                    print(f"   #{num}: Déja a jour (ignoré)")
                    continue
                
                new_content = content[:match.start(2)] + '\n' + new_images_block + '\n    ' + content[match.end(2):]
                content = new_content
                updated_count += 1
                print(f"   #{num}: [OK] Mis a jour ({len(images_str.split(','))} images)")
            else:
                errors.append(f"#{num} - {name}")
                print(f"   #{num}: [ERREUR] Non trouvé")
    
    # 4. Sauvegarder le fichier modifié
    print(f"\n4. Sauvegarde...")
    backup_file = PRODUCTS_FILE.with_suffix('.ts.backup')
    
    # Créer une sauvegarde
    with open(PRODUCTS_FILE, 'r', encoding='utf-8') as f:
        original_content = f.read()
    with open(backup_file, 'w', encoding='utf-8') as f:
        f.write(original_content)
    print(f"   Sauvegarde créée: {backup_file.name}")
    
    # Écrire le fichier modifié
    with open(PRODUCTS_FILE, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"   Fichier mis a jour: {PRODUCTS_FILE.name}")
    
    # 5. Résumé
    print("\n" + "=" * 80)
    print("RÉSULTATS")
    print("=" * 80)
    print(f"Produits mis a jour: {updated_count}/{len(updates)}")
    print(f"Erreurs: {len(errors)}")
    
    if errors:
        print("\nProduits non trouvés:")
        for e in errors:
            print(f"  - {e}")
    
    print(f"\nFichier backup: {backup_file}")
    print("\nIMPORTANT: Vérifiez que le fichier TypeScript est valide avec:")
    print("  npx tsc --noEmit")

if __name__ == "__main__":
    main()
