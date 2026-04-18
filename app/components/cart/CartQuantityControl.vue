<script setup lang="ts">
const props = defineProps<{
  productId: string
  quantity: number
}>()

const { incrementItem, decrementItem } = useCart()
</script>

<template>
  <div class="inline-flex items-center rounded-full border border-input overflow-hidden">
    <button
      type="button"
      class="h-8 w-8 flex items-center justify-center bg-muted hover:bg-muted/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      :disabled="quantity <= 1"
      @click="decrementItem(productId)"
    >
      −
    </button>
    <span class="min-w-[2rem] text-center font-bold text-sm">{{ quantity }}</span>
    <button
      type="button"
      class="h-8 w-8 flex items-center justify-center bg-muted hover:bg-muted/80 transition-colors"
      @click="incrementItem(productId)"
    >
      +
    </button>
  </div>
</template>
