import { describe, expect, test } from 'bun:test'

import { mapSpringAuthError } from '../app/utils/authErrors'

describe('mapSpringAuthError', () => {
  test('maps unauthorized response', () => {
    const message = mapSpringAuthError(401, { message: 'Bad credentials' }, 'fallback')
    expect(message).toBe('Credenciales invalidas o sesion expirada.')
  })

  test('uses field message for validation errors', () => {
    const message = mapSpringAuthError(400, { errors: { email: ['email invalid'] } }, 'fallback')
    expect(message).toBe('Revisa el formato del email o usa uno diferente.')
  })

  test('falls back when status is unknown', () => {
    const message = mapSpringAuthError(429, {}, 'fallback custom')
    expect(message).toBe('fallback custom')
  })
})
