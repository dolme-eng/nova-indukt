# Script pour mapper les images aux produits
$ErrorActionPreference = "Stop"

# 1. Lire tous les dossiers d'images
$basePath = "C:\Users\Paul\Documents\Développement web\NOVA_INDUKT\nova-indukt\public\images\products"
$folders = Get-ChildItem -Path $basePath -Directory

# Créer un mapping des dossiers vers leurs images
$folderMapping = @{}
foreach ($folder in $folders) {
    $images = Get-ChildItem -Path $folder.FullName -File | 
        Where-Object { $_.Extension -in @('.jpg','.jpeg','.png','.webp','.gif','.avif') } |
        Sort-Object Name
    
    $folderMapping[$folder.Name] = @{
        Count = $images.Count
        Images = $images.Name
        FirstImage = if ($images.Count -gt 0) { $images[0].Name } else { $null }
        AllImages = $images
    }
}

# 2. Lire le fichier products.ts
$productsPath = "C:\Users\Paul\Documents\Développement web\NOVA_INDUKT\nova-indukt\lib\data\products.ts"
$content = Get-Content -Path $productsPath -Raw -Encoding UTF8

# 3. Extraire les produits avec leurs slugs et noms
$productPattern = [regex]::new(@'
  \/\/\s*(\d+)\s*[—-]\s*([^\n]+)\s*
  \{\s*
    id:\s*[''']([^''']+)['''].*?
    slug:\s*[''']([^''']+)['''].*?
    name:\s*\{\s*de:\s*[''']([^''']+)['''']\s*\}.*?
    category:\s*[''']([^''']+)['''].*?
    images:\s*\[([^\]]+)\]
', [System.Text.RegularExpressions.RegexOptions]::Singleline -bor [System.Text.RegularExpressions.RegexOptions]::IgnorePatternWhitespace)

$matches = $productPattern.Matches($content)

Write-Host "Nombre de produits trouvés: $($matches.Count)"

# 4. Créer la liste des produits sans images
$productsWithoutImages = @()
$productsWithMapping = @()

foreach ($match in $matches) {
    $num = $match.Groups[1].Value
    $commentName = $match.Groups[2].Value.Trim()
    $id = $match.Groups[3].Value
    $slug = $match.Groups[4].Value
    $name = $match.Groups[5].Value
    $category = $match.Groups[6].Value
    $imagesBlock = $match.Groups[7].Value
    
    # Vérifier si c'est un placeholder
    $isPlaceholder = $imagesBlock -match "main\.jpg|detail\.jpg|lifestyle\.jpg"
    
    # Chercher un dossier correspondant
    $matchingFolder = $null
    $bestScore = 0
    
    foreach ($folderName in $folderMapping.Keys) {
        $score = 0
        $folderLower = $folderName.ToLower()
        $nameLower = $name.ToLower()
        $slugLower = $slug.ToLower()
        
        # Extraire les mots clés du nom du produit (marque + modèle)
        $nameWords = $nameLower -split '\s+' | Where-Object { $_.Length -gt 2 }
        $folderWords = $folderLower -split '\s+' | Where-Object { $_.Length -gt 2 }
        
        foreach ($word in $nameWords) {
            $cleanWord = $word -replace '[^a-z0-9]', ''
            if ($cleanWord -and $folderLower -match $cleanWord) {
                $score += 10
            }
        }
        
        # Bonus pour correspondance exacte de marque
        if ($nameLower -match '^wmf' -and $folderLower -match 'wmf') { $score += 20 }
        if ($nameLower -match '^zwilling' -and $folderLower -match 'zwilling') { $score += 20 }
        if ($nameLower -match '^fissler' -and $folderLower -match 'fissler') { $score += 20 }
        if ($nameLower -match '^tefal' -and $folderLower -match 'tefal') { $score += 20 }
        if ($nameLower -match '^silit' -and $folderLower -match 'silit') { $score += 20 }
        if ($nameLower -match '^le\s+creuset' -and $folderLower -match 'le creuset') { $score += 20 }
        if ($nameLower -match '^lodge' -and $folderLower -match 'lodge') { $score += 20 }
        if ($nameLower -match '^rösle' -and $folderLower -match 'rösle') { $score += 20 }
        if ($nameLower -match '^ballarini' -and $folderLower -match 'ballarini') { $score += 20 }
        
        if ($score -gt $bestScore) {
            $bestScore = $score
            $matchingFolder = $folderName
        }
    }
    
    if ($isPlaceholder -and $matchingFolder -and $folderMapping[$matchingFolder].Count -gt 0) {
        $productsWithMapping += [PSCustomObject]@{
            Num = $num
            Id = $id
            Slug = $slug
            Name = $name
            Category = $category
            Folder = $matchingFolder
            ImageCount = $folderMapping[$matchingFolder].Count
            Images = $folderMapping[$matchingFolder].Images -join ", "
            CurrentImages = $imagesBlock.Trim()
            Score = $bestScore
        }
    } elseif ($isPlaceholder) {
        $productsWithoutImages += [PSCustomObject]@{
            Num = $num
            Id = $id
            Slug = $slug
            Name = $name
            Category = $category
            Reason = if ($matchingFolder) { "Dossier vide: $matchingFolder" } else { "Aucun dossier correspondant" }
        }
    }
}

# 5. Sauvegarder les résultats
$outputDir = "C:\Users\Paul\Documents\Développement web\NOVA_INDUKT\nova-indukt\scripts"

# Produits avec mapping
$productsWithMapping | Export-Csv -Path "$outputDir\products-with-images.csv" -NoTypeInformation -Encoding UTF8
Write-Host "`n=== PRODUITS AVEC IMAGES DISPONIBLES ($($productsWithMapping.Count)) ===" -ForegroundColor Green
$productsWithMapping | Select-Object -First 20 | Format-Table Num, Name, Folder, ImageCount -AutoSize

# Produits sans images
$productsWithoutImages | Export-Csv -Path "$outputDir\products-without-images.csv" -NoTypeInformation -Encoding UTF8
Write-Host "`n=== PRODUITS SANS IMAGES ($($productsWithoutImages.Count)) ===" -ForegroundColor Red
$productsWithoutImages | Format-Table Num, Name, Reason -AutoSize

# 6. Générer le rapport
$report = @"
# RAPPORT DE MAPPING DES IMAGES

## Statistiques
- Total produits analysés: $($matches.Count)
- Produits avec images disponibles: $($productsWithMapping.Count)
- Produits sans images: $($productsWithoutImages.Count)

## Dossiers sans images (à remplir manuellement)
$(($folderMapping.GetEnumerator() | Where-Object { $_.Value.Count -eq 0 } | ForEach-Object { "- $($_.Key)" }) -join "`n")

## Produits sans correspondance d'images
$(($productsWithoutImages | ForEach-Object { "- #$($_.Num) - $($_.Name) | $($_.Reason)" }) -join "`n")
"@

$report | Out-File -FilePath "$outputDir\image-mapping-report.md" -Encoding UTF8
Write-Host "`nRapport sauvegardé dans: $outputDir\image-mapping-report.md" -ForegroundColor Cyan
