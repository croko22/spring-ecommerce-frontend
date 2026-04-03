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
    <div class="home__actions">
      <NuxtLink class="home__button" to="/products">Ver catalogo</NuxtLink>
      <NuxtLink class="home__button home__button--ghost" to="/auth/login">Probar login</NuxtLink>
      <NuxtLink class="home__button home__button--ghost" to="/auth/register">Crear cuenta</NuxtLink>
    </div>
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
  color: var(--text-muted);
  line-height: 1.7;
}

.home__actions {
  display: flex;
  gap: 0.75rem;
  margin-top: 1.5rem;
  flex-wrap: wrap;
}

.home__button {
  padding: 0.65rem 1rem;
  border-radius: 0.6rem;
  text-decoration: none;
  font-weight: 600;
  color: #fff;
  background: var(--accent);
}

.home__button:hover {
  background: var(--accent-hover);
}

.home__button--ghost {
  color: var(--text-main);
  background: #fff;
  border: 1px solid var(--border-soft);
}

code {
  background: #e2e8f0;
  border-radius: 0.25rem;
  padding: 0.15rem 0.4rem;
}
</style>
