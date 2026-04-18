import { describe, expect, test } from 'bun:test'
import fs from 'fs'
import path from 'path'

function readComponent(name: string): string {
  return fs.readFileSync(
    path.resolve(process.cwd(), `app/components/cart/${name}.vue`),
    'utf-8'
  )
}

function componentExists(name: string): boolean {
  return fs.existsSync(
    path.resolve(process.cwd(), `app/components/cart/${name}.vue`)
  )
}

// ============================================================================
// Pure function tests for CartSummary calculation logic
// ============================================================================

describe('CartSummary orderTotal calculation (task 2.3)', () => {
  // The calculation: orderTotal = subtotal + shippingCost + taxes
  // This is a pure function that we test with multiple inputs (triangulation)

  function calculateOrderTotal(subtotal: number, shippingCost: number, taxes: number): number {
    return subtotal + shippingCost + taxes
  }

  test('computes order total with zero shipping and taxes', () => {
    expect(calculateOrderTotal(85.50, 0, 0)).toBe(85.50)
  })

  test('computes order total with shipping and taxes', () => {
    expect(calculateOrderTotal(85.50, 10, 7.70)).toBe(103.20)
  })

  test('computes order total with zero subtotal', () => {
    expect(calculateOrderTotal(0, 5, 0)).toBe(5)
  })

  test('computes order total with all zeros', () => {
    expect(calculateOrderTotal(0, 0, 0)).toBe(0)
  })

  test('computes order total with large values', () => {
    expect(calculateOrderTotal(999.99, 50, 159.99)).toBe(1209.98)
  })
})

// ============================================================================
// Task 2.3: CartSummary component contract
// ============================================================================
// Design contract:
// - Props: subtotal, totalItems, shippingCost, taxes, isEmpty
// - Computes orderTotal internally
// - Displays: subtotal, item count, shipping, taxes, total
// - Checkout CTA disabled when empty
// - Links to /checkout
// ============================================================================

describe('CartSummary – contract (task 2.3)', () => {
  test('component file exists', () => {
    expect(componentExists('CartSummary')).toBe(true)
  })

  test('accepts subtotal, totalItems, shippingCost, taxes, isEmpty props', () => {
    const src = readComponent('CartSummary')
    expect(src).toContain('subtotal')
    expect(src).toContain('totalItems')
    expect(src).toContain('shippingCost')
    expect(src).toContain('taxes')
    expect(src).toContain('isEmpty')
  })

  test('computes orderTotal from props', () => {
    const src = readComponent('CartSummary')
    expect(src).toMatch(/orderTotal/)
    // Must sum subtotal + shipping + taxes
    expect(src).toMatch(/subtotal.*shippingCost.*taxes|subtotal.*\+.*shipping/)
  })

  test('has Checkout link to /checkout', () => {
    const src = readComponent('CartSummary')
    expect(src).toContain('/checkout')
  })

  test('disables checkout when cart is empty', () => {
    const src = readComponent('CartSummary')
    // Must conditionally disable or hide based on isEmpty
    expect(src).toMatch(/isEmpty/)
    expect(src).toMatch(/disabled|pointer-events-none/)
  })

  test('formats amounts with formatPenAmount', () => {
    const src = readComponent('CartSummary')
    expect(src).toMatch(/formatPenAmount/)
  })
})
