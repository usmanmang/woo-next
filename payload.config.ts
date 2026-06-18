import { buildConfig } from 'payload'
import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { seoPlugin } from '@payloadcms/plugin-seo'
import path from 'path'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Products } from './collections/Products'
import { Categories } from './collections/Categories'
import { Collections } from './collections/Collections'
import { Lookbook } from './collections/Lookbook'
import { Orders } from './collections/Orders'
import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { SiteSettings } from './globals/SiteSettings'
import { Navigation } from './globals/Navigation'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)
const mongoURL = process.env.MONGODB_URI || 'mongodb://localhost/furniture-db'
const cloudinaryConfig = {
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
}
const hasCloudinaryConfig = Boolean(cloudinaryConfig.cloud_name && cloudinaryConfig.api_key && cloudinaryConfig.api_secret)

export default (async () => {
  const cloudinaryPlugin = hasCloudinaryConfig
    ? (await import('payload-storage-cloudinary')).cloudinaryStorage({
        cloudConfig: cloudinaryConfig,
        collections: {
          media: {
            folder: 'furniture-studio/media',
            transformations: {
              default: {
                quality: 'auto',
                fetch_format: 'auto',
              },
              preserveOriginal: true,
            },
            resourceType: 'auto',
            deleteFromCloudinary: true,
          },
        },
      })
    : null

  return buildConfig({
    sharp,
    serverURL: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
    admin: {
      user: Users.slug,
      meta: {
        title: 'Furniture Admin',
        description: 'Admin panel for the furniture store',
      },
    },
    collections: [Products, Categories, Collections, Lookbook, Orders, Users, Media],
    globals: [SiteSettings, Navigation],
    editor: lexicalEditor(),
    db: mongooseAdapter({
      url: mongoURL,
    }),
    secret: process.env.PAYLOAD_SECRET!,
    typescript: {
      outputFile: path.resolve(dirname, 'types/payload-types.ts'),
    },
    plugins: [
      ...(cloudinaryPlugin ? [cloudinaryPlugin] : []),
      seoPlugin({
        collections: ['products', 'categories', 'collections'],
        uploadsCollection: 'media',
      }),
    ],
  })
})()
