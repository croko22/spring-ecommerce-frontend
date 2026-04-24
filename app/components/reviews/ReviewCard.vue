<script setup lang="ts">
import type { Review } from '~/types/review'

interface Props {
  review: Review
}

defineProps<Props>()

function formatDate(dateString: string): string {
  const date = new Date(dateString)

  return date.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}
</script>

<template>
  <div class="review-card">
    <div class="review-card__header">
      <div class="review-card__author">
        <span class="review-card__author-name">{{ review.author }}</span>
        <StarRating :model-value="review.rating" :readonly="true" :size="16" />
      </div>
      <time class="review-card__date" :datetime="review.createdAt">
        {{ formatDate(review.createdAt) }}
      </time>
    </div>
    <p class="review-card__comment">{{ review.comment }}</p>
  </div>
</template>

<style scoped>
.review-card {
  padding: 1rem;
  border: 1px solid var(--border-soft, #e2e8f0);
  border-radius: 0.75rem;
  background: #fff;
}

.review-card__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 0.75rem;
  margin-bottom: 0.5rem;
}

.review-card__author {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.review-card__author-name {
  font-weight: 600;
  font-size: 0.95rem;
  color: #1e293b;
}

.review-card__date {
  font-size: 0.8rem;
  color: var(--text-muted, #64748b);
  white-space: nowrap;
}

.review-card__comment {
  margin: 0;
  color: #334155;
  line-height: 1.6;
  font-size: 0.92rem;
}
</style>
