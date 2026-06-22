import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'
import { getSeededPexelsUrl, seededMediaPexelsIds } from '../lib/seeded-media'

const mediaDir = path.resolve(process.cwd(), 'media')

async function downloadImage(url: string) {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Failed to download ${url}: ${res.status} ${res.statusText}`)

  return Buffer.from(await res.arrayBuffer())
}

function sizedFilename(filename: string, width: number, height: number) {
  const extension = path.extname(filename)
  const basename = path.basename(filename, extension)

  return `${basename}-${width}x${height}${extension}`
}

async function writeImageVariants(filename: string, source: Buffer) {
  await writeFile(path.join(mediaDir, filename), source)

  await sharp(source)
    .resize(400, 300, { fit: 'cover', position: 'center' })
    .jpeg()
    .toFile(path.join(mediaDir, sizedFilename(filename, 400, 300)))

  await sharp(source)
    .resize(768, 576, { fit: 'cover', position: 'center' })
    .jpeg()
    .toFile(path.join(mediaDir, sizedFilename(filename, 768, 576)))
}

async function restoreLocalMedia() {
  await mkdir(mediaDir, { recursive: true })

  let restored = 0

  for (const filename of Object.keys(seededMediaPexelsIds)) {
    const sourceUrl = getSeededPexelsUrl(filename, 800, 600)
    if (!sourceUrl) continue

    console.log(`Restoring ${filename}...`)
    const source = await downloadImage(sourceUrl)
    await writeImageVariants(filename, source)
    restored += 1
  }

  console.log(`Local media restore complete. Restored ${restored} originals plus thumbnail/card variants.`)
}

void restoreLocalMedia().catch((error) => {
  console.error(error)
  process.exit(1)
})
