<script setup lang="ts">
import { toast } from 'vue-sonner'

const {
  items,
  subtotal,
  totalItems,
  isEmpty,
  clearCart
} = useCart()

const shippingCost = computed(() => 0)
const taxes = computed(() => 0)
const orderTotal = computed(() => subtotal.value + shippingCost.value + taxes.value)

function handleClearCart() {
  clearCart()
  toast.success('Carrito vaciado')
}

useSeoMeta({
  title: 'Carrito de compras',
  description: 'Gestiona tus productos y revisa el resumen de compra.'
})
</script>

<template>
  <section class="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
    <header class="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
      <div>
        <p class="text-xs font-medium tracking-widest uppercase text-muted-foreground m-0">Checkout</p>
        <h1 class="text-2xl sm:text-3xl font-bold mt-1 mb-2">Carrito de compras</h1>
        <p class="text-muted-foreground m-0">Revisa cantidades, elimina productos y confirma tu resumen.</p>
      </div>
      <button
        type="button"
        class="self-start sm:self-auto inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-input bg-background text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors disabled:opacity-60 disabled:cursor-not-allowed disabled:pointer-events-none"
        :disabled="isEmpty"
        @click="handleClearCart"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
        Vaciar carrito
      </button>
    </header>

    <div v-if="isEmpty">
      <CartEmpty />
    </div>

    <div v-else class="grid grid-cols-1 lg:grid-cols-[minmax(0,1.8fr)_minmax(16rem,1fr)] gap-6 items-start">
      <ul class="list-none p-0 m-0 flex flex-col gap-4" aria-label="Productos en carrito">
        <li v-for="item in items" :key="item.productId">
          <CartItemCard :item="item" />
        </li>
      </ul>

      <div class="lg:sticky lg:top-6">
        <CartSummary
          :subtotal="subtotal"
          :total-items="totalItems"
          :shipping-cost="shippingCost"
          :taxes="taxes"
          :is-empty="isEmpty"
        />
      </div>
    </div>
  </section>
</template>
