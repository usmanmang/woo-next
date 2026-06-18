import type { Metadata } from 'next'
import CheckoutClient from '@/components/checkout/CheckoutClient'
import { getPayload } from 'payload'
import config from '@/payload.config'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Checkout',
  description: 'Complete your Furniture Studio order with manual payment options.',
}

export default async function CheckoutPage() {
  const payload = await getPayload({ config })
  const { docs: products } = await payload.find({
    collection: 'products',
    limit: 100,
    depth: 0,
  })
  const stockByProductId = Object.fromEntries(products.map((product) => [String(product.id), product.stockQty ?? null]))

  return (
    <CheckoutClient
      stockByProductId={stockByProductId}
      paymentAccounts={{
        bankTransferDetails: process.env.BANK_TRANSFER_DETAILS || '',
        jazzcashAccount: process.env.JAZZCASH_ACCOUNT || '',
        easypaisaAccount: process.env.EASYPAISA_ACCOUNT || '',
      }}
    />
  )
}
