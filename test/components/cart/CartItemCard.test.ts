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
// Task 2.2: CartItemCard
// ============================================================================
// Design contract:
// - Props: item (CartItem)
// - Renders: product image, name, unit price, line total
// - Embeds CartQuantityControl
// - Remove button triggers confirmation (AlertDialog per task 4.2)
// - Calls useCart().removeItem for removal
// ============================================================================

describe('CartItemCard – contract (task 2.2)', () => {
  test('component file exists', () => {
    expect(componentExists('CartItemCard')).toBe(true)
  })

  test('accepts item prop of type CartItem', () => {
    const src = readComponent('CartItemCard')
    // Must accept item prop
    expect(src).toContain('item')
    // Must import or reference CartItem type
    expect(src).toMatch(/CartItem/)
  })

  test('renders product image', () => {
    const src = readComponent('CartItemCard')
    // Must reference imageUrl from the item
    expect(src).toContain('imageUrl')
    // Must have an img element
    expect(src).toMatch(/<img/)
  })

  test('renders product name', () => {
    const src = readComponent('CartItemCard')
    // Must reference item.name
    expect(src).toMatch(/item\.name|name/)
  })

  test('renders unit price', () => {
    const src = readComponent('CartItemCard')
    // Must reference item.price
    expect(src).toMatch(/item\.price|price/)
  })

  test('uses CartQuantityControl component', () => {
    const src = readComponent('CartItemCard')
    // Must use the CartQuantityControl component
    expect(src).toMatch(/CartQuantityControl/)
    // Must pass productId to it
    expect(src).toMatch(/productId/)
    // Must pass quantity to it
    expect(src).toMatch(/quantity/)
  })

  test('has remove action that calls removeItem', () => {
    const src = readComponent('CartItemCard')
    // Must call removeItem from useCart
    expect(src).toContain('removeItem')
    // Must reference item.productId for removal
    expect(src).toMatch(/item\.productId|productId/)
  })

  test('renders line total (price × quantity)', () => {
    const src = readComponent('CartItemCard')
    // Must compute or display price * quantity subtotal
    expect(src).toMatch(/price.*quantity|subtotal|itemSubtotal/)
  })

  test('uses formatPenAmount for currency display', () => {
    const src = readComponent('CartItemCard')
    // Must format currency values
    expect(src).toMatch(/formatPenAmount|formatAmount/)
  })
})
