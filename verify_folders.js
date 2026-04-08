const fs = require('fs');
const path = require('path');

// Lire le fichier products.ts pour extraire tous les produits
const productsPath = "C:\\Users\\Paul\\Documents\\Développement web\\NOVA_INDUKT\\nova-indukt\\lib\\data\\products.ts";
const productsContent = fs.readFileSync(productsPath, 'utf8');

// Extraire les noms de produits du fichier
const productMatches = productsContent.match(/name:\s*\{\s*de:\s*['"]([^'"]+)['"]/g) || [];
const products = productMatches.map(match => {
    const nameMatch = match.match(/name:\s*\{\s*de:\s*['"]([^'"]+)['"]/);
    return nameMatch ? nameMatch[1] : null;
}).filter(Boolean);

console.log(`=== VÉRIFICATION DES DOSSIERS D'IMAGES ===\n`);
console.log(`Nombre total de produits trouvés: ${products.length}\n`);

// Lister tous les dossiers dans le répertoire products
const basePath = "C:\\Users\\Paul\\Documents\\Développement web\\NOVA_INDUKT\\nova-indukt\\public\\images\\products";
const folders = fs.readdirSync(basePath, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);

console.log(`Nombre de dossiers d'images: ${folders.length - 1} (excluant 'Products')\n`);

// Vérifier chaque produit
let withFolder = 0;
let withoutFolder = 0;
const missingProducts = [];

// Fonction pour normaliser les noms pour comparaison
function normalize(str) {
    return str.toLowerCase()
        .replace(/[–—−]/g, '-')  // tirets spéciaux -> tiret simple
        .replace(/[®©™]/g, '')     // symboles -> vide
        .replace(/\s+/g, ' ')      // espaces multiples -> simple
        .trim();
}

for (const product of products) {
    const normalizedProduct = normalize(product);
    const folderExists = folders.some(folder => {
        const normalizedFolder = normalize(folder);
        // Vérifier si le nom du produit est contenu dans le dossier ou vice versa
        return normalizedFolder.includes(normalizedProduct.substring(0, 20)) ||
               normalizedProduct.includes(normalizedFolder.substring(0, 20));
    });
    
    if (folderExists) {
        withFolder++;
    } else {
        withoutFolder++;
        missingProducts.push(product);
    }
}

console.log(`\n=== RÉSULTAT ===`);
console.log(`Produits avec dossier: ${withFolder}`);
console.log(`Produits SANS dossier: ${withoutFolder}`);

if (missingProducts.length > 0) {
    console.log(`\n=== PRODUITS SANS DOSSIER D'IMAGES ===`);
    missingProducts.forEach((p, i) => console.log(`${i + 1}. ${p}`));
}

// Afficher la liste des dossiers existants
console.log(`\n=== LISTE DES DOSSIERS EXISTANTS (${folders.length}) ===`);
folders.forEach((f, i) => console.log(`${i + 1}. ${f}`));
