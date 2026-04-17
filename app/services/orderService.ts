import type { Order, CreateOrderRequest, OrderItem, ShippingAddress } from '~/types/order'

const MOCK_ORDERS: Order[] = [
  {
    orderId: 'ORD-001',
    items: [
      { productId: 'p-001', name: 'Aurora Running Shoes', price: 89.9, quantity: 1 }
    ],
    shipping: {
      fullName: 'Test User',
      documentType: 'dni',
      documentNumber: '12345678',
      address: '123 Test St',
      phone: '+1234567890',
      region: 'California'
    },
    subtotal: 89.9,
    shippingCost: 10,
    total: 99.9,
    status: 'pending',
    createdAt: '2024-01-01T00:00:00Z'
  }
]

type OrderApiResponse = {
  orderId?: string
  status?: string
  total?: number
  items?: unknown[]
  shipping?: unknown
  subtotal?: number
  shippingCost?: number
  createdAt?: string
}

function normalizeShippingAddress(entry: unknown): ShippingAddress {
  if (!entry || typeof entry !== 'object') {
    return {
      fullName: '',
      documentType: 'dni',
      documentNumber: '',
      address: '',
      phone: '',
      region: ''
    }
  }

  const shipping = entry as Record<string, unknown>
  return {
    fullName: String(shipping.fullName ?? ''),
    documentType: (shipping.documentType === 'ruc' ? 'ruc' : 'dni') as 'dni' | 'ruc',
    documentNumber: String(shipping.documentNumber ?? ''),
    address: String(shipping.address ?? ''),
    phone: String(shipping.phone ?? ''),
    region: String(shipping.region ?? '')
  }
}

function normalizeOrderItem(entry: unknown): OrderItem | null {
  if (!entry || typeof entry !== 'object') {
    return null
  }

  const item = entry as Record<string, unknown>
  const productId = String(item.productId ?? item.id ?? '').trim()
  const name = String(item.name ?? '').trim()

  if (!productId || !name) {
    return null
  }

  return {
    productId,
    name,
    price: Number(item.price ?? item.amount ?? 0),
    quantity: Number(item.quantity ?? 1)
  }
}

function normalizeOrder(entry: unknown): Order | null {
  if (!entry || typeof entry !== 'object') {
    return null
  }

  const order = entry as Record<string, unknown>
  const orderId = String(order.orderId ?? order.id ?? '').trim()

  if (!orderId) {
    return null
  }

  const rawItems = Array.isArray(order.items) ? order.items : []
  const items = rawItems.map(normalizeOrderItem).filter((item): item is OrderItem => Boolean(item))

  return {
    orderId,
    items,
    shipping: normalizeShippingAddress(order.shipping),
    subtotal: Number(order.subtotal ?? order.total ?? 0),
    shippingCost: Number(order.shippingCost ?? 0),
    total: Number(order.total ?? 0),
    status: (order.status === 'confirmed' || order.status === 'shipped' || order.status === 'delivered'
      ? order.status
      : 'pending') as Order['status'],
    createdAt: String(order.createdAt ?? new Date().toISOString())
  }
}

async function submitOrderToApi(request: CreateOrderRequest): Promise<Order | null> {
  try {
    const { data, error } = await useApiFetch<OrderApiResponse>('/orders', {
      method: 'POST',
      body: {
        items: request.items,
        shipping: request.shipping,
        paymentMethod: request.paymentMethod
      }
    })

    if (error.value || !data.value) {
      return null
    }

    const orderId = String(data.value.orderId ?? `ORD-${Date.now()}`)
    const items = request.items
    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
    const shippingCost = 10
    const total = subtotal + shippingCost

    return {
      orderId,
      items,
      shipping: request.shipping,
      subtotal,
      shippingCost,
      total,
      status: 'pending',
      createdAt: new Date().toISOString()
    }
  } catch {
    return null
  }
}

async function fetchOrderFromApi(id: string): Promise<Order | null> {
  try {
    const { data, error } = await useApiFetch<unknown>(`/orders/${id}`, {
      method: 'GET'
    })

    if (error.value || !data.value) {
      return null
    }

    return normalizeOrder(data.value)
  } catch {
    return null
  }
}

function generateMockOrder(request: CreateOrderRequest): Order {
  const items = request.items
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const shippingCost = 10
  const total = subtotal + shippingCost

  return {
    orderId: `ORD-${Date.now()}`,
    items,
    shipping: request.shipping,
    subtotal,
    shippingCost,
    total,
    status: 'pending',
    createdAt: new Date().toISOString()
  }
}

export async function createOrder(request: CreateOrderRequest): Promise<Order> {
  const apiResult = await submitOrderToApi(request)

  if (apiResult) {
    return apiResult
  }

  return generateMockOrder(request)
}

export async function getOrderById(id: string): Promise<Order | null> {
  const safeId = String(id).trim()

  if (!safeId) {
    return null
  }

  const apiResult = await fetchOrderFromApi(safeId)

  if (apiResult) {
    return apiResult
  }

  return MOCK_ORDERS.find(order => order.orderId === safeId) ?? null
}
