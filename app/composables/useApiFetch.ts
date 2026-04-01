export function useApiFetch<T>(path: string, options: Record<string, unknown> = {}) {
  const config = useRuntimeConfig()
  const baseURL = String(config.public.apiBase)

  return useFetch<T>(path, {
    baseURL,
    ...(options as object)
  })
}
