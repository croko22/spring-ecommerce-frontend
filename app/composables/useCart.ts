import {
  addCartItem,
  getCartSubtotal,
  getCartTotalItems,
  normalizeCartItems,
  removeCartItem,
  setCartItemQuantity,
  type CartItem
} from '~/utils/cart'
import type { Product } from '~/types/product'

const CART_STORAGE_KEY = 'ecommerce.cart.items'

export function useCart() {
  const items = useState<CartItem[]>('cart.items', () => [])
  const hasHydrated = useState<boolean>('cart.hydrated', () => false)

  const subtotal = computed(() => getCartSubtotal(items.value))
  const totalItems = computed(() => getCartTotalItems(items.value))
  const isEmpty = computed(() => items.value.length === 0)

  function persist() {
    if (!import.meta.client) {
      return
    }

    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items.value))
  }

  function hydrate() {
    if (!import.meta.client || hasHydrated.value) {
      return
    }

    const raw = localStorage.getItem(CART_STORAGE_KEY)

    if (raw) {
      try {
        items.value = normalizeCartItems(JSON.parse(raw))
      } catch {
        items.value = []
      }
    }

    hasHydrated.value = true
  }

  function addItem(product: Product, quantity = 1) {
    items.value = addCartItem(items.value, product, quantity)
    persist()
  }

  function incrementItem(productId: string) {
    const existing = items.value.find(item => item.productId === productId)

    if (!existing) {
      return
    }

    items.value = setCartItemQuantity(items.value, productId, existing.quantity + 1)
    persist()
  }

  function decrementItem(productId: string) {
    const existing = items.value.find(item => item.productId === productId)

    if (!existing) {
      return
    }

    items.value = setCartItemQuantity(items.value, productId, existing.quantity - 1)
    persist()
  }

  function removeItem(productId: string) {
    items.value = removeCartItem(items.value, productId)
    persist()
  }

  function clearCart() {
    items.value = []

    if (import.meta.client) {
      localStorage.removeItem(CART_STORAGE_KEY)
    }
  }

  onMounted(() => {
    hydrate()
  })

  return {
    items,
    subtotal,
    totalItems,
    isEmpty,
    addItem,
    incrementItem,
    decrementItem,
    removeItem,
    clearCart
  }
}
