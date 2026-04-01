<script setup lang="ts">
import { requestPasswordReset } from '~/composables/useAuthApi'

const form = reactive({
  email: ''
})

const error = ref('')
const success = ref('')
const loading = ref(false)

function validateEmail(value: string) {
  return /^\S+@\S+\.\S+$/.test(value)
}

async function onSubmit() {
  error.value = ''
  success.value = ''

  if (!validateEmail(form.email.trim())) {
    error.value = 'Ingresa un email valido para solicitar el reseteo.'
    return
  }

  loading.value = true

  try {
    const result = await requestPasswordReset({ email: form.email.trim() })
    success.value = result?.message ?? 'Si el email existe, enviaremos instrucciones para recuperar tu acceso.'
  } catch (submitError) {
    error.value = submitError instanceof Error ? submitError.message : 'No se pudo procesar la solicitud.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <section class="auth-page">
    <AuthFormCard
      title="Recuperar contrasena"
      description="Te enviaremos un token de recuperacion para restablecer tu acceso."
    >
      <form class="auth-form" novalidate @submit.prevent="onSubmit">
        <label>
          <span>Email</span>
          <input v-model="form.email" type="email" autocomplete="email" placeholder="tu@email.com">
        </label>

        <button type="submit" :disabled="loading">
          {{ loading ? 'Solicitando...' : 'Solicitar reset' }}
        </button>

        <p v-if="success" class="auth-form__success">{{ success }}</p>
        <p v-if="error" class="auth-form__error">{{ error }}</p>
      </form>

      <p class="auth-switch">
        Ya tienes token?
        <NuxtLink to="/auth/reset-confirm">Confirmar nueva contrasena</NuxtLink>
      </p>
    </AuthFormCard>
  </section>
</template>

<style scoped>
.auth-page {
  min-height: calc(100vh - 74px);
  display: grid;
  place-items: center;
  padding: 2rem 1rem;
}

.auth-form {
  display: grid;
  gap: 1rem;
  margin-top: 1.5rem;
}

label {
  display: grid;
  gap: 0.5rem;
}

input {
  border: 1px solid var(--border-soft);
  border-radius: 0.65rem;
  padding: 0.75rem;
  font: inherit;
}

button {
  border: 0;
  border-radius: 0.65rem;
  padding: 0.8rem;
  font-weight: 700;
  font: inherit;
  color: #fff;
  background: linear-gradient(120deg, var(--accent), var(--accent-strong));
  cursor: pointer;
}

.auth-form__error {
  margin: 0;
  color: var(--danger);
}

.auth-form__success {
  margin: 0;
  color: var(--success);
}

.auth-switch {
  margin: 1rem 0 0;
  color: var(--text-muted);
}

.auth-switch a {
  color: var(--accent);
}
</style>
