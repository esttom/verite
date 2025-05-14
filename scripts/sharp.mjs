import { existsSync, mkdirSync, readdirSync, statSync } from 'node:fs'
import { relative, resolve } from 'node:path'
import sharp from 'sharp'

const inputDir = resolve(import.meta.dirname, 'input')
const outputDir = resolve(import.meta.dirname, 'output')

imageCompress(inputDir)

function imageCompress(path) {
  const files = readdirSync(path)
  for (const file of files) {
    const srcPath = resolve(path, file)
    const outPath = resolve(outputDir, relative(inputDir, srcPath))
    if (statSync(srcPath).isDirectory()) {
      if (!existsSync(outPath)) {
        mkdirSync(outPath)
      }
      imageCompress(srcPath)
    }
    else {
      if (srcPath.endsWith('.png')) {
        sharp(srcPath)
          .resize(256, 256)
          .png({
            compressionLevel: 6,
            quality: 75,
            palette: true,
          })
          .toFile(outPath)
      }
      else if (srcPath.endsWith('.gif')) {
        sharp(srcPath, { animated: true })
          .resize(256, 256)
          .gif()
          .toFile(outPath)
      }
    }
  }
}
