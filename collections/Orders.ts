import type { CollectionConfig } from 'payload'

export const Orders: CollectionConfig = {
  slug: 'orders',
  admin: {
    useAsTitle: 'orderNumber',
    group: 'Commerce',
  },
  access: {
    read: ({ req }) => req.user?.role === 'admin',
  },
  fields: [
    { name: 'orderNumber', type: 'text' },
    { name: 'stripePaymentIntentId', type: 'text' },
    {
      name: 'status',
      type: 'select',
      options: ['pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled'],
      defaultValue: 'pending',
    },
    {
      name: 'items',
      type: 'array',
      fields: [
        { name: 'product', type: 'relationship', relationTo: 'products' },
        { name: 'quantity', type: 'number' },
        { name: 'price', type: 'number' },
        { name: 'variant', type: 'text' },
      ],
    },
    { name: 'subtotal', type: 'number' },
    { name: 'shipping', type: 'number' },
    { name: 'total', type: 'number' },
    {
      name: 'shippingAddress',
      type: 'group',
      fields: [
        { name: 'name', type: 'text' },
        { name: 'email', type: 'email' },
        { name: 'address', type: 'text' },
        { name: 'city', type: 'text' },
        { name: 'country', type: 'text' },
        { name: 'postalCode', type: 'text' },
      ],
    },
  ],
}
