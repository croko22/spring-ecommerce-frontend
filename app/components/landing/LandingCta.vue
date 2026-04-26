<script setup lang="ts">
</script>

<template>
  <section class="bg-gradient-to-r from-primary/90 to-primary py-20 md:py-28">
    <div class="container flex flex-col items-center px-4 text-center">
      <h2 class="text-3xl font-bold tracking-tight text-primary-foreground sm:text-4xl">
        ¿Listo para empezar?
      </h2>
      <p class="mx-auto mt-4 max-w-xl text-primary-foreground/80">
        Regístrate gratis y descubre una nueva forma de comprar online.
      </p>
      <NuxtLink
        to="/auth/register"
        class="mt-8 inline-flex items-center gap-2 rounded-xl bg-primary-foreground px-8 py-3 font-semibold text-primary shadow-lg transition-transform hover:scale-105"
      >
        Comenzar ahora
      </NuxtLink>
    </div>
  </section>
</template>
