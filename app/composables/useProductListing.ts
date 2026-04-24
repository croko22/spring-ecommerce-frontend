import type { ProductListResult, ProductQueryState } from '~/types/product'
import { listProducts } from '~/services/productService'
import { parseProductQuery, stringifyProductQuery } from '~/utils/productListingQuery'

type ListingStatus = 'idle' | 'loading' | 'success' | 'error'

export function useProductListing() {
  const route = useRoute()
  const router = useRouter()
  const { settings } = useUserSettings()

  const queryState = ref<ProductQueryState>(
    parseProductQuery(route.query as Record<string, unknown>, settings.value.pageSize)
  )

  const result = ref<ProductListResult | null>(null)
  const status = ref<ListingStatus>('idle')
  const error = ref('')

  const isLoading = computed(() => status.value === 'loading')
  const hasResults = computed(() => (result.value?.items.length ?? 0) > 0)
  const categories = computed(() => result.value?.categories ?? [])
  const totalPages = computed(() => result.value?.totalPages ?? 1)
  const currentPage = computed(() => result.value?.page ?? queryState.value.page)

  async function fetchListing() {
    status.value = 'loading'
    error.value = ''

    try {
      result.value = await listProducts(queryState.value)
      status.value = 'success'
    } catch (caughtError) {
      status.value = 'error'
      error.value = caughtError instanceof Error
        ? caughtError.message
        : 'No se pudieron cargar los productos.'
    }
  }

  async function syncUrl() {
    const query = stringifyProductQuery(queryState.value)

    await router.replace({ query })
  }

  async function updateQuery(patch: Partial<ProductQueryState>) {
    queryState.value = {
      ...queryState.value,
      ...patch
    }

    await syncUrl()
    await fetchListing()
  }

  async function setSearch(search: string) {
    await updateQuery({ search, page: 1 })
  }

  async function setCategory(category: string) {
    await updateQuery({ category, page: 1 })
  }

  async function setSort(sort: ProductQueryState['sort']) {
    await updateQuery({ sort, page: 1 })
  }

  async function setPriceRange(priceMin: number | null, priceMax: number | null) {
    await updateQuery({ priceMin, priceMax, page: 1 })
  }

  async function setInStock(inStock: boolean | null) {
    await updateQuery({ inStock, page: 1 })
  }

  async function clearFilters() {
    await updateQuery({
      search: '',
      category: '',
      page: 1,
      sort: 'name',
      priceMin: null,
      priceMax: null,
      inStock: null
    })
  }

  async function goToPage(page: number) {
    const nextPage = Math.min(Math.max(1, Math.floor(page)), totalPages.value)
    await updateQuery({ page: nextPage })
  }

  async function refresh() {
    await fetchListing()
  }

  watch(
    () => route.query,
    async (nextQuery) => {
      const normalized = parseProductQuery(nextQuery as Record<string, unknown>, settings.value.pageSize)
      const hasSameState = JSON.stringify(normalized) === JSON.stringify(queryState.value)

      if (!hasSameState) {
        queryState.value = normalized
        await fetchListing()
      }
    }
  )

  return {
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
  }
}
