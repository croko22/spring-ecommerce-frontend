import type { ShippingAddress, Order, CreateOrderRequest, CreditCardPayment } from '~/types/order'
import { createOrder } from '~/services/orderService'
import { useCart } from '~/composables/useCart'

function luhnCheck(num: string): boolean {
  const digits = num.replace(/\s/g, '')
  if (!/^\d{16}$/.test(digits)) return false
  let sum = 0
  for (let i = 0; i < digits.length; i++) {
    let d = parseInt(digits[i] ?? '0', 10)
    if ((digits.length - i) % 2 === 0) {
      d *= 2
      if (d > 9) d -= 9
    }
    sum += d
  }
  return sum % 10 === 0
}

function isValidExpiry(expiry: string): boolean {
  const match = expiry.match(/^(\d{2})\/(\d{2})$/)
  if (!match) return false
  const month = parseInt(match[1] ?? '0', 10)
  const year = parseInt('20' + (match[2] ?? '0'), 10)
  const now = new Date()
  if (month < 1 || month > 12) return false
  if (year < now.getFullYear() || (year === now.getFullYear() && month < now.getMonth() + 1)) return false
  return true
}

function isValidCreditCard(card: CreditCardPayment | null): boolean {
  if (!card) return false
  const rawNumber = card.cardNumber.replace(/\s/g, '')
  if (!luhnCheck(rawNumber)) return false
  if (!isValidExpiry(card.expiryDate)) return false
  if (!/^\d{3}$/.test(card.cvv)) return false
  if (!card.cardholderName.trim()) return false
  return true
}

export function useCheckout() {
  const currentStep = useState<1 | 2 | 3>('checkout.step', () => 1)
  const shipping = useState<ShippingAddress | null>('checkout.shipping', () => null)
  const paymentMethod = useState<string>('checkout.payment', () => '')
  const creditCard = useState<CreditCardPayment | null>('checkout.credit-card', () => null)
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
    if (paymentMethod.value === 'credit_card') {
      return isValidCreditCard(creditCard.value)
    }
    return paymentMethod.value === 'cash_on_delivery'
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

  function setCreditCard(data: CreditCardPayment) {
    creditCard.value = data
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
    if (step <= currentStep.value) {
      currentStep.value = step
    }
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
        paymentMethod: paymentMethod.value,
        creditCard: paymentMethod.value === 'credit_card' ? creditCard.value ?? undefined : undefined
      }

      const order = await createOrder(request)
      lastOrder.value = order

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
    creditCard.value = null
    isSubmitting.value = false
    lastOrder.value = null
  }

  return {
    currentStep,
    shipping,
    paymentMethod,
    creditCard,
    isSubmitting,
    lastOrder,
    isShippingValid,
    isPaymentValid,
    canProceedToPayment,
    canSubmit,
    setShipping,
    setPaymentMethod,
    setCreditCard,
    nextStep,
    prevStep,
    goToStep,
    submitOrder,
    reset
  }
}
