import type { Metadata } from 'next'
import { Cormorant_Garamond, Inter, Montserrat } from 'next/font/google'
import { getPayload } from 'payload'
import '@/app/globals.css'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import config from '@/payload.config'

const display = Cormorant_Garamond({
  variable: '--font-display',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
})

const body = Inter({
  variable: '--font-body',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
})

const label = Montserrat({
  variable: '--font-label',
  subsets: ['latin'],
  weight: ['400', '500', '600'],
})

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: {
    default: 'Furniture Studio',
    template: '%s | Furniture Studio',
  },
  description: 'Premium furniture, curated collections, and design-led pieces for modern living.',
  openGraph: {
    title: 'Furniture Studio',
    description: 'Premium furniture, curated collections, and design-led pieces for modern living.',
    siteName: 'Furniture Studio',
    type: 'website',
  },
}

export default async function FrontendLayout({ children }: { children: React.ReactNode }) {
  const payload = await getPayload({ config })
  const [settings, navigation] = await Promise.all([
    payload.findGlobal({ slug: 'site-settings', depth: 1 }),
    payload.findGlobal({ slug: 'navigation', depth: 1 }),
  ])

  return (
    <html lang="en" className={`${display.variable} ${body.variable} ${label.variable} scroll-smooth`}>
      <body>
        <a href="#main-content" className="skip-link">
          Skip to content
        </a>
        <div className="min-h-screen antialiased flex flex-col bg-background text-foreground font-body">
          <Header
            announcementActive={settings.announcementActive}
            announcementBar={settings.announcementBar}
            navLinks={navigation.mainMenu}
            siteName={settings.siteName}
          />
          <main id="main-content" className="flex-1" tabIndex={-1}>{children}</main>
          <Footer footerText={settings.footerText} navLinks={navigation.mainMenu} siteName={settings.siteName} />
        </div>
      </body>
    </html>
  )
}
