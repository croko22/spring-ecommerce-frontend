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
import type { DiscountCode } from '~/types/order'
import { SHIPPING_COST, IGV_RATE } from '~/utils/pricing'
import { validateDiscountCode } from '~/services/orderService'

const CART_STORAGE_KEY = 'ecommerce.cart.items'

export function useCart() {
  const items = useState<CartItem[]>('cart.items', () => [])
  const hasHydrated = useState<boolean>('cart.hydrated', () => false)
  const discountCode = useState<string>('cart.discountCode', () => '')
  const appliedDiscount = useState<DiscountCode | null>('cart.appliedDiscount', () => null)

  const subtotal = computed(() => getCartSubtotal(items.value))
  const totalItems = computed(() => getCartTotalItems(items.value))
  const isEmpty = computed(() => items.value.length === 0)

  const igv = computed(() => Math.round(subtotal.value * IGV_RATE * 100) / 100)

  const shippingCost = computed(() => {
    if (appliedDiscount.value?.type === 'free_shipping') {
      return 0
    }
    return SHIPPING_COST
  })

  const discountAmount = computed(() => {
    if (!appliedDiscount.value) {
      return 0
    }

    if (appliedDiscount.value.type === 'percentage') {
      return Math.round(subtotal.value * appliedDiscount.value.value / 100 * 100) / 100
    }

    if (appliedDiscount.value.type === 'free_shipping') {
      return SHIPPING_COST
    }

    return 0
  })

  const total = computed(() => {
    return Math.round((subtotal.value + igv.value + shippingCost.value - discountAmount.value) * 100) / 100
  })

  async function applyDiscountCode() {
    const code = discountCode.value.trim()

    if (!code) {
      return
    }

    try {
      const result = await validateDiscountCode(code)
      appliedDiscount.value = result
      discountCode.value = ''
    } catch {
      appliedDiscount.value = null
      throw new Error('Codigo de descuento invalido')
    }
  }

  function removeDiscountCode() {
    appliedDiscount.value = null
    discountCode.value = ''
  }

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
    appliedDiscount.value = null
    discountCode.value = ''

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
    igv,
    shippingCost,
    discountAmount,
    total,
    discountCode,
    appliedDiscount,
    applyDiscountCode,
    removeDiscountCode,
    addItem,
    incrementItem,
    decrementItem,
    removeItem,
    clearCart
  }
}
