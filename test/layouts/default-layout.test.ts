import { describe, expect, test } from 'bun:test'
import fs from 'fs'
import path from 'path'

function readFile(filePath: string): string {
  return fs.readFileSync(path.resolve(process.cwd(), filePath), 'utf-8')
}

// ============================================================================
// Tasks 3.2 & 3.3: Cart icon + Badge + CartDrawer in default layout
// ============================================================================
// Design contract:
// - ShoppingCart icon from lucide-vue-next
// - Badge showing totalItems count from useCart()
// - Click opens CartDrawer
// - CartDrawer component placed in layout
// ============================================================================

describe('default layout – cart icon integration (tasks 3.2 & 3.3)', () => {
  const layoutSrc = readFile('app/layouts/default.vue')

  test('imports or uses ShoppingCart icon', () => {
    expect(layoutSrc).toMatch(/ShoppingCart/)
  })

  test('shows Badge with totalItems count', () => {
    expect(layoutSrc).toMatch(/Badge/)
    expect(layoutSrc).toMatch(/totalItems/)
  })

  test('has cart button or trigger element', () => {
    expect(layoutSrc).toMatch(/cart|ShoppingCart/)
  })

  test('includes CartDrawer component', () => {
    expect(layoutSrc).toMatch(/CartDrawer/)
  })

  test('CartDrawer has open state management', () => {
    // Must have a ref or v-model for open state
    expect(layoutSrc).toMatch(/cartOpen|cart-open|open/)
  })

  test('keeps existing nav links intact', () => {
    expect(layoutSrc).toContain('/products')
    expect(layoutSrc).toContain('Configuracion')
  })
})
