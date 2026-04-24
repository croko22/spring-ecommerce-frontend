import type { Order } from '~/types/order'
import { getUserOrders as getUserOrdersService } from '~/services/orderService'

export function useUserOrders() {
  const orders = useState<Order[]>('user.orders', () => [])
  const isLoading = useState<boolean>('user.orders-loading', () => false)
  const error = useState<string>('user.orders-error', () => '')

  async function fetchOrders() {
    isLoading.value = true
    error.value = ''

    try {
      const data = await getUserOrdersService()
      orders.value = data
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Error al cargar las ordenes'
    } finally {
      isLoading.value = false
    }
  }

  function getOrderById(id: string): Order | undefined {
    return orders.value.find(order => order.orderId === id)
  }

  return {
    orders: readonly(orders),
    isLoading: readonly(isLoading),
    error: readonly(error),
    fetchOrders,
    getOrderById
  }
}
