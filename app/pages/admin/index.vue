<script setup lang="ts">
import { DollarSign, Package, ShoppingCart, Users, TrendingUp, TrendingDown } from 'lucide-vue-next'
import type { DashboardMetrics, RevenueData } from '~/types/admin'

definePageMeta({ layout: 'admin', middleware: 'admin' })

const metrics = ref<DashboardMetrics | null>(null)
const revenueData = ref<RevenueData[]>([])
const isLoading = ref(true)

onMounted(async () => {
  const adminService = await import('~/services/adminService')
  metrics.value = await adminService.getDashboardMetrics()
  revenueData.value = await adminService.getRevenueData()
  isLoading.value = false
})

const maxRevenue = computed(() => {
  if (revenueData.value.length === 0) return 1
  return Math.max(...revenueData.value.map(d => d.revenue), 1)
})

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN' }).format(amount)
}
</script>

<template>
  <div>
    <div class="mb-6">
      <h1 class="text-2xl font-bold">Dashboard</h1>
      <p class="text-muted-foreground mt-1">Resumen general de la tienda</p>
    </div>

    <div v-if="isLoading" class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <div v-for="i in 4" :key="i" class="rounded-xl border bg-card p-5 shadow-sm animate-pulse">
        <div class="h-4 w-24 bg-muted rounded mb-3" />
        <div class="h-8 w-20 bg-muted rounded" />
      </div>
    </div>

    <template v-if="metrics">
      <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
        <MetricCard
          title="Productos"
          :value="metrics.totalProducts"
          subtitle="En el catalogo"
          :icon="Package"
        />
        <MetricCard
          title="Ordenes"
          :value="metrics.totalOrders"
          subtitle="Total registradas"
          :icon="ShoppingCart"
          :trend="{ value: `${metrics.recentOrders} recientes`, positive: true }"
        />
        <MetricCard
          title="Usuarios"
          :value="metrics.totalUsers"
          subtitle="Registrados"
          :icon="Users"
        />
        <MetricCard
          title="Ingresos"
          :value="formatCurrency(metrics.totalRevenue)"
          subtitle="Totales"
          :icon="DollarSign"
          :trend="{ value: '+12% vs mes anterior', positive: true }"
        />
      </div>

      <div class="grid gap-4 lg:grid-cols-3">
        <div class="rounded-xl border bg-card p-5 shadow-sm lg:col-span-2">
          <h2 class="text-lg font-semibold mb-4">Ingresos Mensuales</h2>
          <div class="flex items-end gap-2 h-48">
            <div
              v-for="(data, idx) in revenueData"
              :key="idx"
              class="flex-1 flex flex-col items-center gap-1"
            >
              <div
                class="w-full rounded-t bg-primary/80 transition-all hover:bg-primary"
                :style="{ height: `${(data.revenue / maxRevenue) * 100}%` }"
              />
              <span class="text-xs text-muted-foreground">{{ data.month }}</span>
            </div>
          </div>
        </div>

        <div class="rounded-xl border bg-card p-5 shadow-sm">
          <h2 class="text-lg font-semibold mb-4">Resumen Rapido</h2>
          <div class="space-y-3">
            <div class="flex items-center justify-between py-2 border-b border-border last:border-0">
              <span class="text-sm text-muted-foreground">Productos agotados</span>
              <span class="text-sm font-semibold text-destructive">{{ metrics.productsOutOfStock }}</span>
            </div>
            <div class="flex items-center justify-between py-2 border-b border-border last:border-0">
              <span class="text-sm text-muted-foreground">Promedio por orden</span>
              <span class="text-sm font-semibold">{{ formatCurrency(metrics.totalRevenue / metrics.totalOrders) }}</span>
            </div>
            <div class="flex items-center justify-between py-2 border-b border-border last:border-0">
              <span class="text-sm text-muted-foreground">Productos por usuario</span>
              <span class="text-sm font-semibold">{{ (metrics.totalProducts / metrics.totalUsers).toFixed(1) }}</span>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>
