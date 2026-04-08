# Script de renommage des dossiers de produits Nova-Indukt
# Ce script renomme les dossiers d'abréviations vers les noms complets des produits

$basePath = "C:\Users\Paul\Documents\Développement web\NOVA_INDUKT\nova-indukt\public\images\products"

# Mapping des IDs de produits vers les noms complets de dossiers
$folderMapping = @{
    # Kochen & Braten
    'ba-sl-300' = 'Ballarini Salina Pfannenset 3-teilig – Granitium Ti-X'
    'be-balance-grill' = 'Berndes Balance Induction Grillpfanne 28 cm – Aluguss'
    'be-bi-280' = 'Berndes Balance Induction Grillpfanne 28 cm – Antihaft'
    'be-vc-200' = 'Berndes Vario Click Induction Pfanne 20 cm – Aluguss'
    'be-vc-280' = 'Berndes Vario Click Induction Pfanne 28 cm – abnehmbarer Stiel'
    'de-ind-280' = 'Demeyere Industry 5 Bratpfanne 28 cm – 5-Lagen-Material'
    'elo-ml-200' = 'ELO Multilayer Bratentopf 20 cm – 3-Schicht-Material'
    'elo-ml-240' = 'ELO Multilayer Bratentopf 24 cm – 3-Schicht-Material'
    'elo-pr-200' = 'ELO Pure Rubin Pfannenset 2-teilig – Turbo-Induktion'
    'elo-pr-500' = 'ELO Pure Rubin Topfset 5-teilig – Turbo-Induktion'
    'fi-ac-280' = 'Fissler Adamant Classic Pfanne 28 cm – extrem kratzfest'
    'fi-csp-280' = 'Fissler Crispy Steelux Premium Pfanne 28 cm – Edelstahl'
    'fi-mag-prot' = 'Fissler Magic Pfannenschutz-Set 3-teilig – Vlies'
    'fi-mag-stack' = 'Fissler Magic Pfannenstapelhilfe – Metall verchromt'
    'fi-magic-set' = 'Fissler Magic Pfannenschutz-Set 3-teilig – Textil'
    'fi-opc-400' = 'Fissler Original-Profi Collection 4-teilig – Profi-Qualität'
    'fi-stack-pro' = 'Fissler Magic Pfannenstapelhilfe – Edelstahl Design'
    'fi-vv-450' = 'Fissler Vitavit Premium Schnellkochtopf 4,5 L – Induktion'
    'fi-vv-600' = 'Fissler Vitavit Premium Schnellkochtopf 6 L – Induktion'
    'gsw-ce-160' = 'GSW Ceramica Kasserolle 16 cm – Keramikbeschichtung'
    'gsw-gastro-35' = 'GSW Gastrobräter 35 x 25 cm – Edelstahl massiv'
    'gsw-gb-350' = 'GSW Gastrobräter 35 x 25 cm – Edelstahl mit Deckel'
    'gsw-mo-240' = 'GSW Montan Bratentopf 24 cm – Aluguss robust'
    'kh-perf-320' = 'Ken Hom Performance Wok 32 cm – Carbonstahl'
    'ko-jo-280' = 'Kopf Josie Pfanne 28 cm – ILAG Ultimate Beschichtung'
    'ko-jo-700' = 'Kopf Josie Kochtopfset 7-teilig – Aluguss abnehmbare Griffe'
    'ko-ma-400' = 'Kopf Marra Wok-Set 4-teilig – Aluguss antihaft'
    'ko-marra-set' = 'Kopf Marra Wok-Set 4-teilig – Aluguss massiv'
    'kr-set-800' = 'Krüger Pfannen- und Topfset 8-teilig – Schwarz'
    'lc-3ply-300' = 'Le Creuset 3-ply Stainless Steel Set 3-teilig – Mehrschicht'
    'lo-gr-260' = 'Lodge Gusseisen-Grillpfanne 26 cm – Quadratisch, USA'
    'lo-lodge-grill' = 'Lodge Gusseisen-Grillpfanne 26 cm – Quadratisch'
    'ro-el-280' = 'Rösle Elegance Grillpfanne 28 cm – ProPlex®'
    'ro-elegance-grill' = 'Rösle Elegance Grillpfanne 28 cm – Edelstahl'
    'ro-pw-sil' = 'Rösle Pfannenwender Silikon – hitzebeständig bis 260°C'
    'ro-si-240' = 'Rösle Silence Bratentopf 24 cm – Edelstahl 18/10'
    'ro-si-280' = 'Rösle Silence Pfanne 28 cm – Edelstahl mit Antihaft'
    'si-ng-400' = 'Silit Nature Green Topfset 4-teilig – Silargan® Funktionskeramik'
    'si-sico-250' = 'Silit Sicomatic t-plus Schnellkochtopf 2,5 L – Silargan®'
    'si-sico-450' = 'Silit Sicomatic t-plus Schnellkochtopf 4,5 L – Silargan®'
    'skk-ti-280' = 'SKK Titanium 2000 Plus Pfanne 28 cm – 8mm Boden'
    'tf-daily-wok-280' = 'Tefal Daily Chef Wok 28 cm – Titanium Antihaft'
    'tf-dc-280' = 'Tefal Daily Chef Wok 28 cm – Titanium Beschichtung'
    'tf-ig-2set' = 'Tefal Ingenio Griffset 2-teilig – Schwarz'
    'tf-ip-100' = 'Tefal Ingenio Preference Set 10-teilig – Edelstahl, Induktion'
    'tf-uo-280' = 'Tefal Unlimited On Bratpfanne 28 cm – Anti-Kratz Beschichtung'
    'wmf-dp-400' = 'WMF Diadem Plus Topfset 4-teilig – Cromargan® Edelstahl'
    'wmf-f4-240' = 'WMF Function 4 Bratentopf 24 cm – 4 Funktionen'
    'wmf-ft-400' = 'WMF Fusiontec Topfset 4-teilig – High-Tech Funktionskeramik'
    'wmf-gr-270' = 'WMF Grillpfanne 27 x 27 cm – Cromargan® quadratisch'
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
