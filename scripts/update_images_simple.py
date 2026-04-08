#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Script simple pour mettre a jour les images des produits
"""
import re
import csv
from pathlib import Path

BASE_DIR = Path(r"C:\Users\Paul\Documents\Développement web\NOVA_INDUKT\nova-indukt")
PRODUCTS_FILE = BASE_DIR / "lib" / "data" / "products.ts"
CSV_FILE = BASE_DIR / "scripts" / "products-with-images.csv"

def main():
    print("=" * 80)
    print("MISE A JOUR DES IMAGES - APPROCHE SIMPLE")
    print("=" * 80)
    
    # 1. Lire le CSV
    print("\n1. Lecture du CSV...")
    updates = []
    with open(CSV_FILE, 'r', encoding='utf-8-sig') as f:
        reader = csv.DictReader(f)
        for row in reader:
            updates.append(row)
    print(f"   {len(updates)} produits a mettre a jour")
    
    # 2. Lire le fichier
    print("\n2. Lecture de products.ts...")
    with open(PRODUCTS_FILE, 'r', encoding='utf-8') as f:
        lines = f.readlines()
    
    # 3. Traiter chaque mise a jour
    print("\n3. Application des mises a jour...")
    updated = 0
    skipped = 0
    not_found = []
    
    for upd in updates:
        num = upd['num']
        slug = upd['slug']
        name = upd['name']
        category = upd['category']
        images_str = upd['available_images']
        
        # Creer le nouveau bloc d'images
        images = [img.strip() for img in images_str.split(',')]
        new_images_lines = [f"      p('{slug}', '{img}', '{category}', '{name}')" for img in images]
        new_images_block = ",\n".join(new_images_lines)
        
        # Chercher le produit par numero de ligne de commentaire
        found = False
        for i, line in enumerate(lines):
            # Chercher le commentaire du produit
            if re.match(rf"^\s*//\s*{num}\s*[—-]", line):
                # Trouve le produit, maintenant chercher la ligne images:
                for j in range(i, min(i+15, len(lines))):
                    if 'images:' in lines[j] and ('main.jpg' in lines[j] or 'detail.jpg' in lines[j] or "p('" in lines[j]):
                        # Trouve la ligne images, chercher la fin du bloc ]
                        start_idx = j
                        end_idx = j
                        bracket_count = 0
                        found_start = False
                        
                        for k in range(j, min(j+10, len(lines))):
                            line_k = lines[k]
                            if not found_start and '[' in line_k:
                                found_start = True
                                bracket_count = 1
                                start_idx = k
                            elif found_start:
                                bracket_count += line_k.count('[') - line_k.count(']')
                                if bracket_count <= 0:
                                    end_idx = k
                                    break
                        
                        # Remplacer les lignes
                        new_lines = new_images_block.split('\n')
                        # Ajouter l'indentation
                        indent = "    "
                        first_line = indent + "images: [" + new_lines[0].strip()
                        middle_lines = [indent + " " * 6 + l.strip().lstrip(',') for l in new_lines[1:-1] if l.strip()]
                        last_line = new_lines[-1].strip()
                        if not last_line.endswith(','):
                            last_line += ","
                        last_line = indent + " " * 6 + last_line
                        
                        final_lines = [first_line + "\n"]
                        if middle_lines:
                            final_lines.extend([l + "\n" for l in middle_lines])
                        final_lines.append(last_line.rstrip() + "],\n")
                        
                        # Remplacer dans la liste
                        lines = lines[:start_idx] + final_lines + lines[end_idx+1:]
                        updated += 1
                        found = True
                        print(f"   #{num}: [OK] ({len(images)} images)")
                        break
                
                if not found:
                    # Verifier si deja a jour
                    for j in range(i, min(i+15, len(lines))):
                        if 'images:' in lines[j]:
                            if 'main.jpg' not in lines[j] and 'detail.jpg' not in lines[j]:
                                skipped += 1
                                found = True
                                print(f"   #{num}: Deja a jour (ignore)")
                            break
                
                break
        
        if not found:
            not_found.append(num)
            print(f"   #{num}: [ERREUR] Non trouve")
    
    # 4. Sauvegarder
    print(f"\n4. Sauvegarde...")
    backup = PRODUCTS_FILE.with_suffix('.ts.backup')
    with open(backup, 'w', encoding='utf-8') as f:
        f.writelines(lines)
    print(f"   Backup: {backup.name}")
    
    with open(PRODUCTS_FILE, 'w', encoding='utf-8') as f:
        f.writelines(lines)
    print(f"   Fichier mis a jour")
    
    # 5. Resume
    print("\n" + "=" * 80)
    print("RESULTATS")
    print("=" * 80)
    print(f"Mis a jour: {updated}")
    print(f"Deja OK: {skipped}")
    print(f"Non trouves: {len(not_found)}")
    
    if not_found:
        print(f"\nProduits non trouves: {', '.join(not_found)}")

if __name__ == "__main__":
    main()
