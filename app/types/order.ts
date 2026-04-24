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

export type Order = {
  orderId: string
  items: OrderItem[]
  shipping: ShippingAddress
  subtotal: number
  shippingCost: number
  total: number
  status: OrderStatus
  createdAt: string
}

export type CreateOrderRequest = {
  items: OrderItem[]
  shipping: ShippingAddress
  paymentMethod: string
}
