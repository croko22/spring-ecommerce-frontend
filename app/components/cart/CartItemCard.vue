<script setup lang="ts">
import type { CartItem } from '~/utils/cart'
import { formatPenAmount } from '~/utils/currency'
import { toast } from 'vue-sonner'

const props = defineProps<{
  item: CartItem
}>()

const { removeItem } = useCart()
const showRemoveDialog = ref(false)

function confirmRemove() {
  showRemoveDialog.value = true
}

function onRemove() {
  const itemName = props.item.name
  removeItem(props.item.productId)
  showRemoveDialog.value = false
  toast(`${itemName} removed from cart`)
}

const lineTotal = computed(() => props.item.price * props.item.quantity)
</script>

<template>
  <div class="border border-input rounded-xl bg-background p-3 grid grid-cols-[6rem_1fr_auto] gap-3 items-center max-sm:grid-cols-1">
    <NuxtLink
      :to="`/products/${encodeURIComponent(item.productId)}`"
      class="block rounded-lg overflow-hidden bg-muted aspect-square max-sm:w-24"
    >
      <img
        :src="item.imageUrl"
        :alt="item.name"
        loading="lazy"
        decoding="async"
        class="w-full h-full object-cover"
      >
    </NuxtLink>

    <div class="flex flex-col gap-1">
      <NuxtLink
        :to="`/products/${encodeURIComponent(item.productId)}`"
        class="font-bold no-underline"
      >
        {{ item.name }}
      </NuxtLink>
      <p class="text-sm text-muted-foreground">{{ formatPenAmount(item.price) }} c/u</p>
      <div class="flex items-center gap-3 mt-2">
        <CartQuantityControl :product-id="item.productId" :quantity="item.quantity" />
        <button
          type="button"
          class="text-destructive text-sm underline hover:opacity-80 transition-opacity"
          @click="confirmRemove"
        >
          Eliminar
        </button>
      </div>
    </div>

    <p class="font-extrabold text-orange-900 m-0">{{ formatPenAmount(lineTotal) }}</p>

    <!-- AlertDialog for remove confirmation (task 4.2) -->
    <AlertDialog :open="showRemoveDialog" @update:open="showRemoveDialog = $event">
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Remove item?</AlertDialogTitle>
          <AlertDialogDescription>
            Remove {{ item.name }} from your cart?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel @click="showRemoveDialog = false">Cancel</AlertDialogCancel>
          <AlertDialogAction
            class="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            @click="onRemove"
          >
            Remove
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  </div>
</template>
