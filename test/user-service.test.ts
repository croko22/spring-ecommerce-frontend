import { describe, it, expect } from 'bun:test'
import { getUserProfile, updateUserProfile } from '../app/services/userService'
import type { UpdateUserProfileRequest } from '../app/types/user'

describe('userService', () => {
  describe('getUserProfile', () => {
    it('should export getUserProfile function', () => {
      expect(typeof getUserProfile).toBe('function')
    })

    it('should return a UserProfile', async () => {
      const profile = await getUserProfile()

      expect(profile).toBeDefined()
      expect(profile.id).toBeDefined()
      expect(profile.name).toBeDefined()
      expect(profile.email).toBeDefined()
      expect(profile.role).toBeDefined()
      expect(profile.phone).toBeDefined()
      expect(profile.address).toBeDefined()
    })
  })

  describe('updateUserProfile', () => {
    it('should export updateUserProfile function', () => {
      expect(typeof updateUserProfile).toBe('function')
    })

    it('should accept UpdateUserProfileRequest and return updated UserProfile', async () => {
      const request: UpdateUserProfileRequest = {
        name: 'Updated Name',
        phone: '+51999999999',
        address: 'New Address 123'
      }

      const profile = await updateUserProfile(request)

      expect(profile).toBeDefined()
      expect(profile.name).toBe('Updated Name')
      expect(profile.phone).toBe('+51999999999')
      expect(profile.address).toBe('New Address 123')
    })
  })
})
