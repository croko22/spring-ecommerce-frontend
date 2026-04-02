<script setup lang="ts">
import { getProductById } from '~/services/productService'

const route = useRoute()

const product = ref<Awaited<ReturnType<typeof getProductById>>>(null)
const loading = ref(true)
const error = ref('')

const productId = computed(() => String(route.params.id ?? ''))

const money = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 2
})

const formattedPrice = computed(() => {
  if (!product.value) {
    return ''
  }

  if (product.value.currency === 'USD') {
    return money.format(product.value.price)
  }

  return `${product.value.price.toFixed(2)} ${product.value.currency}`
})

async function loadProduct() {
  loading.value = true
  error.value = ''

  try {
    product.value = await getProductById(productId.value)

    if (!product.value) {
      error.value = 'El producto solicitado no existe o no esta disponible.'
    }
  } catch (caughtError) {
    error.value = caughtError instanceof Error
      ? caughtError.message
      : 'No se pudo cargar el producto.'
  } finally {
    loading.value = false
  }
}

watch(() => productId.value, loadProduct)

await loadProduct()
</script>

<template>
  <section class="product-detail">
    <NuxtLink class="product-detail__back" to="/products">Volver al listado</NuxtLink>

    <p v-if="loading" class="product-detail__state">Cargando producto...</p>
    <p v-else-if="error" class="product-detail__state product-detail__state--error">{{ error }}</p>

    <article v-else-if="product" class="product-detail__card">
      <img
        class="product-detail__image"
        :src="product.imageUrl"
        :alt="product.name"
        loading="lazy"
        decoding="async"
      >

      <div class="product-detail__body">
        <p class="product-detail__category">{{ product.category }}</p>
        <h1>{{ product.name }}</h1>
        <p class="product-detail__description">{{ product.description }}</p>
        <p class="product-detail__price">{{ formattedPrice }}</p>
      </div>
    </article>
  </section>
</template>

<style scoped>
.product-detail {
  max-width: 64rem;
  margin: 0 auto;
  padding: 2rem 1.2rem;
}

.product-detail__back {
  color: var(--accent);
  text-decoration: none;
  font-weight: 700;
}

.product-detail__state {
  margin-top: 1rem;
  border: 1px solid var(--border-soft);
  border-radius: 0.7rem;
  padding: 0.85rem 1rem;
  background: #fff;
}

.product-detail__state--error {
  border-color: #fecaca;
  color: #991b1b;
  background: #fff1f2;
}

.product-detail__card {
  margin-top: 1rem;
  border: 1px solid var(--border-soft);
  border-radius: 1rem;
  overflow: hidden;
  background: #fff;
  display: grid;
  grid-template-columns: 1.1fr 1fr;
}

.product-detail__image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  min-height: 20rem;
}

.product-detail__body {
  padding: 1.2rem;
}

.product-detail__category {
  margin: 0;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.06em;
  font-size: 0.8rem;
  font-weight: 700;
}

h1 {
  margin: 0.45rem 0 0;
}

.product-detail__description {
  color: var(--text-muted);
  line-height: 1.6;
}

.product-detail__price {
  margin-top: 1rem;
  color: #7c2d12;
  font-size: 1.3rem;
  font-weight: 800;
}

@media (max-width: 780px) {
  .product-detail__card {
    grid-template-columns: 1fr;
  }

  .product-detail__image {
    min-height: 14rem;
  }
}
</style>
