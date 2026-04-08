# Script PowerShell pour renommer tous les dossiers restants
$basePath = "C:\Users\Paul\Documents\Développement web\NOVA_INDUKT\nova-indukt\public\images\products"

$renameMap = @{
    'wmf-grill-27' = 'WMF Grillpfanne 27 x 27 cm - Cromargan'
    'wmf-hello-steam' = 'WMF Hello FUNctionals Dampfgareinsatz - Faltbar'
    'wmf-hello-steam-24' = 'WMF Hello FUNctionals Dampfgareinsatz 24cm - Edelstahl'
    'wmf-ind-prot' = 'WMF Induktionskochfeld-Schutzmatte - Silikon'
    'wmf-ma-360' = 'WMF Macao Wok 36 cm - Cromargan mit Ablagerost'
    'wmf-macao-360' = 'WMF Macao Wok 36 cm - Cromargan Edelstahl'
    'wmf-per-450' = 'WMF Perfect Schnellkochtopf 4,5 L - Klassiker'
    'wmf-per-set' = 'WMF Perfect Schnellkochtopf-Set 2-teilig - 4,5 L + 3,0 L'
    'wmf-pp-160' = 'WMF Provence Plus Stielkasserolle 16 cm - Cromargan'
    'wmf-pp-200' = 'WMF Provence Plus Kochtopf 20 cm - Cromargan Edelstahl'
    'wmf-pp-280' = 'WMF Permadur Premium Pfanne 28 cm - Made in Germany'
    'wmf-pp-330' = 'WMF Profi Plus Pfannenwender 33 cm - Cromargan'
    'wmf-prof-wender' = 'WMF Profi Plus Pfannenwender 33 cm - Edelstahl'
    'wmf-sil-trivet' = 'WMF Topfuntersetzer Silikon 2-teilig - Hitzebestaendig'
    'wmf-twin-pw' = 'WMF Twin Prof Pfannenwender - Edelstahl 18-10'
    'zw-joy-500' = 'ZWILLING Joy Kochtopfset 5-teilig - SIGMA Classic+ Boden'
    'zw-mq-280' = 'ZWILLING Marquina Plus Pfanne 28 cm - 4-Lagen Duraslide'
    'zw-neo-160' = 'ZWILLING Neo Stielkasserolle 16 cm - mattierter Edelstahl'
    'zw-neo-300' = 'ZWILLING Neo Kochtopfset 3-teilig - mattierter Edelstahl'
    'zw-pl-240' = 'ZWILLING Plus Bratentopf 24 cm - mit Glasdeckel, 4 L'
    'zw-pl-320' = 'ZWILLING Plus Wok 32 cm - 3-Schicht-Material'
    'zw-plus-wok-320' = 'ZWILLING Plus Wok 32 cm - SIGMA Clad 3-Schicht'
    'zw-pro-schoepf' = 'ZWILLING Pro Schoepfloeffel - Edelstahl 18-10'
    'zw-pro-scoop' = 'ZWILLING Pro Schoepfloeffel 2 - Edelstahl 18-10'
    'zw-tp-wender' = 'ZWILLING Twin Prof Pfannenwender - Flexibel'
}

$success = 0
$failed = 0

foreach ($oldName in $renameMap.Keys) {
    $newName = $renameMap[$oldName]
    $oldPath = Join-Path $basePath $oldName
    $newPath = Join-Path $basePath $newName
    
    if (Test-Path -LiteralPath $oldPath) {
        if (Test-Path -LiteralPath $newPath) {
            Write-Host "[SKIP] Existe deja: $newName" -ForegroundColor Yellow
        } else {
            try {
                Rename-Item -LiteralPath $oldPath -NewName $newName -ErrorAction Stop
                Write-Host "[OK] $oldName -> $newName" -ForegroundColor Green
                $success++
            } catch {
                Write-Host "[ERROR] $oldName : $_" -ForegroundColor Red
                $failed++
            }
        }
    } else {
        if (Test-Path -LiteralPath $newPath) {
            Write-Host "[INFO] Deja renomme: $newName" -ForegroundColor Cyan
        } else {
            Write-Host "[MISSING] Introuvable: $oldName" -ForegroundColor Magenta
        }
    }
}

Write-Host ""
Write-Host "Resultat: $success renommes, $failed erreurs" -ForegroundColor Green
