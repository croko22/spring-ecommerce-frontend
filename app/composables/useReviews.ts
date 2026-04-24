import type { Review, ReviewInput } from '~/types/review'

const REVIEWS_STORAGE_KEY = 'ecommerce.reviews'

const MOCK_REVIEWS: Review[] = [
  {
    id: 'r-001',
    productId: 'p-001',
    author: 'María González',
    rating: 5,
    comment: 'Excelentes zapatillas, muy cómodas para correr.',
    createdAt: '2025-03-15T10:30:00Z'
  },
  {
    id: 'r-002',
    productId: 'p-001',
    author: 'Carlos Ruiz',
    rating: 4,
    comment: 'Buena calidad, aunque el tallaje es un poco pequeño.',
    createdAt: '2025-03-10T14:20:00Z'
  },
  {
    id: 'r-003',
    productId: 'p-002',
    author: 'Ana López',
    rating: 5,
    comment: 'Perfecta para senderismo, resistente al agua.',
    createdAt: '2025-02-28T09:15:00Z'
  },
  {
    id: 'r-004',
    productId: 'p-004',
    author: 'Pedro Martínez',
    rating: 3,
    comment: 'El sonido es bueno pero la batería dura menos de lo esperado.',
    createdAt: '2025-03-20T16:45:00Z'
  },
  {
    id: 'r-005',
    productId: 'p-006',
    author: 'Laura Sánchez',
    rating: 5,
    comment: 'Mantiene el agua fría todo el día, muy recomendable.',
    createdAt: '2025-03-05T11:00:00Z'
  }
]

function loadStoredReviews(): Review[] {
  if (!import.meta.client) {
    return []
  }

  const raw = localStorage.getItem(REVIEWS_STORAGE_KEY)

  if (!raw) {
    return []
  }

  try {
    const parsed = JSON.parse(raw) as unknown[]

    return parsed.filter(isValidReview)
  } catch {
    return []
  }
}

function isValidReview(entry: unknown): entry is Review {
  if (!entry || typeof entry !== 'object') {
    return false
  }

  const review = entry as Record<string, unknown>

  return (
    typeof review.id === 'string' &&
    typeof review.productId === 'string' &&
    typeof review.author === 'string' &&
    typeof review.rating === 'number' &&
    review.rating >= 1 &&
    review.rating <= 5 &&
    typeof review.comment === 'string' &&
    typeof review.createdAt === 'string'
  )
}

function persistReviews(reviews: Review[]) {
  if (!import.meta.client) {
    return
  }

  localStorage.setItem(REVIEWS_STORAGE_KEY, JSON.stringify(reviews))
}

function generateId(): string {
  return `r-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

function buildReviewFromInput(input: ReviewInput): Review {
  return {
    id: generateId(),
    productId: input.productId,
    author: input.author.trim(),
    rating: Math.max(1, Math.min(5, Math.round(input.rating))),
    comment: input.comment.trim(),
    createdAt: new Date().toISOString()
  }
}

export function useReviews() {
  const reviews = useState<Review[]>('reviews.all', () => [...MOCK_REVIEWS])
  const hasHydrated = useState<boolean>('reviews.hydrated', () => false)

  function hydrate() {
    if (!import.meta.client || hasHydrated.value) {
      return
    }

    const stored = loadStoredReviews()

    if (stored.length > 0) {
      const storedIds = new Set(stored.map(r => r.id))
      const merged = [
        ...MOCK_REVIEWS.filter(r => !storedIds.has(r.id)),
        ...stored
      ]
      reviews.value = merged
    }

    hasHydrated.value = true
  }

  function addReview(input: ReviewInput) {
    const review = buildReviewFromInput(input)
    reviews.value = [review, ...reviews.value]
    persistReviews(reviews.value)
    return review
  }

  function getReviewsByProductId(productId: string): Review[] {
    return reviews.value
      .filter(review => review.productId === productId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  }

  function getAverageRating(productId: string): number {
    const productReviews = getReviewsByProductId(productId)

    if (productReviews.length === 0) {
      return 0
    }

    const sum = productReviews.reduce((acc, review) => acc + review.rating, 0)

    return Number((sum / productReviews.length).toFixed(1))
  }

  onMounted(() => {
    hydrate()
  })

  return {
    reviews: readonly(reviews),
    addReview,
    getReviewsByProductId,
    getAverageRating
  }
}
