import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface CartItem {
  id: string
  productId: string
  name: string
  price: number
  quantity: number
  image: string
  stockQty?: number | null
  variant?: string
}

interface CartStore {
  items: CartItem[]
  addItem: (item: CartItem) => void
  removeItem: (id: string) => void
  updateQty: (id: string, qty: number) => void
  syncStock: (stockByProductId: Record<string, number | null>) => void
  clearCart: () => void
  total: () => number
}

export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item) =>
        set((s) => {
          const exists = s.items.find((i) => i.id === item.id)
          if (exists) {
            return {
              items: s.items.map((i) =>
                i.id === item.id
                  ? {
                      ...i,
                      stockQty: item.stockQty,
                      quantity: Math.min(i.quantity + item.quantity, item.stockQty ?? Infinity),
                    }
                  : i
              ),
            }
          }
          return { items: [...s.items, { ...item, quantity: Math.min(item.quantity, item.stockQty ?? Infinity) }] }
        }),
      removeItem: (id) => set((s) => ({ items: s.items.filter((i) => i.id !== id) })),
      updateQty: (id, qty) =>
        set((s) => ({
          items: qty <= 0
            ? s.items.filter((i) => i.id !== id)
            : s.items.map((i) => (i.id === id ? { ...i, quantity: Math.min(qty, i.stockQty ?? Infinity) } : i)),
        })),
      syncStock: (stockByProductId) =>
        set((s) => ({
          items: s.items.map((item) => {
            if (!(item.productId in stockByProductId)) return item
            const stockQty = stockByProductId[item.productId]
            return {
              ...item,
              stockQty,
              quantity: Math.min(item.quantity, stockQty ?? Infinity),
            }
          }),
        })),
      clearCart: () => set({ items: [] }),
      total: () => get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),
    }),
    { name: 'cart-storage' }
  )
)
