import Link from 'next/link'
import { getPayload } from 'payload'
import MediaImage from '@/components/MediaImage'
import { hasPayloadEnv } from '@/lib/env'
import config from '@/payload.config'

export default async function FeaturedProducts() {
  if (!hasPayloadEnv()) return null

  const payload = await getPayload({ config })
  const { docs: products } = await payload.find({
    collection: 'products',
    where: { tags: { in: 'featured' } },
    limit: 8,
    sort: '-createdAt',
    depth: 1,
  })

  return (
    <section className="max-w-7xl mx-auto px-6 py-24">
      <div className="flex items-center justify-between mb-12">
        <div>
          <p className="font-label text-xs tracking-[0.2em] uppercase text-muted mb-3">
            Featured
          </p>
          <h2 className="font-display text-display-lg">Explore products</h2>
        </div>
        <Link
          href="/shop"
          className="hidden md:inline-flex border border-foreground px-6 py-2.5 font-label text-xs tracking-widest uppercase hover:bg-foreground hover:text-background transition-colors"
        >
          View All
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {products.map((product) => {
          const images = (product.images as { image: { url?: string; alt?: string | null } }[]) || []
          const firstImage = images[0]?.image
          const hasSale = product.comparePrice && product.comparePrice > product.price
          const discount = hasSale
            ? `-${Math.round(((product.comparePrice! - product.price) / product.comparePrice!) * 100)}%`
            : undefined

          return (
            <Link key={product.slug} href={`/shop/${product.slug}`} className="group">
              <div className="relative aspect-square bg-sand overflow-hidden mb-4">
                <MediaImage src={firstImage?.url} alt={firstImage?.alt || product.name} sizes="(min-width: 768px) 25vw, 50vw" className="object-cover transition-transform duration-500 group-hover:scale-105" />
                {discount && (
                  <span className="absolute top-3 left-3 bg-foreground text-background text-[10px] font-label tracking-wider px-2 py-1 uppercase">
                    {discount}
                  </span>
                )}
                {!product.inStock && (
                  <span className="absolute top-3 left-3 bg-muted text-background text-[10px] font-label tracking-wider px-2 py-1 uppercase">
                    Out of stock
                  </span>
                )}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors" />
              </div>
              <h3 className="font-body text-sm mb-1">{product.name}</h3>
              <div className="font-label text-xs tracking-wider">
                {product.comparePrice ? (
                  <>
                    <span className="text-accent">{product.price.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</span>
                    <span className="text-muted line-through ml-2">{product.comparePrice.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</span>
                  </>
                ) : (
                  <span>{product.price.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</span>
                )}
              </div>
            </Link>
          )
        })}
      </div>

      <div className="mt-8 text-center md:hidden">
        <Link
          href="/shop"
          className="inline-flex border border-foreground px-6 py-2.5 font-label text-xs tracking-widest uppercase hover:bg-foreground hover:text-background transition-colors"
        >
          View All
        </Link>
      </div>
    </section>
  )
}
