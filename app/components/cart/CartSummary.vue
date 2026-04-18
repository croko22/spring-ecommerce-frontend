<script setup lang="ts">
import { formatPenAmount } from '~/utils/currency'

const props = defineProps<{
  subtotal: number
  totalItems: number
  shippingCost: number
  taxes: number
  isEmpty: boolean
}>()

const orderTotal = computed(() => props.subtotal + props.shippingCost + props.taxes)
</script>

<template>
  <aside class="border border-input rounded-xl bg-background p-4">
    <h2 class="text-base font-semibold mt-0">Resumen</h2>

    <dl class="mt-3 grid gap-2">
      <div class="flex justify-between items-center gap-4">
        <dt class="text-muted-foreground">Items</dt>
        <dd class="m-0 font-semibold">{{ totalItems }}</dd>
      </div>

      <div class="flex justify-between items-center gap-4">
        <dt class="text-muted-foreground">Subtotal</dt>
        <dd class="m-0 font-semibold">{{ formatPenAmount(subtotal) }}</dd>
      </div>

      <div class="flex justify-between items-center gap-4">
        <dt class="text-muted-foreground">Envio</dt>
        <dd class="m-0 font-semibold">{{ formatPenAmount(shippingCost) }}</dd>
      </div>

      <div class="flex justify-between items-center gap-4">
        <dt class="text-muted-foreground">Impuestos</dt>
        <dd class="m-0 font-semibold">{{ formatPenAmount(taxes) }}</dd>
      </div>

      <div class="mt-1 pt-3 border-t border-border">
        <div class="flex justify-between items-center gap-4">
          <dt class="font-semibold">Total</dt>
          <dd class="m-0 text-lg font-semibold text-orange-900">{{ formatPenAmount(orderTotal) }}</dd>
        </div>
      </div>
    </dl>

    <NuxtLink
      :to="isEmpty ? undefined : '/checkout'"
      :class="[
        'block w-full mt-4 rounded-lg px-4 py-3 text-center font-bold text-white no-underline transition-opacity',
        isEmpty
          ? 'bg-primary/60 cursor-not-allowed pointer-events-none'
          : 'bg-gradient-to-br from-primary to-primary/90 hover:opacity-95'
      ]"
    >
      {{ isEmpty ? 'Agrega productos al carrito' : 'Continuar compra' }}
    </NuxtLink>
  </aside>
</template>
