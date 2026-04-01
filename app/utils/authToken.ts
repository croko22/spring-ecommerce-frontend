export type AuthUser = {
  id: string | null
  email: string | null
  name: string | null
  roles: string[]
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
