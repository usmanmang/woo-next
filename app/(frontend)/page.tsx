import Hero from '@/components/sections/Hero'
import CategoryGrid from '@/components/sections/CategoryGrid'
import FeaturedProducts from '@/components/sections/FeaturedProducts'
import CollectionBanner from '@/components/sections/CollectionBanner'
import LookbookTeaser from '@/components/sections/LookbookTeaser'
import Newsletter from '@/components/sections/Newsletter'

export const revalidate = 3600

export default function HomePage() {
  return (
    <>
      <Hero />
      <CategoryGrid />
      <FeaturedProducts />
      <CollectionBanner />
      <LookbookTeaser />
      <Newsletter />
    </>
  )
}
