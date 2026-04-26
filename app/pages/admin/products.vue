<script setup lang="ts">
import { Plus, Pencil, Trash2, Search } from 'lucide-vue-next'
import type { Product } from '~/types/product'

definePageMeta({ layout: 'admin', middleware: 'admin' })

const products = ref<Product[]>([])
const searchQuery = ref('')
const isLoading = ref(true)
const showFormModal = ref(false)
const editingProduct = ref<Product | null>(null)
const deleteConfirmId = ref<string | null>(null)

const filteredProducts = computed(() => {
  if (!searchQuery.value.trim()) return products.value
  const q = searchQuery.value.toLowerCase()
  return products.value.filter(
    p => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q)
  )
})

async function loadProducts() {
  isLoading.value = true
  const adminService = await import('~/services/adminService')
  products.value = await adminService.getAdminProducts()
  isLoading.value = false
}

function openCreate() {
  editingProduct.value = null
  showFormModal.value = true
}

function openEdit(product: Product) {
  editingProduct.value = { ...product }
  showFormModal.value = true
}

async function handleSave(product: Product) {
  const adminService = await import('~/services/adminService')
  if (editingProduct.value) {
    await adminService.updateAdminProduct(product.id, product)
  } else {
    await adminService.createAdminProduct(product)
  }
  showFormModal.value = false
  editingProduct.value = null
  await loadProducts()
}

async function confirmDelete(id: string) {
  const adminService = await import('~/services/adminService')
  await adminService.deleteAdminProduct(id)
  deleteConfirmId.value = null
  await loadProducts()
}

onMounted(loadProducts)
</script>

<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-2xl font-bold">Productos</h1>
        <p class="text-muted-foreground mt-1">Gestiona el catalogo de productos</p>
      </div>
      <button class="btn btn-primary" @click="openCreate">
        <Plus class="w-4 h-4" />
        Nuevo Producto
      </button>
    </div>

    <div class="rounded-xl border bg-card shadow-sm">
      <div class="p-4 border-b border-border">
        <div class="relative max-w-sm">
          <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Buscar productos..."
            class="input pl-9"
          >
        </div>
      </div>

      <div v-if="isLoading" class="p-8 text-center text-muted-foreground">
        Cargando productos...
      </div>

      <div v-else-if="filteredProducts.length === 0" class="p-8 text-center text-muted-foreground">
        No se encontraron productos.
      </div>

      <div v-else class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead>
            <tr class="border-b border-border bg-muted/50">
              <th class="text-left px-4 py-3 font-medium text-muted-foreground">Producto</th>
              <th class="text-left px-4 py-3 font-medium text-muted-foreground">Categoria</th>
              <th class="text-right px-4 py-3 font-medium text-muted-foreground">Precio</th>
              <th class="text-right px-4 py-3 font-medium text-muted-foreground">Stock</th>
              <th class="text-center px-4 py-3 font-medium text-muted-foreground">Rating</th>
              <th class="text-right px-4 py-3 font-medium text-muted-foreground">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="product in filteredProducts"
              :key="product.id"
              class="border-b border-border last:border-0 hover:bg-muted/30 transition-colors"
            >
              <td class="px-4 py-3">
                <div class="flex items-center gap-3">
                  <img
                    :src="product.imageUrl"
                    :alt="product.name"
                    class="w-10 h-10 rounded-lg object-cover"
                  >
                  <div>
                    <p class="font-medium">{{ product.name }}</p>
                    <p class="text-xs text-muted-foreground truncate max-w-[200px]">{{ product.description }}</p>
                  </div>
                </div>
              </td>
              <td class="px-4 py-3">
                <span class="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                  {{ product.category }}
                </span>
              </td>
              <td class="px-4 py-3 text-right font-medium">
                ${{ product.price.toFixed(2) }}
              </td>
              <td class="px-4 py-3 text-right">
              <span :class="[
                  'font-medium',
                  (product.stock ?? -1) === 0 ? 'text-destructive' : (product.stock ?? 99) > 0 && (product.stock ?? 99) < 10 ? 'text-yellow-600' : 'text-success'
                ]">
                {{ product.stock ?? 'N/A' }}
                </span>
              </td>
              <td class="px-4 py-3 text-center">
                {{ product.rating ? product.rating.toFixed(1) : '-' }}
              </td>
              <td class="px-4 py-3 text-right">
                <div class="flex items-center justify-end gap-1">
                  <button class="btn btn-ghost btn-sm p-2" title="Editar" @click="openEdit(product)">
                    <Pencil class="w-4 h-4" />
                  </button>
                  <button class="btn btn-ghost btn-sm p-2 text-destructive hover:text-destructive" title="Eliminar" @click="deleteConfirmId = product.id">
                    <Trash2 class="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <Teleport to="body">
      <div v-if="showFormModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="fixed inset-0 bg-black/40" @click="showFormModal = false" />
        <div class="relative bg-white rounded-xl shadow-lg w-full max-w-lg max-h-[90vh] overflow-y-auto p-6">
          <h2 class="text-lg font-semibold mb-4">
            {{ editingProduct ? 'Editar Producto' : 'Nuevo Producto' }}
          </h2>

          <AdminProductForm
            :product="editingProduct"
            @save="handleSave"
            @cancel="showFormModal = false"
          />
        </div>
      </div>
    </Teleport>

    <Teleport to="body">
      <div v-if="deleteConfirmId" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="fixed inset-0 bg-black/40" @click="deleteConfirmId = null" />
        <div class="relative bg-white rounded-xl shadow-lg w-full max-w-sm p-6">
          <h2 class="text-lg font-semibold mb-2">Confirmar eliminacion</h2>
          <p class="text-sm text-muted-foreground mb-4">
            ¿Estas seguro de eliminar este producto? Esta accion no se puede deshacer.
          </p>
          <div class="flex justify-end gap-2">
            <button class="btn btn-outline" @click="deleteConfirmId = null">Cancelar</button>
            <button class="btn btn-danger" @click="confirmDelete(deleteConfirmId)">Eliminar</button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<style scoped>
.btn-sm {
  padding: 0.375rem;
  min-width: 2rem;
  height: 2rem;
}
</style>
