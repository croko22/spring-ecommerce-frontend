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
// StarRating component contract
// ============================================================================
// Design contract:
// - Props: modelValue (number), readonly (boolean), size (number)
// - Emits: update:modelValue
// - Uses Star icon from lucide-vue-next
// - Renders clickable or readonly stars
// ============================================================================

describe('StarRating – contract', () => {
  test('component file exists', () => {
    expect(componentExists('StarRating')).toBe(true)
  })

  test('accepts modelValue prop', () => {
    const src = readComponent('StarRating')
    expect(src).toMatch(/modelValue/)
  })

  test('accepts readonly prop', () => {
    const src = readComponent('StarRating')
    expect(src).toMatch(/readonly/)
  })

  test('emits update:modelValue', () => {
    const src = readComponent('StarRating')
    expect(src).toMatch(/update:modelValue/)
  })

  test('uses Star icon from lucide-vue-next', () => {
    const src = readComponent('StarRating')
    expect(src).toMatch(/Star/)
    expect(src).toMatch(/lucide-vue-next/)
  })

  test('has active and inactive star states', () => {
    const src = readComponent('StarRating')
    expect(src).toMatch(/is-active|active/)
    expect(src).toMatch(/inactive/)
  })
})
