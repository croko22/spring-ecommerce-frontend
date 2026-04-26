import { describe, expect, test } from 'bun:test'
import fs from 'fs'
import path from 'path'

function readFile(filePath: string): string {
  return fs.readFileSync(path.resolve(process.cwd(), filePath), 'utf-8')
}

describe('default layout – cart icon integration (tasks 3.2 & 3.3)', () => {
  const layoutSrc = readFile('app/layouts/default.vue')
  const headerSrc = readFile('app/components/layout/AppHeader.vue')

  test('imports or uses ShoppingCart icon', () => {
    expect(headerSrc).toMatch(/ShoppingCart/)
  })

  test('shows Badge with totalItems count', () => {
    expect(headerSrc).toMatch(/Badge/)
    expect(headerSrc).toMatch(/totalItems/)
  })

  test('has cart button or trigger element', () => {
    expect(headerSrc).toMatch(/cart|ShoppingCart/)
  })

  test('includes CartDrawer component', () => {
    expect(layoutSrc).toMatch(/CartDrawer/)
  })

  test('CartDrawer has open state management', () => {
    expect(layoutSrc).toMatch(/cartOpen|cart-open|open/)
  })

  test('keeps existing nav links intact', () => {
    expect(layoutSrc).toContain('/products')
    expect(headerSrc).toContain('/settings')
    expect(headerSrc).toContain('Configuraci')
  })
})
