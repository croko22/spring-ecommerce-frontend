export default defineNuxtRouteMiddleware(async () => {
  const auth = useAuthState()
  await auth.hydrate()

  const user = auth.user.value
  const roles = user?.roles ?? []

  if (!auth.isAuthenticated.value || !roles.includes('ADMIN')) {
    return navigateTo('/')
  }
})
