export type ThemePreference = 'system' | 'light' | 'dark'
export type PageSizePreference = 8 | 12 | 24
export type CurrencyPreference = 'PEN'

export type UserSettings = {
  theme: ThemePreference
  pageSize: PageSizePreference
  currency: CurrencyPreference
}

export const USER_SETTINGS_STORAGE_KEY = 'ecommerce.user.settings'

export const USER_SETTINGS_DEFAULTS: UserSettings = {
  theme: 'system',
  pageSize: 12,
  currency: 'PEN'
}

export const PAGE_SIZE_OPTIONS: PageSizePreference[] = [8, 12, 24]
export const THEME_OPTIONS: ThemePreference[] = ['system', 'light', 'dark']

function isThemePreference(value: unknown): value is ThemePreference {
  return typeof value === 'string' && THEME_OPTIONS.includes(value as ThemePreference)
}

export function normalizePageSize(value: unknown): PageSizePreference {
  const parsed = Number(value)

  if (parsed === 8 || parsed === 12 || parsed === 24) {
    return parsed
  }

  return USER_SETTINGS_DEFAULTS.pageSize
}

export function parseStoredUserSettings(raw: string | null): UserSettings {
  if (!raw) {
    return { ...USER_SETTINGS_DEFAULTS }
  }

  try {
    const parsed = JSON.parse(raw) as Record<string, unknown>

    return {
      theme: isThemePreference(parsed.theme) ? parsed.theme : USER_SETTINGS_DEFAULTS.theme,
      pageSize: normalizePageSize(parsed.pageSize),
      currency: 'PEN'
    }
  } catch {
    return { ...USER_SETTINGS_DEFAULTS }
  }
}
