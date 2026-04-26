export type DashboardMetrics = {
  totalProducts: number
  totalOrders: number
  totalUsers: number
  totalRevenue: number
  recentOrders: number
  productsOutOfStock: number
}

export type AdminUser = {
  id: string
  name: string
  email: string
  role: string
  status: 'active' | 'inactive'
  createdAt: string
}

export type RevenueData = {
  month: string
  revenue: number
  orders: number
}
