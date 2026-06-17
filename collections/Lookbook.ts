import type { CollectionConfig } from 'payload'

export const Lookbook: CollectionConfig = {
  slug: 'lookbook',
  admin: {
    useAsTitle: 'title',
    group: 'Content',
  },
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'slug', type: 'text', required: true, unique: true },
    { name: 'coverImage', type: 'upload', relationTo: 'media' },
    { name: 'date', type: 'date' },
    {
      name: 'content',
      type: 'blocks',
      blocks: [
        {
          slug: 'imageBlock',
          fields: [
            { name: 'image', type: 'upload', relationTo: 'media' },
            { name: 'caption', type: 'text' },
            { name: 'fullWidth', type: 'checkbox' },
          ],
        },
        {
          slug: 'textBlock',
          fields: [{ name: 'content', type: 'richText' }],
        },
        {
          slug: 'productTag',
          fields: [{ name: 'product', type: 'relationship', relationTo: 'products' }],
        },
      ],
    },
  ],
}
