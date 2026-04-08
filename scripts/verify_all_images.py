#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Vérification complète des images produits
"""
import os
import re
from pathlib import Path

BASE_DIR = Path(r"C:\Users\Paul\Documents\Développement web\NOVA_INDUKT\nova-indukt")
PRODUCTS_FILE = BASE_DIR / "lib" / "data" / "products.ts"
IMAGES_DIR = BASE_DIR / "public" / "images" / "products"

def main():
    print("=" * 90)
    print("VÉRIFICATION COMPLÈTE DES IMAGES")
    print("=" * 90)
    
    # 1. Lire products.ts
    with open(PRODUCTS_FILE, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # 2. Extraire tous les appels p()
    pattern = r"p\(['\"]([^'\"]+)['\"],\s*['\"]([^'\"]+)['\"](?:,\s*['\"]([^'\"]+)['\"](?:,\s*['\"]([^'\"]+)['\"])?)?\)"
    
    calls = re.findall(pattern, content)
    print(f"\nTotal appels p() trouvés: {len(calls)}")
    
    # 3. Liste tous les dossiers d'images
    existing_folders = set()
    if IMAGES_DIR.exists():
        for item in IMAGES_DIR.iterdir():
            if item.is_dir():
                existing_folders.add(item.name)
    
    print(f"Dossiers d'images existants: {len(existing_folders)}")
    
    # 4. Vérifier chaque appel
    issues = []
    missing_folders = set()
    used_folders = set()
    
    for call in calls:
        folder_slug = call[0]
        filename = call[1]
        category = call[2] if len(call) > 2 and call[2] else None
        product_name = call[3] if len(call) > 3 and call[3] else None
        
        # Déterminer le dossier attendu
        if product_name:
            expected_folder = product_name.replace('  ', ' / ')
            expected_folder = re.sub(r'[<>:"/\\|?*]', ' ', expected_folder).strip()
        else:
            expected_folder = folder_slug
        
        used_folders.add(expected_folder)
        
        # Vérifier si le dossier existe
        if expected_folder not in existing_folders:
            missing_folders.add(expected_folder)
            issues.append(f"❌ Dossier manquant: {expected_folder} pour {filename}")
        else:
            # Vérifier si le fichier existe
            expected_path = IMAGES_DIR / expected_folder / filename
            if not expected_path.exists():
                issues.append(f"❌ Fichier manquant: {expected_folder}/{filename}")
    
    # 5. Rapport
    print(f"\n{'='*90}")
    print("PROBLÈMES TROUVÉS")
    print(f"{'='*90}")
    
    if issues:
        print(f"\n{len(issues)} problèmes:")
        for issue in issues[:30]:  # Limiter l'affichage
            print(f"  {issue}")
        if len(issues) > 30:
            print(f"  ... et {len(issues) - 30} autres")
    else:
        print("\n✅ Aucun problème trouvé!")
    
    # 6. Dossiers non utilisés
    unused_folders = existing_folders - used_folders
    print(f"\n{'='*90}")
    print(f"DOSSIERS NON UTILISÉS ({len(unused_folders)})")
    print(f"{'='*90}")
    for folder in sorted(unused_folders)[:20]:
        print(f"  - {folder}")
    
    # 7. Résumé
    print(f"\n{'='*90}")
    print("RÉSUMÉ")
    print(f"{'='*90}")
    print(f"Total appels p(): {len(calls)}")
    print(f"Dossiers existants: {len(existing_folders)}")
    print(f"Dossiers utilisés: {len(used_folders)}")
    print(f"Dossiers manquants: {len(missing_folders)}")
    print(f"Dossiers non utilisés: {len(unused_folders)}")
    print(f"Problèmes: {len(issues)}")

if __name__ == "__main__":
    main()
