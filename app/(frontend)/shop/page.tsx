import Link from 'next/link'
import { getPayload } from 'payload'
import config from '@/payload.config'

export const revalidate = 600

const roomOptions = [
  { label: 'Living Room', value: 'living-room' },
  { label: 'Bedroom', value: 'bedroom' },
  { label: 'Dining', value: 'dining' },
  { label: 'Office', value: 'office' },
  { label: 'Outdoor', value: 'outdoor' },
]

const styleOptions = [
  { label: 'Minimalist', value: 'minimalist' },
  { label: 'Scandinavian', value: 'scandinavian' },
  { label: 'Industrial', value: 'industrial' },
  { label: 'Japandi', value: 'japandi' },
  { label: 'Mid-century', value: 'mid-century' },
]

type ShopSearchParams = {
  category?: string
  room?: string
  style?: string
}

function buildFilterHref(next: Partial<ShopSearchParams>, current: ShopSearchParams) {
  const params = new URLSearchParams()
  const merged = { ...current, ...next }

  if (merged.category) params.set('category', merged.category)
  if (merged.room) params.set('room', merged.room)
  if (merged.style) params.set('style', merged.style)

  const query = params.toString()
  return query ? `/shop?${query}` : '/shop'
}

export default async function ShopPage({ searchParams }: { searchParams?: Promise<ShopSearchParams> }) {
  const filters = (await searchParams) || {}
  const payload = await getPayload({ config })
  const [{ docs: allProducts }, { docs: categories }] = await Promise.all([
    payload.find({
      collection: 'products',
      limit: 100,
      sort: '-createdAt',
      depth: 1,
    }),
    payload.find({
      collection: 'categories',
      limit: 50,
      sort: 'order',
      depth: 1,
    }),
  ])

  const products = allProducts.filter((product) => {
    const category = product.category as { slug?: string } | undefined
    const rooms = (product.room || []) as string[]
    const styles = (product.style || []) as string[]

    if (filters.category && category?.slug !== filters.category) return false
    if (filters.room && !rooms.includes(filters.room)) return false
    if (filters.style && !styles.includes(filters.style)) return false

    return true
  })

  const hasFilters = Boolean(filters.category || filters.room || filters.style)

  return (
    <div className="max-w-7xl mx-auto px-6 py-16">
      <div className="mb-12 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="font-display text-display-lg mb-2">All Products</h1>
          <p className="text-muted font-label text-xs tracking-widest uppercase">
            {products.length} {products.length === 1 ? 'product' : 'products'}
          </p>
        </div>

        {hasFilters && (
          <Link href="/shop" className="font-label text-xs tracking-[0.2em] text-muted uppercase hover:text-foreground">
            Clear Filters
          </Link>
        )}
      </div>

      <div className="mb-12 grid grid-cols-1 gap-6 border-y border-border py-6 md:grid-cols-3">
        <div>
          <p className="mb-3 font-label text-xs tracking-[0.2em] text-muted uppercase">Category</p>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Link
                key={category.slug}
                href={buildFilterHref({ category: filters.category === category.slug ? undefined : category.slug }, filters)}
                className={`border px-3 py-2 font-label text-[11px] tracking-widest uppercase transition-colors ${
                  filters.category === category.slug
                    ? 'border-foreground bg-foreground text-background'
                    : 'border-border hover:border-foreground'
                }`}
              >
                {category.name}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <p className="mb-3 font-label text-xs tracking-[0.2em] text-muted uppercase">Room</p>
          <div className="flex flex-wrap gap-2">
            {roomOptions.map((room) => (
              <Link
                key={room.value}
                href={buildFilterHref({ room: filters.room === room.value ? undefined : room.value }, filters)}
                className={`border px-3 py-2 font-label text-[11px] tracking-widest uppercase transition-colors ${
                  filters.room === room.value
                    ? 'border-foreground bg-foreground text-background'
                    : 'border-border hover:border-foreground'
                }`}
              >
                {room.label}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <p className="mb-3 font-label text-xs tracking-[0.2em] text-muted uppercase">Style</p>
          <div className="flex flex-wrap gap-2">
            {styleOptions.map((style) => (
              <Link
                key={style.value}
                href={buildFilterHref({ style: filters.style === style.value ? undefined : style.value }, filters)}
                className={`border px-3 py-2 font-label text-[11px] tracking-widest uppercase transition-colors ${
                  filters.style === style.value
                    ? 'border-foreground bg-foreground text-background'
                    : 'border-border hover:border-foreground'
                }`}
              >
                {style.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {products.length === 0 && (
        <div className="border border-border px-6 py-16 text-center">
          <h2 className="font-display text-3xl mb-3">No products found</h2>
          <p className="text-muted mb-8">Try adjusting your filters or browse the full collection.</p>
          <Link
            href="/shop"
            className="inline-block bg-foreground px-8 py-4 font-label text-xs tracking-[0.2em] text-background uppercase transition-colors hover:bg-accent"
          >
            View All Products
          </Link>
        </div>
      )}

      {products.length > 0 && <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => {
          const images = (product.images as { image: { url?: string } }[]) || []
          const firstImage = images[0]?.image?.url
          const hasSale = product.comparePrice && product.comparePrice > product.price

          return (
            <Link key={product.slug} href={`/shop/${product.slug}`} className="group">
              <div className="relative aspect-square bg-sand overflow-hidden mb-4">
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                  style={{ backgroundImage: `url(${firstImage || ''})` }}
                />
                {hasSale && (
                  <span className="absolute top-3 left-3 bg-foreground text-background text-[10px] font-label tracking-wider px-2 py-1 uppercase">
                    Sale
                  </span>
                )}
                {!product.inStock && (
                  <span className="absolute top-3 left-3 bg-muted text-background text-[10px] font-label tracking-wider px-2 py-1 uppercase">
                    Out of stock
                  </span>
                )}
              </div>
              <h3 className="font-body text-sm mb-1">{product.name}</h3>
              <div className="font-label text-xs tracking-wider">
                {hasSale ? (
                  <>
                    <span className="text-accent">{product.price.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</span>
                    <span className="text-muted line-through ml-2">{product.comparePrice!.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</span>
                  </>
                ) : (
                  <span>{product.price.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</span>
                )}
              </div>
            </Link>
          )
        })}
      </div>}
    </div>
  )
}
