<script setup lang="ts">
import { formatPenAmount } from '~/utils/currency'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { toast } from 'vue-sonner'

const props = defineProps<{
  subtotal: number
  totalItems: number
  shippingCost: number
  taxes: number
  isEmpty: boolean
}>()

const orderTotal = computed(() => props.subtotal + props.shippingCost + props.taxes)

const discountCode = ref('')
const appliedDiscount = ref<string | null>(null)

function applyDiscount() {
  if (!discountCode.value.trim()) {
    toast('Ingresa un codigo de descuento')
    return
  }
  toast('Codigo ' + discountCode.value + ' aplicado')
  appliedDiscount.value = discountCode.value.trim()
  discountCode.value = ''
}
</script>

<template>
  <aside class="border border-input rounded-xl bg-background p-4">
    <h2 class="text-base font-semibold mt-0">Resumen</h2>

    <dl class="mt-3 grid gap-2 text-sm">
      <div class="flex justify-between items-center gap-4">
        <dt class="text-muted-foreground">Items ({{ totalItems }})</dt>
        <dd class="m-0 font-medium">{{ formatPenAmount(subtotal) }}</dd>
      </div>

      <div class="flex justify-between items-center gap-4">
        <dt class="text-muted-foreground">Envio</dt>
        <dd class="m-0 font-medium">{{ formatPenAmount(shippingCost) }}</dd>
      </div>

      <div class="flex justify-between items-center gap-4">
        <dt class="text-muted-foreground">Impuestos</dt>
        <dd class="m-0 font-medium">{{ formatPenAmount(taxes) }}</dd>
      </div>

      <div v-if="appliedDiscount" class="flex justify-between items-center gap-4 text-green-600">
        <dt class="font-medium">Descuento</dt>
        <dd class="m-0 font-medium">-{{ appliedDiscount }}</dd>
      </div>

      <div class="mt-1 pt-3 border-t border-border">
        <div class="flex justify-between items-center gap-4">
          <dt class="font-semibold text-base">Total</dt>
          <dd class="m-0 text-lg font-bold">{{ formatPenAmount(orderTotal) }}</dd>
        </div>
      </div>
    </dl>

    <div class="mt-4 flex gap-2">
      <Input
        v-model="discountCode"
        placeholder="Codigo de descuento"
        class="h-9 text-sm"
        :disabled="isEmpty"
        @keyup.enter="applyDiscount"
      />
      <Button
        variant="outline"
        size="sm"
        class="h-9 shrink-0"
        :disabled="isEmpty"
        @click="applyDiscount"
      >
        Aplicar
      </Button>
    </div>

    <NuxtLink
      :to="isEmpty ? undefined : '/checkout'"
      :class="[
        'block w-full mt-3 rounded-lg px-4 py-3 text-center font-bold text-white no-underline transition-opacity',
        isEmpty
          ? 'bg-primary/60 cursor-not-allowed pointer-events-none'
          : 'bg-gradient-to-br from-primary to-primary/90 hover:opacity-95'
      ]"
    >
      {{ isEmpty ? 'Agrega productos al carrito' : 'Continuar compra' }}
    </NuxtLink>
  </aside>
</template>
