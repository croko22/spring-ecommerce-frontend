<script setup lang="ts">
import { confirmPasswordReset } from '~/composables/useAuthApi'

const route = useRoute()

const form = reactive({
  token: String(route.query.token ?? ''),
  password: '',
  confirmPassword: ''
})

const error = ref('')
const success = ref('')
const loading = ref(false)

function validate() {
  error.value = ''

  if (!form.token.trim()) {
    error.value = 'El token es obligatorio.'
    return false
  }

  if (form.password.length < 8) {
    error.value = 'La contrasena debe tener al menos 8 caracteres.'
    return false
  }

  if (form.password !== form.confirmPassword) {
    error.value = 'Las contrasenas no coinciden.'
    return false
  }

  return true
}

async function onSubmit() {
  success.value = ''

  if (!validate()) {
    return
  }

  loading.value = true

  try {
    const result = await confirmPasswordReset({
      token: form.token.trim(),
      password: form.password,
      confirmPassword: form.confirmPassword
    })

    success.value = result?.message ?? 'Contrasena actualizada correctamente. Ya puedes iniciar sesion.'
  } catch (submitError) {
    error.value = submitError instanceof Error ? submitError.message : 'No se pudo actualizar la contrasena.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <section class="auth-page">
    <AuthFormCard
      title="Confirmar nueva contrasena"
      description="Ingresa el token recibido y define una nueva contrasena segura."
    >
      <form class="auth-form" novalidate @submit.prevent="onSubmit">
        <label>
          <span>Token de recuperacion</span>
          <input v-model="form.token" type="text" autocomplete="one-time-code" placeholder="Pega el token recibido">
        </label>

        <label>
          <span>Nueva contrasena</span>
          <input v-model="form.password" type="password" autocomplete="new-password" placeholder="Minimo 8 caracteres">
        </label>

        <label>
          <span>Confirmar contrasena</span>
          <input v-model="form.confirmPassword" type="password" autocomplete="new-password" placeholder="Repite la contrasena">
        </label>

        <button type="submit" :disabled="loading">
          {{ loading ? 'Actualizando...' : 'Actualizar contrasena' }}
        </button>

        <p v-if="success" class="auth-form__success">{{ success }}</p>
        <p v-if="error" class="auth-form__error">{{ error }}</p>
      </form>

      <p class="auth-switch">
        Listo para entrar?
        <NuxtLink to="/auth/login">Iniciar sesion</NuxtLink>
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
