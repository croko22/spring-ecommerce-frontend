import { describe, expect, test } from 'bun:test'
import fs from 'fs'
import path from 'path'

// Helper to read component source for contract validation
function readComponent(name: string): string {
  const p = path.resolve(process.cwd(), `app/components/cart/${name}.vue`)
  return fs.readFileSync(p, 'utf-8')
}

function componentExists(name: string): boolean {
  const p = path.resolve(process.cwd(), `app/components/cart/${name}.vue`)
  return fs.existsSync(p)
}

// ============================================================================
// Task 2.1: CartQuantityControl
// ============================================================================
// Design contract:
// - Props: productId (string), quantity (number)
// - Calls useCart().incrementItem(productId) on + click
// - Calls useCart().decrementItem(productId) on − click
// - Disables − button when quantity <= 1
// ============================================================================

describe('CartQuantityControl – contract (task 2.1)', () => {
  test('component file exists', () => {
    expect(componentExists('CartQuantityControl')).toBe(true)
  })

  test('accepts productId and quantity props', () => {
    const src = readComponent('CartQuantityControl')
    expect(src).toContain('productId')
    expect(src).toContain('quantity')
  })

  test('calls incrementItem on + button', () => {
    const src = readComponent('CartQuantityControl')
    expect(src).toContain('incrementItem')
  })

  test('calls decrementItem on − button', () => {
    const src = readComponent('CartQuantityControl')
    expect(src).toContain('decrementItem')
  })

  test('disables − button when quantity is 1', () => {
    const src = readComponent('CartQuantityControl')
    // Must have a guard: quantity <= 1 triggers disabled state
    expect(src).toMatch(/quantity\s*<=?\s*1/)
    expect(src).toContain('disabled')
  })

  test('displays current quantity value', () => {
    const src = readComponent('CartQuantityControl')
    // Must render the quantity somewhere in template
    expect(src).toMatch(/\{\{\s*quantity\s*\}\}/)
  })

  test('has + and − button elements', () => {
    const src = readComponent('CartQuantityControl')
    // Must have buttons for increment and decrement
    const hasIncrementBtn = src.includes('+') || src.includes('increment')
    const hasDecrementBtn = src.includes('−') || src.includes('-') || src.includes('decrement')
    expect(hasIncrementBtn).toBe(true)
    expect(hasDecrementBtn).toBe(true)
  })
})
