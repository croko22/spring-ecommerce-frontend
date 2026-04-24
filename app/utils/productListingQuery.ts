import type { ProductQueryState, ProductSort } from '~/types/product'

export const PRODUCT_DEFAULT_PAGE_SIZE = 12

function parsePositiveInt(value: unknown, fallback: number): number {
  const parsed = Number(value)
  return Number.isFinite(parsed) && parsed > 0 ? Math.floor(parsed) : fallback
}

function parseSort(value: unknown): ProductSort {
  const valid: ProductSort[] = ['name', 'price-asc', 'price-desc', 'rating']
  const candidate = String(value ?? '')
  return valid.includes(candidate as ProductSort) ? (candidate as ProductSort) : 'name'
}

function parseNumberOrNull(value: unknown): number | null {
  const parsed = Number(value)
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : null
}

function parseBooleanOrNull(value: unknown): boolean | null {
  if (value === 'true' || value === true) return true
  if (value === 'false' || value === false) return false
  return null
}

export function parseProductQuery(
  query: Record<string, unknown>,
  defaultPageSize: number = PRODUCT_DEFAULT_PAGE_SIZE
): ProductQueryState {
  return {
    search: String(query.q ?? '').trim(),
    category: String(query.category ?? '').trim(),
    page: parsePositiveInt(query.page, 1),
    size: parsePositiveInt(query.size, defaultPageSize),
    sort: parseSort(query.sort),
    priceMin: parseNumberOrNull(query.priceMin),
    priceMax: parseNumberOrNull(query.priceMax),
    inStock: parseBooleanOrNull(query.inStock)
  }
}

export function stringifyProductQuery(state: ProductQueryState): Record<string, string> {
  const query: Record<string, string> = {}

  if (state.search) {
    query.q = state.search
  }

  if (state.category) {
    query.category = state.category
  }

  if (state.page > 1) {
    query.page = String(state.page)
  }

  if (state.size !== PRODUCT_DEFAULT_PAGE_SIZE) {
    query.size = String(state.size)
  }

  if (state.sort && state.sort !== 'name') {
    query.sort = state.sort
  }

  if (state.priceMin !== null && state.priceMin !== undefined) {
    query.priceMin = String(state.priceMin)
  }

  if (state.priceMax !== null && state.priceMax !== undefined) {
    query.priceMax = String(state.priceMax)
  }

  if (state.inStock !== null && state.inStock !== undefined) {
    query.inStock = String(state.inStock)
  }

  return query
}
