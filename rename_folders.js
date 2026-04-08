const fs = require('fs');
const path = require('path');

const basePath = "C:\\Users\\Paul\\Documents\\Développement web\\NOVA_INDUKT\\nova-indukt\\public\\images\\products";

const folderMapping = {
    'ro-si-240': 'Rösle Silence Bratentopf 24 cm – Edelstahl 18/10',
    'wmf-grill-27': 'WMF Grillpfanne 27 x 27 cm – Cromargan®',
    'wmf-hello-steam': 'WMF Hello FUNctionals Dampfgareinsatz – Faltbar',
    'wmf-hello-steam-24': 'WMF Hello FUNctionals Dampfgareinsatz 24cm – Edelstahl',
    'wmf-ind-prot': 'WMF Induktionskochfeld-Schutzmatte – Silikon',
    'wmf-ma-360': 'WMF Macao Wok 36 cm – Cromargan® mit Ablagerost',
    'wmf-macao-360': 'WMF Macao Wok 36 cm – Cromargan® Edelstahl',
    'wmf-per-450': 'WMF Perfect Schnellkochtopf 4,5 L – Klassiker',
    'wmf-per-set': 'WMF Perfect Schnellkochtopf-Set 2-teilig – 4,5 L + 3,0 L',
    'wmf-pp-160': 'WMF Provence Plus Stielkasserolle 16 cm – Cromargan®',
    'wmf-pp-200': 'WMF Provence Plus Kochtopf 20 cm – Cromargan® Edelstahl',
    'wmf-pp-280': 'WMF Permadur Premium Pfanne 28 cm – Made in Germany',
    'wmf-pp-330': 'WMF Profi Plus Pfannenwender 33 cm – Cromargan®',
    'wmf-prof-wender': 'WMF Profi Plus Pfannenwender 33 cm – Edelstahl',
    'wmf-sil-trivet': 'WMF Topfuntersetzer Silikon 2-teilig – Hitzebeständig',
    'wmf-twin-pw': 'WMF Twin Prof Pfannenwender – Edelstahl 18/10',
    'zw-joy-500': 'ZWILLING Joy Kochtopfset 5-teilig – SIGMA Classic+ Boden',
    'zw-mq-280': 'ZWILLING Marquina Plus Pfanne 28 cm – 4-Lagen Duraslide',
    'zw-neo-160': 'ZWILLING Neo Stielkasserolle 16 cm – mattierter Edelstahl',
    'zw-neo-300': 'ZWILLING Neo Kochtopfset 3-teilig – mattierter Edelstahl',
    'zw-pl-240': 'ZWILLING Plus Bratentopf 24 cm – mit Glasdeckel, 4 L',
    'zw-pl-320': 'ZWILLING Plus Wok 32 cm – 3-Schicht-Material',
    'zw-plus-wok-320': 'ZWILLING Plus Wok 32 cm – SIGMA Clad 3-Schicht',
    'zw-pro-schoepf': 'ZWILLING Pro Schöpflöffel – Edelstahl 18/10',
    'zw-pro-scoop': 'ZWILLING Pro Schöpflöffel – Edelstahl 18/10',
    'zw-tp-wender': 'ZWILLING Twin Prof Pfannenwender – Flexibel'
};

console.log('Renommage des dossiers de produits...\n');
let renamedCount = 0;
let skippedCount = 0;
let errorCount = 0;
let missingCount = 0;

for (const [oldName, newName] of Object.entries(folderMapping)) {
    const oldPath = path.join(basePath, oldName);
    const newPath = path.join(basePath, newName);
    
    if (fs.existsSync(oldPath)) {
        if (fs.existsSync(newPath)) {
            console.log(`[SKIP] Le dossier cible existe déjà: ${newName}`);
            skippedCount++;
        } else {
            try {
                fs.renameSync(oldPath, newPath);
                console.log(`[OK] ${oldName} -> ${newName}`);
                renamedCount++;
            } catch (err) {
                console.log(`[ERROR] Échec du renommage de ${oldName}: ${err.message}`);
                errorCount++;
            }
        }
    } else {
        if (fs.existsSync(newPath)) {
            console.log(`[INFO] Déjà renommé: ${newName}`);
        } else {
            console.log(`[MISSING] Dossier introuvable: ${oldName}`);
            missingCount++;
        }
    }
}

console.log(`\nRésumé:`);
console.log(`- Renommés: ${renamedCount}`);
console.log(`- Ignorés (existaient déjà): ${skippedCount}`);
console.log(`- Erreurs: ${errorCount}`);
console.log(`- Introuvables: ${missingCount}`);
console.log(`\nOpération terminée!`);
