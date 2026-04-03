import type { ProductQueryState } from '~/types/product'

export const PRODUCT_DEFAULT_PAGE_SIZE = 12

function parsePositiveInt(value: unknown, fallback: number): number {
  const parsed = Number(value)
  return Number.isFinite(parsed) && parsed > 0 ? Math.floor(parsed) : fallback
}

export function parseProductQuery(
  query: Record<string, unknown>,
  defaultPageSize: number = PRODUCT_DEFAULT_PAGE_SIZE
): ProductQueryState {
  return {
    search: String(query.q ?? '').trim(),
    category: String(query.category ?? '').trim(),
    page: parsePositiveInt(query.page, 1),
    size: parsePositiveInt(query.size, defaultPageSize)
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

  return query
}
