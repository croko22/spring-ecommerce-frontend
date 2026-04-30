import { IGV_RATE, SHIPPING_COST, type DiscountCode } from '~/types/order'

export { IGV_RATE, SHIPPING_COST }

export function calculateIgv(subtotal: number): number {
  return Math.round(subtotal * IGV_RATE * 100) / 100
}

export function calculateShippingCost(discount?: DiscountCode | null): number {
  if (discount && discount.type === 'free_shipping') {
    return 0
  }
  return SHIPPING_COST
}

export function calculateDiscountAmount(subtotal: number, discount?: DiscountCode | null): number {
  if (!discount) return 0
  if (discount.type === 'percentage') {
    return Math.round(subtotal * (discount.value / 100) * 100) / 100
  }
  return 0
}

export function calculateOrderTotal(params: {
  subtotal: number
  discount?: DiscountCode | null
}): number {
  const { subtotal, discount } = params
  const discountAmount = calculateDiscountAmount(subtotal, discount)
  const discountedSubtotal = subtotal - discountAmount
  const igv = calculateIgv(discountedSubtotal)
  const shipping = calculateShippingCost(discount)
  return Math.round((discountedSubtotal + igv + shipping) * 100) / 100
}
