import Link from 'next/link'
import { getPayload } from 'payload'
import MediaImage from '@/components/MediaImage'
import { hasPayloadEnv } from '@/lib/env'
import config from '@/payload.config'

function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
}

export default async function LookbookTeaser() {
  if (!hasPayloadEnv()) return null

  const payload = await getPayload({ config })
  const { docs: posts } = await payload.find({
    collection: 'lookbook',
    limit: 3,
    sort: '-date',
    depth: 1,
  })

  return (
    <section className="max-w-7xl mx-auto px-6 py-24">
      <div className="flex items-center justify-between mb-12">
        <div>
          <p className="font-label text-xs tracking-[0.2em] uppercase text-muted mb-3">
            From our journal
          </p>
          <h2 className="font-display text-display-lg">Design ideas & inspiration</h2>
        </div>
        <Link
          href="/lookbook"
          className="hidden md:inline-flex font-label text-xs tracking-widest uppercase text-muted hover:text-foreground transition-colors"
        >
          View more &rarr;
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {posts.map((post) => {
          const cover = post.coverImage as { url?: string; alt?: string | null } | undefined
          return (
            <Link key={post.slug} href={`/lookbook/${post.slug}`} className="group">
              <div className="relative aspect-[4/3] bg-sand overflow-hidden mb-4">
                <MediaImage src={cover?.url} alt={cover?.alt || post.title} sizes="(min-width: 768px) 33vw, 100vw" className="object-cover transition-transform duration-500 group-hover:scale-105" />
              </div>
              <p className="text-xs text-muted font-label tracking-wider uppercase mb-2">
                {post.date ? formatDate(post.date as string) : ''}
              </p>
              <h3 className="font-display text-2xl leading-tight group-hover:text-accent transition-colors">
                {post.title}
              </h3>
            </Link>
          )
        })}
      </div>

      <div className="mt-8 text-center md:hidden">
        <Link
          href="/lookbook"
          className="inline-flex font-label text-xs tracking-widest uppercase text-muted hover:text-foreground transition-colors"
        >
          View more &rarr;
        </Link>
      </div>
    </section>
  )
}
