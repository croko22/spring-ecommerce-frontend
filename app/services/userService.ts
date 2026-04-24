import type { UserProfile, UpdateUserProfileRequest } from '~/types/user'

const MOCK_USER: UserProfile = {
  id: 'u-001',
  name: 'Juan Perez',
  email: 'juan.perez@example.com',
  role: 'USER',
  phone: '+51987654321',
  address: 'Av. Javier Prado 123, Lima'
}

type UserApiResponse = {
  id?: number | string
  username?: string
  name?: string
  email?: string
  role?: string
  phone?: string
  address?: string
}

function normalizeUserProfile(entry: unknown): UserProfile | null {
  if (!entry || typeof entry !== 'object') {
    return null
  }

  const data = entry as Record<string, unknown>
  const id = String(data.id ?? data.userId ?? '').trim()
  const name = String(data.name ?? data.username ?? '').trim()
  const email = String(data.email ?? '').trim()

  if (!id || !email) {
    return null
  }

  return {
    id,
    name: name || email.split('@')[0] || '',
    email,
    role: String(data.role ?? 'USER'),
    phone: String(data.phone ?? MOCK_USER.phone),
    address: String(data.address ?? MOCK_USER.address)
  }
}

async function fetchUserProfileFromApi(): Promise<UserProfile | null> {
  try {
    const { data, error } = await useApiFetch<UserApiResponse>('/auth/me', {
      method: 'GET'
    })

    if (error.value || !data.value) {
      return null
    }

    return normalizeUserProfile(data.value)
  } catch {
    return null
  }
}

async function updateUserProfileInApi(
  request: UpdateUserProfileRequest
): Promise<UserProfile | null> {
  try {
    const { data, error } = await useApiFetch<UserApiResponse>('/users/profile', {
      method: 'PUT',
      body: request
    })

    if (error.value || !data.value) {
      return null
    }

    return normalizeUserProfile(data.value)
  } catch {
    return null
  }
}

export async function getUserProfile(): Promise<UserProfile> {
  const apiResult = await fetchUserProfileFromApi()

  if (apiResult) {
    return apiResult
  }

  return { ...MOCK_USER }
}

export async function updateUserProfile(
  request: UpdateUserProfileRequest
): Promise<UserProfile> {
  const apiResult = await updateUserProfileInApi(request)

  if (apiResult) {
    return apiResult
  }

  return {
    ...MOCK_USER,
    name: request.name,
    phone: request.phone,
    address: request.address
  }
}
