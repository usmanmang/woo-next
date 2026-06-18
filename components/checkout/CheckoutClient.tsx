'use client'

import Link from 'next/link'
import { FormEvent, useEffect, useState, useTransition } from 'react'
import { createManualOrder, type PaymentMethod } from '@/app/(frontend)/checkout/actions'
import { useCart } from '@/store/cart'

type ShippingAddress = {
  name: string
  email: string
  address: string
  city: string
  country: string
  postalCode: string
}

const paymentMethods: Array<{
  value: PaymentMethod
  label: string
  description: string
  details: string
}> = [
  {
    value: 'cod',
    label: 'Cash on Delivery',
    description: 'Pay in cash when your order arrives.',
    details: 'Best for local delivery orders. Our team will confirm delivery timing before dispatch.',
  },
  {
    value: 'bank-transfer',
    label: 'Bank Transfer',
    description: 'Place your order and transfer manually.',
    details: 'Transfer to the store bank account, then share your transfer reference with support.',
  },
  {
    value: 'jazzcash',
    label: 'JazzCash',
    description: 'Send payment through JazzCash.',
    details: 'Send the total amount to the listed JazzCash account and keep your transaction ID.',
  },
  {
    value: 'easypaisa',
    label: 'EasyPaisa',
    description: 'Send payment through EasyPaisa.',
    details: 'Send the total amount to the listed EasyPaisa account and keep your transaction ID.',
  },
]

function formatPrice(value: number) {
  return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' })
}

type PaymentAccounts = {
  bankTransferDetails: string
  jazzcashAccount: string
  easypaisaAccount: string
}

export default function CheckoutClient({
  stockByProductId,
  paymentAccounts,
}: {
  stockByProductId: Record<string, number | null>
  paymentAccounts: PaymentAccounts
}) {
  const items = useCart((state) => state.items)
  const subtotal = useCart((state) => state.total())
  const syncStock = useCart((state) => state.syncStock)
  const [address, setAddress] = useState<ShippingAddress>({
    name: '',
    email: '',
    address: '',
    city: '',
    country: 'Pakistan',
    postalCode: '',
  })
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cod')
  const [paymentReference, setPaymentReference] = useState('')
  const [customerNote, setCustomerNote] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    syncStock(stockByProductId)
  }, [stockByProductId, syncStock])

  function updateAddress(field: keyof ShippingAddress, value: string) {
    setAddress((current) => ({ ...current, [field]: value }))
  }

  function handlePlaceOrder(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)

    startTransition(async () => {
      try {
        const result = await createManualOrder({
          items: items.map((item) => ({
            id: item.id,
            productId: item.productId,
            quantity: item.quantity,
            variant: item.variant,
          })),
          shippingAddress: address,
          paymentMethod,
          paymentReference,
          customerNote,
        })

        const params = new URLSearchParams({
          order: result.orderNumber,
          method: result.paymentMethodLabel,
          instructions: result.paymentInstructions,
          total: formatPrice(result.total),
        })

        window.location.href = `/checkout/success?${params.toString()}`
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unable to place order.')
      }
    })
  }

  const shipping = subtotal >= 150 ? 0 : 15
  const total = subtotal + shipping
  const selectedPayment = paymentMethods.find((method) => method.value === paymentMethod)
  const selectedAccount = {
    'bank-transfer': paymentAccounts.bankTransferDetails,
    jazzcash: paymentAccounts.jazzcashAccount,
    easypaisa: paymentAccounts.easypaisaAccount,
    cod: '',
  }[paymentMethod]

  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-16 text-center">
        <h1 className="font-display text-display-lg mb-4">Checkout</h1>
        <p className="text-muted mb-8">Your cart is empty.</p>
        <Link
          href="/shop"
          className="inline-block bg-foreground px-8 py-4 font-label text-xs tracking-[0.2em] text-background uppercase transition-colors hover:bg-accent"
        >
          Shop Products
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-16">
      <h1 className="font-display text-display-lg mb-10">Checkout</h1>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_360px]">
        <form onSubmit={handlePlaceOrder} className="space-y-10">
          <section className="border border-border p-6">
            <h2 className="font-display text-3xl mb-6">Shipping Details</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <input className="border border-border bg-background px-4 py-3 outline-none focus:border-accent" placeholder="Full name" value={address.name} onChange={(event) => updateAddress('name', event.target.value)} />
              <input className="border border-border bg-background px-4 py-3 outline-none focus:border-accent" placeholder="Email" type="email" value={address.email} onChange={(event) => updateAddress('email', event.target.value)} />
              <input className="border border-border bg-background px-4 py-3 outline-none focus:border-accent sm:col-span-2" placeholder="Address" value={address.address} onChange={(event) => updateAddress('address', event.target.value)} />
              <input className="border border-border bg-background px-4 py-3 outline-none focus:border-accent" placeholder="City" value={address.city} onChange={(event) => updateAddress('city', event.target.value)} />
              <input className="border border-border bg-background px-4 py-3 outline-none focus:border-accent" placeholder="Country" value={address.country} onChange={(event) => updateAddress('country', event.target.value)} />
              <input className="border border-border bg-background px-4 py-3 outline-none focus:border-accent" placeholder="Postal code" value={address.postalCode} onChange={(event) => updateAddress('postalCode', event.target.value)} />
            </div>
          </section>

          <section className="border border-border p-6">
            <h2 className="font-display text-3xl mb-6">Payment Method</h2>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {paymentMethods.map((method) => (
                <label
                  key={method.value}
                  className={`cursor-pointer border p-4 transition-colors ${paymentMethod === method.value ? 'border-foreground bg-sand/40' : 'border-border hover:border-foreground'}`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value={method.value}
                    checked={paymentMethod === method.value}
                    onChange={() => setPaymentMethod(method.value)}
                    className="sr-only"
                  />
                  <span className="block font-label text-xs tracking-[0.2em] uppercase">{method.label}</span>
                  <span className="mt-2 block text-sm text-muted">{method.description}</span>
                </label>
              ))}
            </div>

            {selectedPayment && (
              <div className="mt-5 bg-sand/30 p-4 text-sm text-muted">
                <p>{selectedPayment.details}</p>
                {paymentMethod !== 'cod' && selectedAccount && <p className="mt-2 font-label tracking-wide text-foreground">{selectedAccount}</p>}
                {paymentMethod !== 'cod' && !selectedAccount && <p className="mt-2">Payment account details will be shared by support after order placement.</p>}
              </div>
            )}

            {paymentMethod !== 'cod' && (
              <input
                className="mt-4 w-full border border-border bg-background px-4 py-3 outline-none focus:border-accent"
                placeholder="Transaction/reference ID (optional)"
                value={paymentReference}
                onChange={(event) => setPaymentReference(event.target.value)}
              />
            )}

            <textarea
              className="mt-4 min-h-28 w-full border border-border bg-background px-4 py-3 outline-none focus:border-accent"
              placeholder="Order notes (optional)"
              value={customerNote}
              onChange={(event) => setCustomerNote(event.target.value)}
            />
          </section>

          {error && <p className="text-sm text-red-700">{error}</p>}
          <button
            type="submit"
            disabled={isPending}
            className="bg-foreground px-8 py-4 font-label text-xs tracking-[0.2em] text-background uppercase transition-colors hover:bg-accent disabled:cursor-not-allowed disabled:bg-muted"
          >
            {isPending ? 'Placing Order...' : 'Place Order'}
          </button>
        </form>

        <aside className="h-fit border border-border bg-sand/30 p-6">
          <h2 className="font-display text-3xl mb-6">Order Summary</h2>
          <div className="space-y-4 border-b border-border pb-6">
            {items.map((item) => (
              <div key={item.id} className="flex justify-between gap-4 text-sm">
                <div>
                  <p>{item.name}</p>
                  <p className="text-muted">Qty {item.quantity}{item.variant ? ` / ${item.variant}` : ''}</p>
                </div>
                <p className="font-label tracking-wider">{formatPrice(item.price * item.quantity)}</p>
              </div>
            ))}
          </div>
          <div className="space-y-3 border-b border-border py-6 text-sm">
            <div className="flex justify-between"><span className="text-muted">Subtotal</span><span>{formatPrice(subtotal)}</span></div>
            <div className="flex justify-between"><span className="text-muted">Shipping</span><span>{formatPrice(shipping)}</span></div>
          </div>
          <div className="flex justify-between py-6 font-label tracking-wider">
            <span>Total</span>
            <span>{formatPrice(total)}</span>
          </div>
        </aside>
      </div>
    </div>
  )
}
