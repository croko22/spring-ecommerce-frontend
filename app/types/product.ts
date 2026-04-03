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
}

export type ProductQueryState = {
  search: string
  category: string
  page: number
  size: number
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
