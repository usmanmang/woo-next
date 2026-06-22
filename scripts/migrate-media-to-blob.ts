import { getPayload } from 'payload'
import config from '../payload.config'
import { getSeededPexelsUrl, seededMediaPexelsIds } from '../lib/seeded-media'
import type { Media } from '../types/payload-types'

async function downloadImage(url: string): Promise<{ buffer: Buffer; mimeType: string }> {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Failed to download ${url}: ${res.status} ${res.statusText}`)

  const mimeType = res.headers.get('content-type') || 'image/jpeg'
  if (!mimeType.startsWith('image/')) throw new Error(`Unexpected content-type: ${mimeType} for ${url}`)

  return {
    buffer: Buffer.from(await res.arrayBuffer()),
    mimeType,
  }
}

function isBlobUrl(url: string | null | undefined) {
  return Boolean(url?.includes('.public.blob.vercel-storage.com'))
}

async function migrateMediaToBlob() {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    throw new Error('BLOB_READ_WRITE_TOKEN is required so Payload can upload files to Vercel Blob.')
  }

  const payload = await getPayload({ config })
  const result = await payload.find({
    collection: 'media',
    limit: 1000,
    depth: 0,
  })

  let migrated = 0
  let skipped = 0

  for (const doc of result.docs as Media[]) {
    const filename = doc.filename || ''

    if (!filename || !seededMediaPexelsIds[filename]) {
      skipped += 1
      continue
    }

    if (isBlobUrl(doc.url)) {
      console.log(`Skipping already migrated media: ${filename}`)
      skipped += 1
      continue
    }

    const sourceUrl = getSeededPexelsUrl(filename, 1200, 900)
    if (!sourceUrl) {
      skipped += 1
      continue
    }

    console.log(`Migrating ${filename}...`)
    const { buffer, mimeType } = await downloadImage(sourceUrl)

    await payload.update({
      collection: 'media',
      id: doc.id,
      data: {
        alt: doc.alt,
      },
      file: {
        data: buffer,
        mimetype: mimeType,
        name: filename,
        size: buffer.length,
      },
    })

    migrated += 1
  }

  console.log(`Media migration complete. Migrated: ${migrated}. Skipped: ${skipped}.`)
}

void migrateMediaToBlob().catch((error) => {
  console.error(error)
  process.exit(1)
})
