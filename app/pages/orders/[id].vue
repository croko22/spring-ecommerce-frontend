<script setup lang="ts">
import { ArrowLeft, Package, Truck, MapPin, Calendar, CreditCard } from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()
const { orders, isLoading, error, fetchOrders, getOrderById } = useUserOrders()

const orderId = computed(() => String(route.params.id))

onMounted(() => {
  if (orders.value.length === 0) {
    fetchOrders()
  }
})

const order = computed(() => {
  return getOrderById(orderId.value)
})

function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('es-PE', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
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

function getStatusStep(status: string): number {
  const steps: Record<string, number> = {
    pending: 1,
    processing: 2,
    confirmed: 2,
    shipped: 3,
    delivered: 4,
    cancelled: 0
  }
  return steps[status] ?? 0
}

const statusSteps = [
  { label: 'Orden recibida', icon: Package },
  { label: 'Procesando', icon: CreditCard },
  { label: 'Enviado', icon: Truck },
  { label: 'Entregado', icon: MapPin }
]

useSeoMeta({
  title: computed(() => order.value ? `Orden ${order.value.orderId}` : 'Detalle de Orden'),
  description: 'Detalle y seguimiento de tu pedido.'
})
</script>

<template>
  <section class="order-detail-page">
    <button
      type="button"
      class="order-detail__back"
      @click="router.back()"
    >
      <ArrowLeft class="w-4 h-4" />
      <span>Volver a ordenes</span>
    </button>

    <div v-if="isLoading" class="order-detail-loading">
      <p>Cargando orden...</p>
    </div>

    <div v-else-if="error" class="order-detail-error">
      <p>{{ error }}</p>
      <Button variant="outline" @click="fetchOrders">
        Reintentar
      </Button>
    </div>

    <div v-else-if="!order" class="order-detail-not-found">
      <p class="order-detail-not-found__title">Orden no encontrada</p>
      <p class="order-detail-not-found__text">La orden que buscas no existe o no tienes acceso.</p>
      <NuxtLink class="order-detail-not-found__cta" to="/orders">
        Ver mis ordenes
      </NuxtLink>
    </div>

    <div v-else class="order-detail-layout">
      <!-- Order Header -->
      <div class="order-detail-header">
        <div class="order-detail-header__main">
          <h1>{{ order.orderId }}</h1>
          <div class="order-detail-header__meta">
            <div class="order-detail-header__date">
              <Calendar class="w-4 h-4" />
              <span>{{ formatDate(order.createdAt) }}</span>
            </div>
            <Badge :variant="getStatusConfig(order.status).variant">
              {{ getStatusConfig(order.status).label }}
            </Badge>
          </div>
        </div>
      </div>

      <!-- Status Tracker -->
      <Card v-if="order.status !== 'cancelled'" class="order-tracker">
        <CardContent class="order-tracker__content">
          <div class="order-tracker__steps">
            <div
              v-for="(step, index) in statusSteps"
              :key="index"
              class="order-tracker__step"
              :class="{
                'order-tracker__step--completed': getStatusStep(order.status) > index,
                'order-tracker__step--active': getStatusStep(order.status) === index + 1
              }"
            >
              <div class="order-tracker__step-icon">
                <component :is="step.icon" class="w-5 h-5" />
              </div>
              <span class="order-tracker__step-label">{{ step.label }}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div v-else class="order-cancelled-banner">
        <p>Esta orden ha sido cancelada.</p>
      </div>

      <div class="order-detail-grid">
        <!-- Items -->
        <Card class="order-items-card">
          <CardHeader>
            <CardTitle>Productos</CardTitle>
          </CardHeader>
          <CardContent>
            <ul class="order-items">
              <li v-for="item in order.items" :key="item.productId" class="order-item">
                <div class="order-item__info">
                  <span class="order-item__name">{{ item.name }}</span>
                  <span class="order-item__qty">Cantidad: {{ item.quantity }}</span>
                </div>
                <span class="order-item__price">S/ {{ (item.price * item.quantity).toFixed(2) }}</span>
              </li>
            </ul>

            <div class="order-totals">
              <div class="order-totals__row">
                <span>Subtotal</span>
                <span>S/ {{ order.subtotal.toFixed(2) }}</span>
              </div>
              <div class="order-totals__row">
                <span>Envio</span>
                <span>S/ {{ order.shippingCost.toFixed(2) }}</span>
              </div>
              <div class="order-totals__row order-totals__row--total">
                <span>Total</span>
                <span>S/ {{ order.total.toFixed(2) }}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <!-- Shipping -->
        <Card class="order-shipping-card">
          <CardHeader>
            <CardTitle>Informacion de envio</CardTitle>
          </CardHeader>
          <CardContent>
            <div class="shipping-info">
              <div class="shipping-info__row">
                <MapPin class="w-4 h-4" />
                <div class="shipping-info__content">
                  <span class="shipping-info__label">Direccion</span>
                  <span class="shipping-info__value">{{ order.shipping.address }}</span>
                </div>
              </div>

              <div class="shipping-info__row">
                <Truck class="w-4 h-4" />
                <div class="shipping-info__content">
                  <span class="shipping-info__label">Region</span>
                  <span class="shipping-info__value">{{ order.shipping.region }}</span>
                </div>
              </div>

              <div class="shipping-info__row">
                <Package class="w-4 h-4" />
                <div class="shipping-info__content">
                  <span class="shipping-info__label">Destinatario</span>
                  <span class="shipping-info__value">{{ order.shipping.fullName }}</span>
                </div>
              </div>

              <div class="shipping-info__row">
                <Calendar class="w-4 h-4" />
                <div class="shipping-info__content">
                  <span class="shipping-info__label">Documento</span>
                  <span class="shipping-info__value">
                    {{ order.shipping.documentType.toUpperCase() }}: {{ order.shipping.documentNumber }}
                  </span>
                </div>
              </div>

              <div class="shipping-info__row">
                <CreditCard class="w-4 h-4" />
                <div class="shipping-info__content">
                  <span class="shipping-info__label">Telefono</span>
                  <span class="shipping-info__value">{{ order.shipping.phone }}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  </section>
</template>

<style scoped>
.order-detail-page {
  max-width: 64rem;
  margin: 0 auto;
  padding: 1.5rem 1.2rem 3rem;
}

.order-detail__back {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1.25rem;
  padding: 0.4rem 0.75rem;
  border: 1px solid var(--border-soft);
  border-radius: 0.5rem;
  background: #fff;
  color: var(--text-main);
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
}

.order-detail__back:hover {
  background: #f5f5f5;
}

.order-detail-loading,
.order-detail-error,
.order-detail-not-found {
  text-align: center;
  padding: 3rem 1rem;
}

.order-detail-error {
  color: #dc2626;
}

.order-detail-not-found__title {
  margin: 0;
  font-size: 1.1rem;
  font-weight: 700;
}

.order-detail-not-found__text {
  margin: 0.5rem 0 1rem;
  color: var(--text-muted);
}

.order-detail-not-found__cta {
  display: inline-block;
  padding: 0.6rem 0.95rem;
  border-radius: 0.65rem;
  text-decoration: none;
  color: #fff;
  background: #c2410c;
  font-weight: 700;
}

.order-detail-header {
  margin-bottom: 1.5rem;
}

.order-detail-header__main h1 {
  margin: 0 0 0.5rem;
  font-size: clamp(1.35rem, 3vw, 1.75rem);
}

.order-detail-header__meta {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.order-detail-header__date {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.9rem;
  color: var(--text-muted);
}

.order-tracker {
  margin-bottom: 1.5rem;
}

.order-tracker__content {
  padding: 1.25rem;
}

.order-tracker__steps {
  display: flex;
  justify-content: space-between;
  gap: 0.5rem;
}

.order-tracker__step {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  flex: 1;
  text-align: center;
}

.order-tracker__step-icon {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  background: #f5f5f5;
  color: var(--text-muted);
  display: flex;
  align-items: center;
  justify-content: center;
}

.order-tracker__step--completed .order-tracker__step-icon,
.order-tracker__step--active .order-tracker__step-icon {
  background: #dcfce7;
  color: #15803d;
}

.order-tracker__step--active .order-tracker__step-icon {
  box-shadow: 0 0 0 3px rgba(22, 163, 74, 0.2);
}

.order-tracker__step-label {
  font-size: 0.8rem;
  color: var(--text-muted);
}

.order-tracker__step--completed .order-tracker__step-label,
.order-tracker__step--active .order-tracker__step-label {
  color: var(--text-main);
  font-weight: 600;
}

.order-cancelled-banner {
  margin-bottom: 1.5rem;
  padding: 1rem 1.25rem;
  border-radius: 0.65rem;
  background: #fef2f2;
  border: 1px solid #fecaca;
  color: #991b1b;
  font-weight: 600;
  text-align: center;
}

.order-detail-grid {
  display: grid;
  grid-template-columns: minmax(0, 1.5fr) minmax(0, 1fr);
  gap: 1.5rem;
  align-items: start;
}

.order-items {
  list-style: none;
  margin: 0;
  padding: 0;
}

.order-item {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
  padding: 0.75rem 0;
  border-bottom: 1px solid var(--border-soft);
}

.order-item:last-child {
  border-bottom: none;
}

.order-item__info {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
  min-width: 0;
}

.order-item__name {
  font-weight: 600;
  word-break: break-word;
}

.order-item__qty {
  font-size: 0.85rem;
  color: var(--text-muted);
}

.order-item__price {
  font-weight: 700;
  white-space: nowrap;
}

.order-totals {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 2px solid var(--border-soft);
}

.order-totals__row {
  display: flex;
  justify-content: space-between;
  padding: 0.4rem 0;
}

.order-totals__row--total {
  font-size: 1.1rem;
  font-weight: 700;
  color: #7c2d12;
  padding-top: 0.75rem;
  margin-top: 0.5rem;
  border-top: 1px solid var(--border-soft);
}

.shipping-info {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.shipping-info__row {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  color: var(--text-muted);
}

.shipping-info__content {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
  min-width: 0;
}

.shipping-info__label {
  font-size: 0.8rem;
}

.shipping-info__value {
  font-weight: 600;
  color: var(--text-main);
  word-break: break-word;
}

@media (max-width: 768px) {
  .order-detail-grid {
    grid-template-columns: 1fr;
  }

  .order-tracker__steps {
    gap: 0.25rem;
  }

  .order-tracker__step-label {
    font-size: 0.7rem;
  }
}

@media (max-width: 480px) {
  .order-detail-page {
    padding-inline: 0.85rem;
  }

  .order-detail-header__meta {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
