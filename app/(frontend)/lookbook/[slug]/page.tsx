import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'
import { getPayload } from 'payload'
import MediaImage from '@/components/MediaImage'
import config from '@/payload.config'

export const revalidate = 300

function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
}

type MediaType = { url?: string | null; alt?: string | null }
type ProductType = { name?: string; slug?: string; price?: number | null; images?: { image?: MediaType }[] }
type RichTextChild = { text?: string | null }
type RichTextNode = {
  type?: string | null
  tag?: 'h2' | 'h3' | 'h4' | null
  children?: RichTextChild[] | null
}
type RichTextContent = { root?: { children?: RichTextNode[] | null } | null }
type LookbookBlock = {
  blockType: string
  content?: RichTextContent | null
  image?: MediaType | number | null
  caption?: string | null
  fullWidth?: boolean | null
  product?: ProductType | number | null
}

const headingStyles: Record<string, string> = {
  h2: 'text-3xl',
  h3: 'text-2xl',
  h4: 'text-xl',
}

function getNodeText(child: RichTextNode) {
  return child.children?.map((item) => item.text || '').join('') || ''
}

function extractExcerpt(blocks: LookbookBlock[] | null | undefined, maxLen = 155): string | undefined {
  const text = blocks
    ?.flatMap((block) => block.content?.root?.children?.map(getNodeText) || [])
    .filter(Boolean)
    .join(' ')
  if (!text) return undefined
  return text.length > maxLen ? `${text.slice(0, maxLen)}...` : text
}

function renderRichText(content: RichTextContent | null | undefined) {
  if (!content?.root?.children) return null
  return content.root.children.map((child, i) => {
    const text = getNodeText(child)
    if (child.type === 'paragraph') {
      return <p key={i} className="mb-5 leading-relaxed">{text}</p>
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
    collection: 'lookbook',
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 0,
  })
  const post = docs[0]

  if (!post) return { title: 'Journal Post Not Found' }

  return {
    title: post.title,
    description: extractExcerpt(post.content as LookbookBlock[] | null | undefined),
  }
}

export default async function LookbookEntryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const payload = await getPayload({ config })
  const { docs: posts } = await payload.find({
    collection: 'lookbook',
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 2,
  })

  const post = posts[0]
  if (!post) notFound()

  const cover = post.coverImage as MediaType | undefined
  const content = post.content as LookbookBlock[] | undefined

  return (
    <article>
      <div className="max-w-3xl mx-auto px-6 pt-16 pb-8">
        <nav className="font-label text-xs tracking-widest uppercase text-muted mb-8">
          <Link href="/" className="hover:text-foreground">Home</Link>
          <span className="mx-2">/</span>
          <Link href="/lookbook" className="hover:text-foreground">Journal</Link>
          <span className="mx-2">/</span>
          <span className="text-foreground">{post.title}</span>
        </nav>

        <div className="relative aspect-[16/9] bg-sand overflow-hidden mb-8">
          <MediaImage src={cover?.url} alt={cover?.alt || post.title} sizes="(min-width: 768px) 768px, 100vw" priority />
        </div>

        <p className="font-label text-xs tracking-widest uppercase text-muted mb-3">
          {post.date ? formatDate(post.date as string) : ''}
        </p>
        <h1 className="font-display text-display-lg mb-8">{post.title}</h1>
      </div>

      {content && content.length > 0 ? content.map((block, i) => {
        if (block.blockType === 'imageBlock') {
          const img = block.image as MediaType | undefined
          const wrapperClass = block.fullWidth
            ? 'w-full mb-8'
            : 'max-w-3xl mx-auto px-6 mb-8'
          return (
            <div key={i} className={wrapperClass}>
              <div className="relative aspect-[16/9] bg-sand overflow-hidden">
                <MediaImage src={img?.url} alt={img?.alt || block.caption || ''} sizes={block.fullWidth ? '100vw' : '(min-width: 768px) 768px, 100vw'} />
              </div>
              {block.caption && (
                <p className="text-sm text-muted mt-3 font-label tracking-wide text-center">
                  {block.caption}
                </p>
              )}
            </div>
          )
        }

        if (block.blockType === 'textBlock' && block.content) {
          return (
            <div key={i} className="max-w-3xl mx-auto px-6 mb-8 text-muted leading-relaxed">
              {renderRichText(block.content)}
            </div>
          )
        }

        if (block.blockType === 'productTag') {
          const product = block.product as ProductType | undefined
          if (!product?.slug) return null
          const image = product.images?.[0]?.image
          return (
            <div key={i} className="max-w-3xl mx-auto px-6 mb-8">
              <div className="border border-border p-6 flex items-center gap-6">
                <div className="relative w-24 h-24 bg-sand flex-shrink-0 overflow-hidden">
                  <MediaImage src={image?.url} alt={image?.alt || product.name} sizes="96px" />
                </div>
                <div>
                  <p className="font-label text-[10px] tracking-[0.2em] uppercase text-muted mb-1">Featured Product</p>
                  <h3 className="font-display text-xl mb-1">{product.name}</h3>
                  <p className="font-label text-sm tracking-wider mb-3">
                    {product.price?.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                  </p>
                  <Link
                    href={`/shop/${product.slug}`}
                    className="font-label text-[11px] tracking-[0.2em] uppercase border border-foreground px-5 py-2 inline-block hover:bg-foreground hover:text-background transition-colors"
                  >
                    View Product
                  </Link>
                </div>
              </div>
            </div>
          )
        }

        return null
      }) : (
        <div className="max-w-3xl mx-auto px-6 pb-16 text-muted">
          This story is being prepared and will be updated soon.
        </div>
      )}
    </article>
  )
}
