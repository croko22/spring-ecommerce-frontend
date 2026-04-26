<script setup lang="ts">
import { ShoppingCart, Menu, LogOut, Package, User, Settings, ChevronDown } from 'lucide-vue-next'
import { Sheet, SheetContent } from '~/components/ui/sheet'

const auth = useAuthState()
auth.hydrate()
const { totalItems } = useCart()
const route = useRoute()

const displayName = computed(() => auth.user.value?.name ?? 'Usuario')
const initials = computed(() => {
  const parts = displayName.value.split(' ')
  if (parts.length >= 2) return ((parts[0]?.[0] ?? '') + (parts[1]?.[0] ?? '')).toUpperCase()
  return parts[0]?.[0]?.toUpperCase() ?? 'U'
})

const isAdmin = computed(() =>
  auth.user.value?.roles?.some(r => /admin/i.test(r)) ?? false
)

const mobileOpen = ref(false)
const dropdownOpen = ref(false)

function onLogout() {
  dropdownOpen.value = false
  mobileOpen.value = false
  auth.logout()
}

function closeMobile() {
  mobileOpen.value = false
}

const dropdownRef = ref<HTMLElement | null>(null)

function onDocClick(e: MouseEvent) {
  if (dropdownRef.value && !dropdownRef.value.contains(e.target as Node)) {
    dropdownOpen.value = false
  }
}

onMounted(() => document.addEventListener('click', onDocClick))
onUnmounted(() => document.removeEventListener('click', onDocClick))
</script>

<template>
  <header class="sticky top-0 z-50 h-16 border-b bg-card shadow-sm">
    <div class="container flex h-full items-center justify-between">
      <div class="flex items-center gap-8">
        <NuxtLink to="/" class="text-xl font-extrabold tracking-tight text-foreground">
          Ecommerce
        </NuxtLink>

        <nav class="hidden items-center gap-1 md:flex">
          <NuxtLink
            to="/products"
            class="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            :class="{ 'bg-secondary text-foreground': route.path.startsWith('/products') }"
          >
            Productos
          </NuxtLink>
          <NuxtLink
            v-if="isAdmin"
            to="/admin"
            class="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            :class="{ 'bg-secondary text-foreground': route.path.startsWith('/admin') }"
          >
            Admin
          </NuxtLink>
        </nav>
      </div>

      <div class="flex items-center gap-2">
        <Button variant="ghost" size="icon" class="md:hidden" @click="mobileOpen = true">
          <Menu class="h-5 w-5" />
        </Button>

        <template v-if="!auth.isAuthenticated">
          <div class="hidden items-center gap-2 md:flex">
            <Button variant="ghost" as-child>
              <NuxtLink to="/auth/login">Iniciar sesi&oacute;n</NuxtLink>
            </Button>
            <Button as-child>
              <NuxtLink to="/auth/register">Crear cuenta</NuxtLink>
            </Button>
          </div>
        </template>

        <template v-else>
          <div class="hidden items-center gap-1 md:flex">
            <Button variant="ghost" size="icon" class="relative" as-child>
              <NuxtLink to="/cart" aria-label="Carrito">
                <ShoppingCart class="h-5 w-5" />
                <Badge
                  v-if="totalItems > 0"
                  variant="destructive"
                  class="absolute -right-1.5 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[10px] leading-none"
                >
                  {{ totalItems }}
                </Badge>
              </NuxtLink>
            </Button>

            <Button variant="ghost" size="icon" as-child>
              <NuxtLink to="/orders" aria-label="Mis &oacute;rdenes">
                <Package class="h-5 w-5" />
              </NuxtLink>
            </Button>

            <Button variant="ghost" size="icon" as-child>
              <NuxtLink to="/profile" aria-label="Mi perfil">
                <User class="h-5 w-5" />
              </NuxtLink>
            </Button>

            <div ref="dropdownRef" class="relative">
              <Button
                variant="ghost"
                class="flex items-center gap-1.5 rounded-full px-2"
                @click.stop="dropdownOpen = !dropdownOpen"
              >
                <span class="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                  {{ initials }}
                </span>
                <ChevronDown class="h-4 w-4 text-muted-foreground" />
              </Button>

              <Transition name="dropdown">
                <div
                  v-if="dropdownOpen"
                  class="absolute right-0 top-full z-50 mt-2 w-52 rounded-lg border bg-card p-1 shadow-lg"
                >
                  <div class="border-b px-3 py-2">
                    <p class="text-sm font-medium">{{ displayName }}</p>
                    <p class="text-xs text-muted-foreground">{{ auth.user.value?.email }}</p>
                  </div>

                  <NuxtLink
                    to="/profile"
                    class="flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors hover:bg-secondary"
                    @click="dropdownOpen = false"
                  >
                    <User class="h-4 w-4" />
                    Mi perfil
                  </NuxtLink>

                  <NuxtLink
                    to="/orders"
                    class="flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors hover:bg-secondary"
                    @click="dropdownOpen = false"
                  >
                    <Package class="h-4 w-4" />
                    Mis &oacute;rdenes
                  </NuxtLink>

                  <NuxtLink
                    to="/settings"
                    class="flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors hover:bg-secondary"
                    @click="dropdownOpen = false"
                  >
                    <Settings class="h-4 w-4" />
                    Configuraci&oacute;n
                  </NuxtLink>

                  <NuxtLink
                    v-if="isAdmin"
                    to="/admin"
                    class="flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors hover:bg-secondary"
                    @click="dropdownOpen = false"
                  >
                    Admin
                  </NuxtLink>

                  <div class="my-1 border-t" />

                  <button
                    type="button"
                    class="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-destructive transition-colors hover:bg-destructive/10"
                    @click="onLogout"
                  >
                    <LogOut class="h-4 w-4" />
                    Cerrar sesi&oacute;n
                  </button>
                </div>
              </Transition>
            </div>
          </div>
        </template>

        <Button variant="ghost" size="icon" class="relative md:hidden" as-child>
          <NuxtLink to="/cart" aria-label="Carrito">
            <ShoppingCart class="h-5 w-5" />
            <Badge
              v-if="totalItems > 0"
              variant="destructive"
              class="absolute -right-1.5 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[10px] leading-none"
            >
              {{ totalItems }}
            </Badge>
          </NuxtLink>
        </Button>
      </div>
    </div>
  </header>

  <Sheet v-model:open="mobileOpen">
    <SheetContent side="left" class="w-[280px] p-0 sm:max-w-sm">
      <div class="flex h-16 items-center border-b px-4">
        <NuxtLink to="/" class="text-lg font-extrabold tracking-tight" @click="closeMobile">
          Ecommerce
        </NuxtLink>
      </div>

      <div class="flex flex-col gap-1 p-2">
        <NuxtLink
          to="/"
          class="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors hover:bg-secondary"
          :class="{ 'bg-secondary font-semibold': route.path === '/' }"
          @click="closeMobile"
        >
          Inicio
        </NuxtLink>

        <NuxtLink
          to="/products"
          class="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors hover:bg-secondary"
          :class="{ 'bg-secondary font-semibold': route.path.startsWith('/products') }"
          @click="closeMobile"
        >
          <Package class="h-4 w-4" />
          Productos
        </NuxtLink>

        <template v-if="auth.isAuthenticated">
          <div class="my-2 border-t" />

          <NuxtLink
            to="/cart"
            class="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors hover:bg-secondary"
            :class="{ 'bg-secondary font-semibold': route.path === '/cart' }"
            @click="closeMobile"
          >
            <ShoppingCart class="h-4 w-4" />
            Carrito
            <Badge v-if="totalItems > 0" variant="destructive" class="ml-auto">
              {{ totalItems }}
            </Badge>
          </NuxtLink>

          <NuxtLink
            to="/orders"
            class="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors hover:bg-secondary"
            :class="{ 'bg-secondary font-semibold': route.path.startsWith('/orders') }"
            @click="closeMobile"
          >
            <Package class="h-4 w-4" />
            Mis &oacute;rdenes
          </NuxtLink>

          <NuxtLink
            to="/profile"
            class="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors hover:bg-secondary"
            :class="{ 'bg-secondary font-semibold': route.path === '/profile' }"
            @click="closeMobile"
          >
            <User class="h-4 w-4" />
            Mi perfil
          </NuxtLink>

          <NuxtLink
            to="/settings"
            class="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors hover:bg-secondary"
            :class="{ 'bg-secondary font-semibold': route.path === '/settings' }"
            @click="closeMobile"
          >
            <Settings class="h-4 w-4" />
            Configuraci&oacute;n
          </NuxtLink>

          <NuxtLink
            v-if="isAdmin"
            to="/admin"
            class="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors hover:bg-secondary"
            :class="{ 'bg-secondary font-semibold': route.path.startsWith('/admin') }"
            @click="closeMobile"
          >
            Admin
          </NuxtLink>

          <div class="my-2 border-t" />

          <div class="px-3 py-2">
            <p class="text-sm font-medium">{{ displayName }}</p>
            <p class="text-xs text-muted-foreground">{{ auth.user.value?.email }}</p>
          </div>

          <button
            type="button"
            class="mx-2 flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-destructive transition-colors hover:bg-destructive/10"
            @click="onLogout"
          >
            <LogOut class="h-4 w-4" />
            Cerrar sesi&oacute;n
          </button>
        </template>

        <template v-else>
          <div class="my-2 border-t" />

          <NuxtLink
            to="/cart"
            class="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors hover:bg-secondary"
            @click="closeMobile"
          >
            <ShoppingCart class="h-4 w-4" />
            Carrito
            <Badge v-if="totalItems > 0" variant="destructive" class="ml-auto">
              {{ totalItems }}
            </Badge>
          </NuxtLink>

          <div class="my-2 border-t" />

          <NuxtLink
            to="/auth/login"
            class="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors hover:bg-secondary"
            @click="closeMobile"
          >
            Iniciar sesi&oacute;n
          </NuxtLink>

          <NuxtLink
            to="/auth/register"
            class="mx-3 mt-2 flex items-center justify-center rounded-md bg-primary px-3 py-2.5 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90"
            @click="closeMobile"
          >
            Crear cuenta
          </NuxtLink>
        </template>
      </div>
    </SheetContent>
  </Sheet>
</template>

<style scoped>
.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.15s ease;
}
.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>
