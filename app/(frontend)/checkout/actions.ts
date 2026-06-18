'use server'

import { getPayload } from 'payload'
import { Resend } from 'resend'
import config from '@/payload.config'

export type PaymentMethod = 'cod' | 'bank-transfer' | 'jazzcash' | 'easypaisa'

type CheckoutCartItem = {
  id: string
  productId: string
  quantity: number
  variant?: string
}

type ShippingAddress = {
  name: string
  email: string
  address: string
  city: string
  country: string
  postalCode: string
}

type ProductVariant = {
  name?: string | null
  value?: string | null
  priceModifier?: number | null
  inStock?: boolean | null
}

type ValidatedItem = {
  productId: string
  name: string
  quantity: number
  price: number
  variant?: string
}

const paymentMethodLabels: Record<PaymentMethod, string> = {
  cod: 'Cash on Delivery',
  'bank-transfer': 'Bank Transfer',
  jazzcash: 'JazzCash',
  easypaisa: 'EasyPaisa',
}

function getOrderNumber() {
  return `ORD-${Date.now().toString(36).toUpperCase()}`
}

function normalizeText(value: string) {
  return value.trim()
}

function validateAddress(address: ShippingAddress) {
  const normalized = {
    name: normalizeText(address.name),
    email: normalizeText(address.email).toLowerCase(),
    address: normalizeText(address.address),
    city: normalizeText(address.city),
    country: normalizeText(address.country),
    postalCode: normalizeText(address.postalCode),
  }

  if (!normalized.name || !normalized.email || !normalized.address || !normalized.city || !normalized.country || !normalized.postalCode) {
    throw new Error('Please complete all shipping fields.')
  }

  if (!normalized.email.includes('@')) {
    throw new Error('Please enter a valid email address.')
  }

  return normalized
}

function getVariantLabel(variant: ProductVariant) {
  return [variant.name, variant.value].filter(Boolean).join(': ')
}

function getPaymentStatus(paymentMethod: PaymentMethod) {
  return paymentMethod === 'cod' ? 'pending' : 'awaiting-confirmation'
}

function getPaymentInstructions(paymentMethod: PaymentMethod) {
  if (paymentMethod === 'cod') {
    return 'Pay cash when your order is delivered.'
  }

  if (paymentMethod === 'bank-transfer') {
    return 'Transfer the order total to the listed bank account, then share your transfer reference with support.'
  }

  if (paymentMethod === 'jazzcash') {
    return 'Send the order total to the listed JazzCash account, then share your transaction ID with support.'
  }

  return 'Send the order total to the listed EasyPaisa account, then share your transaction ID with support.'
}

async function sendOrderEmail(input: {
  email: string
  orderNumber: string
  paymentMethod: PaymentMethod
  total: number
}) {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) return

  const resend = new Resend(apiKey)
  await resend.emails.send({
    from: 'Furniture Studio <orders@resend.dev>',
    to: input.email,
    subject: `Order received ${input.orderNumber}`,
    html: `
      <h1>Thank you for your order</h1>
      <p>Your order has been received.</p>
      <p><strong>Order:</strong> ${input.orderNumber}</p>
      <p><strong>Payment method:</strong> ${paymentMethodLabels[input.paymentMethod]}</p>
      <p><strong>Total:</strong> ${input.total.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</p>
      <p>${getPaymentInstructions(input.paymentMethod)}</p>
    `,
  })
}

export async function createManualOrder(input: {
  items: CheckoutCartItem[]
  shippingAddress: ShippingAddress
  paymentMethod: PaymentMethod
  paymentReference?: string
  customerNote?: string
}) {
  if (!input.items.length) throw new Error('Your cart is empty.')
  if (!paymentMethodLabels[input.paymentMethod]) throw new Error('Please select a valid payment method.')

  const shippingAddress = validateAddress(input.shippingAddress)
  const payload = await getPayload({ config })
  const validatedItems: ValidatedItem[] = []

  for (const item of input.items) {
    if (!item.productId || item.quantity < 1) throw new Error('Your cart contains an invalid item.')

    const product = await payload.findByID({ collection: 'products', id: item.productId, depth: 0 })
    if (!product || !product.inStock) throw new Error(`${product?.name || 'A product'} is no longer available.`)
    if (typeof product.stockQty === 'number' && item.quantity > product.stockQty) {
      throw new Error(`Only ${product.stockQty} ${product.name} available.`)
    }

    const variants = (product.variants || []) as ProductVariant[]
    const variant = item.variant ? variants.find((entry) => getVariantLabel(entry) === item.variant) : undefined
    if (item.variant && !variant) throw new Error(`${product.name} has an invalid variant.`)
    if (variant?.inStock === false) throw new Error(`${product.name} ${item.variant} is out of stock.`)

    validatedItems.push({
      productId: String(product.id),
      name: product.name,
      quantity: item.quantity,
      price: product.price + (variant?.priceModifier || 0),
      variant: item.variant,
    })
  }

  const subtotal = validatedItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const shipping = subtotal >= 150 ? 0 : 15
  const total = subtotal + shipping
  const orderNumber = getOrderNumber()

  await payload.create({
    collection: 'orders',
    overrideAccess: true,
    data: {
      orderNumber,
      status: 'pending',
      paymentMethod: input.paymentMethod,
      paymentStatus: getPaymentStatus(input.paymentMethod),
      paymentReference: normalizeText(input.paymentReference || ''),
      customerNote: normalizeText(input.customerNote || ''),
      items: validatedItems.map((item) => ({
        product: item.productId,
        quantity: item.quantity,
        price: item.price,
        variant: item.variant,
      })),
      subtotal,
      shipping,
      total,
      shippingAddress,
    },
  })

  await sendOrderEmail({ email: shippingAddress.email, orderNumber, paymentMethod: input.paymentMethod, total })

  return {
    orderNumber,
    paymentMethod: input.paymentMethod,
    paymentMethodLabel: paymentMethodLabels[input.paymentMethod],
    paymentInstructions: getPaymentInstructions(input.paymentMethod),
    subtotal,
    shipping,
    total,
  }
}
