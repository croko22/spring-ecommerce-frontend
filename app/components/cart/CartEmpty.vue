<script setup lang="ts">
import { ShoppingCart } from 'lucide-vue-next'
</script>

<template>
  <div class="border border-input rounded-xl bg-background p-8 text-center flex flex-col items-center">
    <div class="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
      <ShoppingCart class="w-8 h-8 text-muted-foreground" />
    </div>
    <p class="text-lg font-bold m-0">Tu carrito esta vacio.</p>
    <p class="text-muted-foreground mt-2 text-sm max-w-xs">Agrega productos desde el catalogo para iniciar tu compra.</p>
    <NuxtLink
      to="/products"
      class="inline-block mt-5 px-5 py-2.5 rounded-lg bg-gradient-to-br from-primary to-primary/90 text-white font-bold no-underline hover:opacity-95 transition-opacity text-sm"
    >
      Ir al catalogo
    </NuxtLink>
  </div>
</template>
