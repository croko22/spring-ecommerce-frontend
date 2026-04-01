export type AuthUser = {
  id: string | null
  email: string | null
  name: string | null
  roles: string[]
}

export type AuthTokenBundle = {
  accessToken: string | null
  refreshToken: string | null
  expiresIn: number | null
}

type JwtPayload = {
  sub?: string
  email?: string
  name?: string
  preferred_username?: string
  roles?: string[]
  authorities?: string[]
  scope?: string
}

type MaybeRecord = Record<string, unknown>

function pickString(payload: MaybeRecord, keys: string[]) {
  for (const key of keys) {
    const value = payload[key]

    if (typeof value === 'string') {
      const normalized = value.trim()

      if (normalized) {
        return normalized
      }
    }
  }

  return null
}

function pickNumber(payload: MaybeRecord, keys: string[]) {
  for (const key of keys) {
    const value = payload[key]

    if (typeof value === 'number' && Number.isFinite(value)) {
      return value
    }

    if (typeof value === 'string' && value.trim()) {
      const parsed = Number(value)

      if (Number.isFinite(parsed)) {
        return parsed
      }
    }
  }

  return null
}

function decodeBase64Url(value: string) {
  const normalized = value.replace(/-/g, '+').replace(/_/g, '/')
  const padding = normalized.length % 4 === 0 ? '' : '='.repeat(4 - (normalized.length % 4))
  const content = normalized + padding

  const maybeBuffer = (globalThis as {
    Buffer?: { from: (input: string, encoding: string) => { toString: (encoding: string) => string } }
  }).Buffer

  if (import.meta.server && maybeBuffer) {
    return maybeBuffer.from(content, 'base64').toString('utf-8')
  }

  return atob(content)
}

export function decodeJwtPayload(token: string): JwtPayload | null {
  const segments = token.split('.')
  const payloadSegment = segments[1]

  if (segments.length !== 3 || !payloadSegment) {
    return null
  }

  try {
    const decoded = decodeBase64Url(payloadSegment)
    return JSON.parse(decoded) as JwtPayload
  } catch {
    return null
  }
}

export function extractUserFromToken(token: string): AuthUser | null {
  const payload = decodeJwtPayload(token)

  if (!payload) {
    return null
  }

  const rawRoles = payload.roles ?? payload.authorities ?? []
  const scopedRoles = payload.scope ? payload.scope.split(' ') : []

  return {
    id: payload.sub ?? null,
    email: payload.email ?? null,
    name: payload.name ?? payload.preferred_username ?? payload.email ?? null,
    roles: [...new Set([...rawRoles, ...scopedRoles].filter(Boolean))]
  }
}

export function extractAuthTokenBundle(payload: unknown): AuthTokenBundle {
  const data = (payload && typeof payload === 'object' ? payload : {}) as MaybeRecord

  return {
    accessToken: pickString(data, ['accessToken', 'access_token', 'token', 'jwt']),
    refreshToken: pickString(data, ['refreshToken', 'refresh_token']),
    expiresIn: pickNumber(data, ['expiresIn', 'expires_in'])
  }
}
