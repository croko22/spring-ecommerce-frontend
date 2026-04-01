export default defineNuxtRouteMiddleware(async (to) => {
  const auth = useAuthState()
  await auth.hydrate()

  const publicRoutes = ['/auth/login', '/auth/register', '/auth/reset-request', '/auth/reset-confirm']
  const isPublicRoute = publicRoutes.includes(to.path)

  if (!auth.isAuthenticated.value && !isPublicRoute) {
    return navigateTo('/auth/login')
  }

  if (auth.isAuthenticated.value && (to.path === '/auth/login' || to.path === '/auth/register')) {
    return navigateTo('/')
  }
})
