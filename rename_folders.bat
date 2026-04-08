@echo off
chcp 65001 >nul
echo Renommage des dossiers de produits...
echo.

set "basePath=C:\Users\Paul\Documents\Développement web\NOVA_INDUKT\nova-indukt\public\images\products"

cd /d "%basePath%"

:: Rösle
if exist "ro-si-240" (
    ren "ro-si-240" "Rösle Silence Bratentopf 24 cm – Edelstahl 18/10"
    echo [OK] ro-si-240 renommé
)

:: WMF
if exist "wmf-grill-27" (
    ren "wmf-grill-27" "WMF Grillpfanne 27 x 27 cm – Cromargan®"
    echo [OK] wmf-grill-27 renommé
)

if exist "wmf-hello-steam" (
    ren "wmf-hello-steam" "WMF Hello FUNctionals Dampfgareinsatz – Faltbar"
    echo [OK] wmf-hello-steam renommé
)

if exist "wmf-hello-steam-24" (
    ren "wmf-hello-steam-24" "WMF Hello FUNctionals Dampfgareinsatz 24cm – Edelstahl"
    echo [OK] wmf-hello-steam-24 renommé
)

if exist "wmf-ind-prot" (
    ren "wmf-ind-prot" "WMF Induktionskochfeld-Schutzmatte – Silikon"
    echo [OK] wmf-ind-prot renommé
)

if exist "wmf-ma-360" (
    ren "wmf-ma-360" "WMF Macao Wok 36 cm – Cromargan® mit Ablagerost"
    echo [OK] wmf-ma-360 renommé
)

if exist "wmf-macao-360" (
    ren "wmf-macao-360" "WMF Macao Wok 36 cm – Cromargan® Edelstahl"
    echo [OK] wmf-macao-360 renommé
)

if exist "wmf-per-450" (
    ren "wmf-per-450" "WMF Perfect Schnellkochtopf 4,5 L – Klassiker"
    echo [OK] wmf-per-450 renommé
)

if exist "wmf-per-set" (
    ren "wmf-per-set" "WMF Perfect Schnellkochtopf-Set 2-teilig – 4,5 L + 3,0 L"
    echo [OK] wmf-per-set renommé
)

if exist "wmf-pp-160" (
    ren "wmf-pp-160" "WMF Provence Plus Stielkasserolle 16 cm – Cromargan®"
    echo [OK] wmf-pp-160 renommé
)

if exist "wmf-pp-200" (
    ren "wmf-pp-200" "WMF Provence Plus Kochtopf 20 cm – Cromargan® Edelstahl"
    echo [OK] wmf-pp-200 renommé
)

if exist "wmf-pp-280" (
    ren "wmf-pp-280" "WMF Permadur Premium Pfanne 28 cm – Made in Germany"
    echo [OK] wmf-pp-280 renommé
)

if exist "wmf-pp-330" (
    ren "wmf-pp-330" "WMF Profi Plus Pfannenwender 33 cm – Cromargan®"
    echo [OK] wmf-pp-330 renommé
)

if exist "wmf-prof-wender" (
    ren "wmf-prof-wender" "WMF Profi Plus Pfannenwender 33 cm – Edelstahl"
    echo [OK] wmf-prof-wender renommé
)

if exist "wmf-sil-trivet" (
    ren "wmf-sil-trivet" "WMF Topfuntersetzer Silikon 2-teilig – Hitzebeständig"
    echo [OK] wmf-sil-trivet renommé
)

if exist "wmf-twin-pw" (
    ren "wmf-twin-pw" "WMF Twin Prof Pfannenwender – Edelstahl 18/10"
    echo [OK] wmf-twin-pw renommé
)

:: ZWILLING
if exist "zw-joy-500" (
    ren "zw-joy-500" "ZWILLING Joy Kochtopfset 5-teilig – SIGMA Classic+ Boden"
    echo [OK] zw-joy-500 renommé
)

if exist "zw-mq-280" (
    ren "zw-mq-280" "ZWILLING Marquina Plus Pfanne 28 cm – 4-Lagen Duraslide"
    echo [OK] zw-mq-280 renommé
)

if exist "zw-neo-160" (
    ren "zw-neo-160" "ZWILLING Neo Stielkasserolle 16 cm – mattierter Edelstahl"
    echo [OK] zw-neo-160 renommé
)

if exist "zw-neo-300" (
    ren "zw-neo-300" "ZWILLING Neo Kochtopfset 3-teilig – mattierter Edelstahl"
    echo [OK] zw-neo-300 renommé
)

if exist "zw-pl-240" (
    ren "zw-pl-240" "ZWILLING Plus Bratentopf 24 cm – mit Glasdeckel, 4 L"
    echo [OK] zw-pl-240 renommé
)

if exist "zw-pl-320" (
    ren "zw-pl-320" "ZWILLING Plus Wok 32 cm – 3-Schicht-Material"
    echo [OK] zw-pl-320 renommé
)

if exist "zw-plus-wok-320" (
    ren "zw-plus-wok-320" "ZWILLING Plus Wok 32 cm – SIGMA Clad 3-Schicht"
    echo [OK] zw-plus-wok-320 renommé
)

if exist "zw-pro-schoepf" (
    ren "zw-pro-schoepf" "ZWILLING Pro Schöpflöffel – Edelstahl 18/10"
    echo [OK] zw-pro-schoepf renommé
)

if exist "zw-pro-scoop" (
    ren "zw-pro-scoop" "ZWILLING Pro Schöpflöffel – Edelstahl 18/10"
    echo [OK] zw-pro-scoop renommé
)

if exist "zw-tp-wender" (
    ren "zw-tp-wender" "ZWILLING Twin Prof Pfannenwender – Flexibel"
    echo [OK] zw-tp-wender renommé
)

echo.
echo Opération terminée!
pause
