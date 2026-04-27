<script setup lang="ts">
import { toast } from 'vue-sonner'

const auth = useAuthState()

const form = reactive({
  name: '',
  email: '',
  password: '',
  confirmPassword: ''
})

const errors = reactive({
  name: '',
  email: '',
  password: '',
  confirmPassword: ''
})

const loading = ref(false)
const statusMessage = ref('')
const statusError = ref('')

function validate() {
  errors.name = ''
  errors.email = ''
  errors.password = ''
  errors.confirmPassword = ''

  if (!form.name.trim()) {
    errors.name = 'El nombre es obligatorio.'
  }

  if (!form.email.trim()) {
    errors.email = 'El email es obligatorio.'
  } else if (!/^\S+@\S+\.\S+$/.test(form.email)) {
    errors.email = 'Ingresa un email valido.'
  }

  if (!form.password) {
    errors.password = 'La contrasena es obligatoria.'
  } else if (form.password.length < 8) {
    errors.password = 'La contrasena debe tener al menos 8 caracteres.'
  }

  if (!form.confirmPassword) {
    errors.confirmPassword = 'Confirma tu contrasena.'
  } else if (form.confirmPassword !== form.password) {
    errors.confirmPassword = 'Las contrasenas no coinciden.'
  }

  return !errors.name && !errors.email && !errors.password && !errors.confirmPassword
}

async function onSubmit() {
  statusMessage.value = ''
  statusError.value = ''

  if (!validate()) {
    return
  }

  loading.value = true

  try {
    const result = await auth.register({
      name: form.name.trim(),
      email: form.email.trim(),
      password: form.password
    })

    const msg = result?.message ?? 'Registro enviado correctamente.'
    statusMessage.value = msg
    toast.success(msg)
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Ocurrio un error al registrarte.'
    statusError.value = msg
    toast.error(msg)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <section class="auth-page">
    <div class="auth-page__glow" aria-hidden="true" />
    <AuthFormCard
      title="Crear cuenta"
      description="Crea tu perfil para comprar mas rapido y recibir seguimiento de pedidos."
    >
      <form class="auth-form" novalidate @submit.prevent="onSubmit">
        <label>
          <span>Nombre</span>
          <input v-model="form.name" type="text" autocomplete="name" placeholder="Tu nombre">
          <small v-if="errors.name" class="auth-form__error">{{ errors.name }}</small>
        </label>

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
            autocomplete="new-password"
            placeholder="Minimo 8 caracteres"
          >
          <small v-if="errors.password" class="auth-form__error">{{ errors.password }}</small>
        </label>

        <label>
          <span>Confirmar contrasena</span>
          <input
            v-model="form.confirmPassword"
            type="password"
            autocomplete="new-password"
            placeholder="Repite tu contrasena"
          >
          <small v-if="errors.confirmPassword" class="auth-form__error">{{ errors.confirmPassword }}</small>
        </label>

        <button type="submit" :disabled="loading">
          {{ loading ? 'Creando cuenta...' : 'Crear cuenta' }}
        </button>

        <p v-if="statusMessage" class="auth-form__success">{{ statusMessage }}</p>
        <p v-if="statusError" class="auth-form__error auth-form__error--block">{{ statusError }}</p>
      </form>

      <p class="auth-switch">
        Ya tienes cuenta?
        <NuxtLink to="/auth/login">Inicia sesion</NuxtLink>
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
  width: min(70vw, 40rem);
  height: min(70vw, 40rem);
  border-radius: 999px;
  background: radial-gradient(circle, rgb(251 146 60 / 0.3) 0%, rgb(251 146 60 / 0) 72%);
  filter: blur(8px);
  transform: translateY(-12%);
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
  transition: transform 160ms ease, filter 160ms ease;
}

button:hover:not(:disabled) {
  transform: translateY(-1px);
  filter: saturate(1.12);
}

button:disabled {
  cursor: not-allowed;
  opacity: 0.7;
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

.auth-switch {
  margin: 1rem 0 0;
  color: var(--text-muted);
}

.auth-switch a {
  color: var(--accent);
}
</style>
