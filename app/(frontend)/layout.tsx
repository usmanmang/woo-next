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
  title: 'Furniture Studio',
  description: 'Premium furniture for modern living',
}

export const revalidate = 60

export default async function FrontendLayout({ children }: { children: React.ReactNode }) {
  const payload = await getPayload({ config })
  const [settings, navigation] = await Promise.all([
    payload.findGlobal({ slug: 'site-settings', depth: 1 }),
    payload.findGlobal({ slug: 'navigation', depth: 1 }),
  ])

  return (
    <html lang="en" className={`${display.variable} ${body.variable} ${label.variable} scroll-smooth`}>
      <body>
        <div className="min-h-screen antialiased flex flex-col bg-background text-foreground font-body">
          <Header
            announcementActive={settings.announcementActive}
            announcementBar={settings.announcementBar}
            navLinks={navigation.mainMenu}
            siteName={settings.siteName}
          />
          <main className="flex-1">{children}</main>
          <Footer footerText={settings.footerText} navLinks={navigation.mainMenu} siteName={settings.siteName} />
        </div>
      </body>
    </html>
  )
}
