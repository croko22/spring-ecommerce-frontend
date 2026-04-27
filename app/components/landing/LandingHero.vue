<script setup lang="ts">
</script>

<template>
  <section class="relative overflow-hidden bg-gradient-to-br from-orange-50 via-white to-orange-100 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900">
    <div
      class="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1920&q=80')] bg-cover bg-center opacity-5 dark:opacity-10"
      aria-hidden="true"
    />

    <div class="container relative z-10 flex flex-col items-center px-4 py-20 text-center md:py-32 lg:py-40">
      <h1 class="animate-fade-in text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
        Tu tienda online,
        <span class="text-primary">hecha simple</span>
      </h1>

      <p class="animate-fade-in mx-auto mt-6 max-w-2xl text-lg text-muted-foreground md:text-xl">
        Descubre productos seleccionados con los mejores precios.
        Compra fácil, recibe rápido.
      </p>

      <div class="animate-slide-up mt-8 flex flex-wrap justify-center gap-4">
        <NuxtLink to="/products" class="btn btn-primary px-8 py-3 text-base">
          Ver productos
        </NuxtLink>
        <NuxtLink to="/auth/register" class="btn btn-outline px-8 py-3 text-base">
          Crear cuenta
        </NuxtLink>
      </div>
    </div>
  </section>
</template>
