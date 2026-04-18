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
// Task 2.4: CartEmpty
// ============================================================================
// Design contract:
// - No props, no emits
// - Empty state message
// - NuxtLink to="/products" (Continue Shopping)
// ============================================================================

describe('CartEmpty – contract (task 2.4)', () => {
  test('component file exists', () => {
    expect(componentExists('CartEmpty')).toBe(true)
  })

  test('has empty cart message', () => {
    const src = readComponent('CartEmpty')
    expect(src).toMatch(/vac[ií]o|empty|no.*productos/i)
  })

  test('has continue shopping link to /products', () => {
    const src = readComponent('CartEmpty')
    expect(src).toContain('/products')
  })

  test('uses NuxtLink for navigation', () => {
    const src = readComponent('CartEmpty')
    expect(src).toMatch(/NuxtLink/)
  })
})
