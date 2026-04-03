<script setup lang="ts">
import { getProductById } from '~/services/productService'
import { clampQuantity, resolveAvailabilityState } from '~/utils/productDetail'

const route = useRoute()
const cart = useCart()

type DetailStatus = 'idle' | 'loading' | 'success' | 'empty' | 'error'

const status = ref<DetailStatus>('idle')
const errorMessage = ref('')
const requestedId = computed(() => String(route.params.id ?? '').trim())

const productKey = computed(() => `product-detail:${requestedId.value}`)

const {
  data: product,
  status: asyncStatus,
  error,
  refresh
} = await useAsyncData(productKey, () => getProductById(requestedId.value), {
  watch: [requestedId],
  default: () => null,
  server: true,
  lazy: false
})

watch(
  [asyncStatus, product, error],
  ([nextAsyncStatus, nextProduct, nextError]) => {
    if (nextAsyncStatus === 'pending') {
      status.value = 'loading'
      errorMessage.value = ''
      return
    }

    if (nextError) {
      status.value = 'error'
      errorMessage.value = nextError instanceof Error
        ? nextError.message
        : 'No se pudo cargar el producto.'
      return
    }

    if (!nextProduct) {
      status.value = 'empty'
      errorMessage.value = ''
      return
    }

    status.value = 'success'
    errorMessage.value = ''
  },
  { immediate: true }
)

const isLoading = computed(() => status.value === 'loading')
const isError = computed(() => status.value === 'error')
const isEmpty = computed(() => status.value === 'empty')
const isSuccess = computed(() => status.value === 'success' && Boolean(product.value))

const availability = computed(() => resolveAvailabilityState(product.value))
const quantity = ref(1)
const addFeedback = ref('')
const selectedImage = ref('')

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

const galleryImages = computed(() => {
  if (!product.value) {
    return []
  }

  const gallery = Array.isArray(product.value.gallery)
    ? product.value.gallery.filter(Boolean)
    : []

  return gallery.length ? gallery : [product.value.imageUrl]
})

const displayedImage = computed(() => {
  if (!galleryImages.value.length) {
    return ''
  }

  if (selectedImage.value && galleryImages.value.includes(selectedImage.value)) {
    return selectedImage.value
  }

  return galleryImages.value[0]
})

watch([availability, product], ([nextAvailability, nextProduct]) => {
  quantity.value = clampQuantity(quantity.value, nextAvailability.maxQuantity)

  if (nextProduct) {
    addFeedback.value = ''
  }
})

watch(galleryImages, (nextGallery) => {
  selectedImage.value = nextGallery[0] ?? ''
}, { immediate: true })

const quantityOptions = computed(() => {
  const max = Math.min(availability.value.maxQuantity, 10)
  const options: number[] = []

  for (let index = 1; index <= max; index += 1) {
    options.push(index)
  }

  return options
})

function selectImage(image: string) {
  selectedImage.value = image
}

function updateQuantity(event: Event) {
  const target = event.target as HTMLSelectElement
  quantity.value = clampQuantity(Number(target.value), availability.value.maxQuantity)
  addFeedback.value = ''
}

function addToCart() {
  if (!product.value) {
    return
  }

  cart.addItem(product.value, quantity.value)
  addFeedback.value = `${quantity.value} x ${product.value.name} agregado al carrito`
}

async function retry() {
  await refresh()
}

useSeoMeta({
  title: () => {
    const name = product.value?.name ?? 'Producto'
    const suffix = isEmpty.value ? 'no encontrado' : 'detalle'
    return `${name} | ${suffix}`
  },
  description: () => product.value?.description ?? 'Detalle del producto en catalogo'
})
</script>

<template>
  <section class="product-detail">
    <NuxtLink class="product-detail__back" to="/products">Volver al listado</NuxtLink>

    <p v-if="isLoading" class="product-detail__state">Cargando producto...</p>

    <div v-else-if="isError" class="product-detail__state product-detail__state--error">
      <span>{{ errorMessage || 'No se pudo cargar el producto.' }}</span>
      <button type="button" @click="retry">Reintentar</button>
    </div>

    <div v-else-if="isEmpty" class="product-detail__state product-detail__state--empty">
      <span>El producto solicitado no existe o no esta disponible.</span>
      <NuxtLink to="/products">Volver al catalogo</NuxtLink>
    </div>

    <article v-else-if="isSuccess && product" class="product-detail__card">
      <div class="product-detail__media">
        <img
          class="product-detail__image"
          :src="displayedImage"
          :alt="product.name"
          loading="eager"
          decoding="async"
        >

        <div v-if="galleryImages.length > 1" class="product-detail__gallery" aria-label="Galeria de imagenes">
          <button
            v-for="image in galleryImages"
            :key="image"
            type="button"
            :class="['product-detail__thumb', { 'is-active': image === displayedImage }]"
            @click="selectImage(image)"
          >
            <img :src="image" :alt="`Vista de ${product.name}`" loading="lazy" decoding="async">
          </button>
        </div>
      </div>

      <div class="product-detail__body">
        <p class="product-detail__category">{{ product.category }}</p>
        <h1>{{ product.name }}</h1>
        <p class="product-detail__description">{{ product.description }}</p>
        <p class="product-detail__price">{{ formattedPrice }}</p>
        <p
          class="product-detail__availability"
          :class="[
            availability.tone === 'in' && 'product-detail__availability--in',
            availability.tone === 'low' && 'product-detail__availability--low',
            availability.tone === 'out' && 'product-detail__availability--out'
          ]"
        >
          {{ availability.label }}
        </p>

        <div class="product-detail__actions">
          <label class="product-detail__qty" for="product-quantity">
            <span>Cantidad</span>
            <select
              id="product-quantity"
              :value="quantity"
              :disabled="!availability.inStock"
              @change="updateQuantity"
            >
              <option v-for="value in quantityOptions" :key="value" :value="value">
                {{ value }}
              </option>
            </select>
          </label>

            <button
              type="button"
              class="product-detail__add"
              :disabled="!availability.inStock"
              @click="addToCart"
            >
            {{ availability.inStock ? 'Agregar al carrito' : 'No disponible' }}
          </button>
        </div>

        <p v-if="addFeedback" class="product-detail__feedback">{{ addFeedback }}</p>
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

.product-detail__state button,
.product-detail__state a {
  border: 1px solid var(--border-soft);
  background: #fff;
  border-radius: 999px;
  padding: 0.35rem 0.75rem;
  text-decoration: none;
  color: inherit;
  font-weight: 600;
}
.product-detail__state--error {
  border-color: #fecaca;
  color: #991b1b;
  background: #fff1f2;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.8rem;
}

.product-detail__state--empty {
  color: var(--text-muted);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.8rem;
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

.product-detail__media {
  display: grid;
  grid-template-rows: minmax(0, 1fr) auto;
}
.product-detail__image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  min-height: 20rem;
}

.product-detail__gallery {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 0.45rem;
  padding: 0.65rem;
  border-top: 1px solid var(--border-soft);
  background: #f8fafc;
}

.product-detail__thumb {
  border: 1px solid var(--border-soft);
  border-radius: 0.5rem;
  padding: 0;
  background: #fff;
  overflow: hidden;
  cursor: pointer;
  opacity: 0.72;
}

.product-detail__thumb img {
  width: 100%;
  aspect-ratio: 1 / 1;
  object-fit: cover;
  display: block;
}

.product-detail__thumb.is-active {
  opacity: 1;
  border-color: #f59e0b;
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

.product-detail__availability {
  margin: 0.6rem 0 0;
  font-weight: 600;
}

.product-detail__availability--in {
  color: #166534;
}

.product-detail__availability--low {
  color: #9a3412;
}

.product-detail__availability--out {
  color: #991b1b;
}

.product-detail__actions {
  margin-top: 1rem;
  display: flex;
  gap: 0.7rem;
  flex-wrap: wrap;
  align-items: flex-end;
}

.product-detail__qty span {
  display: block;
  margin-bottom: 0.35rem;
  color: var(--text-muted);
  font-size: 0.84rem;
}

.product-detail__qty select {
  border: 1px solid var(--border-soft);
  border-radius: 0.6rem;
  padding: 0.63rem 0.75rem;
  min-width: 5rem;
  background: #fff;
}

.product-detail__add {
  border: 1px solid rgb(180 83 9 / 0.24);
  border-radius: 0.65rem;
  padding: 0.7rem 1rem;
  background: linear-gradient(125deg, var(--accent), var(--accent-strong));
  color: #fff;
  font-weight: 700;
  cursor: pointer;
}

.product-detail__add:disabled {
  opacity: 0.65;
  cursor: not-allowed;
}

.product-detail__feedback {
  margin-top: 0.8rem;
  color: #166534;
  font-weight: 600;
}
@media (max-width: 780px) {
  .product-detail__card {
    grid-template-columns: 1fr;
  }

  .product-detail__image {
    min-height: 14rem;
  }

  .product-detail__state--error,
  .product-detail__state--empty {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
