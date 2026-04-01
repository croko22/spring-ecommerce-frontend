import { loginWithCredentials, registerWithCredentials } from '~/composables/useAuthApi'
import { extractAuthTokenBundle, extractUserFromToken, type AuthUser } from '~/utils/authToken'

type LoginInput = {
  email: string
  password: string
}

type RegisterInput = {
  name: string
  email: string
  password: string
}

type AuthStatus = 'idle' | 'loading' | 'authenticated' | 'guest'

const TOKEN_KEY = 'auth.token'
const REFRESH_TOKEN_KEY = 'auth.refresh-token'

export function useAuthState() {
  const token = useCookie<string | null>('auth_token', {
    sameSite: 'lax',
    secure: false,
    maxAge: 60 * 60 * 24 * 7
  })

  const status = useState<AuthStatus>('auth.status', () => 'idle')
  const user = useState<AuthUser | null>('auth.user', () => null)
  const error = useState<string>('auth.error', () => '')
  const refreshToken = useState<string | null>('auth.refresh-token', () => null)

  const isAuthenticated = computed(() => Boolean(token.value && user.value))

  function updateFromToken(jwt: string | null) {
    if (!jwt) {
      user.value = null
      status.value = 'guest'
      return
    }

    const parsedUser = extractUserFromToken(jwt)

    if (!parsedUser) {
      token.value = null
      user.value = null
      status.value = 'guest'

      if (import.meta.client) {
        localStorage.removeItem(TOKEN_KEY)
      }

      return
    }

    user.value = parsedUser
    status.value = 'authenticated'
  }

  function setToken(jwt: string) {
    token.value = jwt

    if (import.meta.client) {
      localStorage.setItem(TOKEN_KEY, jwt)
    }

    updateFromToken(jwt)
  }

  function setRefreshToken(nextRefreshToken: string | null) {
    refreshToken.value = nextRefreshToken

    if (!import.meta.client) {
      return
    }

    if (nextRefreshToken) {
      localStorage.setItem(REFRESH_TOKEN_KEY, nextRefreshToken)
      return
    }

    localStorage.removeItem(REFRESH_TOKEN_KEY)
  }

  async function hydrate() {
    if (status.value === 'loading') {
      return
    }

    status.value = 'loading'

    if (import.meta.client && !token.value) {
      const localToken = localStorage.getItem(TOKEN_KEY)

      if (localToken) {
        token.value = localToken
      }

      if (!refreshToken.value) {
        const localRefreshToken = localStorage.getItem(REFRESH_TOKEN_KEY)

        if (localRefreshToken) {
          refreshToken.value = localRefreshToken
        }
      }
    }

    updateFromToken(token.value ?? null)
  }

  async function login(payload: LoginInput) {
    error.value = ''
    const result = await loginWithCredentials(payload)
    const tokens = extractAuthTokenBundle(result)

    if (!tokens.accessToken) {
      throw new Error('El backend no devolvio un token JWT valido.')
    }

    setToken(tokens.accessToken)
    setRefreshToken(tokens.refreshToken)
    return result
  }

  async function register(payload: RegisterInput) {
    error.value = ''
    return registerWithCredentials(payload)
  }

  function logout() {
    token.value = null
    setRefreshToken(null)
    user.value = null
    status.value = 'guest'

    if (import.meta.client) {
      localStorage.removeItem(TOKEN_KEY)
      navigateTo('/auth/login')
    }
  }

  return {
    token,
    refreshToken,
    user,
    status,
    error,
    isAuthenticated,
    hydrate,
    login,
    register,
    logout
  }
}
