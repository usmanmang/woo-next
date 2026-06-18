# Headless Furniture eCommerce — Payload CMS 3.0 + Next.js 16

Single Vercel deployment — Payload CMS runs inside Next.js App Router.

Design reference: https://sites.kaliumtheme.com/elementor/furniture/

## Key architecture

- Payload CMS runs embedded in Next.js (no separate server). Admin at `/admin`, REST at `/api/[...slug]`.
- All server-side data fetching uses Payload **Local API** — import `getPayload` with `@/payload.config`. No HTTP overhead.
- Cart state: Zustand store persisted to `localStorage` (client-only).
- Payments: Manual/offline checkout methods create pending Orders in Payload. Supported methods: COD, bank transfer, JazzCash, EasyPaisa.
- Types auto-generated: `npm run generate:types` → `types/payload-types.ts`.
- Admin page pattern: `app/(payload)/layout.tsx` wraps with `RootLayout` from `@payloadcms/next/layouts`; `app/(payload)/admin/[[...segments]]/page.tsx` renders `RootPage` from `@payloadcms/next/views`.
- API route handler at `app/api/[...slug]/route.ts` — route param name must be `slug` (Payload expects this, not `payload`).

## Folder structure (created)

```
app/(frontend)/       → Public site pages (homepage with dynamic sections)
app/(payload)/        → Admin panel (layout + admin page)
app/api/              → Payload REST handler at [...slug]/route.ts
collections/          → Products, Categories, Collections, Lookbook, Orders, Users, Media
globals/              → SiteSettings, Navigation
components/           → layout/ (Header, Footer), sections/ (Hero, CategoryGrid, FeaturedProducts, CollectionBanner, LookbookTeaser, Newsletter)
scripts/              → seed.ts (dummy content seeder)
lib/                  → payload.ts, media.ts, utils.ts
store/                → Zustand cart store
```

## Design tokens (defined in `app/globals.css` — Tailwind v4 `@theme inline`)

- Colors: `background #F7F5F0`, `foreground #1C1C1A`, `accent #C4A882`, `sand #E8DFD0`, `muted #9A9890`, `border #E2DDD6`
- Fonts: `display` (Cormorant Garamond), `body` (Inter), `label` (Montserrat)
- Display sizes: `display-2xl`, `display-xl`, `display-lg` — clamp-based, responsive

## Commands

| Command | Purpose |
|---|---|
| `npm run dev` | Local dev (frontend + admin on :3000) |
| `npm run generate:types` | Regenerate `types/payload-types.ts` from collections |
| `npm run build` | Type-check + production build |
| `npm run seed` | Seed dummy content (categories, products, collections, lookbook, globals) |
| `vercel --prod` | Deploy to production |

## Seed data

Runs via `npx tsx --env-file=.env.local scripts/seed.ts`. Creates 44 media entries (sharp-generated SVGs), 6 categories, 14 products, 3 collections, 6 lookbook posts, plus SiteSettings and Navigation globals. Idempotent — skips if categories exist.

## Known quirks

- **Multi-lockfile warning**: Set `turbopack: { root: process.cwd() }` in `next.config.ts` to silence the lockfile detection warning if it appears.
- **Tailwind v4**: Theme tokens go in `@theme inline` blocks inside `app/globals.css`, NOT in a standalone `tailwind.config.ts`. No `tailwind.config.ts` file exists.
- **Sharp**: Must be in `dependencies` (not devDependencies) for production image optimization on Vercel.

## Data fetching cache

| Page | Cache |
|---|---|
| Homepage | `revalidate: 3600` |
| Shop listing | `revalidate: 600` |
| Single product | `revalidate: 300` |
| Checkout | `no-store` (server action) |

## Data fetching pattern

```typescript
import { getPayload } from 'payload'
import config from '@/payload.config'

const payload = await getPayload({ config })

const products = await payload.find({
  collection: 'products',
  where: { inStock: { equals: true } },
  limit: 8,
  sort: '-createdAt',
  depth: 1, // populate relationships/images
})

const siteSettings = await payload.findGlobal({ slug: 'site-settings', depth: 1 })
```

Use `depth: 1` to populate upload relationships (media URLs, etc.). Without depth, relationships return only IDs.

## Cart & checkout flow

```
Add item → Zustand store → persisted to localStorage
Checkout → Server Action validates items → creates pending Order in Payload
         → customer receives COD/bank/JazzCash/EasyPaisa instructions
         → admin verifies payment and processes order
```

## Environment variables required

`NEXT_PUBLIC_SITE_URL`, `PAYLOAD_SECRET`, `MONGODB_URI`, `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`, `RESEND_API_KEY`

## Collections summary

- **Products** — name, slug, description, price, comparePrice, sku, inStock, stockQty, images[], category, tags, room, style, details (group), variants[], seo fields
- **Categories** — name, slug, description, image, featuredOnHome, order
- **Collections** — title, slug, tagline, description, heroImage, products[], featured
- **Lookbook** — title, slug, coverImage, date, content (blocks: imageBlock, textBlock, productTag)
- **Orders** — orderNumber, status, paymentMethod, paymentStatus, paymentReference, customerNote, items[], subtotal, shipping, total, shippingAddress

## Development phases

1. **Foundation** — scaffold, MongoDB, Cloudinary, collections, Tailwind, fonts
2. **Layout & Homepage** — Header, Footer, Hero, CategoryGrid, FeaturedProducts, CollectionBanner, LookbookTeaser, Newsletter + dynamic data seeding
3. **Shop & Product** — listing with filters, single product, cart drawer
4. **Collections & Lookbook** — listing + detail pages
5. **Checkout & Orders** — Manual payment flow, Order creation, confirmation email
6. **Polish** — Framer Motion animations, SEO, perf, mobile QA
