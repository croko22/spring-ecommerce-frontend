export function useApiFetch<T>(path: string, options: Record<string, unknown> = {}) {
  const config = useRuntimeConfig()
  const baseURL = String(config.public.apiBase)
  const token = useCookie<string | null>('auth_token')
  const headers = new Headers((options.headers as HeadersInit | undefined) ?? undefined)

  if (token.value) {
    headers.set('Authorization', `Bearer ${token.value}`)
  }

  return useFetch<T>(path, {
    baseURL,
    headers,
    ...(options as object)
  })
}
