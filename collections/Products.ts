import type { CollectionConfig } from 'payload'

export const Products: CollectionConfig = {
  slug: 'products',
  admin: {
    useAsTitle: 'name',
    group: 'Products',
  },
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'slug', type: 'text', required: true, unique: true },
    { name: 'description', type: 'richText' },
    { name: 'price', type: 'number', required: true },
    { name: 'comparePrice', type: 'number' },
    { name: 'sku', type: 'text' },
    { name: 'inStock', type: 'checkbox', defaultValue: true },
    { name: 'stockQty', type: 'number' },
    {
      name: 'images',
      type: 'array',
      fields: [{ name: 'image', type: 'upload', relationTo: 'media' }],
    },
    { name: 'category', type: 'relationship', relationTo: 'categories' },
    {
      name: 'tags',
      type: 'select',
      hasMany: true,
      options: ['new', 'bestseller', 'sale', 'featured'],
    },
    {
      name: 'room',
      type: 'select',
      hasMany: true,
      options: ['living-room', 'bedroom', 'dining', 'office', 'outdoor'],
    },
    {
      name: 'style',
      type: 'select',
      hasMany: true,
      options: ['minimalist', 'scandinavian', 'industrial', 'japandi', 'mid-century'],
    },
    {
      name: 'details',
      type: 'group',
      fields: [
        { name: 'materials', type: 'textarea' },
        { name: 'dimensions', type: 'textarea' },
        { name: 'weight', type: 'text' },
        { name: 'careInstructions', type: 'textarea' },
        { name: 'origin', type: 'text' },
      ],
    },
    {
      name: 'variants',
      type: 'array',
      fields: [
        { name: 'name', type: 'text' },
        { name: 'value', type: 'text' },
        { name: 'priceModifier', type: 'number' },
        { name: 'sku', type: 'text' },
        { name: 'inStock', type: 'checkbox' },
      ],
    },
    { name: 'seoTitle', type: 'text' },
    { name: 'seoDescription', type: 'textarea' },
  ],
}
