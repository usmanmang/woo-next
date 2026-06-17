import type { GlobalConfig } from 'payload'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  admin: {
    group: 'Settings',
  },
  fields: [
    { name: 'siteName', type: 'text' },
    { name: 'logo', type: 'upload', relationTo: 'media' },
    { name: 'announcementBar', type: 'text' },
    { name: 'announcementActive', type: 'checkbox' },
    { name: 'instagram', type: 'text' },
    { name: 'pinterest', type: 'text' },
    { name: 'footerText', type: 'textarea' },
    {
      name: 'homepageHero',
      type: 'group',
      fields: [
        { name: 'headline', type: 'text' },
        { name: 'subheadline', type: 'text' },
        { name: 'ctaText', type: 'text' },
        { name: 'ctaLink', type: 'text' },
        { name: 'backgroundImage', type: 'upload', relationTo: 'media' },
      ],
    },
  ],
}
