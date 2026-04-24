import { describe, expect, test } from 'bun:test'
import fs from 'fs'
import path from 'path'

function readComponent(name: string): string {
  return fs.readFileSync(
    path.resolve(process.cwd(), `app/components/reviews/${name}.vue`),
    'utf-8'
  )
}

function componentExists(name: string): boolean {
  return fs.existsSync(
    path.resolve(process.cwd(), `app/components/reviews/${name}.vue`)
  )
}

// ============================================================================
// ReviewForm component contract
// ============================================================================
// Design contract:
// - Props: productId (string)
// - Uses useAuthState (isAuthenticated)
// - Uses useReviews (addReview)
// - Shows login link when not authenticated
// - Shows StarRating input and textarea when authenticated
// - Has submit button
// ============================================================================

describe('ReviewForm – contract', () => {
  test('component file exists', () => {
    expect(componentExists('ReviewForm')).toBe(true)
  })

  test('accepts productId prop', () => {
    const src = readComponent('ReviewForm')
    expect(src).toMatch(/productId/)
  })

  test('uses useAuthState composable', () => {
    const src = readComponent('ReviewForm')
    expect(src).toMatch(/useAuthState/)
  })

  test('uses useReviews composable', () => {
    const src = readComponent('ReviewForm')
    expect(src).toMatch(/useReviews/)
  })

  test('shows login link for unauthenticated users', () => {
    const src = readComponent('ReviewForm')
    expect(src).toMatch(/isAuthenticated/)
    expect(src).toMatch(/NuxtLink/)
    expect(src).toMatch(/login/)
  })

  test('has StarRating input for authenticated users', () => {
    const src = readComponent('ReviewForm')
    expect(src).toMatch(/StarRating/)
  })

  test('has textarea for comment', () => {
    const src = readComponent('ReviewForm')
    expect(src).toMatch(/textarea/)
  })

  test('has submit button', () => {
    const src = readComponent('ReviewForm')
    expect(src).toMatch(/type="submit"/)
  })
})
