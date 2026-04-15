<script setup lang="ts">
import { formatPenAmount } from '~/utils/currency'

const route = useRoute()
const orderId = computed(() => route.query.orderId as string)

// Try to get order from checkout state
const { lastOrder } = useCheckout()

const order = computed(() => {
  if (lastOrder.value && lastOrder.value.orderId === orderId.value) {
    return lastOrder.value
  }
  return null
})

const hasError = computed(() => !order.value && orderId.value)

useSeoMeta({
  title: 'Pedido confirmado',
  description: 'Tu pedido ha sido procesado exitosamente'
})
</script>

<template>
  <section class="confirmation-page">
    <div class="confirmation-card">
      <!-- Success state -->
      <template v-if="order">
        <div class="confirmation-icon">✅</div>
        <h1 class="confirmation-title">Pedido confirmado</h1>
        <p class="confirmation-subtitle">Gracias por tu compra</p>

        <div class="order-info">
          <div class="order-info__row">
            <span class="order-info__label">Numero de pedido:</span>
            <span class="order-info__value">{{ order.orderId }}</span>
          </div>

          <div class="order-info__row">
            <span class="order-info__label">Estado:</span>
            <span class="order-info__value order-info__value--status">
              {{ order.status === 'confirmed' ? 'Confirmado' : 'Pendiente' }}
            </span>
          </div>

          <div class="order-info__row">
            <span class="order-info__label">Total:</span>
            <span class="order-info__value order-info__value--total">
              {{ formatPenAmount(order.total) }}
            </span>
          </div>

          <div class="order-info__row">
            <span class="order-info__label">Items:</span>
            <span class="order-info__value">{{ order.items.length }} productos</span>
          </div>
        </div>

        <p class="confirmation-message">
          Recibiras un correo de confirmacion cuando tu pedido sea procesado.
        </p>
      </template>

      <!-- Error state -->
      <template v-else-if="hasError">
        <div class="confirmation-icon confirmation-icon--error">❌</div>
        <h1 class="confirmation-title">Algo salio mal</h1>
        <p class="confirmation-subtitle">No pudimos encontrar tu pedido</p>
        <p class="confirmation-message">
          Por favor verifica el numero de pedido o contacta con soporte.
        </p>
      </template>

      <!-- No order state -->
      <template v-else>
        <div class="confirmation-icon confirmation-icon--error">❌</div>
        <h1 class="confirmation-title">Sin pedido</h1>
        <p class="confirmation-message">
          No tienes ningun pedido reciente.
        </p>
      </template>

      <NuxtLink to="/products" class="confirmation-cta">
        Continuar comprando
      </NuxtLink>
    </div>
  </section>
</template>

<style scoped>
.confirmation-page {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 60vh;
  padding: 2rem 1rem;
}

.confirmation-card {
  max-width: 28rem;
  width: 100%;
  background: #fff;
  border: 1px solid var(--border-soft);
  border-radius: 1rem;
  padding: 2rem;
  text-align: center;
}

.confirmation-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.confirmation-icon--error {
  filter: grayscale(1);
}

.confirmation-title {
  margin: 0;
  font-size: 1.5rem;
}

.confirmation-subtitle {
  margin: 0.5rem 0 1.5rem;
  color: var(--text-muted);
}

.order-info {
  background: #fafafa;
  border-radius: 0.65rem;
  padding: 1rem;
  margin-bottom: 1.5rem;
  text-align: left;
}

.order-info__row {
  display: flex;
  justify-content: space-between;
  padding: 0.4rem 0;
  border-bottom: 1px solid var(--border-soft);
}

.order-info__row:last-child {
  border-bottom: none;
}

.order-info__label {
  color: var(--text-muted);
  font-size: 0.9rem;
}

.order-info__value {
  font-weight: 600;
}

.order-info__value--status {
  color: #2e7d32;
}

.order-info__value--total {
  color: #7c2d12;
  font-size: 1.1rem;
}

.confirmation-message {
  margin: 0 0 1.5rem;
  color: var(--text-muted);
  font-size: 0.95rem;
}

.confirmation-cta {
  display: inline-block;
  padding: 0.75rem 1.5rem;
  border-radius: 0.65rem;
  text-decoration: none;
  color: #fff;
  background: linear-gradient(125deg, var(--accent), var(--accent-strong));
  font-weight: 700;
  transition: opacity 0.2s;
}

.confirmation-cta:hover {
  opacity: 0.95;
}
</style>