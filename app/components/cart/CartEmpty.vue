<script setup lang="ts">
</script>

<template>
  <div class="flex flex-col items-center justify-center py-12 px-6 text-center">
    <div class="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-4">
      <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="text-muted-foreground"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>
    </div>
    <h3 class="text-lg font-semibold m-0">Tu carrito está vacío</h3>
    <p class="text-muted-foreground mt-2 mb-6 max-w-xs">Agrega productos desde el catálogo para iniciar tu compra.</p>
    <NuxtLink
      to="/products"
      class="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-gradient-to-br from-primary to-primary/90 text-white font-semibold no-underline hover:opacity-95 hover:shadow-md transition-all"
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 5-7 7 7 7"/><path d="M5 12h14"/></svg>
      Ir al catálogo
    </NuxtLink>
  </div>
</template>
