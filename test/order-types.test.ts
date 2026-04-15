import { describe, it, expect } from 'bun:test'
import type { ShippingAddress, OrderItem, Order, CreateOrderRequest, OrderStatus } from '../app/types/order'

describe('order types', () => {
  it('should export ShippingAddress type', () => {
    const address: ShippingAddress = {
      fullName: 'John Doe',
      documentType: 'dni',
      documentNumber: '12345678',
      address: '123 Main St',
      phone: '+1234567890',
      region: 'California'
    }
    expect(address.fullName).toBe('John Doe')
    expect(address.documentType).toBe('dni')
  })

  it('should export OrderItem type', () => {
    const item: OrderItem = {
      productId: 'p-001',
      name: 'Test Product',
      price: 99.99,
      quantity: 2
    }
    expect(item.productId).toBe('p-001')
    expect(item.quantity).toBe(2)
  })

  it('should export Order type', () => {
    const order: Order = {
      orderId: 'ORD-001',
      items: [],
      shipping: {
        fullName: 'John Doe',
        documentType: 'dni',
        documentNumber: '12345678',
        address: '123 Main St',
        phone: '+1234567890',
        region: 'California'
      },
      subtotal: 99.99,
      shippingCost: 10,
      total: 109.99,
      status: 'pending',
      createdAt: '2024-01-01T00:00:00Z'
    }
    expect(order.orderId).toBe('ORD-001')
    expect(order.status).toBe('pending')
  })

  it('should export CreateOrderRequest type', () => {
    const request: CreateOrderRequest = {
      items: [],
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
    expect(request.paymentMethod).toBe('credit_card')
  })

  it('should export OrderStatus type', () => {
    const statuses: OrderStatus[] = ['pending', 'confirmed', 'shipped', 'delivered']
    expect(statuses).toContain('pending')
    expect(statuses).toContain('confirmed')
    expect(statuses).toContain('shipped')
    expect(statuses).toContain('delivered')
  })
})
