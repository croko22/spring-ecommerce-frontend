<script setup lang="ts">
import type { OrderStatus } from '~/types/order'
import { cn } from '~/lib/utils'

const props = defineProps<{
  status: OrderStatus
}>()

const config: Record<OrderStatus, { label: string; class: string }> = {
  pending: { label: 'Pendiente', class: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
  processing: { label: 'Procesando', class: 'bg-blue-100 text-blue-800 border-blue-200' },
  confirmed: { label: 'Confirmado', class: 'bg-indigo-100 text-indigo-800 border-indigo-200' },
  shipped: { label: 'Enviado', class: 'bg-purple-100 text-purple-800 border-purple-200' },
  delivered: { label: 'Entregado', class: 'bg-green-100 text-green-800 border-green-200' },
  cancelled: { label: 'Cancelado', class: 'bg-red-100 text-red-800 border-red-200' }
}

const current = computed(() => config[props.status])
</script>

<template>
  <span
    :class="cn(
      'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold',
      current.class
    )"
  >
    {{ current.label }}
  </span>
</template>
