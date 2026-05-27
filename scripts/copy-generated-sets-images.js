const fs = require('fs');
const path = require('path');

const brainDir = 'C:\\Users\\Paul\\.gemini\\antigravity\\brain\\751fe4e7-6c44-4ed4-b989-2dab51daeecc';
const productsDir = path.join(__dirname, '..', 'public', 'images', 'products');

// Liste des images générées avec leur dossier de destination
const copies = [
  {
    src: 'wmf_gourmet_plus_set_1779743818099.png',
    destFolder: 'WMF Gourmet Plus — Topfset 5-tlg'
  },
  {
    src: 'demeyere_atlantis_set_1779743835315.png',
    destFolder: 'Demeyere Atlantis 7 — Basis-Set 5-tlg'
  },
  {
    src: 'le_creuset_3ply_set_1779744071140.png',
    destFolder: 'Le Creuset 3-ply PLUS — Topfset 5-tlg'
  },
  {
    src: 'zwilling_flow_set_1779744163604.png',
    destFolder: 'Zwilling Flow — Topfset 5-tlg'
  },
  {
    src: 'silit_toskana_set_1779744307257.png',
    destFolder: 'Silit Toskana — Topfset 5-tlg'
  }
];

console.log('📂 Début de la préparation des dossiers d\'images pour la catégorie 3...');

// 1. Traitement des images générées par l'IA
copies.forEach(item => {
  const destPath = path.join(productsDir, item.destFolder);
  
  // Créer le dossier s'il n'existe pas
  if (!fs.existsSync(destPath)) {
    fs.mkdirSync(destPath, { recursive: true });
    console.log(`  ✓ Dossier créé : ${item.destFolder}`);
  }

  const srcFilePath = path.join(brainDir, item.src);
  const destFilePath = path.join(destPath, '1.png');

  if (fs.existsSync(srcFilePath)) {
    fs.copyFileSync(srcFilePath, destFilePath);
    console.log(`  ✓ Image copiée pour : ${item.destFolder}`);
  } else {
    console.error(`  ✗ Fichier source introuvable : ${item.src}`);
  }
});

// 2. Traitement spécial pour Tefal Duetto (limite de quota d'images atteinte)
// On copie l'image 1.png de Zwilling Twin Classic comme solution de secours propre
const tefalFolder = 'Tefal Duetto — Topfset 9-tlg';
const tefalDestPath = path.join(productsDir, tefalFolder);
const backupSrcPath = path.join(productsDir, 'Zwilling Twin Classic — Kochtopf 20 cm  Topfset 5-tlg', '1.png');
const tefalDestFilePath = path.join(tefalDestPath, '1.png');

if (!fs.existsSync(tefalDestPath)) {
  fs.mkdirSync(tefalDestPath, { recursive: true });
  console.log(`  ✓ Dossier créé : ${tefalFolder}`);
}

if (fs.existsSync(backupSrcPath)) {
  fs.copyFileSync(backupSrcPath, tefalDestFilePath);
  console.log(`  ✓ Image de secours copiée pour : ${tefalFolder} (depuis Zwilling Twin Classic)`);
} else {
  console.error('  ✗ Image de secours introuvable');
}

console.log('\n🎉 Préparation des images terminée !');
