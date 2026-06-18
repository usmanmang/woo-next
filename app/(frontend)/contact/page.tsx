import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Contact Furniture Studio for product questions, delivery support, or interior design advice.',
}

export default function ContactPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <h1 className="font-display text-display-lg mb-6">Contact</h1>
      <p className="text-muted leading-relaxed mb-8">
        Have a question about a product, delivery, or need design advice? We would love to hear from you.
      </p>
      <div className="space-y-4 text-sm">
        <p><span className="font-label text-foreground">Email:</span> hello@furnistor.com</p>
        <p><span className="font-label text-foreground">Phone:</span> +45 71 23 45 67</p>
        <p><span className="font-label text-foreground">Studio:</span> Vesterbrogade 72, 1620 København V, Denmark</p>
        <p className="text-muted text-xs mt-8">Studio visits by appointment only.</p>
      </div>
    </div>
  )
}
