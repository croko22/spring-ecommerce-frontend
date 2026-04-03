import { describe, expect, test } from 'bun:test'

import {
  parseStoredUserSettings,
  USER_SETTINGS_DEFAULTS,
  normalizePageSize
} from '../app/utils/userSettings'
import { formatPenAmount } from '../app/utils/currency'

describe('user settings utils', () => {
  test('falls back to defaults for invalid storage payload', () => {
    expect(parseStoredUserSettings(null)).toEqual(USER_SETTINGS_DEFAULTS)
    expect(parseStoredUserSettings('{"theme":"invalid","pageSize":99}')).toEqual(USER_SETTINGS_DEFAULTS)
    expect(parseStoredUserSettings('{bad json')).toEqual(USER_SETTINGS_DEFAULTS)
  })

  test('normalizes valid theme and page size with fixed PEN currency', () => {
    expect(parseStoredUserSettings('{"theme":"dark","pageSize":24,"currency":"USD"}')).toEqual({
      theme: 'dark',
      pageSize: 24,
      currency: 'PEN'
    })
    expect(normalizePageSize('8')).toBe(8)
    expect(normalizePageSize(12)).toBe(12)
    expect(normalizePageSize(24)).toBe(24)
    expect(normalizePageSize(10)).toBe(USER_SETTINGS_DEFAULTS.pageSize)
  })

  test('formats money as PEN display', () => {
    const formatted = formatPenAmount(1234.5)
    expect(formatted).toContain('S/')
    expect(formatted).toContain('1,234.50')
  })
})
