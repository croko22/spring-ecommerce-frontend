<script setup lang="ts">
import {
  ShoppingCart,
  Menu,
  LogOut,
  Package,
  User,
  Settings,
  ChevronDown,
  Store,
  Home,
  Moon,
  Sun,
  Shield,
} from 'lucide-vue-next'
import { useDark, useToggle, onClickOutside } from '@vueuse/core'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '~/components/ui/sheet'

const auth = useAuthState()
auth.hydrate()
const { totalItems } = useCart()
const route = useRoute()
const isDark = useDark()
const toggleDarkMode = useToggle(isDark)

const displayName = computed(() => auth.user.value?.name ?? 'Usuario')
const initials = computed(() => {
  const parts = displayName.value.split(' ')
  if (parts.length >= 2)
    return ((parts[0]?.[0] ?? '') + (parts[1]?.[0] ?? '')).toUpperCase()
  return parts[0]?.[0]?.toUpperCase() ?? 'U'
})

const isAdmin = computed(
  () => auth.user.value?.roles?.some(r => /admin/i.test(r)) ?? false,
)

const mobileOpen = ref(false)
const dropdownOpen = ref(false)
const dropdownContainer = ref<HTMLElement | null>(null)

function onLogout() {
  dropdownOpen.value = false
  mobileOpen.value = false
  auth.logout()
}

function closeMobile() {
  mobileOpen.value = false
}

function toggleDropdown() {
  dropdownOpen.value = !dropdownOpen.value
}

function closeDropdown() {
  dropdownOpen.value = false
}

const navLinks = computed(() => {
  const links = [
    { to: '/', label: 'Inicio', icon: Home, exact: true },
    { to: '/products', label: 'Productos', icon: Package, exact: false },
  ]
  if (isAdmin.value) {
    links.push({ to: '/admin', label: 'Admin', icon: Shield, exact: false })
  }
  return links
})

function isActive(navTo: string, exact: boolean) {
  return exact ? route.path === navTo : route.path.startsWith(navTo)
}

onClickOutside(dropdownContainer, () => {
  if (dropdownOpen.value) dropdownOpen.value = false
})
</script>

<template>
  <header class="sticky top-0 z-50 w-full border-b bg-card/80 backdrop-blur-md">
    <div class="container flex h-16 items-center justify-between px-4">
      <!-- Branding + Desktop Nav -->
      <div class="flex items-center gap-8">
        <NuxtLink
          to="/"
          class="flex items-center gap-2 text-xl font-extrabold tracking-tight text-foreground transition-opacity hover:opacity-80"
        >
          <Store class="h-6 w-6 text-primary" />
          <span class="hidden sm:inline">Ecommerce</span>
        </NuxtLink>

        <nav class="hidden items-center gap-1 md:flex">
          <NuxtLink
            v-for="link in navLinks"
            :key="link.to"
            :to="link.to"
            class="relative rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            :class="{
              'bg-secondary text-foreground': isActive(link.to, link.exact),
            }"
          >
            {{ link.label }}
          </NuxtLink>
        </nav>
      </div>

      <!-- Right Section -->
      <div class="flex items-center gap-1">
        <!-- Dark Mode Toggle -->
        <Button
          variant="ghost"
          size="icon"
          class="h-9 w-9"
          :aria-label="isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'"
          @click="toggleDarkMode"
        >
          <Sun v-if="isDark" class="h-4 w-4" />
          <Moon v-else class="h-4 w-4" />
        </Button>

        <!-- Guest: Auth Buttons (Desktop) -->
        <template v-if="!auth.isAuthenticated">
          <div class="hidden items-center gap-2 md:flex">
            <Button variant="ghost" size="sm" as-child>
              <NuxtLink to="/auth/login">Iniciar sesión</NuxtLink>
            </Button>
            <Button size="sm" as-child>
              <NuxtLink to="/auth/register">Crear cuenta</NuxtLink>
            </Button>
          </div>
        </template>

        <!-- Authenticated: Desktop Actions -->
        <template v-else>
          <div class="hidden items-center gap-1 md:flex">
            <!-- Cart -->
            <Button variant="ghost" size="icon" class="relative h-9 w-9" as-child>
              <NuxtLink to="/cart" aria-label="Carrito">
                <ShoppingCart class="h-4 w-4" />
                <Badge
                  v-if="totalItems > 0"
                  variant="destructive"
                  class="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[10px] leading-none"
                >
                  {{ totalItems }}
                </Badge>
              </NuxtLink>
            </Button>

            <!-- User Dropdown -->
            <div ref="dropdownContainer" class="relative">
              <Button
                variant="ghost"
                size="sm"
                class="flex items-center gap-1.5 rounded-full pl-1.5 pr-2"
                @click="toggleDropdown"
              >
                <span
                  class="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground"
                >
                  {{ initials }}
                </span>
                <ChevronDown
                  class="h-3.5 w-3.5 text-muted-foreground transition-transform duration-200"
                  :class="{ 'rotate-180': dropdownOpen }"
                />
              </Button>

              <Transition
                enter-active-class="transition duration-150 ease-out"
                enter-from-class="opacity-0 -translate-y-1"
                enter-to-class="opacity-100 translate-y-0"
                leave-active-class="transition duration-100 ease-in"
                leave-from-class="opacity-100 translate-y-0"
                leave-to-class="opacity-0 -translate-y-1"
              >
                <div
                  v-if="dropdownOpen"
                  class="absolute right-0 top-full z-50 mt-1.5 w-56 overflow-hidden rounded-lg border bg-card p-1 shadow-lg"
                >
                  <div class="border-b px-3 py-2.5">
                    <p class="text-sm font-semibold">{{ displayName }}</p>
                    <p class="truncate text-xs text-muted-foreground">
                      {{ auth.user.value?.email }}
                    </p>
                  </div>

                  <div class="py-1">
                    <NuxtLink
                      to="/profile"
                      class="flex items-center gap-2.5 rounded-md px-3 py-2 text-sm transition-colors hover:bg-secondary"
                      @click="closeDropdown"
                    >
                      <User class="h-4 w-4 text-muted-foreground" />
                      Mi perfil
                    </NuxtLink>
                    <NuxtLink
                      to="/orders"
                      class="flex items-center gap-2.5 rounded-md px-3 py-2 text-sm transition-colors hover:bg-secondary"
                      @click="closeDropdown"
                    >
                      <Package class="h-4 w-4 text-muted-foreground" />
                      Mis órdenes
                    </NuxtLink>
                    <NuxtLink
                      to="/settings"
                      class="flex items-center gap-2.5 rounded-md px-3 py-2 text-sm transition-colors hover:bg-secondary"
                      @click="closeDropdown"
                    >
                      <Settings class="h-4 w-4 text-muted-foreground" />
                      Configuración
                    </NuxtLink>
                    <NuxtLink
                      v-if="isAdmin"
                      to="/admin"
                      class="flex items-center gap-2.5 rounded-md px-3 py-2 text-sm transition-colors hover:bg-secondary"
                      @click="closeDropdown"
                    >
                      <Shield class="h-4 w-4 text-muted-foreground" />
                      Admin
                    </NuxtLink>
                  </div>

                  <div class="border-t pt-1">
                    <button
                      type="button"
                      class="flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-sm text-destructive transition-colors hover:bg-destructive/10"
                      @click="onLogout"
                    >
                      <LogOut class="h-4 w-4" />
                      Cerrar sesión
                    </button>
                  </div>
                </div>
              </Transition>
            </div>
          </div>
        </template>

        <!-- Mobile Cart (always visible) -->
        <Button
          v-if="auth.isAuthenticated"
          variant="ghost"
          size="icon"
          class="relative h-9 w-9 md:hidden"
          as-child
        >
          <NuxtLink to="/cart" aria-label="Carrito">
            <ShoppingCart class="h-4 w-4" />
            <Badge
              v-if="totalItems > 0"
              variant="destructive"
              class="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[10px] leading-none"
            >
              {{ totalItems }}
            </Badge>
          </NuxtLink>
        </Button>

        <!-- Mobile Hamburger -->
        <Button
          variant="ghost"
          size="icon"
          class="h-9 w-9 md:hidden"
          @click="mobileOpen = true"
        >
          <Menu class="h-5 w-5" />
        </Button>
      </div>
    </div>
  </header>

  <!-- Mobile Sheet Menu -->
  <Sheet v-model:open="mobileOpen">
    <SheetContent side="right" class="w-[300px] p-0 sm:max-w-sm">
      <SheetHeader class="border-b px-4 py-4">
        <SheetTitle class="flex items-center gap-2 text-left">
          <Store class="h-5 w-5 text-primary" />
          Ecommerce
        </SheetTitle>
        <SheetDescription class="sr-only">Menú de navegación</SheetDescription>
      </SheetHeader>

      <div class="flex flex-col overflow-y-auto">
        <!-- Navigation Links -->
        <nav class="flex flex-col gap-0.5 p-2">
          <NuxtLink
            v-for="link in navLinks"
            :key="link.to"
            :to="link.to"
            class="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors hover:bg-secondary"
            :class="{
              'bg-secondary font-semibold': isActive(link.to, link.exact),
            }"
            @click="closeMobile"
          >
            <component :is="link.icon" class="h-4 w-4 text-muted-foreground" />
            {{ link.label }}
          </NuxtLink>
        </nav>

        <Separator />

        <!-- Authenticated Section -->
        <template v-if="auth.isAuthenticated">
          <div class="flex flex-col gap-0.5 p-2">
            <NuxtLink
              to="/cart"
              class="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors hover:bg-secondary"
              :class="{ 'bg-secondary font-semibold': route.path === '/cart' }"
              @click="closeMobile"
            >
              <ShoppingCart class="h-4 w-4 text-muted-foreground" />
              Carrito
              <Badge
                v-if="totalItems > 0"
                variant="destructive"
                class="ml-auto"
              >
                {{ totalItems }}
              </Badge>
            </NuxtLink>

            <NuxtLink
              to="/orders"
              class="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors hover:bg-secondary"
              :class="{
                'bg-secondary font-semibold': route.path.startsWith('/orders'),
              }"
              @click="closeMobile"
            >
              <Package class="h-4 w-4 text-muted-foreground" />
              Mis órdenes
            </NuxtLink>

            <NuxtLink
              to="/profile"
              class="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors hover:bg-secondary"
              :class="{
                'bg-secondary font-semibold': route.path === '/profile',
              }"
              @click="closeMobile"
            >
              <User class="h-4 w-4 text-muted-foreground" />
              Mi perfil
            </NuxtLink>

            <NuxtLink
              to="/settings"
              class="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors hover:bg-secondary"
              :class="{
                'bg-secondary font-semibold': route.path === '/settings',
              }"
              @click="closeMobile"
            >
              <Settings class="h-4 w-4 text-muted-foreground" />
              Configuración
            </NuxtLink>

            <NuxtLink
              v-if="isAdmin"
              to="/admin"
              class="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors hover:bg-secondary"
              :class="{
                'bg-secondary font-semibold': route.path.startsWith('/admin'),
              }"
              @click="closeMobile"
            >
              <Shield class="h-4 w-4 text-muted-foreground" />
              Admin
            </NuxtLink>
          </div>

          <Separator />

          <div class="p-2">
            <div class="rounded-md bg-secondary/50 px-3 py-2.5">
              <p class="text-sm font-semibold">{{ displayName }}</p>
              <p class="truncate text-xs text-muted-foreground">
                {{ auth.user.value?.email }}
              </p>
            </div>
          </div>

          <div class="p-2 pt-0">
            <button
              type="button"
              class="flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-destructive transition-colors hover:bg-destructive/10"
              @click="onLogout"
            >
              <LogOut class="h-4 w-4" />
              Cerrar sesión
            </button>
          </div>
        </template>

        <!-- Guest Section -->
        <template v-else>
          <div class="flex flex-col gap-0.5 p-2">
            <NuxtLink
              to="/cart"
              class="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors hover:bg-secondary"
              @click="closeMobile"
            >
              <ShoppingCart class="h-4 w-4 text-muted-foreground" />
              Carrito
              <Badge
                v-if="totalItems > 0"
                variant="destructive"
                class="ml-auto"
              >
                {{ totalItems }}
              </Badge>
            </NuxtLink>
          </div>

          <Separator />

          <div class="flex flex-col gap-2 p-4">
            <Button as-child class="w-full" @click="closeMobile">
              <NuxtLink to="/auth/register">Crear cuenta</NuxtLink>
            </Button>
            <Button variant="outline" as-child class="w-full" @click="closeMobile">
              <NuxtLink to="/auth/login">Iniciar sesión</NuxtLink>
            </Button>
          </div>
        </template>
      </div>
    </SheetContent>
  </Sheet>
</template>
