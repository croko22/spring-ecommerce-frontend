<script setup lang="ts">
import { Search } from 'lucide-vue-next'

const mobileSearchOpen = ref(false)
const searchInput = ref<HTMLInputElement | null>(null)

function openMobileSearch() {
  mobileSearchOpen.value = true
  nextTick(() => searchInput.value?.focus())
}

function closeMobileSearch() {
  mobileSearchOpen.value = false
}
</script>

<template>
  <!-- Desktop -->
  <div class="hidden flex-1 justify-center md:flex">
    <div class="relative w-full max-w-[420px]">
      <div class="flex items-center gap-2 rounded-full bg-[#F0F4F8] px-4 py-2 text-sm text-muted-foreground transition-all duration-200 focus-within:ring-2 focus-within:ring-[#53A8B6] dark:bg-[#0D0D1A]">
        <Search class="h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Buscar productos..."
          class="flex-1 bg-transparent outline-none placeholder:text-muted-foreground"
        />
      </div>
    </div>
  </div>

  <!-- Mobile trigger -->
  <button class="flex h-9 w-9 items-center justify-center md:hidden" @click="openMobileSearch">
    <Search class="h-4 w-4 text-muted-foreground" />
  </button>

  <!-- Mobile expanded search (overlay) -->
  <Transition
    enter-active-class="transition duration-200 ease-out"
    enter-from-class="opacity-0 -translate-y-2"
    enter-to-class="opacity-100 translate-y-0"
    leave-active-class="transition duration-150 ease-in"
    leave-from-class="opacity-100 translate-y-0"
    leave-to-class="opacity-0 -translate-y-2"
  >
    <div v-if="mobileSearchOpen" class="absolute inset-x-0 top-0 z-50 border-b bg-background px-4 py-3 shadow-sm md:hidden">
      <div class="flex items-center gap-2 rounded-full bg-[#F0F4F8] px-4 py-2 dark:bg-[#0D0D1A]">
        <Search class="h-4 w-4 text-muted-foreground" />
        <input
          ref="searchInput"
          type="text"
          placeholder="Buscar productos..."
          class="flex-1 bg-transparent outline-none placeholder:text-muted-foreground"
        />
        <button class="text-sm font-medium text-[#0F3460] dark:text-[#53A8B6]" @click="closeMobileSearch">
          Cancelar
        </button>
      </div>
    </div>
  </Transition>
</template>
