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
// Task 3.1: CartDrawer
// ============================================================================
// Design contract:
// - Uses shadcn-vue Sheet (side="right") with v-model:open
// - Internal ref for open state
// - Renders CartItemCard list when cart has items
// - Shows CartEmpty when cart is empty
// - Includes CartSummary at bottom
// - Calls useCart() for items, isEmpty
// ============================================================================

describe('CartDrawer – contract (task 3.1)', () => {
  test('component file exists', () => {
    expect(componentExists('CartDrawer')).toBe(true)
  })

  test('uses Sheet component from shadcn-vue', () => {
    const src = readComponent('CartDrawer')
    // Must use Sheet-related components
    expect(src).toMatch(/Sheet/)
  })

  test('sets side to right', () => {
    const src = readComponent('CartDrawer')
    expect(src).toMatch(/side.*right|right.*side/)
  })

  test('uses v-model:open or open state', () => {
    const src = readComponent('CartDrawer')
    expect(src).toMatch(/open/)
  })

  test('uses CartItemCard for item list', () => {
    const src = readComponent('CartDrawer')
    expect(src).toMatch(/CartItemCard/)
  })

  test('shows CartEmpty when cart is empty', () => {
    const src = readComponent('CartDrawer')
    expect(src).toMatch(/CartEmpty/)
    // Must have conditional rendering based on isEmpty
    expect(src).toMatch(/isEmpty/)
  })

  test('includes CartSummary', () => {
    const src = readComponent('CartDrawer')
    expect(src).toMatch(/CartSummary/)
  })

  test('calls useCart for items and isEmpty', () => {
    const src = readComponent('CartDrawer')
    expect(src).toContain('useCart')
    expect(src).toMatch(/items/)
    expect(src).toMatch(/isEmpty/)
  })

  test('exposes open/close functionality (defineExpose or model)', () => {
    const src = readComponent('CartDrawer')
    // Must have a way to open/close from parent
    // Either via defineExpose, v-model, or a ref
    expect(src).toMatch(/defineExpose|open/)
  })

  test('has close button or header', () => {
    const src = readComponent('CartDrawer')
    // Sheet typically has SheetHeader + SheetClose
    expect(src).toMatch(/SheetHeader|SheetClose|SheetTitle/)
  })
})
