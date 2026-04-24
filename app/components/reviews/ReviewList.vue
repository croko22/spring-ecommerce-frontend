<script setup lang="ts">
interface Props {
  productId: string
}

const props = defineProps<Props>()

const { getReviewsByProductId, getAverageRating } = useReviews()

const reviews = computed(() => getReviewsByProductId(props.productId))
const averageRating = computed(() => getAverageRating(props.productId))
const reviewCount = computed(() => reviews.value.length)
</script>

<template>
  <section class="review-list" aria-label="Reseñas del producto">
    <div class="review-list__header">
      <h2 class="review-list__title">Reseñas</h2>
      <div v-if="reviewCount > 0" class="review-list__summary">
        <StarRating :model-value="averageRating" :readonly="true" :size="18" />
        <span class="review-list__average">{{ averageRating }}</span>
        <span class="review-list__count">({{ reviewCount }} reseña{{ reviewCount === 1 ? '' : 's' }})</span>
      </div>
      <p v-else class="review-list__empty">Aún no hay reseñas para este producto.</p>
    </div>

    <div v-if="reviewCount > 0" class="review-list__items">
      <ReviewCard
        v-for="review in reviews"
        :key="review.id"
        :review="review"
      />
    </div>
  </section>
</template>

<style scoped>
.review-list {
  margin-top: 2rem;
}

.review-list__header {
  margin-bottom: 1rem;
}

.review-list__title {
  margin: 0 0 0.5rem;
  font-size: 1.25rem;
  font-weight: 700;
}

.review-list__summary {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.review-list__average {
  font-weight: 700;
  color: #1e293b;
}

.review-list__count {
  color: var(--text-muted, #64748b);
  font-size: 0.9rem;
}

.review-list__empty {
  color: var(--text-muted, #64748b);
  font-size: 0.92rem;
  margin: 0.25rem 0 0;
}

.review-list__items {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}
</style>
