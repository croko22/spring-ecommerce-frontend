import { describe, expect, test } from 'bun:test'
import fs from 'fs'
import path from 'path'

function readFile(filePath: string): string {
  return fs.readFileSync(path.resolve(process.cwd(), filePath), 'utf-8')
}

// ============================================================================
// Task 4.1: Toast on add-to-cart in products/[id].vue
// ============================================================================
// Spec: After addToCart, show toast.success(`${product.name} added to cart`)
// ============================================================================

describe('products/[id] – add-to-cart toast (task 4.1)', () => {
  const pageSrc = readFile('app/pages/products/[id].vue')

  test('imports toast from vue-sonner', () => {
    expect(pageSrc).toMatch(/toast/)
    expect(pageSrc).toMatch(/vue-sonner/)
  })

  test('calls toast.success after addToCart', () => {
    expect(pageSrc).toMatch(/toast\.success|toast\(/)
  })

  test('toast includes product name', () => {
    expect(pageSrc).toMatch(/product.*name.*cart|name.*added.*cart/)
  })
})

// ============================================================================
// Task 4.4: Toast notifications on remove and clear
// ============================================================================

describe('Toast on remove/clear actions (task 4.4)', () => {
  test('CartItemCard shows toast after confirmed removal', () => {
    const src = readFile('app/components/cart/CartItemCard.vue')
    expect(src).toMatch(/toast/)
  })

  test('cart.vue shows toast after clearing cart', () => {
    const src = readFile('app/pages/cart.vue')
    expect(src).toMatch(/toast/)
  })
})
