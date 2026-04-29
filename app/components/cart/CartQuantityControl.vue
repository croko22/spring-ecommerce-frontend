<script setup lang="ts">
const props = defineProps<{
  productId: string
  quantity: number
}>()

const { incrementItem, decrementItem } = useCart()
</script>

<template>
  <div class="inline-flex items-center rounded-lg border border-input overflow-hidden bg-background">
    <button
      type="button"
      class="h-8 w-8 flex items-center justify-center hover:bg-muted transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
      :disabled="quantity <= 1"
      @click="decrementItem(productId)"
    >
      <Icon name="lucide:minus" class="w-3.5 h-3.5" />
    </button>
    <span class="min-w-[2rem] text-center font-semibold text-sm">{{ quantity }}</span>
    <button
      type="button"
      class="h-8 w-8 flex items-center justify-center hover:bg-muted transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
      :disabled="quantity >= 99"
      @click="incrementItem(productId)"
    >
      <Icon name="lucide:plus" class="w-3.5 h-3.5" />
    </button>
  </div>
</template>
