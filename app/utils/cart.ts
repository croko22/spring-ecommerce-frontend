import type { Product } from '~/types/product'

export type CartItem = {
  productId: string
  name: string
  price: number
  currency: string
  imageUrl: string
  quantity: number
}

type CartProduct = Pick<Product, 'id' | 'name' | 'price' | 'currency' | 'imageUrl'>

const MIN_QTY = 1
const MAX_QTY = 99

function toBoundedQuantity(value: number) {
  if (!Number.isFinite(value)) {
    return MIN_QTY
  }

  return Math.max(MIN_QTY, Math.min(MAX_QTY, Math.floor(value)))
}

function normalizeCartItem(entry: unknown): CartItem | null {
  if (!entry || typeof entry !== 'object') {
    return null
  }

  const item = entry as Record<string, unknown>
  const productId = String(item.productId ?? '').trim()
  const name = String(item.name ?? '').trim()
  const imageUrl = String(item.imageUrl ?? '').trim()
  const currency = 'PEN'
  const price = Number(item.price)
  const quantity = Number(item.quantity)

  if (!productId || !name || !imageUrl || !Number.isFinite(price) || !Number.isFinite(quantity)) {
    return null
  }

  return {
    productId,
    name,
    price,
    currency,
    imageUrl,
    quantity: toBoundedQuantity(quantity)
  }
}

export function normalizeCartItems(raw: unknown): CartItem[] {
  if (!Array.isArray(raw)) {
    return []
  }

  return raw.map(normalizeCartItem).filter((item): item is CartItem => Boolean(item))
}

export function addCartItem(items: CartItem[], product: CartProduct, quantity = 1): CartItem[] {
  const safeQuantity = toBoundedQuantity(quantity)
  const index = items.findIndex(item => item.productId === product.id)

  if (index === -1) {
    return [
      ...items,
      {
        productId: product.id,
        name: product.name,
        price: product.price,
        currency: 'PEN',
        imageUrl: product.imageUrl,
        quantity: safeQuantity
      }
    ]
  }

  return items.map((item, itemIndex) => {
    if (itemIndex !== index) {
      return item
    }

    return {
      ...item,
      quantity: toBoundedQuantity(item.quantity + safeQuantity)
    }
  })
}

export function setCartItemQuantity(items: CartItem[], productId: string, quantity: number): CartItem[] {
  const safeProductId = String(productId).trim()

  if (!safeProductId) {
    return items
  }

  if (quantity <= 0) {
    return items.filter(item => item.productId !== safeProductId)
  }

  const safeQuantity = toBoundedQuantity(quantity)

  return items.map((item) => {
    if (item.productId !== safeProductId) {
      return item
    }

    return {
      ...item,
      quantity: safeQuantity
    }
  })
}

export function removeCartItem(items: CartItem[], productId: string): CartItem[] {
  const safeProductId = String(productId).trim()

  if (!safeProductId) {
    return items
  }

  return items.filter(item => item.productId !== safeProductId)
}

export function getCartSubtotal(items: CartItem[]) {
  return items.reduce((total, item) => total + item.price * item.quantity, 0)
}

export function getCartTotalItems(items: CartItem[]) {
  return items.reduce((total, item) => total + item.quantity, 0)
}
