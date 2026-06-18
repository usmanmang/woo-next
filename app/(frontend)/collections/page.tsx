import Link from 'next/link'
import type { Metadata } from 'next'
import { getPayload } from 'payload'
import MediaImage from '@/components/MediaImage'
import config from '@/payload.config'

export const revalidate = 600

export const metadata: Metadata = {
  title: 'Collections',
  description: 'Explore curated furniture collections for considered modern living.',
}

type RichTextChild = { text?: string | null }
type RichTextNode = { children?: RichTextChild[] | null }
type RichTextContent = { root?: { children?: RichTextNode[] | null } | null }

function extractExcerpt(richText: RichTextContent | null | undefined, maxLen = 120): string {
  const text = richText?.root?.children
    ?.map((child) => child.children?.map((item) => item.text || '').join('') || '')
    .filter(Boolean)
    .join(' ')
  if (!text) return ''
  return text.length > maxLen ? text.slice(0, maxLen) + '...' : text
}

type MediaType = { url?: string | null; alt?: string | null }

export default async function CollectionsPage() {
  const payload = await getPayload({ config })
  const { docs: collections } = await payload.find({
    collection: 'collections',
    limit: 20,
    depth: 1,
  })

  return (
    <div className="max-w-7xl mx-auto px-6 py-16">
      <div className="max-w-2xl mb-16">
        <p className="font-label text-xs tracking-[0.2em] uppercase text-muted mb-4">Curated Selections</p>
        <h1 className="font-display text-display-xl mb-6">Collections</h1>
        <p className="text-muted leading-relaxed">
          Explore our thoughtfully curated collections — each one tells a story of craftsmanship,
          material, and timeless design.
        </p>
      </div>

      {collections.length === 0 ? (
        <div className="border border-border px-6 py-16 text-center">
          <h2 className="font-display text-3xl mb-3">No collections yet</h2>
          <p className="text-muted">Curated edits will appear here once they are published.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {collections.map((col) => {
            const heroImage = col.heroImage as MediaType | undefined
            const excerpt = extractExcerpt(col.description as RichTextContent | null | undefined)
            return (
              <Link
                key={col.slug}
                href={`/collections/${col.slug}`}
                className="group relative h-[55vh] min-h-[420px] overflow-hidden"
              >
                <MediaImage src={heroImage?.url} alt={heroImage?.alt || col.title} sizes="(min-width: 768px) 50vw, 100vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

                {col.featured && (
                  <div className="absolute top-6 left-6 bg-accent text-background font-label text-[10px] tracking-[0.2em] uppercase px-4 py-1.5">
                    Featured
                  </div>
                )}

                <div className="relative h-full flex flex-col justify-end p-8">
                  <p className="font-label text-xs tracking-[0.2em] uppercase text-white/70 mb-2">{col.tagline}</p>
                  <h2 className="font-display text-display-lg text-white">{col.title}</h2>
                  {excerpt && (
                    <p className="text-white/60 text-sm mt-3 max-w-md leading-relaxed">{excerpt}</p>
                  )}
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
