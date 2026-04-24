<script setup lang="ts">
import { User, Mail, Phone, MapPin, Save } from 'lucide-vue-next'

const auth = useAuthState()
const { profile, isLoading, isSaving, error, fetchProfile, updateProfile } = useUserProfile()

const isEditing = ref(false)
const saveSuccess = ref(false)

const formData = reactive({
  name: '',
  phone: '',
  address: ''
})

const formErrors = reactive({
  name: '',
  phone: '',
  address: ''
})

onMounted(() => {
  fetchProfile()
})

watchEffect(() => {
  if (profile.value) {
    formData.name = profile.value.name
    formData.phone = profile.value.phone
    formData.address = profile.value.address
  }
})

function validateForm(): boolean {
  let isValid = true
  formErrors.name = ''
  formErrors.phone = ''
  formErrors.address = ''

  if (!formData.name.trim()) {
    formErrors.name = 'El nombre es requerido'
    isValid = false
  }

  if (!formData.phone.trim()) {
    formErrors.phone = 'El telefono es requerido'
    isValid = false
  } else if (!/^(\+51|51)?[9]\d{8}$/.test(formData.phone.replace(/\s/g, ''))) {
    formErrors.phone = 'Ingrese un numero valido (9 digitos)'
    isValid = false
  }

  if (!formData.address.trim()) {
    formErrors.address = 'La direccion es requerida'
    isValid = false
  }

  return isValid
}

async function handleSave() {
  if (!validateForm()) {
    return
  }

  saveSuccess.value = false

  try {
    await updateProfile({
      name: formData.name,
      phone: formData.phone,
      address: formData.address
    })

    saveSuccess.value = true
    isEditing.value = false

    setTimeout(() => {
      saveSuccess.value = false
    }, 3000)
  } catch {
    // Error is handled by composable
  }
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

useSeoMeta({
  title: 'Mi Perfil',
  description: 'Gestiona tu informacion de perfil y direcciones.'
})
</script>

<template>
  <section class="profile-page">
    <header class="profile-page__header">
      <p class="profile-page__eyebrow">Cuenta</p>
      <h1>Mi Perfil</h1>
      <p class="profile-page__subtitle">Gestiona tu informacion personal y de contacto.</p>
    </header>

    <div v-if="isLoading" class="profile-loading">
      <p>Cargando perfil...</p>
    </div>

    <div v-else-if="error" class="profile-error">
      <p>{{ error }}</p>
      <Button variant="outline" @click="fetchProfile">
        Reintentar
      </Button>
    </div>

    <div v-else-if="profile" class="profile-layout">
      <!-- Profile Card -->
      <Card class="profile-card">
        <CardHeader>
          <div class="profile-avatar">
            <div class="profile-avatar__fallback">
              {{ getInitials(profile.name) }}
            </div>
            <div class="profile-avatar__info">
              <CardTitle>{{ profile.name }}</CardTitle>
              <CardDescription>{{ profile.email }}</CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div class="profile-field">
            <div class="profile-field__icon">
              <Mail class="w-4 h-4" />
            </div>
            <div class="profile-field__content">
              <span class="profile-field__label">Correo electronico</span>
              <span class="profile-field__value">{{ profile.email }}</span>
            </div>
          </div>

          <div class="profile-field">
            <div class="profile-field__icon">
              <User class="w-4 h-4" />
            </div>
            <div class="profile-field__content">
              <span class="profile-field__label">Rol</span>
              <span class="profile-field__value">{{ profile.role }}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <!-- Edit Form -->
      <Card class="profile-form-card">
        <CardHeader>
          <div class="profile-form-header">
            <div>
              <CardTitle>Informacion de contacto</CardTitle>
              <CardDescription>Actualiza tus datos personales.</CardDescription>
            </div>
            <Button
              v-if="!isEditing"
              variant="outline"
              size="sm"
              @click="isEditing = true"
            >
              Editar
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          <form class="profile-form" @submit.prevent="handleSave">
            <div class="form-group">
              <label class="form-label" for="profile-name">Nombre completo</label>
              <Input
                id="profile-name"
                v-model="formData.name"
                type="text"
                :disabled="!isEditing"
                :class="{ 'border-red-500': formErrors.name }"
                placeholder="Juan Perez"
              />
              <span v-if="formErrors.name" class="form-error">{{ formErrors.name }}</span>
            </div>

            <div class="form-group">
              <label class="form-label" for="profile-phone">Telefono</label>
              <Input
                id="profile-phone"
                v-model="formData.phone"
                type="tel"
                :disabled="!isEditing"
                :class="{ 'border-red-500': formErrors.phone }"
                placeholder="987654321"
              />
              <span v-if="formErrors.phone" class="form-error">{{ formErrors.phone }}</span>
            </div>

            <div class="form-group">
              <label class="form-label" for="profile-address">Direccion</label>
              <Input
                id="profile-address"
                v-model="formData.address"
                type="text"
                :disabled="!isEditing"
                :class="{ 'border-red-500': formErrors.address }"
                placeholder="Av. Example 123, Lima"
              />
              <span v-if="formErrors.address" class="form-error">{{ formErrors.address }}</span>
            </div>

            <div v-if="isEditing" class="profile-form__actions">
              <Button
                type="button"
                variant="outline"
                @click="isEditing = false"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                :disabled="isSaving"
              >
                <Save class="w-4 h-4 mr-2" />
                {{ isSaving ? 'Guardando...' : 'Guardar cambios' }}
              </Button>
            </div>

            <p v-if="saveSuccess" class="profile-form__success">
              Perfil actualizado correctamente.
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  </section>
</template>

<style scoped>
.profile-page {
  max-width: 64rem;
  margin: 0 auto;
  padding: 2rem 1.2rem 3rem;
}

.profile-page__header {
  margin-bottom: 1.5rem;
}

.profile-page__eyebrow {
  margin: 0;
  font-size: 0.8rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--text-muted);
}

.profile-page__header h1 {
  margin: 0.35rem 0 0;
  font-size: clamp(1.45rem, 3.5vw, 2rem);
}

.profile-page__subtitle {
  margin: 0.5rem 0 0;
  color: var(--text-muted);
}

.profile-loading,
.profile-error {
  text-align: center;
  padding: 3rem 1rem;
}

.profile-error {
  color: #dc2626;
}

.profile-layout {
  display: grid;
  grid-template-columns: minmax(0, 20rem) minmax(0, 1fr);
  gap: 1.5rem;
  align-items: start;
}

.profile-card {
  position: sticky;
  top: 1rem;
}

.profile-avatar {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.profile-avatar__fallback {
  width: 4rem;
  height: 4rem;
  border-radius: 50%;
  background: #c2410c;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  font-weight: 700;
}

.profile-avatar__info {
  min-width: 0;
}

.profile-field {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 0.75rem 0;
  border-bottom: 1px solid var(--border-soft);
}

.profile-field:last-child {
  border-bottom: none;
}

.profile-field__icon {
  color: var(--text-muted);
  margin-top: 0.15rem;
}

.profile-field__content {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
  min-width: 0;
}

.profile-field__label {
  font-size: 0.8rem;
  color: var(--text-muted);
}

.profile-field__value {
  font-weight: 600;
  word-break: break-word;
}

.profile-form-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
}

.profile-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.form-label {
  font-size: 0.9rem;
  font-weight: 600;
}

.form-error {
  font-size: 0.8rem;
  color: #dc2626;
}

.profile-form__actions {
  display: flex;
  gap: 0.75rem;
  margin-top: 0.5rem;
}

.profile-form__success {
  margin: 0;
  color: #166534;
  font-weight: 600;
  font-size: 0.9rem;
}

@media (max-width: 768px) {
  .profile-layout {
    grid-template-columns: 1fr;
  }

  .profile-card {
    position: static;
  }
}

@media (max-width: 480px) {
  .profile-page {
    padding-inline: 0.85rem;
  }

  .profile-form__actions {
    flex-direction: column;
  }
}
</style>
