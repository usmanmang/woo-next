'use client'

import { useEffect } from 'react'
import { useCart } from '@/store/cart'

export default function ClearCartOnSuccess() {
  const clearCart = useCart((state) => state.clearCart)

  useEffect(() => {
    clearCart()
  }, [clearCart])

  return null
}
