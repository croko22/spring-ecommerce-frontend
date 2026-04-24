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
// ReviewList component contract
// ============================================================================
// Design contract:
// - Props: productId (string)
// - Uses useReviews composable
// - Renders ReviewCard for each review
// - Shows average rating and count, or empty message
// ============================================================================

describe('ReviewList – contract', () => {
  test('component file exists', () => {
    expect(componentExists('ReviewList')).toBe(true)
  })

  test('accepts productId prop', () => {
    const src = readComponent('ReviewList')
    expect(src).toMatch(/productId/)
  })

  test('uses useReviews composable', () => {
    const src = readComponent('ReviewList')
    expect(src).toMatch(/useReviews/)
  })

  test('uses ReviewCard component', () => {
    const src = readComponent('ReviewList')
    expect(src).toMatch(/ReviewCard/)
  })

  test('shows review count or empty message', () => {
    const src = readComponent('ReviewList')
    expect(src).toMatch(/reviewCount|count|empty/)
  })

  test('shows average rating', () => {
    const src = readComponent('ReviewList')
    expect(src).toMatch(/averageRating|StarRating/)
  })
})
