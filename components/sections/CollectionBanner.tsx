import Link from 'next/link'
import { getPayload } from 'payload'
import MediaImage from '@/components/MediaImage'
import config from '@/payload.config'

export default async function CollectionBanner() {
  const payload = await getPayload({ config })
  const { docs: collections } = await payload.find({
    collection: 'collections',
    where: { featured: { equals: true } },
    limit: 1,
    depth: 1,
  })

  const collection = collections[0]
  const heroImage = collection?.heroImage as { url?: string; alt?: string | null } | undefined

  return (
    <section className="relative h-[70vh] min-h-[500px] flex items-center">
      {heroImage?.url ? (
        <MediaImage src={heroImage.url} alt={heroImage.alt || collection?.title || ''} sizes="100vw" className="object-cover" />
      ) : (
        <div className="absolute inset-0 bg-accent/40" />
      )}
      <div className="absolute inset-0 bg-black/40" />

      <div className="relative max-w-7xl mx-auto px-6 w-full">
        <div className="max-w-xl">
          <p className="font-label text-xs tracking-[0.2em] uppercase text-white/80 mb-4">
            {collection?.tagline || 'Curated Collection'}
          </p>
          <h2 className="font-display text-display-xl text-white leading-none mb-6">
            {collection?.title || 'The Lounge Edit'}
          </h2>
          <Link
            href={`/collections/${collection?.slug || '#'}`}
            className="inline-flex bg-background text-foreground px-8 py-3 font-label text-xs tracking-widest uppercase hover:bg-accent hover:text-background transition-colors"
          >
            Shop Collection
          </Link>
        </div>
      </div>
    </section>
  )
}
