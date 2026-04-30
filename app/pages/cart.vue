<script setup lang="ts">
import { formatPenAmount } from '~/utils/currency'
import { toast } from 'vue-sonner'
import { Button } from '~/components/ui/button'
import { Trash2, ShoppingCart, X } from 'lucide-vue-next'

const {
  items,
  subtotal,
  totalItems,
  isEmpty,
  igv,
  shippingCost,
  discountAmount,
  total,
  discountCode,
  appliedDiscount,
  applyDiscountCode,
  removeDiscountCode,
  incrementItem,
  decrementItem,
  removeItem,
  clearCart
} = useCart()

function formatAmount(amount: number) {
  return formatPenAmount(amount)
}

function itemSubtotal(price: number, quantity: number) {
  return formatAmount(price * quantity)
}

function handleClearCart() {
  clearCart()
  toast('Cart cleared')
}

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

useSeoMeta({
  title: 'Carrito de compras',
  description: 'Gestiona tus productos y revisa el resumen de compra.'
})
</script>

<template>
  <section class="max-w-5xl mx-auto px-4 sm:px-6 py-8">
    <header class="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
      <div>
        <p class="text-xs font-medium tracking-wider uppercase text-muted-foreground m-0">Checkout</p>
        <h1 class="text-2xl sm:text-3xl font-bold mt-1 mb-1">Carrito de compras</h1>
        <p class="text-muted-foreground text-sm m-0">Revisa cantidades, elimina productos y confirma tu resumen.</p>
      </div>
      <Button
        variant="outline"
        size="sm"
        :disabled="isEmpty"
        class="self-start sm:self-auto"
        @click="handleClearCart"
      >
        <Trash2 class="w-4 h-4 mr-1" />
        Vaciar carrito
      </Button>
    </header>

    <div v-if="isEmpty" class="border border-input rounded-xl bg-background p-10 text-center flex flex-col items-center">
      <div class="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-5">
        <ShoppingCart class="w-10 h-10 text-muted-foreground" />
      </div>
      <p class="text-xl font-bold m-0">Tu carrito esta vacio.</p>
      <p class="text-muted-foreground mt-2 text-sm max-w-sm">Agrega productos desde el catalogo para iniciar tu compra.</p>
      <NuxtLink
        to="/products"
        class="inline-block mt-5 px-6 py-3 rounded-lg bg-gradient-to-br from-primary to-primary/90 text-white font-bold no-underline hover:opacity-95 transition-opacity"
      >
        Ir al catalogo
      </NuxtLink>
    </div>

    <div v-else class="grid grid-cols-1 lg:grid-cols-[1.8fr_1fr] gap-6 items-start">
      <ul class="list-none p-0 m-0 flex flex-col gap-3" aria-label="Productos en carrito">
        <li v-for="item in items" :key="item.productId" class="border border-input rounded-xl bg-background p-4 grid grid-cols-[5rem_1fr_auto] gap-4 items-center max-sm:grid-cols-1">
          <NuxtLink
            class="block rounded-lg overflow-hidden bg-muted aspect-square max-sm:w-24 max-sm:mx-auto"
            :to="'/products/' + encodeURIComponent(item.productId)"
          >
            <img :src="item.imageUrl" :alt="item.name" loading="lazy" decoding="async" class="w-full h-full object-cover">
          </NuxtLink>

          <div class="flex flex-col gap-1 min-w-0">
            <NuxtLink
              class="font-semibold leading-tight no-underline hover:underline truncate"
              :to="'/products/' + encodeURIComponent(item.productId)"
            >
              {{ item.name }}
            </NuxtLink>
            <p class="text-sm text-muted-foreground m-0">{{ formatAmount(item.price) }} c/u</p>

            <div class="flex items-center gap-3 mt-2">
              <div class="inline-flex items-center rounded-full border border-input overflow-hidden">
                <button
                  type="button"
                  class="h-8 w-8 flex items-center justify-center bg-muted hover:bg-muted/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed border-0"
                  :disabled="item.quantity <= 1"
                  @click="decrementItem(item.productId)"
                >
                  -
                </button>
                <span class="min-w-[2rem] text-center font-bold text-sm">{{ item.quantity }}</span>
                <button
                  type="button"
                  class="h-8 w-8 flex items-center justify-center bg-muted hover:bg-muted/80 transition-colors border-0"
                  @click="incrementItem(item.productId)"
                >
                  +
                </button>
              </div>

              <button
                type="button"
                class="inline-flex items-center gap-1 text-destructive text-sm font-medium hover:opacity-80 transition-opacity bg-transparent border-none cursor-pointer p-0"
                @click="removeItem(item.productId)"
              >
                <Trash2 class="w-4 h-4" />
                Eliminar
              </button>
            </div>
          </div>

          <p class="font-bold text-lg text-right m-0 max-sm:text-left">{{ itemSubtotal(item.price, item.quantity) }}</p>
        </li>
      </ul>

      <aside class="border border-input rounded-xl bg-background p-5 sticky top-4">
        <h2 class="text-lg font-semibold mt-0">Resumen del pedido</h2>

    <dl class="mt-4 grid gap-3 text-sm">
      <div class="flex justify-between items-center">
        <dt class="text-muted-foreground">Items ({{ totalItems }})</dt>
        <dd class="m-0 font-medium">{{ formatAmount(subtotal) }}</dd>
      </div>
      <div class="flex justify-between items-center">
        <dt class="text-muted-foreground">Envio</dt>
        <dd class="m-0 font-medium">{{ formatAmount(shippingCost) }}</dd>
      </div>
      <div class="flex justify-between items-center">
        <dt class="text-muted-foreground">IGV (18%)</dt>
        <dd class="m-0 font-medium">{{ formatAmount(igv) }}</dd>
      </div>
      <div v-if="appliedDiscount" class="flex justify-between items-center text-green-600">
        <dt class="font-medium flex items-center gap-1">
          Descuento ({{ appliedDiscount.type === 'percentage' ? appliedDiscount.value + '%' : 'envio gratis' }})
          <button type="button" class="inline-flex items-center justify-center w-4 h-4 rounded-full hover:bg-green-100 transition-colors border-none bg-transparent cursor-pointer p-0" @click="removeDiscountCode">
            <X class="w-3 h-3" />
          </button>
        </dt>
        <dd class="m-0 font-medium">-{{ formatAmount(discountAmount) }}</dd>
      </div>

      <div class="mt-2 pt-3 border-t border-border">
        <div class="flex justify-between items-center">
          <dt class="font-semibold text-base">Total</dt>
          <dd class="m-0 text-xl font-bold">{{ formatAmount(total) }}</dd>
        </div>
      </div>
    </dl>

    <div class="mt-4 flex gap-2">
      <input
        v-model="discountCode"
        placeholder="Codigo de descuento"
        class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        @keyup.enter="handleApplyDiscount"
      >
      <Button variant="outline" size="sm" class="h-10 shrink-0" @click="handleApplyDiscount">
        Aplicar
      </Button>
    </div>

        <Button
          as="NuxtLink"
          to="/checkout"
          class="w-full mt-4 h-12 text-base font-semibold"
        >
          Proceder al checkout
        </Button>
      </aside>
    </div>
  </section>
</template>
