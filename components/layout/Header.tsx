'use client'

import { useState, useSyncExternalStore } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useCart } from '@/store/cart'

type HeaderProps = {
  announcementActive?: boolean | null
  announcementBar?: string | null
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

export default function Header({ announcementActive, announcementBar, navLinks = [], siteName }: HeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [activeMenu, setActiveMenu] = useState<string | null>(null)
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  )
  const pathname = usePathname()
  const links = navLinks || []
  const cartCount = useCart((state) => state.items.reduce((sum, item) => sum + item.quantity, 0))

  return (
    <header className="relative z-50">
      {announcementActive && announcementBar && (
        <div className="bg-accent text-background text-center text-xs py-2 font-label tracking-widest uppercase">
          {announcementBar}
        </div>
      )}

      <div className="border-b border-border bg-background">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <button
            className="md:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
            aria-controls="mobile-navigation"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M3 6h18M3 12h18M3 18h18" />
            </svg>
          </button>

          <Link href="/" className="font-display text-2xl tracking-tight">
            {siteName || 'Furniture Studio'}
          </Link>

          <nav className="hidden md:flex items-center gap-8 font-label text-xs tracking-widest uppercase">
            {links.map((link) => {
              const href = link.link || '/'
              const children = link.children?.filter((child) => child.label && child.link) || []

              return (
              <div
                key={link.label}
                className="relative group"
                onMouseEnter={() => setActiveMenu(children.length > 0 ? link.label || null : null)}
                onMouseLeave={() => setActiveMenu(null)}
              >
                <Link
                  href={href}
                  className={`hover:text-accent transition-colors ${pathname === href ? 'text-accent' : ''}`}
                >
                  {link.label}
                </Link>
                {children.length > 0 && activeMenu === link.label && (
                  <div className="absolute top-full left-0 bg-white border border-border shadow-lg p-8 min-w-[400px] grid grid-cols-2 gap-6">
                    {children.map((child) => (
                      <Link key={child.label} href={child.link || '/'} className="text-sm hover:text-accent transition-colors">
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
              )
            })}
          </nav>

          <div className="flex items-center gap-4">
            <Link href="/account" aria-label="Account" className="hover:text-accent transition-colors">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </Link>
            <Link href="/cart" aria-label="Cart" className="hover:text-accent transition-colors relative">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 0 1-8 0" />
              </svg>
              <span className="absolute -top-2 -right-2 bg-foreground text-background text-[10px] rounded-full w-4 h-4 flex items-center justify-center font-label">
                {mounted ? cartCount : 0}
              </span>
            </Link>
          </div>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden absolute inset-x-0 top-full bg-background border-b border-border px-6 py-4">
          <nav id="mobile-navigation" className="flex flex-col gap-4 font-label text-sm tracking-widest uppercase">
            {links.map((link) => (
              <Link
                key={link.label}
                href={link.link || '/'}
                className="hover:text-accent transition-colors"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  )
}
