<script setup lang="ts">
const auth = useAuthState()

const form = reactive({
  email: '',
  password: ''
})

const errors = reactive({
  email: '',
  password: ''
})

const loading = ref(false)
const statusMessage = ref('')
const statusError = ref('')

const apiBase = useRuntimeConfig().public.apiBase

function validate() {
  errors.email = ''
  errors.password = ''

  if (!form.email.trim()) {
    errors.email = 'El email es obligatorio.'
  } else if (!/^\S+@\S+\.\S+$/.test(form.email)) {
    errors.email = 'Ingresa un email valido.'
  }

  if (!form.password) {
    errors.password = 'La contrasena es obligatoria.'
  } else if (form.password.length < 6) {
    errors.password = 'Usa al menos 6 caracteres.'
  }

  return !errors.email && !errors.password
}

async function onSubmit() {
  statusMessage.value = ''
  statusError.value = ''

  if (!validate()) {
    return
  }

  loading.value = true

  try {
    const result = await auth.login({
      email: form.email.trim(),
      password: form.password
    })

    statusMessage.value = result?.message ?? 'Sesion iniciada correctamente.'
    await navigateTo('/')
  } catch (error) {
    statusError.value = error instanceof Error ? error.message : 'Ocurrio un error al iniciar sesion.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <section class="auth-page">
    <div class="auth-page__glow" aria-hidden="true" />
    <AuthFormCard
      title="Iniciar sesion"
      description="Accede a tu cuenta para continuar comprando. Sesion JWT con fallback sin /auth/me."
    >
      <form class="auth-form" novalidate @submit.prevent="onSubmit">
        <label>
          <span>Email</span>
          <input v-model="form.email" type="email" autocomplete="email" placeholder="tu@email.com">
          <small v-if="errors.email" class="auth-form__error">{{ errors.email }}</small>
        </label>

        <label>
          <span>Contrasena</span>
          <input
            v-model="form.password"
            type="password"
            autocomplete="current-password"
            placeholder="Tu contrasena"
          >
          <small v-if="errors.password" class="auth-form__error">{{ errors.password }}</small>
        </label>

        <button type="submit" :disabled="loading">
          {{ loading ? 'Iniciando...' : 'Entrar' }}
        </button>

        <p v-if="statusMessage" class="auth-form__success">{{ statusMessage }}</p>
        <p v-if="statusError" class="auth-form__error auth-form__error--block">{{ statusError }}</p>

        <p class="auth-form__hint">API base actual: <code>{{ apiBase }}</code></p>
      </form>

      <p class="auth-meta">
        Olvidaste tu contrasena?
        <NuxtLink to="/auth/reset-request">Recuperarla ahora</NuxtLink>
      </p>

      <p class="auth-switch">
        No tienes cuenta?
        <NuxtLink to="/auth/register">Crea una aqui</NuxtLink>
      </p>
    </AuthFormCard>
  </section>
</template>

<style scoped>
.auth-page {
  position: relative;
  isolation: isolate;
  min-height: calc(100vh - 74px);
  display: grid;
  place-items: center;
  padding: 2rem 1rem 3rem;
}

.auth-page__glow {
  position: absolute;
  z-index: -1;
  width: min(75vw, 42rem);
  height: min(75vw, 42rem);
  border-radius: 999px;
  background: radial-gradient(circle, rgb(245 158 11 / 0.32) 0%, rgb(245 158 11 / 0) 68%);
  filter: blur(6px);
  transform: translateY(-8%);
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
  border: 1px solid rgb(146 64 14 / 0.2);
  border-radius: 0.65rem;
  padding: 0.8rem;
  font-weight: 700;
  font: inherit;
  color: #fff7ed;
  background: linear-gradient(
    120deg,
    var(--accent, #d97706),
    var(--accent-strong, #b45309)
  );
  box-shadow: 0 6px 18px rgb(217 119 6 / 0.28);
  cursor: pointer;
  transition: transform 160ms ease, filter 160ms ease, box-shadow 160ms ease;
}

button:hover:not(:disabled) {
  transform: translateY(-1px);
  filter: saturate(1.08) brightness(0.98);
  box-shadow: 0 10px 22px rgb(180 83 9 / 0.32);
}

button:disabled {
  cursor: not-allowed;
  opacity: 1;
  color: #fed7aa;
  background: linear-gradient(120deg, #c2410c, #9a3412);
  box-shadow: none;
}

.auth-form__error {
  color: var(--danger);
}

.auth-form__error--block {
  margin: 0;
}

.auth-form__success {
  margin: 0;
  color: var(--success);
}

.auth-form__hint {
  margin: 0;
  color: var(--text-muted);
  font-size: 0.9rem;
}

.auth-switch {
  margin: 1rem 0 0;
  color: var(--text-muted);
}

.auth-meta {
  margin: 1rem 0 0;
  color: var(--text-muted);
}

.auth-switch a {
  color: var(--accent);
}

.auth-meta a {
  color: var(--accent);
}

code {
  background: #eff4f8;
  border-radius: 0.25rem;
  padding: 0.15rem 0.4rem;
}
</style>
