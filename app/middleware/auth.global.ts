const PROTECTED_PREFIXES = ['/admin', '/profile', '/orders', '/settings']

export default defineNuxtRouteMiddleware(async (to) => {
  const auth = useAuthState()
  await auth.hydrate()

  const isProtected = PROTECTED_PREFIXES.some(p => to.path.startsWith(p))

  if (!auth.isAuthenticated.value && isProtected) {
    return navigateTo('/auth/login')
  }

  if (auth.isAuthenticated.value && (to.path === '/auth/login' || to.path === '/auth/register')) {
    return navigateTo('/')
  }
})
