<script setup lang="ts">
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "~/components/ui/sheet"
import { Button } from "~/components/ui/button"
import { formatPenAmount } from "~/utils/currency"

const open = defineModel<boolean>("open", { default: false })

const { items, subtotal, totalItems, isEmpty, shippingCost, igv, total: orderTotal } = useCart()

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
    <SheetContent side="right" class="w-full sm:max-w-md flex flex-col shadow-2xl">
      <SheetHeader class="px-1">
        <SheetTitle class="text-xl">
          Carrito
          <span v-if="!isEmpty" class="text-sm font-normal text-muted-foreground ml-1">
            ({{ totalItems }} {{ totalItems === 1 ? "item" : "items" }})
          </span>
        </SheetTitle>
      </SheetHeader>

      <div v-if="isEmpty" class="flex-1 flex items-center justify-center mt-4">
        <CartEmpty />
      </div>

      <div v-else class="flex-1 flex flex-col overflow-hidden mt-4 -mx-1 px-1">
        <ul class="list-none p-0 m-0 flex flex-col gap-3 overflow-y-auto flex-1 min-h-0" aria-label="Productos en carrito">
          <li v-for="item in items" :key="item.productId">
            <CartItemCard :item="item" />
          </li>
        </ul>

        <div class="mt-4 pt-4 border-t border-border">
      <CartSummary
        :subtotal="subtotal"
        :total-items="totalItems"
        :shipping-cost="shippingCost"
        :is-empty="isEmpty"
      />
        </div>

        <div class="mt-3">
          <Button as="NuxtLink" to="/checkout" class="w-full h-12 text-base font-semibold">
            Proceder al checkout -- {{ formatPenAmount(orderTotal) }}

          </Button>
        </div>
      </div>
    </SheetContent>
  </Sheet>
</template>
