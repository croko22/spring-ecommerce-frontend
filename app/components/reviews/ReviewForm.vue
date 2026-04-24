<script setup lang="ts">
import { toast } from 'vue-sonner'

interface Props {
  productId: string
}

const props = defineProps<Props>()

const { isAuthenticated, user } = useAuthState()
const { addReview } = useReviews()

const rating = ref(0)
const comment = ref('')
const isSubmitting = ref(false)

const isValid = computed(() => {
  return rating.value >= 1 && rating.value <= 5 && comment.value.trim().length > 0
})

function handleSubmit() {
  if (!isValid.value || !user.value) {
    return
  }

  isSubmitting.value = true

  try {
    addReview({
      productId: props.productId,
      author: user.value.name || user.value.email || 'Usuario anónimo',
      rating: rating.value,
      comment: comment.value.trim()
    })

    toast.success('Reseña publicada exitosamente')
    rating.value = 0
    comment.value = ''
  } catch {
    toast.error('No se pudo publicar la reseña')
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <section class="review-form" aria-label="Formulario de reseña">
    <h3 class="review-form__title">Escribe una reseña</h3>

    <div v-if="!isAuthenticated" class="review-form__guest">
      <p>Inicia sesión para dejar una reseña.</p>
      <NuxtLink to="/auth/login" class="review-form__login-link">
        Iniciar sesión
      </NuxtLink>
    </div>

    <form v-else class="review-form__form" @submit.prevent="handleSubmit">
      <div class="review-form__field">
        <label for="review-rating" class="review-form__label">Calificación</label>
        <StarRating
          id="review-rating"
          v-model="rating"
          :size="28"
        />
        <span v-if="rating > 0" class="review-form__rating-text">
          {{ rating }} estrella{{ rating === 1 ? '' : 's' }}
        </span>
      </div>

      <div class="review-form__field">
        <label for="review-comment" class="review-form__label">Comentario</label>
        <textarea
          id="review-comment"
          v-model="comment"
          class="review-form__textarea"
          rows="4"
          placeholder="Comparte tu experiencia con este producto..."
          required
        />
      </div>

      <button
        type="submit"
        class="review-form__submit"
        :disabled="!isValid || isSubmitting"
      >
        {{ isSubmitting ? 'Publicando...' : 'Publicar reseña' }}
      </button>
    </form>
  </section>
</template>

<style scoped>
.review-form {
  margin-top: 1.5rem;
  padding: 1.25rem;
  border: 1px solid var(--border-soft, #e2e8f0);
  border-radius: 0.75rem;
  background: #fff;
}

.review-form__title {
  margin: 0 0 1rem;
  font-size: 1.1rem;
  font-weight: 700;
}

.review-form__guest {
  color: var(--text-muted, #64748b);
  font-size: 0.92rem;
}

.review-form__guest p {
  margin: 0 0 0.5rem;
}

.review-form__login-link {
  color: var(--accent, #c2410c);
  font-weight: 600;
  text-decoration: none;
}

.review-form__login-link:hover {
  text-decoration: underline;
}

.review-form__form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.review-form__field {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.review-form__label {
  font-size: 0.85rem;
  font-weight: 600;
  color: #334155;
}

.review-form__rating-text {
  font-size: 0.85rem;
  color: var(--text-muted, #64748b);
}

.review-form__textarea {
  border: 1px solid var(--border-soft, #e2e8f0);
  border-radius: 0.5rem;
  padding: 0.65rem 0.75rem;
  font-family: inherit;
  font-size: 0.92rem;
  resize: vertical;
  background: #fff;
  color: inherit;
}

.review-form__textarea:focus {
  outline: none;
  border-color: var(--accent, #c2410c);
  box-shadow: 0 0 0 2px rgba(194, 65, 12, 0.15);
}

.review-form__submit {
  align-self: flex-start;
  border: none;
  border-radius: 0.5rem;
  padding: 0.65rem 1.25rem;
  background: var(--accent, #c2410c);
  color: #fff;
  font-weight: 700;
  font-size: 0.92rem;
  cursor: pointer;
  transition: background-color 0.15s;
}

.review-form__submit:hover:not(:disabled) {
  background: #9a3412;
}

.review-form__submit:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>
