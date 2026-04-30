<script setup lang="ts">
import { formatPenAmount } from '~/utils/currency'
import { Button } from '~/components/ui/button'
import { X } from 'lucide-vue-next'
import { toast } from 'vue-sonner'
import { IGV_RATE } from '~/utils/pricing'

const props = defineProps<{
  subtotal: number
  totalItems: number
  shippingCost: number
  isEmpty: boolean
}>()

const {
  discountCode,
  appliedDiscount,
  applyDiscountCode,
  removeDiscountCode,
  discountAmount
} = useCart()

const igv = computed(() => Math.round(props.subtotal * IGV_RATE * 100) / 100)

const orderTotal = computed(() => {
  const raw = props.subtotal + props.shippingCost + igv.value - discountAmount.value
  return Math.round(raw * 100) / 100
})

async function handleApplyDiscount() {
  if (!discountCode.value.trim()) {
    toast('Ingresa un codigo de descuento')
    return
  }
  try {
    await applyDiscountCode()
    toast('Codigo de descuento aplicado')
  } catch {
    toast('Codigo de descuento invalido')
  }
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
        <dt class="text-muted-foreground">IGV (18%)</dt>
        <dd class="m-0 font-medium">{{ formatPenAmount(igv) }}</dd>
      </div>

      <div v-if="appliedDiscount" class="flex justify-between items-center gap-4 text-green-600">
        <dt class="font-medium flex items-center gap-1">
          Descuento ({{ appliedDiscount.type === 'percentage' ? appliedDiscount.value + '%' : 'envio gratis' }})
          <button type="button" class="inline-flex items-center justify-center w-4 h-4 rounded-full hover:bg-green-100 transition-colors border-none bg-transparent cursor-pointer p-0" @click="removeDiscountCode">
            <X class="w-3 h-3" />
          </button>
        </dt>
        <dd class="m-0 font-medium">-{{ formatPenAmount(discountAmount) }}</dd>
      </div>

      <div class="mt-1 pt-3 border-t border-border">
        <div class="flex justify-between items-center gap-4">
          <dt class="font-semibold text-base">Total</dt>
          <dd class="m-0 text-lg font-bold">{{ formatPenAmount(orderTotal) }}</dd>
        </div>
      </div>
    </dl>

    <div class="mt-4 flex gap-2">
      <input
        v-model="discountCode"
        placeholder="Codigo de descuento"
        class="flex h-9 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        :disabled="isEmpty"
        @keyup.enter="handleApplyDiscount"
      >
      <Button
        variant="outline"
        size="sm"
        class="h-9 shrink-0"
        :disabled="isEmpty"
        @click="handleApplyDiscount"
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
