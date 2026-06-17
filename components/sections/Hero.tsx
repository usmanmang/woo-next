import Link from 'next/link'
import { getPayload } from 'payload'
import config from '@/payload.config'

export default async function Hero() {
  const payload = await getPayload({ config })
  const settings = await payload.findGlobal({ slug: 'site-settings', depth: 1 })
  const hero = settings.homepageHero as Record<string, unknown> | undefined

  const headline = (hero?.headline as string) || 'Crafted simplicity from Copenhagen'
  const subheadline = (hero?.subheadline as string) || 'Modern living, timeless design'
  const ctaText = (hero?.ctaText as string) || 'Explore Now'
  const ctaLink = (hero?.ctaLink as string) || '/shop'
  const bgImage = hero?.backgroundImage as { url?: string } | undefined

  return (
    <section className="relative h-[90vh] min-h-[600px] flex items-center">
      <div className="absolute inset-0 bg-sand" />
      {bgImage?.url ? (
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${bgImage.url})` }}
        />
      ) : (
        <div className="absolute inset-0 bg-accent/30" />
      )}
      <div className="absolute inset-0 bg-black/40" />

      <div className="relative max-w-7xl mx-auto px-6 w-full">
        <div className="max-w-2xl">
          <p className="font-label text-xs tracking-[0.2em] uppercase text-white/80 mb-4">
            {subheadline}
          </p>
          <h1 className="font-display text-display-xl text-white leading-none mb-6">
            {headline}
          </h1>
          <Link
            href={ctaLink}
            className="inline-flex bg-background text-foreground px-8 py-3 font-label text-xs tracking-widest uppercase hover:bg-accent hover:text-background transition-colors"
          >
            {ctaText}
          </Link>
        </div>
      </div>
    </section>
  )
}
