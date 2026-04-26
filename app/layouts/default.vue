<script setup lang="ts">
import { Github, Twitter, Instagram } from 'lucide-vue-next'

const auth = useAuthState()
const cartOpen = ref(false)
</script>

<template>
  <div class="flex min-h-screen flex-col">
    <AppHeader />

    <main class="flex-1">
      <slot />
    </main>

    <footer class="border-t bg-card py-12">
      <div class="container px-4">
        <div class="grid gap-8 sm:grid-cols-3">
          <div>
            <h3 class="text-lg font-semibold">Ecommerce</h3>
            <p class="mt-2 text-sm text-muted-foreground">
              Tu tienda online de confianza. Productos seleccionados con los mejores precios.
            </p>
          </div>
          <div>
            <h4 class="font-semibold">Links r&aacute;pidos</h4>
            <ul class="mt-2 space-y-2 text-sm">
              <li>
                <NuxtLink to="/products" class="text-muted-foreground transition-colors hover:text-foreground">
                  Productos
                </NuxtLink>
              </li>
              <li>
                <NuxtLink to="/auth/login" class="text-muted-foreground transition-colors hover:text-foreground">
                  Iniciar sesi&oacute;n
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
          &copy; {{ new Date().getFullYear() }} Ecommerce. Todos los derechos reservados.
        </div>
      </div>
    </footer>

    <CartDrawer v-model:open="cartOpen" />
  </div>
</template>
