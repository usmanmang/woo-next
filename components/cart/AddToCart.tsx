'use client'

import { useState } from 'react'
import { useCart } from '@/store/cart'

type Variant = {
  name?: string | null
  value?: string | null
  priceModifier?: number | null
  inStock?: boolean | null
}

type AddToCartProps = {
  product: {
    id: string | number
    name: string
    price: number
    inStock?: boolean | null
    stockQty?: number | null
    image?: string
    variants?: Variant[] | null
  }
}

export default function AddToCart({ product }: AddToCartProps) {
  const addItem = useCart((state) => state.addItem)
  const items = useCart((state) => state.items)
  const [quantity, setQuantity] = useState(1)
  const [variantIndex, setVariantIndex] = useState('')
  const [added, setAdded] = useState(false)

  const variant = variantIndex !== '' ? product.variants?.[Number(variantIndex)] : undefined
  const variantLabel = variant ? [variant.name, variant.value].filter(Boolean).join(': ') : undefined
  const cartItemId = variantLabel ? `${product.id}:${variantLabel}` : String(product.id)
  const currentCartQty = items.find((item) => item.id === cartItemId)?.quantity || 0
  const stockQty = product.stockQty ?? null
  const remainingQty = stockQty === null ? Infinity : Math.max(stockQty - currentCartQty, 0)
  const price = product.price + (variant?.priceModifier || 0)
  const canAdd = product.inStock && (variant ? variant.inStock !== false : true) && remainingQty > 0

  function handleAdd() {
    if (!canAdd) return

    addItem({
      id: cartItemId,
      productId: String(product.id),
      name: product.name,
      price,
      quantity: Math.min(quantity, remainingQty),
      image: product.image || '',
      stockQty,
      variant: variantLabel,
    })
    setAdded(true)
    window.setTimeout(() => setAdded(false), 1800)
  }

  return (
    <div className="mt-8 space-y-5 border-t border-border pt-6">
      {product.variants && product.variants.length > 0 && (
        <label className="block">
          <span className="mb-2 block font-label text-xs tracking-[0.2em] uppercase text-muted">Variant</span>
          <select
            value={variantIndex}
            onChange={(event) => setVariantIndex(event.target.value)}
            className="w-full border border-border bg-background px-4 py-3 text-sm outline-none focus:border-accent"
          >
            <option value="">Default</option>
            {product.variants.map((item, index) => (
              <option key={`${item.name}-${item.value}-${index}`} value={index} disabled={item.inStock === false}>
                {[item.name, item.value].filter(Boolean).join(': ')}
                {item.priceModifier ? ` (+${item.priceModifier.toLocaleString('en-US', { style: 'currency', currency: 'USD' })})` : ''}
                {item.inStock === false ? ' - Out of stock' : ''}
              </option>
            ))}
          </select>
        </label>
      )}

      <div className="flex flex-col gap-3 sm:flex-row">
        <label className="flex w-full items-center justify-between border border-border sm:w-32">
          <span className="sr-only">Quantity</span>
          <button
            type="button"
            onClick={() => setQuantity((current) => Math.max(1, current - 1))}
            className="px-4 py-3 text-lg leading-none hover:text-accent"
            aria-label="Decrease quantity"
          >
            -
          </button>
          <span className="font-label text-sm">{quantity}</span>
          <button
            type="button"
            onClick={() => setQuantity((current) => Math.min(current + 1, remainingQty))}
            disabled={remainingQty !== Infinity && quantity >= remainingQty}
            className="px-4 py-3 text-lg leading-none hover:text-accent"
            aria-label="Increase quantity"
          >
            +
          </button>
        </label>

        <button
          type="button"
          onClick={handleAdd}
          disabled={!canAdd}
          className="flex-1 bg-foreground px-8 py-4 font-label text-xs tracking-[0.2em] text-background uppercase transition-colors hover:bg-accent disabled:cursor-not-allowed disabled:bg-muted"
        >
          {canAdd ? 'Add to Cart' : 'Out of Stock'}
        </button>
      </div>

      {stockQty !== null && canAdd && (
        <p className="text-sm text-muted">{remainingQty} available</p>
      )}
      {stockQty !== null && remainingQty === 0 && product.inStock && (
        <p className="text-sm text-muted">You have added all available stock to your cart.</p>
      )}
      {added && <p className="font-label text-xs tracking-widest text-accent uppercase">Added to cart</p>}
    </div>
  )
}
