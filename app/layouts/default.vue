<script setup lang="ts">
import { ShoppingCart } from 'lucide-vue-next'

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
        <NuxtLink to="/settings">Configuracion</NuxtLink>
        <template v-if="auth.isAuthenticated">
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
  padding: 1rem 1.25rem;
  border-bottom: 1px solid #d9dee7;
}

.app-shell__brand {
  text-decoration: none;
  color: var(--text-main);
  font-weight: 700;
  letter-spacing: 0.02em;
}

.app-shell__nav {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.app-shell__nav a {
  color: var(--text-main);
  text-decoration: none;
  font-weight: 500;
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
}

.app-shell__welcome {
  color: var(--text-muted);
}

.app-shell__logout {
  border: 0;
  border-radius: 999px;
  background: #fff;
  border: 1px solid var(--border-soft);
  padding: 0.4rem 0.7rem;
  cursor: pointer;
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
