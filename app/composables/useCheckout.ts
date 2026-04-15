import type { ShippingAddress, Order, CreateOrderRequest } from '~/types/order'
import { createOrder } from '~/services/orderService'
import { useCart } from '~/composables/useCart'

export function useCheckout() {
  const currentStep = useState<1 | 2 | 3>('checkout.step', () => 1)
  const shipping = useState<ShippingAddress | null>('checkout.shipping', () => null)
  const paymentMethod = useState<string>('checkout.payment', () => '')
  const isSubmitting = useState<boolean>('checkout.submitting', () => false)
  const lastOrder = useState<Order | null>('checkout.lastOrder', () => null)

  const isShippingValid = computed(() => {
    const addr = shipping.value
    if (!addr) return false
    return Boolean(
      addr.fullName &&
      addr.documentType &&
      addr.documentNumber &&
      addr.address &&
      addr.phone &&
      addr.region
    )
  })

  const isPaymentValid = computed(() => {
    return paymentMethod.value === 'credit_card' || paymentMethod.value === 'cash_on_delivery'
  })

  const canProceedToPayment = computed(() => isShippingValid.value)

  const canSubmit = computed(() => {
    return isShippingValid.value && isPaymentValid.value && currentStep.value === 3
  })

  function setShipping(data: ShippingAddress) {
    shipping.value = data
  }

  function setPaymentMethod(method: string) {
    paymentMethod.value = method
  }

  function nextStep() {
    if (currentStep.value === 1 && isShippingValid.value) {
      currentStep.value = 2
    } else if (currentStep.value === 2 && isPaymentValid.value) {
      currentStep.value = 3
    }
  }

  function prevStep() {
    if (currentStep.value === 2) {
      currentStep.value = 1
    } else if (currentStep.value === 3) {
      currentStep.value = 2
    }
  }

  function goToStep(step: 1 | 2 | 3) {
    // Only allow going back or to current step
    if (step <= currentStep.value) {
      currentStep.value = step
    }
    // Forward navigation only allowed sequentially
    if (step === 2 && currentStep.value === 1 && isShippingValid.value) {
      currentStep.value = 2
    } else if (step === 3 && currentStep.value === 2 && isPaymentValid.value) {
      currentStep.value = 3
    }
  }

  async function submitOrder(): Promise<Order> {
    const { items } = useCart()

    if (!shipping.value || !paymentMethod.value) {
      throw new Error('Missing shipping or payment information')
    }

    isSubmitting.value = true

    try {
      const request: CreateOrderRequest = {
        items: items.value,
        shipping: shipping.value,
        paymentMethod: paymentMethod.value
      }

      const order = await createOrder(request)
      lastOrder.value = order

      // Clear cart after successful order
      const { clearCart } = useCart()
      clearCart()

      return order
    } finally {
      isSubmitting.value = false
    }
  }

  function reset() {
    currentStep.value = 1
    shipping.value = null
    paymentMethod.value = ''
    isSubmitting.value = false
    lastOrder.value = null
  }

  return {
    // State
    currentStep,
    shipping,
    paymentMethod,
    isSubmitting,
    lastOrder,
    // Computed
    isShippingValid,
    isPaymentValid,
    canProceedToPayment,
    canSubmit,
    // Methods
    setShipping,
    setPaymentMethod,
    nextStep,
    prevStep,
    goToStep,
    submitOrder,
    reset
  }
}
