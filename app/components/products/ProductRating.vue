<script setup lang="ts">
import { Star } from 'lucide-vue-next'

const props = defineProps<{
  rating: number | null | undefined
}>()

const normalized = computed(() => {
  const value = props.rating ?? 0
  return Math.max(0, Math.min(5, value))
})

const fullStars = computed(() => Math.round(normalized.value))
</script>

<template>
  <div class="product-rating" aria-label="Rating">
    <span class="product-rating__value">{{ normalized.toFixed(1) }}</span>
    <div class="product-rating__stars" aria-hidden="true">
      <Star
        v-for="i in 5"
        :key="i"
        class="product-rating__star"
        :class="{ 'product-rating__star--full': i <= fullStars }"
        :size="14"
      />
    </div>
  </div>
</template>

<style scoped>
.product-rating {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
}

.product-rating__value {
  font-size: 0.82rem;
  font-weight: 600;
  color: #b45309;
}

.product-rating__stars {
  display: inline-flex;
  gap: 0.1rem;
}

.product-rating__star {
  flex-shrink: 0;
  color: #e2e8f0;
}

.product-rating__star--full {
  fill: #f59e0b;
  color: #f59e0b;
}
</style>
