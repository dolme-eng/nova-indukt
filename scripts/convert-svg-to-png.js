const sharp = require('sharp')
const fs = require('fs')
const path = require('path')

const dir = path.join(__dirname, '..', 'public', 'images', 'Kategorien')

const svgFiles = fs.readdirSync(dir).filter(f => f.endsWith('.svg'))

async function main() {
  for (const file of svgFiles) {
    const svgPath = path.join(dir, file)
    const pngName = file.replace('.svg', '.png')
    const pngPath = path.join(dir, pngName)
    
    if (fs.existsSync(pngPath)) {
      console.log(`SKIP ${pngName} already exists`)
      continue
    }
    
    try {
      const svgBuffer = fs.readFileSync(svgPath)
      const pngBuffer = await sharp(svgBuffer).png().toBuffer()
      fs.writeFileSync(pngPath, pngBuffer)
      console.log(`OK ${file} -> ${pngName} (${(pngBuffer.length / 1024).toFixed(0)}KB)`)
    } catch (err) {
      console.log(`FAIL ${file}: ${err.message}`)
    }
  }
  
  // List all files now
  const files = fs.readdirSync(dir)
  console.log('\nAll files:')
  files.forEach(f => {
    const stat = fs.statSync(path.join(dir, f))
    console.log(`  ${f} (${(stat.size / 1024).toFixed(0)}KB)`)
  })
}

main().catch(console.error)
