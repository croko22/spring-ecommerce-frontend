import { describe, expect, test } from 'bun:test'

import { clampQuantity, resolveAvailabilityState } from '../app/utils/productDetail'
import type { Product } from '../app/types/product'

const baseProduct: Product = {
  id: 'p-100',
  name: 'Producto prueba',
  description: 'Descripcion',
  price: 10,
  currency: 'USD',
  imageUrl: 'https://example.com/image.jpg',
  category: 'General'
}

describe('product detail helpers', () => {
  test('clamps quantity within bounds', () => {
    expect(clampQuantity(0, 5)).toBe(1)
    expect(clampQuantity(3, 5)).toBe(3)
    expect(clampQuantity(20, 5)).toBe(5)
    expect(clampQuantity(Number.NaN, 5)).toBe(1)
  })

  test('resolves out-of-stock state when product missing', () => {
    expect(resolveAvailabilityState(null)).toEqual({
      inStock: false,
      label: 'Sin disponibilidad',
      tone: 'out',
      maxQuantity: 1
    })
  })

  test('resolves low stock state', () => {
    expect(resolveAvailabilityState({ ...baseProduct, stock: 3 })).toEqual({
      inStock: true,
      label: 'Quedan 3 unidades',
      tone: 'low',
      maxQuantity: 3
    })
  })

  test('resolves available state without explicit stock', () => {
    expect(resolveAvailabilityState(baseProduct)).toEqual({
      inStock: true,
      label: 'Disponible',
      tone: 'in',
      maxQuantity: 10
    })
  })

  test('prioritizes explicit inStock false value', () => {
    expect(resolveAvailabilityState({ ...baseProduct, stock: 8, inStock: false })).toEqual({
      inStock: false,
      label: 'Agotado',
      tone: 'out',
      maxQuantity: 1
    })
  })
})
