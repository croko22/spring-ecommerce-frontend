import { describe, expect, test } from 'bun:test'

import {
  addCartItem,
  getCartSubtotal,
  getCartTotalItems,
  normalizeCartItems,
  removeCartItem,
  setCartItemQuantity,
  type CartItem
} from '../app/utils/cart'

const baseItem: CartItem = {
  productId: 'p-1',
  name: 'Producto A',
  price: 10,
  currency: 'USD',
  imageUrl: 'https://example.com/a.jpg',
  quantity: 2
}

describe('cart utils', () => {
  test('adds new item and merges quantity for existing product', () => {
    const empty: CartItem[] = []
    const withItem = addCartItem(empty, {
      id: 'p-1',
      name: 'Producto A',
      price: 10,
      currency: 'USD',
      imageUrl: 'https://example.com/a.jpg'
    }, 2)

    expect(withItem).toHaveLength(1)
    expect(withItem[0]?.quantity).toBe(2)

    const merged = addCartItem(withItem, {
      id: 'p-1',
      name: 'Producto A',
      price: 10,
      currency: 'USD',
      imageUrl: 'https://example.com/a.jpg'
    }, 3)

    expect(merged[0]?.quantity).toBe(5)
  })

  test('decrements to zero removes item', () => {
    const next = setCartItemQuantity([baseItem], 'p-1', 0)
    expect(next).toEqual([])
  })

  test('removes item by product id', () => {
    const next = removeCartItem([baseItem, { ...baseItem, productId: 'p-2' }], 'p-1')
    expect(next).toHaveLength(1)
    expect(next[0]?.productId).toBe('p-2')
  })

  test('computes subtotal and total item count', () => {
    const items: CartItem[] = [
      baseItem,
      {
        productId: 'p-2',
        name: 'Producto B',
        price: 5,
        currency: 'USD',
        imageUrl: 'https://example.com/b.jpg',
        quantity: 3
      }
    ]

    expect(getCartSubtotal(items)).toBe(35)
    expect(getCartTotalItems(items)).toBe(5)
  })

  test('normalizes and filters invalid cart storage entries', () => {
    const normalized = normalizeCartItems([
      baseItem,
      { ...baseItem, productId: '' },
      { unknown: true }
    ])

    expect(normalized).toHaveLength(1)
    expect(normalized[0]?.productId).toBe('p-1')
  })
})
