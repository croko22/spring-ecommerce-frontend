<script setup lang="ts">
import { ShoppingCart, Package, User, Settings, Shield, LogOut } from 'lucide-vue-next'
import {
  Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription,
} from '~/components/ui/sheet'
import { Button } from '~/components/ui/button'
import { Badge } from '~/components/ui/badge'
import { Separator } from '~/components/ui/separator'

const props = defineProps<{
  open: boolean
  navLinks: Array<{ to: string; label: string; icon: string; exact: boolean }>
}>()
const emit = defineEmits<{ (e: 'update:open', v: boolean): void; (e: 'close'): void }>()

const auth = useAuthState()
const { totalItems } = useCart()
const route = useRoute()

const displayName = computed(() => auth.user.value?.name ?? 'Usuario')
const isAdmin = computed(() => auth.user.value?.roles?.some((r: string) => /admin/i.test(r)) ?? false)

function close() { emit('update:open', false); emit('close') }
</script>

<template>
  <Sheet :open="open" @update:open="emit('update:open', $event)">
    <SheetContent side="right" class="w-[300px] p-0 sm:max-w-sm">
      <SheetHeader class="border-b px-4 py-4">
        <SheetTitle class="flex items-center gap-2 text-left">
          <div class="flex h-7 w-7 items-center justify-center rounded-[8px] bg-gradient-to-br from-[#0F3460] to-[#53A8B6] text-xs font-bold text-white">SF</div>
          ShopFlow
        </SheetTitle>
        <SheetDescription class="sr-only">Menú de navegación</SheetDescription>
      </SheetHeader>

      <div class="flex flex-col overflow-y-auto">
        <nav class="flex flex-col gap-0.5 p-2">
          <NuxtLink
            v-for="link in navLinks"
            :key="link.to"
            :to="link.to"
            class="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors hover:bg-secondary"
            :class="{ 'bg-secondary font-semibold': link.exact ? route.path === link.to : route.path.startsWith(link.to) }"
            @click="close"
          >
            {{ link.label }}
          </NuxtLink>
        </nav>

        <Separator />

        <template v-if="auth.isAuthenticated">
          <div class="flex flex-col gap-0.5 p-2">
            <NuxtLink to="/cart" class="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors hover:bg-secondary" :class="{ 'bg-secondary font-semibold': route.path === '/cart' }" @click="close">
              <ShoppingCart class="h-4 w-4 text-muted-foreground" /> Carrito
              <Badge v-if="totalItems > 0" variant="destructive" class="ml-auto">{{ totalItems }}</Badge>
            </NuxtLink>
            <NuxtLink to="/orders" class="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors hover:bg-secondary" :class="{ 'bg-secondary font-semibold': route.path.startsWith('/orders') }" @click="close">
              <Package class="h-4 w-4 text-muted-foreground" /> Mis órdenes
            </NuxtLink>
            <NuxtLink to="/profile" class="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors hover:bg-secondary" :class="{ 'bg-secondary font-semibold': route.path === '/profile' }" @click="close">
              <User class="h-4 w-4 text-muted-foreground" /> Mi perfil
            </NuxtLink>
            <NuxtLink to="/settings" class="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors hover:bg-secondary" :class="{ 'bg-secondary font-semibold': route.path.startsWith('/settings') }" @click="close">
              <Settings class="h-4 w-4 text-muted-foreground" /> Configuración
            </NuxtLink>
            <NuxtLink v-if="isAdmin" to="/admin" class="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors hover:bg-secondary" :class="{ 'bg-secondary font-semibold': route.path.startsWith('/admin') }" @click="close">
              <Shield class="h-4 w-4 text-muted-foreground" /> Admin
            </NuxtLink>
          </div>
          <Separator />
          <div class="p-2">
            <div class="rounded-md bg-secondary/50 px-3 py-2.5">
              <p class="text-sm font-semibold">{{ displayName }}</p>
              <p class="truncate text-xs text-muted-foreground">{{ auth.user.value?.email }}</p>
            </div>
          </div>
          <div class="p-2 pt-0">
            <button type="button" class="flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-destructive transition-colors hover:bg-destructive/10" @click="close; auth.logout()">
              <LogOut class="h-4 w-4" /> Cerrar sesión
            </button>
          </div>
        </template>

        <template v-else>
          <div class="flex flex-col gap-0.5 p-2">
            <NuxtLink to="/cart" class="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors hover:bg-secondary" @click="close">
              <ShoppingCart class="h-4 w-4 text-muted-foreground" /> Carrito
              <Badge v-if="totalItems > 0" variant="destructive" class="ml-auto">{{ totalItems }}</Badge>
            </NuxtLink>
          </div>
          <Separator />
          <div class="flex flex-col gap-2 p-4">
            <Button as-child class="w-full" @click="close">
              <NuxtLink to="/auth/register">Crear cuenta</NuxtLink>
            </Button>
            <Button variant="outline" as-child class="w-full" @click="close">
              <NuxtLink to="/auth/login">Iniciar sesión</NuxtLink>
            </Button>
          </div>
        </template>
      </div>
    </SheetContent>
  </Sheet>
</template>
