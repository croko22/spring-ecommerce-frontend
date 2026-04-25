<script setup lang="ts">
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '~/components/ui/sheet'

const open = defineModel<boolean>('open', { default: false })

const { items, subtotal, totalItems, isEmpty } = useCart()
const shippingCost = computed(() => 0)
const taxes = computed(() => 0)

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
    <SheetContent side="right" class="w-full sm:max-w-md overflow-y-auto">
      <SheetHeader>
        <SheetTitle>Carrito</SheetTitle>
      </SheetHeader>

      <div v-if="isEmpty" class="mt-4">
        <CartEmpty />
      </div>

      <div v-else class="mt-4 flex flex-col gap-3">
        <ul class="list-none p-0 m-0 flex flex-col gap-3" aria-label="Productos en carrito">
          <li v-for="item in items" :key="item.productId">
            <CartItemCard :item="item" />
          </li>
        </ul>

        <div class="mt-2">
          <CartSummary
            :subtotal="subtotal"
            :total-items="totalItems"
            :shipping-cost="shippingCost"
            :taxes="taxes"
            :is-empty="isEmpty"
          />
        </div>
      </div>
    </SheetContent>
  </Sheet>
</template>
