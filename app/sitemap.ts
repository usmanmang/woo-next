import type { MetadataRoute } from 'next'
import { getPayload } from 'payload'
import { hasPayloadEnv } from '@/lib/env'
import config from '@/payload.config'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

function url(path: string) {
  return new URL(path, siteUrl).toString()
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: url('/'), lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    { url: url('/shop'), lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: url('/collections'), lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: url('/lookbook'), lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    { url: url('/about'), lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: url('/contact'), lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
  ]

  if (!hasPayloadEnv()) return staticRoutes

  const payload = await getPayload({ config })
  const [products, collections, posts] = await Promise.all([
    payload.find({ collection: 'products', limit: 1000, depth: 0 }),
    payload.find({ collection: 'collections', limit: 1000, depth: 0 }),
    payload.find({ collection: 'lookbook', limit: 1000, depth: 0 }),
  ])

  return [
    ...staticRoutes,
    ...products.docs.map((product) => ({
      url: url(`/shop/${product.slug}`),
      lastModified: product.updatedAt ? new Date(product.updatedAt) : new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    })),
    ...collections.docs.map((collection) => ({
      url: url(`/collections/${collection.slug}`),
      lastModified: collection.updatedAt ? new Date(collection.updatedAt) : new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    })),
    ...posts.docs.map((post) => ({
      url: url(`/lookbook/${post.slug}`),
      lastModified: post.updatedAt ? new Date(post.updatedAt) : new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    })),
  ]
}
