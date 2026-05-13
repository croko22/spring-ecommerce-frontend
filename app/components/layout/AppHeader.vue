<script setup lang="ts">
import { Menu, ShoppingCart } from 'lucide-vue-next'
import { Button } from '~/components/ui/button'
import { Badge } from '~/components/ui/badge'

const auth = useAuthState()
auth.hydrate()
const { totalItems } = useCart()
const route = useRoute()

const mobileOpen = ref(false)

const isAdmin = computed(() => auth.user.value?.roles?.some((r: string) => /admin/i.test(r)) ?? false)

const navLinks = computed(() => {
  const links = [
    { to: '/', label: 'Inicio', icon: 'Home', exact: true },
    { to: '/products', label: 'Productos', icon: 'Package', exact: false },
  ]
  if (isAdmin.value) links.push({ to: '/admin', label: 'Admin', icon: 'Shield', exact: false })
  return links
})
</script>

<template>
  <header class="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md dark:bg-[#1A1A2E]/80">
    <div class="container flex h-16 items-center justify-between px-4">
      <!-- Left: Logo -->
      <HeaderLogo />

      <!-- Center: Search (desktop) -->
      <HeaderSearch />

      <!-- Right: Actions + User -->
      <div class="flex items-center gap-1">
        <HeaderActions />
        <HeaderUser />

        <!-- Mobile cart (always visible) -->
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
              :class="true ? 'bg-[#0F3460] dark:bg-[#53A8B6]' : ''"
            >
              {{ totalItems }}
            </Badge>
          </NuxtLink>
        </Button>

        <!-- Mobile hamburger -->
        <Button variant="ghost" size="icon" class="h-9 w-9 md:hidden" @click="mobileOpen = true">
          <Menu class="h-5 w-5" />
        </Button>
      </div>
    </div>
  </header>

  <!-- Mobile Sheet -->
  <HeaderMobile v-model:open="mobileOpen" :nav-links="navLinks" @close="mobileOpen = false" />
</template>
