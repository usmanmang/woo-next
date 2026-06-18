import Link from 'next/link'
import { getPayload } from 'payload'
import MediaImage from '@/components/MediaImage'
import config from '@/payload.config'

export default async function CategoryGrid() {
  const payload = await getPayload({ config })
  const { docs: categories } = await payload.find({
    collection: 'categories',
    where: { featuredOnHome: { equals: true } },
    sort: 'order',
    depth: 1,
  })

  return (
    <section className="max-w-7xl mx-auto px-6 py-24">
      <div className="text-center mb-12">
        <p className="font-label text-xs tracking-[0.2em] uppercase text-muted mb-3">
          Shop by room
        </p>
        <h2 className="font-display text-display-lg">Every room, thoughtfully designed</h2>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {categories.map((cat) => {
          const image = cat.image as { url?: string; alt?: string | null } | undefined
          return (
            <Link
              key={cat.slug}
              href={`/shop?room=${cat.slug}`}
              className="group relative aspect-[3/4] overflow-hidden"
            >
              <MediaImage src={image?.url} alt={image?.alt || cat.name} sizes="(min-width: 1024px) 16vw, (min-width: 768px) 33vw, 50vw" className="object-cover transition-transform duration-500 group-hover:scale-105" />
              <div className="absolute inset-0 bg-black/10 group-hover:bg-black/40 transition-colors" />
              <div className="absolute inset-0 flex items-end p-4">
                <span className="bg-background text-foreground px-3 py-1.5 text-xs font-label tracking-wider uppercase">
                  {cat.name}
                </span>
              </div>
            </Link>
          )
        })}
      </div>
    </section>
  )
}
