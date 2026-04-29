<script setup lang="ts">
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
    <SheetContent side="right" class="w-full sm:max-w-md flex flex-col p-0">
      <SheetHeader class="px-5 pt-5 pb-3 border-b">
        <SheetTitle class="flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>
          Carrito
          <span v-if="totalItems > 0" class="text-sm font-normal text-muted-foreground">({{ totalItems }})</span>
        </SheetTitle>
      </SheetHeader>

      <div v-if="isEmpty" class="flex-1 overflow-y-auto px-5">
        <div class="py-8">
          <CartEmpty />
        </div>
      </div>

      <template v-else>
        <div class="flex-1 overflow-y-auto px-5 py-4">
          <ul class="list-none p-0 m-0 flex flex-col gap-3" aria-label="Productos en carrito">
            <li v-for="item in items" :key="item.productId">
              <CartItemCard :item="item" compact />
            </li>
          </ul>
        </div>

        <div class="border-t bg-background px-5 py-4">
          <CartSummary
            :subtotal="subtotal"
            :total-items="totalItems"
            :shipping-cost="shippingCost"
            :taxes="taxes"
            :is-empty="isEmpty"
          />
        </div>
      </template>
    </SheetContent>
  </Sheet>
</template>
