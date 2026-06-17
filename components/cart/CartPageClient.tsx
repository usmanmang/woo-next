'use client'

import Link from 'next/link'
import { useSyncExternalStore } from 'react'
import { useCart } from '@/store/cart'

function formatPrice(value: number) {
  return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' })
}

export default function CartPageClient() {
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  )
  const items = useCart((state) => state.items)
  const removeItem = useCart((state) => state.removeItem)
  const updateQty = useCart((state) => state.updateQty)
  const clearCart = useCart((state) => state.clearCart)
  const subtotal = useCart((state) => state.total())

  if (!mounted) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-16 text-center">
        <h1 className="font-display text-display-lg mb-4">Cart</h1>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-16 text-center">
        <h1 className="font-display text-display-lg mb-4">Cart</h1>
        <p className="text-muted mb-8">Your cart is currently empty.</p>
        <Link
          href="/shop"
          className="inline-block bg-foreground px-8 py-4 font-label text-xs tracking-[0.2em] text-background uppercase transition-colors hover:bg-accent"
        >
          Continue Shopping
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-16">
      <div className="mb-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h1 className="font-display text-display-lg mb-2">Cart</h1>
          <p className="font-label text-xs tracking-widest text-muted uppercase">
            {items.length} {items.length === 1 ? 'item' : 'items'}
          </p>
        </div>
        <button
          type="button"
          onClick={clearCart}
          className="self-start font-label text-xs tracking-[0.2em] text-muted uppercase hover:text-foreground"
        >
          Clear Cart
        </button>
      </div>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_360px]">
        <div className="divide-y divide-border border-y border-border">
          {items.map((item) => (
            <div key={item.id} className="grid grid-cols-[96px_1fr] gap-5 py-6 sm:grid-cols-[128px_1fr_auto]">
              <div className="aspect-square overflow-hidden bg-sand">
                {item.image && (
                  <div className="h-full w-full bg-cover bg-center" style={{ backgroundImage: `url(${item.image})` }} />
                )}
              </div>
              <div>
                <h2 className="font-display text-2xl">{item.name}</h2>
                {item.variant && <p className="mt-1 text-sm text-muted">{item.variant}</p>}
                <p className="mt-3 font-label text-sm tracking-wider">{formatPrice(item.price)}</p>

                <div className="mt-5 flex items-center gap-4">
                  <label className="flex items-center border border-border">
                    <span className="sr-only">Quantity</span>
                    <button
                      type="button"
                      onClick={() => updateQty(item.id, item.quantity - 1)}
                      className="px-3 py-2 hover:text-accent"
                      aria-label="Decrease quantity"
                    >
                      -
                    </button>
                    <span className="min-w-8 text-center font-label text-sm">{item.quantity}</span>
                    <button
                      type="button"
                      onClick={() => updateQty(item.id, item.quantity + 1)}
                      className="px-3 py-2 hover:text-accent"
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </label>
                  <button
                    type="button"
                    onClick={() => removeItem(item.id)}
                    className="font-label text-[11px] tracking-[0.2em] text-muted uppercase hover:text-foreground"
                  >
                    Remove
                  </button>
                </div>
              </div>
              <p className="font-label text-sm tracking-wider sm:text-right">
                {formatPrice(item.price * item.quantity)}
              </p>
            </div>
          ))}
        </div>

        <aside className="h-fit border border-border bg-sand/30 p-6">
          <h2 className="font-display text-3xl mb-6">Summary</h2>
          <div className="space-y-4 border-b border-border pb-6 text-sm">
            <div className="flex justify-between">
              <span className="text-muted">Subtotal</span>
              <span className="font-label tracking-wider">{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted">Shipping</span>
              <span>Calculated at checkout</span>
            </div>
          </div>
          <div className="flex justify-between py-6 font-label tracking-wider">
            <span>Total</span>
            <span>{formatPrice(subtotal)}</span>
          </div>
          <Link
            href="/checkout"
            className="block w-full bg-foreground px-8 py-4 text-center font-label text-xs tracking-[0.2em] text-background uppercase transition-colors hover:bg-accent"
          >
            Checkout
          </Link>
          <Link href="/shop" className="mt-4 block text-center font-label text-xs tracking-[0.2em] text-muted uppercase hover:text-foreground">
            Continue Shopping
          </Link>
        </aside>
      </div>
    </div>
  )
}
