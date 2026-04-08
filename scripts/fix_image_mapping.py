#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Corrige le mapping des images entre products.ts et les dossiers réels
"""
import os
import re
import csv
from pathlib import Path
from difflib import get_close_matches

BASE_DIR = Path(r"C:\Users\Paul\Documents\Développement web\NOVA_INDUKT\nova-indukt")
PRODUCTS_FILE = BASE_DIR / "lib" / "data" / "products.ts"
IMAGES_DIR = BASE_DIR / "public" / "images" / "products"

def normalize_name(name):
    """Normalise un nom pour comparaison"""
    name = name.lower()
    name = re.sub(r'\s+', ' ', name)  # Espaces multiples -> simple
    name = re.sub(r'[–—]', '-', name)  # Tirets spéciaux -> tiret simple
    name = re.sub(r'[®™©]', '', name)  # Supprimer symboles
    name = re.sub(r'[^\w\s-]', '', name)  # Garder alphanum, espaces, tirets
    return name.strip()

def main():
    print("=" * 90)
    print("CORRECTION DU MAPPING IMAGES")
    print("=" * 90)
    
    # 1. Liste des dossiers existants
    existing_folders = {}
    if IMAGES_DIR.exists():
        for item in IMAGES_DIR.iterdir():
            if item.is_dir():
                files = [f.name for f in item.iterdir() if f.is_file()]
                existing_folders[item.name] = {
                    'normalized': normalize_name(item.name),
                    'files': files
                }
    
    print(f"\nDossiers existants: {len(existing_folders)}")
    
    # 2. Lire products.ts
    with open(PRODUCTS_FILE, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # 3. Trouver tous les appels p()
    pattern = r"p\(['\"]([^'\"]+)['\"],\s*['\"]([^'\"]+)['\"](?:,\s*['\"]([^'\"]+)['\"](?:,\s*['\"]([^'\"]+)['\"])?)?\)"
    calls = list(re.finditer(pattern, content))
    
    print(f"Appels p() trouvés: {len(calls)}")
    
    # 4. Créer le mapping
    mappings = []  # (ancien_nom, nouveau_nom, fichiers)
    unmatched = []
    
    for match in calls:
        folder_slug = match.group(1)
        filename = match.group(2)
        category = match.group(3) if match.group(3) else None
        product_name = match.group(4) if match.group(4) else None
        
        # Le nom attendu dans le code
        expected_name = product_name if product_name else folder_slug
        normalized_expected = normalize_name(expected_name)
        
        # Chercher le meilleur match
        best_match = None
        best_score = 0
        
        for folder_name, data in existing_folders.items():
            # Comparer les noms normalisés
            if data['normalized'] == normalized_expected:
                best_match = folder_name
                best_score = 100
                break
            
            # Similarité partielle
            if normalized_expected in data['normalized'] or data['normalized'] in normalized_expected:
                score = 80
                if score > best_score:
                    best_score = score
                    best_match = folder_name
        
        # Si pas de match exact, essayer difflib
        if not best_match or best_score < 80:
            all_normalized = [data['normalized'] for data in existing_folders.values()]
            close_matches = get_close_matches(normalized_expected, all_normalized, n=1, cutoff=0.6)
            if close_matches:
                for folder_name, data in existing_folders.items():
                    if data['normalized'] == close_matches[0]:
                        best_match = folder_name
                        best_score = 70
                        break
        
        if best_match and best_score >= 70:
            if expected_name != best_match:
                mappings.append((expected_name, best_match, filename))
        else:
            unmatched.append((expected_name, filename))
    
    # 5. Afficher le mapping
    print(f"\n{'='*90}")
    print(f"MAPPINGS À APPLIQUER ({len(mappings)})")
    print(f"{'='*90}")
    
    for old, new, file in mappings[:20]:
        print(f"  {old[:50]:50} -> {new[:40]}")
    if len(mappings) > 20:
        print(f"  ... et {len(mappings) - 20} autres")
    
    # 6. Afficher non matchés
    print(f"\n{'='*90}")
    print(f"NON MATCHÉS ({len(unmatched)})")
    print(f"{'='*90}")
    for name, file in unmatched[:10]:
        print(f"  ❌ {name[:60]} / {file}")
    
    # 7. Appliquer les corrections
    print(f"\n{'='*90}")
    print("APPLICATION DES CORRECTIONS")
    print(f"{'='*90}")
    
    corrections_count = 0
    
    # Lire le contenu original
    with open(PRODUCTS_FILE, 'r', encoding='utf-8') as f:
        original_content = f.read()
    
    new_content = original_content
    
    for old_name, new_folder, filename in mappings:
        # Pattern pour remplacer le 4ème paramètre (productName) dans p()
        # p('slug', 'file', 'category', 'old_name') -> p('slug', 'file', 'category', 'new_folder')
        
        escaped_old = re.escape(old_name)
        pattern_replace = rf"(p\(['\"][^'\"]+['\"],\s*['\"][^'\"]+['\"],\s*['\"][^'\"]+['\"],\s*['\"]){escaped_old}(['\"])"
        
        if re.search(pattern_replace, new_content):
            new_content = re.sub(pattern_replace, rf"\g<1>{new_folder}\g<2>", new_content)
            corrections_count += 1
            print(f"  ✅ {old_name[:40]:40} -> {new_folder[:40]}")
    
    # 8. Sauvegarder
    if corrections_count > 0:
        backup = PRODUCTS_FILE.with_suffix('.ts.backup2')
        with open(backup, 'w', encoding='utf-8') as f:
            f.write(original_content)
        print(f"\n  Sauvegarde: {backup}")
        
        with open(PRODUCTS_FILE, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"  Fichier mis à jour: {corrections_count} corrections")
    else:
        print("\n  Aucune correction nécessaire")
    
    print(f"\n{'='*90}")
    print("RÉSULTAT")
    print(f"{'='*90}")
    print(f"Total mappings trouvés: {len(mappings)}")
    print(f"Corrections appliquées: {corrections_count}")
    print(f"Non matchés: {len(unmatched)}")

if __name__ == "__main__":
    main()
