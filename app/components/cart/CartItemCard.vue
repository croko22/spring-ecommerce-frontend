<script setup lang="ts">
import type { CartItem } from '~/utils/cart'
import { formatPenAmount } from '~/utils/currency'
import { toast } from 'vue-sonner'
import { Trash2 } from 'lucide-vue-next'

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
  <div class="border border-input rounded-xl bg-background p-3 grid grid-cols-[5rem_1fr_auto] gap-3 items-center max-sm:grid-cols-1 transition-colors hover:bg-accent/30">
    <NuxtLink
      :to="`/products/${encodeURIComponent(item.productId)}`"
      class="block rounded-lg overflow-hidden bg-muted aspect-square max-sm:w-24 max-sm:mx-auto"
    >
      <img
        :src="item.imageUrl"
        :alt="item.name"
        loading="lazy"
        decoding="async"
        class="w-full h-full object-cover"
      >
    </NuxtLink>

    <div class="flex flex-col gap-1 min-w-0">
      <NuxtLink
        :to="`/products/${encodeURIComponent(item.productId)}`"
        class="font-semibold text-sm leading-tight truncate no-underline hover:underline"
      >
        {{ item.name }}
      </NuxtLink>
      <p class="text-xs text-muted-foreground m-0">{{ formatPenAmount(item.price) }} c/u</p>
      <div class="flex items-center gap-3 mt-1.5">
        <CartQuantityControl :product-id="item.productId" :quantity="item.quantity" />
        <button
          type="button"
          class="inline-flex items-center gap-1 text-destructive text-xs font-medium hover:opacity-80 transition-opacity bg-transparent border-none cursor-pointer p-0"
          @click="confirmRemove"
        >
          <Trash2 class="w-3.5 h-3.5" />
          Eliminar
        </button>
      </div>
    </div>

    <p class="font-bold text-sm text-right m-0">{{ formatPenAmount(lineTotal) }}</p>

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
