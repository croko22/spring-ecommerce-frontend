<script setup lang="ts">
import { ShoppingBag, Calendar, ChevronRight } from 'lucide-vue-next'

const { orders, isLoading, error, fetchOrders, getOrderById } = useUserOrders()

onMounted(() => {
  fetchOrders()
})

function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('es-PE', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date)
}

function getStatusConfig(status: string) {
  const configs: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
    pending: { label: 'Pendiente', variant: 'secondary' },
    processing: { label: 'Procesando', variant: 'default' },
    confirmed: { label: 'Confirmado', variant: 'default' },
    shipped: { label: 'Enviado', variant: 'outline' },
    delivered: { label: 'Entregado', variant: 'default' },
    cancelled: { label: 'Cancelado', variant: 'destructive' }
  }
  return configs[status] ?? { label: status, variant: 'secondary' }
}

function getOrderSummary(order: typeof orders.value[number]): string {
  const itemCount = order.items.reduce((sum, item) => sum + item.quantity, 0)
  if (itemCount === 1) {
    return order.items[0]?.name ?? '1 item'
  }
  return `${order.items[0]?.name ?? ''} + ${itemCount - 1} mas`
}

useSeoMeta({
  title: 'Mis Ordenes',
  description: 'Revisa el historial y estado de tus pedidos.'
})
</script>

<template>
  <section class="orders-page">
    <header class="orders-page__header">
      <p class="orders-page__eyebrow">Pedidos</p>
      <h1>Mis Ordenes</h1>
      <p class="orders-page__subtitle">Revisa el estado y detalle de tus compras.</p>
    </header>

    <div v-if="isLoading" class="orders-loading">
      <p>Cargando ordenes...</p>
    </div>

    <div v-else-if="error" class="orders-error">
      <p>{{ error }}</p>
      <Button variant="outline" @click="fetchOrders">
        Reintentar
      </Button>
    </div>

    <div v-else-if="orders.length === 0" class="orders-empty">
      <ShoppingBag class="orders-empty__icon" />
      <p class="orders-empty__title">No tienes ordenes aun.</p>
      <p class="orders-empty__text">Cuando hagas una compra, aparecera aqui.</p>
      <NuxtLink class="orders-empty__cta" to="/products">
        Ir al catalogo
      </NuxtLink>
    </div>

    <div v-else class="orders-list">
      <NuxtLink
        v-for="order in orders"
        :key="order.orderId"
        :to="`/orders/${order.orderId}`"
        class="order-card"
      >
        <div class="order-card__header">
          <div class="order-card__meta">
            <span class="order-card__id">{{ order.orderId }}</span>
            <div class="order-card__date">
              <Calendar class="w-3.5 h-3.5" />
              <span>{{ formatDate(order.createdAt) }}</span>
            </div>
          </div>
          <Badge :variant="getStatusConfig(order.status).variant">
            {{ getStatusConfig(order.status).label }}
          </Badge>
        </div>

        <div class="order-card__body">
          <p class="order-card__summary">{{ getOrderSummary(order) }}</p>
        </div>

        <div class="order-card__footer">
          <span class="order-card__total">S/ {{ order.total.toFixed(2) }}</span>
          <span class="order-card__arrow">
            <ChevronRight class="w-4 h-4" />
          </span>
        </div>
      </NuxtLink>
    </div>
  </section>
</template>

<style scoped>
.orders-page {
  max-width: 48rem;
  margin: 0 auto;
  padding: 2rem 1.2rem 3rem;
}

.orders-page__header {
  margin-bottom: 1.5rem;
}

.orders-page__eyebrow {
  margin: 0;
  font-size: 0.8rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--text-muted);
}

.orders-page__header h1 {
  margin: 0.35rem 0 0;
  font-size: clamp(1.45rem, 3.5vw, 2rem);
}

.orders-page__subtitle {
  margin: 0.5rem 0 0;
  color: var(--text-muted);
}

.orders-loading,
.orders-error {
  text-align: center;
  padding: 3rem 1rem;
}

.orders-error {
  color: #dc2626;
}

.orders-empty {
  text-align: center;
  padding: 3rem 1rem;
  border: 1px solid var(--border-soft);
  border-radius: 0.85rem;
  background: #fff;
}

.orders-empty__icon {
  width: 3rem;
  height: 3rem;
  color: var(--text-muted);
  margin-bottom: 1rem;
}

.orders-empty__title {
  margin: 0;
  font-size: 1.1rem;
  font-weight: 700;
}

.orders-empty__text {
  margin: 0.5rem 0 1rem;
  color: var(--text-muted);
}

.orders-empty__cta {
  display: inline-block;
  padding: 0.6rem 0.95rem;
  border-radius: 0.65rem;
  text-decoration: none;
  color: #fff;
  background: #c2410c;
  font-weight: 700;
  transition: background-color 0.15s;
}

.orders-empty__cta:hover {
  background: #9a3412;
}

.orders-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.order-card {
  display: block;
  padding: 1rem 1.25rem;
  border: 1px solid var(--border-soft);
  border-radius: 0.85rem;
  background: #fff;
  text-decoration: none;
  color: inherit;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.order-card:hover {
  border-color: var(--accent);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.order-card__header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
  margin-bottom: 0.75rem;
}

.order-card__meta {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  min-width: 0;
}

.order-card__id {
  font-weight: 700;
  font-size: 0.95rem;
}

.order-card__date {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.85rem;
  color: var(--text-muted);
}

.order-card__body {
  margin-bottom: 0.75rem;
}

.order-card__summary {
  margin: 0;
  font-size: 0.9rem;
  color: var(--text-muted);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.order-card__footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 0.75rem;
  border-top: 1px solid var(--border-soft);
}

.order-card__total {
  font-weight: 700;
  font-size: 1.05rem;
  color: #7c2d12;
}

.order-card__arrow {
  color: var(--text-muted);
}

@media (max-width: 480px) {
  .orders-page {
    padding-inline: 0.85rem;
  }

  .order-card__header {
    flex-direction: column;
    gap: 0.5rem;
  }
}
</style>
