import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'
import { getPayload } from 'payload'
import { getBackgroundImage } from '@/lib/media'
import config from '@/payload.config'

export const revalidate = 300

type MediaType = { url?: string | null }
type ProductPreview = {
  name?: string
  slug?: string
  price?: number | null
  images?: { image?: MediaType }[]
}
type CollectionPreview = {
  title?: string | null
  slug?: string | null
  tagline?: string | null
  heroImage?: MediaType | number | null
}
type RichTextChild = { text?: string | null }
type RichTextNode = {
  type?: string | null
  tag?: 'h2' | 'h3' | 'h4' | null
  children?: RichTextChild[] | null
}
type RichTextContent = { root?: { children?: RichTextNode[] | null } | null }

const headingStyles: Record<string, string> = {
  h2: 'text-3xl',
  h3: 'text-2xl',
  h4: 'text-xl',
}

function getNodeText(child: RichTextNode) {
  return child.children?.map((item) => item.text || '').join('') || ''
}

function extractExcerpt(richText: RichTextContent | null | undefined, maxLen = 155): string | undefined {
  const text = richText?.root?.children?.map(getNodeText).filter(Boolean).join(' ')
  if (!text) return undefined
  return text.length > maxLen ? `${text.slice(0, maxLen)}...` : text
}

function renderRichText(content: RichTextContent | null | undefined) {
  if (!content?.root?.children) return null
  return content.root.children.map((child, i) => {
    const text = getNodeText(child)
    if (child.type === 'paragraph') {
      return <p key={i} className="mb-4 leading-relaxed">{text}</p>
    }
    if (child.type === 'heading' && child.tag) {
      const Tag = child.tag
      return <Tag key={i} className={`font-display ${headingStyles[child.tag] || 'text-2xl'} mb-4`}>{text}</Tag>
    }
    return null
  })
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const payload = await getPayload({ config })
  const { docs } = await payload.find({
    collection: 'collections',
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 0,
  })
  const collection = docs[0]

  if (!collection) return { title: 'Collection Not Found | Furniture Studio' }

  return {
    title: `${collection.title} | Furniture Studio`,
    description: extractExcerpt(collection.description as RichTextContent | null | undefined) || collection.tagline || undefined,
  }
}

export default async function CollectionPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const payload = await getPayload({ config })
  const { docs: collections } = await payload.find({
    collection: 'collections',
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 2,
  })

  const collection = collections[0]
  if (!collection) notFound()

  const heroImage = collection.heroImage as MediaType | undefined
  const products = (collection.products as ProductPreview[]) || []
  const moreCollections = await payload.find({
    collection: 'collections',
    where: { slug: { not_equals: slug } },
    limit: 3,
    depth: 1,
  })

  return (
    <div>
      <section className="relative h-[60vh] min-h-[400px] flex items-center">
        {heroImage?.url ? (
          <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${heroImage.url})` }} />
        ) : (
          <div className="absolute inset-0 bg-accent/20" />
        )}
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative max-w-7xl mx-auto px-6 w-full">
          <div className="max-w-xl">
            <p className="font-label text-xs tracking-[0.2em] uppercase text-white/80 mb-3">{collection.tagline}</p>
            <h1 className="font-display text-display-xl text-white">{collection.title}</h1>
          </div>
        </div>
      </section>

      {collection.description && (
        <section className="max-w-3xl mx-auto px-6 py-16 text-muted leading-relaxed">
          {renderRichText(collection.description as RichTextContent | null | undefined)}
        </section>
      )}

      <section className="max-w-7xl mx-auto px-6 pb-16">
        <h2 className="font-label text-xs tracking-[0.2em] uppercase text-muted mb-8">
          {products.length} {products.length === 1 ? 'Product' : 'Products'}
        </h2>

        {products.length === 0 ? (
          <div className="border border-border px-6 py-12 text-center">
            <p className="text-muted">Products for this collection will appear here soon.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => {
              const backgroundImage = getBackgroundImage(product.images?.[0]?.image?.url)
              return (
                <Link key={product.slug} href={`/shop/${product.slug}`} className="group">
                  <div className="aspect-square bg-sand overflow-hidden mb-4">
                    <div
                      className="w-full h-full bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                      style={{ backgroundImage }}
                    />
                  </div>
                  <h3 className="font-body text-sm mb-1">{product.name}</h3>
                  <p className="font-label text-xs tracking-wider">
                    {product.price?.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                  </p>
                </Link>
              )
            })}
          </div>
        )}
      </section>

      {moreCollections.docs.length > 0 && (
        <section className="bg-sand/30 py-16">
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="font-display text-display-lg mb-10">Explore More Collections</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {moreCollections.docs.map((col) => {
                const collectionPreview = col as CollectionPreview
                const heroImage = collectionPreview.heroImage as MediaType | undefined
                const backgroundImage = getBackgroundImage(heroImage?.url)
                return (
                  <Link
                    key={collectionPreview.slug}
                    href={`/collections/${collectionPreview.slug}`}
                    className="group relative h-64 overflow-hidden"
                  >
                    <div
                      className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                      style={{ backgroundImage }}
                    />
                    <div className="absolute inset-0 bg-black/40" />
                    <div className="relative h-full flex flex-col justify-end p-6">
                      <p className="font-label text-xs tracking-[0.2em] uppercase text-white/70 mb-1">{collectionPreview.tagline}</p>
                      <h3 className="font-display text-2xl text-white">{collectionPreview.title}</h3>
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
