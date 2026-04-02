<template>
  <div class="product-skeleton" aria-hidden="true">
    <div class="product-skeleton__media" />
    <div class="product-skeleton__body">
      <div class="product-skeleton__line product-skeleton__line--short" />
      <div class="product-skeleton__line" />
      <div class="product-skeleton__line product-skeleton__line--muted" />
      <div class="product-skeleton__line product-skeleton__line--price" />
    </div>
  </div>
</template>

<style scoped>
.product-skeleton {
  border-radius: 0.9rem;
  border: 1px solid var(--border-soft);
  overflow: hidden;
  background: #fff;
}

.product-skeleton__media {
  aspect-ratio: 16 / 11;
  background: linear-gradient(100deg, #eef2f7 30%, #f7fafc 50%, #eef2f7 70%);
  background-size: 240% 100%;
  animation: shimmer 1.3s infinite linear;
}

.product-skeleton__body {
  padding: 0.95rem;
  display: grid;
  gap: 0.55rem;
}

.product-skeleton__line {
  height: 0.7rem;
  border-radius: 999px;
  background: linear-gradient(100deg, #eef2f7 30%, #f7fafc 50%, #eef2f7 70%);
  background-size: 240% 100%;
  animation: shimmer 1.3s infinite linear;
}

.product-skeleton__line--short {
  width: 45%;
}

.product-skeleton__line--muted {
  width: 86%;
}

.product-skeleton__line--price {
  margin-top: 0.35rem;
  width: 35%;
}

@keyframes shimmer {
  0% {
    background-position: 100% 0;
  }

  100% {
    background-position: -100% 0;
  }
}
</style>
