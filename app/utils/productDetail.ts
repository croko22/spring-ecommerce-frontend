import type { Product } from '~/types/product'

export type AvailabilityState = {
  inStock: boolean
  label: string
  tone: 'in' | 'low' | 'out'
  maxQuantity: number
}

export function clampQuantity(value: number, max: number) {
  const safeMax = Math.max(1, Math.floor(max))
  const nextValue = Number.isFinite(value) ? Math.floor(value) : 1

  return Math.max(1, Math.min(safeMax, nextValue))
}

export function resolveAvailabilityState(product: Product | null): AvailabilityState {
  if (!product) {
    return {
      inStock: false,
      label: 'Sin disponibilidad',
      tone: 'out',
      maxQuantity: 1
    }
  }

  const hasStock = typeof product.stock === 'number' && Number.isFinite(product.stock)
  const stock = hasStock ? Math.max(0, Math.floor(product.stock as number)) : null
  const inStock = typeof product.inStock === 'boolean'
    ? product.inStock
    : stock === null
      ? true
      : stock > 0

  if (!inStock || stock === 0) {
    return {
      inStock: false,
      label: 'Agotado',
      tone: 'out',
      maxQuantity: 1
    }
  }

  if (stock !== null && stock <= 5) {
    return {
      inStock: true,
      label: `Quedan ${stock} unidades`,
      tone: 'low',
      maxQuantity: stock
    }
  }

  return {
    inStock: true,
    label: stock === null ? 'Disponible' : `${stock} unidades disponibles`,
    tone: 'in',
    maxQuantity: stock === null ? 10 : stock
  }
}
