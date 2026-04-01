<template>
  <div class="app-shell">
    <header class="app-shell__header">
      <div class="app-shell__brand">Ecommerce Nuxt</div>
      <nav class="app-shell__nav">
        <NuxtLink to="/">Inicio</NuxtLink>
      </nav>
    </header>

    <main class="app-shell__main">
      <slot />
    </main>
  </div>
</template>

<style scoped>
.app-shell {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.app-shell__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.25rem;
  border-bottom: 1px solid #d9dee7;
}

.app-shell__brand {
  font-weight: 700;
  letter-spacing: 0.02em;
}

.app-shell__nav a {
  color: #1f2937;
  text-decoration: none;
  font-weight: 500;
}

.app-shell__main {
  flex: 1;
}
</style>
