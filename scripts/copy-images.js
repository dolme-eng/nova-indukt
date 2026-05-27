const fs = require('fs');
const path = require('path');

const srcDir = 'C:\\Users\\Paul\\.gemini\\antigravity\\brain\\751fe4e7-6c44-4ed4-b989-2dab51daeecc';
const destDir = path.join(__dirname, 'public', 'images', 'Kategorien');

const files = [
  { src: 'induktionspfannen_1779294397328.png', dest: 'induktionspfannen.png' },
  { src: 'induktionstoepfe_1779294509130.png', dest: 'induktionstoepfe.png' },
  { src: 'induktions_sets_1779295005567.png', dest: 'induktions-sets.png' },
  { src: 'induktions_zubehoer_1779295499265.png', dest: 'induktions-zubehoer.png' }
];

console.log('Starting image copy...');

if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

files.forEach(file => {
  const srcPath = path.join(srcDir, file.src);
  const destPath = path.join(destDir, file.dest);
  
  if (fs.existsSync(srcPath)) {
    fs.copyFileSync(srcPath, destPath);
    console.log(`Copied ${file.src} -> ${file.dest}`);
  } else {
    console.error(`Source file not found: ${srcPath}`);
  }
});

console.log('Copy completed!');
