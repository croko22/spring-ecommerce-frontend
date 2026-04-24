export type ProductSort = 'name' | 'price-asc' | 'price-desc' | 'rating'

export type Product = {
  id: string
  name: string
  description: string
  price: number
  currency: string
  imageUrl: string
  category: string
  inStock?: boolean
  stock?: number | null
  gallery?: string[]
  rating?: number | null
}

export type ProductQueryState = {
  search: string
  category: string
  page: number
  size: number
  sort: ProductSort
  priceMin: number | null
  priceMax: number | null
  inStock: boolean | null
}

export type ProductListResult = {
  items: Product[]
  page: number
  size: number
  totalItems: number
  totalPages: number
  categories: string[]
  source: 'api' | 'mock'
}
