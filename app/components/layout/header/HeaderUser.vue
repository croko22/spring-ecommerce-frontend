<script setup lang="ts">
import { ChevronDown, LogOut, User, Package, Settings, Shield } from 'lucide-vue-next'
import { onClickOutside } from '@vueuse/core'
import { Button } from '~/components/ui/button'

const auth = useAuthState()
auth.hydrate()

const displayName = computed(() => auth.user.value?.name ?? 'Usuario')
const initials = computed(() => {
  const parts = displayName.value.split(' ')
  if (parts.length >= 2) return ((parts[0]?.[0] ?? '') + (parts[1]?.[0] ?? '')).toUpperCase()
  return parts[0]?.[0]?.toUpperCase() ?? 'U'
})
const isAdmin = computed(() => auth.user.value?.roles?.some((r: string) => /admin/i.test(r)) ?? false)

const dropdownOpen = ref(false)
const dropdownContainer = ref<HTMLElement | null>(null)

function toggleDropdown() { dropdownOpen.value = !dropdownOpen.value }
function closeDropdown() { dropdownOpen.value = false }
function onLogout() { dropdownOpen.value = false; auth.logout() }

onClickOutside(dropdownContainer, () => { dropdownOpen.value = false })
</script>

<template>
  <!-- Guest -->
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

  <!-- Authenticated -->
  <template v-else>
    <div class="hidden items-center md:flex">
      <div ref="dropdownContainer" class="relative">
        <Button variant="ghost" size="sm" class="flex items-center gap-1.5 rounded-full border pl-1.5 pr-2" @click="toggleDropdown">
          <span class="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-[#0F3460] to-[#53A8B6] text-xs font-bold text-white">
            {{ initials }}
          </span>
          <span class="hidden text-sm font-medium lg:inline">{{ displayName.split(' ')[0] }}</span>
          <ChevronDown class="h-3.5 w-3.5 text-muted-foreground transition-transform duration-200" :class="{ 'rotate-180': dropdownOpen }" />
        </Button>

        <Transition
          enter-active-class="transition duration-150 ease-out"
          enter-from-class="opacity-0 -translate-y-1"
          enter-to-class="opacity-100 translate-y-0"
          leave-active-class="transition duration-100 ease-in"
          leave-from-class="opacity-100 translate-y-0"
          leave-to-class="opacity-0 -translate-y-1"
        >
          <div v-if="dropdownOpen" class="absolute right-0 top-full z-50 mt-1.5 w-56 overflow-hidden rounded-lg border bg-card p-1 shadow-lg">
            <div class="border-b px-3 py-2.5">
              <p class="text-sm font-semibold">{{ displayName }}</p>
              <p class="truncate text-xs text-muted-foreground">{{ auth.user.value?.email }}</p>
            </div>
            <div class="py-1">
              <NuxtLink to="/profile" class="flex items-center gap-2.5 rounded-md px-3 py-2 text-sm transition-colors hover:bg-secondary" @click="closeDropdown">
                <User class="h-4 w-4 text-muted-foreground" /> Mi perfil
              </NuxtLink>
              <NuxtLink to="/orders" class="flex items-center gap-2.5 rounded-md px-3 py-2 text-sm transition-colors hover:bg-secondary" @click="closeDropdown">
                <Package class="h-4 w-4 text-muted-foreground" /> Mis órdenes
              </NuxtLink>
              <NuxtLink to="/settings" class="flex items-center gap-2.5 rounded-md px-3 py-2 text-sm transition-colors hover:bg-secondary" @click="closeDropdown">
                <Settings class="h-4 w-4 text-muted-foreground" /> Configuración
              </NuxtLink>
              <NuxtLink v-if="isAdmin" to="/admin" class="flex items-center gap-2.5 rounded-md px-3 py-2 text-sm transition-colors hover:bg-secondary" @click="closeDropdown">
                <Shield class="h-4 w-4 text-muted-foreground" /> Admin
              </NuxtLink>
            </div>
            <div class="border-t pt-1">
              <button type="button" class="flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-sm text-destructive transition-colors hover:bg-destructive/10" @click="onLogout">
                <LogOut class="h-4 w-4" /> Cerrar sesión
              </button>
            </div>
          </div>
        </Transition>
      </div>
    </div>
  </template>
</template>
