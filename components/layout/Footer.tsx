import Link from 'next/link'

type FooterProps = {
  footerText?: string | null
  navLinks?: Array<{
    label?: string | null
    link?: string | null
    children?: Array<{
      label?: string | null
      link?: string | null
    }> | null
  }> | null
  siteName?: string | null
}

export default function Footer({ footerText, navLinks = [], siteName }: FooterProps) {
  const links = navLinks || []
  const footerLinks = links.filter((link) => link.label && link.link)
  const productLinks = links.flatMap((link) => link.children || []).filter((link) => link.label && link.link)

  return (
    <footer className="bg-foreground text-background mt-24">
      <div className="border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between text-sm">
          <span className="text-muted">{footerText || 'Premium furniture for modern living.'}</span>
          <span className="text-muted text-xs">{siteName || 'Furniture Studio'}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-3 gap-10">
        <div>
          <h4 className="font-label text-xs tracking-widest uppercase text-muted mb-4">Navigation</h4>
          <ul className="space-y-2">
            {footerLinks.map((item) => (
              <li key={item.label}>
                <Link href={item.link || '/'} className="text-sm hover:text-accent transition-colors">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="font-label text-xs tracking-widest uppercase text-muted mb-4">Products</h4>
          <ul className="space-y-2">
            {productLinks.map((item) => (
              <li key={item.label}>
                <Link href={item.link || '/'} className="text-sm hover:text-accent transition-colors">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="font-label text-xs tracking-widest uppercase text-muted mb-4">Stay Connected</h4>
          <p className="text-sm text-muted mb-4">
            Get exclusive updates, design tips, and previews of our newest collections.
          </p>
          <div className="flex gap-2">
            <input
              type="email"
              aria-label="Email address for newsletter"
              placeholder="Your email"
              className="flex-1 bg-white/10 border border-white/20 px-3 py-2 text-sm placeholder:text-muted focus:outline-none focus:border-accent"
            />
            <button type="button" className="bg-accent text-background px-4 py-2 text-sm font-label tracking-wider hover:bg-accent/90 transition-colors">
              Subscribe
            </button>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-2 text-xs text-muted">
          <span>{footerText || 'Designed to last. Delivered to your door.'}</span>
          <span>© 2026 {siteName || 'Furniture Studio'}</span>
        </div>
      </div>
    </footer>
  )
}
