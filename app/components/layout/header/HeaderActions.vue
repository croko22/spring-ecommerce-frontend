<script setup lang="ts">
import { Heart, ShoppingCart, Sun, Moon } from 'lucide-vue-next'
import { useDark, useToggle } from '@vueuse/core'
import { Button } from '~/components/ui/button'
import { Badge } from '~/components/ui/badge'

const { totalItems } = useCart()
const isDark = useDark()
const toggleDarkMode = useToggle(isDark)
</script>

<template>
  <div class="flex items-center gap-1">
    <!-- Dark mode toggle -->
    <Button variant="ghost" size="icon" class="h-9 w-9" :aria-label="isDark ? 'Modo claro' : 'Modo oscuro'" @click="toggleDarkMode">
      <Sun v-if="isDark" class="h-4 w-4" />
      <Moon v-else class="h-4 w-4" />
    </Button>

    <!-- Wishlist (auth only) -->
    <Button variant="ghost" size="icon" class="relative h-9 w-9 max-md:hidden">
      <NuxtLink to="/wishlist" aria-label="Favoritos">
        <Heart class="h-4 w-4" />
      </NuxtLink>
    </Button>

    <!-- Cart -->
    <Button variant="ghost" size="icon" class="relative h-9 w-9" as-child>
      <NuxtLink to="/cart" aria-label="Carrito">
        <ShoppingCart class="h-4 w-4" />
        <Badge
          v-if="totalItems > 0"
          variant="destructive"
          class="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[10px] leading-none"
          :class="isDark ? 'bg-[#53A8B6]' : 'bg-[#0F3460]'"
        >
          {{ totalItems }}
        </Badge>
      </NuxtLink>
    </Button>
  </div>
</template>
