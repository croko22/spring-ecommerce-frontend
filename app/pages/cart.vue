<script setup lang="ts">
import { formatPenAmount } from '~/utils/currency'
import { toast } from 'vue-sonner'
import { Trash2 } from 'lucide-vue-next'

const {
  items,
  subtotal,
  totalItems,
  isEmpty,
  incrementItem,
  decrementItem,
  removeItem,
  clearCart
} = useCart()

const shippingCost = computed(() => 0)
const taxes = computed(() => 0)
const orderTotal = computed(() => subtotal.value + shippingCost.value + taxes.value)

function handleClearCart() {
  clearCart()
  toast('Carrito vaciado')
}

useSeoMeta({
  title: 'Carrito de compras',
  description: 'Gestiona tus productos y revisa el resumen de compra.'
})
</script>

<template>
  <div class="container mx-auto max-w-6xl px-4 py-8">
    <div class="mb-8 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p class="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Checkout
        </p>
        <h1 class="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
          Carrito de compras
        </h1>
        <p class="mt-1 text-sm text-muted-foreground">
          Revisa cantidades, elimina productos y confirma tu resumen.
        </p>
      </div>
      <Button
        variant="outline"
        size="sm"
        class="gap-1.5 text-destructive hover:bg-destructive/10 hover:text-destructive"
        :disabled="isEmpty"
        @click="handleClearCart"
      >
        <Trash2 class="h-4 w-4" />
        Vaciar carrito
      </Button>
    </div>

    <CartEmpty v-if="isEmpty" />

    <div v-else class="grid gap-8 lg:grid-cols-[1fr_22rem]">
      <div>
        <h2 class="mb-4 text-lg font-semibold">
          Productos ({{ totalItems }})
        </h2>
        <ul class="flex flex-col gap-4" aria-label="Productos en carrito">
          <li v-for="item in items" :key="item.productId">
            <CartItemCard :item="item" />
          </li>
        </ul>
      </div>

      <div class="lg:sticky lg:top-20">
        <CartSummary
          :subtotal="subtotal"
          :total-items="totalItems"
          :shipping-cost="shippingCost"
          :taxes="taxes"
          :is-empty="isEmpty"
        />
      </div>
    </div>
  </div>
</template>
