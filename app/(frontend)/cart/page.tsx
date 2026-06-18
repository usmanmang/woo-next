import type { Metadata } from 'next'
import CartPageClient from '@/components/cart/CartPageClient'
import { getPayload } from 'payload'
import config from '@/payload.config'

export const metadata: Metadata = {
  title: 'Cart',
  description: 'Review the furniture pieces in your cart before checkout.',
}

export default async function CartPage() {
  const payload = await getPayload({ config })
  const { docs: products } = await payload.find({
    collection: 'products',
    limit: 100,
    depth: 0,
  })
  const stockByProductId = Object.fromEntries(products.map((product) => [String(product.id), product.stockQty ?? null]))

  return <CartPageClient stockByProductId={stockByProductId} />
}
