import { describe, it, expect } from 'bun:test'
import type { UserProfile, UpdateUserProfileRequest } from '../app/types/user'

describe('user types', () => {
  it('should export UserProfile type', () => {
    const profile: UserProfile = {
      id: 'u-001',
      name: 'Juan Perez',
      email: 'juan@example.com',
      role: 'USER',
      phone: '+51987654321',
      address: 'Av. Javier Prado 123, Lima'
    }
    expect(profile.id).toBe('u-001')
    expect(profile.name).toBe('Juan Perez')
    expect(profile.email).toBe('juan@example.com')
    expect(profile.role).toBe('USER')
    expect(profile.phone).toBe('+51987654321')
    expect(profile.address).toBe('Av. Javier Prado 123, Lima')
  })

  it('should export UpdateUserProfileRequest type', () => {
    const request: UpdateUserProfileRequest = {
      name: 'Juan P.',
      phone: '+51999999999',
      address: 'Calle Nueva 456'
    }
    expect(request.name).toBe('Juan P.')
    expect(request.phone).toBe('+51999999999')
    expect(request.address).toBe('Calle Nueva 456')
  })
})
