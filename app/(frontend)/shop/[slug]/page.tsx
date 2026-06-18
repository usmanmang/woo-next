import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getPayload } from 'payload'
import config from '@/payload.config'
import Link from 'next/link'
import AddToCart from '@/components/cart/AddToCart'
import MediaImage from '@/components/MediaImage'

export const revalidate = 300

type ProductImage = { image?: { url?: string | null; alt?: string | null } | null }
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

function getProductExcerpt(description: RichTextContent | null | undefined, maxLen = 155): string | undefined {
  const text = description?.root?.children?.map(getNodeText).filter(Boolean).join(' ').trim()
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
    collection: 'products',
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 1,
  })
  const product = docs[0]

  if (!product) return { title: 'Product Not Found' }

  const images = (product.images as ProductImage[]) || []
  const imageUrl = images[0]?.image?.url || undefined
  const description = product.seoDescription || getProductExcerpt(product.description as RichTextContent | null | undefined) || `Shop ${product.name} at Furniture Studio.`
  const title = product.seoTitle || product.name

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
      images: imageUrl ? [{ url: imageUrl }] : undefined,
    },
  }
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const payload = await getPayload({ config })
  const { docs: products } = await payload.find({
    collection: 'products',
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 1,
  })

  const product = products[0]
  if (!product) notFound()

  const images = (product.images as { image: { url?: string; alt?: string | null } }[]) || []
  const category = product.category as { name?: string; slug?: string } | undefined
  const details = product.details as Record<string, string> | undefined
  const description = product.description as RichTextContent | null | undefined
  const hasSale = product.comparePrice && product.comparePrice > product.price
  const firstImage = images[0]?.image?.url || ''

  return (
    <div className="max-w-7xl mx-auto px-6 py-16">
      <nav className="font-label text-xs tracking-widest uppercase text-muted mb-8">
        <Link href="/" className="hover:text-foreground">Home</Link>
        <span className="mx-2">/</span>
        <Link href="/shop" className="hover:text-foreground">Shop</Link>
        <span className="mx-2">/</span>
        <span className="text-foreground">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="space-y-4">
          {images.length > 0 ? (
            images.map((img, i) => (
              <div key={i} className="relative aspect-[4/3] bg-sand overflow-hidden">
                <MediaImage src={img.image?.url} alt={img.image?.alt || product.name} sizes="(min-width: 768px) 50vw, 100vw" priority={i === 0} />
              </div>
            ))
          ) : (
            <div className="aspect-[4/3] bg-sand" />
          )}
        </div>

        <div>
          <p className="font-label text-xs tracking-[0.2em] uppercase text-muted mb-2">
            {category?.name || 'Product'}
          </p>
          <h1 className="font-display text-display-lg mb-4">{product.name}</h1>

          <div className="font-label text-xl tracking-wider mb-6">
            {hasSale ? (
              <>
                <span className="text-accent">{product.price.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</span>
                <span className="text-muted line-through ml-3 text-sm">{product.comparePrice!.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</span>
              </>
            ) : (
              <span>{product.price.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</span>
            )}
          </div>

          {!product.inStock && (
            <p className="text-muted font-label text-xs tracking-widest uppercase mb-4">Out of stock</p>
          )}

          {description && (
            <div className="mb-8 text-muted leading-relaxed">
              {renderRichText(description)}
            </div>
          )}

          <AddToCart
            product={{
              id: product.id,
              name: product.name,
              price: product.price,
              inStock: product.inStock,
              stockQty: product.stockQty,
              image: firstImage,
              variants: product.variants,
            }}
          />

          {details && (
            <div className="border-t border-border pt-6 mt-8 space-y-3 text-sm text-muted">
              {details.materials && <p><span className="font-label text-foreground">Materials:</span> {details.materials}</p>}
              {details.dimensions && <p><span className="font-label text-foreground">Dimensions:</span> {details.dimensions}</p>}
              {details.weight && <p><span className="font-label text-foreground">Weight:</span> {details.weight}</p>}
              {details.careInstructions && <p><span className="font-label text-foreground">Care:</span> {details.careInstructions}</p>}
              {details.origin && <p><span className="font-label text-foreground">Origin:</span> {details.origin}</p>}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
