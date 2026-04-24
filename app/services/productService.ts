import type { Product, ProductListResult, ProductQueryState } from '~/types/product'

const FALLBACK_PAGE_SIZE = 12

const MOCK_PRODUCTS: Product[] = [
  {
    id: 'p-001',
    name: 'Aurora Running Shoes',
    description: 'Lightweight trainers with breathable mesh and cushioned sole.',
    price: 89.9,
    currency: 'USD',
    imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80',
    category: 'Footwear',
    stock: 12,
    rating: 4.5
  },
  {
    id: 'p-002',
    name: 'Summit Trail Jacket',
    description: 'Water-resistant shell made for windy afternoon hikes.',
    price: 119.5,
    currency: 'USD',
    imageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=80',
    category: 'Apparel',
    stock: 8,
    rating: 4.2
  },
  {
    id: 'p-003',
    name: 'North Peak Backpack',
    description: '28L everyday backpack with laptop sleeve and side pockets.',
    price: 74,
    currency: 'USD',
    imageUrl: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80',
    category: 'Accessories',
    stock: 0,
    rating: 3.9
  },
  {
    id: 'p-004',
    name: 'Wave Wireless Headphones',
    description: 'Over-ear headphones with active noise cancellation.',
    price: 159,
    currency: 'USD',
    imageUrl: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=900&q=80',
    category: 'Electronics',
    stock: 25,
    rating: 4.7
  },
  {
    id: 'p-005',
    name: 'Eclipse Smartwatch',
    description: 'Fitness and sleep tracking with 7-day battery life.',
    price: 199,
    currency: 'USD',
    imageUrl: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=900&q=80',
    category: 'Electronics',
    stock: 5,
    rating: 4.1
  },
  {
    id: 'p-006',
    name: 'Luna Ceramic Bottle',
    description: 'Insulated bottle that keeps drinks cold for 24 hours.',
    price: 34,
    currency: 'USD',
    imageUrl: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=900&q=80',
    category: 'Home',
    stock: 50,
    rating: 4.3
  },
  {
    id: 'p-007',
    name: 'Granite Chef Knife',
    description: '8-inch high-carbon steel knife with walnut handle.',
    price: 62,
    currency: 'USD',
    imageUrl: 'https://images.unsplash.com/photo-1593618998160-5fbf4f45863b?auto=format&fit=crop&w=900&q=80',
    category: 'Home',
    stock: 3,
    rating: 4.8
  },
  {
    id: 'p-008',
    name: 'Studio Desk Lamp',
    description: 'Adjustable warm LED lamp with touch dimmer.',
    price: 45.5,
    currency: 'USD',
    imageUrl: 'https://images.unsplash.com/photo-1519710164239-da123dc03ef4?auto=format&fit=crop&w=900&q=80',
    category: 'Home',
    stock: 15,
    rating: 4.0
  },
  {
    id: 'p-009',
    name: 'Nimbus Hoodie',
    description: 'Midweight fleece hoodie with oversized front pocket.',
    price: 58,
    currency: 'USD',
    imageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=80',
    category: 'Apparel',
    stock: 7,
    rating: 3.7
  },
  {
    id: 'p-010',
    name: 'Vertex Sunglasses',
    description: 'Polarized lenses and lightweight acetate frame.',
    price: 77,
    currency: 'USD',
    imageUrl: 'https://images.unsplash.com/photo-1511497584788-876760111969?auto=format&fit=crop&w=900&q=80',
    category: 'Accessories',
    stock: 20,
    rating: 4.4
  },
  {
    id: 'p-011',
    name: 'City Commuter Bike Helmet',
    description: 'Ventilated urban helmet with magnetic buckle.',
    price: 68,
    currency: 'USD',
    imageUrl: 'https://images.unsplash.com/photo-1519583272095-6433daf26b6e?auto=format&fit=crop&w=900&q=80',
    category: 'Sports',
    stock: 4,
    rating: 4.6
  },
  {
    id: 'p-012',
    name: 'Pulse Yoga Mat',
    description: 'Extra-grip surface and 6 mm comfortable thickness.',
    price: 39,
    currency: 'USD',
    imageUrl: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&w=900&q=80',
    category: 'Sports',
    stock: 0,
    rating: 3.5
  },
  {
    id: 'p-013',
    name: 'Brew Pour-Over Set',
    description: 'Glass dripper and server for manual coffee brewing.',
    price: 52,
    currency: 'USD',
    imageUrl: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=900&q=80',
    category: 'Home',
    stock: 9,
    rating: 4.2
  },
  {
    id: 'p-014',
    name: 'Orbit Phone Stand',
    description: 'Foldable aluminum stand for desk and video calls.',
    price: 24,
    currency: 'USD',
    imageUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=900&q=80',
    category: 'Electronics',
    stock: 100,
    rating: 3.9
  },
  {
    id: 'p-015',
    name: 'Harbor Chino Pants',
    description: 'Tapered fit stretch chinos for everyday wear.',
    price: 64,
    currency: 'USD',
    imageUrl: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?auto=format&fit=crop&w=900&q=80',
    category: 'Apparel',
    stock: 2,
    rating: 4.1
  },
  {
    id: 'p-016',
    name: 'Atlas Weekender Bag',
    description: 'Canvas duffel with shoe compartment and shoulder strap.',
    price: 98,
    currency: 'USD',
    imageUrl: 'https://images.unsplash.com/photo-1547949003-9792a18a2601?auto=format&fit=crop&w=900&q=80',
    category: 'Accessories',
    stock: 6,
    rating: 4.5
  },
  {
    id: 'p-017',
    name: 'Seaside Linen Shirt',
    description: 'Breathable linen shirt cut in relaxed fit.',
    price: 55,
    currency: 'USD',
    imageUrl: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=900&q=80',
    category: 'Apparel',
    stock: 11,
    rating: 3.8
  },
  {
    id: 'p-018',
    name: 'Metro Wallet',
    description: 'Slim leather wallet with RFID blocking pocket.',
    price: 41,
    currency: 'USD',
    imageUrl: 'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=900&q=80',
    category: 'Accessories',
    stock: 30,
    rating: 4.3
  }
]

type ProductApiResponse = {
  items?: unknown[]
  content?: unknown[]
  page?: number
  size?: number
  totalItems?: number
  totalElements?: number
  totalPages?: number
  categories?: string[]
}

function normalizeQuery(query: Partial<ProductQueryState>): ProductQueryState {
  return {
    search: String(query.search ?? '').trim(),
    category: String(query.category ?? '').trim(),
    page: Number.isFinite(query.page) && Number(query.page) > 0 ? Number(query.page) : 1,
    size: Number.isFinite(query.size) && Number(query.size) > 0 ? Number(query.size) : FALLBACK_PAGE_SIZE,
    sort: query.sort ?? 'name',
    priceMin: query.priceMin ?? null,
    priceMax: query.priceMax ?? null,
    inStock: query.inStock ?? null
  }
}

function computeCategories(items: Product[]): string[] {
  return [...new Set(items.map(item => item.category))].sort((left, right) => left.localeCompare(right))
}

function normalizeProductEntry(entry: unknown): Product | null {
  if (!entry || typeof entry !== 'object') {
    return null
  }

  const product = entry as Record<string, unknown>
  const id = String(product.id ?? '').trim()
  const name = String(product.name ?? product.title ?? '').trim()

  if (!id || !name) {
    return null
  }

  const description = String(product.description ?? product.summary ?? '').trim()
  const price = Number(product.price ?? product.amount ?? 0)
  const category = String(product.category ?? product.categoryName ?? 'General').trim() || 'General'
  const imageUrl = String(
    product.imageUrl
      ?? product.thumbnail
      ?? product.image
      ?? 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=80'
  )
  const stockRaw = Number(product.stock ?? product.inventory ?? product.quantity ?? Number.NaN)
  const hasStockValue = Number.isFinite(stockRaw)
  const stock = hasStockValue ? Math.max(0, Math.floor(stockRaw)) : null
  const inStockRaw = product.inStock ?? product.available
  const inStock = typeof inStockRaw === 'boolean'
    ? inStockRaw
    : hasStockValue
      ? stockRaw > 0
      : true
  const galleryRaw = Array.isArray(product.gallery)
    ? product.gallery
    : Array.isArray(product.images)
      ? product.images
      : []
  const gallery = galleryRaw
    .map(item => String(item).trim())
    .filter(Boolean)
  const safeGallery = gallery.length ? gallery : [imageUrl]

  const ratingRaw = Number(product.rating ?? product.averageRating ?? product.score ?? Number.NaN)
  const rating = Number.isFinite(ratingRaw) ? Math.max(0, Math.min(5, ratingRaw)) : null

  return {
    id,
    name,
    description,
    price: Number.isFinite(price) ? price : 0,
    currency: String(product.currency ?? 'USD'),
    imageUrl,
    category,
    inStock,
    stock,
    gallery: safeGallery,
    rating
  }
}

function filterMockProducts(products: Product[], query: ProductQueryState): Product[] {
  const term = query.search.toLowerCase()

  return products.filter((product) => {
    const matchSearch = !term
      || product.name.toLowerCase().includes(term)
      || product.description.toLowerCase().includes(term)
    const matchCategory = !query.category || product.category === query.category
    const matchPriceMin = query.priceMin === null || product.price >= query.priceMin
    const matchPriceMax = query.priceMax === null || product.price <= query.priceMax
    const matchInStock = query.inStock === null || product.inStock === query.inStock

    return matchSearch && matchCategory && matchPriceMin && matchPriceMax && matchInStock
  })
}

function sortMockProducts(products: Product[], sort: ProductQueryState['sort']): Product[] {
  const sorted = [...products]

  switch (sort) {
    case 'price-asc':
      sorted.sort((a, b) => a.price - b.price)
      break
    case 'price-desc':
      sorted.sort((a, b) => b.price - a.price)
      break
    case 'rating':
      sorted.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0))
      break
    case 'name':
    default:
      sorted.sort((a, b) => a.name.localeCompare(b.name))
      break
  }

  return sorted
}

function mapMockProducts(query: ProductQueryState): ProductListResult {
  const filtered = filterMockProducts(MOCK_PRODUCTS, query)
  const sorted = sortMockProducts(filtered, query.sort)
  const totalItems = sorted.length
  const totalPages = Math.max(1, Math.ceil(totalItems / query.size))
  const safePage = Math.min(query.page, totalPages)
  const start = (safePage - 1) * query.size
  const end = start + query.size
  const items = sorted.slice(start, end)

  return {
    items,
    page: safePage,
    size: query.size,
    totalItems,
    totalPages,
    categories: computeCategories(MOCK_PRODUCTS),
    source: 'mock'
  }
}

async function fetchProductsFromApi(query: ProductQueryState): Promise<ProductListResult | null> {
  try {
    const { data, error } = await useApiFetch<ProductApiResponse>('/products', {
      method: 'GET',
      query: {
        q: query.search || undefined,
        search: query.search || undefined,
        category: query.category || undefined,
        page: query.page,
        size: query.size,
        sort: query.sort || undefined,
        priceMin: query.priceMin ?? undefined,
        priceMax: query.priceMax ?? undefined,
        inStock: query.inStock ?? undefined
      }
    })

    if (error.value || !data.value) {
      return null
    }

    const payload = data.value
    const rawItems = Array.isArray(payload.items)
      ? payload.items
      : Array.isArray(payload.content)
        ? payload.content
        : []
    const items = rawItems.map(normalizeProductEntry).filter((entry): entry is Product => Boolean(entry))
    const totalItems = Number(payload.totalItems ?? payload.totalElements ?? items.length)
    const totalPages = Number(payload.totalPages ?? Math.max(1, Math.ceil(totalItems / query.size)))
    const categories = Array.isArray(payload.categories)
      ? payload.categories.map(category => String(category)).filter(Boolean)
      : computeCategories(items)

    return {
      items,
      page: Number(payload.page ?? query.page),
      size: Number(payload.size ?? query.size),
      totalItems: Number.isFinite(totalItems) ? totalItems : items.length,
      totalPages: Number.isFinite(totalPages) && totalPages > 0 ? totalPages : 1,
      categories,
      source: 'api'
    }
  } catch {
    return null
  }
}

async function fetchProductByIdFromApi(id: string): Promise<Product | null> {
  try {
    const { data, error } = await useApiFetch<unknown>(`/products/${id}`, {
      method: 'GET'
    })

    if (error.value || !data.value) {
      return null
    }

    return normalizeProductEntry(data.value)
  } catch {
    return null
  }
}

export async function listProducts(rawQuery: Partial<ProductQueryState>): Promise<ProductListResult> {
  const query = normalizeQuery(rawQuery)
  const apiResult = await fetchProductsFromApi(query)

  if (apiResult) {
    return apiResult
  }

  return mapMockProducts(query)
}

export async function getProductById(id: string): Promise<Product | null> {
  const safeId = String(id).trim()

  if (!safeId) {
    return null
  }

  const fromApi = await fetchProductByIdFromApi(safeId)

  if (fromApi) {
    return fromApi
  }

  return MOCK_PRODUCTS.find(product => product.id === safeId) ?? null
}
