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

const discountCode = ref('')
const discountApplied = ref(false)
const discountError = ref('')

function applyDiscount() {
  discountError.value = ''
  if (!discountCode.value.trim()) {
    discountError.value = 'Ingresa un código'
    return
  }
  discountApplied.value = true
}

function clearDiscount() {
  discountCode.value = ''
  discountApplied.value = false
  discountError.value = ''
}
</script>

<template>
  <aside class="border border-input rounded-xl bg-background p-5 shadow-sm">
    <h2 class="text-lg font-semibold mt-0 mb-4">Resumen del pedido</h2>

    <dl class="grid gap-3">
      <div class="flex justify-between items-center">
        <dt class="text-muted-foreground">Productos ({{ totalItems }})</dt>
        <dd class="font-medium">{{ formatPenAmount(subtotal) }}</dd>
      </div>

      <div class="flex justify-between items-center">
        <dt class="text-muted-foreground">Envío</dt>
        <dd class="font-medium">{{ formatPenAmount(shippingCost) }}</dd>
      </div>

      <div class="flex justify-between items-center">
        <dt class="text-muted-foreground">Impuestos</dt>
        <dd class="font-medium">{{ formatPenAmount(taxes) }}</dd>
      </div>

      <Separator class="my-1" />

      <div class="flex justify-between items-center">
        <dt class="font-semibold text-base">Total</dt>
        <dd class="text-xl font-bold text-orange-900">{{ formatPenAmount(orderTotal) }}</dd>
      </div>
    </dl>

    <div class="mt-5">
      <label class="text-sm font-medium mb-1.5 block">Código de descuento</label>
      <div v-if="!discountApplied" class="flex gap-2">
        <Input
          v-model="discountCode"
          placeholder="Ej: DESCUENTO10"
          class="flex-1"
          @keydown.enter="applyDiscount"
        />
        <Button variant="outline" size="sm" @click="applyDiscount">
          Aplicar
        </Button>
      </div>
      <div v-else class="flex items-center gap-2 text-sm">
        <Badge variant="secondary" class="font-mono">{{ discountCode }}</Badge>
        <Button variant="ghost" size="sm" class="h-6 px-2 text-muted-foreground" @click="clearDiscount">
          Quitar
        </Button>
      </div>
      <p v-if="discountError" class="text-xs text-destructive mt-1">{{ discountError }}</p>
    </div>

    <NuxtLink
      :to="isEmpty ? undefined : '/checkout'"
      :class="[
        'flex items-center justify-center gap-2 w-full mt-5 rounded-lg px-4 py-3 text-center font-semibold text-white no-underline transition-all',
        isEmpty
          ? 'bg-primary/60 cursor-not-allowed pointer-events-none'
          : 'bg-gradient-to-br from-primary to-primary/90 hover:opacity-95 hover:shadow-md'
      ]"
    >
      {{ isEmpty ? 'Agrega productos al carrito' : 'Continuar compra' }}
      <svg v-if="!isEmpty" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
    </NuxtLink>
  </aside>
</template>
