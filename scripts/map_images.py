#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Script pour mapper les images aux produits dans products.ts
"""
import os
import re
import csv
from pathlib import Path
from collections import defaultdict

# Chemins
BASE_DIR = Path(r"C:\Users\Paul\Documents\Développement web\NOVA_INDUKT\nova-indukt")
IMAGES_DIR = BASE_DIR / "public" / "images" / "products"
PRODUCTS_FILE = BASE_DIR / "lib" / "data" / "products.ts"
OUTPUT_DIR = BASE_DIR / "scripts"

def get_folders_with_images():
    """Récupère tous les dossiers avec leurs images"""
    folders = {}
    for folder in IMAGES_DIR.iterdir():
        if folder.is_dir():
            images = sorted([f.name for f in folder.iterdir() 
                           if f.suffix.lower() in ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.avif']])
            folders[folder.name] = {
                'count': len(images),
                'images': images,
                'first_image': images[0] if images else None
            }
    return folders

def extract_products(content):
    """Extrait les produits du fichier products.ts"""
    # Pattern pour trouver les produits
    pattern = r"//\s*(\d+)\s*[—-]\s*([^\n]+)\n\s*\{\s*id:\s*['\"]([^'\"]+)['\"].*?slug:\s*['\"]([^'\"]+)['\"].*?name:\s*\{\s*de:\s*['\"]([^'\"]+)['\"]\s*\}.*?category:\s*['\"]([^'\"]+)['\"].*?images:\s*\[([^\]]+)\]"
    
    products = []
    for match in re.finditer(pattern, content, re.DOTALL):
        num, comment_name, id, slug, name, category, images_block = match.groups()
        
        # Nettoyer le bloc d'images
        images_block = images_block.strip()
        is_placeholder = 'main.jpg' in images_block or 'detail.jpg' in images_block
        
        products.append({
            'num': num.strip(),
            'comment_name': comment_name.strip(),
            'id': id,
            'slug': slug,
            'name': name,
            'category': category,
            'images_block': images_block,
            'is_placeholder': is_placeholder,
            'match_start': match.start(),
            'match_end': match.end()
        })
    
    return products

def find_matching_folder(product, folders):
    """Trouve le dossier correspondant à un produit"""
    name_lower = product['name'].lower()
    slug_lower = product['slug'].lower()
    
    best_match = None
    best_score = 0
    
    for folder_name, folder_data in folders.items():
        folder_lower = folder_name.lower()
        score = 0
        
        # Mots clés à chercher
        keywords = [
            (r'wmf', 'wmf'),
            (r'zwilling', 'zwilling'),
            (r'fissler', 'fissler'),
            (r'tefal', 'tefal'),
            (r'silit', 'silit'),
            (r'le\s+creuset', 'le creuset'),
            (r'lodge', 'lodge'),
            (r'rösle', 'rösle'),
            (r'ballarini', 'ballarini'),
            (r'ken\s+hom', 'ken hom'),
            (r'kopf', 'kopf'),
            (r'berndes', 'berndes'),
            (r'elo', 'elo'),
            (r'demeyere', 'demeyere'),
            (r'gsw', 'gsw'),
            (r'skk', 'skk'),
            (r'krüger', 'krüger'),
            (r'villeroy', 'villeroy'),
            (r'peugeot', 'peugeot'),
            (r'staub', 'staub'),
            (r'vitamix', 'vitamix'),
            (r'global', 'global'),
            (r'wüsthof', 'wüsthof'),
            (r'zw', 'zwilling'),
            (r'fi-', 'fissler'),
            (r'tf-', 'tefal'),
            (r'wmf-', 'wmf'),
            (r'zw-', 'zwilling'),
        ]
        
        for pattern, brand in keywords:
            if re.search(pattern, name_lower) and brand in folder_lower:
                score += 30
        
        # Mots du nom du produit
        name_words = re.findall(r'\b\w{3,}\b', name_lower)
        for word in name_words:
            if word in folder_lower:
                score += 10
        
        # Vérifier si le dossier a des images
        if folder_data['count'] == 0:
            score = 0
        
        if score > best_score:
            best_score = score
            best_match = folder_name
    
    return best_match, best_score

def main():
    print("=" * 80)
    print("MAPPING DES IMAGES AUX PRODUITS")
    print("=" * 80)
    
    # 1. Récupérer les dossiers avec images
    print("\n1. Analyse des dossiers d'images...")
    folders = get_folders_with_images()
    folders_with_images = {k: v for k, v in folders.items() if v['count'] > 0}
    folders_empty = {k: v for k, v in folders.items() if v['count'] == 0}
    
    print(f"   Total dossiers: {len(folders)}")
    print(f"   Avec images: {len(folders_with_images)}")
    print(f"   Vides: {len(folders_empty)}")
    
    # 2. Lire le fichier products.ts
    print("\n2. Lecture du fichier products.ts...")
    with open(PRODUCTS_FILE, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # 3. Extraire les produits
    products = extract_products(content)
    print(f"   Produits trouvés: {len(products)}")
    
    # 4. Mapper les produits
    print("\n3. Mapping des produits aux dossiers...")
    products_with_mapping = []
    products_without_mapping = []
    
    for product in products:
        if not product['is_placeholder']:
            continue
        
        folder, score = find_matching_folder(product, folders)
        
        if folder and folders[folder]['count'] > 0:
            products_with_mapping.append({
                **product,
                'folder': folder,
                'score': score,
                'available_images': folders[folder]['images'],
                'image_count': folders[folder]['count']
            })
        else:
            reason = "Dossier vide" if folder else "Aucun dossier correspondant"
            products_without_mapping.append({
                **product,
                'folder': folder if folder else "N/A",
                'reason': reason
            })
    
    # 5. Afficher les résultats
    print(f"\n   Produits avec mapping: {len(products_with_mapping)}")
    print(f"   Produits sans mapping: {len(products_without_mapping)}")
    
    # 6. Sauvegarder les CSV
    print("\n4. Sauvegarde des fichiers CSV...")
    
    # CSV avec mapping
    if products_with_mapping:
        with open(OUTPUT_DIR / 'products-with-images.csv', 'w', newline='', encoding='utf-8-sig') as f:
            writer = csv.DictWriter(f, fieldnames=['num', 'id', 'slug', 'name', 'category', 'folder', 'image_count', 'available_images'])
            writer.writeheader()
            for p in products_with_mapping:
                writer.writerow({
                    'num': p['num'],
                    'id': p['id'],
                    'slug': p['slug'],
                    'name': p['name'],
                    'category': p['category'],
                    'folder': p['folder'],
                    'image_count': p['image_count'],
                    'available_images': ', '.join(p['available_images'])
                })
    
    # CSV sans mapping
    if products_without_mapping:
        with open(OUTPUT_DIR / 'products-without-images.csv', 'w', newline='', encoding='utf-8-sig') as f:
            writer = csv.DictWriter(f, fieldnames=['num', 'id', 'slug', 'name', 'category', 'folder', 'reason'])
            writer.writeheader()
            for p in products_without_mapping:
                writer.writerow({
                    'num': p['num'],
                    'id': p['id'],
                    'slug': p['slug'],
                    'name': p['name'],
                    'category': p['category'],
                    'folder': p['folder'],
                    'reason': p['reason']
                })
    
    # 7. Générer le rapport MD
    print("\n5. Génération du rapport...")
    report_lines = [
        "# RAPPORT DE MAPPING DES IMAGES",
        "",
        "## Statistiques",
        f"- Total dossiers: {len(folders)}",
        f"- Dossiers avec images: {len(folders_with_images)}",
        f"- Dossiers vides: {len(folders_empty)}",
        f"- Produits analysés: {len(products)}",
        f"- Produits avec images disponibles: {len(products_with_mapping)}",
        f"- Produits sans images: {len(products_without_mapping)}",
        "",
        "## Dossiers SANS images (à remplir manuellement)",
        ""
    ]
    
    for name in sorted(folders_empty.keys()):
        report_lines.append(f"- {name}")
    
    report_lines.extend([
        "",
        "## Produits SANS correspondance d'images",
        ""
    ])
    
    for p in products_without_mapping:
        report_lines.append(f"- **#{p['num']}** - {p['name']} | {p['reason']}")
    
    report_lines.extend([
        "",
        "## Produits AVEC images disponibles (échantillon)",
        ""
    ])
    
    for p in products_with_mapping[:20]:
        report_lines.append(f"- **#{p['num']}** - {p['name']} | {p['image_count']} images")
    
    if len(products_with_mapping) > 20:
        report_lines.append(f"- ... et {len(products_with_mapping) - 20} autres")
    
    with open(OUTPUT_DIR / 'image-mapping-report.md', 'w', encoding='utf-8') as f:
        f.write('\n'.join(report_lines))
    
    # 8. Afficher le résumé
    print("\n" + "=" * 80)
    print("RÉSULTATS")
    print("=" * 80)
    print(f"\nDossiers avec images: {len(folders_with_images)}")
    print(f"Dossiers vides: {len(folders_empty)}")
    print(f"\nProduits pouvant être mis à jour: {len(products_with_mapping)}")
    print(f"Produits sans images: {len(products_without_mapping)}")
    
    if folders_empty:
        print("\n--- DOSSIERS VIDES (2) ---")
        for name in sorted(folders_empty.keys())[:5]:
            print(f"  - {name}")
    
    if products_without_mapping:
        print(f"\n--- PRODUITS SANS IMAGES ({len(products_without_mapping)}) ---")
        for p in products_without_mapping[:10]:
            print(f"  #{p['num']}: {p['name'][:60]}...")
    
    print(f"\nFichiers générés dans: {OUTPUT_DIR}")
    print("  - products-with-images.csv")
    print("  - products-without-images.csv")
    print("  - image-mapping-report.md")

if __name__ == "__main__":
    main()
