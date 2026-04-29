<script setup lang="ts">
import type { CartItem } from '~/utils/cart'
import { formatPenAmount } from '~/utils/currency'
import { Trash2 } from 'lucide-vue-next'
import { toast } from 'vue-sonner'

const props = defineProps<{
  item: CartItem
}>()

const { incrementItem, decrementItem, removeItem } = useCart()
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
  <div class="border border-input rounded-xl bg-background p-4 shadow-sm hover:shadow-md transition-shadow">
    <div class="flex gap-4">
      <NuxtLink
        :to="`/products/${encodeURIComponent(item.productId)}`"
        class="block w-20 h-20 sm:w-24 sm:h-24 rounded-lg overflow-hidden bg-muted flex-shrink-0"
      >
        <img
          :src="item.imageUrl"
          :alt="item.name"
          loading="lazy"
          decoding="async"
          class="w-full h-full object-cover"
        >
      </NuxtLink>

      <div class="flex-1 min-w-0">
        <div class="flex items-start justify-between gap-2">
          <NuxtLink
            :to="`/products/${encodeURIComponent(item.productId)}`"
            class="font-semibold leading-tight hover:underline truncate block"
          >
            {{ item.name }}
          </NuxtLink>
          <p class="font-bold text-primary whitespace-nowrap">
            {{ formatPenAmount(lineTotal) }}
          </p>
        </div>

        <p class="text-sm text-muted-foreground mt-0.5">
          {{ formatPenAmount(item.price) }} c/u
        </p>

        <div class="flex items-center justify-between mt-3">
          <CartQuantityControl :product-id="item.productId" :quantity="item.quantity" />

          <Button
            variant="ghost"
            size="sm"
            class="text-destructive hover:text-destructive hover:bg-destructive/10 h-8 px-2"
            @click="confirmRemove"
          >
            <Trash2 class="w-4 h-4 mr-1.5" />
            <span class="text-sm">Eliminar</span>
          </Button>
        </div>
      </div>
    </div>

    <AlertDialog :open="showRemoveDialog" @update:open="showRemoveDialog = $event">
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>¿Eliminar producto?</AlertDialogTitle>
          <AlertDialogDescription>
            ¿Deseas eliminar "{{ item.name }}" de tu carrito?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            class="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            @click="onRemove"
          >
            Eliminar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  </div>
</template>
