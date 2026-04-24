import { describe, it, expect } from 'bun:test'
import { getUserOrders } from '../app/services/orderService'
import type { Order } from '../app/types/order'

describe('getUserOrders', () => {
  it('should export getUserOrders function', () => {
    expect(typeof getUserOrders).toBe('function')
  })

  it('should return an array of orders', async () => {
    const orders = await getUserOrders()

    expect(Array.isArray(orders)).toBe(true)
    expect(orders.length).toBeGreaterThan(0)
  })

  it('should return orders sorted by createdAt descending', async () => {
    const orders = await getUserOrders()

    for (let i = 1; i < orders.length; i++) {
      const prev = new Date(orders[i - 1].createdAt).getTime()
      const curr = new Date(orders[i].createdAt).getTime()
      expect(prev).toBeGreaterThanOrEqual(curr)
    }
  })

  it('should return valid Order objects', async () => {
    const orders = await getUserOrders()

    orders.forEach((order: Order) => {
      expect(order.orderId).toBeDefined()
      expect(order.items).toBeDefined()
      expect(Array.isArray(order.items)).toBe(true)
      expect(order.total).toBeGreaterThanOrEqual(0)
      expect(order.status).toBeDefined()
      expect(order.createdAt).toBeDefined()
    })
  })
})
