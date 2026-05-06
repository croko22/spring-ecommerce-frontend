export type DocumentType = 'dni' | 'ruc'

export type ShippingMethod = 'standard' | 'express' | 'pickup'

export type ShippingOption = {
  id: ShippingMethod
  name: string
  description: string
  cost: number
  eta: string // e.g., "3-5 días", "24 horas"
}

export const SHIPPING_OPTIONS: ShippingOption[] = [
  { id: 'standard', name: 'Envío estándar', description: 'Entrega en 3-5 días hábiles', cost: 10, eta: '3-5 días' },
  { id: 'express', name: 'Envío exprés', description: 'Entrega en 24 horas', cost: 25, eta: '24 horas' },
  { id: 'pickup', name: 'Recojo en tienda', description: 'Recoge en nuestro local', cost: 0, eta: 'Hoy' }
]

export function getShippingOption(id: ShippingMethod): ShippingOption {
  return SHIPPING_OPTIONS.find(o => o.id === id) || SHIPPING_OPTIONS[0]!
}

export type ShippingAddress = {
  fullName: string
  documentType: DocumentType
  documentNumber: string
  address: string
  phone: string
  region: string
}

export type OrderItem = {
  productId: string
  name: string
  price: number
  quantity: number
}

export type OrderStatus = 'pending' | 'processing' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled'

export type CreditCardPayment = {
  cardNumber: string
  expiryDate: string
  cvv: string
  cardholderName: string
}

export type DiscountCode = {
  code: string
  type: 'percentage' | 'free_shipping'
  value: number
}

export const IGV_RATE = 0.18
export const SHIPPING_COST = 10

export type Order = {
  orderId: string
  items: OrderItem[]
  shipping: ShippingAddress
  subtotal: number
  igv: number
  shippingCost: number
  discount: number
  total: number
  status: OrderStatus
  createdAt: string
}

export type CreateOrderRequest = {
  items: OrderItem[]
  shipping: ShippingAddress
  paymentMethod: string
  discountCode?: string
  creditCard?: CreditCardPayment
}
