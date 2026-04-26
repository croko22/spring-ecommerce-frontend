<script setup lang="ts">
import { Search, Shield, UserX, UserCheck } from 'lucide-vue-next'
import type { AdminUser } from '~/types/admin'

definePageMeta({ layout: 'admin', middleware: 'admin' })

const users = ref<AdminUser[]>([])
const searchQuery = ref('')
const roleFilter = ref<string>('')
const isLoading = ref(true)

const filteredUsers = computed(() => {
  let result = users.value
  const q = searchQuery.value.toLowerCase().trim()
  if (q) {
    result = result.filter(
      u => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)
    )
  }
  if (roleFilter.value) {
    result = result.filter(u => u.role === roleFilter.value)
  }
  return result
})

async function loadUsers() {
  isLoading.value = true
  const adminService = await import('~/services/adminService')
  users.value = await adminService.getAdminUsers()
  isLoading.value = false
}

async function toggleRole(userId: string, currentRole: string) {
  const newRole = currentRole === 'ADMIN' ? 'USER' : 'ADMIN'
  const adminService = await import('~/services/adminService')
  await adminService.updateUserRole(userId, newRole)
  await loadUsers()
}

async function toggleStatus(userId: string, currentStatus: string) {
  // The mock toggle logic is in the service
  const adminService = await import('~/services/adminService')
  await adminService.toggleUserStatus(userId)
  await loadUsers()
}

function formatDate(dateString: string): string {
  return new Intl.DateTimeFormat('es-PE', {
    year: 'numeric', month: 'short', day: 'numeric'
  }).format(new Date(dateString))
}

onMounted(loadUsers)
</script>

<template>
  <div>
    <div class="mb-6">
      <h1 class="text-2xl font-bold">Usuarios</h1>
      <p class="text-muted-foreground mt-1">Gestiona los usuarios y sus roles</p>
    </div>

    <div class="rounded-xl border bg-card shadow-sm">
      <div class="p-4 border-b border-border flex flex-wrap items-center gap-3">
        <div class="relative flex-1 min-w-[200px] max-w-sm">
          <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Buscar por nombre o email..."
            class="input pl-9"
          >
        </div>
        <select v-model="roleFilter" class="input w-auto">
          <option value="">Todos los roles</option>
          <option value="ADMIN">Admin</option>
          <option value="USER">Usuario</option>
        </select>
      </div>

      <div v-if="isLoading" class="p-8 text-center text-muted-foreground">
        Cargando usuarios...
      </div>

      <div v-else-if="filteredUsers.length === 0" class="p-8 text-center text-muted-foreground">
        No se encontraron usuarios.
      </div>

      <div v-else class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead>
            <tr class="border-b border-border bg-muted/50">
              <th class="text-left px-4 py-3 font-medium text-muted-foreground">Usuario</th>
              <th class="text-left px-4 py-3 font-medium text-muted-foreground">Email</th>
              <th class="text-left px-4 py-3 font-medium text-muted-foreground">Rol</th>
              <th class="text-left px-4 py-3 font-medium text-muted-foreground">Estado</th>
              <th class="text-left px-4 py-3 font-medium text-muted-foreground">Registro</th>
              <th class="text-right px-4 py-3 font-medium text-muted-foreground">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="user in filteredUsers"
              :key="user.id"
              class="border-b border-border last:border-0 hover:bg-muted/30 transition-colors"
            >
              <td class="px-4 py-3 font-medium">{{ user.name }}</td>
              <td class="px-4 py-3 text-muted-foreground">{{ user.email }}</td>
              <td class="px-4 py-3">
                <span
                  :class="[
                    'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
                    user.role === 'ADMIN'
                      ? 'bg-purple-100 text-purple-800 border border-purple-200'
                      : 'bg-gray-100 text-gray-800 border border-gray-200'
                  ]"
                >
                  <Shield v-if="user.role === 'ADMIN'" class="w-3 h-3 mr-1" />
                  {{ user.role }}
                </span>
              </td>
              <td class="px-4 py-3">
                <span
                  :class="[
                    'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
                    user.status === 'active'
                      ? 'bg-green-100 text-green-800 border border-green-200'
                      : 'bg-red-100 text-red-800 border border-red-200'
                  ]"
                >
                  {{ user.status === 'active' ? 'Activo' : 'Inactivo' }}
                </span>
              </td>
              <td class="px-4 py-3 text-muted-foreground">{{ formatDate(user.createdAt) }}</td>
              <td class="px-4 py-3 text-right">
                <div class="flex items-center justify-end gap-1">
                  <button
                    class="btn btn-ghost btn-sm p-2"
                    :title="user.role === 'ADMIN' ? 'Remover admin' : 'Hacer admin'"
                    @click="toggleRole(user.id, user.role)"
                  >
                    <Shield class="w-4 h-4" />
                  </button>
                  <button
                    class="btn btn-ghost btn-sm p-2"
                    :class="user.status === 'active' ? 'text-destructive hover:text-destructive' : 'text-success hover:text-success'"
                    :title="user.status === 'active' ? 'Desactivar' : 'Activar'"
                    @click="toggleStatus(user.id, user.status)"
                  >
                    <component :is="user.status === 'active' ? UserX : UserCheck" class="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
