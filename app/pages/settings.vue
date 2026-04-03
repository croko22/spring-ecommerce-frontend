<script setup lang="ts">
import {
  PAGE_SIZE_OPTIONS,
  THEME_OPTIONS,
  type PageSizePreference,
  type ThemePreference
} from '~/utils/userSettings'

const { settings, setTheme, setPageSize, resetSettings } = useUserSettings()
const { clearCart } = useCart()

const hasCleared = ref(false)

function onThemeChange(event: Event) {
  const target = event.target as HTMLSelectElement
  setTheme(target.value as ThemePreference)
}

function onPageSizeChange(event: Event) {
  const target = event.target as HTMLSelectElement
  setPageSize(Number(target.value) as PageSizePreference)
}

function clearPersistedData() {
  clearCart()
  resetSettings()
  hasCleared.value = true
}

useSeoMeta({
  title: 'Configuracion',
  description: 'Preferencias de tema, paginacion y datos locales.'
})
</script>

<template>
  <section class="settings-page">
    <header class="settings-page__header">
      <p class="settings-page__eyebrow">Preferencias</p>
      <h1>Configuracion de usuario</h1>
      <p class="settings-page__subtitle">Ajusta tema, paginacion y revisa la moneda aplicada en la tienda.</p>
    </header>

    <form class="settings-card" @submit.prevent>
      <label class="settings-field" for="theme">
        <span>Tema</span>
        <select id="theme" :value="settings.theme" @change="onThemeChange">
          <option v-for="option in THEME_OPTIONS" :key="option" :value="option">
            {{ option }}
          </option>
        </select>
      </label>

      <label class="settings-field" for="page-size">
        <span>Productos por pagina</span>
        <select id="page-size" :value="settings.pageSize" @change="onPageSizeChange">
          <option v-for="size in PAGE_SIZE_OPTIONS" :key="size" :value="size">
            {{ size }}
          </option>
        </select>
      </label>

      <label class="settings-field" for="currency">
        <span>Moneda</span>
        <input id="currency" type="text" value="PEN (S/)" readonly>
      </label>

      <button type="button" class="settings-clear" @click="clearPersistedData">
        Limpiar datos guardados (carrito + configuracion)
      </button>

      <p v-if="hasCleared" class="settings-feedback">Datos locales eliminados correctamente.</p>
    </form>
  </section>
</template>

<style scoped>
.settings-page {
  max-width: 48rem;
  margin: 0 auto;
  padding: 2rem 1.2rem 3rem;
}

.settings-page__header h1 {
  margin: 0.35rem 0 0;
}

.settings-page__eyebrow {
  margin: 0;
  font-size: 0.8rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--text-muted);
}

.settings-page__subtitle {
  margin: 0.5rem 0 0;
  color: var(--text-muted);
}

.settings-card {
  margin-top: 1.1rem;
  border: 1px solid var(--border-soft);
  border-radius: 0.9rem;
  background: #fff;
  padding: 1rem;
  display: grid;
  gap: 0.85rem;
}

.settings-field {
  display: grid;
  gap: 0.35rem;
}

.settings-field span {
  color: var(--text-muted);
  font-size: 0.9rem;
}

.settings-field select,
.settings-field input {
  border: 1px solid var(--border-soft);
  border-radius: 0.65rem;
  padding: 0.68rem 0.78rem;
  background: #fff;
}

.settings-field input[readonly] {
  color: var(--text-main);
}

.settings-clear {
  margin-top: 0.25rem;
  border: 1px solid #fecaca;
  background: #fff1f2;
  color: #991b1b;
  border-radius: 0.65rem;
  padding: 0.7rem 0.85rem;
  font-weight: 700;
  cursor: pointer;
}

.settings-feedback {
  margin: 0;
  color: #166534;
  font-weight: 600;
}

@media (max-width: 620px) {
  .settings-page {
    padding-inline: 0.85rem;
  }
}
</style>
