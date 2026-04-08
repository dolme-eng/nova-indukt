# Script de renommage des dossiers de produits Nova-Indukt - Complet
# Ce script renomme tous les dossiers d'abréviations vers les noms complets des produits

$basePath = "C:\Users\Paul\Documents\Développement web\NOVA_INDUKT\nova-indukt\public\images\products"

# Mapping complet des IDs de produits vers les noms complets de dossiers
$folderMapping = @{
    # === Dossiers restants à renommer ===
    'ro-si-240' = 'Rösle Silence Bratentopf 24 cm – Edelstahl 18/10'
    'wmf-grill-27' = 'WMF Grillpfanne 27 x 27 cm – Cromargan®'
    'wmf-hello-steam' = 'WMF Hello FUNctionals Dampfgareinsatz – Faltbar'
    'wmf-hello-steam-24' = 'WMF Hello FUNctionals Dampfgareinsatz 24cm – Edelstahl'
    'wmf-ind-prot' = 'WMF Induktionskochfeld-Schutzmatte – Silikon'
    'wmf-ma-360' = 'WMF Macao Wok 36 cm – Cromargan® mit Ablagerost'
    'wmf-macao-360' = 'WMF Macao Wok 36 cm – Cromargan® Edelstahl'
    'wmf-per-450' = 'WMF Perfect Schnellkochtopf 4,5 L – Klassiker'
    'wmf-per-set' = 'WMF Perfect Schnellkochtopf-Set 2-teilig – 4,5 L + 3,0 L'
    'wmf-pp-160' = 'WMF Provence Plus Stielkasserolle 16 cm – Cromargan®'
    'wmf-pp-200' = 'WMF Provence Plus Kochtopf 20 cm – Cromargan® Edelstahl'
    'wmf-pp-280' = 'WMF Permadur Premium Pfanne 28 cm – Made in Germany'
    'wmf-pp-330' = 'WMF Profi Plus Pfannenwender 33 cm – Cromargan®'
    'wmf-prof-wender' = 'WMF Profi Plus Pfannenwender 33 cm – Edelstahl'
    'wmf-sil-trivet' = 'WMF Topfuntersetzer Silikon 2-teilig – Hitzebeständig'
    'wmf-twin-pw' = 'WMF Twin Prof Pfannenwender – Edelstahl 18/10'
    'zw-joy-500' = 'ZWILLING Joy Kochtopfset 5-teilig – SIGMA Classic+ Boden'
    'zw-mq-280' = 'ZWILLING Marquina Plus Pfanne 28 cm – 4-Lagen Duraslide'
    'zw-neo-160' = 'ZWILLING Neo Stielkasserolle 16 cm – mattierter Edelstahl'
    'zw-neo-300' = 'ZWILLING Neo Kochtopfset 3-teilig – mattierter Edelstahl'
    'zw-pl-240' = 'ZWILLING Plus Bratentopf 24 cm – mit Glasdeckel, 4 L'
    'zw-pl-320' = 'ZWILLING Plus Wok 32 cm – 3-Schicht-Material'
    'zw-plus-wok-320' = 'ZWILLING Plus Wok 32 cm – SIGMA Clad 3-Schicht'
    'zw-pro-schoepf' = 'ZWILLING Pro Schöpflöffel – Edelstahl 18/10'
    'zw-pro-scoop' = 'ZWILLING Pro Schöpflöffel – Edelstahl 18/10'
    'zw-tp-wender' = 'ZWILLING Twin Prof Pfannenwender – Flexibel'
}

Write-Host "Renommage des dossiers de produits..." -ForegroundColor Green
Write-Host "Chemin de base: $basePath" -ForegroundColor Cyan
$renamedCount = 0
$skippedCount = 0
$errorCount = 0

foreach ($mapping in $folderMapping.GetEnumerator()) {
    $oldName = $mapping.Key
    $newName = $mapping.Value
    $oldPath = Join-Path $basePath $oldName
    $newPath = Join-Path $basePath $newName
    
    if (Test-Path $oldPath -PathType Container) {
        if (Test-Path $newPath -PathType Container) {
            Write-Host "[SKIP] Le dossier cible existe déjà: $newName" -ForegroundColor Yellow
            $skippedCount++
        } else {
            try {
                Rename-Item -Path $oldPath -NewName $newName -ErrorAction Stop
                Write-Host "[OK] $oldName -> $newName" -ForegroundColor Green
                $renamedCount++
            } catch {
                Write-Host "[ERROR] Échec du renommage de $oldName : $_" -ForegroundColor Red
                $errorCount++
            }
        }
    } else {
        # Le dossier source n'existe pas, vérifier si le dossier cible existe déjà
        if (Test-Path $newPath -PathType Container) {
            Write-Host "[INFO] Déjà renommé (dossier cible existe): $newName" -ForegroundColor Cyan
        } else {
            Write-Host "[MISSING] Dossier source introuvable: $oldName" -ForegroundColor Magenta
        }
    }
}

Write-Host ""
Write-Host "Résumé:" -ForegroundColor Green
Write-Host "- Renommés: $renamedCount" -ForegroundColor Green
Write-Host "- Ignorés (existaient déjà): $skippedCount" -ForegroundColor Yellow
Write-Host "- Erreurs: $errorCount" -ForegroundColor Red
Write-Host ""
Write-Host "Opération terminée!" -ForegroundColor Green
