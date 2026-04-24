import type { Order, CreateOrderRequest, OrderItem, ShippingAddress } from '~/types/order'

const MOCK_ORDERS: Order[] = [
  {
    orderId: 'ORD-001',
    items: [
      { productId: 'p-001', name: 'Aurora Running Shoes', price: 89.9, quantity: 1 }
    ],
    shipping: {
      fullName: 'Juan Perez',
      documentType: 'dni',
      documentNumber: '12345678',
      address: 'Av. Javier Prado 123, Lima',
      phone: '+51987654321',
      region: 'Lima'
    },
    subtotal: 89.9,
    shippingCost: 10,
    total: 99.9,
    status: 'delivered',
    createdAt: '2024-01-15T10:30:00Z'
  },
  {
    orderId: 'ORD-002',
    items: [
      { productId: 'p-002', name: 'Urban Backpack', price: 45.5, quantity: 2 },
      { productId: 'p-003', name: 'Wireless Earbuds', price: 35.0, quantity: 1 }
    ],
    shipping: {
      fullName: 'Juan Perez',
      documentType: 'dni',
      documentNumber: '12345678',
      address: 'Av. Javier Prado 123, Lima',
      phone: '+51987654321',
      region: 'Lima'
    },
    subtotal: 126.0,
    shippingCost: 10,
    total: 136.0,
    status: 'shipped',
    createdAt: '2024-02-20T14:15:00Z'
  },
  {
    orderId: 'ORD-003',
    items: [
      { productId: 'p-004', name: 'Smart Watch Pro', price: 199.0, quantity: 1 }
    ],
    shipping: {
      fullName: 'Juan Perez',
      documentType: 'dni',
      documentNumber: '12345678',
      address: 'Av. Javier Prado 123, Lima',
      phone: '+51987654321',
      region: 'Lima'
    },
    subtotal: 199.0,
    shippingCost: 10,
    total: 209.0,
    status: 'processing',
    createdAt: '2024-03-10T09:00:00Z'
  },
  {
    orderId: 'ORD-004',
    items: [
      { productId: 'p-005', name: 'Running Socks Pack', price: 12.99, quantity: 3 }
    ],
    shipping: {
      fullName: 'Juan Perez',
      documentType: 'dni',
      documentNumber: '12345678',
      address: 'Av. Javier Prado 123, Lima',
      phone: '+51987654321',
      region: 'Lima'
    },
    subtotal: 38.97,
    shippingCost: 10,
    total: 48.97,
    status: 'cancelled',
    createdAt: '2024-03-25T16:45:00Z'
  },
  {
    orderId: 'ORD-005',
    items: [
      { productId: 'p-006', name: 'Yoga Mat Premium', price: 55.0, quantity: 1 },
      { productId: 'p-007', name: 'Water Bottle 1L', price: 18.5, quantity: 2 }
    ],
    shipping: {
      fullName: 'Juan Perez',
      documentType: 'dni',
      documentNumber: '12345678',
      address: 'Av. Javier Prado 123, Lima',
      phone: '+51987654321',
      region: 'Lima'
    },
    subtotal: 92.0,
    shippingCost: 10,
    total: 102.0,
    status: 'confirmed',
    createdAt: '2024-04-05T11:20:00Z'
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
    status: (['pending', 'processing', 'confirmed', 'shipped', 'delivered', 'cancelled'].includes(
      String(order.status)
    )
      ? String(order.status)
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

async function fetchUserOrdersFromApi(): Promise<Order[]> {
  try {
    const { data, error } = await useApiFetch<unknown[]>('/orders', {
      method: 'GET'
    })

    if (error.value || !data.value) {
      return []
    }

    return data.value.map(normalizeOrder).filter((order): order is Order => Boolean(order))
  } catch {
    return []
  }
}

export async function getUserOrders(): Promise<Order[]> {
  const apiResult = await fetchUserOrdersFromApi()

  if (apiResult.length > 0) {
    return apiResult
  }

  return [...MOCK_ORDERS].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )
}
