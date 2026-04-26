import type { Product } from '~/types/product'
import type { Order } from '~/types/order'
import type { DashboardMetrics, AdminUser, RevenueData } from '~/types/admin'

const MOCK_DASHBOARD: DashboardMetrics = {
  totalProducts: 18,
  totalOrders: 45,
  totalUsers: 12,
  totalRevenue: 4589.50,
  recentOrders: 5,
  productsOutOfStock: 2
}

const MOCK_ADMIN_USERS: AdminUser[] = [
  { id: 'u-001', name: 'Juan Perez', email: 'juan.perez@example.com', role: 'USER', status: 'active', createdAt: '2024-01-10T08:00:00Z' },
  { id: 'u-002', name: 'Maria Garcia', email: 'maria.garcia@example.com', role: 'ADMIN', status: 'active', createdAt: '2024-01-15T09:00:00Z' },
  { id: 'u-003', name: 'Carlos Lopez', email: 'carlos.lopez@example.com', role: 'USER', status: 'active', createdAt: '2024-02-01T10:00:00Z' },
  { id: 'u-004', name: 'Ana Torres', email: 'ana.torres@example.com', role: 'USER', status: 'inactive', createdAt: '2024-02-10T11:00:00Z' },
  { id: 'u-005', name: 'Pedro Sanchez', email: 'pedro.sanchez@example.com', role: 'USER', status: 'active', createdAt: '2024-03-05T12:00:00Z' },
  { id: 'u-006', name: 'Lucia Fernandez', email: 'lucia.fernandez@example.com', role: 'ADMIN', status: 'active', createdAt: '2024-03-15T13:00:00Z' },
  { id: 'u-007', name: 'Diego Ramirez', email: 'diego.ramirez@example.com', role: 'USER', status: 'active', createdAt: '2024-04-01T14:00:00Z' },
  { id: 'u-008', name: 'Sofia Martinez', email: 'sofia.martinez@example.com', role: 'USER', status: 'inactive', createdAt: '2024-04-20T15:00:00Z' },
  { id: 'u-009', name: 'Jorge Castillo', email: 'jorge.castillo@example.com', role: 'USER', status: 'active', createdAt: '2024-05-01T16:00:00Z' },
  { id: 'u-010', name: 'Valeria Ortiz', email: 'valeria.ortiz@example.com', role: 'USER', status: 'active', createdAt: '2024-05-15T17:00:00Z' },
  { id: 'u-011', name: 'Miguel Navarro', email: 'miguel.navarro@example.com', role: 'USER', status: 'active', createdAt: '2024-06-01T18:00:00Z' },
  { id: 'u-012', name: 'Elena Rios', email: 'elena.rios@example.com', role: 'USER', status: 'active', createdAt: '2024-06-10T19:00:00Z' }
]

const MOCK_REVENUE_DATA: RevenueData[] = [
  { month: 'Ene', revenue: 1200, orders: 8 },
  { month: 'Feb', revenue: 980, orders: 6 },
  { month: 'Mar', revenue: 1500, orders: 10 },
  { month: 'Abr', revenue: 1100, orders: 7 },
  { month: 'May', revenue: 1350, orders: 9 },
  { month: 'Jun', revenue: 1450, orders: 11 }
]

let MOCK_PRODUCTS_STATE: Product[] = [
  { id: 'p-001', name: 'Aurora Running Shoes', description: 'Lightweight trainers with breathable mesh and cushioned sole.', price: 89.9, currency: 'USD', imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80', category: 'Footwear', stock: 12, rating: 4.5 },
  { id: 'p-002', name: 'Summit Trail Jacket', description: 'Water-resistant shell made for windy afternoon hikes.', price: 119.5, currency: 'USD', imageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=80', category: 'Apparel', stock: 8, rating: 4.2 },
  { id: 'p-003', name: 'North Peak Backpack', description: '28L everyday backpack with laptop sleeve and side pockets.', price: 74, currency: 'USD', imageUrl: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80', category: 'Accessories', stock: 0, rating: 3.9 },
  { id: 'p-004', name: 'Wave Wireless Headphones', description: 'Over-ear headphones with active noise cancellation.', price: 159, currency: 'USD', imageUrl: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=900&q=80', category: 'Electronics', stock: 25, rating: 4.7 },
  { id: 'p-005', name: 'Eclipse Smartwatch', description: 'Fitness and sleep tracking with 7-day battery life.', price: 199, currency: 'USD', imageUrl: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=900&q=80', category: 'Electronics', stock: 5, rating: 4.1 },
  { id: 'p-006', name: 'Luna Ceramic Bottle', description: 'Insulated bottle that keeps drinks cold for 24 hours.', price: 34, currency: 'USD', imageUrl: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=900&q=80', category: 'Home', stock: 50, rating: 4.3 },
  { id: 'p-007', name: 'Granite Chef Knife', description: '8-inch high-carbon steel knife with walnut handle.', price: 62, currency: 'USD', imageUrl: 'https://images.unsplash.com/photo-1593618998160-5fbf4f45863b?auto=format&fit=crop&w=900&q=80', category: 'Home', stock: 3, rating: 4.8 },
  { id: 'p-008', name: 'Studio Desk Lamp', description: 'Adjustable warm LED lamp with touch dimmer.', price: 45.5, currency: 'USD', imageUrl: 'https://images.unsplash.com/photo-1519710164239-da123dc03ef4?auto=format&fit=crop&w=900&q=80', category: 'Home', stock: 15, rating: 4.0 },
  { id: 'p-009', name: 'Nimbus Hoodie', description: 'Midweight fleece hoodie with oversized front pocket.', price: 58, currency: 'USD', imageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=80', category: 'Apparel', stock: 7, rating: 3.7 },
  { id: 'p-010', name: 'Vertex Sunglasses', description: 'Polarized lenses and lightweight acetate frame.', price: 77, currency: 'USD', imageUrl: 'https://images.unsplash.com/photo-1511497584788-876760111969?auto=format&fit=crop&w=900&q=80', category: 'Accessories', stock: 20, rating: 4.4 },
  { id: 'p-011', name: 'City Commuter Bike Helmet', description: 'Ventilated urban helmet with magnetic buckle.', price: 68, currency: 'USD', imageUrl: 'https://images.unsplash.com/photo-1519583272095-6433daf26b6e?auto=format&fit=crop&w=900&q=80', category: 'Sports', stock: 4, rating: 4.6 },
  { id: 'p-012', name: 'Pulse Yoga Mat', description: 'Extra-grip surface and 6 mm comfortable thickness.', price: 39, currency: 'USD', imageUrl: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&w=900&q=80', category: 'Sports', stock: 0, rating: 3.5 },
  { id: 'p-013', name: 'Brew Pour-Over Set', description: 'Glass dripper and server for manual coffee brewing.', price: 52, currency: 'USD', imageUrl: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=900&q=80', category: 'Home', stock: 9, rating: 4.2 },
  { id: 'p-014', name: 'Orbit Phone Stand', description: 'Foldable aluminum stand for desk and video calls.', price: 24, currency: 'USD', imageUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=900&q=80', category: 'Electronics', stock: 100, rating: 3.9 },
  { id: 'p-015', name: 'Harbor Chino Pants', description: 'Tapered fit stretch chinos for everyday wear.', price: 64, currency: 'USD', imageUrl: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?auto=format&fit=crop&w=900&q=80', category: 'Apparel', stock: 2, rating: 4.1 },
  { id: 'p-016', name: 'Atlas Weekender Bag', description: 'Canvas duffel with shoe compartment and shoulder strap.', price: 98, currency: 'USD', imageUrl: 'https://images.unsplash.com/photo-1547949003-9792a18a2601?auto=format&fit=crop&w=900&q=80', category: 'Accessories', stock: 6, rating: 4.5 },
  { id: 'p-017', name: 'Seaside Linen Shirt', description: 'Breathable linen shirt cut in relaxed fit.', price: 55, currency: 'USD', imageUrl: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=900&q=80', category: 'Apparel', stock: 11, rating: 3.8 },
  { id: 'p-018', name: 'Metro Wallet', description: 'Slim leather wallet with RFID blocking pocket.', price: 41, currency: 'USD', imageUrl: 'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=900&q=80', category: 'Accessories', stock: 30, rating: 4.3 }
]

let MOCK_ORDERS_STATE: Order[] = [
  { orderId: 'ORD-001', items: [{ productId: 'p-001', name: 'Aurora Running Shoes', price: 89.9, quantity: 1 }], shipping: { fullName: 'Juan Perez', documentType: 'dni', documentNumber: '12345678', address: 'Av. Javier Prado 123, Lima', phone: '+51987654321', region: 'Lima' }, subtotal: 89.9, shippingCost: 10, total: 99.9, status: 'delivered', createdAt: '2024-01-15T10:30:00Z' },
  { orderId: 'ORD-002', items: [{ productId: 'p-002', name: 'Urban Backpack', price: 45.5, quantity: 2 }, { productId: 'p-003', name: 'Wireless Earbuds', price: 35.0, quantity: 1 }], shipping: { fullName: 'Juan Perez', documentType: 'dni', documentNumber: '12345678', address: 'Av. Javier Prado 123, Lima', phone: '+51987654321', region: 'Lima' }, subtotal: 126.0, shippingCost: 10, total: 136.0, status: 'shipped', createdAt: '2024-02-20T14:15:00Z' },
  { orderId: 'ORD-003', items: [{ productId: 'p-004', name: 'Smart Watch Pro', price: 199.0, quantity: 1 }], shipping: { fullName: 'Juan Perez', documentType: 'dni', documentNumber: '12345678', address: 'Av. Javier Prado 123, Lima', phone: '+51987654321', region: 'Lima' }, subtotal: 199.0, shippingCost: 10, total: 209.0, status: 'processing', createdAt: '2024-03-10T09:00:00Z' },
  { orderId: 'ORD-004', items: [{ productId: 'p-005', name: 'Running Socks Pack', price: 12.99, quantity: 3 }], shipping: { fullName: 'Ana Torres', documentType: 'dni', documentNumber: '87654321', address: 'Av. Larco 456, Lima', phone: '+51911223344', region: 'Lima' }, subtotal: 38.97, shippingCost: 10, total: 48.97, status: 'cancelled', createdAt: '2024-03-25T16:45:00Z' },
  { orderId: 'ORD-005', items: [{ productId: 'p-006', name: 'Yoga Mat Premium', price: 55.0, quantity: 1 }, { productId: 'p-007', name: 'Water Bottle 1L', price: 18.5, quantity: 2 }], shipping: { fullName: 'Maria Garcia', documentType: 'dni', documentNumber: '55667788', address: 'Av. La Marina 789, Lima', phone: '+51999887766', region: 'Lima' }, subtotal: 92.0, shippingCost: 10, total: 102.0, status: 'confirmed', createdAt: '2024-04-05T11:20:00Z' },
  { orderId: 'ORD-006', items: [{ productId: 'p-008', name: 'Studio Desk Lamp', price: 45.5, quantity: 1 }], shipping: { fullName: 'Carlos Lopez', documentType: 'dni', documentNumber: '11223344', address: 'Jr. Union 321, Lima', phone: '+51955443322', region: 'Lima' }, subtotal: 45.5, shippingCost: 10, total: 55.5, status: 'pending', createdAt: '2024-04-10T08:15:00Z' },
  { orderId: 'ORD-007', items: [{ productId: 'p-009', name: 'Nimbus Hoodie', price: 58.0, quantity: 2 }], shipping: { fullName: 'Pedro Sanchez', documentType: 'dni', documentNumber: '99887766', address: 'Av. Arequipa 567, Lima', phone: '+51944332211', region: 'Lima' }, subtotal: 116.0, shippingCost: 10, total: 126.0, status: 'processing', createdAt: '2024-04-15T14:30:00Z' },
  { orderId: 'ORD-008', items: [{ productId: 'p-010', name: 'Vertex Sunglasses', price: 77.0, quantity: 1 }, { productId: 'p-011', name: 'City Commuter Bike Helmet', price: 68.0, quantity: 1 }], shipping: { fullName: 'Lucia Fernandez', documentType: 'dni', documentNumber: '55443322', address: 'Av. Primavera 890, Lima', phone: '+51933221144', region: 'Lima' }, subtotal: 145.0, shippingCost: 10, total: 155.0, status: 'shipped', createdAt: '2024-05-01T10:00:00Z' },
  { orderId: 'ORD-009', items: [{ productId: 'p-012', name: 'Pulse Yoga Mat', price: 39.0, quantity: 1 }], shipping: { fullName: 'Diego Ramirez', documentType: 'dni', documentNumber: '33221144', address: 'Av. Benavides 234, Lima', phone: '+51922114433', region: 'Lima' }, subtotal: 39.0, shippingCost: 10, total: 49.0, status: 'pending', createdAt: '2024-05-10T09:45:00Z' },
  { orderId: 'ORD-010', items: [{ productId: 'p-013', name: 'Brew Pour-Over Set', price: 52.0, quantity: 2 }], shipping: { fullName: 'Valeria Ortiz', documentType: 'dni', documentNumber: '66778899', address: 'Jr. Camana 123, Lima', phone: '+51911002233', region: 'Lima' }, subtotal: 104.0, shippingCost: 10, total: 114.0, status: 'confirmed', createdAt: '2024-05-20T16:00:00Z' },
  { orderId: 'ORD-011', items: [{ productId: 'p-014', name: 'Orbit Phone Stand', price: 24.0, quantity: 3 }], shipping: { fullName: 'Jorge Castillo', documentType: 'dni', documentNumber: '44556677', address: 'Av. Universitaria 456, Lima', phone: '+51999887700', region: 'Lima' }, subtotal: 72.0, shippingCost: 10, total: 82.0, status: 'delivered', createdAt: '2024-06-01T11:30:00Z' },
  { orderId: 'ORD-012', items: [{ productId: 'p-015', name: 'Harbor Chino Pants', price: 64.0, quantity: 1 }, { productId: 'p-016', name: 'Atlas Weekender Bag', price: 98.0, quantity: 1 }], shipping: { fullName: 'Sofia Martinez', documentType: 'dni', documentNumber: '22334455', address: 'Av. Salaverry 789, Lima', phone: '+51988776655', region: 'Lima' }, subtotal: 162.0, shippingCost: 10, total: 172.0, status: 'cancelled', createdAt: '2024-06-10T13:15:00Z' }
]

export async function getDashboardMetrics(): Promise<DashboardMetrics> {
  return { ...MOCK_DASHBOARD }
}

export async function getRevenueData(): Promise<RevenueData[]> {
  return [...MOCK_REVENUE_DATA]
}

export async function getAdminUsers(): Promise<AdminUser[]> {
  return [...MOCK_ADMIN_USERS]
}

export async function updateUserRole(userId: string, newRole: string): Promise<void> {
  const user = MOCK_ADMIN_USERS.find(u => u.id === userId)
  if (user) {
    user.role = newRole
  }
}

export async function toggleUserStatus(userId: string): Promise<void> {
  const user = MOCK_ADMIN_USERS.find(u => u.id === userId)
  if (user) {
    user.status = user.status === 'active' ? 'inactive' : 'active'
  }
}

export async function getAdminProducts(): Promise<Product[]> {
  return [...MOCK_PRODUCTS_STATE]
}

export async function createAdminProduct(product: Omit<Product, 'id'>): Promise<Product> {
  const newProduct: Product = {
    ...product,
    id: `p-${String(MOCK_PRODUCTS_STATE.length + 1).padStart(3, '0')}`
  }
  MOCK_PRODUCTS_STATE.push(newProduct)
  return newProduct
}

export async function updateAdminProduct(id: string, updates: Partial<Product>): Promise<Product | null> {
  const index = MOCK_PRODUCTS_STATE.findIndex(p => p.id === id)
  if (index === -1) return null
  const updated = { ...MOCK_PRODUCTS_STATE[index], ...updates } as Product
  MOCK_PRODUCTS_STATE[index] = updated
  return updated
}

export async function deleteAdminProduct(id: string): Promise<void> {
  MOCK_PRODUCTS_STATE = MOCK_PRODUCTS_STATE.filter(p => p.id !== id)
}

export async function getAdminOrders(): Promise<Order[]> {
  return [...MOCK_ORDERS_STATE]
}

export async function updateOrderStatus(orderId: string, status: Order['status']): Promise<void> {
  const order = MOCK_ORDERS_STATE.find(o => o.orderId === orderId)
  if (order) {
    order.status = status
  }
}
