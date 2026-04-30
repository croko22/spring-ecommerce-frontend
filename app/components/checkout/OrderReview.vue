<script setup lang="ts">
import type { CartItem } from '~/utils/cart'
import type { ShippingAddress, CreditCardPayment } from '~/types/order'
import { formatPenAmount } from '~/utils/currency'
import { Button } from '~/components/ui/button'
import { Separator } from '~/components/ui/separator'

const props = defineProps<{
  items: CartItem[]
  shipping: ShippingAddress
  paymentMethod: string
  creditCard: CreditCardPayment | null
  subtotal: number
  igv: number
  shippingCost: number
  discountAmount: number
  total: number
}>()

defineEmits<{
  submit: []
}>()

function maskCardNumber(cardNumber: string): string {
  const digits = cardNumber.replace(/\s/g, '')
  const last4 = digits.slice(-4)
  return `**** **** **** ${last4}`
}

function paymentLabel(): string {
  if (props.paymentMethod === 'credit_card') return 'Tarjeta de credito'
  if (props.paymentMethod === 'cash_on_delivery') return 'Contra entrega'
  return ''
}
</script>

<template>
  <div class="flex flex-col gap-5">
    <h2 class="text-lg font-semibold m-0">Resumen del pedido</h2>

    <div class="pb-5 border-b border-border">
      <h3 class="text-sm text-muted-foreground uppercase tracking-wider m-0 mb-3">Productos</h3>
      <ul class="list-none m-0 p-0">
        <li
          v-for="item in items"
          :key="item.productId"
          class="flex justify-between py-1.5"
        >
          <span>{{ item.name }} x{{ item.quantity }}</span>
          <span class="font-semibold">{{ formatPenAmount(item.price * item.quantity) }}</span>
        </li>
      </ul>
    </div>

    <div class="pb-5 border-b border-border">
      <h3 class="text-sm text-muted-foreground uppercase tracking-wider m-0 mb-3">Envio</h3>
      <div class="text-sm">
        <p class="m-0 py-0.5">{{ shipping.fullName }}</p>
        <p class="m-0 py-0.5">{{ shipping.address }}</p>
        <p class="m-0 py-0.5">{{ shipping.region }}</p>
        <p class="m-0 py-0.5">{{ shipping.phone }}</p>
      </div>
    </div>

    <div class="pb-5 border-b border-border">
      <h3 class="text-sm text-muted-foreground uppercase tracking-wider m-0 mb-3">Pago</h3>
      <p class="m-0 text-sm">{{ paymentLabel() }}</p>
      <p v-if="paymentMethod === 'credit_card' && creditCard" class="m-0 text-sm mt-1">
        {{ maskCardNumber(creditCard.cardNumber) }}
      </p>
    </div>

    <div class="py-4 border-t-2 border-border">
      <div class="flex justify-between py-1.5">
        <span>Subtotal</span>
        <span>{{ formatPenAmount(subtotal) }}</span>
      </div>
      <div v-if="discountAmount > 0" class="flex justify-between py-1.5 text-green-600">
        <span>Descuento</span>
        <span>-{{ formatPenAmount(discountAmount) }}</span>
      </div>
      <div class="flex justify-between py-1.5">
        <span>IGV (18%)</span>
        <span>{{ formatPenAmount(igv) }}</span>
      </div>
      <div class="flex justify-between py-1.5">
        <span>Envio</span>
        <span>{{ formatPenAmount(shippingCost) }}</span>
      </div>
      <Separator class="my-2" />
      <div class="flex justify-between pt-3 text-lg font-bold text-foreground">
        <span>Total</span>
        <span>{{ formatPenAmount(total) }}</span>
      </div>
    </div>

    <div class="flex flex-col gap-2">
      <Button type="button" class="w-full" @click="$emit('submit')">
        Confirmar pedido
      </Button>
      <Button type="button" variant="outline">
        Volver al pago
      </Button>
    </div>
  </div>
</template>
