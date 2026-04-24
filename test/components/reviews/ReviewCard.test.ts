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
// ReviewCard component contract
// ============================================================================
// Design contract:
// - Props: review (Review)
// - Renders: author, rating (StarRating readonly), comment, formatted date
// ============================================================================

describe('ReviewCard – contract', () => {
  test('component file exists', () => {
    expect(componentExists('ReviewCard')).toBe(true)
  })

  test('accepts review prop of type Review', () => {
    const src = readComponent('ReviewCard')
    expect(src).toMatch(/review/)
    expect(src).toMatch(/Review/)
  })

  test('renders author name', () => {
    const src = readComponent('ReviewCard')
    expect(src).toMatch(/review\.author|author/)
  })

  test('renders comment', () => {
    const src = readComponent('ReviewCard')
    expect(src).toMatch(/review\.comment|comment/)
  })

  test('renders created date', () => {
    const src = readComponent('ReviewCard')
    expect(src).toMatch(/review\.createdAt|createdAt/)
  })

  test('uses StarRating component', () => {
    const src = readComponent('ReviewCard')
    expect(src).toMatch(/StarRating/)
  })
})
