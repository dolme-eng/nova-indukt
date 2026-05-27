const fs = require('fs');
const path = require('path');

const brainDir = 'C:\\Users\\Paul\\.gemini\\antigravity\\brain\\751fe4e7-6c44-4ed4-b989-2dab51daeecc';
const kategDir = path.join(__dirname, '..', 'public', 'images', 'Kategorien');

console.log('--- Applying Selected Category Images ---');

// Define targets and their sources
const operations = [
  {
    name: 'induktionspfannen.png',
    type: 'agent',
    src: path.join(brainDir, 'induktionspfannen_1779294397328.png'),
    dest: path.join(kategDir, 'induktionspfannen.png')
  },
  {
    name: 'induktionstoepfe.jpg',
    type: 'user',
    src: path.join(kategDir, 'Induktionstöpfe_.jpeg'),
    dest: path.join(kategDir, 'induktionstoepfe.jpg')
  },
  {
    name: 'induktions-sets.png',
    type: 'agent',
    src: path.join(brainDir, 'induktions_sets_1779295005567.png'),
    dest: path.join(kategDir, 'induktions-sets.png')
  },
  {
    name: 'induktions-zubehoer.jpg',
    type: 'user',
    src: path.join(kategDir, 'Induktions-Zubehör.jpeg'),
    dest: path.join(kategDir, 'induktions-zubehoer.jpg')
  }
];

// Perform copy operations
operations.forEach(op => {
  if (fs.existsSync(op.src)) {
    fs.copyFileSync(op.src, op.dest);
    console.log(`[SUCCESS] Created ${op.name} from ${op.type} source.`);
  } else {
    console.error(`[ERROR] Source not found for ${op.name}: ${op.src}`);
  }
});

// Clean up old user files from the folder to keep it clean
const filesToClean = [
  'Induktions-Zubehör.jpeg',
  'Induktionspfannen_.jpeg',
  'Induktionstöpfe_.jpeg',
  'Premium_Sets.jpeg'
];

filesToClean.forEach(file => {
  const filePath = path.join(kategDir, file);
  if (fs.existsSync(filePath)) {
    try {
      fs.unlinkSync(filePath);
      console.log(`[CLEANUP] Deleted raw user file: ${file}`);
    } catch (e) {
      console.error(`[CLEANUP ERROR] Could not delete ${file}:`, e.message);
    }
  }
});

console.log('--- Image selection applied successfully! ---');
