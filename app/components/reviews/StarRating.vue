<script setup lang="ts">
import { Star } from 'lucide-vue-next'

interface Props {
  modelValue?: number
  readonly?: boolean
  size?: number
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: 0,
  readonly: false,
  size: 20
})

const emit = defineEmits<{
  (event: 'update:modelValue', value: number): void
}>()

const MAX_STARS = 5

const stars = computed(() => {
  return Array.from({ length: MAX_STARS }, (_, index) => {
    const starValue = index + 1
    const isActive = starValue <= props.modelValue

    return {
      value: starValue,
      active: isActive
    }
  })
})

function handleClick(value: number) {
  if (props.readonly) {
    return
  }

  emit('update:modelValue', value)
}
</script>

<template>
  <div
    class="star-rating"
    :class="{ 'star-rating--readonly': readonly }"
    role="img"
    :aria-label="`Calificación: ${modelValue} de ${MAX_STARS} estrellas`"
  >
    <button
      v-for="star in stars"
      :key="star.value"
      type="button"
      class="star-rating__star"
      :class="{ 'is-active': star.active }"
      :disabled="readonly"
      :aria-label="`${star.value} estrella${star.value > 1 ? 's' : ''}`"
      @click="handleClick(star.value)"
    >
      <Star
        :size="size"
        :class="[
          'star-rating__icon',
          star.active ? 'star-rating__icon--active' : 'star-rating__icon--inactive'
        ]"
      />
    </button>
  </div>
</template>

<style scoped>
.star-rating {
  display: inline-flex;
  align-items: center;
  gap: 0.15rem;
}

.star-rating__star {
  display: inline-flex;
  padding: 0;
  border: none;
  background: transparent;
  cursor: pointer;
  line-height: 1;
  transition: transform 0.1s ease;
}

.star-rating__star:hover:not(:disabled) {
  transform: scale(1.15);
}

.star-rating__star:disabled {
  cursor: default;
}

.star-rating__icon--active {
  color: #f59e0b;
  fill: #f59e0b;
}

.star-rating__icon--inactive {
  color: #d1d5db;
}
</style>
