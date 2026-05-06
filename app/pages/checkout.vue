<script setup lang="ts">
import { formatPenAmount } from '~/utils/currency'
import { IGV_RATE, calculateIgv } from '~/utils/pricing'
import { getShippingOption, type ShippingMethod, type ShippingOption } from '~/types/order'
import type { ShippingAddress, CreditCardPayment } from '~/types/order'
import type { CartItem } from '~/utils/cart'
import CheckoutStepper from '~/components/checkout/CheckoutStepper.vue'
import ShippingForm from '~/components/checkout/ShippingForm.vue'
import PaymentForm from '~/components/checkout/PaymentForm.vue'
import OrderReview from '~/components/checkout/OrderReview.vue'

const { items: cartItems } = useCart()
const {
  currentStep,
  shipping,
  paymentMethod,
  creditCard,
  isSubmitting,
  lastOrder,
  isShippingValid,
  isPaymentValid,
  canSubmit,
  setShipping,
  setPaymentMethod,
  setCreditCard,
  nextStep,
  prevStep,
  goToStep,
  submitOrder,
  reset
} = useCheckout()

// Shipping method selection
const selectedShippingMethod = useState<ShippingMethod>('checkout.shippingMethod', () => 'standard')
const shippingOptions: ShippingOption[] = [
  { id: 'standard', name: 'Envío estándar', description: 'Entrega en 3-5 días hábiles', cost: 10, eta: '3-5 días' },
  { id: 'express', name: 'Envío exprés', description: 'Entrega en 24 horas', cost: 25, eta: '24 horas' },
  { id: 'pickup', name: 'Recojo en tienda', description: 'Recoge en nuestro local', cost: 0, eta: 'Hoy' }
]

const selectedShippingOption = computed(() => 
  shippingOptions.find(o => o.id === selectedShippingMethod.value) ?? shippingOptions[0]
)

const shippingData = ref<ShippingAddress>({
  fullName: shipping.value?.fullName || '',
  documentType: shipping.value?.documentType || 'dni',
  documentNumber: shipping.value?.documentNumber || '',
  address: shipping.value?.address || '',
  phone: shipping.value?.phone || '',
  region: shipping.value?.region || ''
})

watch(shipping, (val) => {
  if (val) {
    shippingData.value = { ...val }
  }
})

const localPaymentMethod = ref(paymentMethod.value || '')
const localCreditCard = ref<CreditCardPayment | null>(creditCard.value)

watch(paymentMethod, (val) => {
  localPaymentMethod.value = val
})

watch(creditCard, (val) => {
  localCreditCard.value = val
})

function handleShippingUpdate(data: ShippingAddress) {
  shippingData.value = data
}

function handleShippingSubmit() {
  setShipping({ ...shippingData.value })
  nextStep()
}

function handlePaymentMethodUpdate(method: string) {
  localPaymentMethod.value = method
  setPaymentMethod(method)
}

function handleCreditCardUpdate(card: CreditCardPayment | null) {
  localCreditCard.value = card
  if (card) {
    setCreditCard(card)
  } else {
    creditCard.value = null
  }
}

function handlePaymentSubmit() {
  nextStep()
}

function handleReviewBack() {
  prevStep()
}

async function handlePlaceOrder() {
  try {
    const order = await submitOrder()
    navigateTo({
      path: '/order-confirmation',
      query: { orderId: order.orderId }
    })
  } catch (error) {
    console.error('Failed to place order:', error)
    alert('Error al procesar el pedido. Por favor intenta de nuevo.')
  }
}

const subtotal = computed(() => {
  return cartItems.value.reduce((sum, item) => sum + item.price * item.quantity, 0)
})

const igv = computed(() => calculateIgv(subtotal.value))
const shippingCost = computed(() => selectedShippingOption.value?.cost ?? 10)
const discountAmount = computed(() => 0)
const total = computed(() => {
  return Math.round((subtotal.value + igv.value + shippingCost.value - discountAmount.value) * 100) / 100
})

const isCartEmpty = computed(() => cartItems.value.length === 0)

useSeoMeta({
  title: 'Checkout',
  description: 'Completa tu compra'
})
</script>

<template>
  <section class="max-w-6xl mx-auto px-4 sm:px-5 py-8 pb-12">
    <header class="mb-6">
      <p class="m-0 text-xs tracking-wider uppercase text-muted-foreground">Checkout</p>
      <h1 class="mt-1 text-2xl sm:text-3xl font-bold">Finalizar compra</h1>
    </header>

    <div v-if="isCartEmpty" class="mt-4 border border-border rounded-xl bg-background p-8 text-center">
      <p class="m-0 text-base font-bold">Tu carrito esta vacio.</p>
      <p class="my-2 text-muted-foreground">Agrega productos para continuar con el checkout.</p>
      <NuxtLink
        to="/products"
        class="inline-block px-4 py-2.5 rounded-xl bg-primary text-white font-bold no-underline hover:opacity-90 transition-opacity"
      >
        Ir al catalogo
      </NuxtLink>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-[1fr_minmax(16rem,1fr)] gap-6 items-start">
      <div class="md:col-span-2">
        <CheckoutStepper :current-step="currentStep" @go-to-step="goToStep" />
      </div>

      <div v-if="currentStep === 1" class="border border-border rounded-xl bg-background p-6">
        <h2 class="text-lg font-semibold m-0 mb-5">Informacion de envio</h2>
        <ShippingForm
          v-model="shippingData"
          @submit="handleShippingSubmit"
        />
      </div>

      <div v-if="currentStep === 2" class="border border-border rounded-xl bg-background p-6">
        <PaymentForm
          :payment-method="paymentMethod"
          :credit-card="creditCard"
          @update:payment-method="handlePaymentMethodUpdate"
          @update:credit-card="handleCreditCardUpdate"
          @submit="handlePaymentSubmit"
        />
      </div>

      <div v-if="currentStep === 3" class="border border-border rounded-xl bg-background p-6">
        <OrderReview
          :items="cartItems"
          :shipping="shipping!"
          :payment-method="paymentMethod"
          :credit-card="creditCard"
          :subtotal="subtotal"
          :igv="igv"
          :shipping-cost="shippingCost"
          :discount-amount="discountAmount"
          :total="total"
          @submit="handlePlaceOrder"
        />
      </div>

      <aside class="sticky top-4 border border-border rounded-xl bg-background p-4">
        <h2 class="text-base font-semibold m-0 mb-3">Resumen</h2>
        <ul class="list-none m-0 p-0 pb-3 border-b border-border">
          <li
            v-for="item in cartItems"
            :key="item.productId"
            class="flex justify-between py-1.5 text-sm"
          >
            <span class="text-muted-foreground overflow-hidden text-ellipsis whitespace-nowrap max-w-[10rem]">
              {{ item.name }} x{{ item.quantity }}
            </span>
            <span class="font-semibold">{{ formatPenAmount(item.price * item.quantity) }}</span>
          </li>
        </ul>
        <div class="pt-3">
          <div class="flex justify-between py-1.5 text-sm">
            <span>Subtotal</span>
            <span>{{ formatPenAmount(subtotal) }}</span>
          </div>
          <div class="flex justify-between py-1.5 text-sm">
            <span>IGV (18%)</span>
            <span>{{ formatPenAmount(igv) }}</span>
          </div>
          <div class="flex justify-between py-1.5 text-sm">
            <span>Envio</span>
            <span>{{ formatPenAmount(shippingCost) }}</span>
          </div>
          <div v-if="discountAmount > 0" class="flex justify-between py-1.5 text-sm text-green-600">
            <span>Descuento</span>
            <span>-{{ formatPenAmount(discountAmount) }}</span>
          </div>
          <div class="flex justify-between pt-2 mt-2 border-t border-border font-bold text-primary">
            <span>Total</span>
            <span>{{ formatPenAmount(total) }}</span>
          </div>
        </div>
      </aside>
    </div>
  </section>
</template>
