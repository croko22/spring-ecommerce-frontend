import {
  parseStoredUserSettings,
  USER_SETTINGS_DEFAULTS,
  USER_SETTINGS_STORAGE_KEY,
  type PageSizePreference,
  type ThemePreference,
  type UserSettings
} from '~/utils/userSettings'

function applyThemePreference(theme: ThemePreference) {
  if (!import.meta.client) {
    return
  }

  const root = document.documentElement
  root.classList.remove('light', 'dark')

  if (theme === 'system') {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    if (prefersDark) {
      root.classList.add('dark')
    }
    return
  }

  if (theme === 'dark') {
    root.classList.add('dark')
  }
}

export function useUserSettings() {
  const settings = useState<UserSettings>('user.settings', () => ({ ...USER_SETTINGS_DEFAULTS }))
  const hasHydrated = useState<boolean>('user.settings.hydrated', () => false)

  function persist() {
    if (!import.meta.client) {
      return
    }

    localStorage.setItem(USER_SETTINGS_STORAGE_KEY, JSON.stringify(settings.value))
  }

  function hydrate() {
    if (!import.meta.client || hasHydrated.value) {
      return
    }

    const stored = localStorage.getItem(USER_SETTINGS_STORAGE_KEY)
    settings.value = parseStoredUserSettings(stored)
    applyThemePreference(settings.value.theme)
    hasHydrated.value = true
  }

  function setTheme(theme: ThemePreference) {
    settings.value = {
      ...settings.value,
      theme
    }
    applyThemePreference(theme)
    persist()
  }

  function setPageSize(pageSize: PageSizePreference) {
    settings.value = {
      ...settings.value,
      pageSize
    }
    persist()
  }

  function resetSettings() {
    settings.value = { ...USER_SETTINGS_DEFAULTS }
    applyThemePreference(settings.value.theme)

    if (import.meta.client) {
      localStorage.removeItem(USER_SETTINGS_STORAGE_KEY)
    }
  }

  if (import.meta.client && !hasHydrated.value) {
    hydrate()
  }

  return {
    settings,
    hydrate,
    setTheme,
    setPageSize,
    resetSettings
  }
}
