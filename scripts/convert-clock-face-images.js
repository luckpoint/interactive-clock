#!/usr/bin/env node

/**
 * Convert PNG clock-face images to WebP in two sizes:
 *  - 320×320 (thumbnail)
 *  - 960×960 (full/clock face)
 *
 * Usage:
 *   pnpm run convert-images
 */

const fs = require('fs/promises')
const path = require('path')
const sharp = require('sharp')

// Directory containing the original PNG clock faces
const INPUT_DIR = path.join(__dirname, '..', 'public', 'clock-faces')

// Conversion targets
const OUTPUT_SIZES = [
  { suffix: '320', size: 320 },  // thumbnail
  { suffix: '960', size: 960 },  // clock face full size
]

async function ensureInputDir() {
  try {
    const stat = await fs.stat(INPUT_DIR)
    if (!stat.isDirectory()) {
      throw new Error(`${INPUT_DIR} is not a directory`)
    }
  } catch (err) {
    console.error(`❌  Input directory not found: ${INPUT_DIR}`)
    process.exit(1)
  }
}

async function convertAll() {
  await ensureInputDir()

  const files = await fs.readdir(INPUT_DIR)
  const pngFiles = files.filter((f) => f.toLowerCase().endsWith('.png'))

  if (pngFiles.length === 0) {
    console.log('No PNG files found in', INPUT_DIR)
    return
  }

  console.log(`Found ${pngFiles.length} PNG files. Converting...`)

  for (const file of pngFiles) {
    const inputPath = path.join(INPUT_DIR, file)
    const baseName = path.parse(file).name // e.g., clock-face-sun

    for (const { suffix, size } of OUTPUT_SIZES) {
      const outputFileName = `${baseName}-${suffix}.webp`
      const outputPath = path.join(INPUT_DIR, outputFileName)
      try {
        await sharp(inputPath)
          .resize(size, size, { fit: 'cover' })
          .webp({ quality: 85 })
          .toFile(outputPath)
        console.log(`✅  Generated ${outputFileName}`)
      } catch (err) {
        console.error(`❌  Failed to generate ${outputFileName}:`, err)
      }
    }
  }

  console.log('🎉  Conversion complete.')
}

convertAll().catch((err) => {
  console.error(err)
  process.exit(1)
}) 