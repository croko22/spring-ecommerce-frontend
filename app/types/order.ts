export type DocumentType = 'dni' | 'ruc'

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
