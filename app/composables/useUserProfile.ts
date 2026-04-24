import type { UserProfile, UpdateUserProfileRequest } from '~/types/user'
import { getUserProfile, updateUserProfile as updateUserProfileService } from '~/services/userService'

export function useUserProfile() {
  const profile = useState<UserProfile | null>('user.profile', () => null)
  const isLoading = useState<boolean>('user.profile-loading', () => false)
  const isSaving = useState<boolean>('user.profile-saving', () => false)
  const error = useState<string>('user.profile-error', () => '')

  async function fetchProfile() {
    isLoading.value = true
    error.value = ''

    try {
      const data = await getUserProfile()
      profile.value = data
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Error al cargar el perfil'
    } finally {
      isLoading.value = false
    }
  }

  async function updateProfile(request: UpdateUserProfileRequest) {
    isSaving.value = true
    error.value = ''

    try {
      const data = await updateUserProfileService(request)
      profile.value = data
      return data
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Error al actualizar el perfil'
      throw err
    } finally {
      isSaving.value = false
    }
  }

  return {
    profile: readonly(profile),
    isLoading: readonly(isLoading),
    isSaving: readonly(isSaving),
    error: readonly(error),
    fetchProfile,
    updateProfile
  }
}
