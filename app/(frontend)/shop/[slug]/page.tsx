import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import config from '@/payload.config'
import Link from 'next/link'
import AddToCart from '@/components/cart/AddToCart'

export const revalidate = 300

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

  const images = (product.images as { image: { url?: string } }[]) || []
  const category = product.category as { name?: string; slug?: string } | undefined
  const details = product.details as Record<string, string> | undefined
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
              <div key={i} className="aspect-[4/3] bg-sand overflow-hidden">
                <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: `url(${img.image?.url})` }} />
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

          <AddToCart
            product={{
              id: product.id,
              name: product.name,
              price: product.price,
              inStock: product.inStock,
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
