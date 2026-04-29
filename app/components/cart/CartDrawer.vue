<script setup lang="ts">
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '~/components/ui/sheet'
import { Button } from '~/components/ui/button'
import { formatPenAmount } from '~/utils/currency'
import { ShoppingCart } from 'lucide-vue-next'

const open = defineModel<boolean>('open', { default: false })

const { items, subtotal, totalItems, isEmpty } = useCart()
const shippingCost = computed(() => 0)
const taxes = computed(() => 0)
const orderTotal = computed(() => subtotal.value + shippingCost.value + taxes.value)

function openDrawer() {
  open.value = true
}

function closeDrawer() {
  open.value = false
}

defineExpose({ openDrawer, closeDrawer })
</script>

<template>
  <Sheet v-model:open="open">
    <SheetContent
      side="right"
      class="flex w-full flex-col shadow-2xl transition-all duration-300 sm:max-w-md"
    >
      <SheetHeader class="border-b bg-gradient-to-r from-muted/40 to-muted/20 px-1 py-4">
        <SheetTitle class="flex items-center gap-2 text-xl">
          <ShoppingCart class="h-5 w-5 text-muted-foreground" />
          Carrito
          <span v-if="!isEmpty" class="text-sm font-normal text-muted-foreground">
            ({{ totalItems }} {{ totalItems === 1 ? 'item' : 'items' }})
          </span>
        </SheetTitle>
      </SheetHeader>

      <div v-if="isEmpty" class="flex-1 px-1 py-6">
        <CartEmpty />
      </div>

      <div v-else class="flex flex-1 flex-col overflow-hidden px-1">
        <ul
          class="flex-1 list-none overflow-y-auto p-0"
          aria-label="Productos en carrito"
        >
          <li v-for="item in items" :key="item.productId" class="py-3">
            <CartItemCard :item="item" />
          </li>
        </ul>

        <div class="mt-4 border-t pt-4">
          <CartSummary
            :subtotal="subtotal"
            :total-items="totalItems"
            :shipping-cost="shippingCost"
            :taxes="taxes"
            :is-empty="isEmpty"
          />
        </div>

        <div class="mt-4 pb-2">
          <Button
            as="NuxtLink"
            to="/checkout"
            class="h-12 w-full text-base font-semibold shadow-md transition-all hover:shadow-lg"
          >
            Proceder al checkout — {{ formatPenAmount(orderTotal) }}
          </Button>
        </div>
      </div>
    </SheetContent>
  </Sheet>
</template>
