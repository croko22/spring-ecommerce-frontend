<script setup lang="ts">
const apiBase = useRuntimeConfig().public.apiBase
</script>

<template>
  <section class="home">
    <p class="home__eyebrow">Frontend setup listo</p>
    <h1 class="home__title">Nuxt + TypeScript inicializado</h1>
    <p class="home__description">
      Esta base conecta el frontend con el backend Spring Boot usando
      <code>{{ apiBase }}</code>.
    </p>
  </section>
</template>

<style scoped>
.home {
  max-width: 56rem;
  margin: 0 auto;
  padding: 4rem 1.25rem;
}

.home__eyebrow {
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #334155;
  margin-bottom: 0.5rem;
}

.home__title {
  font-size: clamp(1.75rem, 4vw, 2.5rem);
  line-height: 1.2;
  margin: 0;
}

.home__description {
  margin-top: 1rem;
  color: #475569;
  line-height: 1.7;
}

code {
  background: #e2e8f0;
  border-radius: 0.25rem;
  padding: 0.15rem 0.4rem;
}
</style>
