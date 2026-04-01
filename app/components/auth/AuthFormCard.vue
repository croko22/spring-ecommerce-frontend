<script setup lang="ts">
defineProps<{
  title: string
  description: string
}>()
</script>

<template>
  <section class="auth-card">
    <header class="auth-card__header">
      <h1>{{ title }}</h1>
      <p>{{ description }}</p>
    </header>
    <slot />
  </section>
</template>

<style scoped>
.auth-card {
  width: min(100%, 32rem);
  border-radius: 1.2rem;
  border: 1px solid var(--border-soft);
  background: linear-gradient(180deg, #fff, #fffaf3);
  padding: 1.6rem;
  box-shadow: 0 18px 50px rgb(16 42 67 / 0.13);
}

.auth-card__header h1 {
  margin: 0;
  font-size: clamp(1.5rem, 4vw, 2rem);
}

.auth-card__header p {
  margin: 0.5rem 0 0;
  color: var(--text-muted);
  line-height: 1.6;
}
</style>
