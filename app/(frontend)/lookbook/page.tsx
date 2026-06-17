import Link from 'next/link'
import type { Metadata } from 'next'
import { getPayload } from 'payload'
import { getBackgroundImage } from '@/lib/media'
import config from '@/payload.config'

export const revalidate = 600

export const metadata: Metadata = {
  title: 'Journal | Furniture Studio',
  description: 'Furniture stories, styling notes, and lookbook inspiration for modern interiors.',
}

function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
}

export default async function LookbookPage() {
  const payload = await getPayload({ config })
  const { docs: posts } = await payload.find({
    collection: 'lookbook',
    limit: 20,
    sort: '-date',
    depth: 1,
  })

  return (
    <div className="max-w-7xl mx-auto px-6 py-16">
      <h1 className="font-display text-display-lg mb-12">Journal</h1>

      {posts.length === 0 ? (
        <div className="border border-border px-6 py-16 text-center">
          <h2 className="font-display text-3xl mb-3">No journal posts yet</h2>
          <p className="text-muted">Lookbook stories will appear here once they are published.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => {
            const cover = post.coverImage as { url?: string | null } | undefined
            return (
              <Link key={post.slug} href={`/lookbook/${post.slug}`} className="group">
                <div className="aspect-[4/3] bg-sand overflow-hidden mb-4">
                  <div
                    className="w-full h-full bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                    style={{ backgroundImage: getBackgroundImage(cover?.url) }}
                  />
                </div>
                <p className="text-xs text-muted font-label tracking-wider uppercase mb-2">
                  {post.date ? formatDate(post.date as string) : ''}
                </p>
                <h2 className="font-display text-2xl leading-tight group-hover:text-accent transition-colors">{post.title}</h2>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
