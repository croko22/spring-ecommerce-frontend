<script setup lang="ts">
import type { Product } from '~/types/product'
import { formatPenAmount } from '~/utils/currency'

defineProps<{
  product: Product
}>()

const { settings } = useUserSettings()

function productUrl(id: string) {
  return `/products/${encodeURIComponent(id)}`
}
function formatPrice(amount: number) {
  if (settings.value.currency === 'PEN') {
    return formatPenAmount(amount)
  }

  return `${amount.toFixed(2)} PEN`
}
</script>

<template>
  <article class="product-card">
    <NuxtLink :to="productUrl(product.id)" class="product-card__media-link">
      <img
        class="product-card__image"
        :src="product.imageUrl"
        :alt="product.name"
        loading="lazy"
        decoding="async"
      >
    </NuxtLink>

    <div class="product-card__body">
      <p class="product-card__category">{{ product.category }}</p>
      <h2 class="product-card__name">
        <NuxtLink :to="productUrl(product.id)">{{ product.name }}</NuxtLink>
      </h2>
      <p class="product-card__description">{{ product.description }}</p>
      <div class="product-card__footer">
        <strong class="product-card__price">{{ formatPrice(product.price) }}</strong>
        <NuxtLink :to="productUrl(product.id)" class="product-card__cta">Ver detalle</NuxtLink>
      </div>
    </div>
  </article>
</template>

<style scoped>
.product-card {
  background: var(--bg-card);
  border: 1px solid var(--border-soft);
  border-radius: 0.9rem;
  overflow: hidden;
  display: grid;
  grid-template-rows: auto 1fr;
  min-height: 100%;
}

.product-card__media-link {
  display: block;
  background: #e7edf4;
  aspect-ratio: 16 / 11;
}

.product-card__image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.product-card__body {
  padding: 0.95rem;
  display: grid;
  gap: 0.55rem;
}

.product-card__category {
  margin: 0;
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  color: var(--text-muted);
  text-transform: uppercase;
}

.product-card__name {
  margin: 0;
  font-size: 1.03rem;
}

.product-card__name a {
  text-decoration: none;
}

.product-card__description {
  margin: 0;
  color: var(--text-muted);
  font-size: 0.94rem;
  line-height: 1.5;
}

.product-card__footer {
  margin-top: 0.2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.5rem;
}

.product-card__price {
  color: #7c2d12;
}

.product-card__cta {
  color: var(--accent);
  font-weight: 700;
  text-decoration: none;
}
</style>
