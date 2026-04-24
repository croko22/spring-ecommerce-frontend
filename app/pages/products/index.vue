<script setup lang="ts">
import type { ProductQueryState } from '~/types/product'
import ProductCard from '~/components/products/ProductCard.vue'
import ProductSkeletonCard from '~/components/products/ProductSkeletonCard.vue'

const {
  queryState,
  result,
  status,
  error,
  isLoading,
  hasResults,
  categories,
  totalPages,
  currentPage,
  fetchListing,
  setSearch,
  setCategory,
  setSort,
  setPriceRange,
  setInStock,
  clearFilters,
  goToPage,
  refresh
} = useProductListing()

const searchInput = ref(queryState.value.search)
const priceMinInput = ref(queryState.value.priceMin ?? '')
const priceMaxInput = ref(queryState.value.priceMax ?? '')

const totalLabel = computed(() => {
  const total = result.value?.totalItems ?? 0
  if (!total) {
    return 'No hay productos para mostrar'
  }

  if (total === 1) {
    return '1 producto encontrado'
  }

  return `${total} productos encontrados`
})

const hasActiveFilters = computed(() => {
  return Boolean(
    queryState.value.search ||
    queryState.value.category ||
    queryState.value.sort !== 'name' ||
    queryState.value.priceMin !== null ||
    queryState.value.priceMax !== null ||
    queryState.value.inStock !== null
  )
})

const pageNumbers = computed(() => {
  const pages = totalPages.value
  const current = currentPage.value
  const start = Math.max(1, current - 2)
  const end = Math.min(pages, start + 4)
  const visible: number[] = []

  for (let page = start; page <= end; page += 1) {
    visible.push(page)
  }

  return visible
})

function updateInputsFromState(state: ProductQueryState) {
  searchInput.value = state.search
  priceMinInput.value = state.priceMin ?? ''
  priceMaxInput.value = state.priceMax ?? ''
}

async function submitSearch() {
  await setSearch(searchInput.value)
}

async function onCategoryChange(event: Event) {
  const target = event.target as HTMLSelectElement
  await setCategory(target.value)
}

async function onSortChange(event: Event) {
  const target = event.target as HTMLSelectElement
  await setSort(target.value as ProductQueryState['sort'])
}

async function onInStockChange(event: Event) {
  const target = event.target as HTMLSelectElement
  const value = target.value
  await setInStock(value === '' ? null : value === 'true')
}

async function submitPriceRange() {
  const min = priceMinInput.value === '' ? null : Number(priceMinInput.value)
  const max = priceMaxInput.value === '' ? null : Number(priceMaxInput.value)
  await setPriceRange(min, max)
}

async function onClearFilters() {
  await clearFilters()
}

async function prevPage() {
  await goToPage(currentPage.value - 1)
}

async function nextPage() {
  await goToPage(currentPage.value + 1)
}

watch(
  () => queryState.value,
  (nextState) => {
    updateInputsFromState(nextState)
  },
  { deep: true }
)

await fetchListing()
</script>

<template>
  <section class="products-page">
    <header class="products-page__header">
      <div>
        <p class="products-page__eyebrow">Catalogo</p>
        <h1>Product Listing</h1>
        <p class="products-page__subtitle">
          Explora productos con busqueda, filtros y navegacion paginada.
        </p>
      </div>
      <p class="products-page__total">{{ totalLabel }}</p>
    </header>

    <div class="products-toolbar">
      <form class="products-toolbar__search" @submit.prevent="submitSearch">
        <label for="product-search" class="products-toolbar__label">Buscar</label>
        <div class="products-toolbar__search-row">
          <input
            id="product-search"
            v-model="searchInput"
            type="search"
            placeholder="Ej: jacket, shoes, headphones"
            :disabled="isLoading"
          >
          <button type="submit" :disabled="isLoading">Aplicar</button>
        </div>
      </form>

      <label class="products-toolbar__filter" for="product-category">
        <span class="products-toolbar__label">Categoria</span>
        <select
          id="product-category"
          :value="queryState.category"
          :disabled="isLoading"
          @change="onCategoryChange"
        >
          <option value="">Todas</option>
          <option v-for="category in categories" :key="category" :value="category">
            {{ category }}
          </option>
        </select>
      </label>

      <label class="products-toolbar__filter" for="product-sort">
        <span class="products-toolbar__label">Ordenar por</span>
        <select
          id="product-sort"
          :value="queryState.sort"
          :disabled="isLoading"
          @change="onSortChange"
        >
          <option value="name">Nombre</option>
          <option value="price-asc">Precio: menor a mayor</option>
          <option value="price-desc">Precio: mayor a menor</option>
          <option value="rating">Mejor valorados</option>
        </select>
      </label>

      <div class="products-toolbar__filter">
        <span class="products-toolbar__label">Rango de precio</span>
        <div class="products-toolbar__price-row">
          <input
            v-model="priceMinInput"
            type="number"
            min="0"
            step="0.01"
            placeholder="Min"
            :disabled="isLoading"
          >
          <input
            v-model="priceMaxInput"
            type="number"
            min="0"
            step="0.01"
            placeholder="Max"
            :disabled="isLoading"
          >
          <button type="button" :disabled="isLoading" @click="submitPriceRange">
            Aplicar
          </button>
        </div>
      </div>

      <label class="products-toolbar__filter" for="product-availability">
        <span class="products-toolbar__label">Disponibilidad</span>
        <select
          id="product-availability"
          :value="queryState.inStock === null ? '' : String(queryState.inStock)"
          :disabled="isLoading"
          @change="onInStockChange"
        >
          <option value="">Todas</option>
          <option value="true">En stock</option>
          <option value="false">Agotado</option>
        </select>
      </label>

      <div v-if="hasActiveFilters" class="products-toolbar__actions">
        <button type="button" class="products-toolbar__clear" :disabled="isLoading" @click="onClearFilters">
          Limpiar filtros
        </button>
      </div>
    </div>

    <p v-if="status === 'error'" class="products-state products-state--error">
      {{ error || 'No se pudo cargar el listado de productos.' }}
      <button type="button" @click="refresh">Reintentar</button>
    </p>

    <div v-if="isLoading" class="products-grid" aria-live="polite" aria-busy="true">
      <ProductSkeletonCard v-for="idx in 8" :key="idx" />
    </div>

    <p
      v-else-if="!hasResults"
      class="products-state products-state--empty"
    >
      No encontramos productos para esa busqueda. Intenta con otro termino o ajusta los filtros.
    </p>

    <div v-else class="products-grid">
      <ProductCard
        v-for="product in result?.items || []"
        :key="product.id"
        :product="product"
      />
    </div>

    <nav
      v-if="totalPages > 1"
      class="products-pagination"
      aria-label="Paginacion de productos"
    >
      <button
        type="button"
        :disabled="currentPage <= 1 || isLoading"
        @click="prevPage"
      >
        Anterior
      </button>

      <button
        v-for="page in pageNumbers"
        :key="page"
        type="button"
        :class="['products-pagination__page', { 'is-active': page === currentPage }]"
        :disabled="isLoading"
        @click="goToPage(page)"
      >
        {{ page }}
      </button>

      <button
        type="button"
        :disabled="currentPage >= totalPages || isLoading"
        @click="nextPage"
      >
        Siguiente
      </button>
    </nav>
  </section>
</template>

<style scoped>
.products-page {
  max-width: 75rem;
  margin: 0 auto;
  padding: 2rem 1.2rem 3rem;
}

.products-page__header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 1rem;
  flex-wrap: wrap;
}

.products-page__eyebrow {
  margin: 0;
  font-size: 0.8rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--text-muted);
}

h1 {
  margin: 0.25rem 0 0;
  font-size: clamp(1.55rem, 3.6vw, 2.3rem);
}

.products-page__subtitle {
  margin: 0.5rem 0 0;
  color: var(--text-muted);
}

.products-page__total {
  margin: 0;
  color: #c2410c;
  font-weight: 700;
}

.products-toolbar {
  margin-top: 1.4rem;
  display: grid;
  grid-template-columns: repeat(6, minmax(0, 1fr));
  gap: 0.85rem;
  align-items: end;
}

.products-toolbar__search {
  grid-column: span 2;
}

.products-toolbar__filter {
  display: flex;
  flex-direction: column;
}

.products-toolbar__label {
  display: block;
  margin-bottom: 0.4rem;
  font-size: 0.86rem;
  color: var(--text-muted);
}

.products-toolbar__search-row {
  display: flex;
  gap: 0.5rem;
}

.products-toolbar__price-row {
  display: flex;
  gap: 0.5rem;
}

.products-toolbar input,
.products-toolbar select {
  width: 100%;
  border: 1px solid var(--border-soft);
  border-radius: 0.65rem;
  padding: 0.72rem 0.78rem;
  background: #fff;
}

.products-toolbar button {
  border: none;
  border-radius: 0.65rem;
  padding: 0.72rem 1rem;
  background: #c2410c;
  color: #fff;
  font-weight: 700;
  cursor: pointer;
  transition: background-color 0.15s;
  white-space: nowrap;
}

.products-toolbar button:hover {
  background: #9a3412;
}

.products-toolbar button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.products-toolbar__actions {
  display: flex;
  align-items: flex-end;
}

.products-toolbar__clear {
  background: #fff;
  color: #c2410c;
  border: 1px solid #c2410c;
}

.products-toolbar__clear:hover {
  background: #fff8eb;
}

.products-grid {
  margin-top: 1.1rem;
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 0.9rem;
}

.products-state {
  margin-top: 1rem;
  border-radius: 0.75rem;
  padding: 0.95rem 1rem;
  border: 1px solid var(--border-soft);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.8rem;
}

.products-state--error {
  border-color: #fecaca;
  color: #dc2626;
  background: #fef2f2;
}

.products-state--error button {
  border: 1px solid #fecaca;
  background: #fff;
  border-radius: 999px;
  padding: 0.35rem 0.75rem;
  cursor: pointer;
}

.products-state--empty {
  background: #fff;
  color: var(--text-muted);
}

.products-pagination {
  margin-top: 1.4rem;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.45rem;
  flex-wrap: wrap;
}

.products-pagination button {
  border: 1px solid var(--border-soft);
  background: #fff;
  border-radius: 999px;
  min-width: 2.2rem;
  height: 2.2rem;
  padding: 0 0.75rem;
  cursor: pointer;
}

.products-pagination button:disabled {
  cursor: not-allowed;
  opacity: 0.55;
}

.products-pagination__page.is-active {
  border-color: #f59e0b;
  color: #7c2d12;
  font-weight: 700;
  background: #fff8eb;
}

@media (max-width: 1100px) {
  .products-toolbar {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  .products-toolbar__search {
    grid-column: span 2;
  }
}

@media (max-width: 960px) {
  .products-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

@media (max-width: 760px) {
  .products-toolbar {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .products-toolbar__search {
    grid-column: span 2;
  }

  .products-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 520px) {
  .products-page {
    padding-inline: 0.85rem;
  }

  .products-toolbar {
    grid-template-columns: 1fr;
  }

  .products-toolbar__search {
    grid-column: span 1;
  }

  .products-grid {
    grid-template-columns: 1fr;
  }

  .products-state {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
