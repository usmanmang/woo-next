import type { GlobalConfig } from 'payload'

export const Navigation: GlobalConfig = {
  slug: 'navigation',
  admin: {
    group: 'Settings',
  },
  fields: [
    {
      name: 'mainMenu',
      type: 'array',
      fields: [
        { name: 'label', type: 'text', required: true },
        { name: 'link', type: 'text' },
        {
          name: 'children',
          type: 'array',
          fields: [
            { name: 'label', type: 'text' },
            { name: 'link', type: 'text' },
          ],
        },
      ],
    },
  ],
}
