<script setup lang="ts">
import { ShoppingCart, Github, Twitter, Instagram } from 'lucide-vue-next'

const auth = useAuthState()
const { totalItems } = useCart()
const displayName = computed(() => auth.user.value?.name ?? 'usuario')
const cartOpen = ref(false)

function onLogout() {
  auth.logout()
}
</script>

<template>
  <div class="app-shell">
    <header class="app-shell__header">
      <NuxtLink class="app-shell__brand" to="/">Ecommerce Nuxt</NuxtLink>
      <nav class="app-shell__nav">
        <NuxtLink to="/">Inicio</NuxtLink>
        <NuxtLink to="/products">Productos</NuxtLink>
        <button
          type="button"
          class="app-shell__cart-btn"
          aria-label="Abrir carrito"
          @click="cartOpen = true"
        >
          <ShoppingCart class="w-5 h-5" />
          <Badge v-if="totalItems > 0" variant="destructive" class="ml-1">{{ totalItems }}</Badge>
        </button>
        <template v-if="auth.isAuthenticated">
          <NuxtLink to="/profile">Mi Perfil</NuxtLink>
          <NuxtLink to="/orders">Mis Ordenes</NuxtLink>
          <NuxtLink to="/settings">Configuracion</NuxtLink>
          <span class="app-shell__welcome">Hola, {{ displayName }}</span>
          <button type="button" class="app-shell__logout" @click="onLogout">Salir</button>
        </template>
        <template v-else>
          <NuxtLink to="/auth/login">Login</NuxtLink>
          <NuxtLink to="/auth/register">Registro</NuxtLink>
        </template>
      </nav>
    </header>

    <main class="app-shell__main">
      <slot />
    </main>

    <footer class="border-t bg-card py-12">
      <div class="container px-4">
        <div class="grid gap-8 sm:grid-cols-3">
          <div>
            <h3 class="text-lg font-semibold">Ecommerce Nuxt</h3>
            <p class="mt-2 text-sm text-muted-foreground">
              Tu tienda online de confianza. Productos seleccionados con los mejores precios.
            </p>
          </div>
          <div>
            <h4 class="font-semibold">Links rápidos</h4>
            <ul class="mt-2 space-y-2 text-sm">
              <li>
                <NuxtLink to="/products" class="text-muted-foreground transition-colors hover:text-foreground">
                  Productos
                </NuxtLink>
              </li>
              <li>
                <NuxtLink to="/auth/login" class="text-muted-foreground transition-colors hover:text-foreground">
                  Iniciar sesión
                </NuxtLink>
              </li>
              <li>
                <NuxtLink to="/auth/register" class="text-muted-foreground transition-colors hover:text-foreground">
                  Crear cuenta
                </NuxtLink>
              </li>
            </ul>
          </div>
          <div>
            <h4 class="font-semibold">Redes sociales</h4>
            <div class="mt-2 flex gap-3">
              <a
                href="#"
                class="flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                aria-label="Twitter"
              >
                <Twitter class="h-4 w-4" />
              </a>
              <a
                href="#"
                class="flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                aria-label="GitHub"
              >
                <Github class="h-4 w-4" />
              </a>
              <a
                href="#"
                class="flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                aria-label="Instagram"
              >
                <Instagram class="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
        <div class="mt-8 border-t pt-6 text-center text-sm text-muted-foreground">
          &copy; {{ new Date().getFullYear() }} Ecommerce Nuxt. Todos los derechos reservados.
        </div>
      </div>
    </footer>

    <CartDrawer v-model:open="cartOpen" />
  </div>
</template>

<style scoped>
.app-shell {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.app-shell__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.875rem 1.5rem;
  background-color: hsl(var(--card));
  border-bottom: 1px solid var(--border-soft);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
}

.app-shell__brand {
  text-decoration: none;
  color: var(--text-main);
  font-weight: 700;
  font-size: 1.125rem;
  letter-spacing: -0.01em;
}

.app-shell__nav {
  display: flex;
  align-items: center;
  gap: 1.25rem;
  font-size: 0.9375rem;
}

.app-shell__nav a {
  color: var(--text-main);
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s ease;
}

.router-link-active {
  color: var(--accent);
}

.app-shell__cart-btn {
  display: inline-flex;
  align-items: center;
  background: none;
  border: none;
  cursor: pointer;
  color: var(--text-main);
  position: relative;
  padding: 0.25rem;
  border-radius: 0.375rem;
  transition: background-color 0.2s ease;
}

.app-shell__cart-btn:hover {
  background-color: hsl(var(--muted));
}

.app-shell__welcome {
  color: var(--text-muted);
}

.app-shell__logout {
  border-radius: 999px;
  background: transparent;
  border: 1px solid var(--border-soft);
  padding: 0.4rem 0.8rem;
  cursor: pointer;
  color: var(--text-muted);
  font-weight: 500;
  font-size: 0.875rem;
  transition: all 0.2s ease;
}

.app-shell__logout:hover {
  color: hsl(var(--destructive));
  border-color: hsl(var(--destructive));
  background-color: hsl(var(--destructive) / 0.08);
}

.app-shell__main {
  flex: 1;
}

@media (max-width: 640px) {
  .app-shell__header {
    align-items: flex-start;
    flex-direction: column;
    gap: 0.75rem;
  }
}
</style>
