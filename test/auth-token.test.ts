import { describe, expect, test } from 'bun:test'

import { decodeJwtPayload, extractAuthTokenBundle, extractUserFromToken } from '../app/utils/authToken'

function makeToken(payload: Record<string, unknown>) {
  const header = Buffer.from(JSON.stringify({ alg: 'none', typ: 'JWT' })).toString('base64url')
  const body = Buffer.from(JSON.stringify(payload)).toString('base64url')
  return `${header}.${body}.signature`
}

describe('auth token utilities', () => {
  test('extracts user information from jwt payload', () => {
    const token = makeToken({
      sub: 'u-1',
      email: 'demo@example.com',
      name: 'Demo User',
      roles: ['ROLE_USER'],
      scope: 'checkout profile'
    })

    const user = extractUserFromToken(token)

    expect(user?.id).toBe('u-1')
    expect(user?.email).toBe('demo@example.com')
    expect(user?.name).toBe('Demo User')
    expect(user?.roles).toContain('ROLE_USER')
    expect(user?.roles).toContain('checkout')
  })

  test('returns null for invalid token shape', () => {
    expect(decodeJwtPayload('not-a-jwt')).toBeNull()
    expect(extractUserFromToken('broken')).toBeNull()
  })

  test('extracts backend token payload using accessToken keys', () => {
    const tokens = extractAuthTokenBundle({
      accessToken: 'jwt-access',
      refreshToken: 'jwt-refresh',
      expiresIn: 86400000
    })

    expect(tokens.accessToken).toBe('jwt-access')
    expect(tokens.refreshToken).toBe('jwt-refresh')
    expect(tokens.expiresIn).toBe(86400000)
  })

  test('keeps backward compatibility with token and jwt variants', () => {
    expect(extractAuthTokenBundle({ token: 'legacy-token' }).accessToken).toBe('legacy-token')
    expect(extractAuthTokenBundle({ jwt: 'legacy-jwt' }).accessToken).toBe('legacy-jwt')
  })
})
