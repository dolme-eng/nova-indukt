const fs = require('fs');
const path = require('path');

const basePath = "C:\\Users\\Paul\\Documents\\Développement web\\NOVA_INDUKT\\nova-indukt\\public\\images\\products";

// Mapping avec noms simplifiés (sans caractères spéciaux)
const folderMapping = {
    'wmf-grill-27': 'WMF Grillpfanne 27x27cm - Cromargan',
    'wmf-hello-steam': 'WMF Hello FUNctionals Dampfgareinsatz - Faltbar',
    'wmf-hello-steam-24': 'WMF Hello FUNctionals Dampfgareinsatz 24cm - Edelstahl',
    'wmf-ind-prot': 'WMF Induktionskochfeld-Schutzmatte - Silikon',
    'wmf-ma-360': 'WMF Macao Wok 36cm - Cromargan mit Ablagerost',
    'wmf-macao-360': 'WMF Macao Wok 36cm - Cromargan Edelstahl',
    'wmf-per-450': 'WMF Perfect Schnellkochtopf 4.5L - Klassiker',
    'wmf-per-set': 'WMF Perfect Schnellkochtopf-Set 2-teilig - 4.5L + 3.0L',
    'wmf-pp-160': 'WMF Provence Plus Stielkasserolle 16cm - Cromargan',
    'wmf-pp-200': 'WMF Provence Plus Kochtopf 20cm - Cromargan Edelstahl',
    'wmf-pp-280': 'WMF Permadur Premium Pfanne 28cm - Made in Germany',
    'wmf-pp-330': 'WMF Profi Plus Pfannenwender 33cm - Cromargan',
    'wmf-prof-wender': 'WMF Profi Plus Pfannenwender 33cm - Edelstahl',
    'wmf-sil-trivet': 'WMF Topfuntersetzer Silikon 2-teilig - Hitzebestaendig',
    'wmf-twin-pw': 'WMF Twin Prof Pfannenwender - Edelstahl 18-10',
    'zw-joy-500': 'ZWILLING Joy Kochtopfset 5-teilig - SIGMA Classic+ Boden',
    'zw-mq-280': 'ZWILLING Marquina Plus Pfanne 28cm - 4-Lagen Duraslide',
    'zw-neo-160': 'ZWILLING Neo Stielkasserolle 16cm - mattierter Edelstahl',
    'zw-neo-300': 'ZWILLING Neo Kochtopfset 3-teilig - mattierter Edelstahl',
    'zw-pl-240': 'ZWILLING Plus Bratentopf 24cm - mit Glasdeckel 4L',
    'zw-pl-320': 'ZWILLING Plus Wok 32cm - 3-Schicht-Material',
    'zw-plus-wok-320': 'ZWILLING Plus Wok 32cm - SIGMA Clad 3-Schicht',
    'zw-pro-schoepf': 'ZWILLING Pro Schoepfloeffel - Edelstahl 18-10',
    'zw-pro-scoop': 'ZWILLING Pro Schoepfloeffel 2 - Edelstahl 18-10',
    'zw-tp-wender': 'ZWILLING Twin Prof Pfannenwender - Flexibel'
};

console.log('Renommage des dossiers restants...\n');
let renamedCount = 0;
let errorCount = 0;
let notFoundCount = 0;

for (const [oldName, newName] of Object.entries(folderMapping)) {
    const oldPath = path.join(basePath, oldName);
    const newPath = path.join(basePath, newName);
    
    try {
        if (fs.existsSync(oldPath)) {
            fs.renameSync(oldPath, newPath);
            console.log(`[OK] ${oldName} -> ${newName}`);
            renamedCount++;
        } else {
            console.log(`[MISSING] ${oldName}`);
            notFoundCount++;
        }
    } catch (err) {
        console.log(`[ERROR] ${oldName}: ${err.message}`);
        errorCount++;
    }
}

console.log(`\n=== RÉSULTAT ===`);
console.log(`Renommés: ${renamedCount}`);
console.log(`Erreurs: ${errorCount}`);
console.log(`Introuvables: ${notFoundCount}`);
