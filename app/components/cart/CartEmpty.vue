<script setup lang="ts">
// No props — pure presentation component
</script>

<template>
  <div class="border border-input rounded-xl bg-background p-6 text-center">
    <p class="text-lg font-bold m-0">Tu carrito esta vacio.</p>
    <p class="text-muted-foreground mt-2">Agrega productos desde el catalogo para iniciar tu compra.</p>
    <NuxtLink
      to="/products"
      class="inline-block mt-4 px-5 py-2.5 rounded-lg bg-gradient-to-br from-primary to-primary/90 text-white font-bold no-underline hover:opacity-95 transition-opacity"
    >
      Ir al catalogo
    </NuxtLink>
  </div>
</template>
