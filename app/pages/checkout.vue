<script setup lang="ts">
import { formatPenAmount } from '~/utils/currency'
import type { ShippingAddress, OrderItem } from '~/types/order'

const { items: cartItems } = useCart()
const {
  currentStep,
  shipping,
  paymentMethod,
  isSubmitting,
  lastOrder,
  isShippingValid,
  isPaymentValid,
  canProceedToPayment,
  canSubmit,
  setShipping,
  setPaymentMethod,
  nextStep,
  prevStep,
  goToStep,
  submitOrder,
  reset
} = useCheckout()

// Local form state for shipping
const formData = reactive<ShippingAddress>({
  fullName: '',
  documentType: 'dni',
  documentNumber: '',
  address: '',
  phone: '',
  region: ''
})

// Initialize form with existing shipping data if present
watchEffect(() => {
  if (shipping.value) {
    formData.fullName = shipping.value.fullName || ''
    formData.documentType = shipping.value.documentType || 'dni'
    formData.documentNumber = shipping.value.documentNumber || ''
    formData.address = shipping.value.address || ''
    formData.phone = shipping.value.phone || ''
    formData.region = shipping.value.region || ''
  }
})

// Validation errors
const errors = reactive({
  fullName: '',
  documentNumber: '',
  address: '',
  phone: '',
  region: ''
})

function validateShipping(): boolean {
  let isValid = true

  // Reset errors
  errors.fullName = ''
  errors.documentNumber = ''
  errors.address = ''
  errors.phone = ''
  errors.region = ''

  if (!formData.fullName.trim()) {
    errors.fullName = 'El nombre es requerido'
    isValid = false
  }

  if (!formData.documentNumber.trim()) {
    errors.documentNumber = 'El numero de documento es requerido'
    isValid = false
  } else {
    // Document type validation
    if (formData.documentType === 'dni' && !/^\d{8}$/.test(formData.documentNumber)) {
      errors.documentNumber = 'DNI debe tener 8 digitos'
      isValid = false
    }
    if (formData.documentType === 'ruc' && !/^\d{11}$/.test(formData.documentNumber)) {
      errors.documentNumber = 'RUC debe tener 11 digitos'
      isValid = false
    }
  }

  if (!formData.address.trim()) {
    errors.address = 'La direccion es requerida'
    isValid = false
  }

  if (!formData.phone.trim()) {
    errors.phone = 'El telefono es requerido'
    isValid = false
  } else if (!/^(\+51|51)?[9]\d{8}$/.test(formData.phone.replace(/\s/g, ''))) {
    errors.phone = 'Ingrese un numero de telefono valido (9 digitos)'
    isValid = false
  }

  if (!formData.region.trim()) {
    errors.region = 'La region es requerida'
    isValid = false
  }

  return isValid
}

function handleShippingSubmit() {
  if (!validateShipping()) {
    return
  }

  setShipping({ ...formData })
  nextStep()
}

function handlePaymentSelect(method: string) {
  setPaymentMethod(method)
  nextStep()
}

async function handlePlaceOrder() {
  try {
    const order = await submitOrder()
    // Navigate to confirmation page
    navigateTo({
      path: '/order-confirmation',
      query: { orderId: order.orderId }
    })
  } catch (error) {
    console.error('Failed to place order:', error)
    alert('Error al procesar el pedido. Por favor intenta de nuevo.')
  }
}

// Computed values for order summary
const SHIPPING_COST = 10

const subtotal = computed(() => {
  return cartItems.value.reduce((sum, item) => sum + item.price * item.quantity, 0)
})

const total = computed(() => subtotal.value + SHIPPING_COST)

function formatAmount(amount: number) {
  return formatPenAmount(amount)
}

// Regions for dropdown
const regions = [
  'Amazonas', 'Ancash', 'Apurimac', 'Arequipa', 'Ayacucho',
  'Cajamarca', 'Callao', 'Cusco', 'Huancavelica', 'Huánuco',
  'Ica', 'Junín', 'La Libertad', 'Lambayeque', 'Lima',
  'Loreto', 'Madre de Dios', 'Moquegua', 'Pasco', 'Piura',
  'Puno', 'San Martín', 'Tacna', 'Tumbes', 'Ucayali'
]

// Step labels
const stepLabels = ['Envio', 'Pago', 'Revision']
const stepIcons = ['1', '2', '3']

// Check if cart is empty
const isCartEmpty = computed(() => cartItems.value.length === 0)

useSeoMeta({
  title: 'Checkout',
  description: 'Completa tu compra'
})
</script>

<template>
  <section class="checkout-page">
    <header class="checkout-page__header">
      <p class="checkout-page__eyebrow">Checkout</p>
      <h1>Finalizar compra</h1>
    </header>

    <!-- Empty cart message -->
    <div v-if="isCartEmpty" class="checkout-empty">
      <p class="checkout-empty__title">Tu carrito esta vacio.</p>
      <p class="checkout-empty__text">Agrega productos para continuar con el checkout.</p>
      <NuxtLink class="checkout-empty__cta" to="/products">Ir al catalogo</NuxtLink>
    </div>

    <!-- Checkout steps -->
    <div v-else class="checkout-layout">
      <!-- Step indicator -->
      <nav class="steps" aria-label="Pasos del checkout">
        <ol class="steps__list">
          <li
            v-for="(label, index) in stepLabels"
            :key="index"
            class="steps__item"
            :class="{
              'steps__item--active': currentStep === index + 1,
              'steps__item--completed': currentStep > index + 1
            }"
          >
            <button
              type="button"
              class="steps__button"
              :disabled="index + 1 > currentStep"
              @click="goToStep((index + 1) as 1 | 2 | 3)"
            >
              <span class="steps__icon">{{ stepIcons[index] }}</span>
              <span class="steps__label">{{ label }}</span>
            </button>
          </li>
        </ol>
      </nav>

      <!-- Step 1: Shipping -->
      <div v-if="currentStep === 1" class="step-content">
        <h2 class="step-title">Informacion de envio</h2>

        <form class="checkout-form" @submit.prevent="handleShippingSubmit">
          <div class="form-group">
            <label class="form-label" for="fullName">Nombre completo</label>
            <input
              id="fullName"
              v-model="formData.fullName"
              type="text"
              class="form-input"
              :class="{ 'form-input--error': errors.fullName }"
              placeholder="Juan Perez"
            >
            <span v-if="errors.fullName" class="form-error">{{ errors.fullName }}</span>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label class="form-label" for="documentType">Tipo de documento</label>
              <select
                id="documentType"
                v-model="formData.documentType"
                class="form-select"
              >
                <option value="dni">DNI</option>
                <option value="ruc">RUC</option>
              </select>
            </div>

            <div class="form-group">
              <label class="form-label" for="documentNumber">Numero de documento</label>
              <input
                id="documentNumber"
                v-model="formData.documentNumber"
                type="text"
                class="form-input"
                :class="{ 'form-input--error': errors.documentNumber }"
                :placeholder="formData.documentType === 'dni' ? '12345678' : '12345678901'"
                maxlength="11"
              >
              <span v-if="errors.documentNumber" class="form-error">{{ errors.documentNumber }}</span>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label" for="address">Direccion</label>
            <input
              id="address"
              v-model="formData.address"
              type="text"
              class="form-input"
              :class="{ 'form-input--error': errors.address }"
              placeholder="Av. Example 123, Lima"
            >
            <span v-if="errors.address" class="form-error">{{ errors.address }}</span>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label class="form-label" for="phone">Telefono</label>
              <input
                id="phone"
                v-model="formData.phone"
                type="tel"
                class="form-input"
                :class="{ 'form-input--error': errors.phone }"
                placeholder="987654321"
              >
              <span v-if="errors.phone" class="form-error">{{ errors.phone }}</span>
            </div>

            <div class="form-group">
              <label class="form-label" for="region">Region</label>
              <select
                id="region"
                v-model="formData.region"
                class="form-select"
                :class="{ 'form-select--error': errors.region }"
              >
                <option value="">Selecciona una region</option>
                <option v-for="region in regions" :key="region" :value="region">
                  {{ region }}
                </option>
              </select>
              <span v-if="errors.region" class="form-error">{{ errors.region }}</span>
            </div>
          </div>

          <button type="submit" class="btn-primary">
            Continuar al pago
          </button>
        </form>
      </div>

      <!-- Step 2: Payment -->
      <div v-if="currentStep === 2" class="step-content">
        <h2 class="step-title">Metodo de pago</h2>

        <div class="payment-methods">
          <button
            type="button"
            class="payment-option"
            :class="{ 'payment-option--selected': paymentMethod === 'credit_card' }"
            @click="handlePaymentSelect('credit_card')"
          >
            <span class="payment-option__icon">💳</span>
            <div class="payment-option__content">
              <span class="payment-option__title">Tarjeta de credito</span>
              <span class="payment-option__desc">Paga con Visa, Mastercard u otras</span>
            </div>
          </button>

          <button
            type="button"
            class="payment-option"
            :class="{ 'payment-option--selected': paymentMethod === 'cash_on_delivery' }"
            @click="handlePaymentSelect('cash_on_delivery')"
          >
            <span class="payment-option__icon">💵</span>
            <div class="payment-option__content">
              <span class="payment-option__title">Contra entrega</span>
              <span class="payment-option__desc">Paga cuando recibas tu pedido</span>
            </div>
          </button>
        </div>

        <button type="button" class="btn-secondary" @click="prevStep">
          Volver a envio
        </button>
      </div>

      <!-- Step 3: Review -->
      <div v-if="currentStep === 3" class="step-content">
        <h2 class="step-title">Resumen del pedido</h2>

        <!-- Order items -->
        <div class="review-section">
          <h3 class="review-section__title">Productos</h3>
          <ul class="review-items">
            <li v-for="item in cartItems" :key="item.productId" class="review-item">
              <span class="review-item__name">{{ item.name }} x{{ item.quantity }}</span>
              <span class="review-item__price">{{ formatAmount(item.price * item.quantity) }}</span>
            </li>
          </ul>
        </div>

        <!-- Shipping info -->
        <div class="review-section">
          <h3 class="review-section__title">Envio</h3>
          <div class="review-summary">
            <p class="review-summary__line">{{ shipping?.fullName }}</p>
            <p class="review-summary__line">{{ shipping?.address }}</p>
            <p class="review-summary__line">{{ shipping?.region }}</p>
            <p class="review-summary__line">{{ shipping?.phone }}</p>
          </div>
        </div>

        <!-- Payment method -->
        <div class="review-section">
          <h3 class="review-section__title">Pago</h3>
          <p class="review-summary__line">
            {{ paymentMethod === 'credit_card' ? 'Tarjeta de credito' : 'Contra entrega' }}
          </p>
        </div>

        <!-- Totals -->
        <div class="review-totals">
          <div class="review-totals__row">
            <span>Subtotal</span>
            <span>{{ formatAmount(subtotal) }}</span>
          </div>
          <div class="review-totals__row">
            <span>Envio</span>
            <span>{{ formatAmount(SHIPPING_COST) }}</span>
          </div>
          <div class="review-totals__row review-totals__row--total">
            <span>Total</span>
            <span>{{ formatAmount(total) }}</span>
          </div>
        </div>

        <!-- Actions -->
        <div class="review-actions">
          <button type="button" class="btn-secondary" @click="prevStep">
            Volver al pago
          </button>
          <button
            type="button"
            class="btn-primary btn-primary--full"
            :disabled="isSubmitting"
            @click="handlePlaceOrder"
          >
            {{ isSubmitting ? 'Procesando...' : 'Confirmar pedido' }}
          </button>
        </div>
      </div>

      <!-- Order Summary Sidebar -->
      <aside class="checkout-summary">
        <h2 class="checkout-summary__title">Resumen</h2>

        <ul class="checkout-summary__items">
          <li v-for="item in cartItems" :key="item.productId" class="checkout-summary__item">
            <span class="checkout-summary__name">{{ item.name }} x{{ item.quantity }}</span>
            <span class="checkout-summary__price">{{ formatAmount(item.price * item.quantity) }}</span>
          </li>
        </ul>

        <div class="checkout-summary__totals">
          <div class="checkout-summary__row">
            <span>Subtotal</span>
            <span>{{ formatAmount(subtotal) }}</span>
          </div>
          <div class="checkout-summary__row">
            <span>Envio</span>
            <span>{{ formatAmount(SHIPPING_COST) }}</span>
          </div>
          <div class="checkout-summary__row checkout-summary__row--total">
            <span>Total</span>
            <span>{{ formatAmount(total) }}</span>
          </div>
        </div>
      </aside>
    </div>
  </section>
</template>

<style scoped>
.checkout-page {
  max-width: 75rem;
  margin: 0 auto;
  padding: 2rem 1.2rem 3rem;
}

.checkout-page__header {
  margin-bottom: 1.5rem;
}

.checkout-page__eyebrow {
  margin: 0;
  font-size: 0.8rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--text-muted);
}

.checkout-page__header h1 {
  margin: 0.25rem 0 0;
  font-size: clamp(1.45rem, 3.5vw, 2rem);
}

/* Empty state */
.checkout-empty {
  margin-top: 1rem;
  border: 1px solid var(--border-soft);
  background: #fff;
  border-radius: 0.85rem;
  padding: 2rem;
  text-align: center;
}

.checkout-empty__title {
  margin: 0;
  font-size: 1.1rem;
  font-weight: 700;
}

.checkout-empty__text {
  margin: 0.5rem 0 1rem;
  color: var(--text-muted);
}

.checkout-empty__cta {
  display: inline-block;
  padding: 0.6rem 0.95rem;
  border-radius: 0.65rem;
  text-decoration: none;
  color: #fff;
  background: #c2410c;
  font-weight: 700;
  transition: background-color 0.15s;
}

.checkout-empty__cta:hover {
  background: #9a3412;
}

/* Layout */
.checkout-layout {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(16rem, 1fr);
  gap: 1.5rem;
  align-items: start;
}

/* Steps indicator */
.steps {
  grid-column: 1 / -1;
  margin-bottom: 1rem;
}

.steps__list {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  list-style: none;
  margin: 0;
  padding: 0;
}

.steps__item {
  display: flex;
}

.steps__button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border: 1px solid var(--border-soft);
  background: #fff;
  border-radius: 999px;
  cursor: pointer;
  transition: all 0.2s;
}

.steps__button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.steps__item--active .steps__button {
  border-color: #c2410c;
  background: #c2410c;
  color: #fff;
}

.steps__item--completed .steps__button {
  background: #dcfce7;
  border-color: #22c55e;
  color: #15803d;
}

.steps__icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1.5rem;
  height: 1.5rem;
  border-radius: 50%;
  background: #f5f5f5;
  font-size: 0.8rem;
  font-weight: 700;
}

.steps__item--active .steps__icon {
  background: rgba(255, 255, 255, 0.2);
}

.steps__item--completed .steps__icon {
  background: #4caf50;
  color: #fff;
}

.steps__label {
  font-size: 0.9rem;
  font-weight: 600;
}

/* Step content */
.step-content {
  background: #fff;
  border: 1px solid var(--border-soft);
  border-radius: 0.85rem;
  padding: 1.5rem;
}

.step-title {
  margin: 0 0 1.25rem;
  font-size: 1.15rem;
}

/* Form */
.checkout-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.form-label {
  font-size: 0.9rem;
  font-weight: 600;
}

.form-input,
.form-select {
  padding: 0.65rem 0.85rem;
  border: 1px solid var(--border-soft);
  border-radius: 0.5rem;
  font-size: 0.95rem;
  transition: border-color 0.2s;
}

.form-input:focus,
.form-select:focus {
  outline: none;
  border-color: var(--accent);
}

.form-input--error,
.form-select--error {
  border-color: #dc2626;
}

.form-error {
  font-size: 0.8rem;
  color: #dc2626;
}

/* Buttons */
.btn-primary {
  margin-top: 0.5rem;
  padding: 0.75rem 1rem;
  border: none;
  border-radius: 0.65rem;
  background: #c2410c;
  color: #fff;
  font-weight: 700;
  cursor: pointer;
  transition: background-color 0.15s;
}

.btn-primary:hover {
  background: #9a3412;
}

.btn-primary:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.btn-primary--full {
  width: 100%;
}

.btn-secondary {
  margin-top: 1rem;
  padding: 0.75rem 1rem;
  border: 1px solid var(--border-soft);
  border-radius: 0.65rem;
  background: #fff;
  color: var(--text);
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-secondary:hover {
  background: #f5f5f5;
}

/* Payment methods */
.payment-methods {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.payment-option {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  border: 1px solid var(--border-soft);
  border-radius: 0.65rem;
  background: #fff;
  cursor: pointer;
  text-align: left;
  transition: all 0.2s;
}

.payment-option:hover {
  border-color: var(--accent);
}

.payment-option--selected {
  border-color: var(--accent);
  background: #fffbeb;
}

.payment-option__icon {
  font-size: 1.5rem;
}

.payment-option__title {
  display: block;
  font-weight: 700;
}

.payment-option__desc {
  display: block;
  font-size: 0.85rem;
  color: var(--text-muted);
}

/* Review section */
.review-section {
  margin-bottom: 1.25rem;
  padding-bottom: 1.25rem;
  border-bottom: 1px solid var(--border-soft);
}

.review-section__title {
  margin: 0 0 0.75rem;
  font-size: 0.9rem;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.review-items {
  list-style: none;
  margin: 0;
  padding: 0;
}

.review-item {
  display: flex;
  justify-content: space-between;
  padding: 0.4rem 0;
}

.review-item__name {
  color: var(--text);
}

.review-item__price {
  font-weight: 600;
}

.review-summary__line {
  margin: 0.2rem 0;
  font-size: 0.95rem;
}

.review-totals {
  padding: 1rem 0;
  border-top: 2px solid var(--border-soft);
}

.review-totals__row {
  display: flex;
  justify-content: space-between;
  padding: 0.4rem 0;
}

.review-totals__row--total {
  font-size: 1.1rem;
  font-weight: 700;
  color: #0f172a;
  padding-top: 0.75rem;
  margin-top: 0.5rem;
  border-top: 1px solid var(--border-soft);
}

.review-actions {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

/* Summary sidebar */
.checkout-summary {
  position: sticky;
  top: 1rem;
  border: 1px solid var(--border-soft);
  border-radius: 0.85rem;
  background: #fff;
  padding: 1rem;
}

.checkout-summary__title {
  margin: 0 0 0.75rem;
  font-size: 1rem;
}

.checkout-summary__items {
  list-style: none;
  margin: 0;
  padding: 0;
  border-bottom: 1px solid var(--border-soft);
  padding-bottom: 0.75rem;
}

.checkout-summary__item {
  display: flex;
  justify-content: space-between;
  padding: 0.35rem 0;
  font-size: 0.9rem;
}

.checkout-summary__name {
  color: var(--text-muted);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 10rem;
}

.checkout-summary__price {
  font-weight: 600;
}

.checkout-summary__totals {
  padding-top: 0.75rem;
}

.checkout-summary__row {
  display: flex;
  justify-content: space-between;
  padding: 0.35rem 0;
}

.checkout-summary__row--total {
  font-weight: 700;
  color: #7c2d12;
  font-size: 1.05rem;
  padding-top: 0.5rem;
  border-top: 1px solid var(--border-soft);
}

/* Responsive */
@media (max-width: 860px) {
  .checkout-layout {
    grid-template-columns: 1fr;
  }

  .steps__label {
    display: none;
  }
}

@media (max-width: 480px) {
  .form-row {
    grid-template-columns: 1fr;
  }

  .checkout-page {
    padding-inline: 0.85rem;
  }
}
</style>