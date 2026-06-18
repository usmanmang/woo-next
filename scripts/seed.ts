import { getPayload } from 'payload'
import type { Payload } from 'payload'
import config from '../payload.config'

const PEXELS_BASE = 'https://images.pexels.com/photos'

function pexelsUrl(id: number): string {
  return `${PEXELS_BASE}/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop`
}

const pexelsMap: Record<string, number> = {
  // Categories
  'cat-living-room': 5998040,
  'cat-bedroom': 90319,
  'cat-dining': 7018254,
  'cat-home-decor': 5825540,
  'cat-lighting': 2043569,
  'cat-outdoor': 9578711,
  // Products
  'prod-eve-armchair-1': 19219305,
  'prod-eve-armchair-2': 29383009,
  'prod-nova-coffee-table-1': 279607,
  'prod-nova-coffee-table-2': 271795,
  'prod-swell-sofa-1': 1571468,
  'prod-swell-sofa-2': 12187764,
  'prod-oslo-sideboard-1': 930602,
  'prod-oslo-sideboard-2': 18330048,
  'prod-dune-bed-frame-1': 7019028,
  'prod-dune-bed-frame-2': 36887757,
  'prod-twill-nightstand-1': 6394565,
  'prod-twill-nightstand-2': 2062431,
  'prod-folio-desk-1': 1957477,
  'prod-folio-desk-2': 19240055,
  'prod-boho-pendant-1': 11208970,
  'prod-boho-pendant-2': 7219505,
  'prod-arc-floor-lamp-1': 14495881,
  'prod-arc-floor-lamp-2': 30458591,
  'prod-mesa-dining-table-1': 10855260,
  'prod-mesa-dining-table-2': 12715504,
  'prod-slim-dining-chair-1': 7576110,
  'prod-slim-dining-chair-2': 32666586,
  'prod-vent-terrarium-1': 6471700,
  'prod-vent-terrarium-2': 6045259,
  'prod-pivot-outdoor-chair-1': 8680681,
  'prod-pivot-outdoor-chair-2': 133920,
  'prod-loom-woven-rug-1': 5746250,
  'prod-loom-woven-rug-2': 16087220,
  // Collections
  'col-lounge-edit': 35574732,
  'col-nordic-nights': 14076390,
  'col-outdoor-oasis': 32945128,
  // Lookbook
  'lb-fewer-better-pieces': 29383009,
  'lb-geometry-of-calm': 4451739,
  'lb-soft-light-hard-edges': 15465524,
  'lb-wabi-sabi-imperfection': 16709512,
  'lb-bringing-outdoors-in': 8916602,
  'lb-art-of-gallery-wall': 271795,
  // Hero
  'hero-bg': 5998040,
}

const categoryData = [
  { name: 'Living Room', slug: 'living-room', desc: 'Sofas, armchairs, coffee tables and more for your living space.' },
  { name: 'Bedroom', slug: 'bedroom', desc: 'Beds, nightstands, dressers and bedroom essentials.' },
  { name: 'Dining', slug: 'dining', desc: 'Dining tables, chairs, sideboards and bar stools.' },
  { name: 'Home Decor', slug: 'home-decor', desc: 'Mirrors, rugs, vases and decorative accents.' },
  { name: 'Lighting', slug: 'lighting', desc: 'Pendant lights, floor lamps, table lamps and sconces.' },
  { name: 'Outdoor', slug: 'outdoor', desc: 'Garden furniture, loungers, benches and outdoor accessories.' },
]

type ProductTag = 'new' | 'bestseller' | 'sale' | 'featured'
type ProductRoom = 'living-room' | 'bedroom' | 'dining' | 'office' | 'outdoor'
type ProductStyle = 'minimalist' | 'scandinavian' | 'industrial' | 'japandi' | 'mid-century'

const productData: Array<{
  name: string; slug: string; price: number; comparePrice?: number; category: string; imageCount: number;
  tags: ProductTag[]; room: ProductRoom[]; style: ProductStyle[]; sku?: string; inStock: boolean; stockQty?: number;
  details: { materials: string; dimensions: string; weight: string; careInstructions: string; origin: string };
}> = [
  { name: 'Eve Armchair', slug: 'eve-armchair', price: 1490, comparePrice: 1790, category: 'living-room', imageCount: 2, tags: ['featured', 'bestseller'], room: ['living-room'], style: ['scandinavian'], sku: 'EVE-001', inStock: true, stockQty: 12, details: { materials: 'Oak frame, wool upholstery', dimensions: 'W78 x D82 x H98 cm', weight: '18 kg', careInstructions: 'Professional cleaning only', origin: 'Denmark' } },
  { name: 'Nova Coffee Table', slug: 'nova-coffee-table', price: 890, category: 'living-room', imageCount: 2, tags: ['featured', 'new'], room: ['living-room'], style: ['minimalist'], sku: 'NOVA-001', inStock: true, stockQty: 8, details: { materials: 'Solid oak, tempered glass', dimensions: 'W120 x D70 x H38 cm', weight: '25 kg', careInstructions: 'Wipe with damp cloth', origin: 'Sweden' } },
  { name: 'Swell Sofa', slug: 'swell-sofa', price: 2890, category: 'living-room', imageCount: 2, tags: ['featured', 'bestseller'], room: ['living-room'], style: ['scandinavian'], sku: 'SWL-001', inStock: true, stockQty: 5, details: { materials: 'Steel frame, wool blend, feather cushions', dimensions: 'W200 x D95 x H85 cm', weight: '55 kg', careInstructions: 'Professional cleaning, rotate cushions', origin: 'Denmark' } },
  { name: 'Oslo Sideboard', slug: 'oslo-sideboard', price: 2190, category: 'living-room', imageCount: 2, tags: ['featured'], room: ['living-room'], style: ['japandi'], sku: 'OSL-001', inStock: true, stockQty: 4, details: { materials: 'Walnut veneer, brass handles', dimensions: 'W160 x H80 x D45 cm', weight: '60 kg', careInstructions: 'Wipe with dry cloth', origin: 'Japan' } },
  { name: 'Dune Bed Frame', slug: 'dune-bed-frame', price: 2490, category: 'bedroom', imageCount: 2, tags: ['featured', 'bestseller'], room: ['bedroom'], style: ['minimalist'], sku: 'DUN-001', inStock: true, stockQty: 6, details: { materials: 'Solid pine, oak veneer', dimensions: 'Queen W160 x L210 x H90 cm', weight: '45 kg', careInstructions: 'Dust regularly, avoid direct sunlight', origin: 'Finland' } },
  { name: 'Twill Nightstand', slug: 'twill-nightstand', price: 490, category: 'bedroom', imageCount: 2, tags: ['featured'], room: ['bedroom'], style: ['scandinavian'], sku: 'TWL-001', inStock: true, stockQty: 15, details: { materials: 'Birch ply, lacquered finish', dimensions: 'W45 x D38 x H52 cm', weight: '8 kg', careInstructions: 'Wipe with damp cloth', origin: 'Sweden' } },
  { name: 'Folio Desk', slug: 'folio-desk', price: 1290, category: 'bedroom', imageCount: 2, tags: [], room: ['bedroom', 'office'], style: ['japandi'], sku: 'FOL-001', inStock: false, stockQty: 0, details: { materials: 'Oak, metal legs', dimensions: 'W140 x D60 x H74 cm', weight: '22 kg', careInstructions: 'Wipe with damp cloth', origin: 'Denmark' } },
  { name: 'Boho Pendant', slug: 'boho-pendant', price: 350, comparePrice: 420, category: 'lighting', imageCount: 2, tags: ['featured', 'sale'], room: ['living-room', 'dining'], style: ['scandinavian'], sku: 'BOH-001', inStock: true, stockQty: 20, details: { materials: 'Rattan, brass fittings', dimensions: 'Dia 45 x H55 cm, cord length 150 cm', weight: '2.5 kg', careInstructions: 'Clean with soft brush', origin: 'Indonesia' } },
  { name: 'Arc Floor Lamp', slug: 'arc-floor-lamp', price: 890, category: 'lighting', imageCount: 2, tags: ['featured'], room: ['living-room', 'bedroom'], style: ['mid-century'], sku: 'ARC-001', inStock: true, stockQty: 7, details: { materials: 'Brass, linen shade', dimensions: 'H185 x Shade Dia 35 cm', weight: '6 kg', careInstructions: 'Wipe with dry cloth', origin: 'Italy' } },
  { name: 'Mesa Dining Table', slug: 'mesa-dining-table', price: 1890, comparePrice: 2290, category: 'dining', imageCount: 2, tags: ['featured', 'bestseller', 'sale'], room: ['dining'], style: ['minimalist'], sku: 'MES-001', inStock: true, stockQty: 3, details: { materials: 'Solid oak, smoked finish', dimensions: 'W220 x D90 x H76 cm', weight: '70 kg', careInstructions: 'Oil finish annually, wipe spills immediately', origin: 'France' } },
  { name: 'Slim Dining Chair', slug: 'slim-dining-chair', price: 490, category: 'dining', imageCount: 2, tags: [], room: ['dining'], style: ['minimalist'], sku: 'SLM-001', inStock: true, stockQty: 30, details: { materials: 'Ash wood, wool seat', dimensions: 'W46 x D48 x H78 cm', weight: '5 kg', careInstructions: 'Vacuum seat regularly', origin: 'Sweden' } },
  { name: 'Vent Terrarium', slug: 'vent-terrarium', price: 180, category: 'home-decor', imageCount: 2, tags: ['featured', 'new'], room: ['living-room', 'bedroom'], style: ['scandinavian'], sku: 'VEN-001', inStock: true, stockQty: 25, details: { materials: 'Glass, oak stand', dimensions: 'Dia 25 cm x H35 cm', weight: '1.5 kg', careInstructions: 'Wipe glass with damp cloth', origin: 'Denmark' } },
  { name: 'Pivot Outdoor Chair', slug: 'pivot-outdoor-chair', price: 675, category: 'outdoor', imageCount: 2, tags: [], room: ['outdoor'], style: ['minimalist'], sku: 'PIV-001', inStock: true, stockQty: 10, details: { materials: 'Powder-coated aluminium, teak armrests', dimensions: 'W68 x D72 x H85 cm', weight: '9 kg', careInstructions: 'Rinse with water, store in winter', origin: 'Germany' } },
  { name: 'Loom Woven Rug', slug: 'loom-woven-rug', price: 790, comparePrice: 990, category: 'home-decor', imageCount: 2, tags: ['featured', 'sale'], room: ['living-room', 'bedroom'], style: ['scandinavian'], sku: 'LOM-001', inStock: true, stockQty: 8, details: { materials: 'New Zealand wool', dimensions: '200 x 300 cm', weight: '12 kg', careInstructions: 'Vacuum regularly, professional cleaning', origin: 'India' } },
]

const collectionData = [
  { title: 'The Lounge Edit', slug: 'lounge-edit', tagline: 'Unwind in style', desc: 'Our handpicked selection of sofas, lounge chairs, and coffee tables designed for effortless comfort and timeless appeal.', featured: true, productSlugs: ['eve-armchair', 'swell-sofa', 'nova-coffee-table'] },
  { title: 'Nordic Nights', slug: 'nordic-nights', tagline: 'Scandinavian warmth', desc: 'Embrace the hygge lifestyle with our Nordic-inspired bedroom collection.', featured: false, productSlugs: ['dune-bed-frame', 'twill-nightstand', 'arc-floor-lamp', 'loom-woven-rug'] },
  { title: 'Outdoor Oasis', slug: 'outdoor-oasis', tagline: 'Al fresco living', desc: 'Transform your outdoor space with our durable and stylish furniture.', featured: false, productSlugs: ['pivot-outdoor-chair', 'nova-coffee-table'] },
]

const lookbookData: Array<{ title: string; slug: string; date: string; paragraphs: string[] }> = [
  { title: 'Why fewer, better pieces still matter', slug: 'fewer-better-pieces', date: '2025-07-08', paragraphs: ['Minimalism is not about owning nothing — it is about making room for what matters. In an age of mass production, choosing fewer, meticulously crafted pieces is both an aesthetic and an ethical decision.', 'Our philosophy centres on durability over disposability. Every chair, table, and lamp in our collection is designed to be kept — not replaced. This approach not only reduces waste but creates homes that feel grounded and intentional.', 'We spoke with designer Erik Andersen about the beauty of restraint: "When you place one exceptional object in a room, it breathes. Fill it with mediocrities and it suffocates."'] },
  { title: 'Corners, curves, and the geometry of calm', slug: 'geometry-of-calm', date: '2025-06-15', paragraphs: ['There is a quiet revolution happening in furniture design — an embrace of the curve. After years of sharp, angular minimalism, designers are rediscovering the psychological comfort of rounded forms.', 'Curved sofas invite conversation. Circular tables encourage gathering. Arched mirrors soften light. These aren\'t mere stylistic choices — they shape how we inhabit a room.', 'The science backs it up. Studies show that curved forms activate the brain\'s reward centres more readily than sharp angles. In essence, we are hardwired to find comfort in curves.'] },
  { title: 'Soft light, hard edges', slug: 'soft-light-hard-edges', date: '2025-05-09', paragraphs: ['Lighting is the single most transformative element in interior design. A well-placed lamp can alter the mood, perceived size, and even the function of a room.', 'This season, we are drawn to the contrast between soft, diffused light and furniture with clean, defined lines. The interplay creates visual tension without chaos.', 'Our lighting editor recommends layering: pendants for ambient light, floor lamps for task lighting, and table lamps for accent. The result is a space that feels both dynamic and serene.'] },
  { title: 'Wabi-sabi and the beauty of imperfection', slug: 'wabi-sabi-imperfection', date: '2025-04-22', paragraphs: ['Wabi-sabi, the ancient Japanese philosophy of finding beauty in imperfection, has never been more relevant. In a world of sterile perfection, the cracked, the weathered, and the handmade carry an authenticity that mass production cannot replicate.', 'Our oak tables are left with natural grain variations. Our wool rugs are hand-knotted with subtle irregularities. These are not flaws — they are signatures of the maker\'s hand.', 'To embrace wabi-sabi is to furnish your home with patience. It means choosing pieces that will develop a patina over time, growing more beautiful as they age.'] },
  { title: 'Bringing the outdoors in', slug: 'bringing-outdoors-in', date: '2025-03-14', paragraphs: ['Biophilic design — the practice of connecting interior spaces with nature — is more than a trend. It responds to our innate need for contact with the natural world.', 'Large windows, indoor plants, and natural materials like wood, stone, and wool are obvious starting points. But furniture placement matters too: arranging seating to face a garden view, or positioning a reading chair by a window.', 'Our outdoor collection blurs the line further. Pieces designed for the patio can work just as beautifully indoors, creating a seamless flow between inside and out.'] },
  { title: 'The art of the gallery wall', slug: 'art-of-gallery-wall', date: '2025-02-08', paragraphs: ['A gallery wall is more than a collection of frames — it is a personal narrative. Whether you hang family photographs, art prints, or textiles, the arrangement tells a story about who lives there.', 'Start with a focal piece — something bold that anchors the composition. Build outward with complementary pieces, varying frame sizes and orientations. Leave consistent spacing for a cohesive look.', 'Our tip: lay everything out on the floor first. Photograph it, then transfer the arrangement to the wall. This saves unnecessary nail holes and lets you experiment freely.'] },
]

const siteSettingsData = {
  siteName: 'Furnistør',
  announcementBar: 'Free shipping on orders above 150€',
  announcementActive: true,
  footerText: 'Rooted in Scandinavian simplicity. Designed to last. Delivered to your door.',
  homepageHero: { headline: 'Crafted simplicity from Copenhagen', subheadline: 'Modern living, timeless design', ctaText: 'Explore Now', ctaLink: '/shop' },
}

const navigationData = {
  mainMenu: [
    { label: 'Home', link: '/' },
    { label: 'Products', link: '/shop', children: [{ label: 'Living Room', link: '/shop?room=living-room' }, { label: 'Bedroom', link: '/shop?room=bedroom' }, { label: 'Dining', link: '/shop?room=dining' }, { label: 'Lighting', link: '/shop?room=lighting' }, { label: 'Home Decor', link: '/shop?style=home-decor' }, { label: 'Outdoor', link: '/shop?room=outdoor' }] },
    { label: 'Collections', link: '/collections', children: collectionData.map((c) => ({ label: c.title, link: `/collections/${c.slug}` })) },
    { label: 'Journal', link: '/lookbook' },
    { label: 'About', link: '/about' },
    { label: 'Contact', link: '/contact' },
  ],
}

type SeedRichText = {
  root: {
    type: string
    format: ''
    indent: number
    version: number
    children: Array<{
      type: string
      format: ''
      indent: number
      version: number
      children: Array<{
        type: string
        format: number
        mode: string
        detail: number
        style: string
        text: string
        version: number
      }>
      direction: 'ltr'
      textStyle: string
      textFormat: number
    }>
    direction: 'ltr'
  }
}

function lexicalRichText(text: string): SeedRichText {
  return {
    root: {
      type: 'root',
      format: '',
      indent: 0,
      version: 1,
      children: [{
        type: 'paragraph', format: '', indent: 0, version: 1,
        children: [{ type: 'text', format: 0, mode: 'normal', detail: 0, style: '', text, version: 1 }],
        direction: 'ltr', textStyle: '', textFormat: 0,
      }],
      direction: 'ltr',
    },
  }
}

async function downloadImage(url: string): Promise<Buffer> {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Failed to download ${url}: ${res.status} ${res.statusText}`)
  const contentType = res.headers.get('content-type') || ''
  if (!contentType.startsWith('image/')) throw new Error(`Unexpected content-type: ${contentType} for ${url}`)
  const arrayBuffer = await res.arrayBuffer()
  return Buffer.from(arrayBuffer)
}

async function createMedia(payload: Payload, alt: string, slug: string, filename: string): Promise<string> {
  const pexelsId = pexelsMap[slug]
  if (!pexelsId) throw new Error(`No Pexels ID mapped for slug: ${slug}`)

  const url = pexelsUrl(pexelsId)
  const buffer = await downloadImage(url)

  return String((await payload.create({
    collection: 'media',
    data: { alt },
    file: { data: buffer, mimetype: 'image/jpeg', name: filename, size: buffer.length },
  })).id)
}

async function seed() {
  const payload = await getPayload({ config })

  const existingCategories = await payload.find({ collection: 'categories', limit: 1 })
  if (existingCategories.totalDocs > 0) {
    console.log('Data already seeded — skipping.')
    return
  }

  console.log('Downloading images from Pexels...')
  const mediaCache: Record<string, string> = {}

  async function getMedia(alt: string, slug: string, filename: string): Promise<string> {
    if (!mediaCache[slug]) {
      mediaCache[slug] = await createMedia(payload, alt, slug, filename)
      console.log(`  Created media: ${alt}`)
    }
    return mediaCache[slug]
  }

  const productMap: Record<string, string> = {}
  const categoryMap: Record<string, string> = {}

  console.log('Creating categories...')
  for (const cat of categoryData) {
    const imageId = await getMedia(cat.name, `cat-${cat.slug}`, `${cat.slug}.jpg`)
    const created = await payload.create({
      collection: 'categories',
      data: {
        name: cat.name,
        slug: cat.slug,
        description: cat.desc,
        image: imageId,
        featuredOnHome: true,
        order: categoryData.indexOf(cat),
      },
    })
    categoryMap[cat.slug] = String(created.id)
    console.log(`  Created category: ${cat.name}`)
  }

  console.log('Creating products...')
  for (const prod of productData) {
    const images: string[] = []
    for (let i = 0; i < prod.imageCount; i++) {
      images.push(await getMedia(`${prod.name} ${i + 1}`, `prod-${prod.slug}-${i + 1}`, `${prod.slug}-${i + 1}.jpg`))
    }
    const created = await payload.create({
      collection: 'products',
      data: {
        name: prod.name,
        slug: prod.slug,
        description: lexicalRichText(`${prod.name} — ${prod.details.materials}. ${prod.details.dimensions}.`),
        price: prod.price,
        comparePrice: prod.comparePrice,
        sku: prod.sku,
        inStock: prod.inStock,
        stockQty: prod.stockQty,
        images: images.map((id) => ({ image: id })),
        category: categoryMap[prod.category],
        tags: prod.tags,
        room: prod.room,
        style: prod.style,
        details: prod.details,
      },
    })
    productMap[prod.slug] = String(created.id)
    console.log(`  Created product: ${prod.name}`)
  }

  console.log('Creating collections...')
  for (const col of collectionData) {
    const heroImageId = await getMedia(col.title, `col-${col.slug}`, `${col.slug}.jpg`)
    const productIds = col.productSlugs.map((slug) => productMap[slug]).filter(Boolean)
    await payload.create({
      collection: 'collections',
      data: {
        title: col.title,
        slug: col.slug,
        tagline: col.tagline,
        description: lexicalRichText(col.desc),
        heroImage: heroImageId,
        products: productIds,
        featured: col.featured,
      },
    })
    console.log(`  Created collection: ${col.title}`)
  }

  console.log('Creating lookbook entries...')
  for (const entry of lookbookData) {
    const coverId = await getMedia(entry.title, `lb-${entry.slug}`, `${entry.slug}.jpg`)
    const blocks = entry.paragraphs.map((text) => ({ blockType: 'textBlock' as const, content: lexicalRichText(text) }))
    await payload.create({
      collection: 'lookbook',
      data: {
        title: entry.title,
        slug: entry.slug,
        coverImage: coverId,
        date: entry.date,
        content: blocks,
      },
    })
    console.log(`  Created lookbook: ${entry.title}`)
  }

  console.log('Updating SiteSettings...')
  const heroBgId = await getMedia('Hero background', 'hero-bg', 'hero-bg.jpg')
  await payload.updateGlobal({
    slug: 'site-settings',
    data: {
      ...siteSettingsData,
      homepageHero: { ...siteSettingsData.homepageHero, backgroundImage: heroBgId },
    },
  })

  console.log('Updating Navigation...')
  await payload.updateGlobal({
    slug: 'navigation',
    data: navigationData,
  })

  console.log('Seed complete.')
}

seed()
  .catch((err) => {
    console.error('Seed failed:', JSON.stringify(err, null, 2))
    process.exit(1)
  })
