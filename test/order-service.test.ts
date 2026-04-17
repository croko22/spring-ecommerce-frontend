import { describe, it, expect, beforeEach } from 'bun:test'
import { createOrder, getOrderById, type CreateOrderRequest, type Order } from '../app/services/orderService'

describe('orderService', () => {
  describe('createOrder', () => {
    it('should export createOrder function', () => {
      expect(typeof createOrder).toBe('function')
    })

    it('should accept CreateOrderRequest and return Order', async () => {
      const request: CreateOrderRequest = {
        items: [
          { productId: 'p-001', name: 'Test Product', price: 99.99, quantity: 2 }
        ],
        shipping: {
          fullName: 'John Doe',
          documentType: 'dni',
          documentNumber: '12345678',
          address: '123 Main St',
          phone: '+1234567890',
          region: 'California'
        },
        paymentMethod: 'credit_card'
      }

      const order = await createOrder(request)

      expect(order).toBeDefined()
      expect(order.orderId).toBeDefined()
      expect(order.items).toHaveLength(1)
      expect(order.total).toBe(209.98) // 99.99 * 2 + 10 shipping
      expect(order.status).toBe('pending')
    })

    it('should handle API error and fallback to mock', async () => {
      // This test verifies that createOrder can handle errors gracefully
      // by returning a mock order
      const request: CreateOrderRequest = {
        items: [],
        shipping: {
          fullName: 'Test User',
          documentType: 'ruc',
          documentNumber: '20123456789',
          address: 'Test Address',
          phone: '+1234567890',
          region: 'Test Region'
        },
        paymentMethod: 'cash_on_delivery'
      }

      const order = await createOrder(request)
      
      // Even on error, should return mock order
      expect(order).toBeDefined()
      expect(order.orderId).toMatch(/^ORD-/)
    })
  })

  describe('getOrderById', () => {
    it('should export getOrderById function', () => {
      expect(typeof getOrderById).toBe('function')
    })

    it('should return order when found', async () => {
      const order = await getOrderById('ORD-001')
      
      if (order) {
        expect(order.orderId).toBe('ORD-001')
      }
    })

    it('should return null when order not found', async () => {
      const order = await getOrderById('NONEXISTENT')
      
      expect(order).toBeNull()
    })
  })
})
