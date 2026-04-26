<script setup lang="ts">
import { Search, Eye } from 'lucide-vue-next'
import type { Order, OrderStatus } from '~/types/order'

definePageMeta({ layout: 'admin', middleware: 'admin' })

const orders = ref<Order[]>([])
const searchQuery = ref('')
const statusFilter = ref<string>('')
const isLoading = ref(true)
const selectedOrder = ref<Order | null>(null)
const showDetail = ref(false)

const filteredOrders = computed(() => {
  let result = orders.value
  const q = searchQuery.value.toLowerCase().trim()
  if (q) {
    result = result.filter(
      o => o.orderId.toLowerCase().includes(q) || o.shipping.fullName.toLowerCase().includes(q)
    )
  }
  if (statusFilter.value) {
    result = result.filter(o => o.status === statusFilter.value)
  }
  return result
})

async function loadOrders() {
  isLoading.value = true
  const adminService = await import('~/services/adminService')
  orders.value = await adminService.getAdminOrders()
  isLoading.value = false
}

function viewDetail(order: Order) {
  selectedOrder.value = order
  showDetail.value = true
}

async function updateStatus(orderId: string, newStatus: OrderStatus) {
  const adminService = await import('~/services/adminService')
  await adminService.updateOrderStatus(orderId, newStatus)
  if (selectedOrder.value?.orderId === orderId) {
    selectedOrder.value = { ...selectedOrder.value, status: newStatus }
  }
  await loadOrders()
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN' }).format(amount)
}

function formatDate(dateString: string): string {
  return new Intl.DateTimeFormat('es-PE', {
    year: 'numeric', month: 'short', day: 'numeric'
  }).format(new Date(dateString))
}

onMounted(loadOrders)
</script>

<template>
  <div>
    <div class="mb-6">
      <h1 class="text-2xl font-bold">Ordenes</h1>
      <p class="text-muted-foreground mt-1">Gestiona las ordenes de los clientes</p>
    </div>

    <div class="rounded-xl border bg-card shadow-sm">
      <div class="p-4 border-b border-border flex flex-wrap items-center gap-3">
        <div class="relative flex-1 min-w-[200px] max-w-sm">
          <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Buscar por ID o cliente..."
            class="input pl-9"
          >
        </div>
        <select v-model="statusFilter" class="input w-auto">
          <option value="">Todos los estados</option>
          <option value="pending">Pendiente</option>
          <option value="processing">Procesando</option>
          <option value="confirmed">Confirmado</option>
          <option value="shipped">Enviado</option>
          <option value="delivered">Entregado</option>
          <option value="cancelled">Cancelado</option>
        </select>
      </div>

      <div v-if="isLoading" class="p-8 text-center text-muted-foreground">
        Cargando ordenes...
      </div>

      <div v-else-if="filteredOrders.length === 0" class="p-8 text-center text-muted-foreground">
        No se encontraron ordenes.
      </div>

      <div v-else class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead>
            <tr class="border-b border-border bg-muted/50">
              <th class="text-left px-4 py-3 font-medium text-muted-foreground">Orden</th>
              <th class="text-left px-4 py-3 font-medium text-muted-foreground">Cliente</th>
              <th class="text-left px-4 py-3 font-medium text-muted-foreground">Fecha</th>
              <th class="text-left px-4 py-3 font-medium text-muted-foreground">Estado</th>
              <th class="text-right px-4 py-3 font-medium text-muted-foreground">Total</th>
              <th class="text-center px-4 py-3 font-medium text-muted-foreground">Items</th>
              <th class="text-right px-4 py-3 font-medium text-muted-foreground">Accion</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="order in filteredOrders"
              :key="order.orderId"
              class="border-b border-border last:border-0 hover:bg-muted/30 transition-colors"
            >
              <td class="px-4 py-3 font-medium">{{ order.orderId }}</td>
              <td class="px-4 py-3">{{ order.shipping.fullName }}</td>
              <td class="px-4 py-3 text-muted-foreground">{{ formatDate(order.createdAt) }}</td>
              <td class="px-4 py-3">
                <OrderStatusBadge :status="order.status" />
              </td>
              <td class="px-4 py-3 text-right font-medium">{{ formatCurrency(order.total) }}</td>
              <td class="px-4 py-3 text-center">{{ order.items.length }}</td>
              <td class="px-4 py-3 text-right">
                <button class="btn btn-ghost btn-sm p-2" title="Ver detalle" @click="viewDetail(order)">
                  <Eye class="w-4 h-4" />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <Teleport to="body">
      <div v-if="showDetail && selectedOrder" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="fixed inset-0 bg-black/40" @click="showDetail = false" />
        <div class="relative bg-white rounded-xl shadow-lg w-full max-w-lg max-h-[90vh] overflow-y-auto p-6">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-lg font-semibold">{{ selectedOrder.orderId }}</h2>
            <button class="btn btn-ghost btn-sm p-2" @click="showDetail = false">
              &times;
            </button>
          </div>

          <div class="space-y-4">
            <div class="flex justify-between items-center">
              <span class="text-sm text-muted-foreground">Estado</span>
              <OrderStatusBadge :status="selectedOrder.status" />
            </div>

            <div>
              <h3 class="text-sm font-medium mb-2">Cliente</h3>
              <div class="text-sm text-muted-foreground space-y-1">
                <p>{{ selectedOrder.shipping.fullName }}</p>
                <p>{{ selectedOrder.shipping.address }}</p>
                <p>{{ selectedOrder.shipping.region }}</p>
                <p>{{ selectedOrder.shipping.phone }}</p>
              </div>
            </div>

            <div>
              <h3 class="text-sm font-medium mb-2">Productos</h3>
              <div class="space-y-2">
                <div
                  v-for="(item, idx) in selectedOrder.items"
                  :key="idx"
                  class="flex justify-between text-sm py-1 border-b border-border last:border-0"
                >
                  <span>{{ item.name }} x{{ item.quantity }}</span>
                  <span class="font-medium">{{ formatCurrency(item.price * item.quantity) }}</span>
                </div>
              </div>
            </div>

            <div class="flex justify-between text-sm font-semibold border-t border-border pt-2">
              <span>Total</span>
              <span>{{ formatCurrency(selectedOrder.total) }}</span>
            </div>

            <div>
              <h3 class="text-sm font-medium mb-2">Actualizar Estado</h3>
              <div class="flex flex-wrap gap-2">
                <button
                  v-for="status in (['pending', 'processing', 'confirmed', 'shipped', 'delivered', 'cancelled'] as const)"
                  :key="status"
                  class="btn btn-outline btn-sm"
                  :class="{ 'btn-primary': selectedOrder.status === status }"
                  :disabled="selectedOrder.status === status"
                  @click="updateStatus(selectedOrder.orderId, status)"
                >
                  {{ { pending: 'Pendiente', processing: 'Procesando', confirmed: 'Confirmado', shipped: 'Enviado', delivered: 'Entregado', cancelled: 'Cancelado' }[status] }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<style scoped>
.btn-sm {
  padding: 0.375rem 0.75rem;
  font-size: 0.8125rem;
}
</style>
