import type { Metadata } from 'next'
import Link from 'next/link'
import ClearCartOnSuccess from '@/components/checkout/ClearCartOnSuccess'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Order Received',
  description: 'Your Furniture Studio order has been received and is awaiting confirmation.',
}

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams?: Promise<{ order?: string; method?: string; instructions?: string; total?: string }>
}) {
  const params = (await searchParams) || {}

  return (
    <div className="max-w-3xl mx-auto px-6 py-16 text-center">
      <ClearCartOnSuccess />
      <p className="font-label text-xs tracking-[0.2em] text-accent uppercase mb-4">Order Received</p>
      <h1 className="font-display text-display-lg mb-4">Thank you for your order</h1>
      <p className="text-muted leading-relaxed mb-8">
        Your order has been received. We will confirm availability and payment details before processing.
      </p>

      <div className="mb-8 border border-border bg-sand/30 p-6 text-left">
        {params.order && (
          <div className="mb-4 flex justify-between gap-4">
            <span className="text-muted">Order</span>
            <span className="font-label tracking-wider">{params.order}</span>
          </div>
        )}
        {params.method && (
          <div className="mb-4 flex justify-between gap-4">
            <span className="text-muted">Payment Method</span>
            <span>{params.method}</span>
          </div>
        )}
        {params.total && (
          <div className="mb-4 flex justify-between gap-4">
            <span className="text-muted">Total</span>
            <span className="font-label tracking-wider">{params.total}</span>
          </div>
        )}
        {params.instructions && <p className="border-t border-border pt-4 text-sm text-muted">{params.instructions}</p>}
      </div>

      <div className="flex flex-col justify-center gap-3 sm:flex-row">
        <Link
          href="/shop"
          className="inline-block bg-foreground px-8 py-4 font-label text-xs tracking-[0.2em] text-background uppercase transition-colors hover:bg-accent"
        >
          Continue Shopping
        </Link>
        <Link
          href="/lookbook"
          className="inline-block border border-foreground px-8 py-4 font-label text-xs tracking-[0.2em] uppercase transition-colors hover:bg-foreground hover:text-background"
        >
          Read Journal
        </Link>
      </div>
    </div>
  )
}
